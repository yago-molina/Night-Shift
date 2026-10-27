import * as THREE from 'three';
export function installLighting(scene){
 scene.background=new THREE.Color('#253036');scene.fog=new THREE.FogExp2(0x253036,.012);
 scene.add(new THREE.HemisphereLight(0xc8e0ed,0x3c4447,1.65));
 const ambient=new THREE.AmbientLight(0xb1c9d1,.35);scene.add(ambient);
 const lights=[];
 const add=(x,y,z,color=0xd5e9e8,intensity=12,distance=10)=>{
  const l=new THREE.PointLight(color,intensity,distance,2);l.position.set(x,y,z);scene.add(l);lights.push(l);return l
 };
 for(let x=-12;x<=12;x+=8)add(x,3.12,0,0xdceef0,15,11);
 for(const x of [-11,-3,5,12]){add(x,3.05,-8,0xb9e7e1,x===-3?15:9,10);add(x,3.05,8,0xd0e0d9,10,10)}
 let time=0;
 return {update(dt){time+=dt;const l=lights[5];if(l)l.intensity=(Math.sin(time*1.5)>0.997?3:9)}};
}