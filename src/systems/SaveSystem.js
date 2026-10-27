const KEY='night-shift-checkpoint-v1';
export class SaveSystem{
 constructor(storage=typeof localStorage!=='undefined'?localStorage:null){this.storage=storage}
 save(data){try{this.storage?.setItem(KEY,JSON.stringify({...data,savedAt:new Date().toISOString()}));return true}catch(e){console.warn('Checkpoint não gravado:',e);return false}}
 load(){try{const raw=this.storage?.getItem(KEY);if(!raw)return null;const data=JSON.parse(raw);return data?.version===1?data:null}catch(e){console.warn('Checkpoint indisponível:',e);return null}}
 clear(){try{this.storage?.removeItem(KEY)}catch(e){console.warn('Falha ao limpar checkpoint:',e)}}
 hasCheckpoint(){return Boolean(this.load())}
}