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

- `VPS_HOST`
- `VPS_USER`
- `VPS_PATH`
- `VPS_SSH_KEY`
