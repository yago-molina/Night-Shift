import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {MissionSystem,SECONDS_PER_MINUTE,LEGACY_SECONDS_PER_MINUTE} from '../src/systems/MissionSystem.js';
import {OBJECTIVE_LOCATIONS,objectivePosition} from '../src/world/ObjectiveLocations.js';
import {CampaignRandom} from '../src/systems/CampaignRandom.js';
import {populateInteractables} from '../src/systems/Interactables.js';
import {CCTVSystem,CCTV_LOCATIONS} from '../src/systems/CCTVSystem.js';
import {PowerSystem} from '../src/systems/PowerSystem.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';

test('relógio de 23h a 06h dura exatamente vinte minutos reais',()=>{
 assert.equal(420*SECONDS_PER_MINUTE,1200);
 const m=new MissionSystem();m.update(1200);
 assert.equal(m.clock,'06:00');assert.equal(m.minutes,420);
});
test('salvamento antigo converte duração mas preserva o horário do jogador',()=>{
 const old=new MissionSystem();
 old.restore({version:1,elapsed:180*LEGACY_SECONDS_PER_MINUTE,stage:0,flags:{},fired:[60,120,180]});
 assert.equal(old.clock,'02:00');
 assert.equal(old.elapsed,180*SECONDS_PER_MINUTE);
 const current=new MissionSystem();current.restore(old.snapshot());
 assert.equal(current.clock,'02:00');assert.equal(current.elapsed,old.elapsed);
});
test('relógio de 05h30 é atingido antes dos vinte minutos',()=>{
 const m=new MissionSystem();m.update(390*SECONDS_PER_MINUTE);
 assert.equal(m.clock,'05:30');
 assert.equal(m.elapsed,1114.2857142857142);
});
test('pistas aparecem em posições diferentes conforme o seed, dentro dos seus setores',()=>{
 const a=new CampaignRandom(5),b=new CampaignRandom(52);
 for(const [id,choices] of Object.entries(OBJECTIVE_LOCATIONS)){
  assert.equal(choices.length,2);
  for(const p of choices){
   const [x,y,z]=p;assert.ok(x>-16&&x<16&&z>-13&&z<13&&y>.6&&y<1.2,id);
  }
  assert.deepEqual(objectivePosition(id,a),objectivePosition(id,new CampaignRandom(5)));
  assert.ok(choices.some(x=>x.every((v,i)=>v===objectivePosition(id,a)[i])),id);
 }
 assert.notDeepEqual(Object.entries(OBJECTIVE_LOCATIONS).map(([id])=>objectivePosition(id,a)),Object.entries(OBJECTIVE_LOCATIONS).map(([id])=>objectivePosition(id,b)));
});
test('pistas importantes apoiam-se nas mesas ou nas camas corretas',()=>{
 for(const p of OBJECTIVE_LOCATIONS.key)assert.ok(p[0]>-4.2&&p[0]<-1.8&&Math.abs(p[2]+9.3)<.46);
 for(const p of OBJECTIVE_LOCATIONS.ward)assert.ok((Math.abs(p[0]+12)<.2&&Math.abs(p[2]-6.7)<1)||(Math.abs(p[0]+9)<.2&&Math.abs(p[2]-9.7)<1));
 for(const p of OBJECTIVE_LOCATIONS.surgery)assert.ok((p[0]>11.5&&p[2]<9.5)||(p[0]>10.5&&p[2]>10.5));
});
test('gaveta com pista registra o documento após a gaveta e mantém a pista dentro da bandeja',()=>{
 const random={drawerHasNote:()=>true,roll:()=>0};
 const scene=new THREE.Scene(),mat=new THREE.MeshBasicMaterial();
 const material={wood:mat,metal:mat,warning:mat,trim:mat,black:mat,bed:mat};
 const registered=[];
 const hospital={scene,m:material,collision:new CollisionWorld()};
 populateInteractables(hospital,{register:(obj,entry)=>registered.push({obj,...entry})},{position:new THREE.Vector3(-3,0,-7)},{has:()=>false},()=>{},()=>{},random);
 const drawers=registered.filter(x=>x.kind==='drawer'),notes=registered.filter(x=>x.kind==='document'&&x.document.title.startsWith('Fragmento'));
 assert.equal(drawers.length,4);assert.equal(notes.length,4);
 const surgeryDrawer=drawers.find(x=>x.obj.position.x===11);
 assert.ok(Math.abs(surgeryDrawer.obj.rotation.y-Math.PI)<1e-6,'gaveta da cirurgia voltada à entrada');
 for(const paper of notes)assert.ok(paper.obj.parent?.parent,'pista tem de acompanhar o interior da gaveta');
 drawers[0].action();assert.equal(notes[0].obj.visible,true);
 drawers[0].action();assert.equal(notes[0].obj.visible,false);
});
test('sorteio de pistas mantém chance de cinquenta por cento em cada gaveta',()=>{
 for(const id of ['deskReception','deskOffice','deskSecurity','deskSurgery']){
  let count=0;for(let seed=1;seed<=1000;seed++)if(new CampaignRandom(seed).drawerHasNote(id))count++;
  assert.ok(count>380&&count<620,id+': '+count);
 }
});
test('CCTV cobre quatro áreas do caminho da criatura mais a entrada da segurança',()=>{
 assert.equal(CCTV_LOCATIONS.length,5);
 const routes=[[-3,0],[-11,0],[-11,9],[13,9]];
 for(const wp of routes)assert.ok(CCTV_LOCATIONS.some(location=>Math.hypot(location.patrol[0]-wp[0],location.patrol[1]-wp[1])<.2));
 assert.ok(CCTV_LOCATIONS.some(location=>location.name.includes('SEGURANÇA')));
 for(const location of CCTV_LOCATIONS){
  const camera=new THREE.PerspectiveCamera(70,16/9,.1,55);
  camera.position.set(...location.pos);camera.lookAt(...location.look);camera.updateMatrixWorld();
  const v=new THREE.Vector3(location.patrol[0],1.35,location.patrol[1]).project(camera);
  assert.ok(Math.abs(v.x)<.98&&Math.abs(v.y)<.98&&v.z>=-1&&v.z<=1,location.name);
 }
});
test('visitar duas câmeras exige tempo de observação, não basta apertar rapidamente',()=>{
 let renders=0;
 const renderer={getRenderTarget:()=>null,setRenderTarget:()=>{},render:()=>renders++};
 const cctv=new CCTVSystem(new THREE.Scene(),renderer,new PowerSystem());
 assert.equal(cctv.enter(),true);
 cctv.update(.3);cctv.select(1);cctv.update(.3);
 assert.equal(cctv.observed.size,0);
 cctv.update(.55);assert.equal(cctv.observed.size,1);
 cctv.select(2);cctv.update(.81);assert.equal(cctv.observed.size,2);
 cctv.dispose();
});
test('a mesma câmera não conta duas vezes e o monitoramento não altera energia fora de uso',()=>{
 const renderer={getRenderTarget:()=>null,setRenderTarget:()=>{},render:()=>{}};
 const cctv=new CCTVSystem(new THREE.Scene(),renderer,new PowerSystem());
 cctv.enter();cctv.update(1);cctv.update(1);assert.equal(cctv.observed.size,1);
 cctv.exit();cctv.update(1,false);assert.equal(cctv.observed.size,1);
 cctv.dispose();
});
