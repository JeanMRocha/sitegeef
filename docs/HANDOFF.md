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

## Decisoes confirmadas

- Frontend: Next.js.
- MVP: somente site publico.
- Backend: Supabase no inicio, com possibilidade de API propria conforme necessidade.
- Hospedagem: VPS Oracle.
- DNS/seguranca: Cloudflare.
- CI/CD: GitHub para VPS.
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
- VPS com `sitegeef.service` rodando Next.js em `localhost:3000`.
- VPS com `sitegeef-tunnel.service` rodando `cloudflared` para o tunnel da Cloudflare.
- Dominio publicado via Cloudflare Tunnel em `geef.com.br` e `www.geef.com.br`.
- Home trocada para uma tela de manutencao orientada ao fluxo de deploy.
- Workflow GitHub Actions criado para deploy automatico na `main`.
- Fluxo de deploy automatico codificado, mas a VPS perdeu conectividade SSH durante a publicacao manual e o tunnel Cloudflare ficou sem conexoes.
- Estado publico atual: `geef.com.br` e `www.geef.com.br` retornam erro Cloudflare 530 enquanto a VPS nao responde.

## Cuidados

- Nao ler nem imprimir segredos.
- Nao iniciar deploy antes de validar rollback.
- Nao criar banco multi-instituicao sem ADR.
- Nao implementar painel administrativo antes do site publico MVP.
- Atualizar este `HANDOFF.md` ao final de cada etapa relevante.
