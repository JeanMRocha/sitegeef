# 🔐 Rotação de Credenciais - GEEF

## ⚠️ Status Crítico

Seu JWT do Supabase está versionado no repositório local (`.env`). Embora esteja no `.gitignore` (então não foi commitado), é **altamente recomendável** rotacionar as credenciais como medida de segurança.

---

## 📋 Credenciais a Rotacionar

| Credencial | Local | Status | Ação |
|-----------|-------|--------|------|
| `GEEF_SUPABASE_SERVICE_ROLE_KEY` | `.env` L8, L21 | ⚠️ Crítico | Renovar no Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env` L7 | ℹ️ Pública | Verificar se comprometida |
| `GEEF_LOG_INGEST_TOKEN` | `.env` L11 | ⚠️ Crítico | Rotacionar |
| `DEPLOY_KEY_PATH` | GitHub Secrets | ✅ Seguro | Verificar periodicamente |

---

## 🔄 Passo a Passo - Rotacionar JWT Supabase

### 1. Acessar Supabase Dashboard

```
https://app.supabase.com
├─ Selecione seu projeto: nycgpokqlmrfzegjlrwa
└─ Project Settings → API
```

### 2. Gerar Novo Service Role Key

No Supabase Dashboard:
1. Vá para **Settings → API**
2. Localize a seção **"Service Role"**
3. Clique em **"Regenerate"** ou **"Rotate Key"**
4. Copie a **nova chave JWT**
5. Confirme que a antiga será invalidada

### 3. Atualizar Localmente

Abra seu `.env` e substitua:

```diff
- GEEF_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y2dwb2txbG1yZnplZ2pscndhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM3Mzc4MSwiZXhwIjoyMDkzOTQ5NzgxfQ.BnoQWqFmV0YyfKAfCSJMiMJYUuTWwwmT3ORBKMHElJM
+ GEEF_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[NOVO_JWT_AQUI]
```

```diff
- SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y2dwb2txbG1yZnplZ2pscndhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM3Mzc4MSwiZXhwIjoyMDkzOTQ5NzgxfQ.BnoQWqFmV0YyfKAfCSJMiMJYUuTWwwmT3ORBKMHElJM
+ SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[NOVO_JWT_AQUI]
```

### 4. Atualizar no GitHub Secrets

Se você usa `GEEF_SUPABASE_SERVICE_ROLE_KEY` no GitHub Actions:

1. Acesse: `https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions`
2. Clique em **"New repository secret"** ou edite a existente
3. Nome: `GEEF_SUPABASE_SERVICE_ROLE_KEY`
4. Valor: Cole o **novo JWT**
5. Clique em **"Add secret"**

### 5. Atualizar na VPS

Se a VPS usa a credencial:

```bash
ssh ubuntu@204.216.166.12
cd /home/ubuntu/sitegeef
nano .env  # ou seu editor
# Substitua GEEF_SUPABASE_SERVICE_ROLE_KEY com novo JWT
# Salve (Ctrl+O, Enter, Ctrl+X)

systemctl restart sitegeef
```

### 6. Validar

```bash
# Local
npm run collect:system-errors
# Ou faça um push para testar a integração com Supabase

# VPS
curl http://127.0.0.1:3500  # Health check
```

---

## 🔄 Rotacionar GEEF_LOG_INGEST_TOKEN

### Por quê?
É um token customizado para ingestão de logs. Se foi exposto, deve ser rotacionado.

### Como:

#### Opção 1: Se gerenciado manualmente
```bash
# Gerar novo token
openssl rand -hex 64

# Atualizar no .env
GEEF_LOG_INGEST_TOKEN=<novo_token>

# Atualizar na VPS
# (mesmo processo acima)
```

#### Opção 2: Se gerenciado por Supabase
Verificar se há uma tabela de tokens em `supabase.co`:
1. Vá para **Editor SQL** no Supabase
2. Procure por tabela de tokens de ingestão
3. Gere novo token, invalide o antigo

---

## 📝 Checklist de Rotação

```
Supabase:
  ☐ Acessar dashboard Supabase
  ☐ Regenerar Service Role Key
  ☐ Copiar novo JWT
  
Local:
  ☐ Atualizar GEEF_SUPABASE_SERVICE_ROLE_KEY em .env
  ☐ Atualizar SUPABASE_SERVICE_ROLE_KEY em .env
  ☐ Atualizar GEEF_LOG_INGEST_TOKEN em .env
  ☐ Teste local: npm run collect:system-errors
  ☐ Verificar que funciona
  
GitHub:
  ☐ Atualizar GEEF_SUPABASE_SERVICE_ROLE_KEY em Secrets
  ☐ Disparar workflow: npm run deploy:ssh
  ☐ Verificar logs no Supabase
  
VPS:
  ☐ SSH para 204.216.166.12
  ☐ Atualizar .env
  ☐ Restart do serviço
  ☐ Health check: curl localhost:3500
  
Final:
  ☐ Validar que todos os logs chegam ao Supabase
  ☐ Confirmar rollback if needed
  ☐ Documentar quando foi feita a rotação
```

---

## 🛡️ Boas Práticas Futuras

### 1. Jamais commitar `.env` (já está no `.gitignore` ✅)

### 2. Usar GitHub Secrets para CI/CD
```yaml
# ✅ CORRETO
env:
  SUPABASE_KEY: ${{ secrets.GEEF_SUPABASE_SERVICE_ROLE_KEY }}

# ❌ ERRADO
env:
  SUPABASE_KEY: eyJhbGc... (hard-coded)
```

### 3. Rotar credenciais periodicamente
- **Críticas** (como JWT): A cada 6 meses
- **Logs**: A cada 3 meses
- **Deploy keys**: A cada 12 meses

### 4. Usar Secrets scanning no GitHub
Settings → Security → Secret scanning ← Ativar

### 5. Documentar trocas
```
ROTAÇÃO DE CREDENCIAIS - 2026-05-12
- Renovado: GEEF_SUPABASE_SERVICE_ROLE_KEY
- Motivo: Rotação preventiva
- Validado: ✅ OK
```

---

## 🚨 Se Suspeitar que Credencial foi Comprometida

### Ação Imediata:

1. **Invalidar no Supabase** (logout de todos os tokens)
2. **Regenerar nova chave** IMEDIATAMENTE
3. **Atualizar em todos os lugares** (local, GitHub, VPS)
4. **Revisar logs** de acesso não autorizado
5. **Comunicar** à equipe

### Checklist:
```
☐ 1. Supabase → Regenerar chave
☐ 2. .env local → Atualizar
☐ 3. GitHub Secrets → Atualizar
☐ 4. VPS .env → Atualizar + restart
☐ 5. Revisar activity log no Supabase
☐ 6. Testar tudo funciona
☐ 7. Monitorar próximas horas
```

---

## 📞 Suporte

- **Dúvidas Supabase**: https://supabase.com/docs
- **Dúvidas GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Dúvidas deploy**: Ver `docs/DEPLOY_SSH.md`
