import test from 'node:test';
import assert from 'node:assert/strict';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
import {Navigation} from '../src/ai/Navigation.js';
import {StateMachine,AIState} from '../src/ai/StateMachine.js';

test('colisores de porta podem ser ignorados apenas durante planejamento de rota',()=>{
 const c=new CollisionWorld();c.add(0,0,.25,4,{door:true});
 assert.equal(c.blocked(0,0,.2),true);
 assert.equal(c.blocked(0,0,.2,true),false);
});
test('A* encontra caminho ao redor de uma parede',()=>{
 const c=new CollisionWorld();c.add(0,0,1,5);
 const nav=new Navigation(c,{cell:.5,minX:-5,maxX:5,minZ:-5,maxZ:5});
 const route=nav.path({x:-3,z:0},{x:3,z:0});
 assert.ok(route.length>0);
 assert.ok(route.every(p=>!c.blocked(p.x,p.z,.29,true)));
});
test('A* alcança uma sala através de uma porta fechada no planejamento',()=>{
 const c=new CollisionWorld();c.add(-2,0,3,.3);c.add(2,0,3,.3);c.add(0,0,1,.3,{door:true});
 const nav=new Navigation(c,{cell:.5,minX:-5,maxX:5,minZ:-5,maxZ:5});
 assert.ok(nav.path({x:0,z:-2},{x:0,z:2}).length>0);
});
test('máquina de estados conta o tempo e notifica transições',()=>{
 const changes=[];const fsm=new StateMachine(AIState.PATROL,(next,prev)=>changes.push([prev,next]));
 fsm.update(2);fsm.set(AIState.INVESTIGATE);
 assert.equal(fsm.time,0);assert.equal(fsm.state,AIState.INVESTIGATE);
 assert.deepEqual(changes,[[AIState.PATROL,AIState.INVESTIGATE]]);
});
