const { chromium } = require('playwright'); // npm i playwright
(async()=>{
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
const reqs=[];
p.on('response',r=>{const u=r.url();const ct=r.headers()['content-type']||'';reqs.push(r.request().resourceType()+' '+r.status()+' '+ct.split(';')[0]+' '+u)});
await p.goto('https://www.cabanalaribera.com/',{waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));}});
await p.waitForTimeout(3000);
require('fs').writeFileSync('rendered.html',await p.content());
require('fs').writeFileSync('reqs.txt',reqs.join('\n'));
await p.screenshot({path:'full.png',fullPage:true});
await b.close();})();
