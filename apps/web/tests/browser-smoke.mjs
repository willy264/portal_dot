// Read-only Chromium smoke check; no wallet injection, signing, uploads or chain writes.
// Run against a local production server: node tests/browser-smoke.mjs
import {spawn} from "node:child_process";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
const appOrigin=process.env.WEB_TEST_ORIGIN??"http://localhost:3100";
const output=path.resolve(fileURLToPath(new URL("../test-artifacts/",import.meta.url)));
await mkdir(output,{recursive:true});
const browser=process.env.CHROMIUM_PATH??"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const child=spawn(browser,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=9333",`--user-data-dir=${path.join(output,`edge-profile-${Date.now()}`)}`,"about:blank"],{windowsHide:true,stdio:"ignore"});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));let ws;const errors=[];const checks=[];
try{
 let ready=false;for(let i=0;i<60;i++){try{if((await fetch("http://localhost:9333/json/version")).ok){ready=true;break;}}catch{}await delay(200);}assert(ready,"Chromium remote debugging did not start");
 const target=await(await fetch("http://localhost:9333/json/new?about:blank",{method:"PUT"})).json();ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0;const pending=new Map();ws.onmessage=event=>{const message=JSON.parse(event.data);if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p?.reject(new Error(JSON.stringify(message.error)));else p?.resolve(message.result);}else if(message.method==="Runtime.exceptionThrown")errors.push(message.params.exceptionDetails);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
 const evaluate=async expression=>(await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true})).result?.value;
 async function navigate(route){await send("Page.navigate",{url:appOrigin+route});for(let i=0;i<60;i++){if(await evaluate("document.readyState==='complete' && !!document.querySelector('h1')"))break;await delay(150);}await delay(350);const metrics=await evaluate("({title:document.title,h1:document.querySelector('h1')?.textContent,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.body.innerText})");assert(metrics.h1,`Missing page heading on ${route}`);assert(metrics.scrollWidth<=metrics.width+1,`Horizontal overflow on ${route}: ${metrics.scrollWidth}/${metrics.width}`);checks.push({route,h1:metrics.h1,width:metrics.width,noOverflow:true});return metrics;}
 async function screenshot(name){const layout=await send("Page.getLayoutMetrics");const image=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:layout.cssContentSize.width,height:layout.cssContentSize.height,scale:1}});await writeFile(path.join(output,`${name}.png`),Buffer.from(image.data,"base64"));}
 await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await navigate("/");await screenshot("home-desktop");
 for(const route of["/items","/operator","/arbiter","/items/1","/rentals/1","/proof"]){if(route==="/items/1"||route==="/rentals/1"){await send("Page.navigate",{url:appOrigin+route});await delay(800);const text=await evaluate("document.body.innerText");assert(/unavailable|Waiting|registered|ledger|camera/i.test(text),`Missing truthful state on ${route}`);checks.push({route,truthfulEmptyState:true});}else{await navigate(route);}}
 await screenshot("proof-desktop");
 await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});await navigate("/");await screenshot("home-mobile");
 await evaluate("document.querySelector('[aria-label=\"Toggle navigation\"]').click()");assert(await evaluate("document.querySelector('[aria-label=\"Toggle navigation\"]').getAttribute('aria-expanded')==='true'"));await evaluate("document.querySelector('[aria-label=\"Toggle navigation\"]').click()");checks.push({mobileNavigation:true});
 await evaluate("document.querySelector('[aria-label=\"Use dark theme\"]').click()");assert.equal(await evaluate("document.documentElement.dataset.theme"),"dark");await screenshot("home-mobile-dark");checks.push({darkTheme:true});
 await evaluate("document.querySelector('.wallet-button').click()");await delay(1500);assert(await evaluate("!!document.querySelector('[role=dialog]')"));assert(await evaluate("document.body.innerText.includes('No wallet detected')"));await evaluate("document.querySelector('[aria-label=\"Close wallet\"]').click()");checks.push({walletMissingState:true});
 for(const route of["/items","/operator","/arbiter","/proof"]){await navigate(route);}
 await screenshot("proof-mobile-dark");assert.equal(errors.length,0,`Browser exceptions: ${JSON.stringify(errors)}`);
 await writeFile(path.join(output,"browser-results.json"),JSON.stringify({origin:appOrigin,checkedAt:new Date().toISOString(),checks,exceptions:errors},null,2));console.log(JSON.stringify({checks:checks.length,exceptions:errors.length,screenshots:output},null,2));
 await send("Browser.close").catch(()=>{});
}finally{ws?.close();child.kill();}
