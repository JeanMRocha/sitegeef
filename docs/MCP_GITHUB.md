# 🔗 MCP GitHub - Acesso à sua conta GitHub

## Setup Rápido

### 1. Gerar Token GitHub
- Acesse: https://github.com/settings/tokens
- New personal access token (classic)
- Permissões: `repo`, `read:user`
- Copie o token

### 2. Adicionar ao .env
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### 3. Configurar MCP Global
Edite: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "geef-credentials": {...},
    "geef-github": {
      "command": "node",
      "args": ["C:/Projetos/site-geef/mcp/github-server.mjs"]
    }
  }
}
```

### 4. Reiniciar Claude Desktop

---

## Ferramentas Disponíveis

| Ferramenta | O que faz |
|-----------|----------|
| `list_repos` | Lista seus repos |
| `get_repo` | Detalhes de um repo |
| `list_issues` | Issues de um repo |
| `list_prs` | PRs de um repo |
| `get_commits` | Commits recentes |
| `create_issue` | Cria nova issue |
| `get_readme` | Retorna README |
| `search_repos` | Busca por palavra-chave |

---

## Uso no Claude

```
"Liste meus repositórios"
"Qual é o status de issues abertas em sitegeef?"
"Crie uma issue em site-geef com título: Bug no deploy"
"Mostre os últimos commits em sitegeef"
"Busque repos que mencionem 'api'"
```

---

## Segurança

⚠️ **Não commite GITHUB_TOKEN no Git**
- Use `.env` (está no `.gitignore`)
- Use GitHub Secrets para CI/CD
- Rotacione token periodicamente

---

## User: JeanMRocha

Configurado para acessar: `https://github.com/JeanMRocha/`

Todos os repos e dados públicos/privados (conforme permissões do token).
