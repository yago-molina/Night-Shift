import * as THREE from 'three';
import {makeHospitalDoor,makeDrawer,makeEvidenceFolder,makeCollectible} from '../models/HospitalProps.js';
const cube=(parent,x,y,z,w,h,d,mat)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);parent.add(o);return o};
export function populateInteractables(hospital,interaction,player,inventory,onMessage,onNoise=()=>{}){
 const {scene,m,collision}=hospital;
 const result={doors:[],hideSpots:[],animations:[],update(dt){for(const a of this.animations)a.update(dt)}};
 for(const [x,z] of [[-11,-2],[-3,-2],[5,-2],[12,-2],[-11,2],[-3,2],[5,2],[12,2]]){
  const model=makeHospitalDoor(m);
  const hinge=model.group;hinge.position.set(x-.78,0,z);scene.add(hinge);
  result.animations.push(model.opening);
  let blocker=collision.add(x,z,1.6,.13,{door:true});
  let open=false;const secure=x===-3&&z===-2,position=new THREE.Vector3(x,0,z);
  const door={
   position,secure,get isOpen(){return open},
   openByMonster(){if(open)return;model.opening.target=1;collision.remove(blocker);blocker=null;open=true},
   // A closed door has a collision box; the model animates independently.
   close(){if(!open)return;model.opening.target=0;blocker=collision.add(x,z,1.6,.13,{door:true});open=false}
  };
  result.doors.push(door);
  interaction.register(hinge,{kind:'door',label:()=>secure&&!inventory.has('security-key')&&!open?'[E] Segurança: requer chave':'[E] '+(open?'Fechar porta':'Abrir porta'),action:()=>{
   if(secure&&!inventory.has('security-key')&&!open){onMessage('A sala de segurança precisa da chave.');return}
   if(open){
    if((Math.abs(player.position.x-x)<1&&Math.abs(player.position.z-z)<.8)){onMessage('Afaste-se para fechar.');return}
    door.close();
   }else door.openByMonster();
   onNoise(position,5);
  }});
 }
 function pickup(x,y,z,item){
  const model=makeCollectible(m,item.type);model.position.set(x,y,z);scene.add(model);
  interaction.register(model,{kind:'pickup',item,label:()=> '[E] Pegar '+item.name});
 }
 pickup(-3.72,1.02,-8.98,{id:'security-key',type:'key',name:'Chave da segurança'});
 pickup(-2.35,1.02,-8.98,{id:'battery-01',type:'battery',name:'Bateria reserva'});
 pickup(-12,1.02,-8.96,{id:'battery-02',type:'battery',name:'Bateria reserva'});
 pickup(5,.98,8,{id:'battery-03',type:'battery',name:'Bateria reserva'});
 function drawer(x,z){
  const model=makeDrawer(m);model.group.position.set(x,.39,z);scene.add(model.group);
  result.animations.push(model.opening);
  interaction.register(model.group,{kind:'drawer',label:()=> '[E] '+(model.opening.target?'Fechar':'Abrir')+' gaveta',action:()=>{
   model.opening.target=model.opening.target?0:1;
   onMessage(model.opening.target?'Gaveta aberta.':'Gaveta fechada.');
   onNoise(model.group.position,4);
  }});
 }
 drawer(-12,-8.75);drawer(12,-8.75);
 const docs=[
  {x:-3.80,y:1.01,z:-8.88,title:'Registro de ocorrência — 22:47',body:'O plantão anterior informou movimentação no corredor cirúrgico. Nenhum paciente consta no sistema. A chave da sala de segurança permanece sobre a mesa.'},
  {x:-11.8,y:1.01,z:-8.91,title:'Relatório de manutenção',body:'As luzes do bloco sul oscilam desde o fechamento do hospital. A equipe recomenda desligar os circuitos, mas o disjuntor principal permanece inacessível.'},
  {x:11.5,y:1.01,z:-8.89,title:'Memorando interno — Acesso restrito',body:'Funcionários estão proibidos de permanecer após as 23h. Se ouvir passos no corredor vazio, retorne imediatamente à sala de segurança.'},
  {x:4.65,y:.94,z:8,title:'Prontuário 013 — Relatório cirúrgico',body:'Documento confidencial. O paciente 013 nunca recebeu alta. As câmeras registraram uma transferência às 02:17, porém nenhum funcionário estava presente. Esta é a prova que faltava.'}
 ];
 for(const d of docs){
  const g=makeEvidenceFolder(m,{important:d.title.startsWith('Prontuário')});g.position.set(d.x,d.y,d.z);scene.add(g);
  interaction.register(g,{kind:'document',document:d,label:()=> '[E] Ler: '+d.title});
 }
 for(const [x,z] of [[-5.7,-11.5],[-14,-11],[14,-11],[5,-11]]){
  const id='cabinet:'+x+':'+z,model=hospital.lockerModels.get(id);
  if(!model)continue;
  const hidePosition=new THREE.Vector3(x,0,z+.2);
  result.hideSpots.push({id,position:hidePosition});
  interaction.register(model.group,{kind:'hide',label:()=> '[E] '+(player.hidden&&player.hidingId===id?'Sair do armário':'Esconder-se no armário'),action:()=>{
   if(player.hidden)return;
   if(Math.hypot(player.position.x-x,player.position.z-z) >1.65){onMessage('Aproxime-se do armário.');return}
   model.opening.target=1;
   player.hideAt(x,z+.2,id);model.opening.target=.08;
   onMessage('Escondido. Pressione E para sair.');
  }});
 }
 return result;
}