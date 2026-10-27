# NIGHT SHIFT — Correções de jogabilidade e modelos 3D

FPS de terror psicológico em **Three.js + Vite**. Campanha e as oito fases permanecem no projeto.

## Executar
```bash
npm install
npm run dev
```

## Correções desta revisão
- Modelos reutilizáveis em `src/models/HospitalProps.js`: portas com visor, armários detalhados e animados, gavetas com corpo interno deslizante, chaves, baterias, documentos e terminal.
- Novo modelo humanoide em `src/models/CreatureModel.js`, separado da lógica de IA.
- Indicação 3D de objetivos em `src/models/ObjectiveMarkers.js`, posicionada perto dos itens e áreas de missão.
- IA abre **somente portas no caminho planejado**. A porta da sala de segurança fica vedada à criatura, **exceto em CHASE**.
- Armários agora possuem abertura animada e o jogador olha de dentro quando se esconde.
- Gavetas animam o corpo inteiro, não apenas a frente.
- Input capturado enquanto Pointer Lock está ativo; teclas direcionadas ao jogo não selecionam elementos da página.
- **C** é o comando recomendado para agachar. Algumas combinações com Ctrl são atalhos reservados de navegadores (por exemplo Ctrl+W) e não podem ser bloqueadas de forma universal.

## Testes
```bash
npm test
npm run build
npm run test:browser
```
O teste de navegador utiliza Playwright e requer Chromium instalado (`npx playwright install chromium`). Também há um workflow GitHub Actions para validar a cada push na main.

## Controles
WASD: mover · Mouse: olhar · Shift: correr · C: agachar · E: interagir · F: lanterna · R: bateria · Tab: inventário · Esc: pausa · F2: diagnóstico de FPS · F3: IA.
