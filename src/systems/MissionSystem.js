export const SHIFT_MINUTES=420;
export const SECONDS_PER_MINUTE=6;
export const MISSIONS=[
 {id:'key',title:'Encontre a chave da sala de segurança',hint:'Procure sobre a mesa de vigilância.'},
 {id:'incident',title:'Investigue o registro do plantão',hint:'Leia o documento sobre a mesa da segurança.'},
 {id:'cctv',title:'Inspecione o circuito de câmeras',hint:'Acesse o monitor da segurança com E.'},
 {id:'generator',title:'Localize o gerador na enfermaria antiga',hint:'Ala norte, setor oeste: interaja com o gerador.'},
 {id:'ward',title:'Encontre o diário da enfermeira',hint:'Investigue as camas e os arquivos da enfermaria.'},
 {id:'research',title:'Descubra o Projeto VIGÍLIA',hint:'Procure arquivos na administração, ala sul leste.'},
 {id:'evidence',title:'Encontre o Prontuário 013 na nova cirurgia',hint:'Centro cirúrgico transferido para o setor norte leste.'},
 {id:'returned',title:'Volte à sala de segurança',hint:'Retorne ao terminal de encerramento.'},
 {id:'survive',title:'Sobreviva até 05:30 e encerre o turno',hint:'A saída será liberada às 05:30.'}
];
export const TIMED_EVENTS=[
 {minute:60,title:'00:00 — Mudança de plantão',body:'A linha telefônica do hospital acaba de cair.'},
 {minute:120,title:'01:00 — Comunicado interrompido',body:'O rádio emite uma voz abafada: “Não confie nos registros...”'},
 {minute:180,title:'02:00 — Arquivo restrito',body:'A enfermaria parece estar vazia. O centro cirúrgico guarda respostas.'},
 {minute:240,title:'03:00 — Queda de sinal',body:'Uma transmissão de segurança foi interrompida.'},
 {minute:300,title:'04:00 — Último aviso',body:'O hospital não consta mais nos registros de serviço.'},
 {minute:390,title:'05:30 — Saída autorizada',body:'O terminal da segurança pode encerrar o turno agora.'}
];
export class MissionSystem{
 constructor({onMission=()=>{},onEvent=()=>{},onCheckpoint=()=>{}}={}){
  this.onMission=onMission;this.onEvent=onEvent;this.onCheckpoint=onCheckpoint;
  this.elapsed=0;this.stage=0;this.flags={key:false,incident:false,cctv:false,generator:false,ward:false,research:false,evidence:false,returned:false,alarm:false,powerFailure:false};this.fired=[];this.finished=false;this.end=null;this.checkpointHour=-1;this.lastSavedStage=-1;
 }
 get minutes(){return Math.min(SHIFT_MINUTES,Math.floor(this.elapsed/SECONDS_PER_MINUTE))}
 get clock(){const n=this.minutes;const hour=(23+Math.floor(n/60))%24;return String(hour).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
 get objective(){return MISSIONS[Math.min(this.stage,MISSIONS.length-1)]}
 update(dt,{atSecurity=false}={}){
  if(this.finished)return;
  this.elapsed=Math.min(SHIFT_MINUTES*SECONDS_PER_MINUTE,this.elapsed+Math.max(0,dt));
  for(const item of TIMED_EVENTS){if(this.minutes>=item.minute&&!this.fired.includes(item.minute)){this.fired.push(item.minute);this.onEvent(item)}}
  if(this.stage===7&&atSecurity)this.action('returned');
  const h=Math.floor(this.minutes/60);
  if(h>this.checkpointHour&&h>0&&h<7){this.checkpointHour=h;this.onCheckpoint('Progresso das '+this.clock)}
  // The game controller resolves sunrise so the ending UI can be displayed safely.
 }
 action(type){
  if(this.finished)return false;
  if(type in this.flags)this.flags[type]=true;
  let changed=false;
  while(this.stage<MISSIONS.length-1&&this.flags[MISSIONS[this.stage].id]){
   this.stage++;changed=true;this.onMission(this.objective,this.stage);
  }
  if(changed){this.lastSavedStage=this.stage;this.onCheckpoint('Objetivo concluído')}
  return changed;
 }
 canExtract(){return this.minutes>=390&&this.stage>=8}
 complete(reason='terminal'){
  if(this.finished)return this.end;
  this.finished=true;
  const allEvidence=this.flags.evidence&&this.flags.incident&&this.flags.cctv&&this.flags.generator&&this.flags.ward&&this.flags.research;
  let kind='uncertain';
  if(reason==='caught')kind='lost';
  else if(allEvidence&&this.flags.returned)kind='truth';
  this.end={kind,reason,clock:this.clock,title:kind==='truth'?'A VERDADE SOBREVIVEU':kind==='lost'?'O TURNO TERMINOU':'O HOSPITAL PERMANECE EM SILÊNCIO',
   description:kind==='truth'?'Você saiu com provas do que aconteceu no hospital. O silêncio poderá finalmente ser quebrado.':kind==='lost'?'Você foi encontrado antes de concluir a investigação.': 'O turno terminou, mas faltam provas. Há perguntas que continuarão sem resposta.'};
  return this.end;
 }
 snapshot(){return {version:1,elapsed:this.elapsed,stage:this.stage,flags:{...this.flags},fired:[...this.fired],checkpointHour:this.checkpointHour,finished:this.finished}}
 restore(saved){
  if(!saved||saved.version!==1||this.finished)return false;
  this.elapsed=Math.min(SHIFT_MINUTES*SECONDS_PER_MINUTE,Math.max(0,Number(saved.elapsed)||0));
  this.flags={...this.flags,...saved.flags};
  // Recalculate stage from flags to migrate pre-expansion checkpoints safely.
  this.stage=0;while(this.stage<MISSIONS.length-1&&this.flags[MISSIONS[this.stage].id])this.stage++;
  this.fired=Array.isArray(saved.fired)?saved.fired.filter(x=>Number.isInteger(x)):[];
  this.checkpointHour=Number.isInteger(saved.checkpointHour)?saved.checkpointHour:Math.floor(this.minutes/60);
  this.finished=false;this.end=null;return true;
 }
}