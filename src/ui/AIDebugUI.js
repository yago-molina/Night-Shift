export class AIDebugUI{
 constructor(root){this.node=document.createElement('div');this.node.id='ai-debug';this.node.style.display='none';root.append(this.node);this.enabled=false;this.getExtra=null}
 setExtra(fn){this.getExtra=fn}
 toggle(){this.enabled=!this.enabled;this.node.style.display=this.enabled?'block':'none'}
 update(monster,player){if(!this.enabled)return;this.node.textContent='IA: '+monster.state+'\nATIVA: '+monster.active+'\nDISTÂNCIA: '+Math.hypot(monster.position.x-player.position.x,monster.position.z-player.position.z).toFixed(1)+'m\nJOGADOR ESCONDIDO: '+player.hidden+'\nCAMINHO: '+monster.path.length+' nós'+(this.getExtra?'\nTENSÃO: '+Math.round(this.getExtra().tension*100)+'%\nÚLTIMO EVENTO: '+this.getExtra().event:'')}
}