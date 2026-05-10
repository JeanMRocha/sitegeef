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

## Diagnostico operacional

Informacoes confirmadas no ambiente atual:

- Zona ativa: `geef.com.br`.
- Plano da zona: `Free Website`.
- Tunnel ativo: `sitegeef-vps`.
- Ingress do tunnel:
  - `geef.com.br` -> `http://localhost:3000`
  - `www.geef.com.br` -> `http://localhost:3000`
  - fallback -> `http_status:404`
- O tunnel foi observado como `healthy` com conexoes ativas, mas a origem ainda pode falhar se a VPS nao estiver respondendo.
- `Logpush` para a zona nao esta configurado.
- `Instant Logs` e `Logpush` de requests nao estao disponiveis para essa zona no plano atual.
- O melhor caminho de debug na borda e usar logs do `cloudflared` na VPS e, quando necessario, o streaming remoto de logs do tunnel.

Sinais de erro ja vistos:

- `1033 Cloudflare Tunnel error` quando a borda nao conseguiu resolver a origem do tunnel.
- `530` quando o tunnel ficou sem conexao util com a VPS.
- `502` quando a origem `localhost:3000` nao estava respondendo.

Para aumentar a observabilidade na VPS, configurar `cloudflared` com:

```powershell
cloudflared tunnel --loglevel debug --logfile /var/log/cloudflared/cloudflared.log run --token <TOKEN>
```

Se necessario, manter tambem um endpoint de metricas local do `cloudflared` e um arquivo de log persistente para auditoria de incidentes.

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
5. Confirmar status do tunnel e do `Logpush`.
6. Registrar resultado no `HANDOFF.md`.
