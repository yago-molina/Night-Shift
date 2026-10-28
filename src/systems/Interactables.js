import {DOCUMENTS} from './StoryContent.js';
import {nightDrawerReport} from './NightLore.js';
import {objectivePosition} from '../world/ObjectiveLocations.js';
import * as THREE from 'three';
const cube=(parent,x,y,z,w,h,d,mat)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);parent.add(o);return o};
export function populateInteractables(hospital,interaction,player,inventory,onMessage,onNoise=()=>{},campaignRandom=null,night=1){
 const {scene,m,collision}=hospital;
 const result={doors:[],hideSpots:[]};
 const doors=[[-11,-2],[-3,-2],[5,-2],[12,-2],[-11,2],[-3,2],[5,2],[12,2]];
 for(const [x,z] of doors){
  const hinge=new THREE.Group();hinge.position.set(x-.78,0,z);scene.add(hinge);
  cube(hinge,.78,1.27,0,1.57,2.54,.08,m.wood);
  cube(hinge,1.37,1.1,.09,.13,.08,.08,m.metal);
  let blocker=collision.add(x,z,1.6,.13,{door:true});
  const position=new THREE.Vector3(x,0,z);
  const door={position,secure:x===-3&&z===-2,get isOpen(){return open},openByMonster(){if(!open){hinge.rotation.y=-Math.PI/2;collision.remove(blocker);open=true;}}};
  result.doors.push(door);
  let open=false;const locked=x===-3&&z===-2;
  interaction.register(hinge,{kind:'door',label:()=>locked&&!inventory.has('security-key')&&!open?'[E] Porta trancada • precisa da chave':'[E] '+(open?'Fechar porta':'Abrir porta'),action:()=>{
   if(locked&&!inventory.has('security-key')){onMessage('A porta da segurança está trancada. Procure a chave.');return}
   if(open){
    // Não fechar caso o jogador esteja atravessando o batente.
    if(Math.abs(player.position.x-x)<1&&Math.abs(player.position.z-z)<.6){onMessage('Afaste-se da porta para fechá-la.');return}
    hinge.rotation.y=0;blocker=collision.add(x,z,1.6,.13,{door:true});open=false;
   }else{door.openByMonster()}
   onNoise(position,5);
  }});
 }
 function pickup(x,y,z,item,color){
  const group=new THREE.Group();group.position.set(x,y,z);scene.add(group);
  const mat=new THREE.MeshStandardMaterial({color,roughness:.65,emissive:color,emissiveIntensity:.07});
  if(item.type==='battery'){
   cube(group,0,0,0,.23,.36,.16,mat);cube(group,0,.2,0,.11,.045,.1,m.metal)
  }else if(item.type==='key'){
   const ring=new THREE.Mesh(new THREE.TorusGeometry(.09,.022,8,16),m.warning);ring.position.y=.13;group.add(ring);cube(group,0,-.06,0,.038,.3,.035,m.warning);cube(group,.05,-.19,0,.11,.045,.035,m.warning)
  }else cube(group,0,0,0,.27,.12,.22,mat);
  interaction.register(group,{kind:'pickup',item,label:()=> '[E] Pegar '+item.name});
 }
 // A chave fica ao alcance do jogador dentro da sala de segurança, na mesa.
 const [keyX,keyY,keyZ]=objectivePosition('key',campaignRandom);
 pickup(keyX,keyY,keyZ,{id:'security-key',type:'key',name:'Chave da segurança'},0xd8bb72);
 pickup(-2.5,1.01,-9.45,{id:'battery-01',type:'battery',name:'Bateria reserva'},0x87c6b3);
 pickup(-12,1.05,-9,{id:'battery-02',type:'battery',name:'Bateria reserva'},0x87c6b3);
 pickup(5,.98,8,{id:'battery-03',type:'battery',name:'Bateria reserva'},0x87c6b3);
 function drawer(x,z,id,{faceNorth=false}={}){
  const frame=new THREE.Group();frame.position.set(x,.63,z);
  if(faceNorth)frame.rotation.y=Math.PI;
  scene.add(frame);
  // A complete sliding tray, aligned with the desk and facing the accessible room side.
  cube(frame,0,0,0,.75,.35,.55,m.wood);
  const tray=new THREE.Group();tray.position.z=.28;frame.add(tray);
  cube(tray,0,-.085,0,.66,.045,.48,m.wood);
  for(const side of [-.30,.30])cube(tray,side,0,0,.04,.18,.48,m.wood);
  cube(tray,0,0,.25,.72,.3,.05,m.trim);
  cube(tray,0,0,.30,.18,.05,.045,m.metal);
  let opened=false;
  const hasNote=campaignRandom?.drawerHasNote(id)??(Math.random()<.5);
  const paper=new THREE.Group();paper.position.set(0,.14,.05);paper.visible=false;tray.add(paper);
  if(hasNote){
   cube(paper,0,0,0,.29,.018,.31,m.bed);
   cube(paper,0,.012,-.07,.22,.004,.012,m.trim);
  }
  interaction.register(frame,{kind:'drawer',label:()=> '[E] '+(opened?'Fechar':'Abrir')+' gaveta',action:()=>{
   opened=!opened;tray.position.z=opened?.62:.28;paper.visible=opened&&hasNote;
   onMessage(opened?(hasNote?'Há um documento na gaveta.':'Gaveta vazia.'):'Gaveta fechada.');
   onNoise(frame.position,4);
  }});
  // Register AFTER the drawer, otherwise the drawer's mesh lookup shadows this document.
  if(hasNote){
   const doc=nightDrawerReport(night,id);
   interaction.register(paper,{kind:'document',document:doc,label:()=> '[E] Ler papel encontrado: '+doc.title});
  }
 }
 drawer(-12,-8.60,'deskReception');
 drawer(12,-8.60,'deskOffice');
 drawer(-3,-8.88,'deskSecurity');
 drawer(11,10.58,'deskSurgery',{faceNorth:true});
 const docs=[
  {id:'occurrence',...DOCUMENTS.occurrence},
  {id:'maintenance',...DOCUMENTS.maintenance},
  {id:'office',...DOCUMENTS.office},
  {id:'ward',...DOCUMENTS.ward},
  {id:'research',...DOCUMENTS.research},
  {id:'surgery',...DOCUMENTS.surgery},
  {id:'reception',...DOCUMENTS.reception}
 ];
 for(const d of docs){
  const g=new THREE.Group();g.position.set(...objectivePosition(d.id,campaignRandom));scene.add(g);
  cube(g,0,0,0,.34,.025,.43,m.bed);cube(g,0,.015,-.09,.25,.005,.015,m.trim);
  interaction.register(g,{kind:'document',document:d,label:()=> '[E] Ler documento: '+d.title});
 }
 // Armários: esconderijo funcional, sem teleporte para o interior de colisões.
 for(const [x,z] of [[-5.7,-11.5],[-14,-11],[14,-11],[5,-11]]){
  const id='cabinet:'+x+':'+z;result.hideSpots.push({id,position:new THREE.Vector3(x,0,z+.88)});
  const target=new THREE.Group();target.position.set(x,1.15,z+.3);scene.add(target);
  cube(target,0,0,0,.72,1.7,.08,m.trim);
  interaction.register(target,{kind:'hide',label:()=> '[E] Esconder-se no armário',action:()=>{
   if(player.hidden)return;
   const distance=Math.hypot(player.position.x-x,player.position.z-(z+.3));
   if(distance>1.7){onMessage('Aproxime-se do armário.');return}
   player.hideAt(x,z+.88,id);onMessage('Você está escondido. Pressione E para sair.');
  }});
 }
 return result;
}
