export class InputManager{
 constructor(canvas){
  this.canvas=canvas;this.keys=new Set();this.justPressed=new Set();this.locked=false;this.dx=0;this.dy=0;
  document.addEventListener('keydown',e=>{
   if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();
   if(!this.keys.has(e.code))this.justPressed.add(e.code);
   this.keys.add(e.code)
  });
  document.addEventListener('keyup',e=>this.keys.delete(e.code));
  document.addEventListener('mousemove',e=>{if(this.locked){this.dx+=e.movementX;this.dy+=e.movementY}});
  document.addEventListener('pointerlockchange',()=>{this.locked=document.pointerLockElement===canvas;this.dx=0;this.dy=0;this.onLockChange?.(this.locked)});
  window.addEventListener('blur',()=>{this.keys.clear();this.justPressed.clear()})
 }
 down(code){return this.keys.has(code)}
 pressed(code){if(!this.justPressed.has(code))return false;this.justPressed.delete(code);return true}
 clearPressed(){this.justPressed.clear()}
 consumeMouse(){const v=[this.dx,this.dy];this.dx=0;this.dy=0;return v}
 lock(){return this.canvas.requestPointerLock()}
}