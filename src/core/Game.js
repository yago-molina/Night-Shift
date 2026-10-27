import * as THREE from 'three';
import {InputManager} from './InputManager.js';
import {Hospital} from '../world/Hospital.js';
import {Player} from '../player/Player.js';
import {HUD} from '../ui/HUD.js';
import {Menu} from '../ui/Menu.js';
import {PostProcessing} from './PostProcessing.js';
export class Game{
 constructor(root){
  this.running=false;this.elapsed=0;this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.08,95);
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setSize(innerWidth,innerHeight);
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.75;
  root.append(this.renderer.domElement);this.input=new InputManager(this.renderer.domElement);
  this.hospital=new Hospital(this.scene);this.scene.add(this.camera);this.player=new Player(this.camera,this.input,this.hospital.collision);
  this.player.flashlight.intensity=42;this.player.flashlight.distance=19;
  this.hud=new HUD(root);this.menu=new Menu(root,()=>this.input.lock());
  this.post=new PostProcessing(this.renderer,this.scene,this.camera);
  this.input.onLockChange=locked=>{this.running=locked;if(locked){this.menu.hide();this.hud.show()}else{this.hud.hide();this.menu.show(this.elapsed>0)}};
  window.addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);this.post.resize(innerWidth,innerHeight)});
  this.clock=new THREE.Clock();this.renderer.setAnimationLoop(()=>this.update());
 }
 update(){let dt=Math.min(this.clock.getDelta(),.05);if(this.running){this.elapsed+=dt;this.hud.update(this.elapsed,this.player.update(dt));this.hospital.update(dt)}this.post.render(dt)}
}