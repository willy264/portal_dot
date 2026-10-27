import { config as loadEnv } from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { encodeFunctionData, type Address } from 'viem';
import { configureChain, configureNativeScheduler, disconnectChain, getApi, ensureMapped, readContract, reviveCall, scheduleCronpot, verifyNetwork, type ChainSigner } from '@metermend/chain';
import { signerFromSeed } from '@metermend/chain/node';
import { cronpotAbi, meterMendAbi } from '@metermend/chain/abi';
import { Store, Scanner, json } from '@metermend/service-core';
import { JobEngine } from './engine.js';
import { SubstrateSource } from './source.js';
import { evidenceRoutes } from './evidence.js';

const root=fileURLToPath(new URL('../../../',import.meta.url));
loadEnv({path:root+'.env',quiet:true});
configureChain({wssUrl:process.env.WSS_URL??'wss://test-node-v3.portaldot.dev',evmRpcUrl:process.env.EVM_RPC_URL??'https://test-evm-rpc-v3.portaldot.dev'});
const store=new Store(process.env.DB_PATH??root+'data/cronpot.sqlite');
let manifest:any=null;
try{manifest=JSON.parse(await readFile(root+'deployments/portaldot-v3.json','utf8'));}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
const cronpot=(process.env.CRONPOT_ADDRESS||manifest?.contracts?.Cronpot?.address) as Address|undefined;
const meterMend=(process.env.METERMEND_ADDRESS||manifest?.contracts?.MeterMend?.address) as Address|undefined;
const startBlock=Number(process.env.START_BLOCK??Math.min(manifest?.contracts?.Cronpot?.block??NaN,manifest?.contracts?.MeterMend?.block??NaN));
const requestedMode=process.env.MODE??manifest?.cronpotMode??'keeper';
const mode: 'native'|'keeper'=requestedMode==='native'&&manifest?.nativeScheduler?.verified===true?'native':'keeper';
let signer:ChainSigner|null=null;let scanner:Scanner|null=null;let engine:JobEngine|null=null;
let lastError:string|null=null;let signerError:string|null=null;let busy=false;let stopped=false;

async function initialize(){
  if(!cronpot||!meterMend||!/^0x[0-9a-fA-F]{40}$/.test(cronpot)||!/^0x[0-9a-fA-F]{40}$/.test(meterMend)||!Number.isSafeInteger(startBlock)||startBlock<0)throw new Error('Verified contract addresses and deployment/start block are required');
  await verifyNetwork();
  if(mode==='native'){
    const capability=manifest.nativeScheduler;
    configureNativeScheduler({...capability,p5Verified:true,weight:{ref_time:BigInt(capability.weight.ref_time),proof_size:BigInt(capability.weight.proof_size)},storageDepositLimit:BigInt(capability.storageDepositLimit)});
  }
  scanner=new Scanner(store,new SubstrateSource([{address:cronpot,abi:cronpotAbi},{address:meterMend,abi:meterMendAbi}]),startBlock);
  const blockTimeMs=Number(await getApi().constants.Babe.ExpectedBlockTime());
  engine=new JobEngine(store,{
    readJob:async id=>{const result=await readContract<readonly [Address,Address,bigint,number,bigint]>(cronpotAbi,cronpot,'jobs',[id]);return {status:result[3],executeAfter:result[2]};},
    execute:async(id,onStatus)=>{if(!signer)throw new Error('Relayer signer is not configured');return await reviveCall({signer,to:cronpot,data:encodeFunctionData({abi:cronpotAbi,functionName:'execute',args:[id]}),onStatus});},
    schedule:async(job,delayBlocks,onStatus)=>{if(!signer)throw new Error('Relayer signer is not configured');return await scheduleCronpot({signer,address:cronpot,jobId:BigInt(job.id),delayBlocks,onStatus});}
  },mode,meterMend,blockTimeMs);
}

async function tick(){
  if(busy||stopped)return;busy=true;
  try{
    if(!scanner||!engine)await initialize();
    if(!signer&&process.env.RELAYER_SEED){
      try{const candidate=signerFromSeed(process.env.RELAYER_SEED);await ensureMapped(candidate);signer=candidate;signerError=null;}
      catch(error){signerError=error instanceof Error?error.message:'Relayer funding/mapping unavailable';}
    }
    await scanner!.tick();
    const cursor=store.cursor('chain');const from=(store.cursor('jobs')?.block??startBlock-1)+1;
    if(cursor&&cursor.block>=from)store.transaction(()=>{engine!.ingest(store.eventRange(from,cursor.block));store.setCursor('jobs',cursor.block,cursor.hash);});
    if(signer&&scanner!.lastHead)await engine!.tick(scanner!.lastHead.timestamp);
    lastError=null;
  }catch(error){lastError=error instanceof Error?error.message:String(error);console.error(lastError);}
  finally{busy=false;}
}
const app=new Hono();
app.get('/health',c=>c.json({network:'portaldot-v3-testnet',configured:!!scanner,mode,requestedMode,signer:signer?.address??null,signerError,cursor:store.cursor('chain')??null,gap:scanner?.gap??null,error:lastError}));
app.get('/jobs',c=>c.body(json({mode,jobs:store.jobs(),observations:store.observations(50)}),200,{'Content-Type':'application/json'}));
app.get('/events',async c=>{
  const cursor=store.cursor('chain')??null;
  const supplied=c.req.query('fromBlock');
  const from=supplied===undefined?startBlock:Math.max(startBlock,Number(supplied));
  if(!Number.isSafeInteger(from)||from<0)return c.json({error:'Indexer deployment is not configured or fromBlock is invalid'},503);
  const through=cursor?(supplied===undefined?cursor.block:Math.min(cursor.block,from+49)):from-1;
  const events=through>=from?store.eventRange(from,through):[];
  const throughHash=through===cursor?.block?cursor.hash:through>=from?(await getApi().query.System.BlockHash.getValue(through)):'';
  return c.body(json({events,cursor,gap:scanner?.gap??lastError,startBlock,throughBlock:through,throughHash,automaticRefundCount:engine?.automaticRefundCount()??null}),200,{'Content-Type':'application/json'});
});
app.route('/api/evidence',evidenceRoutes(process.env.EVIDENCE_DIR??root+'data/evidence',process.env.EVIDENCE_BACKEND_TOKEN));
const server=serve({fetch:app.fetch,port:Number(process.env.PORT??'8787'),hostname:'0.0.0.0'});
const timer=setInterval(()=>void tick(),10_000);void tick();
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{
  stopped=true;clearInterval(timer);server.close();const drain=setInterval(()=>{if(!busy){clearInterval(drain);store.close();disconnectChain();process.exit(0);}},100);
});
