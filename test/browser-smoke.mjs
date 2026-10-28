import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
import {chromium} from 'playwright';
const port=4173;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'pipe'});
let browser;
const errors=[];
try{
 let online=false;
 for(let i=0;i<90;i++){
  if(server.exitCode!==null)throw new Error('Vite saiu inesperadamente: '+server.exitCode);
  try{const r=await fetch('http://127.0.0.1:'+port);if(r.ok){online=true;break}}catch{}
  await sleep(300);
 }
 assert.ok(online,'Servidor Vite não iniciou.');
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--use-angle=swiftshader','--enable-webgl','--disable-web-security']});
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 page.on('pageerror',error=>errors.push(error.stack||error.message));
 await page.goto('http://127.0.0.1:'+port,{waitUntil:'networkidle'});
 assert.equal(await page.locator('canvas').count(),1,'Canvas WebGL ausente');
 assert.ok(await page.locator('#play').isVisible(),'Menu inicial ausente');
 await page.locator('#play').click();
 await page.waitForFunction(()=>document.pointerLockElement===document.querySelector('canvas'),{timeout:6000}).catch(()=>{});
 await page.screenshot({path:'browser-smoke.png'});
 const diag=await page.evaluate(()=>({locked:document.pointerLockElement===document.querySelector('canvas'),hud:document.querySelector('#hud')?.style.display,menu:document.querySelector('#menu')?.style.display,body:document.body.innerText.slice(0,180)}));
 console.log('START DIAGNOSTIC',JSON.stringify({diag,errors}));
 assert.ok(await page.locator('#hud').isVisible(),'HUD não apareceu após iniciar turno. '+JSON.stringify({diag,errors}));
 await page.keyboard.down('w');await sleep(400);await page.keyboard.up('w');
 await page.keyboard.press('c');await page.keyboard.press('f');
 await page.keyboard.press('F2');
 await page.locator('#performance-ui').waitFor({state:'visible',timeout:5000});
 assert.equal(errors.length,0,'Erros JavaScript no browser: '+errors.join(' | '));
 console.log('BROWSER SMOKE PASS: canvas, menu, input, HUD, F2 e sem exceções.');
 // Continue through the monster activation window, which the previous smoke test did not cover.
 await page.waitForTimeout(22000);
 assert.equal(errors.length,0,'Erro após 22 segundos de partida: '+errors.join(' | '));
 assert.equal(await page.locator('#night-shift-recovery').count(),0,'Tela de recuperação apareceu durante partida');
 await page.screenshot({path:'browser-smoke.png'});
 const safePage=await browser.newPage({viewport:{width:1000,height:650}});
 safePage.on('pageerror',error=>errors.push(error.stack||error.message));
 await safePage.goto('http://127.0.0.1:'+port+'/?safe=1',{waitUntil:'networkidle'});
 assert.ok(await safePage.locator('#play').isVisible(),'Menu no modo seguro não apareceu');
 assert.equal(await safePage.locator('#quality').inputValue(),'low','Modo seguro não selecionou qualidade baixa');
 assert.equal(errors.length,0,'Erros no modo seguro: '+errors.join(' | '));
 await safePage.close();
}finally{await browser?.close();server.kill('SIGTERM')}
