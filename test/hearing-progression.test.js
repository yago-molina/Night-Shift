import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Monster} from '../src/ai/Monster.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
import {AIState} from '../src/ai/StateMachine.js';
function setup(){
 const collision=new CollisionWorld();
 const player={position:new THREE.Vector3(4,0,2),hidden:false};
 const monster=new Monster(new THREE.Scene(),collision,player,[]);
 monster.active=true;monster.position.set(4,0,0);monster.facing.set(0,0,-1);
 return {monster,player,collision};
}
test('zona de audição cobre 360 graus, inclusive atrás do monstro',()=>{
 const {monster,player}=setup();
 for(const [x,z] of [[4,2],[4,-2],[6,0],[2,0]]){
  player.position.set(x,0,z);
  assert.equal(monster.hearsPlayer({moving:true,running:false,crouch:false}),true,'não escutou em '+x+','+z);
 }
});
test('andar, correr e agachar possuem raios de detecção diferentes',()=>{
 const {monster,player}=setup();
 player.position.set(4,0,5.5);
 assert.equal(monster.hearsPlayer({moving:true,crouch:false,running:false}),false);
 assert.equal(monster.hearsPlayer({moving:true,crouch:false,running:true}),true);
 assert.equal(monster.hearsPlayer({moving:true,crouch:true,running:false}),false);
 assert.equal(monster.hearsPlayer({moving:false,crouch:false,running:true}),false);
});
test('paredes abafam o som, mas não exigem linha de visão',()=>{
 const {monster,player,collision}=setup();
 player.position.set(4,0,2.4);
 collision.add(4,1.2,2,.22);
 assert.equal(monster.rayClear(player.position),false);
 assert.equal(monster.hearsPlayer({moving:true,running:true,crouch:false}),true);
 assert.equal(monster.hearsPlayer({moving:true,running:false,crouch:false}),false);
});
test('agressividade aumenta conforme horas e missões, com teto seguro',()=>{
 const {monster,player}=setup();
 const early=monster.hearingRadii;
 const earlyChase=monster.chaseSpeed;
 monster.setProgress({minutes:360,stage:4});
 assert.ok(monster.aggression>.7);
 assert.ok(monster.hearingRadii.walk>early.walk);
 assert.ok(monster.hearingRadii.run>early.run);
 assert.ok(monster.chaseSpeed>earlyChase);
 assert.ok(monster.chaseSpeed<5.4,'criatura não deve ultrapassar a corrida do jogador');
 player.position.set(4,0,4.5);
 assert.equal(monster.hearsPlayer({moving:true,crouch:false,running:false}),true);
 monster.setProgress({minutes:9999,stage:99});
 assert.equal(monster.aggression,1);
});
test('segurança continua protegida de audição, independentemente da fase',()=>{
 const {monster,player}=setup();monster.position.set(-3,0,0);player.position.set(-3,0,-4);
 monster.setProgress({minutes:420,stage:5});
 assert.equal(monster.hearsPlayer({moving:true,running:true,crouch:false}),false);
 monster.hearNoise(player.position,99);
 assert.equal(monster.state,AIState.PATROL);
});
