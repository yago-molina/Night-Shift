// Web Audio procedural horror soundscape. No downloads, external assets or autoplay.
export class AudioSystem {
 constructor(){this.ctx=null;this.master=null;this.ambience=null;this.ambGain=null;this.ready=false;this.muted=false;this.volume=.42;this.lastHeartbeat=0;this.time=0;this.nextDrip=4}
 async start(){
  try{
   if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    this.ctx=new C();this.master=this.ctx.createGain();this.master.gain.value=this.volume;this.master.connect(this.ctx.destination);
    const noise=this.noiseBuffer(4);this.ambience=this.ctx.createBufferSource();this.ambience.buffer=noise;this.ambience.loop=true;
    const low=this.ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=160;
    this.ambGain=this.ctx.createGain();this.ambGain.gain.value=.12;
    this.ambience.connect(low);low.connect(this.ambGain);this.ambGain.connect(this.master);this.ambience.start();
   }
   if(this.ctx.state==='suspended')await this.ctx.resume();this.ready=true;
  }catch(e){console.warn('Áudio indisponível:',e)}
 }
 noiseBuffer(duration=2){const b=this.ctx.createBuffer(1,Math.ceil(this.ctx.sampleRate*duration),this.ctx.sampleRate);const data=b.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;return b}
 setVolume(n){this.volume=Math.max(0,Math.min(1,n));if(this.master)this.master.gain.setTargetAtTime(this.muted?0:this.volume,this.ctx.currentTime,.03)}
 setMuted(m){this.muted=m;this.setVolume(this.volume)}
 tone(freq=100,duration=.2,volume=.1,kind='sine',pan=0){
  if(!this.ready||this.muted)return;
  const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
  o.type=kind;o.frequency.setValueAtTime(Math.max(20,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*.65),t+duration);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.012);
  g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  const p=this.ctx.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,pan));
  o.connect(g);g.connect(p);p.connect(this.master);o.start(t);o.stop(t+duration+.03);
 }
 noise(duration=.4,volume=.1,cutoff=500,pan=0){
  if(!this.ready||this.muted)return;
  const t=this.ctx.currentTime,src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain(),p=this.ctx.createStereoPanner();
  src.buffer=this.noiseBuffer(duration+.05);filter.type='bandpass';filter.frequency.value=cutoff;filter.Q.value=.65;
  p.pan.value=Math.max(-1,Math.min(1,pan));gain.gain.setValueAtTime(.001,t);
  gain.gain.linearRampToValueAtTime(volume,t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
  src.connect(filter);filter.connect(gain);gain.connect(p);p.connect(this.master);src.start(t);src.stop(t+duration+.03);
 }
 spatial(position,listener){if(!position||!listener)return {gain:1,pan:0};const dx=position.x-listener.x,dz=position.z-listener.z,d=Math.hypot(dx,dz);return {gain:Math.max(.04,1-d/20),pan:Math.max(-.8,Math.min(.8,dx/9))}}
 effect(name,position,listener){
  const s=this.spatial(position,listener);
  if(name==='bang'){this.noise(.45,.22*s.gain,130,s.pan);this.tone(68,.32,.19*s.gain,'triangle',s.pan)}
  else if(name==='metal'){this.tone(490,.85,.052*s.gain,'sawtooth',s.pan);this.tone(228,.6,.05*s.gain,'sine',s.pan)}
  else if(name==='whisper'){this.noise(1.15,.09*s.gain,1100,s.pan)}
  else if(name==='radio'){this.noise(.8,.13*s.gain,2800,s.pan);this.tone(110,.3,.035*s.gain,'square',s.pan)}
  else if(name==='drip'){this.tone(760,.12,.032*s.gain,'sine',s.pan)}
  else if(name==='door'){this.noise(.18,.095*s.gain,340,s.pan);this.tone(130,.28,.08*s.gain,'triangle',s.pan)}
  else if(name==='chase'){this.tone(62,.45,.11,'sawtooth');this.noise(.3,.08,90)}
  else if(name==='heartbeat'){this.tone(53,.19,.11,'sine');this.tone(67,.12,.06,'sine')}
 }
 update(dt,tension,player){
  if(!this.ready||this.muted)return;
  this.time+=dt;
  if(this.ambGain)this.ambGain.gain.setTargetAtTime(.12+.18*tension,this.ctx.currentTime,.4);
  const interval=1.25-.82*tension;
  if(tension>.48&&this.time-this.lastHeartbeat>interval){this.lastHeartbeat=this.time;this.effect('heartbeat')}
  if(this.time>this.nextDrip){this.effect('drip',{x:player.position.x+4,z:player.position.z+3},player.position);this.nextDrip=this.time+8+Math.random()*12}
 }
 pause(){if(this.ctx?.state==='running')this.ctx.suspend()}
 resume(){if(this.ctx?.state==='suspended')this.ctx.resume()}
}