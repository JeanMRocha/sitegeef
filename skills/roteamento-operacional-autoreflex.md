# Roteamento Operacional de Skills GEEF

## Objetivo

Definir qual skill consultar primeiro em tarefas do GEEF para reduzir exploração desnecessária e manter a execução consistente.

## Quando usar

- Antes de mexer em módulo admin
- Antes de editar server actions
- Antes de tocar Supabase, permissões ou migrações
- Antes de criar uma skill nova

## Árvore de decisão

1. Tarefa é sobre CRUD, rotas `page.tsx`, `novo/page.tsx`, `[id]/page.tsx` ou estrutura de módulo admin?
   - Use `skills/padrao-modulo-admin.md`
2. Tarefa é sobre `actions.ts`, cache, retorno de `[]` / `null`, ou evitar `throw` em falha esperada?
   - Use `skills/padrao-actions-ts.md`
3. Tarefa envolve Supabase, RLS, client server/browser/service-role ou tipos de acesso?
   - Use `skills/supabase-patterns.md`
4. Tarefa envolve permissões, RBAC, `requirePermission`, `usuarios_sistema` ou menu por acesso?
   - Use `skills/auth-permissions.md`
5. Tarefa envolve feedback visual de salvar, validação de formulário, `useNotification()`, `NotificationProvider` ou aviso de sessão?
   - Use `skills/notificacoes-timers-avisos.md`
6. Tarefa envolve relatórios, dashboards, KPIs, exportação PDF/print, visão executiva ou telas de BI?
   - Use `skills/relatorios-geef.md`
7. Tarefa envolve catálogo de livros, exemplares físicos, vendas, empréstimos, reservas, multas ou telas de livraria/biblioteca?
   - Use `skills/livraria-biblioteca-hibrida.md`
8. Tarefa envolve schema, tabela, índice, policy, migração ou rollback?
   - Use `skills/migrations-workflow.md`

## Regras de operação

- Não consultar a skill errada quando o tipo de tarefa for claro.
- Em tarefas mistas, consultar na ordem da árvore acima.
- Se a mudança criar um padrão reaproveitável, registrar uma skill nova.
- Se houver muita repetição de erro, criar checklist ou comando local antes de continuar remediando arquivo por arquivo.
- Quando a tela usar abas ou wizard, o cabeçalho deve concentrar `Salvar` e `Cancelar` para todas as abas; não duplicar botões no rodapé de cada painel.
- Quando um formulário tiver abas secundárias, o botão do cabeçalho deve apontar para o form ativo por `form=...`, mantendo o mesmo lugar visual independentemente da aba.
- Ao criar telas novas do admin, seguir o padrão definido nas skills antes de inventar um layout próprio.
- Após salvar, exibir feedback curto de sucesso ou erro e voltar para a visão correta da área, sem depender de texto longo.
- Se a tela precisar avisar sucesso, erro, validação ou sessão, usar a skill de notificações antes de escrever mensagens fixas.

## Sinais de risco

- `PGRST205`
- `throw error` em `actions.ts`
- retorno com tipo errado em lista/paginação
- overlay do Next em rota admin
- permissões escondendo UI sem proteger rota

## Consideração

Esta skill é de orquestração. Ela não substitui as skills de execução; só decide qual abrir primeiro.
