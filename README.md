# NIGHT SHIFT — Fase 6

Survival horror FPS em Three.js + Vite. Fases 1–5 preservadas.

## Executar
```bash
npm install
npm run dev
```
Para testes e build:
```bash
npm test
npm run build
```

## Novo: sistema de segurança
- Quatro câmeras CCTV reais em Three.js: corredor, recepção, enfermaria e centro cirúrgico.
- Monitor na sala de segurança para abrir o CCTV com **E**.
- Troque de câmera com **1–4** ou **setas esquerda/direita**; **E** fecha a visualização.
- Enquanto olha as câmeras, o jogador fica parado no mundo e a criatura continua circulando. Não é um modo seguro.
- Renderização secundária com alvos de baixa resolução, em rodízio, para diminuir o custo de GPU.
- Sistema de energia e circuitos independentes: luzes, câmeras e alarme.
- Painel elétrico na parede esquerda da sala de segurança, próximo ao armário.
- Disjuntor/gerador pode ser rearmado e recarregado. O consumo depende dos sistemas ligados.
- Botão de alarme na mesa da segurança. O som serve como distração e atrai a criatura para o local.
- Interações mantêm a mira e a tecla **E** da Fase 3.
- A iluminação ambiente nunca apaga completamente: desligar a iluminação remove as luminárias elétricas, mantendo uma luz ambiente mínima.

## Controles
WASD + mouse: explorar | Shift: correr | Ctrl: agachar | E: interagir | F: lanterna | R: bateria | Tab: inventário | F3: depuração.
CCTV: **1–4**, **← / →**, **E** para sair.

## Teste manual recomendado
1. Abra a câmera central na sala de segurança. Alterne entre as quatro posições.
2. Confira o monstro transitando pelos locais durante o monitoramento.
3. Feche as câmeras, desligue o circuito CCTV no painel e confirme que as imagens ficam indisponíveis.
4. Desligue a iluminação e confira se ainda é possível navegar.
5. Acione o alarme e observe a reação da IA. Teste o tempo de recarga.
6. Consuma energia até o corte e rearme o gerador.
7. Teste pausa, interações e áudio das fases anteriores.

A publicação não substitui um teste visual e de desempenho no navegador real.
