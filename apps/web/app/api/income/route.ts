import {createPublicClient,http,isAddress} from "viem";
import {publicConfig} from "@/lib/server-config";
import {meterMendAbi} from "@/lib/abi";
export const dynamic="force-dynamic";
export async function GET(request:Request){const address=new URL(request.url).searchParams.get("address");if(!address||!isAddress(address))return Response.json({error:"A valid mapped address is required."},{status:400});const config=await publicConfig();if(!config.meterMend)return Response.json({error:"Contract deployment is pending."},{status:503});try{const client=createPublicClient({transport:http(config.evmRpcUrl,{timeout:10000,retryCount:1})});if(await client.getChainId()!==config.chainId)throw new Error("Wrong network");const income=await client.readContract({abi:meterMendAbi,address:config.meterMend,functionName:"operatorIncome",args:[address]});return Response.json({income:income.toString()});}catch{return Response.json({error:"Rental income could not be read from Portaldot."},{status:502});}}
