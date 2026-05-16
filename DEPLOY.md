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

Vá para: https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions

Adicione estes secrets:

| Nome | Valor |
|------|-------|
| `VPS_HOST` | `204.216.166.12` |
| `VPS_USER` | `ubuntu` |
| `VPS_PATH` | `/home/ubuntu/sitegeef` |
| `SSH_PRIVATE_KEY` | Conteúdo de `~/.ssh/geef-deploy` |
| `SSH_KNOWN_HOSTS` | Saída de `ssh-keyscan -H 204.216.166.12` |

### 4. Gerar SSH_KNOWN_HOSTS

```bash
ssh-keyscan -H 204.216.166.12 >> ~/.ssh/known_hosts
cat ~/.ssh/known_hosts | grep 204.216.166.12
# Copie a saída para o secret SSH_KNOWN_HOSTS
```

### 5. Garantir que deploy.sh tem permissão de execução

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

