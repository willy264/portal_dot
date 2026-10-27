import { createHash, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';

const limit = 5 * 1024 * 1024;
const hashOf = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
function mime(bytes: Uint8Array): string | null {
  const b = Buffer.from(bytes);
  if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (b.length >= 3 && b[0] === 255 && b[1] === 216 && b[2] === 255) return 'image/jpeg';
  if (b.length >= 12 && b.toString('ascii',0,4) === 'RIFF' && b.toString('ascii',8,12) === 'WEBP') return 'image/webp';
  return null;
}
export function evidenceRoutes(directory: string, token: string | undefined): Hono {
  const app = new Hono();
  const root = resolve(directory);
  app.use('*', async (c, next) => {
    if (!token) return c.json({error:'Persistent evidence uploads are not configured'},503);
    const actual=Buffer.from(c.req.header('authorization')??''); const expected=Buffer.from(`Bearer ${token}`);
    if (actual.length !== expected.length || !timingSafeEqual(actual,expected)) return c.json({error:'Unauthorized'},401);
    await next();
  });
  app.use('*',bodyLimit({maxSize:limit,onError:c=>c.json({error:'Image exceeds 5 MB'},413)}));
  let writing=false;
  app.post('/',async c=>{
    if(writing)return c.json({error:'Storage is busy; retry shortly'},429);
    writing=true;
    try{
      const hash=(c.req.header('x-content-sha256')??'').replace(/^0x/,'').toLowerCase();
      if(!/^[a-f0-9]{64}$/.test(hash))return c.json({error:'Invalid SHA-256'},400);
      const bytes=new Uint8Array(await c.req.arrayBuffer());const contentType=mime(bytes);
      if(!contentType||hashOf(bytes)!==hash)return c.json({error:'Unsupported image or hash mismatch'},400);
      await mkdir(root,{recursive:true});
      try { const existing=await readFile(join(root,hash)); if(hashOf(existing)!==hash)throw new Error('Stored evidence integrity failure'); }
      catch(error){
        if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;
        let total=0;for(const name of await readdir(root)){if(/^[a-f0-9]{64}$/.test(name))total+=(await stat(join(root,name))).size;}
        if(total+bytes.length>Number(process.env.EVIDENCE_STORAGE_LIMIT_BYTES??250*1024*1024))return c.json({error:'Evidence storage quota reached'},507);
        await writeFile(join(root,hash),bytes,{flag:'wx',mode:0o600});
      }
      return c.json({hash:`0x${hash}`,url:`/api/evidence/${hash}`,size:bytes.length,mime:contentType,mode:'application-storage'},201);
    }catch{return c.json({error:'Persistent evidence storage failed'},500);}finally{writing=false;}
  });
  app.get('/:hash',async c=>{
    const hash=c.req.param('hash').replace(/^0x/,'').toLowerCase();
    if(!/^[a-f0-9]{64}$/.test(hash))return c.json({error:'Invalid hash'},400);
    try{
      const bytes=await readFile(join(root,hash));const contentType=mime(bytes);
      if(bytes.length>limit||!contentType||hashOf(bytes)!==hash)throw new Error('Invalid evidence');
      return c.body(new Uint8Array(bytes).buffer,200,{'Content-Type':contentType,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Cache-Control':'private, max-age=31536000, immutable'});
    }catch{return c.json({error:'Verified evidence unavailable'},404);}
  });
  return app;
}
