import {afterAll,afterEach,beforeAll,describe,expect,it,vi} from "vitest";
import {mkdtemp,readFile,rm,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {createHash} from "node:crypto";
import {imageMime,hashBytes,normalizeHash,MAX_EVIDENCE_BYTES} from "../lib/evidence";
import {loadEvidence,readBoundedBody,saveEvidence} from "../lib/evidence-storage";
const photo=Buffer.from([137,80,78,71,13,10,26,10,10,20,30,40]);
const hash=(bytes:Buffer)=>createHash("sha256").update(bytes).digest("hex");
let directory:string;
beforeAll(async()=>{directory=await mkdtemp(path.join(tmpdir(),"metermend-evidence-test-"));});
afterEach(()=>vi.unstubAllEnvs());
afterAll(async()=>{if(directory.startsWith(path.join(tmpdir(),"metermend-evidence-test-")))await rm(directory,{recursive:true,force:true});});
function configure(){vi.stubEnv("WEB_EVIDENCE_DIR",directory);vi.stubEnv("VERCEL","");}
describe("final evidence byte integrity",()=>{
 it("commits the final bytes, so modifying a compressed image changes its hash",async()=>{const final=new Uint8Array(photo);const original=new Uint8Array([...photo,255]);expect(await hashBytes(final.buffer)).toBe(`0x${hash(photo)}`);expect(await hashBytes(original.buffer)).not.toBe(await hashBytes(final.buffer));});
 it("stores an immutable content-addressed image and reads exactly the same bytes",async()=>{configure();const result=await saveEvidence(photo,hash(photo));expect(result.hash).toBe(`0x${hash(photo)}`);expect((await loadEvidence(result.hash)).bytes.equals(photo)).toBe(true);await saveEvidence(photo,hash(photo));expect((await readFile(path.join(directory,hash(photo)))).equals(photo)).toBe(true);});
 it("rejects a claimed hash for different bytes before storage",async()=>{configure();await expect(saveEvidence(photo,"f".repeat(64))).rejects.toThrow("do not match");});
 it("rejects an HTML payload even with its correct hash",async()=>{configure();const html=Buffer.from("<script>alert(1)</script>");expect(imageMime(html)).toBeNull();await expect(saveEvidence(html,hash(html))).rejects.toThrow("Only JPEG");});
 it("detects disk corruption instead of serving a verified image",async()=>{configure();const bytes=Buffer.from([...photo,5]);const id=hash(bytes);await saveEvidence(bytes,id);await writeFile(path.join(directory,id),Buffer.from([...photo,6]));await expect(loadEvidence(id)).rejects.toThrow("integrity");await expect(saveEvidence(bytes,id)).rejects.toThrow("integrity");});
 it("rejects path traversal and malformed hash identifiers",()=>{for(const value of["../secret","a".repeat(63),"g".repeat(64)])expect(()=>normalizeHash(value)).toThrow();});
 it("enforces the actual stream length when Content-Length is missing",async()=>{const request=new Request("http://localhost/api/evidence",{method:"POST",body:new Uint8Array(MAX_EVIDENCE_BYTES+1)});await expect(readBoundedBody(request)).rejects.toThrow("5 MB");});
 it("refuses local disk storage on ephemeral Vercel hosts",async()=>{configure();vi.stubEnv("VERCEL","1");await expect(saveEvidence(photo,hash(photo))).rejects.toThrow("Persistent evidence storage");});
});
