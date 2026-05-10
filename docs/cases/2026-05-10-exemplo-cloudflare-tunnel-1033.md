# Exemplo: Cloudflare Tunnel 1033 e SSH instavel na VPS

Data: 2026-05-10
Fonte: agente
Resumo: Caso de referencia para o fluxo de triagem da borda Cloudflare e da VPS.

## Sintoma

O dominio `geef.com.br` passou a exibir `Cloudflare Tunnel error 1033` e, em outros momentos, `502` ou `530`. O SSH para a VPS tambem ficou instavel, com `connection reset by peer` e timeout no banner exchange.

## Diagnostico

- O tunnel `sitegeef-vps` estava configurado corretamente para `geef.com.br` e `www.geef.com.br`.
- A origem `http://localhost:3000` na VPS nem sempre respondia.
- O serviço `sitegeef.service` chegou a falhar com `sh: 1: next: not found`.
- O `rsync` do deploy tambem sofreu resets por instabilidade de SSH.
- O plano Cloudflare da zona nao oferecia `Instant Logs`/`Logpush` de requests para a zona.

## Resolucao

- Ajustar o deploy para reinstalar dependencias de runtime na VPS antes do restart.
- Reduzir o escopo do `rsync` para enviar apenas arquivos relevantes ao runtime.
- Priorizar logs locais do `cloudflared` na VPS com `--loglevel debug` e `--logfile`.
- Documentar o incidente em runbook para evitar redescoberta.

## Impacto

O site publico ficou sem origem confiavel e a borda da Cloudflare nao conseguiu entregar o tunnel de forma consistente.

## Tags

- infra
- cloudflare
- tunnel
- vps
- ssh
- observabilidade

## Referencias

- `docs/HANDOFF.md`
- `docs/CLOUDFLARE.md`
- `docs/OPS_LOGS.md`
- `docs/CONNECTIONS.md`
- `docs/INCIDENTE_CLOUDFLARE_VPS.md`
