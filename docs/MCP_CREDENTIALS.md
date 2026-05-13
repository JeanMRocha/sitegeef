# 🔐 MCP Credentials Server - Integração com Claude

## Overview

O **MCP Credentials Server** permite gerenciar credenciais do GEEF diretamente via Claude, automatizando a rotação de JWTs e tokens sensíveis.

---

## 🚀 Instalação

### 1. O servidor MCP já está pronto em:
```
mcp/credentials-server.mjs
```

### 2. Configuração no Claude Desktop (macOS/Windows)

Edite seu arquivo de configuração:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Adicione:
```json
{
  "mcpServers": {
    "geef-credentials": {
      "command": "node",
      "args": ["/caminho/completo/para/C:/Projetos/site-geef/mcp/credentials-server.mjs"]
    }
  }
}
```

### 3. Reinicie o Claude Desktop

O MCP será carregado automaticamente.

---

## 📋 Ferramentas Disponíveis

### 1. `validate_credentials`
Valida todas as credenciais no `.env`.

**Uso via Claude:**
```
Me valide as credenciais do projeto
```

**Retorna:**
```json
{
  "status": "success",
  "allValid": true,
  "credentials": [
    {
      "name": "GEEF_SUPABASE_SERVICE_ROLE_KEY",
      "status": "valid",
      "critical": true,
      "preview": "eyJhbGciOiJIUzI1NiIs..."
    }
  ]
}
```

---

### 2. `backup_env`
Faz backup automático do `.env` com timestamp.

**Uso via Claude:**
```
Faz um backup do .env
```

**Retorna:**
```json
{
  "status": "success",
  "backup_file": ".env.backup.2026-05-13T01-25-30-000Z",
  "backup_path": "/caminho/completo/..."
}
```

---

### 3. `rotate_credential`
Rotaciona uma credencial específica.

**Uso via Claude:**
```
Rotacione a credencial GEEF_SUPABASE_SERVICE_ROLE_KEY com o novo valor: eyJhbGciOi...
```

**Parâmetros:**
- `credential_name`: Nome da credencial
- `new_value`: Novo valor

**Retorna:**
```json
{
  "status": "success",
  "message": "GEEF_SUPABASE_SERVICE_ROLE_KEY atualizado",
  "backup_file": ".env.backup.2026-05-13T...",
  "next_steps": [
    "1. Atualizar GitHub Secrets",
    "2. Atualizar VPS .env",
    "3. Restart do serviço"
  ]
}
```

---

### 4. `get_credentials_status`
Mesmo que `validate_credentials`, retorna status completo.

**Uso via Claude:**
```
Qual é o status das minhas credenciais?
```

---

### 5. `update_github_secret`
Fornece instruções para atualizar GitHub Secrets manualmente (não modifica automaticamente por segurança).

**Uso via Claude:**
```
Como atualizo o GitHub Secret GEEF_SUPABASE_SERVICE_ROLE_KEY?
```

**Retorna:**
```json
{
  "status": "info",
  "message": "GitHub Secrets deve ser atualizado manualmente via UI",
  "instructions": {
    "step1": "Acesse: https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions",
    "step2": "Clique em 'New repository secret' ou edite GEEF_SUPABASE_SERVICE_ROLE_KEY"
  },
  "github_url": "https://github.com/..."
}
```

---

### 6. `generate_vps_update_script`
Gera script SSH automático para atualizar credenciais na VPS.

**Uso via Claude:**
```
Gere um script para atualizar a credencial GEEF_SUPABASE_SERVICE_ROLE_KEY na VPS com o novo valor: eyJ...
```

**Retorna:**
```json
{
  "status": "success",
  "script": "#!/bin/bash\nset -e\nssh ubuntu@204.216.166.12 << 'EOFREMOTE'\n...",
  "instructions": [
    "1. Salve o script em um arquivo",
    "2. Execute: bash update-vps.sh",
    "3. Monitore os logs"
  ]
}
```

---

## 🔄 Fluxo de Rotação via Claude

### Passo 1: Validar Credenciais
```
Claude, valide as credenciais do projeto GEEF
```

### Passo 2: Fazer Backup
```
Faz um backup do .env antes de fazer mudanças
```

### Passo 3: Rotacionar Credencial
```
Rotacione a credencial GEEF_SUPABASE_SERVICE_ROLE_KEY com o novo valor JWT que gerei no Supabase
```
(Cole o novo JWT quando pedido)

### Passo 4: Atualizar GitHub Secrets
```
Como atualizo o GitHub Secret GEEF_SUPABASE_SERVICE_ROLE_KEY?
```

### Passo 5: Gerar Script VPS
```
Gere um script para atualizar a credencial na VPS
```

### Passo 6: Executar e Validar
```
Execute o script gerado e valide que tudo funciona
```

---

## 🛡️ Segurança

### Credenciais Sensíveis
- ✅ **Não são armazenadas** em logs
- ✅ **Nunca são impressas** completas (apenas preview dos primeiros 30 chars)
- ✅ **Não são transmitidas** para fora do MCP
- ✅ **Backups automáticos** antes de qualquer mudança

### Operações Seguras
- ✅ Validação de nomes de credenciais
- ✅ Verificação de valores vazios
- ✅ Backup automático antes de modificar
- ✅ Instruções manuais para GitHub Secrets (não automático)

---

## 📝 Exemplos de Uso

### Exemplo 1: Rotação Completa

```
Você:
"Vou rotacionar as credenciais do Supabase. Primeira, valide o estado atual"

Claude:
[Chama validate_credentials]
Resultado: Todas as 4 credenciais estão presentes e válidas.

Você:
"Faz um backup antes de mudanças"

Claude:
[Chama backup_env]
Resultado: Backup criado em .env.backup.2026-05-13T...

Você:
"Agora rotacione a GEEF_SUPABASE_SERVICE_ROLE_KEY com este novo JWT: eyJhbGc..."

Claude:
[Chama rotate_credential com os parâmetros]
Resultado: Credencial atualizada com sucesso!

Você:
"Como atualizo o GitHub Secret?"

Claude:
[Chama update_github_secret]
Resultado: Acesse https://github.com/.../settings/secrets/actions
```

### Exemplo 2: Atualizar VPS Automaticamente

```
Você:
"Gere um script para atualizar a VPS com a nova credencial"

Claude:
[Chama generate_vps_update_script]
Resultado: Script gerado com todas as validações e rollback automático

Você:
"Execute o script"

Claude:
[Exibe o script para você executar, já que requer SSH]
```

---

## 🐛 Troubleshooting

### Erro: "MCP Server not found"
- Verifique o caminho completo no `claude_desktop_config.json`
- Reinicie o Claude Desktop
- Abra DevTools (Ctrl+Shift+I) para ver erros

### Erro: ".env não encontrado"
- Certifique-se de estar no diretório correto
- O caminho deve ser relativo a `C:/Projetos/site-geef`

### Erro: "Credencial inválida"
- Use um dos nomes válidos:
  - `GEEF_SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GEEF_LOG_INGEST_TOKEN`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

## 📚 Referência Completa de Ferramentas

| Ferramenta | Entrada | Saída | Segurança |
|-----------|---------|-------|-----------|
| `validate_credentials` | Nenhuma | Status de todas as credenciais | ✅ Leitura apenas |
| `backup_env` | Nenhuma | Caminho do backup | ✅ Cópia segura |
| `rotate_credential` | Nome + Valor | Confirmação + próximos passos | ✅ Validado |
| `get_credentials_status` | Nenhuma | Status detalhado | ✅ Leitura apenas |
| `update_github_secret` | Nome + Valor | Instruções manuais | ✅ Instruções apenas |
| `generate_vps_update_script` | Nome + Valor | Script SSH | ✅ Para revisão manual |

---

## 🔗 Links Úteis

- **Claude Desktop Config**: https://docs.anthropic.com/mcp/server-implementation
- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **Supabase JWT**: https://supabase.com/docs/reference/api
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## ✅ Checklist de Configuração

```
[ ] Fazer download de Node.js v18+ (se não tiver)
[ ] Localizar claude_desktop_config.json
[ ] Adicionar configuração do MCP
[ ] Executar: node mcp/credentials-server.mjs (teste local)
[ ] Reiniciar Claude Desktop
[ ] Testar com: "Valide as credenciais"
[ ] Configurar GitHub Secrets URL nos favoritos
[ ] Documentar processo na wiki do time
```

---

**Próximo passo**: Reinicie o Claude Desktop e teste com "Valide as credenciais do projeto GEEF". 🚀
