# Criatura — Fase 4
IA determinística local, sem API externa:
- Máquina de estados: PATROL / INVESTIGATE / CHASE / SEARCH / RETURN / ATTACK
- A* sobre grade 2D usando paredes e móveis do CollisionWorld
- Portas são abertas ao encontrar um bloqueio na rota
- Visão por cone + checagem de obstáculos; audição conforme velocidade do jogador
- Perde o jogador após ficar sem linha de visão; investiga a última posição conhecida
- Reconhece armários próximos à última posição vista e aumenta suspeita após buscas repetidas
- Modelo 3D procedural com animação básica de caminhada
- Período inicial de segurança de 20 segundos para explorar
- Tecla F3 mostra estado, distância e outros indicadores para testes
