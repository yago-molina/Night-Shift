// Smooth, deterministic tension based on distance, sight and current AI state.
export class TensionSystem {
 constructor(){this.value=0;this.target=0}
 update(dt,monster,player){
  if(!monster.active){this.target=0}
  else{
   const d=Math.hypot(monster.position.x-player.position.x,monster.position.z-player.position.z);
   const proximity=Math.max(0,1-d/14);
   const states={PATROL:0,RETURN:.04,INVESTIGATE:.27,SEARCH:.43,CHASE:.88,ATTACK:1};
   const state=states[monster.state]??0;
   this.target=Math.min(1,Math.max(state,proximity*.62)+(player.hidden?-.13:0));
  }
  const rate=this.target>this.value?2.2:.65;
  this.value+=(this.target-this.value)*(1-Math.exp(-rate*dt));
  return this.value;
 }
}