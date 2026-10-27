const GAME_KEYS=new Set(['KeyW','KeyA','KeyS','KeyD','KeyC','KeyE','KeyF','KeyR','KeyQ','Tab','Space','ShiftLeft','ShiftRight','ControlLeft','ControlRight','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Digit1','Digit2','Digit3','Digit4','F2','F3','F4']);
export class InputManager{
 constructor(canvas){
  this.canvas=canvas;this.keys=new Set();this.justPressed=new Set();this.locked=false;this.dx=0;this.dy=0;this.sensitivity=1;
  this.onLockChange=null;
  document.addEventListener('keydown',e=>{
   const editable=e.target?.matches?.('input,select,textarea,[contenteditable]')||false;
   if(!this.locked||editable)return;
   if(GAME_KEYS.has(e.code)||e.ctrlKey||e.metaKey){e.preventDefault();e.stopPropagation()}
   // Ignore browser shortcut combos as gameplay. C is a safe alternative to Ctrl for crouching.
   if(e.ctrlKey||e.metaKey||e.altKey)return;
   if(!this.keys.has(e.code))this.justPressed.add(e.code);
   this.keys.add(e.code);
  },{capture:true});
  document.addEventListener('keyup',e=>{
   if(this.locked&&(GAME_KEYS.has(e.code)||e.ctrlKey||e.metaKey)){e.preventDefault();e.stopPropagation()}
   this.keys.delete(e.code);
  },{capture:true});
  document.addEventListener('mousemove',e=>{if(this.locked){this.dx+=e.movementX*this.sensitivity;this.dy+=e.movementY*this.sensitivity}});
  document.addEventListener('pointerlockchange',()=>{
   this.locked=document.pointerLockElement===canvas;this.dx=0;this.dy=0;
   if(!this.locked){this.keys.clear();this.justPressed.clear()}
   this.onLockChange?.(this.locked);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.keys.clear();this.justPressed.clear()}});
  window.addEventListener('blur',()=>{this.keys.clear();this.justPressed.clear()});
 }
 down(code){return this.keys.has(code)}
 pressed(code){if(!this.justPressed.has(code))return false;this.justPressed.delete(code);return true}
 clearPressed(){this.justPressed.clear()}
 consumeMouse(){const v=[this.dx,this.dy];this.dx=0;this.dy=0;return v}
 lock(){return this.canvas.requestPointerLock()}
}