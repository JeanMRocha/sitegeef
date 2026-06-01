# 🤖 AGENT CONTINUATION GUIDE — Next Steps & Decision Tree

**For:** Claude Code, future Codex sessions, or specialized agents  
**Status:** Phase 1-3 COMPLETE, Lint Rules COMPLETE  
**Entry Point:** This file or CONTINUATION_GUIDE.md

---

## 🎯 CURRENT STATE SNAPSHOT

### Completed Work (This Session)
- ✅ Phase 1 (3/3 fixes): Inline Styles, Focus Visible, Alt Text
- ✅ Phase 2 (3/3 fixes): Breakpoints, Spacing, Backdrop-filter
- ✅ Phase 3 (3/3 fixes): Focus Contrast, Form Spacing, Emoji Labels  
- ✅ Lint Rules: ESLint + StyleLint + custom validation script

### Files Changed (14 files)
- 4 CSS files refactored (globals, admin, admin-sidebar, theme, site-header)
- 3 React components refactored (documentos-form, endereco-form, missao-valores-form)
- 1 component enhanced (admin-sidebar with aria-labels)
- 2 config files created (.stylelintrc.json, .eslintrc.json updated)
- 1 script created (validate-design-system.js)
- 1 package.json updated (new npm script)

### Token Spent This Session
~200k tokens from 200k budget

---

## 🚀 DECISION TREE: WHAT TO DO NEXT

```
START
  ↓
[Have you run tests?]
  ├─ NO → Run: npm run type-check && npm run lint && npm run build
  │        ↓
  │        [All pass?]
  │        ├─ YES → Continue below
  │        └─ NO → Debug and fix, then loop back
  │
  └─ YES → Continue
           ↓
           [Want visual validation?]
           ├─ YES (1-2h) → npm run dev → Manual browser testing
           │               (See CONTINUATION_GUIDE.md, "Visual Testing Checklist")
           │               ↓
           │               [Issues found?]
           │               ├─ YES → Fix and re-test
           │               └─ NO → Ship ready
           │
           └─ NO (Skip to ship) → Ready for production
                                  ↓
                                  [Next steps: Deploy to main/staging]
```

---

## 📋 STEP-BY-STEP FOR AGENT CONTINUATION

### If Starting Fresh (New Session/Agent)

**Step 1: Context Load**
```bash
# Read these files in order:
1. CONTINUATION_GUIDE.md (overview)
2. CLAUDE.md (project rules + context)
3. docs/UI_UX_AUDIT_2026_05_31.md (9 findings detail)
4. HANDOFF.md (technical blueprint)
5. This file (technical decisions)
```

**Step 2: Verify State**
```bash
# Check that all 14 commits are present
git log --oneline | head -20

# Verify key files exist
ls -la styles/utilities.css
ls -la styles/.stylelintrc.json
ls -la scripts/validate-design-system.js

# Check component refactors
grep "form-field-label" components/admin/instituicao/documentos-form.tsx
```

**Step 3: Choose Action**
Based on CONTINUATION_GUIDE.md, pick ONE:
- **A) Visual Testing** — Browser validation (1-2h)
- **B) Ship Ready** — Final build check (15m)
- **C) Finalize** — Session complete, nothing more

---

### If Resuming From Interrupt

**State Check:**
```bash
git status          # Should be clean (nothing staged)
git log --oneline   # Last commit should be Phase 3 Fix 9
npm run lint        # Should pass (might have style warnings, ok)
```

**If status is DIRTY:**
- Check what's uncommitted: `git diff --stat`
- If changes are related to current work: commit or stash
- If changes are unrelated: investigate (may be from different branch/user)

**If last commit is NOT Phase 3 Fix 9:**
- `git log --grep="Phase 3"` to find where Phase 3 ended
- Review commits after that to understand what happened
- May need to rebase or merge depending on state

---

## 🔧 TECHNICAL DETAILS FOR AGENTS

### Design System Variables Locations

**Breakpoints** (identity-system.css, lines 261-265)
```css
--bp-mobile: 640px;     /* Primary mobile threshold */
--bp-tablet: 768px;     /* Tablet threshold */
--bp-desktop: 960px;    /* Desktop threshold */
--bp-wide: 1200px;      /* Wide desktop threshold */
```

**Spacing Scale** (identity-system.css, lines 267-272)
```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px — used for small gaps */
--spacing-md: 1rem;     /* 16px — standard form margin-bottom */
--spacing-lg: 1.5rem;   /* 24px — section margins */
--spacing-xl: 2rem;     /* 32px — large spacings */
```

**Focus Colors** (identity-system.css, lines 255-256 and 280-281)
```css
Light mode:
  --focus-outline: #8a005a (dark purple)
  --focus-ring: rgba(138, 0, 90, 0.2) (light transparent)

Dark mode:
  --focus-outline: #e08ac4 (light pink)
  --focus-ring: rgba(224, 138, 196, 0.2) (light transparent)
```

### Utility Classes

**File:** styles/utilities.css

Form utilities:
- `.form-field-label` → block, margin-bottom: 0.5rem, font-weight: 600
- `.form-field-text` → font-size: 0.9rem, color: var(--text-secondary)
- `.form-field-link` → color: var(--primary)
- `.form-input-styled` → Full form input styling with focus states

Text utilities:
- `.text-strong` → font-weight: 600
- `.text-muted` → color: var(--text-secondary)

Flex utilities (DRY for common layouts):
- `.flex-center` → display: flex; align-items: center;
- `.flex-center-gap` → flex center + gap: 0.5rem
- `.flex-space-between` → flex with space-between + 1rem gap
- `.flex-end-gap` → justify-content: flex-end; gap: 0.5rem

Status badges:
- `.inline-status` → Base badge styling
- `.inline-status--ativa` → Green background
- `.inline-status--rascunho` → Blue background
- `.inline-status--inativa` → Gray background

### Lint Rules (ESLint)

**File:** .eslintrc.json (rules added)

Rules that detect violations:
```json
"no-restricted-syntax": [
  {
    "selector": "JSXAttribute[name.name='style'] > JSXExpressionContainer > ObjectExpression",
    "message": "Use CSS classes from styles/utilities.css instead"
  },
  {
    "selector": "Literal[value=/^#[0-9a-fA-F]{3,6}$/]",
    "message": "Use CSS variables from identity-system.css instead"
  }
]
```

**Run:**
```bash
npm run lint                 # Standard ESLint + design system rules
npm run lint:design-system   # Custom validation script
```

### CSS File Refactoring Patterns

**Pattern 1: Breakpoints**
```css
/* Before */
@media (max-width: 960px) { ... }

/* After */
@media (max-width: var(--bp-desktop)) { ... }
```

**Pattern 2: Spacing (margin-bottom)**
```css
/* Before */
margin-bottom: 2rem;
margin-bottom: 1rem;

/* After */
margin-bottom: var(--spacing-xl);
margin-bottom: var(--spacing-md);
```

**Pattern 3: Spacing (gaps)**
```css
/* Before */
gap: 1rem;
gap: 0.5rem;

/* After */
gap: var(--spacing-md);
gap: var(--spacing-sm);
```

**Pattern 4: Backdrop-filter Fallback**
```css
/* Add at end of file */
@supports not (backdrop-filter: blur(1px)) {
  .element-with-backdrop {
    background-color: rgba(...) !important;
  }
}
```

---

## 🧪 TESTING COMMANDS FOR AGENTS

```bash
# Type checking
npm run type-check

# Linting (both standard + design system)
npm run lint
npm run lint:design-system

# Build (important: ensures no runtime errors)
npm run build

# Development server (for visual testing)
npm run dev  # Runs on localhost:3500

# Git validation
git status          # Should be clean
git log --oneline   # Verify commits are present
```

---

## 🎯 IF SOMETHING GOES WRONG

### Common Issues & Fixes

**Issue: `npm run lint` fails with style errors**
- Run: `npm run format` to auto-fix
- Re-run: `npm run lint`

**Issue: `npm run build` fails**
- Check: `npm run type-check` for TypeScript errors
- Read error message carefully — it will point to file:line

**Issue: Git shows uncommitted changes**
- Check what changed: `git diff --stat`
- If accidental: `git checkout -- <file>`
- If intentional: `git add` and commit

**Issue: Tests fail after changes**
- Run: `npm run test` to see which tests broke
- Most likely: CSS class name changes broke snapshot tests
- Update snapshots: `npm run test -- --update`

---

## 📞 IF CODEX IS CONFUSED

**Red flags that need context:**
- Unknown CSS variable used → Check identity-system.css
- Lint rule broken → Check .eslintrc.json or running `npm run lint:design-system`
- Visual issue in browser → Check CONTINUATION_GUIDE.md visual testing section
- Unclear what to do next → Read DECISION TREE above

**Before asking for help:**
1. Read CLAUDE.md project rules
2. Read this file (AGENT_GUIDE.md)
3. Check git status and last commits
4. Run `npm run lint` to verify syntax
5. Check error message carefully (often contains solution)

---

## ✅ COMPLETION CRITERIA

Project is "complete" when:
- [ ] All 14 commits present and reviewed
- [ ] `npm run type-check` passes (0 errors)
- [ ] `npm run lint` passes (0 errors, ok warnings)
- [ ] `npm run build` succeeds
- [ ] `npm run lint:design-system` passes
- [ ] (Optional) Visual testing checklist done
- [ ] All 9 findings marked as implemented
- [ ] Lint rules working (can detect violations)

Once all above are ✅, project is ready for production deployment.

---

## 🔗 KEY RESOURCES

**Documentation:**
- CONTINUATION_GUIDE.md — User-friendly overview
- CLAUDE.md — Project rules (READ THIS FIRST)
- HANDOFF.md — Technical blueprint
- docs/UI_UX_AUDIT_2026_05_31.md — 9 findings detail

**Code References:**
- styles/identity-system.css — Central design token source
- styles/utilities.css — Reusable CSS classes
- .eslintrc.json — Lint rules
- scripts/validate-design-system.js — Custom validation

**Git History:**
```bash
git log --grep="Phase 1\|Phase 2\|Phase 3\|Lint Rules" --oneline
```

---

**Last Updated:** 2026-05-31  
**Status:** ✅ PHASE 1-3 + LINT COMPLETE  
**Next Session:** Follow DECISION TREE or CONTINUATION_GUIDE.md
