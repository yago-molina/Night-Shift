# NIGHT SHIFT — Fase 5

Jogo FPS 3D de terror psicológico desenvolvido com **Three.js, JavaScript e Vite**. As Fases 1 a 4 continuam presentes.

## Como iniciar
```bash
npm install
npm run dev
```
Abra a URL apresentada no terminal, geralmente http://localhost:5173.

## Fase 5: terror dinâmico
- `AudioSystem.js`: ambiência procedural de baixa frequência, sons de batidas, metal, rádio, sussurros, goteiras e batimentos cardíacos conforme o perigo. Sem arquivos de som externos. Uso de Web Audio API após clique do jogador.
- `TensionSystem.js`: nível de tensão suavizado pela proximidade da criatura e pelo estado da IA. Redução gradual ao se afastar.
- `HorrorDirector.js`: eventos de susto espaçados, sem repetir o anterior e sem interromper perseguições.
- `Lighting.js`: luminárias piscam temporariamente na área próxima ao jogador; a iluminação geral permanece equilibrada.
- `PostProcessing.js`: ruído, vinheta e interferência ajustados discretamente com a tensão, sem escurecimento extremo.
- Menu: slider de volume e opção para desligar efeitos visuais de pós-processamento.
- HUD: indicação visual discreta do perigo.
- F3: diagnóstico da IA e do sistema de tensão.

## Controles
WASD: mover | mouse: olhar | Shift: correr | Ctrl: agachar | F: lanterna | R: bateria | E: interagir | Tab: inventário | Esc: pausa | F3: depuração

## Testes
```bash
npm test
npm run build
```

O áudio pode ser bloqueado até o primeiro clique em **Iniciar turno**, e depende de suporte a Web Audio. O volume pode ser regulado no menu.

## Testes manuais recomendados
1. Inicie o turno: ouça ambiência leve e eventuais goteiras.
2. Aguarde os primeiros eventos aleatórios sem se aproximar da criatura.
3. Corra perto dela; observe os batimentos, a tensão e a vinheta.
4. Perca a linha de visão; o nível de tensão deve diminuir gradualmente.
5. Pressione F3 para ver o valor da tensão e o último evento.
6. Pause; confirme que o áudio pausa. Desabilite efeitos visuais para comparar.
