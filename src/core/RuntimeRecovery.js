// Recovery UI for initialization and animation-loop exceptions.
// Never deletes a saved campaign without an explicit user action.
export function safeModeRequested(location=globalThis.location){
 try{return new URLSearchParams(location?.search||'').get('safe')==='1'}catch{return false}
}
export function showGameError(error){
 const message=error instanceof Error?(error.stack||error.message):String(error||'Erro desconhecido');
 console.error('[Night Shift] Erro de execução:',error);
 const existing=document.getElementById('night-shift-recovery');
 if(existing)return;
 const panel=document.createElement('section');
 panel.id='night-shift-recovery';
 panel.style.cssText='position:fixed;z-index:10000;inset:0;background:#0b161c;color:#e5f0f0;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Arial,sans-serif';
 const content=document.createElement('div');content.style.cssText='max-width:650px;width:100%;border:1px solid #54726c;background:#17292f;padding:26px;border-radius:8px';
 const title=document.createElement('h2');title.textContent='NIGHT SHIFT — Erro de inicialização';title.style.marginTop='0';
 const info=document.createElement('p');info.textContent='O jogo encontrou um problema. Seu checkpoint não foi apagado. Experimente reiniciar em modo seguro.';
 const details=document.createElement('pre');details.style.cssText='max-height:190px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#09161c;color:#c4dddd;padding:12px;font-size:12px';
 details.textContent=message;
 const buttons=document.createElement('div');buttons.style.cssText='display:flex;gap:12px;flex-wrap:wrap';
 const safe=document.createElement('button');safe.textContent='REINICIAR EM MODO SEGURO';safe.onclick=()=>{const url=new URL(window.location.href);url.searchParams.set('safe','1');window.location.assign(url.toString())};
 const copy=document.createElement('button');copy.textContent='COPIAR ERRO';copy.onclick=()=>{navigator.clipboard?.writeText(message).catch(()=>{})};
 buttons.append(safe,copy);content.append(title,info,details,buttons);panel.append(content);document.body.append(panel);
}
