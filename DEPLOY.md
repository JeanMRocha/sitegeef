# 🚀 Deploy Automático - GitHub Actions

O site GEEF agora possui deploy automático ao fazer push para `main`.

## Como funciona?

```
git push origin main
    ↓
GitHub Actions dispara workflow
    ↓
1. Build e valida código
    ↓
2. Faz deploy via SSH no VPS
    ↓
3. Pull do código
    ↓
4. Install dependências
    ↓
5. Build da aplicação
    ↓
6. Restart com PM2
    ↓
✅ Site geef.com.br atualizado!
```

## Setup Necessário

### 1. Gerar SSH Key para GitHub Actions

**No seu computador local:**

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/geef-deploy -N ""
```

Isso gera dois arquivos:
- `~/.ssh/geef-deploy` (chave privada)
- `~/.ssh/geef-deploy.pub` (chave pública)

### 2. Adicionar chave pública no VPS

```bash
# No servidor VPS (204.216.166.12)
ssh ubuntu@204.216.166.12

# Dentro do VPS:
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
# Cole o conteúdo de ~/.ssh/geef-deploy.pub aqui
EOF

chmod 600 ~/.ssh/authorized_keys
```

### 3. Configurar Secrets no GitHub

**NOTA:** Os secrets já estão configurados no GitHub com os nomes corretos abaixo.

Vá para: https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions

Verifique se estes secrets existem:

| Nome | Valor |
|------|-------|
| `GEEF_VPS_HOST` | `204.216.166.12` |
| `GEEF_VPS_USER` | `ubuntu` |
| `GEEF_VPS_PATH` | `/home/ubuntu/sitegeef` |
| `GEEF_VPS_SSH_KEY` | Conteúdo de `~/.ssh/geef-deploy` |
| `GEEF_SUPABASE_SERVICE_ROLE_KEY` | Valor de `SUPABASE_SERVICE_ROLE_KEY` do `.env` |

### 3.1 Adicionar Secret do Supabase

Se o secret `GEEF_SUPABASE_SERVICE_ROLE_KEY` não existe:

```bash
# Via CLI do GitHub (se tiver `gh` instalado):
gh secret set GEEF_SUPABASE_SERVICE_ROLE_KEY --body "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Ou manualmente no GitHub:
# 1. https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions
# 2. Clique em "New repository secret"
# 3. Nome: GEEF_SUPABASE_SERVICE_ROLE_KEY
# 4. Valor: Cole o conteúdo de SUPABASE_SERVICE_ROLE_KEY do arquivo .env
```

### 4. Garantir que deploy.sh tem permissão de execução

```bash
# No VPS:
chmod +x /home/ubuntu/sitegeef/deploy.sh
```

## Testando o Deploy

Após configurar tudo:

```bash
# 1. Faça uma mudança pequena
echo "# Teste de deploy" >> README.md

# 2. Commit e push
git add README.md
git commit -m "test: verify deployment workflow"
git push origin main

# 3. Monitore no GitHub
# Vá para: Actions → Build and Deploy → Veja o progresso

# 4. Verifique o site
# Acesse: https://geef.com.br
```

## Troubleshooting

### Deploy falha com erro de SSH

```
❌ Permission denied (publickey)
```

**Solução:**
- Verifique se a chave pública está em `~/.ssh/authorized_keys` no VPS
- Verifique permissões: `chmod 600 ~/.ssh/authorized_keys`
- Teste manualmente: `ssh -i ~/.ssh/geef-deploy ubuntu@204.216.166.12`

### PM2 não encontrado

```
❌ pm2: command not found
```

**Solução:**
```bash
# No VPS:
npm install -g pm2
```

### Porta já em uso

```
❌ Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**
```bash
# No VPS:
pm2 kill
pm2 start npm --name "sitegeef" -- run start:standalone
```

### Ver logs do deploy

```bash
# No VPS:
pm2 logs sitegeef

# Ou via GitHub Actions:
# Actions → Build and Deploy → View logs
```

## Workflow Manual (Se deploy automático falhar)

```bash
# SSH no VPS
ssh ubuntu@204.216.166.12

# Dentro do VPS:
cd /home/ubuntu/sitegeef
bash deploy.sh
```

## Próximos passos

- [ ] Configurar SSL/HTTPS automático
- [ ] Adicionar health checks
- [ ] Notificações de deploy (Slack/Email)
- [ ] Rollback automático em caso de falha
- [ ] Blue-green deployment

## Arquivos de Deploy

| Arquivo | Função |
|---------|--------|
| `.github/workflows/deploy.yml` | Workflow do GitHub Actions |
| `deploy.sh` | Script executado no VPS |
| `.env` | Credenciais do VPS (não commitado) |

## Segurança

✅ **Boas práticas:**
- SSH key privada armazenada em GitHub Secrets
- Chave pública apenas no VPS
- Permissões restrictivas nos arquivos

⚠️ **Nunca:**
- Commitar SSH keys no git
- Compartilhar secrets publicamente
- Usar mesma key para múltiplos projetos (ideal)

