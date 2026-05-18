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
9. `skills/lgpd-governanca.md` quando a tarefa tocar dados pessoais, consentimento, retenção, logs, incidentes ou privacidade

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
- `docs/SUPABASE_MIGRATION_MAP.md` = mapa local -> checkpoint remoto das migrations aplicadas.
- Cadastro da instituicao: o singleton e as policies ficam em `supabase/migrations/20260517_instituicao_singleton_and_policies.sql`.

## Ordem das skills

Use esta ordem quando a tarefa envolver estrutura/admin, actions, banco ou segurança:

1. `skills/padrao-modulo-admin.md`
2. `skills/padrao-actions-ts.md`
3. `skills/supabase-patterns.md`
4. `skills/auth-permissions.md`
5. `skills/notificacoes-timers-avisos.md` quando a tela precisar de feedback, validação ou aviso de sessão
6. `skills/relatorios-geef.md` quando a tarefa for analítica, de KPI, dashboard ou exportação
7. `skills/livraria-biblioteca-hibrida.md` quando a tarefa for de catálogo, exemplares, vendas, empréstimos ou multas
8. `skills/migrations-workflow.md` quando houver mudança de schema
9. `skills/lgpd-governanca.md` quando a tarefa tocar dados pessoais, base legal, direitos do titular, retenção ou incidentes
10. `skills/roteamento-operacional-autoreflex.md` quando a tarefa for misturada, repetitiva ou duvidosa

Árvore rápida de decisão:

- CRUD/admin, lista, novo, editar, detalhe -> `skills/padrao-modulo-admin.md`
- Getter/mutação/cache/revalidate/error fallback -> `skills/padrao-actions-ts.md`
- Supabase, RLS, server role, browser client -> `skills/supabase-patterns.md`
- RBAC, `requirePermission`, `usuarios_sistema` -> `skills/auth-permissions.md`
- Feedback, validacao, aviso de sessao -> `skills/notificacoes-timers-avisos.md`
- Relatorios, dashboard, KPI, exportacao -> `skills/relatorios-geef.md`
- Catalogo, exemplar, venda, emprestimo, multa -> `skills/livraria-biblioteca-hibrida.md`
- Tabela, coluna, índice, policy, rollout -> `skills/migrations-workflow.md`
- LGPD, privacidade, consentimento, retenção, incidente, dados sensíveis -> `skills/lgpd-governanca.md`
- Se a tarefa toca mais de uma camada e você quer a decisão certa primeiro -> `skills/roteamento-operacional-autoreflex.md`

Atalhos locais:

- `npm run skills:health`
- `npm run skills:list`
- `npm run skills:search "termo"`
- `npm run skills:recommend "frase da tarefa"`
- `npm run skills:index`
- `npm run dev:watchdog` para subir o `next dev` com restart e health check automáticos

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
- `app/admin/relatorios/*` -> visão analítica e consolidação por módulo

## Subida local

- Preferir `npm run dev:watchdog` para o trabalho diário no checkout local.
- Usar `npm run dev` apenas quando precisar isolar o `next dev` sem o supervisor.
- Se o navegador mostrar erro de chunk/CSS depois de build, reiniciar pelo watchdog antes de investigar o browser.

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
- `app/admin/instituicao/*`
  - O cadastro da instituicao usa `supabase/migrations/20260517_instituicao_singleton_and_policies.sql` como fonte de verdade para singleton e acesso.
  - `data_fundacao` deve persistir como `date` em formato `YYYY-MM-DD`.
  - `updateInstituicao()` deve enviar apenas o patch da aba ativa e mesclar no servidor com a linha existente.
  - Nao reintroduzir telas paralelas para contatos/contas fora do editor principal.
  - As mutacoes do modulo agora usam `service_role` no server para ficar no mesmo padrao dos demais modulos admin e evitar dependencia de JWT antigo na RLS.
  - A sessao de contatos agora usa mascara leve e avisos individuais por campo; `responsavel_id` vem de `pessoas` ativas via `select`.
  - O dropdown de `tipo` dos contatos agora vem da tabela `public.instituicao_contato_tipos`, com seed dos tipos base e CRUD no proprio editor de instituicao.
  - A home publica foi enxugada removendo o painel visual provisório e o bloco de "confiança" que ainda pareciam mock.
  - A base pública ganhou uma central discreta de privacidade em `/privacidade` e `/lgpd`, com links também na home, no login, no rodape e em Minha Área.
  - O aviso de login ficou curto por padrão; a orientacao detalhada ficou concentrada na pagina de privacidade.
  - O menu institucional agora expõe "Privacidade" para acesso rápido sem destacar demais o tema na primeira dobra.
  - A área admin de documentos ganhou uma nota curta de revisão antes de salvar ou revogar consentimento.
  - As telas de `termos` e `voluntariado` seguiram o mesmo padrão discreto: notas curtas, labels reduzidos e guards para registros ausentes.
  - O header publico foi separado em uma casca server-rendered (`components/site-header.tsx`) e uma camada client para menus/usuario (`components/site-header-actions.tsx`) para o menu principal nao sumir quando a hidratacao falhar depois do logout.
  - Se o Fast Refresh reclamar de arquivo ausente nesse fluxo, reiniciar o `next dev` limpo antes de investigar a UI.
- `Supabase remoto`
  - O projeto `supabase-geef` estava sem as tabelas de base da instituicao, entao foi aplicado um bootstrap minimo antes da migration de singleton.
  - `public.is_admin_user()` foi endurecida com `search_path = public` para evitar aviso de advisor de funcao mutavel.
  - `public.pessoas` e `public.usuarios_sistema` receberam policies explicitas para reduzir lints de RLS sem policy no projeto remoto.
  - Como o remoto ja tinha parte do schema, as migrations restantes foram reexecutadas em checkpoints idempotentes e registradas com nomes de controle, nao como replay bruto do arquivo original.
  - O mapa 1:1 entre arquivo local e checkpoint remoto agora vive em `docs/SUPABASE_MIGRATION_MAP.md`.
  - `public.is_admin_user()` passou a aceitar tanto `usuarios_sistema` quanto o claim `app_metadata.site_role = 'administrador'`, para casar com o fallback já usado pelo admin shell.
  - Para o cadastro de instituicao, o caminho de gravação agora prefere `service_role` no server, então a policy continua como defesa de profundidade, mas não é o único ponto de autorização.
- `components/admin/*` e `styles/admin.css`
  - O shell admin precisa crescer com a largura da viewport.
  - Nao reintroduzir `max-width` fixo que prenda cards, abas ou formularios no centro.
- `lib/supabase/storage.ts`
  - `unstable_cache()` agora usa uma função assíncrona para manter o build do Next 15 estável.
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
