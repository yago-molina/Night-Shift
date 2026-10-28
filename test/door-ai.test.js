import test from 'node:test';
import assert from 'node:assert/strict';
import {Monster} from '../src/ai/Monster.js';
import {Navigation} from '../src/ai/Navigation.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
const door=(x,z,secure=false)=>({position:{x,z},secure,isOpen:false});
function monster(state,path,pos={x:-3,z:-1}){return {position:pos,state,path,inSecurity:Monster.prototype.inSecurity};}
test('só abre a porta que cruza o próximo trecho da rota',()=>{
 const ctx=monster('PATROL',[{x:-3,z:-1.7},{x:-3,z:-2.4}]);
 assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(-3,-2)),true);
 assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(-11,-2)),false);
 assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(5,-2)),false);
});
test('passar perto de uma porta sem cruzá-la não a abre',()=>{
 const ctx=monster('PATROL',[{x:-3,z:-.4},{x:-3,z:.3}],{x:-3,z:-1});
 assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(-3,-2)),false);
});
test('porta segura só abre em CHASE',()=>{
 const ctx=monster('PATROL',[{x:-3,z:-1.7},{x:-3,z:-2.4}]);
 assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(-3,-2,true)),false);
 ctx.state='INVESTIGATE';assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(-3,-2,true)),false);
 ctx.state='CHASE';assert.equal(Monster.prototype.isDoorOnRoute.call(ctx,door(-3,-2,true)),true);
});
test('A* evita interior da segurança fora de perseguição',()=>{
 const c=new CollisionWorld();
 const nav=new Navigation(c,{cell:.65,minX:-15.6,maxX:15.6,minZ:-12.6,maxZ:12.6});
 nav.blockedArea=p=>p.x>-6.7&&p.x<.7&&p.z< -2.25;
 const p=nav.path({x:-3,z:0},{x:-3,z:-8});
 assert.ok(p.every(x=>!(x.x>-6.7&&x.x<.7&&x.z< -2.25)));
});
