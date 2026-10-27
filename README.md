# NIGHT SHIFT — Fase 3

Jogo FPS 3D de terror psicológico com Three.js e Vite. Todas as fases anteriores preservadas.

## Instalar e executar
```bash
npm install
npm run dev
```
Abra o endereço do Vite no terminal (normalmente http://localhost:5173).

## Controles
- WASD: mover; mouse: olhar; Shift: correr; Ctrl: agachar
- F: ligar/desligar lanterna; R: usar bateria reserva
- E: interagir com portas, objetos, gavetas, documentos e esconderijos
- Tab: abrir ou fechar inventário
- Esc: sair do ponteiro travado, pausar ou fechar documento/inventário

## Fase 3
- Interações em primeira pessoa com Raycaster e prompt na mira
- 8 portas, incluindo a porta da segurança trancada até conseguir a chave
- Gavetas que abrem/fecham
- Chave, baterias de lanterna e inventário de 8 espaços
- Consumo gradual de energia da lanterna e recarga com baterias coletadas
- Três documentos narrativos legíveis
- Armários onde o jogador pode se esconder e sair
- HUD com prompts, bateria, mensagens e inventário

## Observações
Os esconderijos serão usados pela IA na Fase 4. O posicionamento do jogador é restaurado ao sair.
Os modelos ainda são procedurais; os efeitos visuais da Fase 2 permanecem.

## Compilar para produção
```bash
npm run build
```
