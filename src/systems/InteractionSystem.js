import * as THREE from 'three';
export class InteractionSystem{
 constructor(camera,scene,player,inventory,onMessage,onDocument){
  this.camera=camera;this.scene=scene;this.player=player;this.inventory=inventory;this.onMessage=onMessage;this.onDocument=onDocument;
  this.onAction=()=>{};this.entries=[];this.meshes=[];this.lookup=new Map();this.raycaster=new THREE.Raycaster();this.raycaster.far=2.8;this.target=null;this.center=new THREE.Vector2(0,0);
 }
 register(object,entry){
  const item={object,...entry};this.entries.push(item);
  object.traverse(mesh=>{if(mesh.isMesh){this.lookup.set(mesh,item);this.meshes.push(mesh)}});
  return object;
 }
 unregister(entry){
  this.entries=this.entries.filter(e=>e!==entry);
  entry.object.traverse(mesh=>{if(mesh.isMesh){this.lookup.delete(mesh);const i=this.meshes.indexOf(mesh);if(i>=0)this.meshes.splice(i,1)}});
 }
 update(){
  this.target=null;this.raycaster.setFromCamera(this.center,this.camera);
  const hits=this.raycaster.intersectObjects(this.meshes,false);
  for(const hit of hits){const entry=this.lookup.get(hit.object);
   if(!entry||!entry.object.visible||!hit.object.visible)continue;
   this.target=entry;break;
  }
  return this.target?this.target.label(this):'';
 }
 interact(){
  const entry=this.target;if(!entry)return;
  if(entry.kind==='pickup'){
   if(!this.inventory.add(entry.item)){this.onMessage('Inventário cheio.');return}
   entry.object.visible=false;this.unregister(entry);
   this.onMessage('Coletado: '+entry.item.name);this.onAction('pickup',entry.item);return;
  }
  if(entry.kind==='document'){this.onAction('document',entry.document);this.onDocument(entry.document);return}
  entry.action?.(this);
 }
}