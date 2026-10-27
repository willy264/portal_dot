import { readBoundedBody, saveEvidence } from "@/lib/evidence-storage";
import { errorMessage } from "@/lib/format";
import { imageMime, normalizeHash } from "@/lib/evidence";
import { createHash } from "node:crypto";
export const runtime="nodejs";
export async function POST(request:Request) {
  try {
    const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return Response.json({error:"Uploads must originate from this application."},{status:403});
    const hash=normalizeHash(request.headers.get("x-content-sha256")??"");
    const bytes=await readBoundedBody(request);
    if(createHash("sha256").update(bytes).digest("hex")!==hash)throw new Error("The uploaded bytes do not match the supplied hash.");
    const mime=imageMime(bytes);if(!mime)throw new Error("Only JPEG, PNG and WebP image evidence is supported.");
    if(process.env.EVIDENCE_BACKEND_URL){
      const response=await fetch(new URL("/api/evidence",process.env.EVIDENCE_BACKEND_URL),{method:"POST",headers:{"Content-Type":mime,"X-Content-SHA256":hash,...(process.env.EVIDENCE_BACKEND_TOKEN?{Authorization:`Bearer ${process.env.EVIDENCE_BACKEND_TOKEN}`}:{})},body:new Uint8Array(bytes).buffer,signal:AbortSignal.timeout(20000)});
      const result=await response.json();if(!response.ok)return Response.json({error:result.error??"Persistent evidence service rejected the upload."},{status:502});
      if(normalizeHash(String(result.hash))!==hash)return Response.json({error:"Evidence service returned a different content hash."},{status:502});
      return Response.json({hash:`0x${hash}`,url:`/api/evidence/${hash}`,size:bytes.length,mime,mode:"application-storage"},{status:201});
    }
    return Response.json(await saveEvidence(bytes,hash),{status:201});
  }catch(error){const message=errorMessage(error);return Response.json({error:message},{status:message.includes("not configured")?503:400});}
}
