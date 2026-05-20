# Engineering Guidelines - GEEF

## Objetivo

Definir o padrao de arquitetura e manutencao do projeto para que novas mudancas fiquem coerentes, pequenas e faceis de evoluir.

## Principios

### SOLID

- `S` - Uma responsabilidade por componente, modulo ou funcao.
- `O` - Preferir extensao por composicao, configuracao ou estrategia em vez de editar o nucleo o tempo todo.
- `L` - Manter contratos consistentes entre implementacoes e seus consumidores.
- `I` - Expor interfaces pequenas e objetivas; nao acoplar telas e actions a servicos mais amplos do que o necessario.
- `D` - Depender de contratos ou adaptadores, nao de detalhes concretos quando houver risco de acoplamento.

### Boas praticas gerais

- Separar leitura, mutacao, validacao e apresentacao.
- Manter os limites entre dominio, persistencia e UI claros.
- Preferir funcoes pequenas, nomeadas pelo que fazem.
- Evitar estado compartilhado desnecessario no cliente.
- Usar defaults seguros quando o dado pode faltar.
- Tratar falhas esperadas como fallback silencioso, nao como erro ruidoso.
- Validar impacto visual e funcional antes de concluir.

## Regras de implementacao

### Estrutura

- Cada modulo deve ter um dono claro.
- A action deve concentrar a mutacao e a invalidacao.
- A tela deve montar a experiencia, nao a regra de negocio.
- O helper compartilhado deve ficar em `lib/` ou no dominio correto.

### Dados e persistencia

- Ler via `server` quando depender de sessao.
- Usar `service-role` apenas quando o fluxo exigir leitura ou escrita centralizada sem depender da sessao do usuario.
- Evitar duplicar a mesma fonte de verdade em localStorage, estado local ou constantes fixas.
- Quando um dado for compartilhado pelo admin e pelo site publico, persistir no banco.

### UI

- Reutilizar shell, cards, cores e espacamentos existentes.
- Nao criar dois sistemas visuais concorrentes no mesmo fluxo.
- Manter menus e acoes visiveis onde fazem sentido.
- Reduzir ruido visual em formulários, modais e telas de operacao.

### Documentacao

- Toda mudanca relevante deve atualizar o handoff ou o documento do modulo.
- Mudanca de schema deve registrar a ordem e o impacto.
- Mudanca de comportamento deve explicar o motivo e a validacao.
- Se a entrega criar um padrao reutilizavel, documentar em `docs/` ou `skills/`.

## Checklist minimo antes de finalizar

1. Confirmar responsabilidade do modulo.
2. Conferir se a mudanca respeita os contratos existentes.
3. Validar build.
4. Validar o fluxo afetado no navegador ou no ambiente alvo.
5. Atualizar documentacao relevante.

