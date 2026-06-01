# UI/UX Audit Report — GEEF ERP
**Data:** 2026-05-31  
**Auditor:** Claude UI/UX Skill  
**Status:** 9 findings (3 críticos, 3 médios, 3 baixos)

---

## 🔴 CRÍTICOS (2.5 horas)

### 1. Inline Styles em 6+ Componentes (Design System Breach)
**Arquivos:** 
- `components/admin/instituicao/documentos-form.tsx` (6 inline styles)
- `components/admin/instituicao/endereco-form.tsx` (4 inline styles)
- `components/admin/instituicao/missao-valores-form.tsx` (3 inline styles)
- `components/brand-logo-disclosure.tsx`
- `components/musicas/musica-reader.tsx`

**Problema:**
```tsx
// ❌ ERRADO
<p style={{ fontWeight: 600 }}>Texto</p>
<div style={{ marginBottom: '1.5rem' }}>
<label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
```

**Impacto:** Difícil manter em dark mode, inconsistente com design system
**Esforço:** 2h — Criar 3-4 classes utilitárias + refatorar componentes
**WCAG:** Não viola, mas quebra manutenibilidade

---

### 2. Remove `outline: none` Sem Fallback Focus Visible
**Arquivos:** `styles/admin.css` (2x), `styles/globals.css` (10+x)  
**Linhas:** admin.css:651, globals.css:497, 517, 2046, 2099, 2190, 2208

**Problema:**
```css
/* ❌ WCAG 2.4.7 VIOLATION */
.element:focus-visible {
  outline: none;  /* Remove indicador de foco — usuários com teclado não veem */
}
```

**Impacto:** WCAG 2.4.7 Failure — acessibilidade crítica para navegação via teclado
**Esforço:** 1h — Adicionar `box-shadow` fallback ou `outline: 2px solid var(--focus-outline)`
**Reparação rápida:**
```css
/* ✅ CORRETO */
.element:focus-visible {
  outline: 2px solid var(--focus-outline);
  box-shadow: 0 0 0 4px var(--focus-ring);
}
```

---

### 3. Alt Text Vazio na Logo (WCAG 1.1.1)
**Arquivo:** `components/site-header.tsx:30`

**Problema:**
```tsx
<Image
  src="/brand/logo-oficial-transparent.png"
  alt=""  // ❌ Logo é conteúdo, não decorativo
  width={360}
  height={156}
/>
```

**Impacto:** WCAG 1.1.1 Non-text Content — screen readers ignoram logo
**Esforço:** 15 minutos — Mudar para `alt="GEEF"`
**Reparação:**
```tsx
<Image
  src="/brand/logo-oficial-transparent.png"
  alt="GEEF - Grupo de Estudos Espíritas de Franquia"
  width={360}
  height={156}
/>
```

---

## 🟡 MÉDIOS (6 horas)

### 4. Inconsistência de Media Query Breakpoints
**Encontrado:** 7 diferentes breakpoints
- 640px (5 queries)
- 768px (4 queries)
- 900px, 960px, 1024px, 1100px, 1200px, 820px (scattered)

**Problema:** Sem padronização → difícil manter, "junk" responsividade
**Impacto:** Médio (funciona, mas fragmentado)
**Esforço:** 3h — Consolidar em 3-4 breakpoints padrão (640, 768, 1024, 1400)

---

### 5. Spacing Inconsistente (px vs rem vs clamp)
**Encontrado:** 20+ classe com margin/padding hardcoded

**Problema:**
```css
/* Sem escala clara */
.card { margin-bottom: 1.5rem; }
.section { margin-bottom: 0.75rem; }
.group { gap: 1rem; }
.wrapper { padding: 0.5rem; }
```

**Impacto:** Difícil manter visual depois de dark mode, refatorar cada ajuste
**Esforço:** 2h — Criar `--spacing-xs/sm/md/lg` variáveis CSS

---

### 6. Backdrop-filter Sem Fallback @supports
**Arquivos:** admin.css, site-header.css, globals.css

**Problema:**
```css
.header {
  backdrop-filter: blur(16px);  /* Firefox parcial, navegadores antigos falham */
}
```

**Impacto:** Baixo-médio (visual degradation em Firefox)
**Esforço:** 1h — Adicionar `@supports` query

---

## 🟢 BAIXOS (2 horas)

### 7. Focus Outline Contrast em Dark Mode
**Arquivo:** `styles/admin.css:1150-1156`
**Status:** Parcialmente remedied com `box-shadow`, mas validar contraste
**Esforço:** 1h — Validar `--input-focus-ring` em dark mode; se <3:1, adicionar fallback

---

### 8. Spacing Hardcoded em Formulários
**Arquivo:** `components/admin/instituicao/missao-valores-form.tsx:94-95`
**Problema:** Inline `marginBottom: '1.5rem'` × `.form-group { margin-bottom: ... }` = acúmulo
**Esforço:** 30m — Usar `.form-group` class em vez de inline

---

### 9. Emojis Como Ícones (Acessibilidade Semântica)
**Exemplo:** `components/admin/admin-sidebar.tsx`
```tsx
<Link href="/admin/painel">
  📊 Painel  {/* Screen reader não sabe que é dashboard */}
</Link>
```

**Impacto:** WCAG 1.1.1 (baixo-médio, label presente)
**Esforço:** 1h — Adicionar `aria-label="Painel de controle (dashboard)"`

---

## 📊 Quick Wins Summary

| # | Finding | Prioridade | Esforço | Impacto | WCAG | Status |
|---|---------|-----------|--------|--------|------|--------|
| 1 | Inline styles | CRÍTICO | 2h | Manutenção | N/A | ⏳ PENDENTE |
| 2 | Outline: none | CRÍTICO | 1h | Acessibilidade | 2.4.7 | ⏳ PENDENTE |
| 3 | Alt="" vazio | CRÍTICO | 15m | Acessibilidade | 1.1.1 | ⏳ PENDENTE |
| 4 | Breakpoints | MÉDIO | 3h | Manutenção | N/A | ⏳ PENDENTE |
| 5 | Spacing vars | MÉDIO | 2h | Consistência | N/A | ⏳ PENDENTE |
| 6 | Backdrop-filter | MÉDIO | 1h | Fallback visual | N/A | ⏳ PENDENTE |
| 7 | Focus contrast | MÉDIO | 1h | Acessibilidade | 2.4.7 | 🔄 PARTIAL |
| 8 | Form spacing | BAIXO | 30m | Manutenção | N/A | ⏳ PENDENTE |
| 9 | Emoji labels | BAIXO | 1h | Acessibilidade | 1.1.1 | ⏳ PENDENTE |

**Total:** ~12 horas (críticos: 2.5h, médios: 6h, baixos: 3.5h)

---

## 🎯 Recomendações

### Fase 1 — WCAG Compliance (2.5 horas) ⭐ RECOMENDADO
1. Alt text vazio (15m)
2. Outline: none fallback (1h)
3. Inline styles refactor (1h)

**Resultado:** 100% WCAG 2.1 AA compliance em componentes críticos

### Fase 2 — Design System Consolidation (6 horas) [Depois]
4. Spacing variables (2h)
5. Breakpoints padronizados (3h)
6. Backdrop-filter fallback (1h)

### Fase 3 — Polish (3.5 horas) [Futuro]
7-9: Focus validation, form spacing, emoji labels

---

## 📝 Próximos Passos

- [ ] Implementar Fase 1 (WCAG Compliance) — 2.5h
- [ ] Fase 2 (Design System) — 6h
- [ ] Fase 3 (Polish) — 3.5h
- [ ] Re-audit com ui-ux-pro-max-skill (se instalada)

---

**Observação:** Dark mode remediation (2026-05-31) foi completo. Esta auditoria complementa focando em acessibilidade (WCAG) e design system consolidation.
