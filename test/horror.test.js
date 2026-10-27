import test from 'node:test';
import assert from 'node:assert/strict';
import {TensionSystem} from '../src/systems/TensionSystem.js';
import {HorrorDirector} from '../src/systems/HorrorDirector.js';

const player={position:{x:0,z:0},hidden:false};
function monster(state='PATROL',x=12){return {active:true,state,position:{x,z:0},hearNoise(){}}}

test('tension increases near chasing creature',()=>{
 const t=new TensionSystem(),m=monster('CHASE',2);
 for(let i=0;i<80;i++)t.update(.05,m,player);
 assert.ok(t.value>.8);
});
test('tension decreases if creature becomes inactive',()=>{
 const t=new TensionSystem(),m=monster('CHASE',2);
 for(let i=0;i<70;i++)t.update(.05,m,player);
 m.active=false;for(let i=0;i<200;i++)t.update(.05,m,player);
 assert.ok(t.value<.02);
});
test('director respects cooldown and avoids repeating the last event',()=>{
 const events=[];
 const d=new HorrorDirector({audio:{effect(k){events.push(k)}},lighting:{flickerNearest(){events.push('flicker')}},post:{pulse(){}},monster:monster('PATROL',15),player,onEvent(){}});
 d.update(1,0);assert.equal(d.eventCount,0);
 d.update(30,0);assert.equal(d.eventCount,1);
 const previous=d.lastEvent;d.nextEvent=d.time+.1;
 d.update(.2,0);assert.equal(d.eventCount,2);
 assert.notEqual(d.lastEvent,previous);
});
test('director defers environmental events during a chase',()=>{
 const m=monster('CHASE');
 const d=new HorrorDirector({audio:{effect(){}},lighting:{flickerNearest(){}},post:{pulse(){}},monster:m,player});
 d.update(25,1);assert.equal(d.eventCount,0);
 assert.ok(d.nextEvent>d.time);
});
