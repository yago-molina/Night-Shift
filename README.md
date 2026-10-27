# NIGHT SHIFT — Fase 7: Campanha e narrativa

Jogo FPS de terror em Three.js, Vite e JavaScript. Os sistemas das fases 1–6 permanecem ativos.

## Executar
```bash
npm install
npm run dev
```

## Campanha
Um turno de 23:00 a 06:00, com relógio de 6 segundos reais por minuto de jogo (aproximadamente **42 minutos** por turno completo).

Objetivos em sequência:
1. Coletar a chave da segurança.
2. Ler o registro de ocorrência na sala de segurança.
3. Utilizar o CCTV.
4. Ler o **Prontuário 013** no centro cirúrgico, perto da cama.
5. Retornar à sala de segurança.
6. Aguarde 05:30 e use o terminal de saída fixado na divisória leste da sala.

Acontecimentos narrativos são anunciados às 00:00, 01:00, 02:00, 03:00, 04:00 e 05:30.

## Finais
- **A verdade sobreviveu:** reúne todas as provas e encerra o turno na segurança.
- **O hospital permanece em silêncio:** chega às 06:00 sem todas as provas.
- **O turno terminou:** capturado pela criatura antes de escapar.

## Checkpoints
- Salvamento local após concluir objetivos e em horários-chave.
- O menu oferece **Continuar turno** quando existe um checkpoint.
- O inventário, a energia, a posição, a bateria e os objetivos são restaurados.
- A IA recomeça em patrulha com intervalo de segurança para evitar uma morte imediata ao carregar.
- A tecla **F3** ativa diagnóstico; com diagnóstico visível, **F4** avança 1 hora de jogo até 05:30, apenas para testes.

Para criar uma nova partida, escolha **Novo turno** no menu; essa ação apaga o checkpoint anterior. O salvamento usa localStorage e fica restrito ao navegador.

## Testes
```bash
npm test
npm run build
```

## Controles
WASD, mouse, Shift, Ctrl, E, F, R, Tab, Esc; CCTV: 1–4, setas e E. F3 mostra depuração da IA e F4 (somente com depuração ativa) acelera o relógio para testar a campanha.

## Limitações planejadas
Os checkpoints não congelam todos os detalhes do mundo (como portas abertas ou posições da criatura); são checkpoints de **progressão**, e não salvamentos quadro a quadro. A sessão deve ser validada no navegador para confirmar visibilidade e interações do terminal e do prontuário.
