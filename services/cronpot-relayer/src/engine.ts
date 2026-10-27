import { decodeFunctionData, parseAbi } from 'viem';
import { Store, delayBlocks, keeperReady, type ChainEvent, type StoredJob } from '@metermend/service-core';

const refundAbi = parseAbi(['function finalizeRefund(uint256 rentalId)']);
const states = ['None', 'Scheduled', 'Executed', 'Cancelled', 'Failed'];
export interface ExecutionReceipt { txHash: string; block: number; events?: unknown[]; task?: unknown }
export type SubmissionReconciliation =
  | { status: 'confirmed'; receipt: ExecutionReceipt }
  | { status: 'failed'; receipt: ExecutionReceipt; reason: string }
  | { status: 'pending' | 'unknown'; searchedThrough: number; reason: string };
export interface ExecutionAdapter {
  readJob(id: bigint): Promise<{ status: number; executeAfter: bigint }>;
  schedule(job: StoredJob, blocks: number, onStatus: (event: unknown) => void): Promise<ExecutionReceipt>;
  execute(id: bigint, onStatus: (event: unknown) => void): Promise<ExecutionReceipt>;
  reconcile?(txHash: string, fromBlock: number, throughBlock: number, operation: 'schedule' | 'execute'): Promise<SubmissionReconciliation>;
}

interface PendingSubmission {
  jobId: string;
  operation: 'schedule' | 'execute';
  txHash?: string;
  submittedAfterBlock?: number;
  searchedThrough?: number;
  type?: string;
  block?: unknown;
  ok?: boolean;
}

/** The funded relayer only subsidizes this deployment's refund jobs. Cronpot itself remains generic. */
export class JobEngine {
  constructor(readonly store: Store, readonly adapter: ExecutionAdapter, readonly mode: 'native' | 'keeper', readonly meterMend: string, readonly blockTimeMs: number) {}

  ingest(events: ChainEvent[]): void {
    for (const event of events) {
      const id = String(event.args.jobId ?? '');
      if (event.eventName === 'JobScheduled') {
        if (this.store.job(id)) continue;
        let rentalId: string | undefined;
        try {
          const decoded = decodeFunctionData({ abi: refundAbi, data: String(event.args.data) as `0x${string}` });
          rentalId = decoded.args[0].toString();
        } catch { /* Other Cronpot use cases are recorded but not subsidized. */ }
        const eligible = String(event.args.owner).toLowerCase() === this.meterMend.toLowerCase() && String(event.args.target).toLowerCase() === this.meterMend.toLowerCase() && rentalId !== undefined;
        this.store.putJob({ id, owner: String(event.args.owner), target: String(event.args.target), executeAfter: String(event.args.executeAfter), data: String(event.args.data), rentalId, state: 'Scheduled', scheduling: eligible ? 'pending' : 'outside-policy', attempts: 0, evidence: { scheduled: event } });
      } else if (event.eventName === 'JobCancelled' || event.eventName === 'JobExecuted') {
        const job = this.store.job(id);
        if (!job) continue;
        job.state = event.eventName === 'JobCancelled' ? 'Cancelled' : event.args.success === true ? 'Executed' : 'Failed';
        job.evidence = { ...(job.evidence as object ?? {}), completion: event };
        this.store.putJob(job);
      }
    }
  }

  async tick(chainTime: bigint, finalizedHeadNumber?: number): Promise<void> {
    for (const job of this.store.jobs()) {
      if (job.state !== 'Scheduled' || job.scheduling === 'outside-policy') continue;
      const current = await this.adapter.readJob(BigInt(job.id));
      job.state = states[current.status] ?? 'Unknown';
      if (job.state !== 'Scheduled') { this.store.putJob(job); continue; }
      // Reconcile finalized evidence before leaving an uncertain submission state.
      if (['execution-unknown','executing','scheduling','native-unknown'].includes(job.scheduling)) {
        await this.reconcilePending(job,chainTime,finalizedHeadNumber);
        continue;
      }
      if(job.scheduling==='manual-review')continue;
      if (job.nextAttemptAt && chainTime < BigInt(job.nextAttemptAt)) continue;
      if (job.attempts >= 5) { job.scheduling='manual-review'; this.store.putJob(job); continue; }
      const due = keeperReady(current.executeAfter, chainTime);
      const native = this.mode === 'native' && job.scheduling === 'pending' && !due;
      if (!native && !due) continue;
      if (native && job.attempts >= 3) { job.scheduling = 'keeper-fallback'; this.store.putJob(job); continue; }
      job.attempts++;
      job.scheduling = native ? 'scheduling' : 'executing';
      const pending:PendingSubmission={jobId:job.id,operation:native?'schedule':'execute',submittedAfterBlock:finalizedHeadNumber};
      job.evidence={...(job.evidence as object??{}),pendingSubmission:pending};
      this.store.putJob(job);
      let submittedHash: string | undefined;
      const onStatus = (event: unknown) => {
        const record = event as { type?: string; txHash?: string; block?: unknown; ok?: boolean };
        submittedHash = record.txHash ?? submittedHash;
        const journal:PendingSubmission = { ...pending, txHash:submittedHash, type:record.type, block:record.block, ok:record.ok };
        job.evidence = { ...(job.evidence as object ?? {}), pendingSubmission:journal };
        this.store.transaction(()=>{this.store.putJob(job);this.store.observation('transaction-status',journal);});
      };
      try {
        const receipt = native
          ? await this.adapter.schedule(job, delayBlocks(current.executeAfter, chainTime, this.blockTimeMs),onStatus)
          : await this.adapter.execute(BigInt(job.id),onStatus);
        job.scheduling = native ? 'native-scheduled' : 'keeper-executed';
        job.lastError = undefined;
        if (native) { job.scheduleTxHash = receipt.txHash; job.task = receipt.task; }
        else job.state = 'FinalizedAwaitingEvents';
        job.evidence = { ...(job.evidence as object ?? {}), [native ? 'nativeSubmission' : 'keeperSubmission']: receipt };
        this.store.observation(native ? 'scheduler-submitted' : 'keeper-submitted', { jobId: job.id, ...receipt });
      } catch (error) {
        const flag = error && typeof error === 'object' && 'ambiguous' in error ? error.ambiguous : undefined;
        const unknown = flag === true || (submittedHash !== undefined && flag !== false);
        job.lastError = error instanceof Error ? error.message : String(error);
        job.scheduling = unknown ? native ? 'native-unknown' : 'execution-unknown' : native ? 'keeper-fallback' : 'pending';
        const txHash = error && typeof error==='object' && 'txHash' in error ? error.txHash : submittedHash;
        job.nextAttemptAt=(chainTime+BigInt(Math.min(300,10*2**Math.min(job.attempts,5)))).toString();
        job.evidence={...(job.evidence as object??{}),lastError:{ambiguous:unknown,txHash,message:job.lastError}};
        this.store.observation('execution-error', { jobId: job.id, ambiguous: unknown, txHash, message: job.lastError });
      }
      this.store.putJob(job);
    }
  }

  private async reconcilePending(job:StoredJob,chainTime:bigint,finalizedHeadNumber?:number):Promise<void>{
    const evidence=job.evidence as {pendingSubmission?:PendingSubmission;lastError?:{txHash?:string}}|undefined;
    const pending=evidence?.pendingSubmission;
    const hash=pending?.txHash??evidence?.lastError?.txHash;
    if(!this.adapter.reconcile||!hash||!pending||pending.submittedAfterBlock===undefined||finalizedHeadNumber===undefined){
      job.lastError='Submission remains uncertain; a recorded hash, start block and finalized reconciliation source are required';
      this.store.putJob(job);return;
    }
    const from=(pending.searchedThrough??pending.submittedAfterBlock)+1;
    if(from>finalizedHeadNumber)return;
    const through=Math.min(finalizedHeadNumber,from+24);
    let result:SubmissionReconciliation;
    try{result=await this.adapter.reconcile(hash,from,through,pending.operation);}
    catch(error){result={status:'unknown',searchedThrough:from-1,reason:error instanceof Error?error.message:String(error)};}
    if(!('receipt' in result)){
      if(!Number.isSafeInteger(result.searchedThrough)||result.searchedThrough<from-1||result.searchedThrough>through)throw new Error('Invalid reconciliation cursor');
      pending.searchedThrough=result.searchedThrough;
      job.lastError=result.reason;
      job.evidence={...(job.evidence as object??{}),pendingSubmission:pending};
      this.store.transaction(()=>{this.store.putJob(job);this.store.observation('submission-reconciliation-pending',{jobId:job.id,txHash:hash,from,through,...result});});
      return;
    }
    job.evidence={...(job.evidence as object??{}),reconciledSubmission:result.receipt};
    if(result.status==='failed'){
      job.scheduling=pending.operation==='schedule'?'keeper-fallback':'pending';
      job.lastError=result.reason;
      job.nextAttemptAt=(chainTime+BigInt(Math.min(300,10*2**Math.min(job.attempts,5)))).toString();
    }else{
      job.lastError=undefined;
      if(pending.operation==='schedule'){
        job.scheduling='native-scheduled';job.scheduleTxHash=result.receipt.txHash;job.task=result.receipt.task;
      }else{
        job.scheduling='keeper-executed';job.state='FinalizedAwaitingEvents';
      }
    }
    this.store.transaction(()=>{this.store.putJob(job);this.store.observation('submission-reconciled',{jobId:job.id,operation:pending.operation,...result});});
  }

  automaticRefundCount(): number {
    return this.store.jobs().filter(job => {
      if (!job.rentalId || job.state !== 'Executed' || job.target.toLowerCase() !== this.meterMend.toLowerCase()) return false;
      const completion = (job.evidence as { completion?: ChainEvent } | undefined)?.completion;
      if (!completion || completion.args.success !== true) return false;
      return this.store.eventRange(completion.block, completion.block).some(event => event.eventName === 'DepositRefunded' && event.address.toLowerCase() === this.meterMend.toLowerCase() && String(event.args.rentalId) === job.rentalId && event.txHash===completion.txHash && event.eventIndex<completion.eventIndex);
    }).length;
  }
}
