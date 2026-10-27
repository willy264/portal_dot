"use client";
import {useEffect,useState} from "react";
import {Check,ImagePlus,LoaderCircle,ShieldCheck} from "lucide-react";
import {hashBytes,MAX_EVIDENCE_BYTES,normalizeHash} from "@/lib/evidence";
import {request} from "@/lib/request";
import {errorMessage,shortAddress} from "@/lib/format";
import type {Hex} from "@/lib/types";

async function finalImage(file:File):Promise<Blob>{
  if(file.size>MAX_EVIDENCE_BYTES)throw new Error("Choose a photo smaller than 5 MB.");
  if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Choose a JPEG, PNG or WebP image.");
  if(file.size<=65536)return file;
  const bitmap=await createImageBitmap(file);
  try{if(bitmap.width*bitmap.height>40000000)throw new Error("The image dimensions are too large.");const scale=Math.min(1,1280/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const context=canvas.getContext("2d");if(!context)throw new Error("This browser could not prepare the photo.");context.fillStyle="#fff";context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);let blob:Blob|null=null;for(const quality of[.82,.65,.45,.3]){blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",quality));if(blob&&blob.size<=65536)break;}if(!blob)throw new Error("This browser could not compress the photo.");return blob;}finally{bitmap.close();}
}
export function EvidenceField({label="Return photo",onChange}:{label?:string;onChange:(hash:Hex|null)=>void}){
  const[busy,setBusy]=useState(false);const[error,setError]=useState<string|null>(null);const[uploaded,setUploaded]=useState<{hash:Hex;url:string;size:number}|null>(null);
  async function upload(file:File){setBusy(true);setError(null);setUploaded(null);onChange(null);try{const bytes=await finalImage(file);const hash=await hashBytes(await bytes.arrayBuffer());const result=await request<{hash:Hex;url:string;size:number}>("/api/evidence",{method:"POST",headers:{"Content-Type":bytes.type,"X-Content-SHA256":hash},body:bytes});if(result.hash!==hash)throw new Error("The stored photo hash does not match.");setUploaded(result);onChange(hash);}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
  return <div className="evidence-field"><label className="upload-zone"><input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file);}}/>{busy?<LoaderCircle className="spin"/>:<ImagePlus/>}<strong>{busy?"Storing and checking your photo…":label}</strong><span>Take a photo or choose a file · up to 5 MB</span></label><p className="small muted">Large photos are resized before hashing. The final image bytes are stored; the same SHA-256 hash is recorded with the transaction.</p>{error&&<p className="field-error" role="alert">{error}</p>}{uploaded&&<EvidencePreview hash={uploaded.hash}/>}</div>;
}
export function EvidencePreview({hash}:{hash:Hex|string}){
  const[state,setState]=useState<"loading"|"verified"|"mismatch"|"missing">("loading");const[url,setUrl]=useState<string|null>(null);
  useEffect(()=>{const controller=new AbortController();let objectUrl:string|null=null;setState("loading");setUrl(null);async function verify(){try{const id=normalizeHash(hash);const response=await fetch(`/api/evidence/${id}`,{signal:controller.signal});if(!response.ok)throw new Error("Unavailable");const bytes=await response.arrayBuffer();if(controller.signal.aborted)return;const actual=await hashBytes(bytes);if(actual.slice(2)!==id){setState("mismatch");return;}objectUrl=URL.createObjectURL(new Blob([bytes],{type:response.headers.get("content-type")??"image/jpeg"}));setUrl(objectUrl);setState("verified");}catch{if(!controller.signal.aborted)setState("missing");}}void verify();return()=>{controller.abort();if(objectUrl)URL.revokeObjectURL(objectUrl);};},[hash]);
  return <div className="evidence-preview">{url&&<a href={url} target="_blank" rel="noreferrer"><img src={url} alt="Stored evidence photograph"/></a>}<div><span className={`verification ${state==="verified"?"verified":""}`}>{state==="verified"?<><ShieldCheck size={15}/>Stored bytes match</>:state==="loading"?<><LoaderCircle className="spin" size={15}/>Checking stored bytes</>:state==="mismatch"?"Hash mismatch — do not rely on this file":"Evidence file is unavailable"}</span><code title={hash}>{shortAddress(hash,12)}</code>{state==="verified"&&<span className="small muted"><Check size={11}/> SHA-256 verified in this browser</span>}</div></div>;
}
