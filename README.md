# sitegeef
Site do GEEF

## Execucao local

```powershell
npm install
npm run dev
```

Depois, abra `http://localhost:3500`.

## Producao

Este projeto usa `output: "standalone"` no Next.js. Depois do build, suba com:

```powershell
npm run build
npm run start
```

O comando `npm run start` executa o servidor standalone gerado em `.next/standalone/server.js`.
