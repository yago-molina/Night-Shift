import * as THREE from 'three';
// Procedural creature asset, authored separately from AI for easy replacement by GLB later.
export function createCreatureModel(){
 const root=new THREE.Group();
 const coat=new THREE.MeshStandardMaterial({color:0x263236,roughness:.97,side:THREE.DoubleSide});
 const skin=new THREE.MeshStandardMaterial({color:0x6b7370,roughness:1});
 const cloth=new THREE.MeshStandardMaterial({color:0x19272b,roughness:1});
 const eye=new THREE.MeshStandardMaterial({color:0xd05a4b,emissive:0xdf402d,emissiveIntensity:1.65});
 const mesh=(g,parent,material,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,material);o.position.set(x,y,z);parent.add(o);return o};
 mesh(new THREE.CylinderGeometry(.22,.38,1.5,11),root,coat,0,1.25,0);
 mesh(new THREE.ConeGeometry(.42,.85,10),root,cloth,0,.75,0);
 mesh(new THREE.CylinderGeometry(.115,.13,.40,9),root,skin,0,2.14,0);
 const head=mesh(new THREE.SphereGeometry(.245,14,10),root,skin,0,2.43,-.045);head.scale.set(.83,1.19,.88);
 mesh(new THREE.BoxGeometry(.28,.055,.075),root,cloth,0,2.30,-.247);
 for(const side of [-1,1]){
  const arm=mesh(new THREE.CylinderGeometry(.065,.095,1.22,8),root,skin,side*.39,1.41,-.015);
  arm.rotation.z=side*.20;
  const hand=mesh(new THREE.SphereGeometry(.095,8,6),root,skin,side*.5,.78,-.02);hand.scale.set(.75,1.4,.8);
  const leg=mesh(new THREE.CylinderGeometry(.09,.145,1.12,9),root,cloth,side*.19,.49,0);
  leg.userData.leg=true;leg.userData.side=side;
  const foot=mesh(new THREE.BoxGeometry(.22,.14,.39),root,cloth,side*.19,.08,-.1);
  const e=mesh(new THREE.SphereGeometry(.05,9,8),root,eye,side*.09,2.45,-.25);
  const finger=mesh(new THREE.CylinderGeometry(.018,.008,.2,6),root,skin,side*.53,.63,-.02);
  finger.rotation.z=-side*.15;
 }
 // Seams and a damaged medical wristband
 mesh(new THREE.BoxGeometry(.18,.07,.105),root,skin,.48,.95,.01);
 const shadow=mesh(new THREE.CircleGeometry(.48,18),root,new THREE.MeshBasicMaterial({color:0x070c0e,transparent:true,opacity:.32,depthWrite:false}),0,.013,0);
 shadow.rotation.x=-Math.PI/2;
 const legs=root.children.filter(o=>o.userData.leg);
 return {root,legs,animate(time){legs.forEach(o=>o.rotation.x=Math.sin(time+(o.userData.side===-1?0:Math.PI))*.19)}};
}
