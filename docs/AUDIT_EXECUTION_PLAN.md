# Plano de Execução — Auditoria por Categoria

**Data:** 2026-05-31  
**Tipo:** Auditoria por Categoria (4 principais)  
**Tempo Total:** ~2 horas (30 min cada)  
**Status:** Pronto para começar

---

## 4 Categorias de Auditoria

### 1️⃣ Security Boundary Auditor (30 min)
**Auditor:** `ln-621-security-boundary-auditor`  
**Foco:** SQL injection, XSS, auth, permissions, RLS, CORS, sensitive data

**Comando:**
```bash
ln-621-security-boundary-auditor execute
```

**Esperado para GEEF ERP:**
- ✅ RLS policies (já implementado)
- ✅ Permission checks via `requirePermission()` (já padrão)
- ⚠️ Potencial: SQL injection em queries dinâmicas
- ⚠️ Potencial: XSS em componentes com `dangerouslySetInnerHTML`
- ⚠️ Potencial: CORS misconfiguration no API

**Output:**
- Críticos: Security violations (SQL injection, XSS)
- Altos: Missing permissions checks
- Médios: Configuration issues

---

### 2️⃣ Build Delivery Gate Auditor (30 min)
**Auditor:** `ln-622-build-delivery-gate-auditor`  
**Foco:** Tests, coverage, CI/CD, build quality, delivery gates

**Comando:**
```bash
ln-622-build-delivery-gate-auditor execute
```

**Esperado para GEEF ERP:**
- ⚠️ Test coverage (precisa verificar)
- ⚠️ E2E tests (modules have tests?)
- ⚠️ CI/CD gates (lint, build, test passes?)
- ⚠️ Test quality (unit vs. integration vs. E2E)

**Output:**
- Críticos: No tests on critical modules
- Altos: Low coverage (<50%)
- Médios: Missing E2E tests

---

### 3️⃣ Duplication & Over-abstraction Auditor (30 min)
**Auditor:** `ln-623-duplication-overabstraction-auditor`  
**Foco:** DRY violations, copy-paste code, unnecessary abstractions

**Comando:**
```bash
ln-623-duplication-overabstraction-auditor execute
```

**Esperado para GEEF ERP:**
- ⚠️ Admin modules (27x similar CRUD patterns — esperado)
- ⚠️ Server actions (similar patterns em `*/actions.ts`)
- ✅ Utilities (reuso de `lib/` helpers)
- ⚠️ Inline styles (recentemente corrigido)

**Output:**
- Críticos: Duplicate security-critical code
- Altos: Copy-paste in 3+ modules
- Médios: Minor duplication patterns

---

### 4️⃣ Maintainability Hotspots Auditor (30 min)
**Auditor:** `ln-624-code-maintainability-hotspot-auditor`  
**Foco:** Complexity, dead code, naming, code smells

**Comando:**
```bash
ln-624-code-maintainability-hotspot-auditor execute
```

**Esperado para GEEF ERP:**
- ⚠️ Complexity hotspots (large admin modules?)
- ⚠️ Dead code (removed features, unused functions?)
- ✅ Naming (generally good per CLAUDE.md)
- ⚠️ Code smells (long functions, god objects?)

**Output:**
- Críticos: Functions >100 lines
- Altos: Cyclomatic complexity >10
- Médios: Naming clarity issues

---

## Cronograma de Execução

| Categoria | Duração | Hora | Output |
| --- | --- | --- | --- |
| **1. Security** | 30 min | 10:00-10:30 | Security findings |
| **2. Build/Tests** | 30 min | 10:30-11:00 | Test coverage gaps |
| **3. DRY/Duplication** | 30 min | 11:00-11:30 | Code duplication map |
| **4. Maintainability** | 30 min | 11:30-12:00 | Complexity hotspots |

**Total:** 2 horas  
**Output:** 4 detailed reports + executive summary

---

## Como Executar

### Passo-a-Passo

```bash
# Passo 1: Entrar no diretório do projeto
cd C:\Projetos\site-geef

# Passo 2: Executar Security Auditor
# (Aguardar output, anotar críticos/altos)
ln-621-security-boundary-auditor execute

# Passo 3: Executar Build/Tests Auditor
# (Aguardar output)
ln-622-build-delivery-gate-auditor execute

# Passo 4: Executar DRY/Duplication Auditor
# (Aguardar output)
ln-623-duplication-overabstraction-auditor execute

# Passo 5: Executar Maintainability Auditor
# (Aguardar output)
ln-624-code-maintainability-hotspot-auditor execute
```

### Com JSON Output (Para Análise)

```bash
# Se a suite suportar --output-format=json
ln-621-security-boundary-auditor execute --output-format=json > security-audit.json
ln-622-build-delivery-gate-auditor execute --output-format=json > tests-audit.json
ln-623-duplication-overabstraction-auditor execute --output-format=json > dup-audit.json
ln-624-code-maintainability-hotspot-auditor execute --output-format=json > maintainability-audit.json
```

---

## Depois da Execução

### Fase 3: Análise (2-3 horas)

1. **Consolidar Findings**
   - Agrupar por categoria
   - Separar críticos vs. altos vs. médios
   - Identificar padrões

2. **Estimar Impacto**
   - Crítico: Executa após 1 semana
   - Alto: Executa após 2-4 semanas
   - Médio: Backlog (executa conforme tempo)

3. **Estimar Esforço**
   - Crítico: 1-2 dias
   - Alto: 2-5 dias
   - Médio: 1-3 dias

4. **Criar Issues GitHub**
   - 1 issue por finding crítico
   - 1 issue por cluster de altos (ex: "Test coverage improvements")

### Fase 4: Documentação (1 hora)

1. **AUDIT_REPORT_<DATE>.md**
   - Summary executivo
   - Findings por categoria
   - Métricas de saúde

2. **REMEDIATION_PLAN.md**
   - Issues prorizadas
   - Estimativas de esforço
   - Timeline proposta

3. **Update CLAUDE.md**
   - Adicionar seção "Audit Results (2026-05-31)"
   - Link para relatório completo

---

## Métricas de Sucesso

### ✅ Auditoria Completa
- [ ] Todas as 4 categorias executadas
- [ ] Outputs salvos (JSON ou markdown)
- [ ] Sem erros críticos na suite

### ✅ Findings Documentados
- [ ] Críticos: < 10 (esperado: 0-5)
- [ ] Altos: < 30 (esperado: 10-20)
- [ ] Médios: qualquer número OK
- [ ] Taxa de falsos positivos < 15%

### ✅ Plano de Remediação
- [ ] GitHub issues criadas (críticos/altos)
- [ ] Estimativas de esforço incluídas
- [ ] Priorização clara (matrix)
- [ ] Timeline proposta (3 meses?)

---

## Contexto para Auditors

Se a suite pedir contexto do projeto, use:

```markdown
# GEEF ERP — Codebase Context

**Type:** Next.js 15 fullstack ERP  
**Modules:** 29 admin CRUD modules  
**Users:** 50-500 (estimated)  
**Database:** PostgreSQL (Supabase)  

**Stack:**
- Frontend: React 19, TypeScript, CSS variables
- Backend: Server Actions, Supabase Auth
- Auth: Role-based (9 permission flags)
- Critical: RLS policies, permission checks

**Key Patterns:**
- Server Actions in app/*/actions.ts
- Permissions: lib/auth/permissions.ts
- Cache: lib/admin/cache.ts (invalidate pattern)
- Supabase: 3 clients (server, browser, service-role)

**Recent Work (May 2026):**
- UI/UX corrections (dark mode, design system)
- Code review skills installation
- Infrastructure already documented

**Known Issues:**
- (Will be populated after audit)

**Known Good:**
- RLS implemented
- Permission system in place
- Server-side validation
- TypeScript strict mode
```

---

## Arquivos de Referência

- `CLAUDE.md` — Stack and patterns
- `docs/CODE_REVIEW_SKILLS.md` — Skills evaluation guide
- `docs/AUDIT_READY.md` — Suite setup guide
- `docs/UI_UX_CORRECTIONS.md` — Recent fixes (example)

---

## Próximos Passos

1. **Começar Categoria 1** (Security Auditor) → execução
2. **Processar resultados** → anotar críticos/altos
3. **Repetir para categorias 2-4**
4. **Consolidar achados** → relatório único
5. **Priorizar issues** → criar GitHub issues
6. **Documentar plano** → timeline de remediação

**Pronto para começar!** 🚀
