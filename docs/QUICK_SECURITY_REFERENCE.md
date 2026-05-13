# ⚡ Referência Rápida - Segurança

## 🚨 Ação Urgente

```bash
# 1. Validar credenciais
npm run credentials:validate

# 2. Fazer backup
npm run credentials:backup

# 3. Rotar credenciais (assistente interativo)
npm run credentials:rotate
```

---

## 📋 Credenciais Críticas

| Variável | Tipo | Onde Atualizar | Status |
|----------|------|----------------|--------|
| `GEEF_SUPABASE_SERVICE_ROLE_KEY` | JWT | `.env`, GitHub Secrets, VPS `.env` | ⚠️ Rotar agora |
| `SUPABASE_SERVICE_ROLE_KEY` | JWT | `.env`, VPS `.env` | ⚠️ Rotar agora |
| `GEEF_LOG_INGEST_TOKEN` | Token | `.env`, GitHub Secrets, VPS `.env` | ⚠️ Rotar agora |

---

## 🔐 Rotação Rápida (5 min)

### Local
```bash
npm run credentials:rotate
# Escolha qual credencial
# Cole o novo valor
```

### GitHub Secrets
```
https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions
- Nome: GEEF_SUPABASE_SERVICE_ROLE_KEY
- Valor: [Cole o novo JWT]
- Save
```

### VPS
```bash
ssh ubuntu@204.216.166.12
cd /home/ubuntu/sitegeef
nano .env
# Ctrl+X, Y, Enter para salvar
systemctl restart sitegeef
```

### Validar
```bash
npm run collect:system-errors
# Verifica que Supabase está recebendo logs
```

---

## 📝 Arquivos de Documentação

- **Rotação detalhada**: `docs/SECURITY_ROTATION.md`
- **Deploy**: `docs/DEPLOY_SSH.md`
- **Observabilidade**: `docs/OPS_LOGS.md`
- **Análise de infraestrutura**: `docs/GITHUB_INFRA_ANALYSIS.md`

---

## ✅ Checklist Mensal

```
[ ] npm run credentials:validate
[ ] Verificar logs no Supabase (zero erros?)
[ ] GitHub Actions - builds passando?
[ ] VPS health check: curl https://geef.com.br
[ ] Revisar últimas mudanças: git log --oneline -10
```

---

## 🆘 Emergência

**Credencial comprometida?**

1. Invalide IMEDIATAMENTE no Supabase
2. Regenere nova chave
3. `npm run credentials:rotate`
4. Atualize GitHub Secrets
5. SSH na VPS e atualize
6. Restart: `systemctl restart sitegeef`
7. Monitorar logs próximas 24h

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://app.supabase.com
- **GitHub Secrets**: https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets
- **Site GEEF**: https://geef.com.br
- **VPS SSH**: `ssh ubuntu@204.216.166.12`
