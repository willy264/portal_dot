import { afterEach, expect, it, vi } from 'vitest';
import { deliver } from '../src/delivery.js';
afterEach(()=>vi.unstubAllGlobals());
const notification={content:'Deposit refunded',link:'https://example.com',eventId:'1'};
it('does not treat an HTTP 200 business rejection as delivery',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({ok:false,success:false}),{status:200})));
  await expect(deliver({mode:'debox',key:'test',group:'group'},notification)).rejects.toThrow('did not acknowledge');
});
it('preserves Retry-After even when a throttled endpoint returns HTML',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>new Response('<html>rate limited</html>',{status:429,headers:{'Retry-After':'60'}})));
  await expect(deliver({mode:'debox',key:'test',group:'group'},notification)).rejects.toMatchObject({status:429,retryAfterMs:60000});
});
it('sends the documented DeBox body with the server-only App Key',async()=>{
  const request=vi.fn(async()=>new Response(JSON.stringify({ok:true,success:true}),{status:200}));vi.stubGlobal('fetch',request);
  await deliver({mode:'debox',key:'local-test-key',group:'workshop'},notification);
  const args=request.mock.calls[0] as unknown as [string,RequestInit];
  expect(args[0]).toBe('https://open.debox.pro/openapi/bot/sendMessage');
  expect(JSON.parse(String(args[1].body))).toEqual({chat_id:'workshop',chat_type:'group',content:'Deposit refunded',parse_mode:'text'});
});
