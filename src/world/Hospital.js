import * as THREE from 'three';
import {CollisionWorld} from './CollisionWorld.js';
import {installLighting} from './Lighting.js';
import {createMaterials} from './Materials.js';
export class Hospital{
 constructor(scene){this.scene=scene;this.collision=new CollisionWorld();this.m=createMaterials();this.build();this.lighting=installLighting(scene)}
 update(dt){this.lighting.update(dt)}
 box(x,y,z,w,h,d,mat,solid=false){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.receiveShadow=true;this.scene.add(o);if(solid)this.collision.add(x,z,w,d);return o}
 cyl(x,y,z,r,h,mat){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,10),mat);o.position.set(x,y,z);this.scene.add(o);return o}
 wallX(a,b,z,doors=[]){let from=a;for(const c of [...doors].sort((x,y)=>x-y)){const left=c-.9,right=c+.9;if(left>from)this.box((from+left)/2,1.75,z,left-from,3.5,.25,this.m.wall,true);this.box(c,3.08,z,1.8,.84,.25,this.m.wall);this.doorframe(c,z,'x');from=right}if(from<b)this.box((from+b)/2,1.75,z,b-from,3.5,.25,this.m.wall,true)}
 wallZ(a,b,x,doors=[]){let from=a;for(const c of [...doors].sort((u,v)=>u-v)){const left=c-.9,right=c+.9;if(left>from)this.box(x,1.75,(from+left)/2,.25,3.5,left-from,this.m.wall,true);this.box(x,3.08,c,.25,.84,1.8,this.m.wall);this.doorframe(x,c,'z');from=right}if(from<b)this.box(x,1.75,(from+b)/2,.25,3.5,b-from,this.m.wall,true)}
 doorframe(x,z,axis){if(axis==='x'){this.box(x-.93,1.34,z,.09,2.68,.35,this.m.trim);this.box(x+.93,1.34,z,.09,2.68,.35,this.m.trim);this.box(x,2.68,z,1.93,.09,.35,this.m.trim)}else{this.box(x,1.34,z-.93,.35,2.68,.09,this.m.trim);this.box(x,1.34,z+.93,.35,2.68,.09,this.m.trim);this.box(x,2.68,z,.35,.09,1.93,this.m.trim)}}
 desk(x,z){this.box(x,.9,z,2.35,.15,.9,this.m.wood,true);for(const s of [-1,1])this.box(x+s*.95,.47,z,.12,.83,.74,this.m.metal);this.box(x,.82,z,.9,.04,.32,this.m.dark)}
 monitor(x,z){this.box(x,1.43,z,.78,.76,.1,this.m.black);this.box(x,1.43,z+.065,.65,.6,.025,this.m.screen);this.box(x,1.02,z,.05,.12,.06,this.m.metal)}
 bed(x,z){this.box(x,.48,z,1.3,.18,2.2,this.m.metal,true);this.box(x,.65,z,1.14,.17,1.96,this.m.bed);this.box(x,.78,z-.7,1,.12,.42,this.m.fabric);for(const a of [-.54,.54])for(const b of [-.91,.91]){this.cyl(x+a,.25,z+b,.045,.45,this.m.metal);this.cyl(x+a,.06,z+b,.08,.12,this.m.black)}this.box(x,.84,z+1.07,1.3,.55,.09,this.m.metal)}
 cart(x,z){this.box(x,.85,z,1,.07,.52,this.m.metal,true);this.box(x,.35,z,1,.07,.52,this.m.metal);for(const a of [-.43,.43])for(const b of [-.21,.21])this.cyl(x+a,.5,z+b,.025,.8,this.m.pipe)}
 cabinet(x,z){this.box(x,1,z,.8,2,.55,this.m.metal,true);this.box(x,1.05,z+.286,.7,1.7,.02,this.m.trim);for(let y=.5;y<1.8;y+=.55)this.box(x,y,z+.305,.47,.018,.02,this.m.pipe)}
 sign(text,x,z){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#263c43';ctx.fillRect(0,0,512,128);ctx.fillStyle='#e3efed';ctx.font='bold 39px Arial';ctx.textAlign='center';ctx.fillText(text,256,79);const o=new THREE.Mesh(new THREE.PlaneGeometry(2.8,.7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));o.position.set(x,2.45,z);this.scene.add(o)}
 fixture(x,z){this.box(x,3.46,z,1.35,.055,.52,this.m.trim);this.box(x,3.405,z,1.19,.04,.39,this.m.light);for(const dx of [-.63,.63])this.box(x+dx,3.44,z,.06,.055,.5,this.m.metal)}
 pipe(x,z,h=3.24){this.cyl(x,h,z,.045,.45,this.m.pipe)}
 stain(x,z,w,d){this.box(x,.009,z,w,.008,d,this.m.rust)}
 build(){
  this.box(0,-.13,0,32,.25,26,this.m.floor);this.box(0,3.58,0,32,.16,26,this.m.ceil);
  this.wallX(-16,16,-13);this.wallX(-16,16,13);this.wallZ(-13,13,-16);this.wallZ(-13,13,16);
  this.wallX(-16,16,-2,[-11,-3,5,12]);this.wallX(-16,16,2,[-11,-3,5,12]);
  for(const x of [-7,1,9]){this.wallZ(-13,-2,x);this.wallZ(2,13,x)}
  this.desk(-3,-9.3);for(const x of [-4,-3,-2])this.monitor(x,-9.4);
  this.cabinet(-5.7,-11.5);this.desk(-12,-9);this.cabinet(-14,-11);this.desk(12,-9);
  this.cabinet(14,-11);this.cabinet(5,-11);
  for(const [x,z] of [[-12,6.7],[-9,9.7],[-3,8],[5,8]])this.bed(x,z);
  this.cart(12,8);this.cart(-5,10);this.cart(4,5);
  this.box(11,.9,11,1.5,.15,.7,this.m.metal,true);
  for(let x=-15;x<=15;x+=2){this.box(x,.012,0,.85,.014,.064,this.m.pipe)}
  for(const x of [-12,-4,4,12])for(const z of [-8,0,8])this.fixture(x,z);
  for(const [x,z] of [[-15,-10],[-6,11],[15,5],[9,-10]])this.pipe(x,z);
  for(const [x,z] of [[-14,3.5],[-1,11],[8,-4]])this.stain(x,z,.9,.4);
  this.sign('RECEPÇÃO',-11,-2.17);this.sign('SEGURANÇA',-3,-2.17);this.sign('ADMINISTRAÇÃO',12,-2.17);
 }
}