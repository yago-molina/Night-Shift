# NIGHT SHIFT — Campanha de cinco noites

Terror psicológico em Three.js + Vite. Cada noite vai das 23h às 06h e dura **20 minutos reais**. A iluminação ficou moderadamente mais escura, preservando a lanterna e as áreas iluminadas.

## Iniciar
```bash
npm install
npm run dev
```

## Progressão
Sobreviva até 06h ou conclua todos os objetivos e saia às 05h30. Na tela final, **Próxima noite** avança automaticamente, até a quinta. Uma captura permite **Tentar novamente** na noite atual. **Novo turno** no menu reinicia toda a campanha na Noite 1. A noite ativa e os checkpoints ficam no navegador.

| Noite | Tema | Invasões previstas |
|---|---|---:|
| 1 | O Primeiro Plantão | 0 |
| 2 | A Voz no Corredor | 1 |
| 3 | A Ala Lacrada | 2 |
| 4 | A Vigília | 3 |
| 5 | 03:17 | 4 |

Os ataques são sorteados entre pontos diferentes da madrugada. Uma mensagem de alerta aparece aproximadamente quatro minutos de jogo antes do ataque. Um medidor visível indica a irritação do monstro de 0 a 4. A irritação sobe com a madrugada e com as noites e influencia audição, perseguição e buscas; o teto de velocidade continua abaixo da corrida do jogador.

## Energia e sorte
Três momentos por noite sorteiam um valor de 0 a 3. Quando sai **1 ou 3**, o hospital perde energia, com perda crescente por noite. Quando sai 0 ou 2, não há perda. Os valores são determinísticos por partida e salvos no checkpoint. Use o gerador da enfermaria para recuperar energia. As oscilações são adicionais ao consumo normal.

## Lore nas gavetas
As quatro gavetas têm chances de documentos e novos textos a cada noite, revelando por partes o destino de Elias, o Projeto VIGÍLIA e a responsabilidade da direção do Hospital Santa Avelina. As pistas da história principal continuam distribuídas pelo mapa.

## Testes
```bash
node --test test/*.test.js
npm run build
```
O GitHub Actions verifica os testes, build e inicialização no Chrome. Faça também uma partida manual para avaliar ritmo, visibilidade e comportamento da criatura em todas as noites.
