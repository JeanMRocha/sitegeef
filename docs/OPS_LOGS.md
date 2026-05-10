# Logs e heartbeat via Supabase

Fonte de verdade operacional para logs do GEEF.

## Objetivo

- receber logs e relatórios semanais da VPS no Supabase;
- manter um heartbeat semanal mesmo quando não houver erros;
- capturar erros do sistema inteiro, não só do site;
- reduzir dependência de logs locais para debug rápido;
- usar o projeto Supabase como backend de observabilidade leve.

## Fluxo

1. A VPS executa `scripts/collect-system-errors.mjs` a cada poucos minutos.
2. O coletor lê o `journalctl -p err..alert` e envia apenas erros novos.
3. O script semanal `scripts/weekly-ops-report.mjs` envia um heartbeat mesmo sem erro.
4. A rota `POST /api/ops/ingest` grava o evento na tabela `public.ops_events` usando a chave de serviço.

## Segredos

Use estes nomes no ambiente da VPS e no GitHub Actions quando necessário:

- `GEEF_SUPABASE_URL`
- `GEEF_SUPABASE_SERVICE_ROLE_KEY`
- `GEEF_LOG_INGEST_URL`
- `GEEF_LOG_INGEST_TOKEN`

## Agendamento sugerido

Coletor frequente:

```cron
*/10 * * * * root . /etc/sitegeef/sitegeef.env && node /home/ubuntu/sitegeef/scripts/collect-system-errors.mjs >> /var/log/sitegeef-errors.log 2>&1
```

Heartbeat semanal:

```cron
0 6 * * 1 GEEF_LOG_INGEST_URL=https://geef.com.br/api/ops/ingest GEEF_LOG_INGEST_TOKEN=seu-token node /home/ubuntu/sitegeef/scripts/weekly-ops-report.mjs
```

Se preferir, use um arquivo de ambiente e carregue antes do comando.

## O que entra na coleta de erros

- `sitegeef.service`
- `sitegeef-tunnel.service`
- `nginx`
- `sshd`
- quaisquer outros serviços que registrarem erro no `journalctl`

## O que ainda não cobre sozinho

- falhas de hardware fora do journald;
- pane total da instância sem boot;
- eventos da camada da OCI que nunca chegaram ao sistema operacional.

## Retenção local

O objetivo é manter o histórico no Supabase. Na VPS, a retenção pode ser curta:

- deixar `journalctl` ou logs locais por poucos dias;
- evitar apagar imediatamente sem confirmar o envio;
- usar rotação apenas como camada de segurança.

## Observação de segurança

- O endpoint de ingestão exige token.
- O cliente do servidor usa a chave de serviço somente no backend.
- Não expor `GEEF_SUPABASE_SERVICE_ROLE_KEY` no frontend.
