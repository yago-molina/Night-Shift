import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
import {chromium} from 'playwright';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4173','--strictPort'],{stdio:'pipe'});
let browser;
try{
 let online=false;
 for(let i=0;i<70;i++){try{if((await fetch('http://127.0.0.1:4173')).ok){online=true;break}}catch{}await sleep(300)}
 assert.ok(online,'Vite indisponível');
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--use-angle=swiftshader','--enable-webgl']});
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 assert.ok(await page.locator('#play').isVisible(),'Menu não abriu');
 await page.locator('#play').click();
 await page.locator('#hud').waitFor({state:'visible',timeout:7000});
 await page.keyboard.down('w');await sleep(250);await page.keyboard.up('w');
 assert.deepEqual(errors,[],'Erro no browser');
 console.log('BROWSER OK: menu, partida, HUD, movimentação');
}finally{await browser?.close();server.kill('SIGTERM')}
