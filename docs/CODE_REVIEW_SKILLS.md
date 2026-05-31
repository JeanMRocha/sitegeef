# Code Review Skills — Recomendações para GEEF ERP

**Data:** 2026-05-31  
**Status:** Recomendações para avaliação

---

## Opções Disponíveis

### Opção 1: Code Review Skill (Recomendado para Iniciar)

**Repositório:** [awesome-skills/code-review-skill](https://github.com/awesome-skills/code-review-skill)  
**Linguagens Suportadas:** 19+ (React, Next.js, TypeScript, Node.js, Python, Java, etc)  
**Tamanho:** ~16,000 linhas de guias curados  
**Focos:** Security, Performance, Logic, Edge Cases, Style

#### Instalação

**Windows (PowerShell):**
```powershell
git clone https://github.com/awesome-skills/code-review-skill.git `
  "$env:USERPROFILE\.claude\skills\code-review-skill"
```

**macOS/Linux:**
```bash
git clone https://github.com/awesome-skills/code-review-skill.git \
  ~/.claude/skills/code-review-skill
```

#### Uso
```
/code-review-skill review [file-path]
```

#### Características
✅ Suporta Next.js 15 (nosso frontend)  
✅ Suporta TypeScript e React 19  
✅ Suporta Node.js/Server Actions (nosso backend)  
✅ Segurança (SQL injection, XSS, CORS)  
✅ Performance (bundle size, waterfalls)  
✅ Acessibilidade  
✅ Testes (unit, E2E, coverage)  
✅ Padrões de código  

#### Quando Usar
- Revisão de PRs antes de merge
- Audit de módulos específicos
- Validação de boas práticas
- Detecção de vulnerabilidades

---

### Opção 2: Claude Code Skills Suite (Completo)

**Repositório:** [levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills)  
**Total de Skills:** 137 skills em 7 plugins  
**Tamanho:** Suite enterprise completa  
**Organização:** 7 plugins instaláveis

#### Plugins Disponíveis

| Plugin | Descrição | Relevância GEEF |
| --- | --- | --- |
| **agile-workflow** | Decomposição de escopo, gestão de histórias/tarefas, portais de qualidade | ⭐⭐⭐ Alta (projeto ativo) |
| **codebase-audit-suite** | Auditoria em 9 categorias (segurança, testes, arquitetura, performance) | ⭐⭐⭐⭐ Muito Alta |
| **documentation-pipeline** | Pipeline completo de documentação com detecção automática | ⭐⭐ Média (já documentado) |
| **project-bootstrap** | Scaffolding/transformação para Clean Architecture | ⭐ Baixa (projeto maduro) |
| **optimization-suite** | Otimização de performance, atualização de deps, modernização | ⭐⭐ Média |
| **community-engagement** | Gerenciamento GitHub (triagem, RFCs) | ⭐ Não aplicável (repo privado) |
| **setup-environment** | Instalação de agentes, config MCP, alinhamento de plugins | ⭐ Baixa (já configurado) |

#### Instalação

**Requer:** Claude Code CLI instalado

```powershell
# Adicionar marketplace (uma vez)
/plugin marketplace add levnikolaevich/claude-code-skills

# Instalar plugin específico
/plugin install codebase-audit-suite@levnikolaevich-skills-marketplace
```

#### Quando Usar
- Auditoria completa do codebase
- Detecção de vulnerabilidades em escala
- Análise de arquitetura e padrões
- Otimização de performance
- Planejamento de refatorações

---

### Opção 3: Trail of Bits Security Skills

**Repositório:** [trailofbits/skills](https://github.com/trailofbits/skills)  
**Foco:** Security, Vulnerability Detection  
**Linguagens:** TypeScript, Python, Go, Rust  
**Usar Quando:** Auditoria de segurança específica

---

## Recomendação para GEEF ERP

### Fase 1: Integração Imediata (Recomendado)

**Skill:** `code-review-skill` (awesome-skills)

**Razões:**
1. Simples de instalar (git clone)
2. Suporta Next.js 15 + TypeScript + React 19
3. Pronto para usar imediatamente
4. 19+ linguagens incluindo Node.js/Server Actions
5. Focos alinhados com nossos problemas (security, performance, accessibility)

**Uso Sugerido:**
```bash
# Revisar arquivo específico
/code-review-skill review components/admin/musicas/musicas-catalog-table.tsx

# Revisar PR antes de merge
/code-review-skill review --pr-mode

# Validar segurança
/code-review-skill review --focus=security app/api/
```

---

### Fase 2: Auditoria Profunda (2-4 semanas)

**Skill Suite:** `codebase-audit-suite` (levnikolaevich)

**Razões:**
1. Auditoria em 9 categorias (vs. 5 em code-review-skill)
2. Detecta padrões de risco em escala
3. Análise de arquitetura
4. Recomendações de refatoração com priorização
5. Relatório executivo

**Categorias de Auditoria:**
- ✅ Segurança (SQL injection, XSS, auth, permissions)
- ✅ Testes (coverage, gaps, qualidade)
- ✅ Arquitetura (patterns, dependency topology, modernização)
- ✅ Performance (queries, runtime, resource lifecycle)
- ✅ Manutenibilidade (DRY, KISS, dead code, hotspots)
- ✅ Documentação (estrutura, semântica, fact-checking)
- ✅ Confiabilidade (concurrency, lifecycle, logging)
- ✅ Qualidade de Código (estilo, padrões, consistência)
- ✅ Dependências (vulnerabilidades, compliance, reuso)

---

## Plano de Implementação

### Passo 1: Instalar Code Review Skill (Hoje)

```powershell
git clone https://github.com/awesome-skills/code-review-skill.git `
  "$env:USERPROFILE\.claude\skills\code-review-skill"
```

### Passo 2: Testar em Um Módulo (1 hora)

```bash
# Revisar um arquivo crítico
/code-review-skill review components/admin/admin-header.tsx

# Revisar múltiplos arquivos
/code-review-skill review lib/auth/

# Verificar foco específico (segurança)
/code-review-skill review --security-focus app/api/
```

### Passo 3: Usar em Fluxo de PR (Contínuo)

Adicionar verificação de code-review antes de cada merge:
```bash
# No pre-commit hook ou CI/CD
/code-review-skill review [changed-files]
```

### Passo 4: Auditoria Completa (Semana 3-4)

Instalar `codebase-audit-suite` e executar auditoria em 9 categorias:
```bash
/plugin install codebase-audit-suite@levnikolaevich-skills-marketplace
ln-620-codebase-audit-orchestrator execute
```

---

## Critérios de Avaliação

Quando executar revisão com estas skills, verificar:

### Security (Alta Prioridade)
- [ ] SQL injection risks
- [ ] XSS vulnerabilities
- [ ] Authentication/Authorization flaws
- [ ] Permission checks (RBAC)
- [ ] Sensitive data exposure
- [ ] CORS misconfiguration

### Performance (Alta Prioridade)
- [ ] Database query efficiency
- [ ] N+1 query problems
- [ ] Unnecessary re-renders (React)
- [ ] Bundle size bloat
- [ ] Request waterfalls
- [ ] Memory leaks

### Accessibility (Média Prioridade)
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast (dark mode!)
- [ ] ARIA labels

### Code Quality (Média Prioridade)
- [ ] DRY violations
- [ ] Dead code
- [ ] Naming clarity
- [ ] Function complexity
- [ ] Test coverage (>70% target)

### Architecture (Baixa Prioridade — já fazemos bem)
- [ ] Module boundaries
- [ ] Dependency direction
- [ ] Layer separation
- [ ] Pattern consistency

---

## Integração com CI/CD (Opcional)

Adicionar verificação automática no GitHub Actions:

```yaml
# .github/workflows/code-review.yml
name: Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Code Review Skill
        run: |
          git clone https://github.com/awesome-skills/code-review-skill.git \
            ~/.claude/skills/code-review-skill
      - name: Run Review
        run: claude /code-review-skill review --pr-mode
```

---

## Comparação de Skills

| Aspecto | code-review-skill | codebase-audit-suite | code-reviewer (Agensi) |
| --- | --- | --- | --- |
| **Instalação** | Git clone | Plugin manager | Marketplace |
| **Linguagens** | 19+ | 19+ | 15+ |
| **Categorias** | 5 | 9 | 5 |
| **Tempo Setup** | 2 min | 10 min | 5 min |
| **Pronto para PR** | ✅ Sim | ⚠️ Para audit | ✅ Sim |
| **Auditoria Profunda** | ⚠️ Parcial | ✅ Completo | ⚠️ Parcial |
| **Custo** | Grátis | Grátis | Grátis |
| **Manutenção** | GitHub | GitHub | Marketplace |

---

## Próximas Ações

1. **Hoje:** Instalar `code-review-skill` e testar em 3 módulos admin
2. **Esta semana:** Revisar todos os módulos críticos (auth, financeiro, escalas)
3. **Próxima semana:** Documentar findings e criar issues para refatorações
4. **Semana 3-4:** Instalar `codebase-audit-suite` para auditoria profunda

---

## Links de Referência

- [Code Review Skill GitHub](https://github.com/awesome-skills/code-review-skill)
- [Claude Code Skills Suite](https://github.com/levnikolaevich/claude-code-skills)
- [Trail of Bits Security Skills](https://github.com/trailofbits/skills)
- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)
- [GEEF ERP CLAUDE.md](../CLAUDE.md)

---

## Documentação do Projeto

Arquivo de referência: `docs/CODE_REVIEW_SKILLS.md`
