export class InventoryUI{
 constructor(root,onClose){
  this.node=document.createElement('div');this.node.id='inventory-overlay';this.node.className='overlay';this.node.innerHTML='<section class="overlay-panel"><div class="eyebrow">EQUIPAMENTOS RECUPERADOS</div><h2>INVENTÁRIO</h2><p id="inventory-count"></p><div id="inventory-items"></div><button id="inventory-close">FECHAR [TAB / ESC]</button></section>';
  root.append(this.node);this.node.querySelector('#inventory-close').onclick=onClose;
 }
 show(items){this.node.style.display='grid';this.node.querySelector('#inventory-count').textContent=items.length+' / 8 espaços usados';
  const list=this.node.querySelector('#inventory-items');list.replaceChildren();
  if(!items.length){const el=document.createElement('p');el.textContent='Nenhum item encontrado.';list.append(el)}
  items.forEach(item=>{const el=document.createElement('div');el.className='inventory-item';el.textContent=(item.type==='key'?'🗝 ':item.type==='battery'?'▣ ':'• ')+item.name;list.append(el)});
 }
 hide(){this.node.style.display='none'}
}