import { expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { evidenceRoutes } from '../src/evidence.js';

it('requires backend authentication, validates bytes, and detects later disk tampering',async()=>{
  const directory=mkdtempSync(join(tmpdir(),'metermend-evidence-'));
  try{
    const app=evidenceRoutes(directory,'local-test-token');
    const bytes=Buffer.from([137,80,78,71,13,10,26,10,1,2,3]);const hash=createHash('sha256').update(bytes).digest('hex');
    expect((await app.request('/',{method:'POST',body:bytes})).status).toBe(401);
    const headers={Authorization:'Bearer local-test-token','X-Content-SHA256':hash};
    expect((await app.request('/',{method:'POST',headers,body:bytes})).status).toBe(201);
    expect((await app.request('/'+hash,{headers})).status).toBe(200);
    expect((await app.request('/',{method:'POST',headers:{...headers,'X-Content-SHA256':'f'.repeat(64)},body:bytes})).status).toBe(400);
    writeFileSync(join(directory,hash),'tampered');
    expect((await app.request('/'+hash,{headers})).status).toBe(404);
  }finally{
    if(!resolve(directory).startsWith(resolve(tmpdir())+sep+'metermend-evidence-'))throw new Error('Unexpected cleanup path');
    rmSync(directory,{recursive:true,force:true});
  }
});
