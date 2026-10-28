# NIGHT SHIFT — Turno de 20 minutos

Jogo de terror em Three.js e Vite. Preserva a criatura, audição circular e agressividade progressiva.

## Iniciar
```bash
npm install
npm run dev
```

## Alterações da revisão
- **Turno completo de 20 minutos reais**, das 23:00 às 06:00. Um minuto no jogo = 20/7 segundos reais. A saída abre às 05:30 (18 min 34 s reais).
- Checkpoints de versões anteriores são convertidos para preservar o **horário do jogo**, sem apagar progresso.
- Pistas importantes (chave, ocorrências, diário, Projeto Vigília e Prontuário 013) surgem em **dois pontos possíveis** sobre superfícies de cada sala, selecionados pelo seed da campanha. Assim as missões exigem procurar no setor, não ir sempre à mesma coordenada.
- Gavetas com 50% de chance independente de conter uma pista; os papéis acompanham o corpo deslizante, não flutuam fora da gaveta. Gaveta do centro cirúrgico voltada para a área acessível.
- **Cinco câmeras CCTV**: corredor central, corredor oeste, enfermaria/gerador, acesso cirúrgico e entrada da segurança. Todas observam áreas relevantes para a patrulha ou a invasão.
- CCTV detecta movimento da criatura na imagem e mostra aviso. Para concluir o objetivo, observe **dois setores por pelo menos 0,8 segundo cada**, trocando com 1–5 ou setas.
- O gerador continua na enfermaria, e a cirurgia no setor nordeste.
- Nenhuma alteração na audição, velocidade de perseguição ou agressividade da criatura.

## Campanha
1. Encontrar chave da segurança;
2. Ler registro de ocorrência;
3. Monitorar dois setores via CCTV;
4. Acionar gerador na enfermaria;
5. Encontrar diário de Helena;
6. Investigar o Projeto VIGÍLIA na administração;
7. Descobrir Prontuário 013 na cirurgia;
8. Retornar à segurança;
9. Sair após 05:30 ou sobreviver até 06:00.

A invasão da segurança continua sorteada a cada campanha, no mesmo intervalo de horário do jogo.

## Testar
```bash
node --test test/*.test.js
npm run build
```
O GitHub Actions também executa um teste de inicialização em navegador.
