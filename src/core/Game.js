import * as THREE from 'three';
import {InputManager} from './InputManager.js';
import {Hospital} from '../world/Hospital.js';
import {Player} from '../player/Player.js';
import {HUD} from '../ui/HUD.js';
import {Menu} from '../ui/Menu.js';
import {PostProcessing} from './PostProcessing.js';
import {InventorySystem} from '../systems/InventorySystem.js';
import {InteractionSystem} from '../systems/InteractionSystem.js';
import {populateInteractables} from '../systems/Interactables.js';
import {InventoryUI} from '../ui/InventoryUI.js';
import {DocumentUI} from '../ui/DocumentUI.js';
import {Monster} from '../ai/Monster.js';
import {GameOverUI} from '../ui/GameOverUI.js';
import {AIDebugUI} from '../ui/AIDebugUI.js';
export class Game{
 constructor(root){
  this.running=false;this.elapsed=0;this.overlay=null;
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.08,95);
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setSize(innerWidth,innerHeight);
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.75;
  root.append(this.renderer.domElement);
  this.input=new InputManager(this.renderer.domElement);
  this.hospital=new Hospital(this.scene);this.scene.add(this.camera);
  this.player=new Player(this.camera,this.input,this.hospital.collision);
  this.player.flashlight.intensity=42;this.player.flashlight.distance=19;
  this.hud=new HUD(root);this.menu=new Menu(root,()=>this.input.lock());
  this.inventory=new InventorySystem();
  this.inventoryUI=new InventoryUI(root,()=>this.closeOverlay());
  this.documentUI=new DocumentUI(root,()=>this.closeOverlay());
  this.interactions=new InteractionSystem(this.camera,this.scene,this.player,this.inventory,t=>this.hud.message(t),doc=>this.openDocument(doc));
  const worldItems=populateInteractables(this.hospital,this.interactions,this.player,this.inventory,t=>this.hud.message(t),(p,r)=>this.monster?.hearNoise(p,r));
  this.monster=new Monster(this.scene,this.hospital.collision,this.player,worldItems.doors,{onAttack:()=>this.onCaught(),onState:(next)=>{if(next==='CHASE')this.hud.message('Você ouviu passos acelerando atrás de você...')}});
  this.hideSpots=worldItems.hideSpots;
  this.gameOverUI=new GameOverUI(root,()=>window.location.reload());
  this.debugUI=new AIDebugUI(root);
  this.post=new PostProcessing(this.renderer,this.scene,this.camera);
  this.input.onLockChange=locked=>{
   this.running=locked;
   if(locked){this.overlay=null;this.inventoryUI.hide();this.documentUI.hide();this.menu.hide();this.hud.show()}
   else if(this.overlay){this.menu.hide();this.hud.hide()}
   else{this.hud.hide();this.menu.show(this.elapsed>0)}
  };
  window.addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);this.post.resize(innerWidth,innerHeight)});
  window.addEventListener('keydown',e=>{if(!this.overlay)return;if(['Escape','Tab','KeyE'].includes(e.code)){e.preventDefault();this.closeOverlay()}});
  this.clock=new THREE.Clock();this.renderer.setAnimationLoop(()=>this.update());
 }
 onCaught(){this.overlay='gameover';this.running=false;this.hud.hide();this.menu.hide();this.gameOverUI.show();if(document.pointerLockElement)document.exitPointerLock()}
 openInventory(){this.overlay='inventory';this.inventoryUI.show(this.inventory.getAll());document.exitPointerLock()}
 openDocument(doc){this.overlay='document';this.documentUI.show(doc);document.exitPointerLock()}
 closeOverlay(){if(!this.overlay)return;this.overlay=null;this.inventoryUI.hide();this.documentUI.hide();this.input.clearPressed();this.input.lock()}
 update(){
  const dt=Math.min(this.clock.getDelta(),.05);
  if(this.running){
   this.elapsed+=dt;
   const status=this.player.update(dt);this.hospital.update(dt);
   this.monster.update(dt,status,this.hideSpots);
   if(this.input.pressed('F3'))this.debugUI.toggle();
   this.debugUI.update(this.monster,this.player);
   let hint=this.player.hidden?'[E] Sair do esconderijo':this.interactions.update();
   if(this.overlay==='gameover'){this.post.render(dt);return}
   if(this.input.pressed('KeyE')){
    if(this.player.hidden){this.player.emerge();this.hud.message('Você saiu do esconderijo.')}
    else this.interactions.interact()
   }
   if(this.input.pressed('KeyR')){
    if(this.player.battery>=99){this.hud.message('A lanterna já está carregada.')}
    else if(this.inventory.consume('battery')){this.player.battery=100;this.hud.message('Bateria da lanterna substituída.')}
    else this.hud.message('Nenhuma bateria reserva no inventário.')
   }
   if(this.input.pressed('Tab'))this.openInventory();
   this.hud.update(this.elapsed,status,hint,this.player.battery,this.inventory.count('battery'),dt);
  }else this.input.clearPressed();
  this.post.render(dt);
 }
}