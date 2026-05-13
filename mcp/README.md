# 🔐 MCP Servers - GEEF

Servidores MCP (Model Context Protocol) para integração com Claude.

## Servidores Disponíveis

### `credentials-server.mjs`
Gerencia rotação de credenciais sensíveis.

**Iniciar localmente:**
```bash
node mcp/credentials-server.mjs
```

**Configurar no Claude Desktop:**
Ver `docs/MCP_CREDENTIALS.md`

## Estrutura

```
mcp/
├── credentials-server.mjs    ← Servidor MCP para credenciais
├── claude.config.json        ← Configuração exemplo
└── README.md                 ← Este arquivo
```

## Início Rápido

1. **Teste local:**
   ```bash
   node mcp/credentials-server.mjs
   ```

2. **Configure no Claude:**
   Edite `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
   Ou `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
   
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

3. **Reinicie Claude Desktop**

4. **Use no Claude:**
   ```
   "Valide as credenciais do projeto"
   "Faz um backup do .env"
   "Rotacione a credencial GEEF_SUPABASE_SERVICE_ROLE_KEY com..."
   ```

## Ferramentas

- `validate_credentials` - Valida todas as credenciais
- `backup_env` - Faz backup automático
- `rotate_credential` - Rotaciona uma credencial
- `get_credentials_status` - Status das credenciais
- `update_github_secret` - Instruções para GitHub
- `generate_vps_update_script` - Script SSH para VPS

## Documentação Completa

Ver `docs/MCP_CREDENTIALS.md` para:
- Instalação detalhada
- Exemplos de uso
- Fluxo completo de rotação
- Troubleshooting
- Referência de segurança

## Segurança

✅ Credenciais sensíveis nunca são impressas completas  
✅ Backups automáticos antes de mudanças  
✅ Validação de entrada  
✅ Instruções manuais para operações críticas  

## Versão

MCP Credentials Server v1.0.0
Node.js v18+
