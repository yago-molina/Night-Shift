import * as THREE from 'three';
export class Player{
 constructor(camera,input,collision){
 this.camera=camera;this.input=input;this.collision=collision;this.position=new THREE.Vector3(-3,0,-7);this.yaw=0;this.pitch=0;this.height=1.7;this.vy=0;this.stamina=100;this.hidden=false;this.hiddenPos=null;this.hidingId=null;this.battery=100;this.flashPressed=false;this.bob=0;this.cameraBob=0;this.moving=false;
 this.flashlight=new THREE.SpotLight(0xf4f9ff,28,23,Math.PI/8,.45,1.3);this.flashlight.position.set(0,-.08,0);this.flashlight.target.position.set(0,0,-10);camera.add(this.flashlight,this.flashlight.target);this.flashlight.visible=false;
 }
 hideAt(x,z,id=null){this.hidden=true;this.hidingId=id;this.hiddenPos=this.position.clone();this.position.set(x,0,z);this.flashlight.visible=false}
 emerge(){if(!this.hidden)return;this.hidden=false;this.hidingId=null;if(this.hiddenPos){this.position.copy(this.hiddenPos);this.hiddenPos=null}}
 update(dt){
 const [mx,my]=this.input.consumeMouse();this.yaw-=mx*.0022;this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch-my*.0022));this.camera.rotation.order='YXZ';this.camera.rotation.set(this.pitch,this.yaw,0);
 const crouch=this.hidden||this.input.down('ControlLeft')||this.input.down('ControlRight');
 const moveX=this.hidden?0:Number(this.input.down('KeyD'))-Number(this.input.down('KeyA'));
 const moveZ=this.hidden?0:Number(this.input.down('KeyS'))-Number(this.input.down('KeyW'));
 const moving=!!(moveX||moveZ),running=moving&&!crouch&&(this.input.down('ShiftLeft')||this.input.down('ShiftRight'))&&this.stamina>1;
 this.stamina=Math.min(100,Math.max(0,this.stamina+(running?-24:15)*dt));
 const length=Math.hypot(moveX,moveZ)||1,speed=crouch?1.55:running?5.4:3;
 const sin=Math.sin(this.yaw),cos=Math.cos(this.yaw),dx=(moveX*cos+moveZ*sin)/length*speed*dt,dz=(-moveX*sin+moveZ*cos)/length*speed*dt;
 this.collision.move(this.position,dx,dz);this.vy=Math.max(-20,this.vy-23*dt);this.position.y=Math.max(0,this.position.y+this.vy*dt);if(this.position.y===0)this.vy=0;
 const height=this.hidden?.92:crouch?1.02:1.7;this.height+=(height-this.height)*Math.min(1,dt*12);this.bob+=moving?dt*(running?12:crouch?5:8):0;const targetBob=moving?Math.sin(this.bob)*(.021*(running?1.6:crouch?.35:1)):0;this.cameraBob+=(targetBob-this.cameraBob)*Math.min(1,dt*10);this.camera.position.set(this.position.x,this.position.y+this.height+this.cameraBob,this.position.z);
 if(this.flashlight.visible){this.battery=Math.max(0,this.battery-2.2*dt);if(this.battery===0)this.flashlight.visible=false}
 const f=this.input.down('KeyF');if(f&&!this.flashPressed&&!this.hidden&&this.battery>0)this.flashlight.visible=!this.flashlight.visible;this.flashPressed=f;
 return {running,crouch,moving,stamina:this.stamina}
 }
}