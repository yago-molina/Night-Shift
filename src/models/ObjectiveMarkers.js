import * as THREE from 'three';
const POS={
 key:[-3.72,1.30,-8.98],
 incident:[-3.8,1.3,-8.88],
 cctv:[-3,1.8,-9.1],
 evidence:[4.65,1.3,8],
 returned:[-3,1.0,-6.5],
 survive:[.65,1.8,-5.5]
};
export class ObjectiveMarkers{
 constructor(scene){
  this.scene=scene;this.root=new THREE.Group();this.scene.add(this.root);
  const mat=new THREE.MeshBasicMaterial({color:0xe3c68a,transparent:true,opacity:.78,depthWrite:false,side:THREE.DoubleSide});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.19,.017,6,28),mat);ring.rotation.x=Math.PI/2;this.root.add(ring);
  const pointer=new THREE.Mesh(new THREE.ConeGeometry(.105,.23,4),mat);pointer.rotation.z=Math.PI;pointer.position.y=.42;this.root.add(pointer);
  const light=new THREE.PointLight(0xe0bc77,.8,2.5);light.position.y=.25;this.root.add(light);
  this.elapsed=0;this.last='';
 }
 update(dt,mission){
  const id=mission?.objective?.id||'';if(id!==this.last){this.last=id;const p=POS[id];this.root.visible=Boolean(p);if(p)this.root.position.set(...p)}
  if(!this.root.visible)return;
  this.elapsed+=dt;this.root.children[0].rotation.z=this.elapsed*.25;
  this.root.children[1].position.y=.42+Math.sin(this.elapsed*2.1)*.07;
 }
}