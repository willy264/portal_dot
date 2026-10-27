import { getApi, getBlock, getClient, getFinalizedHead, GENESIS_HASH } from '@metermend/chain';
import { Blake2256 } from '@polkadot-api/substrate-bindings';
import { decodeEventLog, hexToBytes, toHex, type Abi, type Address, type Hex } from 'viem';
import type { BlockSource, ChainEvent, FinalizedBlock } from '@metermend/service-core';
import type { SubmissionReconciliation } from './engine.js';

/** Native events preserve scheduler initialization events which have no signed extrinsic. */
export class SubstrateSource implements BlockSource {
  constructor(readonly contracts: Array<{ address: Address; abi: Abi }>) {}
  head = getFinalizedHead;
  /** Search at most 25 finalized blocks. A missing/pruned block never proves non-inclusion. */
  async reconcile(txHash:string,fromBlock:number,throughBlock:number,operation:'schedule'|'execute'):Promise<SubmissionReconciliation>{
    let searchedThrough=fromBlock-1;
    try{
      if(!/^0x[0-9a-f]{64}$/i.test(txHash)||!Number.isSafeInteger(fromBlock)||fromBlock<0||!Number.isSafeInteger(throughBlock)||throughBlock<fromBlock||throughBlock-fromBlock>=25)throw new Error('Invalid bounded reconciliation request');
      const head=await this.head();
      if(throughBlock>head.number)throw new Error('Reconciliation requires finalized blocks');
      for(let number=fromBlock;number<=throughBlock;number++){
        const hash=await getClient()._request<Hex|null>('chain_getBlockHash',[number]);
        if(!hash)throw new Error(`Finalized block ${number} is unavailable`);
        const body=await getClient()._request<{block:{extrinsics:Hex[]}}|null>('chain_getBlock',[hash]);
        if(!body)throw new Error(`Finalized block body ${number} is unavailable`);
        const index=body.block.extrinsics.findIndex(tx=>toHex(Blake2256(hexToBytes(tx))).toLowerCase()===txHash.toLowerCase());
        if(index<0){searchedThrough=number;continue;}
        const records=await getApi().query.System.Events.getValue({at:hash,signal:AbortSignal.timeout(30_000)});
        const events=records.filter(record=>record.phase.type==='ApplyExtrinsic'&&record.phase.value===index).map(record=>record.event);
        const receipt={txHash,block:number,blockHash:hash,extrinsicIndex:index,events};
        const failure=events.find(event=>event.type==='System'&&event.value.type==='ExtrinsicFailed');
        if(failure)return {status:'failed',receipt,reason:`Finalized extrinsic failed: ${JSON.stringify(failure.value.value,(_key,value)=>typeof value==='bigint'?value.toString():value)}`};
        if(!events.some(event=>event.type==='System'&&event.value.type==='ExtrinsicSuccess'))throw new Error('Transaction found without finalized dispatch outcome');
        if(operation==='schedule'){
          const scheduled=events.find(event=>event.type==='Scheduler'&&event.value.type==='Scheduled');
          if(!scheduled)throw new Error('Scheduling transaction finalized without Scheduler.Scheduled evidence');
          return {status:'confirmed',receipt:{...receipt,task:scheduled.value.value}};
        }
        return {status:'confirmed',receipt};
      }
      return {status:'pending',searchedThrough,reason:'No finalized inclusion in the checked range; awaiting further finalized evidence without resubmitting'};
    }catch(error){return {status:'unknown',searchedThrough,reason:error instanceof Error?error.message:String(error)};}
  }
  async block(number: number): Promise<FinalizedBlock> {
    const block = await getBlock(number);
    const [records, body] = await Promise.all([
      getApi().query.System.Events.getValue({ at: block.hash, signal: AbortSignal.timeout(30_000) }),
      getClient()._request<{ block: { extrinsics: Hex[] } } | null>('chain_getBlock', [block.hash])
    ]);
    if (!body) throw new Error(`Block body ${number} is pruned or unavailable`);
    const events: ChainEvent[] = [];
    for (let index = 0; index < records.length; index++) {
      const record = records[index]!;
      const event = record.event;
      const extrinsic = record.phase.type === 'ApplyExtrinsic' ? body.block.extrinsics[record.phase.value] : undefined;
      const txHash = extrinsic ? toHex(Blake2256(hexToBytes(extrinsic))) : null;
      const common = { id: `${GENESIS_HASH}:${block.hash}:${index}`, network: 'portaldot-v3-testnet', txHash, block: number, blockHash: block.hash, eventIndex: index, observedAt: new Date().toISOString(), source: 'substrate' as const };
      if (event.type === 'Revive' && event.value.type === 'ContractEmitted') {
        const emitted = event.value.value;
        const contract = this.contracts.find(c => c.address.toLowerCase() === emitted.contract.toLowerCase());
        if (!contract) continue;
        const decoded = decodeEventLog({ abi: contract.abi, topics: emitted.topics as [Hex, ...Hex[]], data: toHex(emitted.data), strict: true });
        if (!decoded.eventName || !decoded.args || Array.isArray(decoded.args)) throw new Error(`ABI did not decode named event fields at block ${number}:${index}`);
        events.push({ ...common, address: emitted.contract, eventName: decoded.eventName, args: decoded.args as unknown as Record<string, unknown> });
      } else if (event.type === 'Scheduler' && (event.value.type === 'Scheduled' || event.value.type === 'Dispatched')) {
        events.push({ ...common, address: 'Scheduler', eventName: `Scheduler.${event.value.type}`, args: event.value.value as unknown as Record<string, unknown> });
      }
    }
    return { ...block, events };
  }
}
