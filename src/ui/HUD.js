export class HUD{
 constructor(root){this.node=document.createElement('div');this.node.id='hud';this.node.innerHTML='<div class="top"><div class="brand">NIGHT SHIFT <span>• SETOR DE VIGILÂNCIA</span></div><div id="clock">23:00</div></div><div id="night-status">NOITE 1/5 · IRRITAÇÃO 0/4</div><div class="crosshair">+</div><div id="interaction-hint"></div><div id="toast"></div><div id="tension-vignette" aria-hidden="true"></div><div id="power-status">GERADOR 100% · CCTV ONLINE</div><div class="bottom"><div><small>OBJETIVO ATUAL</small><strong>Encontre a chave da sala de segurança</strong><small style="margin-top:12px">TAB • INVENTÁRIO / E • INTERAGIR</small></div><div class="meters"><small>RESISTÊNCIA</small><div class="track"><div id="stamina"></div></div><small>ENERGIA DA LANTERNA</small><div class="track"><div id="battery-bar"></div></div><small id="battery-label">F • LANTERNA | R • BATERIA</small></div></div>';root.append(this.node);this.toastTimeout=0;this.battery=100}
 setNight(night){this.night=night;this.setAnger(0)}
 setAnger(level){const el=this.node.querySelector('#night-status');if(el)el.textContent='NOITE '+(this.night||1)+'/5 · IRRITAÇÃO '+Math.max(0,Math.min(4,Math.floor(level)))+'/4'}
 setMission(objective){this.node.querySelector('.bottom strong').textContent=objective.title;this.node.querySelector('.bottom small:last-child').textContent=objective.hint+' • TAB INVENTÁRIO'}
 setClock(clock){this.node.querySelector('#clock').textContent=clock}
 setPower(status){const el=this.node.querySelector('#power-status');if(el)el.textContent='GERADOR '+status.percent+'% · CCTV '+(status.powered&&status.circuits.cctv?'ONLINE':'OFFLINE')}
 show(){this.node.style.display='block'}hide(){this.node.style.display='none'}
 setTension(n){this.node.querySelector('#tension-vignette').style.opacity=String(Math.max(0,Math.min(.65,n*.52)))}
 message(text){this.node.querySelector('#toast').textContent=text;this.toastTimeout=3.5}
 update(elapsed,status,hint='',battery=100,count=0,dt=0){
  // The campaign owns the clock; setClock() provides the single authoritative time.
  this.node.querySelector('#stamina').style.width=status.stamina+'%';
  this.node.querySelector('#battery-bar').style.width=battery+'%';
  this.node.querySelector('#battery-label').textContent='F • LANTERNA | R • RECARREGAR ('+count+')';
  this.node.querySelector('#interaction-hint').textContent=hint;
  this.toastTimeout=Math.max(0,this.toastTimeout-dt);if(!this.toastTimeout)this.node.querySelector('#toast').textContent='';
 }
}