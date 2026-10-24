import { writeFileSync } from 'node:fs';

const endpoint = 'wss://mainnet.portaldot.io';
const methods = ['system_chain','system_name','system_version','system_properties','state_getRuntimeVersion','rpc_methods','chain_getFinalizedHead','eth_chainId','eth_blockNumber'];
const output = {observedAt: new Date().toISOString(),endpoint,queries:{}};
await new Promise(resolve => {
  const ws = new WebSocket(endpoint);
  let done = false;
  const finish = () => { if(done)return; done=true; clearTimeout(timer); ws.close(); resolve(); };
  const timer = setTimeout(() => {output.timeout=true; finish();},20000);
  ws.addEventListener('open',() => methods.forEach((method,id) => ws.send(JSON.stringify({jsonrpc:'2.0',id,method,params:[]}))));
  ws.addEventListener('message',ev => {
    const result=JSON.parse(ev.data);
    output.queries[methods[result.id]] = result.error ? {error:result.error} : result.result;
    if(Object.keys(output.queries).length===methods.length)finish();
  });
  ws.addEventListener('error',ev => {output.connectionError=String(ev.message||'WebSocket connection failed'); finish();});
});
writeFileSync('research/runtime-probe.json',JSON.stringify(output,null,2));
console.log(JSON.stringify(output,null,2));
