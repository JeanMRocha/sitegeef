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

Secrets esperados no GitHub:

- `GEEF_VPS_SSH_KEY`
- `GEEF_VPS_HOST`
- `GEEF_VPS_USER`
- `GEEF_VPS_PATH`
