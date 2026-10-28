// Additional risk from staying hidden. Seconds are real elapsed gameplay seconds.
export class HidingPressure {
 constructor(){this.streak=0;this.pressure=0}
 update(dt,hidden){
  if(!Number.isFinite(dt)||dt<=0)return this.pressure;
  const step=Math.min(dt,1);
  if(hidden){
   this.streak+=step;
   // First 8 seconds are free. Reaching max pressure requires about 100 seconds of hiding.
   const target=Math.min(1,Math.max(0,(this.streak-8)/92));
   this.pressure=Math.max(this.pressure,target);
  }else{
   this.streak=0;
   // Tension fades over ~50 seconds in the open, not instantly.
   this.pressure=Math.max(0,this.pressure-step/50);
  }
  return this.pressure;
 }
 snapshot(){return {streak:this.streak,pressure:this.pressure}}
 restore(saved){
  this.streak=Math.max(0,Math.min(3600,Number(saved?.streak)||0));
  this.pressure=Math.max(0,Math.min(1,Number(saved?.pressure)||0));
 }
}