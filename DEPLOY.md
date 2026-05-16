# 🚀 Deploy Automático - Coolify

O site GEEF agora possui deploy automático via Coolify ao fazer push para `main`.

## Como funciona?

```mermaid
git push origin main
    ↓
GitHub dispara webhook no Coolify
    ↓
1. Coolify faz clone do repositório
    ↓
2. Build Docker (Dockerfile)
    ↓
3. Deploy no VPS (78.142.242.236)
    ↓
4. Container inicia automaticamente
    ↓
5. Healthcheck verifica aplicação
    ↓
✅ Site geef.com.br atualizado!
```

## Setup Necessário

### 1. Criar organização no GitHub

**IMPORTANTE:** O repositório DEVE estar em uma organização, não em conta pessoal.

- Crie organização em: [https://github.com/account/organizations/new](https://github.com/account/organizations/new)
- Mova repositório para lá
- Adicione você como **Owner/Proprietário**

### 2. GitHub App no Coolify

1. Vá para: [https://github.com/organizations/[SUA-ORG]/settings/apps](https://github.com/organizations/[SUA-ORG]/settings/apps)
2. Clique em **"New GitHub App"**
3. Preencha:
   - **GitHub App name**: `Coolify Deploy`
   - **Homepage URL**: `https://coolify.io`
   - **Webhook active**: ❌ Desmarque

4. **Permissões necessárias**:
   - Repository → `Contents` (Read & write)
   - Repository → `Metadata` (Read-only)
   - Organization → `Members` (Read-only)

5. Clique em **"Create GitHub App"**
6. No Coolify: Settings → Git Providers → "Add GitHub App"

### 3. Configurar DNS no Cloudflare

**Importante:** Deve apontar direto para o novo IP do VPS, não usar Cloudflare Tunnel.

1. Vá para: https://dash.cloudflare.com/
2. Selecione domínio `geef.com.br`
3. Vá para **DNS**
4. Crie/edite registro `A`:

| Campo | Valor |
| --- | --- |
| **Tipo** | `A` |
| **Nome** | `geef.com.br` |
| **Conteúdo** | `78.142.242.236` |
| **TTL** | Auto |
| **Proxy** | Cinza (DNS only) |

### 4. VPS Setup (78.142.242.236)

```bash
# SSH no VPS
ssh root@78.142.242.236

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Docker (para Coolify)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 5. Adicionar Secrets no Coolify

Na aplicação no Coolify, vá para **Environment Variables** e adicione:

```
NEXT_PUBLIC_SITE_URL=https://geef.com.br
NEXT_PUBLIC_SUPABASE_URL=https://nycgpokqlmrfzegjlrwa.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jDq5SX_k4spHMCCPVvlsrQ_-ZZybt8e
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testando o Deploy

Após configurar tudo:

```bash
# 1. Faça uma mudança pequena
echo "# Deploy teste" >> README.md

# 2. Commit e push
git add README.md
git commit -m "test: verify Coolify deployment"
git push origin main

# 3. Monitore no Coolify
# Vá para: Aplicação → Deployment → Logs

# 4. Verifique o site
# Acesse: https://geef.com.br
```

## Troubleshooting

### Site mostra erro 502/503

```bash
# SSH no VPS
ssh root@78.142.242.236

# Ver containers em execução
docker ps

# Ver logs do container
docker logs [container-id] -f

# Reiniciar container
docker restart [container-id]
```

### Coolify não faz deploy ao fazer push

1. Verificar se GitHub App está corretamente instalado
2. Verificar webhook no GitHub: `Settings → Webhooks`
3. No Coolify: Applications → Redeploy manualmente

### Construção do Docker falha

```bash
# SSH no VPS
docker build -t sitegeef:latest .
```

Ver logs de erro e corrigir Dockerfile.

## Arquivos importantes

| Arquivo | Função |
| --- | --- |
| `Dockerfile` | Build e deploy da aplicação |
| `package.json` | Scripts: `build`, `start:standalone` |
| `.github/workflows/deploy.yml` | Workflow antigo (pode remover) |
| `deploy.sh` | Script antigo (pode remover) |

## Segurança

✅ **Implementado:**
- Variáveis de ambiente em Coolify (não em git)
- GitHub App com permissões mínimas
- DNS direto (sem Cloudflare Tunnel)
- Healthcheck configurado

⚠️ **Atenção:**
- Variáveis públicas (`NEXT_PUBLIC_*`) são visíveis no código
- Service role key é privada, mantém segura!
- Não commitar `.env` ou `.env.local`

## IP do VPS

- **Antigo (offline)**: 204.216.166.12 (Oracle Cloud)
- **Novo (ativo)**: 78.142.242.236 (Hetzner ou similar)

**IMPORTANTE:** Sempre atualize o DNS quando mudar de VPS!

---

**Última atualização**: 2026-05-16  
**Status**: ✅ Totalmente operacional com Coolify
