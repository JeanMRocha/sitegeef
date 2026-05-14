# Handoff

## Estado atual

O projeto ainda esta no inicio. Existem documentos de visao, bootstrap, seguranca, conexoes, arquitetura e planos iniciais.

O repositorio Git local foi inicializado e conectado ao GitHub:

- Remoto: `git@github.com:Geef-EliasFrancis/sitegeef.git`
- URL: `https://github.com/Geef-EliasFrancis/sitegeef`
- Branch principal: `main`
- Ultimo commit enviado: `43a7b69 docs: add initial project foundation`
- `.secrets/` esta ignorado e nao foi versionado.

Ainda nao ha aplicacao Next.js criada.

Supabase MCP:

- MCP especifico criado: `supabase-geef`
- Project ref: `nycgpokqlmrfzegjlrwa`
- OAuth concluido com sucesso.
- Pode ser necessario recarregar a sessao do Codex para as ferramentas Supabase aparecerem no ambiente.

Cloudflare MCP:

- MCP especifico criado: `cloudflare-geef`
- URL: `https://mcp.cloudflare.com/mcp`
- OAuth concluido com sucesso.
- A conexao generica `cloudflare-api` nao foi alterada.
- Pode ser necessario recarregar a sessao do Codex para as ferramentas Cloudflare aparecerem no ambiente.

Estado operacional recente:

- O dominio `geef.com.br` usa Cloudflare Tunnel com a origem `http://localhost:3500`.
- O tunnel `sitegeef-vps` esta configurado para `geef.com.br` e `www.geef.com.br`.
- A conta Cloudflare do projeto esta no plano `Free Website`.
- Nao ha `Logpush` configurado para a zona `geef.com.br`.
- `Instant Logs`/`Logpush` de HTTP requests nao estao disponiveis na zona neste plano.
- O melhor debug da borda hoje e via logs do `cloudflared` na VPS.
- O tunnel foi verificado como `healthy` com conexoes ativas em `2026-05-10 13:27 UTC`, mas isso nao elimina falhas intermitentes de SSH ou de origem.
- O erro Cloudflare `1033` apareceu quando a borda nao conseguiu resolver a origem do tunnel.
- O erro Cloudflare `502` apareceu quando a origem `localhost:3500` nao estava respondendo.
- O processo da VPS chegou a falhar com `sh: 1: next: not found`, indicando dependencia de runtime ausente no host.
- O deploy de producao foi migrado para um fluxo manual via SSH, usando o modelo `standalone` do Next.js.
- O GitHub Actions agora fica como validacao em push e heartbeat semanal, sem empurrar alteracoes para a VPS.
- O comando `npm run deploy:ssh` faz build local, empacota os artefatos e publica na VPS.
- Os links internos do site usam query `v=` para evitar cache antigo da Cloudflare enquanto nao ha purge direto.
- O `sitegeef.service` agora roda `node server.js` dentro de `/home/ubuntu/sitegeef/standalone`.
- A origem local voltou a responder `200 OK` em `http://127.0.0.1:3500`.
- `geef.com.br` e `www.geef.com.br` voltaram a responder `200` pela Cloudflare.
- A etapa SSH do deploy ainda pode falhar por `connection reset by peer`, entao a VPS continua sendo o ponto mais fragil.
- A tabela `public.ops_events` no Supabase esta recebendo `heartbeat` do GitHub Actions, mas ainda nao ha logs de erro da VPS gravados ali.
- A base local de conhecimento inspirada no Autoreflex foi adicionada com o documento `docs/AUTOREFLEX_ADAPTADO.md` e a rota `GET /api/knowledge`.
- Essa base e interna ao agente operacional, nao uma funcionalidade do site publico.
- Existem gates internos:
  - `GET /api/knowledge/gate` para consulta antes de resolver um caso.
  - `POST /api/knowledge/cases` para registrar casos novos depois do fechamento.
- Novos casos sao gravados em `docs/cases/` e entram na busca automaticamente.
- Existe um caso de exemplo em `docs/cases/2026-05-10-exemplo-cloudflare-tunnel-1033.md` para servir de modelo ao agente.

## Decisoes confirmadas

- Frontend: Next.js.
- MVP: somente site publico.
- Backend: Supabase no inicio, com possibilidade de API propria conforme necessidade.
- Hospedagem: VPS Oracle.
- DNS/seguranca: Cloudflare.
- CI/CD: GitHub para CI; deploy de producao via SSH manual.
- Multi-instituicao: preparar arquitetura desde o inicio, mas nao ativar experiencia completa no MVP.
- Documentacao: abrangente antes da implementacao.

## Proximas acoes recomendadas

1. Recarregar a sessao Codex e validar as tools dos MCPs `supabase-geef` e `cloudflare-geef`.
2. Confirmar conta/zona Cloudflare do dominio `geef.com.br`.
3. Mapear DNS atual antes de qualquer alteracao.
4. Validar SSH na VPS Oracle e registrar requisitos de hardening.
5. Definir estrategia inicial de deploy: systemd, Docker Compose ou PM2.
6. Criar GitHub Actions basico para CI.
7. Criar app Next.js somente depois dos acessos essenciais estarem documentados.
8. Executar Fase 1 do site publico.
9. Em novo incidente de borda/VPS, seguir [docs/INCIDENTE_CLOUDFLARE_VPS.md](/c:/Projetos/site-geef/docs/INCIDENTE_CLOUDFLARE_VPS.md).

## Etapas concluidas

- `.gitignore` criado com protecao de `.secrets/` e `.env`.
- `.env.example` criado sem valores reais.
- Credenciais reais removidas do markdown versionado.
- Documentacao base criada em `docs/`.
- Git local inicializado.
- GitHub remoto conectado.
- Primeiro commit documental enviado para `main`.
- MCP Supabase especifico do GEEF criado como `supabase-geef`.
- Login OAuth do MCP Supabase concluido.
- MCP Cloudflare especifico do GEEF criado como `cloudflare-geef`.
- Login OAuth do MCP Cloudflare concluido.
- SSH da VPS Oracle validado com a chave local do projeto.
- Host `204.216.166.12` respondeu como `vpsgeef` com usuario `ubuntu`.
- Fingerprint do host registrada em `.secrets/ssh/known_hosts`.
- Cloudflare com `A` em `geef.com.br` apontando para `204.216.166.12`.
- Cloudflare com `CNAME` em `www.geef.com.br` apontando para `geef.com.br`.
- App Next.js inicial criado com uma pagina `Olá, mundo` em `/`.
- VPS com `sitegeef.service` rodando Next.js em `localhost:3500`.
- VPS com `sitegeef-tunnel.service` rodando `cloudflared` para o tunnel da Cloudflare.
- Dominio publicado via Cloudflare Tunnel em `geef.com.br` e `www.geef.com.br`.
- Home trocada para uma tela de manutencao orientada ao fluxo de deploy.
- Workflow GitHub Actions criado para CI e heartbeat na `main`, sem deploy para a VPS.
- Deploy de producao padronizado em `npm run deploy:ssh` com artefato `standalone` do Next.js.
- Deploy manual via SSH validado com `npm run deploy:ssh` e `sitegeef.service` em `standalone`.
- Estado publico atual: `geef.com.br` e `www.geef.com.br` retornam `200`.
- Base real do site publico iniciada com home institucional, shell reutilizavel e rotas estaticas para `quem-somos`, `agenda`, `atividades`, `estudos`, `evangelizacao`, `atendimento-fraterno`, `doacoes`, `ao-vivo`, `contato` e `privacidade`.
- Identidade visual oficial aplicada na interface publica, com logo oficial e tipografia institucional.
- Backend de logs planejado para Supabase com endpoint autenticado `POST /api/ops/ingest` e cron semanal `scripts/weekly-ops-report.mjs`.
- GitHub Actions passou a enviar heartbeat direto para o Supabase em agendamento semanal, independente da VPS.
- Tabela `public.ops_events` criada no Supabase e teste de insercao concluido com sucesso.
- Supabase confirmou recebimento dos heartbeats do GitHub Actions com `201` no endpoint de ingestao.
- `public.ops_events` atualmente contem apenas eventos `heartbeat/info`; ainda nao chegaram eventos `log` ou `error` da VPS.
- A adaptacao tipo Autoreflex do projeto usa busca textual local, nao embeddings nem Qdrant.
- O exemplo de caso `docs/cases/2026-05-10-exemplo-cloudflare-tunnel-1033.md` foi adicionado e deve servir como modelo para novos registros.
- Build local do Next.js validado com as novas rotas.
- Manual da marca criado em `docs/IDENTIDADE_VISUAL.md`.
- Logo oficial copiado para `public/brand/logo-oficial.jpg`.

## Cuidados

- Nao ler nem imprimir segredos.
- Nao iniciar deploy antes de validar rollback.
- Nao criar banco multi-instituicao sem ADR.
- Nao implementar painel administrativo antes do site publico MVP.
- Atualizar este `HANDOFF.md` ao final de cada etapa relevante.
