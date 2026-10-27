import * as THREE from 'three';
const LOCATIONS=[
 {name:'CORREDOR CENTRAL',pos:[-1.8,2.75,0],look:[6,1.2,0]},
 {name:'RECEPÇÃO',pos:[-14,2.75,-11.8],look:[-11,1.2,-7]},
 {name:'ENFERMARIA',pos:[-14,2.75,11.8],look:[-11,1.2,7]},
 {name:'CENTRO CIRÚRGICO',pos:[7,2.75,11.8],look:[3,1.2,7]}
];
export class CCTVSystem{
 constructor(scene,renderer,power){
  this.scene=scene;this.renderer=renderer;this.power=power;this.cameras=[];this.targets=[];this.index=0;this.active=false;this.refreshTimer=0;this.refreshIndex=0;this.interval=.5;
  for(const location of LOCATIONS){
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
 enter(){if(!this.power.enabled('cctv'))return false;this.active=true;this.refreshTimer=0;return true}
 exit(){this.active=false}
 select(index){this.index=(index+this.cameras.length)%this.cameras.length;this.refreshTimer=0;if(this.monitorSurface)this.monitorSurface.material.map=this.targets[this.index].texture}
 get current(){return this.cameras[this.index]}
 update(dt,monitorVisible=false){
  if(!this.power.enabled('cctv')){this.active=false;return}
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
 dispose(){for(const target of this.targets)target.dispose()}
}