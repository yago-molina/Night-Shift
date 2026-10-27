import * as THREE from 'three';
export function installSecurityInteractables({hospital,interactions,power,cctv,player,onCCTV,onMessage,onAlarm}){
 const {scene,m}=hospital;
 const cube=(group,x,y,z,w,h,d,material)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);group.add(mesh);return mesh};
 // Monitor interaction surface is in front of the existing three monitors.
 const monitor=new THREE.Group();monitor.position.set(-3,1.44,-9.29);
 cube(monitor,0,0,.055,.9,.8,.06,m.black);scene.add(monitor);
 interactions.register(monitor,{label:()=>power.enabled('cctv')?'[E] Abrir câmeras de segurança':'[E] Câmeras sem energia',action:()=>{if(!power.enabled('cctv'))onMessage('Ative o circuito CCTV no painel elétrico.');else onCCTV()}});
 // Panel placed on the security-office wall, accessible from the spawn.
 const panel=new THREE.Group();panel.position.set(-6.68,1.45,-6.5);scene.add(panel);
 cube(panel,0,0,0,.16,1.1,1.15,m.dark);
 const controls=[
  {circuit:'lights',label:'ILUMINAÇÃO',z:-.35},
  {circuit:'cctv',label:'CÂMERAS',z:0},
  {circuit:'alarm',label:'ALARME',z:.35}
 ];
 for(const control of controls){
  const controlGroup=new THREE.Group();controlGroup.position.set(-6.54,1.45,-6.5+control.z);scene.add(controlGroup);
  cube(controlGroup,0,0,0,.12,.21,.23,m.metal);
  const led=cube(controlGroup,.07,.055,0,.025,.055,.065,new THREE.MeshBasicMaterial({color:0x68daae}));
  interactions.register(controlGroup,{label:()=> '[E] '+control.label+': '+(power.circuits[control.circuit]?'LIGADO':'DESLIGADO'),action:()=>{
   if(!power.toggle(control.circuit)){onMessage('Sem energia. Restaure o disjuntor.');return}
   led.material.color.set(power.circuits[control.circuit]?0x68daae:0xb84848);
   onMessage(control.label+': '+(power.circuits[control.circuit]?'ligado':'desligado'));
  }});
 }
 const breaker=new THREE.Group();breaker.position.set(-6.52,.78,-6.5);scene.add(breaker);
 cube(breaker,0,0,0,.14,.25,.36,m.warning);
 interactions.register(breaker,{label:()=> '[E] '+(!power.powered?'Rearmar disjuntor':'Recarregar gerador'),action:()=>{power.restore();onMessage('Gerador restabelecido. Energia: 100%.')}});
 const alarm=new THREE.Group();alarm.position.set(-2.7,1.15,-9.24);scene.add(alarm);
 cube(alarm,0,0,0,.23,.2,.17,m.warning);
 interactions.register(alarm,{label:()=> '[E] Acionar alarme de distração',action:()=>{if(!power.triggerAlarm()){onMessage('Alarme indisponível, desligado ou em recarga.');return}onAlarm();onMessage('Alarme ativado! A criatura pode investigar a sala.')}});
 return {panel,alarm};
}