export class EndingUI{
 constructor(root,{onRestart,onContinue}){
  this.node=document.createElement('div');this.node.id='ending-overlay';this.node.className='overlay';
  this.node.innerHTML='<section class="overlay-panel ending-panel"><div class="eyebrow" id="ending-clock">06:00 // REGISTRO FINAL</div><h2 id="ending-title"></h2><p id="ending-body"></p><div class="ending-actions"><button id="ending-restart">NOVO TURNO</button><button id="ending-continue">VOLTAR AO CHECKPOINT</button></div></section>';
  root.append(this.node);
  this.node.querySelector('#ending-restart').onclick=onRestart;
  this.node.querySelector('#ending-continue').onclick=onContinue;
 }
 show(end,hasSave,{night=1,nextNight=false}={}){this.node.style.display='grid';this.node.querySelector('#ending-title').textContent=end.title;this.node.querySelector('#ending-body').textContent=end.description;this.node.querySelector('#ending-clock').textContent=end.clock+' // REGISTRO FINAL';this.node.querySelector('#ending-continue').style.display=hasSave&&!nextNight?'inline-block':'none';this.node.querySelector('#ending-restart').textContent=nextNight?(night<5?'PRÓXIMA NOITE':'RECOMEÇAR CAMPANHA'):(end.kind==='lost'?'TENTAR NOVAMENTE':'NOVO TURNO')}
 hide(){this.node.style.display='none'}
}