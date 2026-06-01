# Dark Mode & Contrast Audit — GEEF ERP
**Data:** 2026-05-31  
**Status:** Auditoria Completa | Implementação em Andamento  
**Responsável:** Claude Code  

---

## 📋 Resumo Executivo

Auditoria completa de dark mode, contraste e conformidade com design system revela:
- **8 Problemas críticos** em buttons, alerts, toasts
- **3 Problemas moderados** em headers e navs
- **2 Problemas baixos** em gradients

**Remediação estimada:** 2-3 horas (críticos + moderados)

---

## 🔴 PROBLEMAS CRÍTICOS (ALTA PRIORIDADE)

### 1. Delete Buttons — Hardcoded Red Colors
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin.css:900-930` |
| Classes | `.delete-btn`, `.delete-btn:hover` |
| Problema | Usa `#fee2e2` (bg) / `#dc2626` (text) — tailwind red, não em identity-system |
| Dark mode | ❌ Nenhum override `:root.dark` |
| Impacto | Botões vermelhos muito claros em dark mode (contraste baixo) |
| Fix | Usar `var(--status-error-bg)`, `var(--status-error-text)` |
| Esforço | ⏱️ 10 min |

**Código atual:**
```css
.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}
```

**Código corrigido:**
```css
.delete-btn {
  background: var(--status-error-bg);
  color: var(--status-error-text);
  border: 1px solid var(--status-error-border);
}

:root.dark .delete-btn {
  /* Variáveis automáticas */
}
```

---

### 2. Alert Boxes — Tailwind Colors Sem Dark Mode
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin.css:944-954` |
| Classes | `.alert-error`, `.alert-success` |
| Problema | Colors hardcoded de tailwind, sem override dark |
| Dark mode | ❌ Nenhum override |
| Impacto | Alertas de sucesso/erro ilegíveis em dark mode |
| Fix | Usar status variables (já existem em identity-system) |
| Esforço | ⏱️ 15 min |

**Problema:**
```css
.alert-error {
  background: #fee2e2;
  color: #dc2626;
}

.alert-success {
  background: #dcfce7;
  color: #16a34a;
}
```

**Solução:**
```css
.alert-error {
  background: var(--status-error-bg);
  color: var(--status-error-text);
}

.alert-success {
  background: var(--status-success-bg);
  color: var(--status-success-text);
}
```

---

### 3. Toast Notifications — 4 Variants Sem Dark Mode
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin.css:1620-1634` |
| Classes | `.toast-success`, `.toast-error`, `.toast-warning`, `.toast-info` |
| Problema | Colors hardcoded em rgba, sem dark override |
| Dark mode | ❌ Nenhum override `:root.dark` |
| Impacto | Notificações com fundo claro em dark mode (contraste adequado mas inconsistente) |
| Fix | Adicionar `:root.dark .toast-item.*` com cores apropriadas |
| Esforço | ⏱️ 20 min |

**Problema:**
```css
.toast-success {
  background: rgba(34, 197, 94, 0.98); /* Verde tailwind */
}

.toast-error {
  background: rgba(239, 68, 68, 0.98); /* Vermelho tailwind */
}

.toast-warning {
  background: rgba(251, 146, 60, 0.98); /* Laranja tailwind */
}

.toast-info {
  background: rgba(59, 130, 246, 0.98); /* Azul tailwind */
}
```

**Solução:**
```css
/* Light mode: manter como está (funcionando) */

/* Dark mode: adicionar novos overrides */
:root.dark .toast-success {
  background: var(--status-success-bg);
  color: var(--status-success-text);
}

:root.dark .toast-error {
  background: var(--status-error-bg);
  color: var(--status-error-text);
}
/* etc... */
```

---

### 4. Inline Confirmation Popup — White Hardcoded
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin.css:1011` |
| Classe | `.inline-confirm-popup` |
| Problema | `background-color: white;` hardcoded sem dark override |
| Dark mode | ❌ Nenhum override |
| Impacto | Popup com texto escuro sobre fundo branco em dark mode |
| Fix | Usar `var(--modal-bg)` |
| Esforço | ⏱️ 5 min |

---

### 5. Delete Icon Button — Red Hardcoded
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin.css:1057-1062` |
| Classe | `.inline-delete-icon-btn` |
| Problema | `color: #dc2626;` (tailwind red) |
| Dark mode | ❌ Sem override |
| Impacto | Botão delete com contraste baixo em dark mode |
| Fix | Usar `var(--status-error-text)` |
| Esforço | ⏱️ 5 min |

---

## 🟡 PROBLEMAS MODERADOS (MÉDIA PRIORIDADE)

### 6. Site Header Colors — Hardcoded em Dark Mode
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/site-header.css:331, 335, 400` |
| Problema | Cores hex hardcoded em `:root.dark` em vez de usar variáveis |
| Exemplo | `:root.dark .site-header-user-details strong { color: #fffaf5; }` |
| Fix | Usar `var(--text-primary)` |
| Esforço | ⏱️ 10 min |

### 7. Admin Nav Title — Custom Colors
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin-sidebar.css:284, 291, 297` |
| Problema | `#e8a6c8`, `#f4d5eb` (não em design system) |
| Fix | Usar `var(--text-secondary)` ou adicionar ao identity-system |
| Esforço | ⏱️ 10 min |

### 8. Logout Button — Red Hardcoded
| Campo | Valor |
|-------|-------|
| Arquivo | `styles/admin.css:488` |
| Problema | `color: #ef4444;` (tailwind) |
| Fix | Usar `var(--status-error-text)` |
| Esforço | ⏱️ 5 min |

---

## 🟢 PROBLEMAS BAIXOS (BAIXA PRIORIDADE)

### 9. Hero Visual — Sem Dark Mode
- **Arquivo**: `globals.css:2398-2402`
- **Fix**: Adicionar `:root.dark .hero-visual` com gradient dark

### 10. Status Text Colors — Inconsistência
- **Arquivo**: `globals.css:115-123`
- **Fix**: Integrar com identity-system (cosmético)

---

## 📊 Resumo por Arquivo

| Arquivo | Problemas | Severidade | Esforço |
|---------|-----------|-----------|---------|
| `admin.css` | 5 críticos + 1 moderado | 🔴🟡 | 50 min |
| `site-header.css` | 1 moderado | 🟡 | 10 min |
| `admin-sidebar.css` | 1 moderado | 🟡 | 10 min |
| `globals.css` | 2 baixos | 🟢 | 15 min |

**Total Estimado:** 85 minutos (críticos + moderados)

---

## ✅ Plano de Ação

### Fase 1: Críticos (1 hora)
- [ ] Delete buttons → `var(--status-error-*)`
- [ ] Alert boxes → `var(--status-*-*)`
- [ ] Toast notifications → adicionar `:root.dark` overrides
- [ ] Inline confirm popup → `var(--modal-bg)`
- [ ] Delete icon button → `var(--status-error-text)`

### Fase 2: Moderados (30 min)
- [ ] Site header colors → variáveis
- [ ] Admin nav title → variáveis
- [ ] Logout button → `var(--status-error-text)`

### Fase 3: Baixos (15 min)
- [ ] Hero visual → adicionar dark gradient
- [ ] Status text colors → revisar

---

## 📝 Notas Técnicas

### Identity System Variables (já existentes)
```css
/* Status colors — já implementados em identity-system.css */
--status-success-bg, --status-success-text
--status-warning-bg, --status-warning-text
--status-error-bg, --status-error-text
--status-info-bg, --status-info-text

/* Modal — já implementado */
--modal-bg, --modal-border, --modal-shadow
```

### Padrão para Migrations
```css
/* ❌ Antes */
.component {
  background: #fee2e2;
  color: #dc2626;
}

/* ✅ Depois */
.component {
  background: var(--status-error-bg);
  color: var(--status-error-text);
}

/* Dark mode automático via identity-system.css */
```

---

## 🎯 Sucesso Esperado
- ✅ 100% dark mode compliance em todos os buttons
- ✅ 100% dark mode compliance em todos os alerts/toasts
- ✅ Design system integrity (sem hardcoded colors)
- ✅ Melhorada manutenibilidade (centralizada em identity-system.css)

---

**Próximo:** Implementação começando com Fase 1 (Críticos)
