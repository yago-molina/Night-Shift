import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {HidingPressure} from '../src/systems/HidingPressure.js';
import {Monster} from '../src/ai/Monster.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
test('tempo do turno equivale a 42 minutos reais',async()=>{
 const {SHIFT_MINUTES,SECONDS_PER_MINUTE}=await import('../src/systems/MissionSystem.js');
 assert.equal(SHIFT_MINUTES*SECONDS_PER_MINUTE,2520);
});
test('esconderijo dá margem inicial antes do risco aumentar',()=>{
 const pressure=new HidingPressure();
 for(let i=0;i<8;i++)pressure.update(1,true);
 assert.equal(pressure.pressure,0);
 pressure.update(10,true);
 assert.ok(pressure.pressure>0);
});
test('tempo longo escondido aumenta a pressão sem ultrapassar o limite',()=>{
 const pressure=new HidingPressure();
 for(let i=0;i<140;i++)pressure.update(1,true);
 assert.equal(pressure.pressure,1);
 for(let i=0;i<60;i++)pressure.update(1,true);
 assert.equal(pressure.pressure,1);
});
test('sair do armário reduz pressão de modo progressivo',()=>{
 const p=new HidingPressure();
 for(let i=0;i<108;i++)p.update(1,true);
 p.update(1,false);
 assert.ok(p.pressure<1&&p.pressure>.9);
 for(let i=0;i<55;i++)p.update(1,false);
 assert.equal(p.pressure,0);
 assert.equal(p.streak,0);
});
test('checkpoints restauram pressão e permanência com limites',()=>{
 const original=new HidingPressure();for(let i=0;i<45;i++)original.update(1,true);
 const restored=new HidingPressure();restored.restore(original.snapshot());
 assert.deepEqual(restored.snapshot(),original.snapshot());
 restored.restore({streak:999999,pressure:99});
 assert.equal(restored.pressure,1);assert.equal(restored.streak,3600);
});
test('esconder-se aumenta agressividade, mantendo teto e velocidade justa',()=>{
 const collision=new CollisionWorld(),player={position:new THREE.Vector3(4,0,3),hidden:true};
 const monster=new Monster(new THREE.Scene(),collision,player,[]);
 monster.setProgress({minutes:60,stage:1});
 const base=monster.aggression,walk=monster.hearingRadii.walk,chase=monster.chaseSpeed;
 monster.setHidingPressure(1);
 assert.ok(monster.aggression>base);
 assert.ok(monster.hearingRadii.walk>walk);
 assert.ok(monster.chaseSpeed>chase);
 assert.ok(monster.chaseSpeed<5.4);
 monster.setHidingPressure(0);
 assert.ok(Math.abs(monster.aggression-base)<1e-9);
});
test('pressão não denuncia automaticamente quem está escondido',()=>{
 const collision=new CollisionWorld(),player={position:new THREE.Vector3(4,0,2),hidden:true};
 const monster=new Monster(new THREE.Scene(),collision,player,[]);
 monster.active=true;monster.position.set(4,0,0);
 monster.setHidingPressure(1);
 assert.equal(monster.seesPlayer(),false);
 assert.equal(monster.hearsPlayer({moving:true,running:true,crouch:false}),false);
});
test('pressão longa acelera inspeção de esconderijos próximos',()=>{
 const collision=new CollisionWorld(),player={position:new THREE.Vector3(5,0,0),hidden:false};
 const monster=new Monster(new THREE.Scene(),collision,player,[]);
 monster.position.set(5,0,0);monster.lastKnown=new THREE.Vector3(5,0,0);
 monster.hideSpots=[{id:'locker',position:new THREE.Vector3(5,0,0)}];
 monster.setHidingPressure(1);
 monster.scanTime=1.6;
 monster.lookForHidingSpot(.01);
 assert.ok(monster.suspicion.has('locker'));
});
