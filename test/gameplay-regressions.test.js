import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Monster} from '../src/ai/Monster.js';
import {makeLocker,makeDrawer,makeHospitalDoor,makeEvidenceFolder,makeCollectible,makeTerminal} from '../src/models/HospitalProps.js';
import {InputManager} from '../src/core/InputManager.js';
const material=new THREE.MeshBasicMaterial({color:0x999999});
const materials={wall:material,wood:material,metal:material,trim:material,glass:material,warning:material,black:material,bed:material,screen:material,dark:material};
test('3D props are separate, have meshes and can animate open and closed',()=>{
 const locker=makeLocker(materials),drawer=makeDrawer(materials),door=makeHospitalDoor(materials);
 for(const model of [locker,drawer,door]){let count=0;model.group.traverse(o=>{if(o.isMesh)count++});assert.ok(count>=3);model.opening.target=1;for(let i=0;i<30;i++)model.opening.update(.016);assert.ok(model.opening.value>.9);model.opening.target=0;for(let i=0;i<40;i++)model.opening.update(.016);assert.ok(model.opening.value<.03)}
 assert.ok(drawer.tray.position.z<.03);
});
test('evidence and terminal are complete 3D meshes',()=>{
 for(const object of [makeEvidenceFolder(materials,{important:true}),makeCollectible(materials,'key'),makeCollectible(materials,'battery'),makeTerminal(materials)]){
  let meshes=0;object.traverse(o=>{if(o.isMesh)meshes++});assert.ok(meshes>=2);
 }
});
test('monster opens only a door on its planned route',()=>{
 const state={position:{x:-3,z:-1.15},state:'PATROL',path:[{x:-3,z:-1.65},{x:-3,z:-2.35}]};
 const intended={position:{x:-3,z:-2},secure:false,isOpen:false};
 const adjacent={position:{x:-11,z:-2},secure:false,isOpen:false};
 assert.equal(Monster.prototype.isOnPlannedRoute.call(state,intended),true);
 assert.equal(Monster.prototype.isOnPlannedRoute.call(state,adjacent),false);
});
test('security door remains closed outside a chase',()=>{
 const state={position:{x:-3,z:-1.15},state:'INVESTIGATE',path:[{x:-3,z:-1.65},{x:-3,z:-2.35}]};
 const door={position:{x:-3,z:-2},secure:true,isOpen:false};
 assert.equal(Monster.prototype.isOnPlannedRoute.call(state,door),false);
 state.state='CHASE';
 assert.equal(Monster.prototype.isOnPlannedRoute.call(state,door),true);
});
test('gamepad-free keyboard capture prevents page selection shortcuts in pointer lock',()=>{
 const originalDocument=globalThis.document, originalWindow=globalThis.window;
 const doc=new EventTarget(),win=new EventTarget();doc.hidden=false;globalThis.document=doc;globalThis.window=win;
 try{
  const input=new InputManager({requestPointerLock(){}});input.locked=true;
  const make=(code,ctrl=false)=>{const e=new Event('keydown',{cancelable:true});Object.defineProperties(e,{code:{value:code},ctrlKey:{value:ctrl},metaKey:{value:false},altKey:{value:false},target:{value:{matches:()=>false}}});doc.dispatchEvent(e);return e};
  const selection=make('KeyA',true);assert.equal(selection.defaultPrevented,true);assert.equal(input.down('KeyA'),false);
  const move=make('KeyW');assert.equal(move.defaultPrevented,true);assert.equal(input.down('KeyW'),true);
  const crouch=make('KeyC');assert.equal(crouch.defaultPrevented,true);assert.equal(input.down('KeyC'),true);
 }finally{globalThis.document=originalDocument;globalThis.window=originalWindow}
});
