import * as THREE from 'three';
import {AIState,StateMachine} from './StateMachine.js';
import {Navigation} from './Navigation.js';
import {createCreatureModel} from '../models/CreatureModel.js';
const V=(x,z)=>new THREE.Vector3(x,0,z);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export class Monster{
 constructor(scene,collision,player,doors,{onAttack=()=>{},onState=()=>{}}={}){
  this.scene=scene;this.collision=collision;this.player=player;this.doors=doors;this.onAttack=onAttack;
  this.position=V(13,0,9);this.home=this.position.clone();this.lastKnown=null;
  this.navigation=new Navigation(collision);this.machine=new StateMachine(AIState.PATROL,onState);
  this.path=[];this.pathTime=0;this.target=null;this.listenTimer=0;this.lostTime=0;this.searchTime=0;this.scanTime=0;
  this.facing=new THREE.Vector3(0,0,-1);this.suspicion=new Map();
  this.patrol=[V(13,9),V(12,0),V(5,0),V(-3,0),V(-11,0),V(-11,9),V(-3,9),V(5,9),V(13,9)];
  this.patrolIndex=0;this.step=0;this.elapsed=0;this.grace=20;this.active=false;
  this.buildModel();
 }
 buildModel(){
  const asset=createCreatureModel();this.creatureAsset=asset;this.model=asset.root;
  this.scene.add(this.model);this.model.position.copy(this.position);
 }
 isOnPlannedRoute(door){
  if(door.isOpen)return false;
  if(door.secure&&this.state!==AIState.CHASE)return false;
  const near=dist(this.position,door.position);
  if(near>1.55||!this.path.length)return false;
  // A door opens only when the NEXT route segments actually pass through its frame.
  let previous=this.position;
  for(const node of this.path.slice(0,12)){
   if(dist(this.position,node)>3.25)break;
   const a=previous.z-door.position.z,b=node.z-door.position.z;
   const crossing=(a<=0&&b>=0)||(a>=0&&b<=0);
   if(crossing&&Math.min(Math.abs(a),Math.abs(b))<1.15){
    const denominator=Math.abs(node.z-previous.z);
    const k=denominator<.001?0:Math.abs(a)/denominator;
    const crossingX=previous.x+(node.x-previous.x)*k;
    if(Math.abs(crossingX-door.position.x)<.76)return true;
   }
   previous=node;
  }
  return false;
 }

 get state(){return this.machine.state}
 setState(s){this.machine.set(s);this.path=[];this.pathTime=0;if(s===AIState.SEARCH){this.searchTime=0;this.scanTime=0}}
 remember(pos){this.lastKnown=V(pos.x,pos.z)}
 rayClear(target){const dx=target.x-this.position.x,dz=target.z-this.position.z;const d=Math.hypot(dx,dz);const steps=Math.ceil(d/.25);
  for(let i=1;i<steps;i++){const t=i/steps;if(this.collision.blocked(this.position.x+dx*t,this.position.z+dz*t,.07))return false}
  return true;
 }
 seesPlayer(){
  if(this.player.hidden||!this.active)return false;
  const d=dist(this.position,this.player.position);
  if(d>11)return false;
  const dir=V(this.player.position.x-this.position.x,this.player.position.z-this.position.z).normalize();
  const inCone=this.facing.dot(dir)>Math.cos(Math.PI*.44);
  return (d<2.3||inCone)&&this.rayClear(this.player.position);
 }
 hearsPlayer(status){
  if(this.player.hidden||!this.active)return false;
  const d=dist(this.position,this.player.position);
  // Running travels further than walking; crouching is almost silent.
  const radius=status.running?10:status.crouch?1.15:4.0;
  return this.playerMoving(status)&&d<=radius;
 }
 playerMoving(status){return Boolean(status.moving)}
 hearNoise(pos,radius=6){if(!this.active||this.state===AIState.CHASE||this.state===AIState.ATTACK)return;if(dist(this.position,pos)<=radius){this.investigate(pos)}}
 investigate(pos){this.remember(pos);if(this.state!==AIState.CHASE&&this.state!==AIState.ATTACK)this.setState(AIState.INVESTIGATE)}
 choosePatrol(){this.target=this.patrol[this.patrolIndex];if(dist(this.position,this.target)<1)this.patrolIndex=(this.patrolIndex+1)%this.patrol.length}
 routeTo(point,dt){
  this.pathTime-=dt;
  if(this.pathTime<=0){this.path=this.navigation.path(this.position,point);this.pathTime=this.state===AIState.CHASE?.35:.85}
  while(this.path.length&&dist(this.position,this.path[0])<.34)this.path.shift();
  return this.path[0]||point;
 }
 moveToward(point,speed,dt){
  for(const door of this.doors){if(this.isOnPlannedRoute(door))door.openByMonster()}
  const d=dist(this.position,point);if(d<.08)return;
  const dx=(point.x-this.position.x)/d,dz=(point.z-this.position.z)/d;
  const step=Math.min(speed*dt,d);
  const x=this.position.x,z=this.position.z;
  this.collision.move(this.position,dx*step,dz*step);
  const travelled=Math.hypot(this.position.x-x,this.position.z-z);
  if(travelled>.001){this.facing.set(dx,0,dz);this.model.rotation.y=Math.atan2(-dx,-dz);this.step+=dt*speed*4}
  if(travelled<step*.3)this.pathTime=0;
 }
 lookForHidingSpot(dt){
  if(!this.lastKnown)return false;
  // Check only the likely cabinet, not every hiding spot through walls.
  let best=null,d=Infinity;
  for(const h of this.hideSpots||[]){const a=dist(h.position,this.lastKnown);if(a<d){best=h;d=a}}
  if(!best||d>3.1||dist(this.position,best.position)>2.25)return false;
  this.scanTime+=dt;
  if(this.scanTime<2.2)return false;
  const count=(this.suspicion.get(best.id)||0)+1;this.suspicion.set(best.id,count);
  this.scanTime=-5;
  if(this.player.hidden&&this.player.hidingId===best.id&&(count>=2||dist(this.lastKnown,best.position)<1.1)){this.attack();return true}
  return false;
 }
 attack(){this.setState(AIState.ATTACK);this.onAttack()}
 update(dt,status,hideSpots=[]){
  this.hideSpots=hideSpots;this.elapsed+=dt;this.machine.update(dt);
  this.model.visible=this.active;
  if(!this.active){if(this.elapsed>=this.grace){this.active=true;this.model.visible=true}return}
  if(this.state===AIState.ATTACK)return;
  const sees=this.seesPlayer();
  if(sees){this.remember(this.player.position);this.lostTime=0;if(this.state!==AIState.CHASE)this.setState(AIState.CHASE)}
  else if(this.state===AIState.CHASE){this.lostTime+=dt;if(this.lostTime>2.2){this.setState(AIState.SEARCH)}}
  this.listenTimer-=dt;
  if(this.listenTimer<=0){this.listenTimer=.4;if(!sees&&this.hearsPlayer(status)){this.investigate(this.player.position)}}
  const s=this.state;
  if(s===AIState.PATROL||s===AIState.RETURN){
   this.choosePatrol();this.moveToward(this.routeTo(this.patrol[this.patrolIndex],dt),s===AIState.PATROL?1.28:1.6,dt);
   if(dist(this.position,this.patrol[this.patrolIndex])<.7){this.patrolIndex=(this.patrolIndex+1)%this.patrol.length;if(s===AIState.RETURN)this.setState(AIState.PATROL)}
  }else if(s===AIState.INVESTIGATE){
   if(this.lastKnown){this.moveToward(this.routeTo(this.lastKnown,dt),2.1,dt);if(dist(this.position,this.lastKnown)<1)this.setState(AIState.SEARCH)}
   else this.setState(AIState.RETURN);
  }else if(s===AIState.CHASE){
   const target=this.lastKnown||this.player.position;
   this.moveToward(this.routeTo(target,dt),3.5,dt);
   if(sees&&!this.player.hidden&&dist(this.position,this.player.position)<.85)this.attack();
  }else if(s===AIState.SEARCH){
   this.searchTime+=dt;
   if(this.lookForHidingSpot(dt))return;
   if(this.lastKnown&&dist(this.position,this.lastKnown)>1.15)this.moveToward(this.routeTo(this.lastKnown,dt),1.8,dt);
   else{this.model.rotation.y+=dt*.55;this.facing.set(-Math.sin(this.model.rotation.y),0,-Math.cos(this.model.rotation.y))}
   if(this.searchTime>8){this.lastKnown=null;this.setState(AIState.RETURN)}
  }
  this.model.position.copy(this.position);
  this.model.position.y=Math.abs(Math.sin(this.step))*.023;
  this.creatureAsset.animate(this.step);
 }
 reset(){this.position.copy(this.home);this.model.position.copy(this.home);this.active=false;this.elapsed=0;this.lastKnown=null;this.setState(AIState.PATROL)}
}