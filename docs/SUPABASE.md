# Supabase

## Objetivo

Registrar a conexao Supabase do projeto GEEF sem expor segredos e sem conflitar com outros projetos Supabase usados por outros usuarios ou contas.

## Projeto

- Nome conhecido: `sitegeef`
- Project ref: `nycgpokqlmrfzegjlrwa`
- MCP local/global recomendado: `supabase-geef`
- URL MCP: `https://mcp.supabase.com/mcp?project_ref=nycgpokqlmrfzegjlrwa`

## Conta de acesso

Este projeto deve ser acessado pela conta/organizacao GitHub vinculada ao GEEF, nao por uma conta pessoal generica.

Como existem multiplos usuarios e multiplos projetos Supabase no ambiente, a conexao deste projeto deve usar nome explicito:

```powershell
codex mcp add supabase-geef --url "https://mcp.supabase.com/mcp?project_ref=nycgpokqlmrfzegjlrwa"
codex mcp login supabase-geef
```

Evitar reaproveitar o nome generico `supabase`, porque ele pode apontar para outro projeto.

## Estado atual

- MCP `supabase-geef` adicionado.
- OAuth concluido com sucesso.
- `codex mcp list` mostra `supabase-geef` com `Auth: OAuth`.
- As ferramentas Supabase especificas podem exigir recarregar a sessao do Codex para ficarem disponiveis.

## Regras

- Nao usar `service_role` no frontend.
- Nao colocar tokens Supabase em markdown versionado.
- Nao criar schema definitivo antes de ADR de banco.
- Antes de qualquer tabela exposta, planejar RLS.
- Antes de dados multi-instituicao, definir isolamento por instituicao.
- Nao usar o MCP `postgres` global se ele apontar para outro projeto.

## Proxima validacao

Depois de recarregar a sessao com o MCP disponivel:

1. Confirmar que o projeto acessado e `nycgpokqlmrfzegjlrwa`.
2. Listar metadados do projeto.
3. Rodar consulta read-only simples, se a ferramenta permitir.
4. Registrar resultado no `HANDOFF.md`.
