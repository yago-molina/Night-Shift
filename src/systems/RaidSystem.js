export class RaidSystem {
 constructor(minute,{duration=42,onStart=()=>{},onEnd=()=>{}}={}){
 this.minute=minute;this.duration=duration;this.onStart=onStart;this.onEnd=onEnd;this.started=false;this.finished=false;this.remaining=0}
 update(dt,minutes){
 if(this.finished)return;
 if(!this.started&&minutes>=this.minute){this.started=true;this.remaining=this.duration;this.onStart()}
 if(!this.started)return;
 this.remaining=Math.max(0,this.remaining-dt);
 if(this.remaining<=0){this.finished=true;this.onEnd()}
 }
 snapshot(){return {minute:this.minute,started:this.started,finished:this.finished,remaining:this.remaining}}
 restore(v){if(!v||v.minute!==this.minute)return;this.started=!!v.started;this.finished=!!v.finished;this.remaining=Math.max(0,Number(v.remaining)||0)}
 get active(){return this.started&&!this.finished}
}