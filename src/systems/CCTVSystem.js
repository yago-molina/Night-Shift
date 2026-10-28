import * as THREE from 'three';
// Cameras watch the creature's ACTUAL patrol route, not unvisited corners.
export const CCTV_LOCATIONS=[
 {name:'CORREDOR CENTRAL',pos:[-3,2.75,0],look:[6,1.3,0],patrol:[5,0]},
 {name:'CORREDOR OESTE',pos:[-15.1,2.75,0],look:[-9,1.3,0],patrol:[-11,0]},
 {name:'ENFERMARIA / GERADOR',pos:[-11,2.75,3.1],look:[-11,1.3,9],patrol:[-11,9]},
 {name:'ACESSO CIRÚRGICO',pos:[13.5,2.75,3.1],look:[13.5,1.3,9],patrol:[13,9]},
 {name:'ENTRADA SEGURANÇA',pos:[-3,2.75,-.2],look:[-3,1.3,-2.2],patrol:[-3,-1.35]}
];
export class CCTVSystem{
 constructor(scene,renderer,power){
  this.scene=scene;this.renderer=renderer;this.power=power;this.cameras=[];this.targets=[];this.index=0;this.active=false;this.refreshTimer=0;this.refreshIndex=0;this.interval=.5;this.viewSeconds=0;this.observed=new Set();
  for(const location of CCTV_LOCATIONS){
   const camera=new THREE.PerspectiveCamera(70,16/9,.1,55);camera.position.set(...location.pos);camera.lookAt(...location.look);
   const target=new THREE.WebGLRenderTarget(320,180,{depthBuffer:true});
   this.cameras.push({...location,camera});this.targets.push(target);
   const body=new THREE.Group();body.position.set(...location.pos);scene.add(body);
   const material=new THREE.MeshStandardMaterial({color:0x53676d,metalness:.65,roughness:.4});
   body.add(new THREE.Mesh(new THREE.BoxGeometry(.32,.2,.4),material));
   const lens=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.12,12),new THREE.MeshStandardMaterial({color:0x15242c,metalness:.5}));
   lens.rotation.x=Math.PI/2;lens.position.z=-.24;body.add(lens);
  }
  this.monitorSurface=null;
 }
 attachMonitor(scene){
  const material=new THREE.MeshBasicMaterial({map:this.targets[0].texture,color:0xffffff,side:THREE.DoubleSide});
  const display=new THREE.Mesh(new THREE.PlaneGeometry(.65,.55),material);
  display.position.set(-3,1.43,-9.188);scene.add(display);this.monitorSurface=display;
 }
 configure(size=[320,180],interval=.5){
  this.interval=interval;
  for(const target of this.targets)target.setSize(size[0],size[1]);
  this.refreshTimer=0;
 }
 enter(){if(!this.power.enabled('cctv'))return false;this.active=true;this.refreshTimer=0;this.viewSeconds=0;return true}
 exit(){this.active=false}
 select(index){const next=(index+this.cameras.length)%this.cameras.length;if(next!==this.index)this.viewSeconds=0;this.index=next;this.refreshTimer=0;if(this.monitorSurface)this.monitorSurface.material.map=this.targets[this.index].texture}
 get current(){return this.cameras[this.index]}
 update(dt,monitorVisible=false){
  if(!this.power.enabled('cctv')){this.active=false;return}
  if(this.active){this.viewSeconds+=Math.max(0,dt);if(this.viewSeconds>=.8)this.observed.add(this.index)}
  // One secondary render at a time; cameras only update while the terminal is in use.
  if(!this.active&&!monitorVisible)return;
  this.refreshTimer-=dt;if(this.refreshTimer>0)return;this.refreshTimer=this.interval;
  const i=this.active?this.index:this.refreshIndex++%this.cameras.length;
  const previous=this.renderer.getRenderTarget();
  const wasVisible=this.monitorSurface?.visible;
  try{
   if(this.monitorSurface)this.monitorSurface.visible=false;
   this.renderer.setRenderTarget(this.targets[i]);
   this.renderer.render(this.scene,this.cameras[i].camera);
  }finally{
   this.renderer.setRenderTarget(previous);
   if(this.monitorSurface)this.monitorSurface.visible=wasVisible;
  }
 }
 detectsMonster(monster,collision){
  if(!monster?.active||!this.power.enabled('cctv'))return false;
  const camera=this.current.camera;
  camera.updateMatrixWorld();
  const target=new THREE.Vector3(monster.position.x,1.35,monster.position.z);
  const projected=target.clone().project(camera);
  if(Math.abs(projected.x)>.88||Math.abs(projected.y)>.88||projected.z< -1||projected.z>1)return false;
  const dx=target.x-camera.position.x,dz=target.z-camera.position.z;
  const dist=Math.hypot(dx,dz);if(dist>15)return false;
  for(let d=.4;d<dist-.45;d+=.25){
   const t=d/dist;
   if(collision?.blocked(camera.position.x+dx*t,camera.position.z+dz*t,.08))return false;
  }
  return true;
 }
 dispose(){for(const target of this.targets)target.dispose()}
}