// Scheduled, non-repeating ambient events with cooldowns and a rising tension threshold.
const EVENTS=['bang','metal','whisper','radio','flicker'];
export class HorrorDirector {
 constructor({audio,lighting,post,monster,player,onEvent=()=>{}}){
  Object.assign(this,{audio,lighting,post,monster,player,onEvent});
  this.time=0;this.nextEvent=13;this.lastEvent='';this.currentEvent='';this.eventCount=0;
 }
 update(dt,tension){
  this.time+=dt;
  if(this.time<this.nextEvent)return;
  // Skip large scripted events while a chase is in progress.
  if(this.monster.state==='CHASE'||this.monster.state==='ATTACK'){this.nextEvent=this.time+7;return}
  const options=EVENTS.filter(e=>e!==this.lastEvent);
  const event=options[Math.floor(Math.random()*options.length)];this.lastEvent=event;this.currentEvent=event;this.eventCount++;
  const side=Math.random()<.5?-1:1;
  const p={x:this.player.position.x+side*(3+Math.random()*5),z:this.player.position.z+(Math.random()-.5)*9};
  if(event==='flicker')this.lighting.flickerNearest(this.player.position,2.8);
  else if(event==='radio'){this.audio.effect('radio',p,this.player.position);this.post.pulse(.5)}
  else{this.audio.effect(event,p,this.player.position);if(event==='bang')this.post.pulse(.28)}
  this.onEvent(event,p);
  // Higher tension increases frequency, but at least eight seconds between events.
  this.nextEvent=this.time+Math.max(8,24-12*tension)+Math.random()*9;
 }
}