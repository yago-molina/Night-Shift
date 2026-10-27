import test from 'node:test';
import assert from 'node:assert/strict';
import {MissionSystem,SHIFT_MINUTES,SECONDS_PER_MINUTE} from '../src/systems/MissionSystem.js';
import {SaveSystem} from '../src/systems/SaveSystem.js';
test('relógio cruza meia-noite e chega às seis',()=>{
 const m=new MissionSystem();assert.equal(m.clock,'23:00');
 m.update(60*SECONDS_PER_MINUTE);assert.equal(m.clock,'00:00');
 m.update(360*SECONDS_PER_MINUTE);assert.equal(m.clock,'06:00');assert.equal(m.minutes,SHIFT_MINUTES);
});
test('objetivos só avançam conforme ações encadeadas',()=>{
 const m=new MissionSystem();m.action('evidence');m.action('cctv');assert.equal(m.stage,0);
 m.action('key');assert.equal(m.stage,1);m.action('incident');assert.equal(m.stage,4);
 m.action('returned');assert.equal(m.stage,5);
});
test('relatórios, CCTV e retorno liberam final verdadeiro depois das cinco e meia',()=>{
 const m=new MissionSystem();for(const action of ['key','incident','cctv','evidence','returned'])m.action(action);
 assert.equal(m.canExtract(),false);m.update(390*SECONDS_PER_MINUTE);
 assert.equal(m.canExtract(),true);assert.equal(m.complete('terminal').kind,'truth');
});
test('sem evidência, fim de turno continua sendo possível, mas inconclusivo',()=>{
 const m=new MissionSystem();m.update(420*SECONDS_PER_MINUTE);
 assert.equal(m.complete('dawn').kind,'uncertain');
});
test('eventos temporizados disparam somente uma vez',()=>{
 const events=[];const m=new MissionSystem({onEvent:e=>events.push(e.minute)});
 m.update(2*3600);m.update(100);
 assert.deepEqual(events,[60,120,180,240,300,390]);
});
test('checkpoint restaura progresso e não duplica eventos',()=>{
 const events=[];const m=new MissionSystem();m.action('key');m.update(120*SECONDS_PER_MINUTE);
 const saved=m.snapshot();const restored=new MissionSystem({onEvent:e=>events.push(e.minute)});
 assert.equal(restored.restore(saved),true);assert.equal(restored.stage,1);
 restored.update(1);assert.deepEqual(events,[]);
});
test('salvamento com armazenamento injetado suporta gravação, leitura e exclusão',()=>{
 const store=new Map();const storage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)||null,removeItem:k=>store.delete(k)};
 const saver=new SaveSystem(storage);assert.equal(saver.hasCheckpoint(),false);
 assert.equal(saver.save({version:1,missions:{stage:2}}),true);
 assert.equal(saver.load().missions.stage,2);saver.clear();assert.equal(saver.load(),null);
});
