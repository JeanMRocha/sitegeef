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

1. Recarregar a sessao Codex e validar o MCP `supabase-geef` com ferramenta Supabase especifica.
2. Configurar e validar acesso Cloudflare para dominio, DNS, SSL e seguranca.
3. Validar SSH na VPS Oracle e registrar requisitos de hardening.
4. Definir estrategia inicial de deploy: systemd, Docker Compose ou PM2.
5. Criar GitHub Actions basico para CI.
6. Criar app Next.js somente depois dos acessos essenciais estarem documentados.
7. Executar Fase 1 do site publico.

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

## Cuidados

- Nao ler nem imprimir segredos.
- Nao iniciar deploy antes de validar rollback.
- Nao criar banco multi-instituicao sem ADR.
- Nao implementar painel administrativo antes do site publico MVP.
- Atualizar este `HANDOFF.md` ao final de cada etapa relevante.
