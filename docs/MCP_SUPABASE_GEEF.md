# MCP Supabase GEEF

Guia rapido para manter e recuperar o MCP do Supabase deste projeto.

## Objetivo

Garantir que o proximo agente consiga localizar, validar e reativar o MCP `supabase-geef` sem misturar com outras contas ou projetos.

## Configuracao esperada

Arquivo local do projeto:

```json
{
  "mcpServers": {
    "supabase-geef": {
      "url": "https://mcp.supabase.com/mcp?project_ref=nycgpokqlmrfzegjlrwa"
    }
  }
}
```

Arquivo local do Codex:

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["supabase"]
}
```

## Como validar

1. Rodar `codex mcp list`.
2. Confirmar que existe uma entrada `supabase-geef`.
3. Confirmar que o status esta `enabled` e que a autenticacao esta por OAuth.
4. Se necessario, testar leitura do servidor via MCP.

## Sintoma de problema

Quando a entrada aparece no `codex mcp list`, mas a leitura falha com algo como:

- `OAuth token refresh failed`
- `Failed to parse server response`

isso normalmente indica problema de autenticacao da sessao MCP, nao erro de URL do projeto.

## Recuperacao

1. Reabrir a autenticacao do MCP Supabase no Codex.
2. Refazer o login/OAuth para `supabase-geef`.
3. Confirmar de novo com `codex mcp list`.
4. Tentar acessar recursos do servidor outra vez.

## Regras

- Nao trocar `supabase-geef` por um MCP generico.
- Nao misturar este projeto com outras contas Supabase.
- Se a sessao do MCP quebrar, tratar primeiro como problema de auth antes de alterar o repo.

