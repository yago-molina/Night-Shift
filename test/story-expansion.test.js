import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {CampaignRandom} from '../src/systems/CampaignRandom.js';
import {RaidSystem} from '../src/systems/RaidSystem.js';
import {MissionSystem,SECONDS_PER_MINUTE} from '../src/systems/MissionSystem.js';
import {populateInteractables} from '../src/systems/Interactables.js';
import {installSecurityInteractables} from '../src/systems/SecurityInteractables.js';
import {CollisionWorld} from '../src/world/CollisionWorld.js';
import {Monster} from '../src/ai/Monster.js';
import {PowerSystem} from '../src/systems/PowerSystem.js';

test('horário da invasão muda por campanha e permanece após restore',()=>{
 const a=new CampaignRandom(1234),b=new CampaignRandom(1234);
 assert.equal(a.raidMinute(),b.raidMinute());
 assert.ok(a.raidMinute()>=145&&a.raidMinute()<300);
 assert.notEqual(new CampaignRandom(4567).raidMinute(),a.raidMinute());
});
test('cada gaveta usa sorteio independente 50/50, estável para o mesmo seed',()=>{
 const first=new CampaignRandom(9182),second=new CampaignRandom(9182);
 const ids=['deskReception','deskOffice','deskSecurity','deskSurgery'];
 assert.deepEqual(ids.map(id=>first.drawerHasNote(id)),ids.map(id=>second.drawerHasNote(id)));
 let found=0;for(let seed=1;seed<=1000;seed++)if(new CampaignRandom(seed).drawerHasNote('deskReception'))found++;
 assert.ok(found>400&&found<600,'probabilidade próxima de 50%: '+found);
});
test('invasão começa no minuto sorteado, termina e não se repete',()=>{
 let started=0,ended=0;
 const r=new RaidSystem(180,{duration:4,onStart:()=>started++,onEnd:()=>ended++});
 r.update(.1,179);assert.equal(r.active,false);
 r.update(.1,180);assert.equal(r.active,true);
 r.update(4.1,181);assert.equal(r.finished,true);assert.equal(ended,1);
 r.update(100,400);assert.equal(started,1);
});
test('ataque restaurado preserva sua duração e momento',()=>{
 const a=new RaidSystem(160,{duration:12});a.update(3,160);
 const b=new RaidSystem(160,{duration:12});b.restore(a.snapshot());
 assert.equal(b.active,true);assert.equal(b.remaining,a.remaining);
 b.update(9.1,161);assert.equal(b.active,false);
});
test('monstro pode invadir a segurança somente no evento especial ou na perseguição',()=>{
 const collision=new CollisionWorld(),player={position:new THREE.Vector3(-3,0,-8),hidden:true};
 const m=new Monster(new THREE.Scene(),collision,player,[]);
 m.active=true;m.startRaid();
 assert.equal(m.securityRaid,true);assert.equal(m.navigation.blockedArea({x:-3,z:-6}),false);
 m.stopRaid();assert.equal(m.securityRaid,false);assert.equal(m.navigation.blockedArea({x:-3,z:-6}),true);
});
test('missões adicionais requerem gerador, enfermaria, administração e cirurgia',()=>{
 const m=new MissionSystem();
 for(const a of ['key','incident','cctv'])m.action(a);
 assert.equal(m.objective.id,'generator');
 m.action('evidence');assert.equal(m.objective.id,'generator');
 m.action('generator');assert.equal(m.objective.id,'ward');
 m.action('ward');assert.equal(m.objective.id,'research');
 m.action('research');assert.equal(m.objective.id,'returned');
 m.action('returned');assert.equal(m.objective.id,'survive');
 m.update(390*SECONDS_PER_MINUTE);assert.equal(m.canExtract(),true);
 assert.equal(m.complete('terminal').kind,'truth');
});
test('gavetas têm papel opcional, todas as salas possuem documentos e cirurgia foi deslocada',()=>{
 const scene=new THREE.Scene(),material=new THREE.MeshBasicMaterial(),m={wood:material,trim:material,metal:material,warning:material,black:material,bed:material};
 const hospital={scene,m,collision:new CollisionWorld()},registered=[];
 const interaction={register:(obj,e)=>registered.push({obj,...e})};
 const player={position:new THREE.Vector3(0,0,0)};
 populateInteractables(hospital,interaction,player,{has:()=>false},()=>{},()=>{},new CampaignRandom(42));
 const documents=registered.filter(e=>e.kind==='document').map(e=>e.document.title);
 assert.ok(documents.some(x=>x.startsWith('Prontuário 013')));
 assert.ok(documents.some(x=>x.startsWith('Diário da enfermeira')));
 assert.ok(documents.some(x=>x.startsWith('Projeto VIGÍLIA')));
 const surgical=registered.find(e=>e.kind==='document'&&e.document.title.startsWith('Prontuário 013'));
 assert.ok([12.18,11.05].includes(surgical.obj.position.x));
 assert.equal(registered.filter(e=>e.kind==='drawer').length,4);
});
test('gerador físico fica fora da segurança e aciona progresso',()=>{
 const scene=new THREE.Scene(),material=new THREE.MeshBasicMaterial(),m={wood:material,trim:material,metal:material,dark:material,screen:material,warning:material,black:material};
 const registered=[];let progressed=0;
 const hospital={scene,m,collision:new CollisionWorld()};
 installSecurityInteractables({hospital,interactions:{register:(obj,entry)=>registered.push({obj,...entry})},power:new PowerSystem(),cctv:{},player:{},onCCTV:()=>{},onMessage:()=>{},onAlarm:()=>{},onGenerator:()=>progressed++});
 const generator=registered.find(e=>e.label().includes('gerador'));
 assert.ok(generator,'modelo do gerador não encontrado');
 assert.ok(generator.obj.position.z>2,'gerador deve ficar na ala norte');
 generator.action();assert.equal(progressed,1);
});
