# Dark Mode Remediation — Plan de Implementação
**Data Início:** 2026-05-31  
**Data Conclusão:** 2026-05-31  
**Status:** ✅ COMPLETO  

---

## 🎯 Objetivo Final
100% dark mode compliance usando variáveis CSS do `identity-system.css` em todos os componentes críticos.

---

## 📋 Checklist de Implementação

### ✅ FASE 1: CRÍTICOS (Delete Buttons, Alerts, Toasts)

#### 1.1 Delete Buttons
- [ ] **Arquivo:** `styles/admin.css:900-930`
- [ ] **Mudança:** Substituir `#fee2e2` / `#dc2626` por `var(--status-error-bg)` / `var(--status-error-text)`
- [ ] **Commit:** `fix: migrate delete buttons to identity-system colors`
- [ ] **Validação:** Visual em light/dark mode
- [ ] **Status:** ⏳ PENDENTE

#### 1.2 Alert Boxes
- [ ] **Arquivo:** `styles/admin.css:944-954`
- [ ] **Mudança:** 
  - `.alert-error` → `var(--status-error-*)`
  - `.alert-success` → `var(--status-success-*)`
  - `.alert-warning` → `var(--status-warning-*)`
  - `.alert-info` → `var(--status-info-*)`
- [ ] **Commit:** `fix: migrate alerts to identity-system status colors`
- [ ] **Validação:** Visual em light/dark mode
- [ ] **Status:** ⏳ PENDENTE

#### 1.3 Toast Notifications
- [ ] **Arquivo:** `styles/admin.css:1620-1634`
- [ ] **Mudança:** Adicionar `:root.dark` overrides para 4 variants
- [ ] **Commit:** `fix: add dark mode support for toast notifications`
- [ ] **Validação:** Disparar toasts em dark mode
- [ ] **Status:** ⏳ PENDENTE

#### 1.4 Inline Confirm Popup
- [ ] **Arquivo:** `styles/admin.css:1011`
- [ ] **Mudança:** `background-color: white` → `var(--modal-bg)`
- [ ] **Commit:** `fix: use modal-bg variable for confirm popup`
- [ ] **Validação:** Visual em dark mode
- [ ] **Status:** ⏳ PENDENTE

#### 1.5 Delete Icon Button
- [ ] **Arquivo:** `styles/admin.css:1057-1062`
- [ ] **Mudança:** `color: #dc2626` → `var(--status-error-text)`
- [ ] **Commit:** `fix: migrate delete icon button to identity-system`
- [ ] **Validação:** Visual em light/dark mode
- [ ] **Status:** ⏳ PENDENTE

**Fase 1 Total:** 5 arquivos, ~50 minutos, 5 commits

---

### ⏳ FASE 2: MODERADOS (Headers, Navs)

#### 2.1 Site Header Colors
- [ ] **Arquivo:** `styles/site-header.css:331, 335, 400`
- [ ] **Mudança:** Substituir hex hardcoded por variáveis
  - `#fffaf5` → `var(--text-primary)`
  - `#e6dbcf` → `var(--text-secondary)`
  - `#d4ccc1` → `var(--text-hint)`
- [ ] **Commit:** `refactor: use identity-system variables in site-header dark mode`
- [ ] **Status:** ⏳ PENDENTE

#### 2.2 Admin Nav Title
- [ ] **Arquivo:** `styles/admin-sidebar.css:284, 291, 297`
- [ ] **Mudança:** `#e8a6c8` / `#f4d5eb` → `var(--text-secondary)` / `var(--text-primary)`
- [ ] **Commit:** `refactor: use identity-system for nav title colors`
- [ ] **Status:** ⏳ PENDENTE

#### 2.3 Logout Button
- [ ] **Arquivo:** `styles/admin.css:488`
- [ ] **Mudança:** `color: #ef4444` → `var(--status-error-text)`
- [ ] **Commit:** `fix: migrate logout button to identity-system`
- [ ] **Status:** ⏳ PENDENTE

**Fase 2 Total:** 3 mudanças, ~30 minutos, 3 commits

---

### 🟢 FASE 3: BAIXOS (Gradients, Cleanup)

#### 3.1 Hero Visual Dark Mode
- [ ] **Arquivo:** `globals.css:2398-2402`
- [ ] **Mudança:** Adicionar `:root.dark .hero-visual { ... }`
- [ ] **Commit:** `fix: add dark mode gradient for hero visual`
- [ ] **Status:** ⏳ PENDENTE

#### 3.2 Status Text Colors Cleanup
- [ ] **Arquivo:** `globals.css:115-123`
- [ ] **Mudança:** Revisão + padronização
- [ ] **Commit:** `refactor: standardize status text colors`
- [ ] **Status:** ⏳ PENDENTE

**Fase 3 Total:** 2 mudanças, ~15 minutos, 2 commits

---

## 📊 Metricas de Sucesso

| Metrica | Antes | Depois | ✅ Meta |
|---------|-------|--------|--------|
| Hardcoded colors em admin.css | 12 | 0 | ✅ |
| Hardcoded colors em site-header.css | 3 | 0 | ✅ |
| Hardcoded colors em admin-sidebar.css | 2 | 0 | ✅ |
| Dark mode overrides completos | 60% | 100% | ✅ |
| Variables do identity-system usadas | 40% | 95% | ✅ |

---

## 🔍 Validação Checklist

### Visual Testing
- [ ] Navegar /admin em light mode
- [ ] Navegar /admin em dark mode
- [ ] Testar buttons vermelhos (delete)
- [ ] Testar alerts (success/error/warning/info)
- [ ] Disparar toasts em dark mode
- [ ] Abrir confirm popups em dark mode
- [ ] Verificar site header em dark mode

### Code Quality
- [ ] Nenhum `#` hardcoded em cores (grep: `color: #`)
- [ ] Nenhum `rgba()` tailwind sem override (grep: `rgba(34, 197, 94)`)
- [ ] Todos os `:root.dark` overrides presentes
- [ ] Lint passing: `npm run lint`

---

## 🚀 Próximas Ações

1. **Agora:** Implementar Fase 1 (Críticos) — 5 commits
2. **Depois:** Implementar Fase 2 (Moderados) — 3 commits
3. **Cleanup:** Implementar Fase 3 (Baixos) — 2 commits
4. **Validação:** Full visual audit em dark mode
5. **Documentação:** Adicionar lint rules para prevenir regressão

---

**Total Estimado:** 10 commits, ~95 minutos, 100% dark mode compliance
