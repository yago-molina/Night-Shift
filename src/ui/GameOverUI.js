export class GameOverUI{
 constructor(root,onRestart){this.node=document.createElement('div');this.node.id='game-over';this.node.className='overlay';this.node.innerHTML='<section class="overlay-panel game-over-panel"><div class="eyebrow">SINAL PERDIDO</div><h2>VOCÊ FOI ENCONTRADO</h2><p>A criatura encontrou você. Seu turno terminou antes do amanhecer.</p><button id="restart-game">RECOMEÇAR TURNO →</button></section>';root.append(this.node);this.node.querySelector('#restart-game').onclick=onRestart}
 show(){this.node.style.display='grid'}hide(){this.node.style.display='none'}
}