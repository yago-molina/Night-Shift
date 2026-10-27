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
import {AudioSystem} from '../systems/AudioSystem.js';
import {TensionSystem} from '../systems/TensionSystem.js';
import {HorrorDirector} from '../systems/HorrorDirector.js';
import {PowerSystem} from '../systems/PowerSystem.js';
import {CCTVSystem} from '../systems/CCTVSystem.js';
import {SecurityUI} from '../ui/SecurityUI.js';
import {installSecurityInteractables} from '../systems/SecurityInteractables.js';
import {MissionSystem} from '../systems/MissionSystem.js';
import {SaveSystem} from '../systems/SaveSystem.js';
import {EndingUI} from '../ui/EndingUI.js';
import {GraphicsSettings} from './GraphicsSettings.js';
import {PerformanceUI} from '../ui/PerformanceUI.js';
export class Game{
 constructor(root){
  this.running=false;this.elapsed=0;this.overlay=null;this.settings=new GraphicsSettings();
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.08,95);
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.settings.preset.pixelRatio));this.renderer.setSize(innerWidth,innerHeight);
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.75;
  root.append(this.renderer.domElement);
  this.input=new InputManager(this.renderer.domElement);
  this.hospital=new Hospital(this.scene);this.scene.add(this.camera);
  this.player=new Player(this.camera,this.input,this.hospital.collision);
  this.player.flashlight.intensity=42;this.player.flashlight.distance=19;
  this.hud=new HUD(root);
  this.audio=new AudioSystem();this.tension=new TensionSystem();
  this.menu=new Menu(root,()=>{this.audio.start();this.input.lock()});
  this.menu.addSettings(options=>this.applySettings(options),this.settings.options);
  this.audio.setVolume(this.settings.options.volume/100);
  this.inventory=new InventorySystem();
  this.inventoryUI=new InventoryUI(root,()=>this.closeOverlay());
  this.documentUI=new DocumentUI(root,()=>this.closeOverlay());
  this.interactions=new InteractionSystem(this.camera,this.scene,this.player,this.inventory,t=>this.hud.message(t),doc=>this.openDocument(doc));
  const worldItems=populateInteractables(this.hospital,this.interactions,this.player,this.inventory,t=>this.hud.message(t),(p,r)=>{
    this.monster?.hearNoise(p,r);this.audio.effect('door',p,this.player.position)
  });
  this.monster=new Monster(this.scene,this.hospital.collision,this.player,worldItems.doors,{onAttack:()=>this.onCaught(),onState:(next)=>{if(next==='CHASE')this.hud.message('Você ouviu passos acelerando atrás de você...')}});
  this.hideSpots=worldItems.hideSpots;
  this.gameOverUI=new GameOverUI(root,()=>window.location.reload());
  this.debugUI=new AIDebugUI(root);
  this.post=new PostProcessing(this.renderer,this.scene,this.camera);
  this.power=new PowerSystem();
  this.cctv=new CCTVSystem(this.scene,this.renderer,this.power);
  this.cctv.attachMonitor(this.scene);
  this.performanceUI=new PerformanceUI(root);
  this.applySettings(this.settings.options);
  this.securityUI=new SecurityUI(root);
  this.alarmPulse=0;
  installSecurityInteractables({hospital:this.hospital,interactions:this.interactions,power:this.power,cctv:this.cctv,player:this.player,
    onCCTV:()=>{this.missions?.action('cctv');this.enterCCTV()},onMessage:t=>this.hud.message(t),onAlarm:()=>{
      const pos={x:-3,z:-9.2};this.monster.hearNoise(pos,45);this.audio.effect('alarm',pos,this.player.position);
    }});

  this.director=new HorrorDirector({audio:this.audio,lighting:this.hospital.lighting,post:this.post,monster:this.monster,player:this.player,onEvent:(kind,pos)=>{
    if(kind==='bang')this.monster.hearNoise(pos,7);
  }});
  this.saveSystem=new SaveSystem();
  this.missions=new MissionSystem({
   onMission:(objective)=>{this.hud.setMission(objective);this.hud.message('OBJETIVO ATUALIZADO: '+objective.title)},
   onEvent:(event)=>this.storyEvent(event),
   onCheckpoint:(reason)=>this.saveCheckpoint(reason)
  });
  this.interactions.onAction=(kind,data)=>{
   if(kind==='pickup'&&data.id==='security-key')this.missions.action('key');
   if(kind==='document'&&data.title.startsWith('Registro de ocorrência'))this.missions.action('incident');
   if(kind==='document'&&data.title.startsWith('Prontuário 013'))this.missions.action('evidence');
  };
  this.registerExtractionTerminal();
  this.endingUI=new EndingUI(root,{onRestart:()=>{this.saveSystem.clear();window.location.reload()},onContinue:()=>window.location.reload()});
  this.menu.setCheckpointControls(this.saveSystem.hasCheckpoint(),()=>{this.saveSystem.clear();window.location.reload()});
  this.restoreCheckpoint();
  this.hud.setMission(this.missions.objective);
  this.debugUI.setExtra?.(()=>({tension:this.tension.value,event:this.director.lastEvent}));
  this.input.onLockChange=locked=>{
   this.running=locked;
   if(locked){if(this.overlay==='ending')return;this.overlay=null;this.inventoryUI.hide();this.documentUI.hide();this.menu.hide();this.hud.show();this.audio.resume()}
   else if(this.overlay){this.menu.hide();this.hud.hide();this.securityUI.hide();this.cctv.exit();this.audio.pause()}
   else{this.hud.hide();this.securityUI.hide();this.cctv.exit();this.menu.show(this.elapsed>0);this.audio.pause()}
  };
  window.addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);this.post.resize(innerWidth,innerHeight)});
  window.addEventListener('keydown',e=>{if(!this.overlay)return;if(['Escape','Tab','KeyE'].includes(e.code)){e.preventDefault();this.closeOverlay()}});
  this.clock=new THREE.Clock();this.renderer.setAnimationLoop(()=>this.update());
 }
 enterCCTV(){if(!this.cctv.enter())return;this.securityUI.show();this.hud.hide();this.input.clearPressed()}
 exitCCTV(){this.cctv.exit();this.securityUI.hide();this.hud.show();this.input.clearPressed()}
 storyEvent(event){
  this.hud.message(event.title+' — '+event.body);
  if(event.minute===180)this.hospital.lighting.flickerNearest(this.player.position,3);
  if(event.minute===240)this.post.pulse(.65);
  if(event.minute===390)this.audio.effect('radio',null,null);
 }
 registerExtractionTerminal(){
  const THREE_MESH=new THREE.Mesh(new THREE.BoxGeometry(.48,.3,.15),this.hospital.m.screen);
  THREE_MESH.position.set(.76,1.45,-5.5);this.scene.add(THREE_MESH);
  this.interactions.register(THREE_MESH,{
   label:()=>this.missions.canExtract()?'[E] Encerrar turno e sair do hospital':'[E] Terminal de saída — liberado às 05:30',
   action:()=>{
    if(!this.missions.canExtract()){this.hud.message(this.missions.stage<5?'Conclua os objetivos antes de sair.':'A saída só será liberada às 05:30.');return}
    this.finishShift('terminal');
   }
  });
 }
 saveCheckpoint(reason){
  if(!this.missions||this.missions.finished)return;
  const data={version:1,missions:this.missions.snapshot(),player:{x:this.player.position.x,z:this.player.position.z,battery:this.player.battery,stamina:this.player.stamina},inventory:this.inventory.getAll(),power:{energy:this.power.energy,outage:this.power.outage,circuits:{...this.power.circuits}},reason};
  this.saveSystem.save(data);
 }
 restoreCheckpoint(){
  const data=this.saveSystem.load();if(!data||!this.missions.restore(data.missions))return;
  this.elapsed=this.missions.elapsed;
  if(data.player){
   const {x,z}=data.player;
   if(Number.isFinite(x)&&Number.isFinite(z)&&!this.hospital.collision.blocked(x,z))this.player.position.set(x,0,z);
   if(Number.isFinite(data.player.battery))this.player.battery=Math.max(0,Math.min(100,data.player.battery));
   if(Number.isFinite(data.player.stamina))this.player.stamina=Math.max(0,Math.min(100,data.player.stamina));
  }
  if(Array.isArray(data.inventory)){
   for(const item of data.inventory){if(this.inventory.has(item.id))continue;this.inventory.add(item)}
   for(const entry of [...this.interactions.entries]){
    if(entry.kind==='pickup'&&this.inventory.has(entry.item.id)){entry.object.visible=false;this.interactions.unregister(entry)}
   }
  }
  if(data.power){
   this.power.energy=Math.max(0,Math.min(this.power.capacity,Number(data.power.energy)||0));
   this.power.outage=Boolean(data.power.outage)||this.power.energy===0;
   this.power.circuits={...this.power.circuits,...data.power.circuits};
  }
  this.monster.reset();this.hud.message('Checkpoint restaurado: '+this.missions.clock);
 }
 finishShift(reason){
  if(this.missions.finished)return;
  const end=this.missions.complete(reason);
  this.running=false;this.overlay='ending';this.cctv.exit();this.securityUI.hide();this.hud.hide();this.menu.hide();this.audio.pause();
  this.endingUI.show(end,this.saveSystem.hasCheckpoint());
  if(document.pointerLockElement)document.exitPointerLock();
 }
 applySettings(options){
  this.settings.setAll(options);
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.settings.preset.pixelRatio));
  this.renderer.setSize(innerWidth,innerHeight);
  this.post.resize(innerWidth,innerHeight);
  this.post.setEffectsEnabled(this.settings.preset.effects);
  this.cctv.configure(this.settings.preset.cctvSize,this.settings.preset.cctvInterval);
  this.audio.setVolume(this.settings.options.volume/100);
  this.input.sensitivity=this.settings.options.mouseSensitivity/100;
 }
 onCaught(){this.audio.effect('chase');this.finishShift('caught')}
 openInventory(){this.overlay='inventory';this.inventoryUI.show(this.inventory.getAll());document.exitPointerLock()}
 openDocument(doc){this.overlay='document';this.documentUI.show(doc);document.exitPointerLock()}
 closeOverlay(){if(!this.overlay)return;this.overlay=null;this.inventoryUI.hide();this.documentUI.hide();this.input.clearPressed();this.input.lock()}
 update(){
  const dt=Math.min(this.clock.getDelta(),.05);
  if(this.running){
   this.elapsed+=dt;
   const viewing=this.cctv.active;
   const status=viewing?{running:false,crouch:false,moving:false,stamina:this.player.stamina}:this.player.update(dt);
   this.hospital.lighting.setPower(this.power.enabled('lights'));
   this.hospital.update(dt);
   this.power.update(dt,{cctvActive:viewing});
   this.cctv.update(dt,Math.hypot(this.player.position.x+3,this.player.position.z+9.3)<3.5);
   if(viewing&&!this.cctv.active)this.exitCCTV();
   this.monster.update(dt,status,this.hideSpots);
   if(this.missions.finished){this.post.render(dt);return}
   const atSecurity=this.player.position.x>-6.8&&this.player.position.x<.8&&this.player.position.z< -2.3&&this.player.position.z> -12.7;
   this.missions.update(dt,{atSecurity});
   this.elapsed=this.missions.elapsed;
   if(this.missions.minutes>=420){this.finishShift('dawn');this.post.render(dt);return}
   if(this.debugUI.enabled&&this.input.pressed('F4')){this.missions.elapsed=Math.min(390*6,this.missions.elapsed+60*6);this.hud.message('TESTE: relógio avançado 1 hora.')}
   const stress=this.tension.update(dt,this.monster,this.player);
   this.audio.update(dt,stress,this.player,status);
   this.director.update(dt,stress);
   this.post.setTension(stress);
   this.hud.setTension?.(stress);
   if(this.power.alarmRemaining>0){
     this.alarmPulse-=dt;
     if(this.alarmPulse<=0){this.alarmPulse=.9;this.audio.effect('alarm',{x:-3,z:-9.2},this.player.position)}
   }else this.alarmPulse=0;
   if(this.input.pressed('F3'))this.debugUI.toggle();
   if(this.input.pressed('F2'))this.performanceUI.toggle();
   this.debugUI.update(this.monster,this.player);
   if(this.cctv.active){
     for(let i=0;i<4;i++)if(this.input.pressed('Digit'+(i+1)))this.cctv.select(i);
     if(this.input.pressed('ArrowLeft'))this.cctv.select(this.cctv.index-1);
     if(this.input.pressed('ArrowRight'))this.cctv.select(this.cctv.index+1);
     this.securityUI.update(this.cctv,this.power);
     if(this.input.pressed('KeyE'))this.exitCCTV();
     this.input.clearPressed();
     this.post.composer.passes[0].camera=this.cctv.active?this.cctv.current.camera:this.camera;
     this.post.render(dt);
     return;
   }
   this.post.composer.passes[0].camera=this.camera;
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
   this.hud.setPower?.(this.power.status);
   this.hud.setClock(this.missions.clock);
   this.performanceUI.update(dt,this.renderer);
  }else this.input.clearPressed();
  this.post.render(dt);
 }
}