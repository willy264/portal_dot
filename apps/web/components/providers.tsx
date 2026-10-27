"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from "react";
import type {InjectedExtension,InjectedPolkadotAccount} from "polkadot-api/pjs-signer";
import {encodeFunctionData} from "viem";
import {meterMendAbi} from "@/lib/abi";
import {request} from "@/lib/request";
import {errorMessage} from "@/lib/format";
import {chainAdapter,chainSigner} from "@/lib/wallet-chain";
import {retainTransaction} from "@/lib/transaction-journal";
import type {Hex,Ledger,TxReceipt,WalletIdentity} from "@/lib/types";

type ActionArgs={registerItem:[Hex,bigint,bigint,number,number,string];updateItem:[bigint,bigint,bigint,boolean];rent:[bigint];markReturned:[bigint,Hex];finalizeRefund:[bigint];openDispute:[bigint,bigint,Hex];voteDispute:[bigint,boolean];proposeRepair:[bigint,Hex,bigint,Hex];decideRepair:[bigint,boolean];transferItem:[bigint,Hex];withdrawIncome:[]};
type AppContextValue={ledger:Ledger|null;loading:boolean;loadError:string|null;refresh:()=>Promise<void>;wallet:WalletIdentity|null;accounts:InjectedPolkadotAccount[];extensions:string[];discoverWallets:()=>Promise<void>;connect:(name:string)=>Promise<void>;selectAccount:(address:string)=>Promise<void>;disconnect:()=>void;activate:()=>Promise<void>;execute:<N extends keyof ActionArgs>(name:N,args:ActionArgs[N],value?:bigint)=>Promise<TxReceipt>;busy:string|null;notice:string|null;failure:string|null;clearNotice:()=>void;lastReceipt:TxReceipt|null};
const AppContext=createContext<AppContextValue|null>(null);
export function Providers({children}:{children:ReactNode}) {
  const[ledger,setLedger]=useState<Ledger|null>(null);const[loading,setLoading]=useState(true);const[loadError,setLoadError]=useState<string|null>(null);
  const[wallet,setWallet]=useState<WalletIdentity|null>(null);const[accounts,setAccounts]=useState<InjectedPolkadotAccount[]>([]);const[extensions,setExtensions]=useState<string[]>([]);
  const[busy,setBusy]=useState<string|null>(null);const[notice,setNotice]=useState<string|null>(null);const[failure,setFailure]=useState<string|null>(null);const[lastReceipt,setLastReceipt]=useState<TxReceipt|null>(null);
  const transactionLocked=useRef(false);
  const currentAccount=useRef<InjectedPolkadotAccount|null>(null);const connected=useRef<InjectedExtension|null>(null);const unsub=useRef<(()=>void)|null>(null);const requestController=useRef<AbortController|null>(null);
  const refresh=useCallback(async()=>{requestController.current?.abort();const controller=new AbortController();requestController.current=controller;try{const data=await request<Ledger>("/api/ledger",{signal:controller.signal});setLedger(data);setLoadError(null);}catch(error){if(!controller.signal.aborted)setLoadError(errorMessage(error));}finally{if(!controller.signal.aborted)setLoading(false);}},[]);
  useEffect(()=>{void refresh();const timer=setInterval(()=>{if(document.visibilityState==="visible")void refresh();},15000);return()=>{clearInterval(timer);requestController.current?.abort();};},[refresh]);
  const loadAccount=useCallback(async(account:InjectedPolkadotAccount)=>{currentAccount.current=account;setWallet({address:account.address,name:account.name,h160:null,mapped:null,autoMap:null,nativeBalance:null});if(!ledger)return;try{const chain=await chainAdapter(ledger.config);const state=await chain.getAccountState(account.address);if(currentAccount.current?.address===account.address)setWallet({address:account.address,name:account.name,h160:state.h160,mapped:state.mapped,autoMap:state.autoMap,nativeBalance:state.nativeBalance.toString()});}catch(error){setFailure(`Account details unavailable: ${errorMessage(error)}`);}},[ledger]);
  const disconnect=useCallback(()=>{unsub.current?.();unsub.current=null;connected.current?.disconnect();connected.current=null;currentAccount.current=null;setAccounts([]);setWallet(null);},[]);
  useEffect(()=>()=>{unsub.current?.();connected.current?.disconnect();},[]);
  async function discoverWallets(){setFailure(null);const{getInjectedExtensions}=await import("polkadot-api/pjs-signer");const names=getInjectedExtensions();setExtensions(names);if(!names.length)setFailure("No compatible wallet was found. Open this page in a SubWallet or Talisman browser, or install a Polkadot.js-compatible extension.");}
  async function connect(name:string){setBusy("Connecting wallet");setFailure(null);try{const{connectInjectedExtension}=await import("polkadot-api/pjs-signer");const extension=await connectInjectedExtension(name,"MeterMend");disconnect();connected.current=extension;const list=extension.getAccounts();setAccounts(list);unsub.current=extension.subscribe(next=>{setAccounts(next);if(currentAccount.current&&!next.some(a=>a.address===currentAccount.current?.address)){currentAccount.current=null;setWallet(null);}});if(list[0])await loadAccount(list[0]);else setFailure("The wallet did not share an account. Allow an account in the wallet and reconnect.");}catch(error){setFailure(errorMessage(error));}finally{setBusy(null);}}
  async function selectAccount(address:string){const account=accounts.find(a=>a.address===address);if(account)await loadAccount(account);}
  async function activate(){if(!currentAccount.current||!ledger)throw new Error("Connect a wallet first.");setBusy("Confirm account activation in your wallet");setFailure(null);try{const chain=await chainAdapter(ledger.config);await chain.ensureMapped(chainSigner(currentAccount.current));await loadAccount(currentAccount.current);setNotice("Account activation confirmed on Portaldot.");}catch(error){setFailure(errorMessage(error));}finally{setBusy(null);}}
  async function execute<N extends keyof ActionArgs>(name:N,args:ActionArgs[N],value=0n):Promise<TxReceipt>{
    if(busy||transactionLocked.current)throw new Error("Wait for the current transaction to finish.");
    if(!currentAccount.current||!wallet)throw new Error("Connect a wallet before continuing.");
    if(!ledger||ledger.state!=="ready"||!ledger.config.meterMend)throw new Error("A verified deployment is not available.");
    if(!ledger.config.unitsVerified)throw new Error("Funded unit verification is pending. Transactions remain disabled.");
    if(wallet.mapped!==true)throw new Error(wallet.autoMap?"Fund this native account and wait for activation before using the workshop.":"Activate this account before using the workshop.");
    const submittingAccount=currentAccount.current;transactionLocked.current=true;setFailure(null);setNotice(null);setBusy("Check the transaction in your wallet");
    try{const chain=await chainAdapter(ledger.config);const data=encodeFunctionData({abi:meterMendAbi,functionName:name,args} as Parameters<typeof encodeFunctionData>[0]);const receipt=await chain.reviveCall({signer:chainSigner(submittingAccount),to:ledger.config.meterMend,data,value,abi:meterMendAbi,onStatus:event=>{retainTransaction({txHash:event.txHash,action:name,account:submittingAccount.address,status:event.type});if(event.type==="finalized")setBusy("Transaction finalized; refreshing the ledger");else setBusy("Transaction submitted; waiting for finality");}});retainTransaction({txHash:receipt.txHash,action:name,account:submittingAccount.address,status:"finalized",block:receipt.block,blockHash:receipt.blockHash,extrinsicIndex:receipt.extrinsicIndex,events:receipt.events});setLastReceipt(receipt);setNotice(`Transaction finalized: ${receipt.txHash}`);await refresh();if(currentAccount.current?.address===submittingAccount.address)await loadAccount(submittingAccount);return receipt;}catch(error){const message=errorMessage(error);setFailure(`${message} If you already approved the transaction, check its status before trying again.`);throw error;}finally{transactionLocked.current=false;setBusy(null);}
  }
  return <AppContext.Provider value={{ledger,loading,loadError,refresh,wallet,accounts,extensions,discoverWallets,connect,selectAccount,disconnect,activate,execute,busy,notice,failure,clearNotice:()=>{setNotice(null);setFailure(null);},lastReceipt}}>{children}</AppContext.Provider>;
}
export function useApp(){const context=useContext(AppContext);if(!context)throw new Error("MeterMend provider is missing.");return context;}
