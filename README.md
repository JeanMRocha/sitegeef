# sitegeef
Site do GEEF

## Execucao local

```powershell
npm install
npm run dev
```

Depois, abra `http://localhost:3000`.

## Deploy

O deploy automatizado ocorre a cada push na branch `main` via GitHub Actions.
O build roda no GitHub Actions e a VPS recebe apenas o sincronismo dos arquivos gerados e o restart do serviço `sitegeef`.
Pushs locais agora exigem autorizacao manual via gate. Antes de executar `git push`, defina:

```powershell
$env:GEEF_PUSH_APPROVED="1"
$env:GEEF_PUSH_APPROVAL_REASON="review aprovado"
```

Secrets esperados no GitHub:

- `GEEF_SUPABASE_URL`
- `GEEF_SUPABASE_SERVICE_ROLE_KEY`
- `GEEF_VPS_SSH_KEY`
- `GEEF_VPS_HOST`
- `GEEF_VPS_USER`
- `GEEF_VPS_PATH`

## Observabilidade

O backend de logs usa Supabase como destino dos relatórios enviados pela VPS e do coletor de erros do sistema.

Variáveis esperadas no ambiente da VPS:

- `GEEF_SUPABASE_URL`
- `GEEF_SUPABASE_SERVICE_ROLE_KEY`
- `GEEF_LOG_INGEST_URL`
- `GEEF_LOG_INGEST_TOKEN`

O script semanal fica em [scripts/weekly-ops-report.mjs](/c:/Projetos/site-geef/scripts/weekly-ops-report.mjs) e a documentação operacional em [docs/OPS_LOGS.md](/c:/Projetos/site-geef/docs/OPS_LOGS.md).

Coletor de erros do sistema:

```powershell
npm run collect:system-errors
```
