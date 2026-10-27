# NIGHT SHIFT — Fase 8 (Beta)

FPS 3D de terror, em HTML/CSS/JavaScript, Three.js e Vite. As oito fases do planejamento inicial estão implementadas no projeto.

## Executar
```bash
npm install
npm run dev
```

## Verificações
```bash
npm test
npm run build
```

## Fase 8: melhorias
- Configurações gráficas **Baixa / Média / Alta** no menu, com resolução adaptável e custo variável das câmeras.
- Volume e sensibilidade do mouse ajustáveis. Opções persistidas no navegador.
- Monitor de desempenho com **F2** (FPS estimado, draw calls e triângulos).
- Otimização do Raycaster: objetos interativos registrados uma vez, em vez de recriar a lista a cada frame.
- CCTV atualizado apenas quando em uso ou quando o jogador está perto do terminal, com renderização secundária limitada.
- Movimento de cabeça discreto ao caminhar e correr.
- Passos sonoros procedurais; ruído de áudio reutilizado por cache para reduzir alocações.
- Melhorias de layout nas configurações e correção de remoção de itens restaurados ao carregar checkpoint.
- Configurações mantêm a iluminação base da Fase 2.

## Controles
WASD / mouse — mover / olhar; Shift — correr; Ctrl — agachar; F — lanterna; R — bateria; E — interagir; Tab — inventário; Esc — pausa; **F2** — desempenho; **F3** — estados da IA; F4 — adiantamento de tempo para testes, com F3 ativo.

## Campanha
23h–6h; missões sequenciais, documentos, CCTV, coleta de provas e três finais. Checkpoints usam localStorage; novo turno apaga o progresso salvo.

## Teste manual sugerido
1. No menu, altere qualidade, volume e sensibilidade; confirme que as opções permanecem após recarregar.
2. Use F2, alterne qualidades e compare o FPS. Não há FPS fixo garantido.
3. Teste CCTV e alternância das câmeras; observe o desempenho e a visualização.
4. Corra, agache e ande; confira movimentação de câmera e sons de passos.
5. Colete itens, conclua uma missão e restaure checkpoint, verificando objetos duplicados.
6. Pause, abra inventário, leia documentos, use terminal e conclua a campanha.

A versão beta ainda depende de teste completo no navegador, incluindo diferentes placas gráficas e tamanhos de tela.
