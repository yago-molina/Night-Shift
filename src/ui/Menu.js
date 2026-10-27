export class Menu{
 constructor(root,onStart){
  this.node=document.createElement('div');this.node.id='menu';
  this.node.innerHTML=`<div class="menu-bg"></div><section class="menu-panel">
  <div class="eyebrow">PROTOCOLO DE SEGURANÇA // 008</div><h1>NIGHT<br><em>SHIFT</em></h1>
  <p>Seu turno começa às 23:00. O hospital não deveria ter ninguém lá dentro.</p>
  <button id="play">INICIAR TURNO <span>→</span></button><div id="save-actions" style="display:none"><button id="new-shift" type="button">NOVO TURNO</button></div>
  <div class="settings-heading">CONFIGURAÇÕES</div>
  <div class="settings-grid">
   <label for="quality">QUALIDADE GRÁFICA</label><select id="quality"><option value="low">Baixa (melhor FPS)</option><option value="medium" selected>Média (equilibrada)</option><option value="high">Alta (mais detalhes)</option></select>
   <label for="volume">VOLUME <span id="volume-value">42%</span></label><input id="volume" type="range" min="0" max="100" value="42">
   <label for="sensitivity">SENSIBILIDADE <span id="sensitivity-value">100%</span></label><input id="sensitivity" type="range" min="35" max="180" value="100">
  </div>
  <div class="help">WASD MOVER • MOUSE OLHAR • SHIFT CORRER • CTRL AGACHAR<br>E INTERAGIR • F LANTERNA • R BATERIA • TAB INVENTÁRIO<br>CCTV 1–4 OU ← → • ESC PAUSAR • F3 DIAGNÓSTICO</div></section>`;
  root.append(this.node);
  this.node.querySelector('#play').onclick=onStart;
 }
 setCheckpointControls(hasSave,onNew){
  this.hasSave=hasSave;this.node.querySelector('#save-actions').style.display=hasSave?'block':'none';
  this.node.querySelector('#new-shift').onclick=onNew;
  this.show(false);
 }
 addSettings(onChange,values){
  const fields=['quality','volume','sensitivity'];
  for(const key of fields){
   const input=this.node.querySelector('#'+key);
   input.value=key==='sensitivity'?values.mouseSensitivity:values[key];
   input.addEventListener(key==='quality'?'change':'input',()=>{
    this.node.querySelector('#volume-value').textContent=this.node.querySelector('#volume').value+'%';
    this.node.querySelector('#sensitivity-value').textContent=this.node.querySelector('#sensitivity').value+'%';
    onChange({quality:this.node.querySelector('#quality').value,volume:Number(this.node.querySelector('#volume').value),mouseSensitivity:Number(this.node.querySelector('#sensitivity').value)});
   });
  }
  this.node.querySelector('#volume-value').textContent=values.volume+'%';
  this.node.querySelector('#sensitivity-value').textContent=values.mouseSensitivity+'%';
 }
 show(resume=false){
  this.node.style.display='grid';
  this.node.querySelector('#play').firstChild.textContent=resume?'RETOMAR TURNO ':this.hasSave?'CONTINUAR TURNO ':'INICIAR TURNO ';
 }
 hide(){this.node.style.display='none'}
}