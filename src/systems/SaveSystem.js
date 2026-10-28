const KEY='night-shift-checkpoint-v1';
const NIGHT_KEY='night-shift-campaign-night-v1';
export class SaveSystem{
 constructor(storage=typeof localStorage!=='undefined'?localStorage:null){this.storage=storage}
 save(data){try{this.storage?.setItem(KEY,JSON.stringify({...data,savedAt:new Date().toISOString()}));return true}catch(e){console.warn('Checkpoint não gravado:',e);return false}}
 load(){try{const raw=this.storage?.getItem(KEY);if(!raw)return null;const data=JSON.parse(raw);return data?.version===1?data:null}catch(e){console.warn('Checkpoint indisponível:',e);return null}}
 clear(){try{this.storage?.removeItem(KEY)}catch(e){console.warn('Falha ao limpar checkpoint:',e)}}
 getNight(){try{const n=Number(this.storage?.getItem(NIGHT_KEY));return Number.isInteger(n)&&n>=1&&n<=5?n:1}catch{return 1}}
 setNight(n){const night=Math.max(1,Math.min(5,Math.floor(Number(n)||1)));try{this.storage?.setItem(NIGHT_KEY,String(night))}catch{}return night}
 advanceNight(){const next=Math.min(5,this.getNight()+1);this.clear();this.setNight(next);return next}
 resetCampaign(){this.clear();try{this.storage?.removeItem(NIGHT_KEY)}catch{}}

 hasCheckpoint(){return Boolean(this.load())}
}