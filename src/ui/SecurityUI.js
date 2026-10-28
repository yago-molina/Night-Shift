export class SecurityUI {
 constructor(root){
  this.node=document.createElement('div');this.node.id='security-ui';this.node.innerHTML='<div class="cctv-head"><strong>HOSPITAL // CENTRAL DE MONITORAMENTO</strong><span id="cctv-camera">CAM 01</span></div><div class="cctv-indicator"><span class="record-dot">●</span> AO VIVO <span id="cctv-label"></span> <span id="cctv-motion"></span></div><div class="cctv-footer">[1–5] CÂMERAS &nbsp; [← →] ALTERNAR &nbsp; [E] SAIR <span id="cctv-power"></span></div>';
  root.append(this.node);
  this.node.style.display='none';
 }
 show(){this.node.style.display='block'}
 hide(){this.node.style.display='none'}
 update(cctv,power,monster,collision){
  this.node.querySelector('#cctv-camera').textContent='CAM '+String(cctv.index+1).padStart(2,'0');
  this.node.querySelector('#cctv-label').textContent=cctv.current.name;
  this.node.querySelector('#cctv-power').textContent='ENERGIA '+power.status.percent+'% · SETORES '+Math.min(2,cctv.observed.size)+'/2';
  this.node.querySelector('#cctv-motion').textContent=cctv.detectsMonster(monster,collision)?' · MOVIMENTO DETECTADO':'';
 }
}