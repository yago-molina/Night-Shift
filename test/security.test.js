import test from 'node:test';
import assert from 'node:assert/strict';
import {PowerSystem} from '../src/systems/PowerSystem.js';
test('circuits toggle independently and do not drain disabled consumers',()=>{
 const p=new PowerSystem();p.toggle('cctv');assert.equal(p.enabled('cctv'),false);
 const before=p.energy;p.update(10);assert.ok(p.energy<before);assert.equal(p.circuits.lights,true);
});
test('alarm has cooldown and cannot operate with its circuit disabled',()=>{
 const p=new PowerSystem();assert.equal(p.triggerAlarm(),true);assert.equal(p.triggerAlarm(),false);
 p.update(8);assert.equal(p.alarmRemaining,0);assert.equal(p.triggerAlarm(),false);
 p.update(17);assert.equal(p.triggerAlarm(),true);
 p.toggle('alarm');assert.equal(p.alarmRemaining,0);assert.equal(p.triggerAlarm(),false);
});
test('outage disables cameras and restoring generator restores power',()=>{
 const p=new PowerSystem({capacity:1});p.update(25,{cctvActive:true});
 assert.equal(p.powered,false);assert.equal(p.enabled('cctv'),false);
 p.restore();assert.equal(p.powered,true);assert.equal(p.energy,1);
});
test('switching a circuit during outage is rejected',()=>{
 const p=new PowerSystem({capacity:1});p.update(40,{cctvActive:true});
 assert.equal(p.toggle('lights'),false);assert.equal(p.circuits.lights,true);
});
