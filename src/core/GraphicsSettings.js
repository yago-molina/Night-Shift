export const GRAPHICS_PRESETS={
 low:{pixelRatio:1,effects:false,cctvSize:[256,144],cctvInterval:.8,fog:.012},
 medium:{pixelRatio:1.25,effects:true,cctvSize:[320,180],cctvInterval:.5,fog:.012},
 high:{pixelRatio:1.75,effects:true,cctvSize:[512,288],cctvInterval:.3,fog:.012}
};
const KEY='night-shift-options-v1';
export class GraphicsSettings{
 constructor(storage=typeof localStorage==='undefined'?null:localStorage){
  this.storage=storage;this.options={quality:'medium',volume:42,mouseSensitivity:100};
  try{const obj=JSON.parse(storage?.getItem(KEY)||'null');if(obj)this.setAll(obj,false)}catch{}
 }
 setAll(values,persist=true){
  if(values.quality in GRAPHICS_PRESETS)this.options.quality=values.quality;
  if(Number.isFinite(+values.volume))this.options.volume=Math.max(0,Math.min(100,+values.volume));
  if(Number.isFinite(+values.mouseSensitivity))this.options.mouseSensitivity=Math.max(35,Math.min(180,+values.mouseSensitivity));
  if(persist)this.persist();
  return this.options;
 }
 persist(){try{this.storage?.setItem(KEY,JSON.stringify(this.options))}catch{}}
 get preset(){return GRAPHICS_PRESETS[this.options.quality]}
}