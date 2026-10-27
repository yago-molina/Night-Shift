import test from 'node:test';
import assert from 'node:assert/strict';
import {GraphicsSettings,GRAPHICS_PRESETS} from '../src/core/GraphicsSettings.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
test('graphics presets define safe rendering configurations',()=>{
 for(const p of Object.values(GRAPHICS_PRESETS)){assert.ok(p.pixelRatio>=1&&p.pixelRatio<=2);assert.ok(p.cctvSize[0]>=256);assert.ok(p.cctvInterval>0)}
});
test('graphics preferences are persisted and clamped',()=>{
 const cache=new Map(),storage={getItem:k=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,v)};
 const options=new GraphicsSettings(storage);
 options.setAll({quality:'low',volume:250,mouseSensitivity:12});
 assert.equal(options.options.volume,100);assert.equal(options.options.mouseSensitivity,35);
 const reloaded=new GraphicsSettings(storage);
 assert.equal(reloaded.options.quality,'low');assert.equal(reloaded.options.volume,100);
});
test('invalid quality cannot overwrite selected preset',()=>{
 const settings=new GraphicsSettings(null);settings.setAll({quality:'high'});settings.setAll({quality:'unknown'});
 assert.equal(settings.options.quality,'high');
});
test('collision boxes continue supporting movement',()=>{
 const world=new CollisionWorld();world.add(0,0,1,1);
 const pos={x:-1,z:0};world.move(pos,.6,0);
 assert.equal(pos.x,-1);
});
