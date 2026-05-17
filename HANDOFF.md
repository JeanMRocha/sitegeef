# Site GEEF - Handoff Rapido

## Ler primeiro

1. `agente.md`
2. `docs/AGENT_PLAYBOOK.md`
3. `docs/MODULE_MAP.md`
4. `docs/baseerp.md` quando a mudanca for de ERP
5. `docs/MCP_SUPABASE_GEEF.md` quando a tarefa envolver MCP ou Supabase via Codex
6. `docs/ADMIN_REGRESSION_NOTES.md` quando a tarefa tocar admin, permissões, pessoas, governança, assets do Next ou SEO/fallback de layout
7. `tests/admin-smoke.mjs` para validar rotas admin principais antes de abrir o browser
8. `docs/ADMIN_MODULE_CHECKLIST.md` quando a tarefa for criar ou alterar qualquer módulo admin

## Regra de trabalho

- Uma mudanca = um modulo principal por vez.
- Antes de editar, localizar o dono do fluxo.
- Usar `@/` para imports.
- `npm run build` antes de encerrar.
- Se mudar cache, invalidar por tag/path no mesmo modulo.
- Nao misturar client session com leitura de admin quando houver `service-role`.
- Se `next dev` e `next build` forem executados no mesmo checkout, reiniciar o `next dev` depois do build antes de validar CSS/chunks.

## Quando mexer em visual

1. Identificar a pagina e o layout compartilhado.
2. Procurar CSS comum antes de criar estilo novo.
3. Ajustar header, hero, cards e formularios na mesma familia visual.
4. Verificar desktop e mobile.
5. Validar contraste e espacamento.

## Quando mexer em Supabase

- `lib/supabase/server.ts` = leitura SSR com sessao do usuario.
- `lib/supabase/service-role.ts` = leitura cacheada de admin e rotas publicas derivadas.
- `lib/admin/cache.ts` = invalida cache de dashboard, biblioteca e documentos.
- `lib/admin/safe-supabase.ts` = fallback padronizado para leituras e mutacoes admin com falha esperada do Supabase.
- `lib/areas/invalidate-user-area.ts` = invalida area do usuario/leitor.
- `lib/escalas/public-escalas.ts` = cache publico das escalas.
- `docs/MCP_SUPABASE_GEEF.md` = recuperar e validar o MCP `supabase-geef`.

## Ordem das skills

Use esta ordem quando a tarefa envolver estrutura/admin, actions, banco ou segurança:

1. `skills/padrao-modulo-admin.md`
2. `skills/padrao-actions-ts.md`
3. `skills/supabase-patterns.md`
4. `skills/auth-permissions.md`
5. `skills/migrations-workflow.md` quando houver mudança de schema
6. `skills/roteamento-operacional-autoreflex.md` quando a tarefa for misturada, repetitiva ou duvidosa

Árvore rápida de decisão:

- CRUD/admin, lista, novo, editar, detalhe -> `skills/padrao-modulo-admin.md`
- Getter/mutação/cache/revalidate/error fallback -> `skills/padrao-actions-ts.md`
- Supabase, RLS, server role, browser client -> `skills/supabase-patterns.md`
- RBAC, `requirePermission`, `usuarios_sistema` -> `skills/auth-permissions.md`
- Tabela, coluna, índice, policy, rollout -> `skills/migrations-workflow.md`
- Se a tarefa toca mais de uma camada e você quer a decisão certa primeiro -> `skills/roteamento-operacional-autoreflex.md`

Atalhos locais:

- `npm run skills:health`
- `npm run skills:list`
- `npm run skills:search "termo"`
- `npm run skills:recommend "frase da tarefa"`
- `npm run skills:index`

Quando o Autoreflex voltar a responder, rodar primeiro:

- `npm run skills:index`
- `npm run skills:list`

## Quando mexer em cache

- Cache curto para listagens pesadas.
- Invalida no modulo que escreveu.
- Nao cachear formularios sensiveis nem leitura dependente de sessao.
- Se uma pagina quebrar no build por prerender, marcar o segmento como dinmico.

## Responsabilidades mais usadas

- `app/admin/page.tsx` -> dashboard
- `app/admin/biblioteca/*` -> acervo, emprestimos, reservas
- `app/admin/documentos/*` -> modelos, termos, consentimentos, voluntariado
- `app/admin/pessoas/*` -> cadastro central
- `app/admin/funcoes/*` -> funcoes e temas
- `app/admin/escalas/*` -> escalas publicas e operacao mensal

## Mudancas recentes para nao regredir

- `app/admin/usuarios/actions.ts`
  - Listagem passou a usar `supabase.auth.admin.listUsers()` como base.
  - Contas de teste do Codex sao filtradas por padrao de email e metadata de teste.
  - `usuarios_sistema` virou complemento; falhas esperadas nao devem poluir o console.
- `app/admin/governanca/actions.ts`
  - Consultas para diretorias, cargos, cargo_ocupacoes, assembleias e pessoas disponiveis devem falhar em fallback silencioso.
  - O objetivo e manter a pagina funcional mesmo com tabelas ausentes no schema cache.
- `app/admin/pessoas/actions.ts`
  - `getPessoas` e `getPessoaById` devem retornar fallback vazio/null sem console error para falhas esperadas do Supabase.
- `lib/auth/permissions.ts`
  - `getUserPermissions()` deve evitar erro ruidoso quando `usuarios_sistema` nao existe ou nao responde.
  - A permissao efetiva ainda deve sair do `app_metadata` quando o registro interno nao existir.
- `app/admin/pessoas/nova/page.tsx`
  - O fluxo por abas deve continuar responsivo e salvar etapa por etapa.
  - O cabeçalho deve manter apenas `Nova Pessoa` e os botoes de acao alinhados a direita.
- `components/admin/*` e `styles/admin.css`
  - O shell admin precisa crescer com a largura da viewport.
  - Nao reintroduzir `max-width` fixo que prenda cards, abas ou formularios no centro.
- `app/favicon.ico/route.ts`
  - Nao recriar esse route handler enquanto `public/favicon.ico` for a fonte unica do favicon.

## Padrões de busca e alerta

Use estes regex/padroes para revisar o console e os logs quando mexer nesses fluxos:

- `Falha ao carregar pessoas`
- `Falha ao complementar usuarios_sistema`
- `Falha ao ler usuarios_sistema em getUserPermissions`
- `Falha ao carregar diretorias`
- `Falha ao carregar cargos`
- `Falha ao carregar cargo_ocupacoes`
- `Falha ao carregar assembleias`
- `Could not find the module .* React Client Manifest`
- `Módulo de erros`
- `Ocorreu um erro na aplicação`
- `Abrir painel de erros`
- `Refused to apply style from .* MIME type ('text/plain')`
- `Failed to load resource: the server responded with a status of 404`

## Validacao curta recomendada

1. Reiniciar `next dev -p 3500` em sessao limpa.
2. Abrir `/admin/usuarios`, `/admin/governanca` e `/admin/pessoas`.
3. Confirmar que nao aparecem overlays nem erros de console.
4. Confirmar que os assets `/_next/static/css/app/layout.css` e `/_next/static/chunks/main-app.js` respondem `200`.
5. Se tiver rodado `next build` antes, repetir o passo 1.
6. `npm run test:admin-smoke` para checar overlay e assets antes de abrir o browser.
7. Se a tarefa mexer em módulo novo ou alterado, conferir o checklist em `docs/ADMIN_MODULE_CHECKLIST.md`.
