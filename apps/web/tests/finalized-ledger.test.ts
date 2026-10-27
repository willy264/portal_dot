import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
const fake=vi.hoisted(()=>({chain:{verifyNetwork:vi.fn(),getFinalizedHead:vi.fn(),readContract:vi.fn()},adapter:vi.fn(),config:vi.fn()}));
vi.mock("../lib/wallet-chain",()=>({chainAdapter:fake.adapter}));
vi.mock("../lib/server-config",()=>({publicConfig:fake.config}));
import {readLedger} from "../lib/ledger-server";
import {GET as income} from "../app/api/income/route";
const address=`0x${"1".repeat(40)}` as const;const arbiter=`0x${"2".repeat(40)}` as const;const hash=`0x${"a".repeat(64)}` as const;
const snapshot={number:500,hash,timestamp:1700000000n};
beforeEach(()=>{
 vi.clearAllMocks();fake.adapter.mockResolvedValue(fake.chain);fake.chain.verifyNetwork.mockResolvedValue(undefined);fake.chain.getFinalizedHead.mockResolvedValue(snapshot);
 fake.config.mockResolvedValue({chainId:420420777,network:"Portaldot V3 testnet",meterMend:address,cronpot:arbiter,wssUrl:"wss://test.invalid",evmRpcUrl:"https://unreachable.invalid",explorer:"https://node-console.portaldot.dev",cronpotMode:"keeper",cronTip:null,nativeDecimals:14,evmDecimals:18,unitsVerified:true,storageConfigured:false,nativeEvidence:null,appUrl:null,deploymentBlock:"499"});
 fake.chain.readContract.mockImplementation(async(_abi,_address,name)=>{switch(name){case"nextItemId":case"nextRentalId":case"nextRepairId":return 2n;case"cronTip":return 777n;case"items":return[address,arbiter,100n,200n,2000,86400,true,false,20n,JSON.stringify({name:"Test camera"})];case"rentals":return[1n,arbiter,200n,1699999900n,1700000100n,3,8n];case"disputes":return[30n,hash,false,false,false,false];case"repairs":return[1n,arbiter,10n,hash,false,false];case"operatorIncome":return 80n;default:throw new Error("Unexpected view");}});
 vi.stubEnv("CHAIN_INDEXER_URL","https://history.invalid");vi.stubGlobal("fetch",vi.fn(async()=>{throw new Error("HTTP service is down");}));
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe("finalized workshop reads",()=>{
 it("uses the shared native-capable reader and pins every tuple to one finalized block",async()=>{const ledger=await readLedger();expect(ledger.state).toBe("ready");expect(ledger.block).toBe("500");expect(ledger.blockTimestamp).toBe(1700000000);expect(ledger.items[0]).toMatchObject({name:"Test camera",reserve:"20"});expect(ledger.rentals[0]?.dispute?.amount).toBe("30");expect(fake.chain.getFinalizedHead).toHaveBeenCalledTimes(1);expect(fake.chain.readContract.mock.calls.every(call=>call[4]?.at===snapshot)).toBe(true);expect(ledger.historyStatus).toContain("HTTP service is down");expect(ledger.automaticRefundCount).toBeNull();});
 it("coalesces overlapping polls rather than multiplying snapshot calls",async()=>{const[a,b]=await Promise.all([readLedger(),readLedger()]);expect(a).toBe(b);expect(fake.chain.getFinalizedHead).toHaveBeenCalledTimes(1);});
 it("returns an explicit unavailable state on failure and permits a fresh read afterward",async()=>{fake.chain.readContract.mockRejectedValueOnce(new Error("Both read paths unavailable"));const failed=await readLedger();expect(failed.state).toBe("error");expect(failed.items).toEqual([]);expect((await readLedger()).state).toBe("ready");});
 it("reads withdrawable income through the same finalized fallback path",async()=>{const response=await income(new Request(`http://localhost/api/income?address=${address}`));expect(response.status).toBe(200);expect(await response.json()).toEqual({income:"80",block:500,blockHash:hash});expect(fake.chain.readContract.mock.calls[0]?.[4]).toEqual({at:snapshot});});
});
