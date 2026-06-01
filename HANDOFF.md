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
9. `docs/AUTOREFLEX_LOCAL.md` quando a tarefa tocar o servidor local de skills, Ollama ou memória persistente
10. `skills/lgpd-governanca.md` quando a tarefa tocar dados pessoais, consentimento, retenção, logs, incidentes ou privacidade

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
- Quando o CLI local precisar aplicar migration, preferir `SUPABASE_ACCESS_TOKEN` + `supabase link` em workdir temporario e, para escrita remota, usar a Management API `POST /v1/projects/{ref}/database/migrations`.
- Se o host direto do banco falhar por IPv6 ou o `.env` estiver malformado para a CLI, usar o pooler do `supabase-geef` ou a Management API `POST /v1/projects/{ref}/database/query` para leitura/diagnostico pontual.
- Para a instituição, a sequência real já validada foi: snapshot lógico em `backups/`, `20260523_instituicao_modelagem_total.sql`, validação do backfill, snapshot lógico do estado normalizado e então `20260524_instituicao_cleanup_legado.sql`.
- Cadastro da instituicao: a modelagem consolidada fica em `supabase/migrations/20260523_instituicao_modelagem_total.sql`.
- Em base já povoada, trate a migration como aditiva e faça backup antes de qualquer limpeza manual de colunas legadas ou dados históricos.
- A limpeza destrutiva separada fica em `supabase/migrations/20260524_instituicao_cleanup_legado.sql` e só deve rodar depois do backup e da validação do backfill.
- O roteiro de execução fica em `docs/INSTITUICAO_MIGRATION_RUNBOOK.md`.

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

- `npm run autoreflex:up` para checar o Ollama local e subir o Autoreflex em uma etapa
- `npm run autoreflex:serve` para subir o servidor local de skills em `8090`
- `npm run autoreflex:health` para checar a saúde do Autoreflex local
- `npm run autoreflex:index` para reindexar skills, docs e notas locais
- `npm run autoreflex:note -- "titulo" "texto"` para registrar um erro/aprendizado
- O `autoreflex:serve` não inicia o Ollama sozinho por padrão; para permitir isso de forma explícita, exportar `AUTOREFLEX_START_OLLAMA=1` antes do comando
- `npm run skills:health`
- `npm run skills:list`
- `npm run skills:search "termo"`
- `npm run skills:recommend "frase da tarefa"`
- `npm run skills:index`
- `npm run dev` para subir o `next dev` direto, sem supervisor de restart

Quando o Autoreflex local voltar a responder, rodar primeiro:

- `npm run skills:index`
- `npm run skills:list`

Fluxo recomendado quando a sessão precisar do Autoreflex:

1. Confirmar que o Ollama já está ativo em `127.0.0.1:11434`.
2. Subir o Autoreflex com `npm run autoreflex:serve`.
3. Validar `http://127.0.0.1:8090/health`.
4. Só então usar `npm run skills:search`, `npm run skills:list` ou `npm run skills:index`.

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

- Preferir `npm run dev` para o trabalho diário no checkout local.
- Se o navegador mostrar erro de chunk/CSS depois de build, reiniciar o `next dev` limpo antes de investigar o browser.
- Se aparecer `Refused to apply style ... MIME type ('text/plain')`, testar a URL do asset direto antes de culpar o CSS.
- Se o asset responder `404 text/plain`, tratar como mismatch de cache/build ou runtime misturado, nao como bug de estilo.
- A validacao correta e: um runtime por vez, hard refresh quando necessario, e conferencia de `/_next/static/css/app/layout.css` e `/_next/static/chunks/main-app.js` com `200`.

## Ultima entrega

- Foi criado o modulo de `Reuniao publica` para musicas, com menu proprio no topo do admin e submenu lateral dedicado.
- O caminho oficial de administracao de musicas agora e `/admin/reuniao-publica/musicas`; o caminho legado `/admin/instituicao/musicas` apenas redireciona.
- O catalogo publico de musicas ficou em `/musicas` e a leitura individual em `/musicas/[slug]`.
- A tela de exibicao ao vivo ficou em `/musicas/exibir`, e `/musicas/[slug]` segue como o padrao unico para leitura completa.
- A sessao de exibicao agora expira por inatividade: se ficar mais de 1 hora sem leitura, a proxima consulta a marca como inativa.
- A sincronizacao ao vivo usa `GET /api/musicas/sessoes/[codigo]` para devolver sessao + musica e atualizar `ultimo_acesso_em`.
- O catálogo de créditos de música passou a ser unificado em `supabase/migrations/20260527030702_musica_creditos_unificados.sql`, com autores e versões compartilhando `public.musica_creditos` e o CRUD interno filtrando por `tipo`.
- A migration `supabase/migrations/20260526011410_musicas_institucionais.sql` foi aplicada remotamente com sucesso, criando `musicas`, `musica_partes` e `musica_sessoes` com RLS e policies de `service_role`.
- O helper central ficou em `lib/musicas.ts`, com leitura, busca, salvamento, exclusao, pareamento e touch da sessao.
- O editor interno aceita letra, cifra, partes por ordem, destaque visual e busca por autor/titulo/trecho.
- O menu do admin foi ajustado para mostrar `Reuniao publica` como area propria no topo e na sidebar, sem depender da area `Instituicao`.
- O cache de musicas agora invalida tanto as rotas publicas quanto as rotas do admin novo.
- O `npm run build` passou apos a consolidacao do modulo.
- A entrega detalhada do modulo ficou registrada em `docs/REUNIAO_PUBLICA_MUSICAS.md` e o handoff de continuidade em `docs/REUNIAO_PUBLICA_MUSICAS_HANDOFF.md`.
- A home do dashboard foi enxugada para ficar apenas com cards essenciais, sem forms, cadastros, CTAs de criação ou blocos longos de ação.
- O cabeçalho do admin agora ficou praticamente só com o ícone da marca, as abas de área e o menu do usuário no canto direito.
- O perfil saiu da sidebar e foi concentrado no menu do ícone do usuário, com `Perfil`, `Minha área`, `Painel` e `Sair` no popover.
- A sidebar do admin foi compactada e perdeu o bloco de sessão/perfil, para reduzir poluição visual e liberar espaço útil.
- O layout raiz do site passou a usar timeout seguro no `getUser()` do Supabase para evitar travamento visível quando a autenticação demorar.
- A validação local recente passou com `npm run build`, e o servidor de desenvolvimento voltou a responder `200` em `http://127.0.0.1:3500/`.
- O shell do admin foi reorganizado com top menu por área e lateral reativa, para permitir que `Perfil`, `Pessoas`, `Governança`, `Documentos`, `Operação` e `Sistema` apareçam conforme a area ativa.
- A lateral ganhou a seção `Perfil` com `Meu perfil` e `Minha área`, e o seletor de área foi sincronizado com o topo por estado compartilhado no cliente.
- A área de governança recebeu a primeira versão do workspace de documentos institucionais em `/admin/governanca/documentos`, com leitura online para `Estatuto Social`, `CNPJ`, `Registro em Cartório`, `Diretoria constituída` e `Regimento Interno`.
- O workspace dos documentos institucionais inclui índice lateral, leitor central contínuo, metadados e ações de exportar, imprimir e copiar link.
- A visão geral de governança agora expõe um card de acesso direto para os documentos institucionais.
- A modelagem de instituição foi consolidada no remoto e a cleanup destrutiva já foi aplicada com backup lógico prévio; `instituicao_contatos` agora depende de `instituicao_id`/`tipo_id` e não usa mais a coluna legada `tipo`.
- A validação local do shell passou com `npm run build` e a rota `http://127.0.0.1:3500/admin` respondeu `200` durante a checagem final.
- Foi criado o agente customizado do GitHub Copilot Cloud Agent em `.github/agents/geef-implementador.agent.md`.
- As configuracoes de seguranca do repositório foram registradas em `.github/SECURITY.md` e `.github/dependabot.yml`.
- A entrega foi mesclada em `main` via PR [#1](https://github.com/JeanMRocha/sitegeef/pull/1).
- O merge finalizou em `f578fd1` e o checkout local agora acompanha `main`.
- O PR saiu de draft, passou pelos checks e foi incorporado sem conflitos.
- Proximo passo natural: seguir a partir de `main` em um novo ciclo de trabalho.
- A area interna recebeu um refinamento visual no shell do admin e na pagina de perfil, com destaque para leitura mais rapida, blocos de contexto e atalhos mais claros.
- O carregamento autenticado do admin e do perfil ganhou timeout seguro para evitar travamento visivel quando o Supabase estiver lento.

## Diretriz de engenharia

- O projeto agora explicita SOLID e boas praticas em `docs/ENGINEERING_GUIDELINES.md`.
- Mudancas relevantes devem documentar regra, contrato, schema, UX ou fluxo operacional.
- Sempre que houver dado compartilhado, a fonte de verdade deve ficar no banco.
- Antes de finalizar qualquer entrega, validar build e o fluxo afetado.

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
  - O cadastro da instituicao usa `supabase/migrations/20260523_instituicao_modelagem_total.sql` como fonte de verdade para singleton, relacoes e acesso.
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
  - O hero da home agora ocupa a largura total do card e exibe o lema "Fora da Caridade não há salvação" abaixo do título, como elemento fixo da página.
  - O menu de perfil foi compactado: idioma e tema ficaram lado a lado, em botões só com ícone e tooltip, para reduzir áreas vazias no dropdown.
  - A varredura de contraste do modo escuro passou a cobrir controles recorrentes do site publico: link do header, abas do login, tags, botoes secundarios globais e o upload do perfil, para evitar texto apagado em superficies escuras.
  - A área admin de documentos ganhou uma nota curta de revisão antes de salvar ou revogar consentimento.
  - As telas de `termos` e `voluntariado` seguiram o mesmo padrão discreto: notas curtas, labels reduzidos e guards para registros ausentes.
  - As mutações do módulo agora registram eventos em `ops_events` e a nova tela `/admin/documentos/auditoria` mostra o rastro técnico de LGPD sem expor conteúdo sensível.
  - A área do usuário ganhou um formulário discreto de pedido do titular em `/minha-area`, e o submit grava evento em `ops_events` com source `user-area/lgpd` para a auditoria acompanhar revogação/acesso/correção.
  - O pedido do titular em `/minha-area` agora abriu em pop-up modal acionado por botão, reduzindo volume visual na seção e mantendo o fluxo LGPD sem ocupar a página inteira.
  - O aviso de LGPD do cadastro institucional foi movido para o rodapé da página de edição da instituição, e os cards de contatos receberam quebra de linha para não estourar no dark mode.
  - A aba de contatos da instituição foi dividida em superfícies distintas de visualização, cadastro e tipos compartilhados para não misturar consulta com edição no mesmo bloco.
  - Os pedidos agora também persistem em `lgpd_solicitacoes`, com fila administrativa em `/admin/documentos/pedidos`, detalhe para tratamento, responsável, prazo e resposta curta. O status sai de `aberta` para `em_andamento`, `respondida` ou `encerrada`, e a fila volta a refletir os registros na área do usuário após a invalidação de cache.
  - O pedido do titular também aciona notificação automática para o responsável/encarregado via `notificacoes` e email, com fallback para `LGPD_ENCARREGADO_EMAIL` ou `LGPD_COMPLIANCE_EMAIL` quando não houver pessoa vinculada.
  - A observabilidade foi consolidada em `lib/observability/`: actions de login, evangelização, documentos, pedido do titular e carga da área do usuário agora registram falhas de servidor/formulário e falhas silenciosas do Supabase em `ops_events`.
  - Os eventos LGPD agora carregam severidade em `lgpd_registros.escopo.severity` e a central `/admin/lgpd` mostra a distribuição por `info`, `low`, `medium`, `high` e `critical` sem exigir mudança de schema.
  - A exportação do titular agora sai por `/api/lgpd/export`, gera o JSON com os dados da área do usuário e registra um pedido LGPD respondido para manter a trilha operacional.
  - A retenção LGPD ficou explícita: `ops_events` ligados a auditoria privacidade expiram em 180 dias, `lgpd_solicitacoes` resolvidas expiram em 365 dias, e pedidos vencidos são encerrados automaticamente pela função `cleanup_lgpd_retention`.
  - A limpeza LGPD agora tem agendamento no GitHub Actions em `.github/workflows/lgpd-retention.yml`, com execução diária e suporte a `LGPD_CLEANUP_SECRET` quando configurado.
  - A fila de notificações pendentes também passou a ter agendamento no GitHub Actions em `.github/workflows/notifications-dispatch.yml`, reforçando a entrega fora da interface sem duplicar o envio quando a notificação já saiu no primeiro disparo.
  - Os avisos curtos na UI continuam intencionais e transitórios; eles não são persistidos como conteúdo operacional.
  - O assunto LGPD virou um modulo proprio, com persistencia tecnica central em `public.lgpd_registros`, banner global de cookies em `components/lgpd/lgpd-cookie-banner.tsx`, avisos curtos reutilizaveis em `components/lgpd/lgpd-notice.tsx` e `components/lgpd/lgpd-form-notice.tsx`, e pagina publica adicional em `/cookies`.
  - O cadastro de usuario agora exige Termos de Uso e ciencia da Politica de Privacidade no servidor, e grava as versoes aceitas em `lgpd_registros`.
  - O banner de cookies grava a preferencia na primeira visita, permite aceitar tudo, rejeitar os nao essenciais ou ajustar categorias, e envia o registro para a API `POST /api/lgpd/registros`.
  - Os fluxos com dados mais sensiveis ganharam aviso curto de privacidade antes do formulario, com destaque para menores, atendimento fraterno, irradiacao, upload de logo e lancamentos financeiros.
  - A tela propria do modulo LGPD agora vive em `/admin/lgpd`, consolidando registros, fila operacional, consentimentos, notificacoes e eventos tecnicos num unico painel.
  - A central de observabilidade agora vive em `/admin/observability`; `/admin/erros` ficou como alias legado para nao quebrar links antigos.
  - A central ganhou abas por contexto (`geral`, `erros`, `supabase`, `lgpd`, `fila`) para separar triagem técnica, falhas do adapter, trilha LGPD e pedidos do titular sem duplicar pagina.
  - O site público ganhou o módulo de multilinguagem PT/EN, com cookie `geef_locale`, selector discreto no header, html `lang` dinamico, home, login, banner LGPD e rodape traduzidos; o admin continua em PT por escolha de escopo.
  - A area administrativa de idiomas agora vive em `/admin/idiomas` para documentar cobertura, persistencia e proximos passos do módulo de multilinguagem.
  - A home pública foi further simplified: removidos os textos de apoio "As páginas abaixo levam direto..." e "Endereço, telefone e redes principais ficam visíveis...", mantendo apenas os cards essenciais sem poluição informativa.
  - O rodapé do site foi consolidado em uma única linha contendo: nome da instituição · endereço · email · LGPD · Privacidade · Cookies · Credibilidade.
  - Os badges de afiliação (FEB, REUNIR, 45 CEU) foram removidos do rodapé conforme direcionamento de simplificação visual; continuam acessíveis em `/institucional`.
  - O menu da Reunião Pública no admin agora exibe link direto para "Autores" (`/admin/reuniao-publica/musicas/autores`) abaixo de Sessões, completando o fluxo CRUD de gerenciamento de músicas.
  - A rota dinâmica pública `[slug]` e a página institucional agora também respeitam o locale do módulo, usando conteúdo localizado para PT/EN com fallback seguro em português.
  - Os formulários de documentos e vinculacoes mais sensiveis passaram a exibir o aviso curto do modulo antes do envio, incluindo modelo de documento, consentimento LGPD, termo assinado, servico voluntario e edicao da instituicao.
  - A cobertura de avisos curtos foi ampliada para pessoa, usuario, emprestimo, reserva, recepcao, evangelho no lar, familia APSE, juventude, turmas de estudo, assembleias e grupos mediunicos.
  - Os detalhes editaveis mais sensiveis tambem receberam o aviso curto: pessoa, usuario, crianca, emprestimo, reserva, familia, fraterno, irradiacao, recepcao, evangelizacao e juventude.
  - O servidor local voltou a responder em `http://127.0.0.1:3500` depois do ajuste de porta ocupada, e a rota raiz respondeu `200` durante a validacao final.
  - O gate local `npm run gate:server` confirma `200` antes de devolver a aplicacao e o `npm run test:admin-smoke` passou nas 24 rotas admin principais depois da reorganizacao.
  - O Autoreflex local foi implementado em `scripts/autoreflex-local.mjs`, sobe em `http://127.0.0.1:8090`, usa Ollama local quando disponivel, nao inicia o daemon sozinho por padrao e aceita notas de aprendizado em `.autoreflex/notes/`.
  - O fluxo local agora usa `npm run dev` direto como caminho principal para desenvolvimento.
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
