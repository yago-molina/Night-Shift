import * as THREE from 'three';
export function installLighting(scene){
 scene.background=new THREE.Color('#253036');scene.fog=new THREE.FogExp2(0x253036,.012);
 scene.add(new THREE.HemisphereLight(0xc8e0ed,0x3c4447,1.13));
 scene.add(new THREE.AmbientLight(0xb1c9d1,.23));
 const lights=[];
 const add=(x,y,z,color=0xd5e9e8,intensity=12,distance=10)=>{
  const l=new THREE.PointLight(color,intensity,distance,2);l.position.set(x,y,z);l.userData.baseIntensity=intensity;
  scene.add(l);lights.push(l);return l;
 };
 for(let x=-12;x<=12;x+=8)add(x,3.12,0,0xdceef0,12.5,11);
 for(const x of [-11,-3,5,12]){add(x,3.05,-8,0xb9e7e1,x===-3?12.5:8.5,10);add(x,3.05,8,0xd0e0d9,8.5,10)}
 let time=0;const flashing=new Map();let circuitOn=true;
 return {
  update(dt){time+=dt;
   for(const l of lights){let multiplier=1;
    if(l===lights[5])multiplier=(Math.sin(time*1.5)>.997?.44:1);
    const f=flashing.get(l);if(f){
     f.remaining-=dt;const flicker=Math.sin(time*38)+Math.sin(time*61);
     multiplier*=Math.max(.38,Math.min(1,.76+flicker*.2));
     if(f.remaining<=0)flashing.delete(l);
    }
    l.intensity=l.userData.baseIntensity*multiplier*(circuitOn?1:.055);
   }
  },
  setPower(on){circuitOn=Boolean(on)},
  flickerNearest(pos,duration=2.5){
   let best=null,dist=Infinity;
   for(const l of lights){const d=Math.hypot(pos.x-l.position.x,pos.z-l.position.z);if(d<dist){dist=d;best=l}}
   if(best)flashing.set(best,{remaining:duration});
  },
  lights
 };
}