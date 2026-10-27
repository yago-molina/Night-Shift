import * as THREE from 'three';

// Standalone, reusable 3D models. Dimensions are in world metres, origin at the floor unless stated.
const box=(parent,w,h,d,x,y,z,mat)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=true;parent.add(o);return o};
const cylinder=(parent,r,h,x,y,z,mat)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),mat);o.position.set(x,y,z);parent.add(o);return o};
export function makeLocker(materials){
 const m=materials,root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const steel=m.metal,edge=m.trim;
 box(body,.8,.09,.59,0,1.95,0,edge);box(body,.8,.09,.59,0,.07,0,edge);
 for(const x of [-.385,.385])box(body,.055,1.91,.59,x,1,0,steel);
 box(body,.75,1.85,.07,0,1,-.285,steel);
 box(body,.72,.045,.53,0,.35,0,edge);
 const hinge=new THREE.Group();hinge.position.set(-.37,0,.3);root.add(hinge);
 box(hinge,.735,1.82,.045,.365,1.03,0,steel);
 box(hinge,.62,.04,.012,.365,1.62,.035,edge);
 for(let i=0;i<5;i++)box(hinge,.39,.018,.01,.365,1.57-i*.065,.046,m.black);
 box(hinge,.085,.17,.047,.66,1.04,.067,m.warning);
 const inside=box(body,.5,.08,.42,0,1.65,-.03,m.dark);
 const opening={value:0,target:0,update(dt){this.value+=(this.target-this.value)*Math.min(1,dt*7);hinge.rotation.y=-this.value*1.67}};
 return {group:root,hinge,opening,inside};
}
export function makeDrawer(materials){
 const m=materials,root=new THREE.Group(),fixed=new THREE.Group(),tray=new THREE.Group();
 root.add(fixed,tray);
 box(fixed,.79,.39,.57,0,.23,0,m.wood);
 box(fixed,.7,.04,.47,0,.425,0,m.trim);
 box(tray,.71,.045,.47,0,.075,0,m.wood);
 box(tray,.71,.29,.04,0,.23,-.21,m.wood);
 for(const x of [-.33,.33])box(tray,.035,.24,.42,x,.22,0,m.wood);
 box(tray,.77,.34,.055,0,.23,.29,m.trim);
 box(tray,.21,.045,.065,0,.22,.343,m.metal);
 const opening={value:0,target:0,update(dt){this.value+=(this.target-this.value)*Math.min(1,dt*8);tray.position.z=this.value*.36}};
 return {group:root,tray,opening};
}
export function makeHospitalDoor(materials){
 const root=new THREE.Group(),leaf=new THREE.Group();root.add(leaf);
 box(leaf,1.57,2.54,.075,.785,1.27,0,materials.wood);
 box(leaf,1.45,.055,.089,.785,2.23,0,materials.trim);
 box(leaf,.44,.43,.085,.75,1.66,.002,materials.glass);
 box(leaf,.42,.032,.104,.75,1.87,.002,materials.metal);
 const plate=box(leaf,.18,.27,.102,1.32,1.15,.005,materials.metal);
 box(leaf,.16,.055,.18,1.32,1.12,.13,materials.metal);
 const opening={value:0,target:0,update(dt){this.value+=(this.target-this.value)*Math.min(1,dt*9);root.rotation.y=-this.value*Math.PI/2}};
 return {group:root,leaf,opening,plate};
}
export function makeEvidenceFolder(materials,{important=false}={}){
 const root=new THREE.Group(),paper=new THREE.MeshStandardMaterial({color:important?0xc8a05e:0xc4c2b1,roughness:.92});
 box(root,.4,.025,.5,0,0,0,paper);
 box(root,.38,.009,.37,.005,.025,-.045,materials.bed);
 for(let i=0;i<4;i++)box(root,.25,.003,.009,-.03,.033,-.1+i*.065,materials.trim);
 if(important){box(root,.18,.013,.04,0,.035,.14,materials.warning)}
 return root;
}
export function makeCollectible(materials,type){
 const g=new THREE.Group(),m=materials;
 if(type==='key'){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.10,.024,10,18),m.warning);ring.position.y=.07;g.add(ring);
  box(g,.044,.29,.038,0,-.10,0,m.warning);box(g,.13,.052,.04,.045,-.215,0,m.warning);
 }else{
  box(g,.21,.33,.15,0,.15,0,new THREE.MeshStandardMaterial({color:0x6aab8c,roughness:.63}));
  box(g,.12,.045,.09,0,.34,0,m.metal);
  box(g,.16,.075,.157,0,.07,.001,m.black);
 }
 return g;
}
export function makeTerminal(materials){
 const group=new THREE.Group();box(group,.76,.49,.18,0,.32,0,materials.black);
 box(group,.66,.38,.025,0,.33,.105,materials.screen);
 box(group,.6,.045,.04,0,.12,.14,materials.warning);
 box(group,.22,.12,.24,0,.035,-.1,materials.metal);
 return group;
}