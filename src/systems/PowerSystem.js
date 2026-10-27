export class PowerSystem {
 constructor({capacity=100}={}){
  this.capacity=capacity;this.energy=capacity;this.circuits={lights:true,cctv:true,alarm:true};
  this.alarmRemaining=0;this.alarmCooldown=0;this.outage=false;
 }
 get powered(){return !this.outage&&this.energy>0}
 enabled(name){return this.powered&&Boolean(this.circuits[name])}
 toggle(name){
  if(!(name in this.circuits))return false;
  if(this.outage||this.energy<=0)return false;
  this.circuits[name]=!this.circuits[name];
  if(name==='alarm'&&!this.circuits.alarm)this.alarmRemaining=0;
  return true;
 }
 triggerAlarm(){
  if(!this.enabled('alarm')||this.alarmRemaining>0||this.alarmCooldown>0)return false;
  this.alarmRemaining=8;this.alarmCooldown=24;return true;
 }
 update(dt,{cctvActive=false}={}){
  if(!Number.isFinite(dt)||dt<=0)return;
  this.alarmCooldown=Math.max(0,this.alarmCooldown-dt);
  this.alarmRemaining=Math.max(0,this.alarmRemaining-dt);
  if(!this.powered)return;
  const draw=(this.circuits.lights?.022:0)+(this.circuits.cctv?.035:0)+(this.circuits.alarm?.005:0)+(cctvActive?.075:0)+(this.alarmRemaining>0?.38:0);
  this.energy=Math.max(0,this.energy-draw*dt);
  if(this.energy===0){this.outage=true;this.alarmRemaining=0}
 }
 restore(){this.energy=this.capacity;this.outage=false;this.alarmRemaining=0}
 get status(){return {energy:this.energy,capacity:this.capacity,percent:Math.round(this.energy/this.capacity*100),powered:this.powered,alarmRemaining:this.alarmRemaining,circuits:{...this.circuits}}}
}