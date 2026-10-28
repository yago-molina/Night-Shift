import {DOCUMENTS} from './StoryContent.js';
const NIGHT_NOTES=[
 [DOCUMENTS.drawerA,DOCUMENTS.drawerB,DOCUMENTS.drawerC,DOCUMENTS.drawerD],
 [
 {title:'Noite 2 — O Gravador de Helena',body:'Ouvi o paciente Elias chamar pela irmã. A direção instalou um alto-falante atrás da parede para provocar uma reação. Quando desligamos, a voz continuou.'},
 {title:'Noite 2 — Escala Falsificada',body:'O diretor substituiu os nomes de três técnicos por funcionários que já estavam mortos. Ninguém quer assinar o relatório de 03:17.'},
 {title:'Noite 2 — O Segundo Guarda',body:'O vigilante anterior viu a criatura diante da sala de segurança. Ela olhou a câmera e apontou para a antiga enfermaria.'},
 {title:'Noite 2 — Fita 04',body:'Uma voz infantil diz: “Não fui eu quem apagou a luz.” Em seguida, ouvem-se passos de alguém correndo pelo corredor oeste.'}
 ],
 [
 {title:'Noite 3 — Autópsia Interrompida',body:'A ficha diz que Elias faleceu às 03:17; a gravação mostra atividade cerebral até as 05:58. Mandaram levar a maca ao centro cirúrgico.'},
 {title:'Noite 3 — Ordem do Conselho',body:'O Projeto VIGÍLIA não foi encerrado. Os registros do hospital são enviados para um laboratório ainda ativo, fora da cidade.'},
 {title:'Noite 3 — Bilhete para Helena',body:'Se o vigia encontrar esta mensagem: proteja a fita, não o diretor. A verdade está escondida entre as cópias do prontuário.'},
 {title:'Noite 3 — Sala 013',body:'Todas as portas foram numeradas novamente, mas a criança ainda chama pelo número antigo. Três batidas. Silêncio. Três batidas.'}
 ],
 [
 {title:'Noite 4 — O Experimento Responde',body:'Elias reagiu à voz da mãe reproduzida em uma fita. A direção ordenou repetir a gravação até a reação deixar de parecer humana.'},
 {title:'Noite 4 — Turno sem Saída',body:'O funcionário que relatou a presença do paciente foi impedido de sair antes do amanhecer. Sua assinatura desapareceu do livro.'},
 {title:'Noite 4 — A Porta da Segurança',body:'O monstro não quer entrar ali por acaso: procura a última fita, guardada pelos vigias. Sempre avisa com passos mais fortes antes de avançar.'},
 {title:'Noite 4 — Despacho 03:17',body:'O diretor escreveu: “Se o protocolo continuar, poderemos ouvir alguém que já morreu.” Este era o verdadeiro objetivo do hospital.'}
 ],
 [
 {title:'Noite 5 — Confissão do Diretor',body:'Sabíamos que Elias sofria. Mantivemos as gravações mesmo depois da morte porque havia respostas. Pedi que apagassem tudo; eu estava com medo.'},
 {title:'Noite 5 — Último Testemunho',body:'Helena deixou o prontuário 013 para alguém encontrar. A criança não era um monstro. Foi transformada pela violência do nosso experimento.'},
 {title:'Noite 5 — Fim do Protocolo',body:'O sistema VIGÍLIA foi criado para manter uma consciência acordada. A criatura se irrita com o tempo porque o hospital ainda repete o tratamento.'},
 {title:'Noite 5 — Para o Próximo Vigia',body:'Se conseguir chegar às seis, leve as provas e conte o que fizeram com Elias. Talvez só assim ele possa descansar.'}
 ]
];
export function nightDrawerReport(night,id){
 const index={deskReception:0,deskOffice:1,deskSecurity:2,deskSurgery:3}[id];
 if(index===undefined)throw new Error('Gaveta desconhecida: '+id);
 return NIGHT_NOTES[Math.max(1,Math.min(5,Math.floor(night||1)))-1][index];
}