# NIGHT SHIFT — Capítulo Santa Avelina

Survival horror FPS em Three.js + Vite. Mantém a base estável da Fase 8, com IA de audição circular.

## Iniciar
```bash
npm install
npm run dev
```

## Nova história
O antigo **Hospital Santa Avelina** realizou o **Projeto VIGÍLIA** com o paciente Elias (013). Registros de uma enfermeira, da administração, da manutenção e do centro cirúrgico revelam o encobrimento do experimento ocorrido às **03:17**.

- Gavetas em quatro pontos do hospital: cada uma tem **50% de chance** de conter uma pista adicional, com sorteio independente.
- Os resultados das gavetas e o horário do ataque especial são determinados por um seed salvo no checkpoint. A campanha continua com o mesmo sorteio ao recarregar.
- Os registros da recepção, manutenção, enfermaria e administração trazem informações adicionais.
- O centro cirúrgico está agora **na ala norte leste**; o prontuário 013 fica na mesa ao fundo.
- O **gerador** foi movido da segurança para a **enfermaria antiga, ala norte oeste**. O painel de circuitos permanece na segurança, mas a energia só é restabelecida fisicamente no gerador.

## Campanha expandida
1. Chave da segurança
2. Registro da ocorrência
3. Câmeras CCTV
4. Localizar e acionar o gerador da enfermaria antiga
5. Encontrar o diário da enfermeira
6. Descobrir os registros do Projeto VIGÍLIA na administração
7. Encontrar o Prontuário 013 no centro cirúrgico transferido
8. Retornar à segurança
9. Sobreviver até 05:30 e encerrar o turno

## Ataque aleatório à segurança
- Uma invasão ocorre uma vez durante cada campanha, em um minuto sorteado entre **01:25 e 03:59** (hora do jogo).
- Dura **45 segundos reais**, com sinal de alerta e falhas momentâneas na iluminação.
- Apenas durante esse evento ou em perseguição comum o monstro pode abrir a porta e invadir a segurança.
- A criatura pode encontrar o jogador se ele se expuser; esconder-se corretamente continua útil.
- O monstro desiste da invasão ao final do evento. O horário é preservado entre checkpoints.

## Testes
```bash
node --test test/*.test.js
npm run build
```

A integração também é validada em Chrome pelo workflow do GitHub Actions.
