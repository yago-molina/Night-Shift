import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Monster} from '../src/ai/Monster.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
import {AIState} from '../src/ai/StateMachine.js';

function setup({monsterX=5,monsterZ=0,playerX=5,playerZ=3}={}){
 const collision=new CollisionWorld();
 const player={position:new THREE.Vector3(playerX,0,playerZ),hidden:false,hidingId:null};
 const m=new Monster(new THREE.Scene(),collision,player,[]);
 m.active=true;m.position.set(monsterX,0,monsterZ);m.model.position.copy(m.position);
 return {m,player,collision};
}
test('passos comuns não chamam o monstro além de dois metros',()=>{
 const {m}=setup({monsterX:5,playerX:5,playerZ:3});
 assert.equal(m.hearsPlayer({moving:true,running:false,crouch:false}),false);
});
test('corrida chama a atenção até cinco metros somente sem obstáculos',()=>{
 const {m,collision}=setup({monsterX:5,playerX:5,playerZ:4});
 assert.equal(m.hearsPlayer({moving:true,running:true,crouch:false}),true);
 collision.add(5,2,2,.3);
 assert.equal(m.hearsPlayer({moving:true,running:true,crouch:false}),false);
});
test('agachar praticamente silencia os passos',()=>{
 const {m}=setup({monsterX:5,playerX:5,playerZ:1.1});
 assert.equal(m.hearsPlayer({moving:true,crouch:true,running:false}),false);
});
test('sons e passos da sala de segurança não provocam investigação fora da perseguição',()=>{
 const {m}=setup({monsterX:-3,monsterZ:0,playerX:-3,playerZ:-5});
 assert.equal(m.hearsPlayer({moving:true,running:true,crouch:false}),false);
 m.hearNoise({x:-3,z:-5},45);
 assert.equal(m.state,AIState.PATROL);
});
test('som ouvido inicia uma única investigação e ativa cooldown',()=>{
 const {m}=setup({monsterX:5,monsterZ:0,playerX:5,playerZ:1.5});
 m.seesPlayer=()=>false;
 m.update(.65,{moving:true,running:false,crouch:false},[]);
 assert.equal(m.state,AIState.INVESTIGATE);
 assert.ok(m.hearingCooldown>0);
 assert.equal(m.hearsPlayer({moving:true,running:true,crouch:false}),false);
});
test('monstro abandona a porta ao perder jogador escondido na segurança',()=>{
 const {m,player}=setup({monsterX:-3,monsterZ:-1.1,playerX:-3,playerZ:-7});
 m.setState(AIState.CHASE);m.lostTime=1.48;player.hidden=true;
 m.update(.1,{moving:false,crouch:true,running:false},[]);
 assert.equal(m.state,AIState.RETURN);
 assert.equal(m.lastKnown,null);
 assert.ok(m.securityCooldown>0);
 assert.equal(m.seesPlayer(),false);
});
test('fora de perseguição não atravessa a fronteira da segurança com a porta aberta',()=>{
 const {m}=setup({monsterX:-3,monsterZ:-2.1,playerX:-3,playerZ:-6});
 m.setState(AIState.RETURN);
 m.moveToward({x:-3,z:-4},1.5,.3);
 assert.ok(m.position.z>=-2.2);
});
test('investigação velha termina mesmo sem alcançar o ponto',()=>{
 const {m}=setup({monsterX:5,monsterZ:0,playerX:5,playerZ:8});
 m.investigate({x:5,z:8});m.machine.time=10;
 m.update(.1,{moving:false,running:false,crouch:false},[]);
 assert.equal(m.state,AIState.RETURN);
});
