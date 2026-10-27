import {isAddress} from "viem";
import {publicConfig} from "@/lib/server-config";
import {chainAdapter} from "@/lib/wallet-chain";
import {snapshotReader} from "@/lib/snapshot-reader";
export const dynamic="force-dynamic";
export async function GET(request:Request){const address=new URL(request.url).searchParams.get("address");if(!address||!isAddress(address))return Response.json({error:"A valid mapped address is required."},{status:400});const config=await publicConfig();if(!config.meterMend)return Response.json({error:"Contract deployment is pending."},{status:503});try{const chain=await chainAdapter(config,8000);await chain.verifyNetwork();const block=await chain.getFinalizedHead();const income=await snapshotReader(chain,config.meterMend,block)("operatorIncome",[address]);return Response.json({income:income.toString(),block:block.number,blockHash:block.hash});}catch{return Response.json({error:"Rental income could not be read from finalized Portaldot state."},{status:502});}}
