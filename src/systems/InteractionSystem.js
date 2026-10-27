import * as THREE from 'three';
export class InteractionSystem{
 constructor(camera,scene,player,inventory,onMessage,onDocument){
  this.camera=camera;this.scene=scene;this.player=player;this.inventory=inventory;this.onMessage=onMessage;this.onDocument=onDocument;
  this.onAction=()=>{};this.entries=[];this.raycaster=new THREE.Raycaster();this.raycaster.far=2.8;this.target=null;
 }
 register(object,entry){object.traverse(mesh=>{if(mesh.isMesh)mesh.userData.interactionRoot=object});this.entries.push({object,...entry});return object}
 update(){
  this.target=null;
  this.raycaster.setFromCamera(new THREE.Vector2(0,0),this.camera);
  const meshes=[];for(const e of this.entries)if(e.object.visible) e.object.traverse(o=>{if(o.isMesh&&o.visible)meshes.push(o)});
  const hits=this.raycaster.intersectObjects(meshes,false);
  if(hits.length){const root=hits[0].object.userData.interactionRoot;this.target=this.entries.find(e=>e.object===root)||null}
  return this.target?this.target.label(this):''
 }
 interact(){
  const entry=this.target;if(!entry)return;
  if(entry.kind==='pickup'){
   if(!this.inventory.add(entry.item)){this.onMessage('Inventário cheio.');return}
   entry.object.visible=false;this.entries=this.entries.filter(e=>e!==entry);
   this.onMessage('Coletado: '+entry.item.name);this.onAction('pickup',entry.item);return;
  }
  if(entry.kind==='document'){this.onAction('document',entry.document);this.onDocument(entry.document);return}
  entry.action?.(this);
 }
}