# Logs e heartbeat via Supabase

Fonte de verdade operacional para logs do GEEF.

## Objetivo

- receber logs e relatórios semanais da VPS no Supabase;
- manter um heartbeat semanal mesmo quando não houver erros;
- reduzir dependência de logs locais para debug rápido;
- usar o projeto Supabase como backend de observabilidade leve.

## Fluxo

1. A VPS executa `scripts/weekly-ops-report.mjs` semanalmente.
2. O script coleta status da aplicação e do tunnel.
3. O script envia um evento autenticado para `POST /api/ops/ingest`.
4. A rota grava o evento na tabela `public.ops_events` usando a chave de serviço.

## Segredos

Use estes nomes no ambiente da VPS e no GitHub Actions quando necessário:

- `GEEF_SUPABASE_URL`
- `GEEF_SUPABASE_SERVICE_ROLE_KEY`
- `GEEF_LOG_INGEST_URL`
- `GEEF_LOG_INGEST_TOKEN`

## Agendamento sugerido

Executar toda segunda-feira às 06:00 UTC.

Exemplo de crontab:

```cron
0 6 * * 1 GEEF_LOG_INGEST_URL=https://geef.com.br/api/ops/ingest GEEF_LOG_INGEST_TOKEN=seu-token node /home/ubuntu/sitegeef/scripts/weekly-ops-report.mjs
```

Se preferir, use um arquivo de ambiente e carregue antes do comando.

## Retenção local

O objetivo é manter o histórico no Supabase. Na VPS, a retenção pode ser curta:

- deixar `journalctl` ou logs locais por poucos dias;
- evitar apagar imediatamente sem confirmar o envio;
- usar rotação apenas como camada de segurança.

## Observação de segurança

- O endpoint de ingestão exige token.
- O cliente do servidor usa a chave de serviço somente no backend.
- Não expor `GEEF_SUPABASE_SERVICE_ROLE_KEY` no frontend.
