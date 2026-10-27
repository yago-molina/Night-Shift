export class DocumentUI{
 constructor(root,onClose){this.node=document.createElement('div');this.node.id='document-overlay';this.node.className='overlay';this.node.innerHTML='<section class="overlay-panel paper"><div class="eyebrow">ARQUIVO HOSPITALAR</div><h2 id="doc-title"></h2><p id="doc-body"></p><button id="doc-close">GUARDAR [E / ESC]</button></section>';root.append(this.node);this.node.querySelector('#doc-close').onclick=onClose}
 show(doc){this.node.querySelector('#doc-title').textContent=doc.title;this.node.querySelector('#doc-body').textContent=doc.body;this.node.style.display='grid'}
 hide(){this.node.style.display='none'}
}