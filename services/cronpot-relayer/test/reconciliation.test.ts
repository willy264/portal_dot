import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { encodeFunctionData, parseAbi } from 'viem';
import { Store, type ChainEvent } from '@metermend/service-core';
import { JobEngine, type ExecutionAdapter } from '../src/engine.js';

const address='0x1111111111111111111111111111111111111111';
const txHash=`0x${'ab'.repeat(32)}`;
const scheduled:ChainEvent={id:'scheduled',network:'v3',address:'cronpot',eventName:'JobScheduled',
  args:{jobId:'1',owner:address,target:address,executeAfter:'100',data:encodeFunctionData({abi:parseAbi(['function finalizeRefund(uint256 rentalId)']),functionName:'finalizeRefund',args:[7n]})},
  txHash:'creation',block:9,blockHash:'hash9',eventIndex:1,observedAt:'',source:'substrate'};
const unknown=()=>Object.assign(new Error('connection dropped after broadcast'),{ambiguous:true,txHash});

it('reopens a persisted database, finds a finalized scheduling hash and avoids duplicate scheduling',async()=>{
  const directory=mkdtempSync(join(tmpdir(),'metermend-reconcile-'));
  let store=new Store(join(directory,'state.sqlite'));
  const schedule=vi.fn<ExecutionAdapter['schedule']>(async(_job,_blocks,onStatus)=>{onStatus({type:'created',txHash});throw unknown();});
  const execute=vi.fn<ExecutionAdapter['execute']>(async()=>({txHash:'execute',block:99}));
  const reconcile=vi.fn<NonNullable<ExecutionAdapter['reconcile']>>(async()=>({status:'confirmed',receipt:{txHash,block:12,task:{when:20,index:0}}}));
  const adapter:ExecutionAdapter={readJob:async()=>({status:1,executeAfter:100n}),schedule,execute,reconcile};
  try{
    const first=new JobEngine(store,adapter,'native',address,6000);first.ingest([scheduled]);await first.tick(90n,10);
    expect(store.job('1')?.evidence).toMatchObject({pendingSubmission:{txHash,submittedAfterBlock:10,operation:'schedule'}});
    store.close();store=new Store(join(directory,'state.sqlite'));
    await new JobEngine(store,adapter,'native',address,6000).tick(95n,15);
    expect(reconcile).toHaveBeenCalledWith(txHash,11,15,'schedule');
    expect(store.job('1')).toMatchObject({scheduling:'native-scheduled',scheduleTxHash:txHash,task:{when:20,index:0}});
    await new JobEngine(store,adapter,'native',address,6000).tick(99n,16);
    expect(schedule).toHaveBeenCalledTimes(1);expect(execute).not.toHaveBeenCalled();
  }finally{store.close();rmSync(directory,{recursive:true,force:true});}
});

it('retries an uncertain keeper call only after a proven finalized failure and backoff',async()=>{
  const store=new Store(':memory:');let calls=0;
  const adapter:ExecutionAdapter={readJob:async()=>({status:1,executeAfter:100n}),schedule:async()=>({txHash:'unused',block:1}),
    execute:async(_id,onStatus)=>{calls++;if(calls===1){onStatus({type:'broadcasted',txHash});throw unknown();}return {txHash:'retry',block:30};},
    reconcile:async()=>({status:'failed',receipt:{txHash,block:12},reason:'Finalized dispatch failed: OutOfGas'})};
  try{
    const engine=new JobEngine(store,adapter,'keeper',address,6000);engine.ingest([scheduled]);
    await engine.tick(131n,10);expect(calls).toBe(1);
    await engine.tick(132n,12);expect(calls).toBe(1);expect(store.job('1')?.scheduling).toBe('pending');
    await engine.tick(151n,15);expect(calls).toBe(1);
    await engine.tick(152n,16);expect(calls).toBe(2);
    expect(store.job('1')?.state).toBe('FinalizedAwaitingEvents');
  }finally{store.close();}
});

it('persists bounded search progress while an unresolved hash remains paused',async()=>{
  const store=new Store(':memory:');const ranges:number[][]=[];let schedules=0;let executions=0;
  const adapter:ExecutionAdapter={readJob:async()=>({status:1,executeAfter:100n}),
    schedule:async(_job,_blocks,onStatus)=>{schedules++;onStatus({type:'created',txHash});throw unknown();},
    execute:async()=>{executions++;return {txHash:'unexpected',block:1};},
    reconcile:async(_hash,from,through)=>{ranges.push([from,through]);return {status:'pending',searchedThrough:through,reason:'Not yet found'};}};
  try{
    const engine=new JobEngine(store,adapter,'native',address,6000);engine.ingest([scheduled]);await engine.tick(90n,10);
    await engine.tick(200n,100);
    await new JobEngine(store,adapter,'native',address,6000).tick(210n,100);
    expect(ranges).toEqual([[11,35],[36,60]]);
    expect(store.job('1')?.evidence).toMatchObject({pendingSubmission:{searchedThrough:60}});
    expect(store.job('1')?.scheduling).toBe('native-unknown');expect(schedules).toBe(1);expect(executions).toBe(0);
  }finally{store.close();}
});

it('does not advance over a pruned block or resend an unknown transaction',async()=>{
  const store=new Store(':memory:');const ranges:number[][]=[];let executions=0;
  const adapter:ExecutionAdapter={readJob:async()=>({status:1,executeAfter:100n}),schedule:async()=>({txHash:'unused',block:1}),
    execute:async(_id,onStatus)=>{executions++;onStatus({type:'created',txHash});throw unknown();},
    reconcile:async(_hash,from,through)=>{ranges.push([from,through]);return {status:'unknown',searchedThrough:from-1,reason:'Archive state pruned'};}};
  try{
    const engine=new JobEngine(store,adapter,'keeper',address,6000);engine.ingest([scheduled]);await engine.tick(131n,10);
    await engine.tick(132n,20);await engine.tick(140n,20);
    expect(ranges).toEqual([[11,20],[11,20]]);expect(executions).toBe(1);
    expect(store.job('1')?.scheduling).toBe('execution-unknown');
  }finally{store.close();}
});
