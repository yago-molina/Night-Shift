# NIGHT SHIFT — Fase 2

FPS 3D de terror psicológico desenvolvido com **Three.js + Vite**.

## Executar
Instale Node.js compatível com Vite e execute:
```bash
npm install
npm run dev
```
Abra o endereço informado pelo terminal (normalmente http://localhost:5173).

## Controles
WASD: mover; mouse: olhar; Shift: correr; Ctrl: agachar; F: lanterna; Esc: pausar.

## Fase 1 preservada
Movimentação, gravidade, colisões, stamina, lanterna, menu, HUD e hospital explorável.

## Fase 2 — gráficos e atmosfera
- Texturas procedurais geradas em Canvas (sem downloads de assets externos).
- Materiais PBR para piso, paredes, teto e móveis metálicos.
- Mobiliário hospitalar mais detalhado: camas com estruturas e rodas, armários e carrinhos.
- Luminárias fixadas ao teto e iluminação ambiental equilibrada.
- Neblina leve, tela com granulação discreta e vinheta suave.
- Pós-processamento desacoplado em `PostProcessing.js`.

O visual utiliza geometria procedural. Modelos externos GLB/GLTF de alta fidelidade poderão ser introduzidos posteriormente.

## Build
```bash
npm run build
```
