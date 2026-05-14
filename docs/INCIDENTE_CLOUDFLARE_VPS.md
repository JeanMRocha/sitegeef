# Checklist de Incidente Cloudflare/VPS

Use este checklist quando o dominio `geef.com.br` ou `www.geef.com.br` estiver em `1033`, `502`, `530` ou sem resposta.

## Objetivo

Isolar rapidamente se a falha esta na borda Cloudflare, no tunnel `cloudflared` ou na origem `localhost:3500` da VPS.

## Ordem de verificacao

1. Confirmar o erro mostrado pela borda:
   - `1033` indica problema de resolucao/conexao do tunnel.
   - `502` costuma indicar origem inacessivel ou app fora do ar.
   - `530` costuma indicar tunnel/origem indisponivel para a borda.
2. Consultar `docs/HANDOFF.md` para ver o ultimo estado conhecido.
3. Confirmar no Supabase se os eventos de observabilidade estao chegando:
   - `public.ops_events`
   - `heartbeat` do GitHub Actions
   - ausencia ou presenca de `log/error` da VPS
4. Verificar o tunnel na Cloudflare:
   - tunnel ativo: `sitegeef-vps`
   - ingress esperado:
     - `geef.com.br` -> `http://localhost:3500`
     - `www.geef.com.br` -> `http://localhost:3500`
   - fallback: `http_status:404`
5. Verificar se existe `Logpush`/`Instant Logs` na zona:
   - no plano atual `Free Website`, nao esperar `Instant Logs` ou `Logpush` de requests para a zona.
   - nao perder tempo tentando habilitar algo indisponivel no plano atual.
6. Priorizar logs locais do `cloudflared` na VPS:
   - rodar com `--loglevel debug`
   - persistir com `--logfile`
   - procurar `connection reset`, `connect: connection refused`, `too many open files` e problemas de origem.
7. Validar a origem local:
   - `curl http://127.0.0.1:3500`
   - `systemctl status sitegeef`
   - `journalctl -u sitegeef -n 100`
8. Se o SSH falhar:
   - registrar que a origem operacional ainda nao esta acessivel
   - nao assumir que o problema e DNS
   - usar a console da VPS/Oracle para recuperar acesso
9. Se o deploy do GitHub Actions falhar:
   - ler a etapa exata do workflow
   - observar se falhou em `rsync`, `npm ci --omit=dev`, `systemctl restart sitegeef` ou na verificação de origem

## Sinais ja observados neste projeto

- `sh: 1: next: not found` na VPS.
- `connection reset by peer` durante SSH/rsync.
- `Cloudflare Tunnel error 1033`.
- `502 Bad Gateway` quando a origem nao respondeu.
- `530` quando a borda ficou sem origem util.

## O que nao adianta tentar primeiro

- Alterar DNS antes de confirmar a VPS.
- Ajustar SSL antes de verificar `cloudflared` e `localhost:3500`.
- Procurar `Logpush` de requests na zona enquanto a conta estiver no plano `Free Website`.

## Resultado esperado

Ao final da triagem, o agente deve conseguir responder:

- a borda Cloudflare esta saudavel ou nao;
- o tunnel esta ativo ou nao;
- a VPS esta respondendo em `localhost:3500` ou nao;
- se existe log suficiente para fechar a causa raiz.
