import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {NightDirector,MAX_NIGHTS,clampNight} from '../src/systems/NightDirector.js';
import {nightDrawerReport} from '../src/systems/NightLore.js';
import {CampaignRandom} from '../src/systems/CampaignRandom.js';
import {SaveSystem} from '../src/systems/SaveSystem.js';
import {PowerSystem} from '../src/systems/PowerSystem.js';
import {Monster} from '../src/ai/Monster.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
const director=(night,callbacks={})=>new NightDirector({night,random:new CampaignRandom(7931),...callbacks});
test('cinco noites com zero a quatro invasões programadas',()=>{
 assert.equal(MAX_NIGHTS,5);
 for(let night=1;night<=5;night++){
  const d=director(night);
  assert.equal(d.raids.length,night-1);
  assert.ok(d.raids.every(r=>r.minute>35&&r.minute<390));
  assert.ok(d.raids.every((r,i)=>i===0||r.minute-d.raids[i-1].minute>=20));
 }
 assert.equal(clampNight(0),1);assert.equal(clampNight(99),5);
});
test('primeira noite não recebe invasão, quinta anuncia quatro e conclui quatro',()=>{
 for(const night of [1,5]){
  let warned=0,attacks=0,ends=0;
  const d=director(night,{onWarning:()=>warned++,onStart:()=>attacks++,onEnd:()=>ends++});
  for(let minute=0;minute<=420;minute++){
   d.update(1,minute);
   if(d.active)d.update(99,minute);
  }
  assert.equal(warned,night-1);assert.equal(attacks,night-1);assert.equal(ends,night-1);
 }
});
test('aviso ocorre antes da invasão e cada ataque termina',()=>{
 const events=[];const d=director(2,{onWarning:()=>events.push('warning'),onStart:()=>events.push('start'),onEnd:()=>events.push('end')});
 const minute=d.raids[0].minute;
 d.update(1,minute-4);assert.deepEqual(events,['warning']);
 d.update(1,minute);assert.deepEqual(events,['warning','start']);
 d.update(50,minute);assert.deepEqual(events,['warning','start','end']);
});
test('sorteio de 0 a 3 aciona perda em 1 e 3, preservando eventos após restaurar',()=>{
 const events=[];
 const d=director(4,{onPower:e=>events.push(e)});
 for(let minute=0;minute<=420;minute++)d.update(.01,minute);
 assert.equal(events.length,3);
 for(const e of events)assert.ok(e.value>=0&&e.value<=3&&Number.isInteger(e.value));
 for(const e of events)assert.equal(e.loss>0,e.value===1||e.value===3);
 const restored=director(4,{onPower:e=>events.push(e)});
 assert.equal(restored.restore(d.snapshot()),true);
 restored.update(1,420);assert.equal(events.length,3);
});
test('o ataque e seus avisos não duplicam após checkpoint',()=>{
 let start=0,end=0,warning=0;
 const d=director(3,{onWarning:()=>warning++,onStart:()=>start++,onEnd:()=>end++});
 const minute=d.raids[0].minute;
 d.update(.1,minute-4);d.update(.1,minute);d.update(4,minute);
 const continued=director(3,{onWarning:()=>warning++,onStart:()=>start++,onEnd:()=>end++});
 assert.equal(continued.restore(d.snapshot()),true);
 assert.equal(continued.active,true);
 continued.update(99,minute+1);
 assert.equal(start,1);assert.equal(end,1);assert.equal(warning,1);
});
test('nível de irritação aumenta com a madrugada e com noites avançadas',()=>{
 const first=director(1),last=director(5);
 first.update(1,100);last.update(1,100);
 assert.ok(last.anger>first.anger);
 const start=last.anger;last.update(1,410);assert.ok(last.anger>=start&&last.anger<=4);
 assert.equal(last.anger,4);
});
test('monstro recebe irritação sem revelar jogador oculto nem atingir velocidade injusta',()=>{
 const player={position:new THREE.Vector3(4,0,2),hidden:true},m=new Monster(new THREE.Scene(),new CollisionWorld(),player,[]);
 m.setProgress({minutes:100,stage:3});const early=m.aggression;
 m.setNightAnger(4);assert.ok(m.aggression>early);
 assert.ok(m.chaseSpeed<5.4);
 m.active=true;assert.equal(m.hearsPlayer({moving:true,running:true}),false);
});
test('energia cai de forma limitada e provoca pane quando zerar',()=>{
 const power=new PowerSystem();
 const initial=power.energy;power.drain(22);assert.equal(power.energy,initial-22);
 power.drain(200);assert.equal(power.energy,0);assert.equal(power.powered,false);
 power.restore();assert.equal(power.energy,100);
});
test('progresso de campanha persiste até a quinta noite, sem avançar na derrota',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const save=new SaveSystem(storage);
 assert.equal(save.getNight(),1);
 save.save({version:1,missions:{stage:3}});
 assert.equal(save.advanceNight(),2);assert.equal(save.hasCheckpoint(),false);
 save.setNight(4);assert.equal(new SaveSystem(storage).advanceNight(),5);
 assert.equal(save.advanceNight(),5);save.resetCampaign();assert.equal(save.getNight(),1);
});
test('toda noite revela quatro textos próprios nos mesmos quatro esconderijos',()=>{
 const ids=['deskReception','deskOffice','deskSecurity','deskSurgery'];
 const titles=new Set();
 for(let n=1;n<=5;n++)for(const id of ids){
  const report=nightDrawerReport(n,id);
  assert.ok(report.title&&report.body.length>50);
  assert.ok(!titles.has(report.title),'documento repetido: '+report.title);
  titles.add(report.title);
 }
 assert.equal(titles.size,20);
});
