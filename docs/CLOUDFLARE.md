# Cloudflare

## Objetivo

Registrar a conexao Cloudflare do projeto GEEF sem conflitar com outras MCPs Cloudflare existentes no ambiente.

## Conexao MCP

- Nome MCP: `cloudflare-geef`
- URL MCP: `https://mcp.cloudflare.com/mcp`
- Uso: DNS, dominio, SSL, proxy, WAF e seguranca de borda do projeto GEEF.

Como ja existe uma conexao generica chamada `cloudflare-api`, este projeto deve usar sempre o nome explicito `cloudflare-geef`.

```powershell
codex mcp add cloudflare-geef --url "https://mcp.cloudflare.com/mcp"
codex mcp login cloudflare-geef
```

## Estado atual

- MCP `cloudflare-geef` adicionado.
- OAuth concluido com sucesso.
- `codex mcp list` mostra `cloudflare-geef` com `Auth: OAuth`.
- A conexao generica `cloudflare-api` permanece separada e nao foi alterada.
- As ferramentas Cloudflare especificas podem exigir recarregar a sessao do Codex para ficarem disponiveis.

## Regras

- Nao misturar `cloudflare-geef` com `cloudflare-api`.
- Nao alterar DNS sem mapear registros atuais.
- Nao apontar producao antes de validar VPS, SSL e rollback.
- Registrar qualquer decisao de proxy, WAF, SSL ou redirect em ADR.
- Guardar tokens e secrets apenas em cofre/ambiente seguro, nunca em markdown.

## Validacao apos recarregar sessao

1. Confirmar conta Cloudflare autenticada.
2. Listar contas/zonas acessiveis.
3. Confirmar se o dominio `geef.com.br` esta disponivel na conta correta.
4. Mapear DNS atual antes de qualquer alteracao.
5. Registrar resultado no `HANDOFF.md`.
