# NIGHT SHIFT — Fase 4

FPS 3D de terror psicológico, construído com HTML, CSS, JavaScript, Three.js e Vite.

## Instalação
```bash
npm install
npm run dev
```

## Comandos
- WASD / mouse: mover / olhar
- Shift: correr; Ctrl: agachar
- F: lanterna; R: bateria
- E: interagir / entrar e sair de esconderijo
- Tab: inventário; Esc: pausa e fechar documentos
- **F3: painel de diagnóstico da IA**, mostrando estado, distância, caminho e ocultação do jogador

## Fase 4 — Criatura e inteligência artificial
- Monstro 3D procedural com aparência humanoide e animação de movimento
- 20 segundos de tempo seguro após iniciar o turno
- Patrulhamento por áreas do hospital; navegação A* que respeita paredes e móveis
- Portas abertas automaticamente pela criatura ao percorrer corredores
- Detecção por visão (cone e obstáculos) e audição de passos (correr é mais barulhento)
- Investiga sons de portas/gavetas e a última posição conhecida do jogador
- Procura esconderijos perto do último local onde observou o jogador
- Suspeita crescente para armários investigados repetidamente
- Captura e tela de derrota, com botão para recomeçar o turno

A criatura não usa IA generativa externa: a lógica é local, determinística e baseada em regras.
O período de segurança e os valores de velocidade são parâmetros em `src/ai/Monster.js`.

## Testes
```bash
npm test
npm run build
```

**Sugestão de verificação manual:** aguarde os 20 segundos iniciais, aproxime-se correndo da criatura e observe a perseguição. Depois, quebre a linha de visão e entre em um armário. Use F3 para acompanhar as mudanças de estado. Verifique também a abertura de portas pelo monstro.

O estilo de iluminação e os materiais PBR da Fase 2 não foram alterados.
