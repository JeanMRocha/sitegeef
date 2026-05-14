# Deploy via SSH

O deploy de producao deste projeto passa a ser manual via SSH, usando o artefato `standalone` do Next.js.
O GitHub Actions fica apenas como validação e heartbeat, sem empurrar alteracoes para a VPS.

## Requisitos

- Build local funcionando com `npm run build`
- SSH configurado para a VPS Oracle
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- Opcional: `DEPLOY_PORT`
- Opcional: `DEPLOY_KEY_PATH`
- Opcional: `DEPLOY_SERVICE`

## Comando

```powershell
npm run deploy:ssh
```

Se quiser apenas simular o fluxo, use:

```powershell
npm run deploy:ssh -- --dry-run
```

## O que o script faz

- Executa o build, a menos que `--skip-build` seja informado
- Empacota `.next/standalone`, `.next/static` e `public`
- Envia os artefatos por `scp`
- Para o servico `sitegeef`
- Troca a release em `/home/ubuntu/sitegeef/standalone`
- Sobe o servico novamente
- Valida `http://127.0.0.1:3500` na VPS
- Mantem uma copia de rollback em `standalone.prev` se a ativacao falhar

## Observacoes

- O fluxo evita depender do runner do GitHub para deploy.
- O site publico continua acessivel pela Cloudflare Tunnel, mas a publicacao agora depende do comando local.
- Se a VPS estiver instavel, use `--dry-run` primeiro para validar variaveis e caminhos.
