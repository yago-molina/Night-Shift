import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Hospital} from '../src/world/Hospital.js';
import {CCTVSystem} from '../src/systems/CCTVSystem.js';
test('hospital instancia quatro armários 3D e atualiza suas portas',()=>{
 const saved=globalThis.document;
 const ctx=new Proxy({}, {get(obj,key){return key in obj?obj[key]:()=>{}},set(obj,key,value){obj[key]=value;return true}});
 globalThis.document={createElement:()=>({width:512,height:512,getContext:()=>ctx})};
 try{
  const hospital=new Hospital(new THREE.Scene());
  assert.equal(hospital.lockerModels.size,4);
  const locker=hospital.lockerModels.get('cabinet:-5.7:-11.5');
  assert.ok(locker?.group?.isGroup);
  locker.opening.target=1;hospital.update(.2);
  assert.ok(locker.opening.value>.5);
 }finally{globalThis.document=saved}
});
test('câmeras suportam presets e não renderizam quando ninguém está vendo',()=>{
 let renders=0;
 const renderer={getRenderTarget:()=>null,setRenderTarget:()=>{},render:()=>{renders++}};
 const cctv=new CCTVSystem(new THREE.Scene(),renderer,{enabled:()=>true});
 cctv.configure([256,144],.4);assert.equal(cctv.targets[0].width,256);
 cctv.update(.5,false);assert.equal(renders,0);
 assert.equal(cctv.enter(),true);cctv.update(.5,false);assert.equal(renders,1);
 cctv.exit();cctv.dispose();
});
