export class PerformanceUI{
 constructor(root){
  this.node=document.createElement('div');this.node.id='performance-ui';this.node.style.display='none';root.append(this.node);
  this.visible=false;this.count=0;this.seconds=0;this.fps=60;
 }
 toggle(){this.visible=!this.visible;this.node.style.display=this.visible?'block':'none'}
 update(dt,renderer){
  if(!this.visible)return;
  this.count++;this.seconds+=dt;
  if(this.seconds>=.75){
   this.fps=Math.round(this.count/this.seconds);this.seconds=0;this.count=0;
   const gl=renderer.info.render;
   this.node.textContent='FPS: '+this.fps+' | Draw calls: '+gl.calls+' | Triângulos: '+gl.triangles;
  }
 }
}