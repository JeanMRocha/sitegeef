# 📋 HANDOFF — Próximas Oportunidades & Como Proceder

**Data:** 2026-05-31  
**Status:** Phase 1-3 + Lint Rules COMPLETO (9/9 findings)  
**Próximo:** 4 oportunidades documentadas abaixo

---

## 🎯 RESUMO EXECUTIVO

Este documento detalha **4 oportunidades de continuação** que um Codex/agente pode executar:

1. **WCAG AAA Compliance Audit** (3-4h) — Use ui-ux-pro-max-skill
2. **Expand Design System to Public Pages** (2-3h) — Design system coverage
3. **Mobile Responsiveness Polish** (2-3h) — Responsive validation
4. **Performance Audit** (2-3h) — Lighthouse + Core Web Vitals

Cada uma tem:
- ✅ Escopo bem definido
- ✅ Arquivos a modificar (especificados)
- ✅ Padrões a seguir (com exemplos)
- ✅ Checklist de implementação
- ✅ Como invocar skills necessárias
- ✅ Como validar

---

## 🚀 OPORTUNIDADE 1: WCAG AAA Compliance Audit

### Objetivo
Auditar e implementar WCAG 2.1 AAA (nível máximo) em lugar de AA atual.

### Diferenças AA → AAA
```
WCAG 2.1 AA (atual):
- Color contrast: 4.5:1 (texto normal)
- Keyboard navigation: Tab, Enter, Space
- Alt text: Descritivo (1.1.1)
- Focus visible: 2px outline (2.4.7)

WCAG 2.1 AAA (target):
- Color contrast: 7:1 (texto normal) ← Mais rigoroso
- Keyboard navigation: + arrow keys, Escape, etc
- Alt text: Muito descritivo + context
- Focus visible: 3px outline + high contrast
- Reflow: Texto em 200% sem perda
- Animation: Respeitar prefers-reduced-motion
```

### Como Executar

**Passo 1: Invocar ui-ux-pro-max-skill**
```bash
# Lê current state e faz audit
/ui-ux-pro-max-skill

# Prompt para a skill:
"Audit WCAG 2.1 AAA compliance for GEEF ERP admin pages and public pages.
Focus on:
1. Color contrast ratios (7:1 minimum for normal text)
2. Focus indicators visibility and contrast
3. Keyboard navigation completeness (arrow keys, Escape, Tab order)
4. Motion/animation accessibility (respect prefers-reduced-motion)
5. Text reflow at 200% zoom without loss
6. Screen reader testing recommendations

Design system context:
- Breakpoints: var(--bp-mobile/tablet/desktop/wide)
- Colors: identity-system.css (light/dark mode)
- Focus colors: --focus-outline (light: #8a005a, dark: #e08ac4)
- Current contrast ratio: 4.5:1 (AA) → Target: 7:1 (AAA)

Output: Detailed findings with file:line references and fix patterns"
```

**Passo 2: Implementar Fixes Identificados**

**Tipo 1: Color Contrast (Cores hardcoded)**
```css
/* Exemplo: Current (AA) */
.some-element {
  color: #63586f;  /* Muted color - 4.5:1 contrast */
  background: white;
}

/* Fix (AAA) */
.some-element {
  color: #3d3846;  /* Darker muted - 7:1 contrast */
  background: white;
}
```

Arquivos a revisar:
- `styles/identity-system.css` — Adicionar variáveis AAA para todas as cores
- `styles/globals.css` — Revisar colors em todos os seletores
- `styles/admin.css` — Revisar colors em componentes admin

**Tipo 2: Focus Indicators (Visibilidade)**
```css
/* Exemplo: Melhorar focus indicator */
/* Antes */
:focus-visible {
  outline: 2px solid var(--focus-outline);
  box-shadow: 0 0 0 4px var(--focus-ring);
}

/* Depois (AAA) */
:focus-visible {
  outline: 3px solid var(--focus-outline);  /* 3px vs 2px */
  box-shadow: 0 0 0 4px var(--focus-ring), 
              inset 0 0 0 1px var(--focus-outline);  /* Inner ring */
}
```

**Tipo 3: Motion/Animation (prefers-reduced-motion)**
```css
/* Exemplo: Adicionar fallback */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Passo 3: Validação com Screen Reader**
```bash
# Instalar NVDA (Windows) ou usar built-in VoiceOver (Mac)
# Testar:
1. Home page — Can you navigate without mouse?
2. Admin modules — Are buttons and inputs announced correctly?
3. Forms — Are required fields announced?
4. Modals — Focus trapped inside?
```

**Passo 4: Validação de Zoom**
```bash
# Browser DevTools → Device Toolbar
1. Zoom to 200%
2. Scroll horizontally? (Should not if proper reflow)
3. All content visible?
4. Focus visible at 200%?
```

### Checklist de Implementação
- [ ] Run ui-ux-pro-max-skill, collect findings
- [ ] Identify all colors that need darker variants (7:1)
- [ ] Update identity-system.css with AAA color variables
- [ ] Update focus indicators (3px outline)
- [ ] Add prefers-reduced-motion rules
- [ ] Add reflow testing (200% zoom)
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] `npm run type-check && npm run lint && npm run build`
- [ ] Commit: "feat: WCAG 2.1 AAA compliance audit and fixes"

### Files to Modify
- `styles/identity-system.css` — Add AAA color variants
- `styles/globals.css` — Update focus indicators + motion rules
- `styles/admin.css` — Update focus indicators + motion rules
- `styles/utilities.css` — Update .form-input-styled:focus

### Validation Commands
```bash
npm run lint:design-system  # Should still pass
npm run build               # Should succeed
npm run type-check          # 0 errors expected
```

---

## 🎨 OPORTUNIDADE 2: Expand Design System to Public Pages

### Objetivo
Aplicar o design system (colors, spacing, breakpoints, utilities) aos componentes públicos, não só admin.

### Componentes Públicos a Refatorar
```
app/page.tsx                 # Home page (public)
app/escalas/page.tsx         # Scheduling (public)
app/leitor/page.tsx          # Music reader (public)
app/login/page.tsx           # Login page
app/institucional/           # Institutional pages
  └─ index.tsx
  └─ [slug]/page.tsx
app/[slug]/page.tsx          # Dynamic public pages
```

### Padrão: Aplicar Design System

**Exemplo 1: Home Page — Spacing**
```tsx
/* Before */
<div style={{marginBottom: "2rem"}}>
  <h1 style={{marginBottom: "1rem"}}>Welcome</h1>
</div>

/* After */
<div className="spacing-xl">
  <h1 className="spacing-md">Welcome</h1>
</div>
```

**Exemplo 2: Login Form — Utilities**
```tsx
/* Before */
<div style={{display: "flex", gap: "1rem"}}>
  <button>Sign In</button>
</div>

/* After */
<div className="flex-center-gap">
  <button>Sign In</button>
</div>
```

**Exemplo 3: Colors — Design Variables**
```tsx
/* Before */
<header style={{background: "#f7f2fb"}}>

/* After */
<header style={{background: "var(--surface-primary)"}}>
  or use CSS class
```

### How to Execute

**Passo 1: Audit Public Pages**
```bash
# Grep for inline styles in public pages
grep -rn "style={{" app/page.tsx app/escalas app/leitor app/login app/institucional

# Grep for hardcoded colors
grep -rn "#[0-9a-fA-F]" app/page.tsx app/escalas app/leitor app/login
```

**Passo 2: Refactor Each Page**
```bash
# Process in order:
1. app/page.tsx          (Home)
2. app/login/page.tsx    (Login)
3. app/escalas/page.tsx  (Scheduling)
4. app/leitor/page.tsx   (Music reader)
5. app/institucional/*   (Institutional)
```

**Passo 3: Apply Design System**

For each file:
1. Replace `style={{}}` with `.form-field-label`, `.flex-center`, etc
2. Replace inline colors with `var(--surface-primary)`, `var(--text)`, etc
3. Replace inline spacing with `var(--spacing-*)` or `.spacing-lg` classes
4. Ensure responsive: use `var(--bp-*)` in media queries

**Passo 4: Test Responsiveness**
```bash
npm run dev
# Open each page at breakpoints: 640, 768, 960, 1200px
# Check light and dark mode
```

### Files to Create/Modify
- `app/page.tsx` — Refactor home
- `app/login/page.tsx` — Refactor login
- `app/escalas/page.tsx` — Refactor scheduling
- `app/leitor/page.tsx` — Refactor music reader
- `app/institucional/[slug]/page.tsx` — Refactor institutional
- `styles/utilities.css` — May add new utilities (e.g., `.hero-section`, `.card-public`)

### Checklist
- [ ] Audit all public pages for inline styles
- [ ] Create list of classes/utilities needed
- [ ] Refactor app/page.tsx
- [ ] Refactor app/login/page.tsx
- [ ] Refactor app/escalas/page.tsx
- [ ] Refactor app/leitor/page.tsx
- [ ] Refactor app/institucional/*
- [ ] Test responsive at 640, 768, 960, 1200px
- [ ] Test dark mode
- [ ] `npm run type-check && npm run lint && npm run build`
- [ ] Commit per page: "refactor: apply design system to [page name]"

### Validation
```bash
npm run lint:design-system  # Should show 0 hardcoded colors in public pages
npm run build               # Should succeed
```

---

## 📱 OPORTUNIDADE 3: Mobile Responsiveness Polish

### Objetivo
Validar e otimizar responsiveness em devices reais (não só DevTools emulation).

### Como Executar

**Passo 1: Setup Testing Environment**
```bash
npm run dev  # Start on localhost:3500

# Option 1: Local devices
# Open on phone/tablet via: http://<your-ip>:3500

# Option 2: Browser DevTools
# Device Toolbar: Ctrl+Shift+M (Chrome/Firefox)
```

**Passo 2: Test Checklist**

**Breakpoint: 640px (Mobile XS)**
- [ ] Sidebar collapses/hides
- [ ] Forms are single column
- [ ] Buttons are touch-friendly (min 44px height)
- [ ] Text readable without zoom
- [ ] No horizontal scroll

**Breakpoint: 768px (Tablet SM)**
- [ ] Two-column layouts work
- [ ] Tables scroll horizontally if needed
- [ ] Navigation: hamburger or sidebar?

**Breakpoint: 960px (Desktop MD)**
- [ ] Three-column layouts possible
- [ ] Sidebar visible (if admin)
- [ ] Full horizontal space used

**Breakpoint: 1200px (Wide LG)**
- [ ] Max-width applied to prevent content stretching
- [ ] Sidebar + content balanced

**Pages to Test**
- [ ] Home page (`/`)
- [ ] Admin dashboard (`/admin/painel`)
- [ ] Modules: pessoas, financeiro, escalas, etc
- [ ] Public pages: escalas, leitor, institucional

**Specific Tests**
- [ ] Touch targets are 44x44px minimum
- [ ] Form inputs don't auto-zoom on mobile
- [ ] Images scale properly
- [ ] Dark mode works on all screen sizes
- [ ] No layout shift on page load (CLS)

**Passo 3: Document Issues**

If issues found:
```markdown
**Issue:** [Module name] layout broken at 768px

Location: [file:line]
Reproduction: 1. Open page, 2. Resize to 768px, 3. Observe [issue]

Current: [css or behavior]
Expected: [what should happen]

Suggested fix: [modify @media query, adjust class, etc]
```

**Passo 4: Implement Fixes**

Example fix:
```css
/* Before */
.module-grid {
  grid-template-columns: repeat(3, 1fr);
}

/* After */
.module-grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: var(--bp-desktop)) {
  .module-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: var(--bp-tablet)) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}
```

### Checklist
- [ ] Setup dev server
- [ ] Test home page at all breakpoints
- [ ] Test admin pages at all breakpoints
- [ ] Test public pages at all breakpoints
- [ ] Document all issues found
- [ ] Implement fixes per issue
- [ ] Re-test after fixes
- [ ] Test on real device (if possible)
- [ ] `npm run build`
- [ ] Commit: "fix: improve mobile responsiveness for [pages]"

### Validation
```bash
npm run build       # Should pass
npm run type-check  # 0 errors
# Browser: Open DevTools, test at breakpoints
```

---

## ⚡ OPORTUNIDADE 4: Performance Audit

### Objetivo
Otimizar performance usando Lighthouse e Core Web Vitals.

### Métricas a Validar

**Lighthouse (Google)**
- Performance: Target 90+
- Accessibility: Target 95+ (com AAA compliance)
- Best Practices: Target 90+
- SEO: Target 95+

**Core Web Vitals**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Como Executar

**Passo 1: Build Production**
```bash
npm run build
npm run start  # Or: node .next/standalone/server.js
```

**Passo 2: Run Lighthouse**
```bash
# Using Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Review report

# Or using CLI
npx lighthouse http://localhost:3000/admin/painel --view
```

**Passo 3: Document Findings**

Create file: `docs/PERFORMANCE_AUDIT_2026-05-31.md`
```markdown
# Performance Audit Results

## Pages Tested
- Home: /
- Admin Dashboard: /admin/painel
- Modules: /admin/pessoas, /admin/financeiro, etc

## Results

### Page: Home
Lighthouse:
- Performance: 78 (target: 90)
- Accessibility: 92
- Best Practices: 88
- SEO: 95

Core Web Vitals:
- LCP: 2.8s (target: < 2.5s)
- FID: 120ms (target: < 100ms)
- CLS: 0.08 (target: < 0.1)

## Issues Found
1. LCP too high: Large images not optimized
2. FID high: JavaScript blocking render
3. ...

## Recommended Fixes
1. Optimize images: Convert to WebP, lazy load
2. Code splitting: Split large bundles
3. ...
```

**Passo 4: Implement High-Impact Fixes**

Example fixes:
```tsx
/* Fix 1: Image optimization */
// Before
<img src="/logo.png" />

// After
<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
  priority={true}  // For above-fold images
/>

/* Fix 2: Code splitting */
// Before
import HeavyComponent from "./heavy"

// After
const HeavyComponent = dynamic(() => import("./heavy"), {
  loading: () => <Spinner />,
})
```

### Checklist
- [ ] Build production version
- [ ] Run Lighthouse on home page
- [ ] Run Lighthouse on admin dashboard
- [ ] Run Lighthouse on 3-4 modules
- [ ] Document all findings in PERFORMANCE_AUDIT file
- [ ] Identify high-impact fixes
- [ ] Implement image optimization
- [ ] Implement code splitting if needed
- [ ] Re-run Lighthouse
- [ ] Verify Core Web Vitals < targets
- [ ] `npm run build`
- [ ] Commit: "perf: optimize Lighthouse scores and Core Web Vitals"

---

## 📊 COMPARISON: Which to Pick?

| Oportunidade | Time | Impact | Difficulty | Skill Used | Start With |
|---|---|---|---|---|---|
| WCAG AAA | 3-4h | 🟢 High (accessibility) | Medium | ui-ux-pro-max | ⭐⭐⭐ RECOMMENDED |
| Public Pages Design System | 2-3h | 🟢 High (consistency) | Medium | None (manual) | ⭐⭐ Good |
| Mobile Responsiveness | 2-3h | 🟠 Medium | Low | None (testing) | ⭐ Start if time |
| Performance Audit | 2-3h | 🟠 Medium | Low-Medium | None (Lighthouse) | ⭐ Start if time |

---

## 🎯 RECOMMENDED SEQUENCE

### If 1 hour left:
→ Nothing (Phase 1-3 complete, ship ready)

### If 3-4 hours:
→ **WCAG AAA Compliance** (use ui-ux-pro-max-skill)

### If 6-7 hours:
→ **WCAG AAA** + **Design System to Public Pages**

### If 10+ hours:
→ **All 4** in sequence: AAA → Public Design → Mobile → Performance

---

## 🔗 HOW TO START

### If choosing WCAG AAA:
```bash
# 1. Read this section above
# 2. Invoke skill
/ui-ux-pro-max-skill

# 3. Implement fixes from skill output
# 4. Test with screen reader
# 5. Commit and done
```

### If choosing Public Pages:
```bash
# 1. Read "Expand Design System" section above
# 2. Audit: grep -rn "style={{" app/
# 3. Refactor each page using patterns
# 4. Test responsive
# 5. Commit
```

### If choosing Mobile:
```bash
# 1. npm run dev
# 2. Follow "Test Checklist" above
# 3. Document issues
# 4. Implement fixes
# 5. Commit
```

### If choosing Performance:
```bash
# 1. npm run build && npm run start
# 2. Open Chrome DevTools → Lighthouse
# 3. Document findings
# 4. Implement fixes
# 5. Commit
```

---

## ✅ COMPLETION CRITERIA

Session is complete when:
- [ ] All 14 Phase 1-3 commits present
- [ ] One of the 4 opportunities chosen and documented
- [ ] (Optional) That opportunity started or completed
- [ ] All validation commands pass
- [ ] Guides updated with next steps
- [ ] Ready for handoff to next session

---

## 📞 IF STUCK

1. Read this file (HANDOFF.md) for detailed instructions
2. Read AGENT_GUIDE.md for technical patterns
3. Read CONTINUATION_GUIDE.md for user-friendly overview
4. Run `npm run skills:search` for design system knowledge
5. Check CLAUDE.md for project rules

---

**Last Updated:** 2026-05-31  
**Status:** ✅ Phase 1-3 COMPLETE + 4 opportunities documented  
**Next:** Choose and execute one opportunity from above
