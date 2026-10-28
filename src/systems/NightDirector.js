// Five-night campaign. The seed makes all event rolls reproducible after checkpoint restore.
export const MAX_NIGHTS=5;
export const clampNight=n=>Math.max(1,Math.min(MAX_NIGHTS,Math.floor(Number(n)||1)));
export const NIGHT_TITLES=['O Primeiro Plantão','A Voz no Corredor','A Ala Lacrada','A Vigília','03:17'];
export class NightDirector{
 constructor({night=1,random,onWarning=()=>{},onStart=()=>{},onEnd=()=>{},onPower=()=>{}}={}){
  this.night=clampNight(night);this.random=random;this.onWarning=onWarning;this.onStart=onStart;this.onEnd=onEnd;this.onPower=onPower;
  this.anger=0;this.elapsed=0;this.activeRaid=null;
  const count=this.night-1;this.raids=[];
  for(let i=0;i<count;i++){
   const minute=Math.floor(65+(i+1)*275/(count+1)+(random?.roll('raid-'+this.night+'-'+i)??.5)*22-11);
   this.raids.push({minute,warned:false,started:false,finished:false,remaining:0,duration:18+this.night*6});
  }
  this.energyEvents=[90,210,335].map((base,i)=>({
   minute:base+Math.floor((random?.roll('energy-time-'+this.night+'-'+i)??.5)*19)-9,
   value:Math.floor((random?.roll('energy-roll-'+this.night+'-'+i)??.5)*4),
   applied:false
  }));
 }
 get active(){return Boolean(this.activeRaid)}
 update(dt,minutes){
  if(!Number.isFinite(dt)||dt<0)return;
  this.elapsed+=dt;
  this.anger=Math.min(4,Math.floor((this.night-1)*.55+minutes/420*(1.65+this.night*.35)));
  for(const event of this.energyEvents){
   if(!event.applied&&minutes>=event.minute){event.applied=true;
    const loss=(event.value===1||event.value===3)?Math.min(32,9+this.night*4):0;
    this.onPower({value:event.value,loss,minute:event.minute});
   }
  }
  if(this.activeRaid){
   this.activeRaid.remaining=Math.max(0,this.activeRaid.remaining-dt);
   if(this.activeRaid.remaining<=0){
    const ended=this.activeRaid;ended.finished=true;this.activeRaid=null;this.onEnd(ended);
   }
  }
  for(const raid of this.raids){
   if(raid.finished||raid.started)continue;
   if(!raid.warned&&minutes>=raid.minute-4){raid.warned=true;this.onWarning(raid)}
   if(minutes>=raid.minute&&!this.activeRaid){
    raid.started=true;raid.remaining=raid.duration;this.activeRaid=raid;this.onStart(raid);
   }
  }
 }
 snapshot(){return {night:this.night,raids:this.raids.map(r=>({...r})),energyEvents:this.energyEvents.map(e=>({...e})),anger:this.anger}}
 restore(saved){
  if(!saved||saved.night!==this.night||!Array.isArray(saved.raids)||saved.raids.length!==this.raids.length)return false;
  for(let i=0;i<this.raids.length;i++){
   if(saved.raids[i].minute!==this.raids[i].minute)return false;
   Object.assign(this.raids[i],{warned:!!saved.raids[i].warned,started:!!saved.raids[i].started,finished:!!saved.raids[i].finished,remaining:Math.max(0,Number(saved.raids[i].remaining)||0)});
  }
  if(Array.isArray(saved.energyEvents))for(let i=0;i<this.energyEvents.length;i++){
   if(saved.energyEvents[i]?.minute===this.energyEvents[i].minute)this.energyEvents[i].applied=!!saved.energyEvents[i].applied;
  }
  this.anger=Math.max(0,Math.min(4,Number(saved.anger)||0));
  this.activeRaid=this.raids.find(r=>r.started&&!r.finished)||null;
  return true;
 }
}