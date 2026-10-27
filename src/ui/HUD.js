export class HUD{
 constructor(root){this.node=document.createElement('div');this.node.id='hud';this.node.innerHTML='<div class="top"><div class="brand">NIGHT SHIFT <span>• SETOR DE VIGILÂNCIA</span></div><div id="clock">23:00</div></div><div class="crosshair">+</div><div id="interaction-hint"></div><div id="toast"></div><div class="bottom"><div><small>OBJETIVO ATUAL</small><strong>Encontre a chave e investigue o hospital</strong><small style="margin-top:12px">TAB • INVENTÁRIO / E • INTERAGIR</small></div><div class="meters"><small>RESISTÊNCIA</small><div class="track"><div id="stamina"></div></div><small>ENERGIA DA LANTERNA</small><div class="track"><div id="battery-bar"></div></div><small id="battery-label">F • LANTERNA | R • BATERIA</small></div></div>';root.append(this.node);this.toastTimeout=0;this.battery=100}
 show(){this.node.style.display='block'}hide(){this.node.style.display='none'}
 message(text){this.node.querySelector('#toast').textContent=text;this.toastTimeout=3.5}
 update(elapsed,status,hint='',battery=100,count=0,dt=0){
  const minutes=Math.floor(elapsed/18);this.node.querySelector('#clock').textContent=String((23+Math.floor(minutes/60))%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
  this.node.querySelector('#stamina').style.width=status.stamina+'%';
  this.node.querySelector('#battery-bar').style.width=battery+'%';
  this.node.querySelector('#battery-label').textContent='F • LANTERNA | R • RECARREGAR ('+count+')';
  this.node.querySelector('#interaction-hint').textContent=hint;
  this.toastTimeout=Math.max(0,this.toastTimeout-dt);if(!this.toastTimeout)this.node.querySelector('#toast').textContent='';
 }
}