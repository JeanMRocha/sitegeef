# Conexoes, Plugins e MCP

## Objetivo

Preparar todos os acessos externos antes das fases de implementacao dependerem deles.

## Ordem recomendada

1. GitHub.
2. Supabase MCP.
3. Cloudflare.
4. VPS Oracle.
5. GitHub Actions para deploy.
6. Monitoramento e backups.

## GitHub

Objetivo:

- Inicializar versionamento.
- Conectar ao repositorio remoto vazio.
- Guardar segredos de deploy em GitHub Secrets.
- Rodar CI antes de qualquer deploy.

Checklist:

- `git init`.
- Remote configurado.
- Branch principal definida.
- `.gitignore` validado.
- Nenhum segredo no historico.
- Secrets configurados somente no GitHub.

## Supabase MCP

Objetivo:

- Permitir consulta e operacao segura do projeto Supabase quando necessario.

Checklist:

- Configurar MCP apontando para o projeto correto.
- Autenticar via fluxo oficial.
- Validar acesso sem expor tokens na documentacao.
- Confirmar project ref.
- Antes de criar schema, produzir ADR de banco e modelo multi-instituicao.

Regras:

- Nao usar service role no cliente.
- Nao criar policies permissivas temporarias para "fazer funcionar".
- Habilitar RLS em tabelas expostas.

## Cloudflare

Objetivo:

- Controlar DNS, SSL, proxy, WAF e protecao do dominio.

Checklist:

- Confirmar acesso a conta.
- Confirmar zona do dominio.
- Mapear DNS atual antes de alterar.
- Configurar registros para VPS.
- Ativar SSL adequado.
- Criar regra de redirecionamento HTTPS.
- Planejar protecao para rotas administrativas futuras.

## VPS Oracle

Objetivo:

- Preparar servidor para receber deploy reproduzivel.

Checklist:

- Testar SSH.
- Confirmar fingerprint.
- Atualizar sistema.
- Configurar firewall.
- Criar usuario de deploy.
- Definir diretorio da aplicacao.
- Definir supervisor: systemd, Docker Compose ou outro.
- Configurar logs.
- Definir rollback.

## GitHub Actions

Objetivo:

- Fazer deploy automatico, rastreavel e reversivel.

Checklist:

- CI com install, lint, typecheck, test e build.
- Deploy apenas se CI passar.
- Segredos no GitHub Secrets.
- SSH por chave dedicada de deploy.
- Rollback documentado.

## Decisoes ainda abertas

- Deploy por systemd, Docker Compose ou PM2.
- Uso de API propria na Fase 1 ou apenas Next.js/Supabase.
- Ambiente staging separado.
- Politica final de backup da VPS e do Supabase.
