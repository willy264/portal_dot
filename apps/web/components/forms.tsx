"use client";
import {useState,type ReactNode} from "react";
import {isAddress} from "viem";
import {ArrowRight} from "lucide-react";
import {errorMessage} from "@/lib/format";
import {useApp} from "./providers";
import type {Hex} from "@/lib/types";
export function Form({children,onSubmit,submit="Save to ledger",disabled=false}:{children:ReactNode;onSubmit:(form:FormData)=>Promise<unknown>;submit?:string;disabled?:boolean}){const{busy}=useApp();const[error,setError]=useState<string|null>(null);return <form onSubmit={async event=>{event.preventDefault();setError(null);const data=new FormData(event.currentTarget);try{await onSubmit(data);}catch(e){setError(errorMessage(e));}}}>{children}{error&&<p role="alert" className="field-error">{error}</p>}<button className="button primary" disabled={disabled||!!busy} type="submit">{submit}<ArrowRight size={16}/></button></form>;}
export function Field({label,name,placeholder,type="text",value,required=true,min,max,step,help}:{label:string;name:string;placeholder?:string;type?:string;value?:string|number;required?:boolean;min?:string|number;max?:string|number;step?:string|number;help?:string}){return <label className="field">{label}<input name={name} type={type} defaultValue={value} placeholder={placeholder} required={required} min={min} max={max} step={step}/>{help&&<span className="small muted">{help}</span>}</label>;}
export function text(form:FormData,name:string){return String(form.get(name)??"").trim();}
export function accountAddress(value:string):Hex{if(!isAddress(value)||/^0x0{40}$/i.test(value))throw new Error("Enter a valid nonzero runtime-mapped contract address (0x…).");return value as Hex;}
