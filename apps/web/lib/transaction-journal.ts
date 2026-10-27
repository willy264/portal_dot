/** Public transaction evidence only. No wallet credentials or signed transaction bytes. */
export function retainTransaction(record:{txHash:string;action:string;account:string;status:string;block?:unknown;blockHash?:string;extrinsicIndex?:number;events?:unknown}){
 try{const key="metermend-transaction-evidence";const parsed:unknown=JSON.parse(localStorage.getItem(key)??"[]");const previous=Array.isArray(parsed)?parsed.filter(item=>item&&typeof item==="object"&&item.txHash!==record.txHash):[];localStorage.setItem(key,JSON.stringify([...previous,{...record,observedAt:new Date().toISOString()}].slice(-50),(_key,value:unknown)=>typeof value==="bigint"?value.toString():value));return true;}catch{return false;}
}
