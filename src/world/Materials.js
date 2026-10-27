import * as THREE from 'three';
function texture(kind){
 const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
 let seed=kind.length*919+73;function rand(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
 const base=kind==='tile'?'#6a797a':kind==='wall'?'#879397':kind==='ceiling'?'#acb6b6':kind==='rust'?'#5a666b':'#697477';
 g.fillStyle=base;g.fillRect(0,0,512,512);
 if(kind==='tile'){const s=64;for(let y=0;y<8;y++)for(let x=0;x<8;x++){const v=Math.floor(rand()*22);g.fillStyle='rgba(210,218,207,'+(v/390)+')';g.fillRect(x*s+3,y*s+3,s-5,s-5)}g.strokeStyle='rgba(18,32,37,.32)';g.lineWidth=3;for(let i=0;i<=8;i++){g.beginPath();g.moveTo(i*s,0);g.lineTo(i*s,512);g.stroke();g.beginPath();g.moveTo(0,i*s);g.lineTo(512,i*s);g.stroke()}}
 if(kind==='wall'){g.fillStyle='rgba(44,65,69,.24)';g.fillRect(0,380,512,132);g.fillStyle='rgba(23,35,40,.35)';g.fillRect(0,376,512,5)}
 if(kind==='ceiling'){g.strokeStyle='rgba(64,75,78,.25)';g.lineWidth=3;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*128,0);g.lineTo(i*128,512);g.stroke();g.beginPath();g.moveTo(0,i*128);g.lineTo(512,i*128);g.stroke()}}
 for(let i=0;i<3600;i++){const x=rand()*512,y=rand()*512,s=rand()*4+.4;g.fillStyle=rand()>.48?'rgba(14,25,29,.085)':'rgba(230,237,229,.06)';g.fillRect(x,y,s,s)}
 for(let i=0;i<(kind==='rust'?130:24);i++){g.fillStyle='rgba(76,47,32,'+(rand()*.18)+')';g.beginPath();g.ellipse(rand()*512,rand()*512,rand()*18+2,rand()*9+1,rand()*6,0,Math.PI*2);g.fill()}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;
}
export function createMaterials(){
 const wallMap=texture('wall'),floorMap=texture('tile'),ceilMap=texture('ceiling'),metalMap=texture('rust');
 floorMap.repeat.set(8,6);wallMap.repeat.set(2,1);ceilMap.repeat.set(8,6);metalMap.repeat.set(1,1);
 const mat=(color,roughness=0.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 return {
 wall:new THREE.MeshStandardMaterial({map:wallMap,roughness:.98}),
 floor:new THREE.MeshStandardMaterial({map:floorMap,roughness:.82,metalness:.03}),
 ceil:new THREE.MeshStandardMaterial({map:ceilMap,roughness:1}),
 metal:new THREE.MeshStandardMaterial({map:metalMap,roughness:.65,metalness:.5}),
 dark:mat(0x29363d),wood:mat(0x55463d),bed:mat(0xadbdbd),fabric:mat(0x839b9e),
 trim:mat(0x42565c),pipe:mat(0x617378,.7,.55),glass:new THREE.MeshStandardMaterial({color:0x97c7c8,roughness:.15,metalness:.25,transparent:true,opacity:.43,depthWrite:false}),
 screen:new THREE.MeshStandardMaterial({color:0x122b2c,emissive:0x166f68,emissiveIntensity:.7}),
 light:new THREE.MeshStandardMaterial({color:0xdceef0,emissive:0xb1e5e6,emissiveIntensity:1.4}),
 rust:mat(0x654e42),warning:mat(0xd1a46a),black:mat(0x151c22)
 };
}