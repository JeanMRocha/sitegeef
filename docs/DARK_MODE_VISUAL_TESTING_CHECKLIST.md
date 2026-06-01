# Dark Mode Visual Testing — Checklist

**Dev Server:** http://localhost:3500  
**Status:** Ready for testing (✅ build passed, type-check passed, lint passed)

---

## 📋 Light Mode Testing

Open http://localhost:3500 in browser (light theme enabled).

### Admin Dashboard
- [ ] `/admin/pessoas` — all elements render without contrast issues
- [ ] Delete buttons appear in red with good contrast
- [ ] Alert boxes (success/error) are readable
- [ ] Status chips show correct colors
- [ ] Table rows have proper background colors
- [ ] Input fields have good contrast

### Component Details
- [ ] Site header text readable
- [ ] User menu avatar visible
- [ ] Navigation items have clear active state
- [ ] Button text clearly visible (primary, secondary, tertiary, danger)

### Pages to Check
- `/admin/musicas` — catalog, delete buttons, status chips
- `/admin/pessoas` — person list, delete buttons
- `/admin` — main dashboard
- `/minha-area` — user dashboard
- `/musicas` — public music catalog

---

## 🌙 Dark Mode Testing

Toggle browser to dark mode (check your browser/OS dark mode settings).

### Critical Components
- [ ] **Delete buttons** — Should turn to lighter red (#fca5a5) in dark mode
  - `/admin/pessoas` — check delete icon buttons
  - `/admin/musicas` — check delete buttons in catalog
  
- [ ] **Alert boxes** — Should have good contrast
  - Test success alerts (green in light, light green in dark)
  - Test error alerts (red in light, light red in dark)

- [ ] **Toast notifications** — Should remain readable
  - Trigger an action that shows a toast
  - Verify text is white (good contrast on colored background)

- [ ] **Confirm popups** — Should NOT be white
  - Previously was: white background (invisible on dark) ❌
  - Now should be: dark background (var(--modal-bg)) ✅

### Admin Sections
- [ ] User menu (top right) — should have dark background
- [ ] Navigation sidebar — should remain readable
- [ ] Page headers — text should be readable
- [ ] Table headers and rows — good contrast
- [ ] Form inputs — visible borders, readable text
- [ ] Status chips ("Ativa", "Rascunho", etc) — proper coloring

### Detailed Component Checks
- [ ] **Admin nav active item** — Should highlight properly in dark
  - Nav item active color: #f4efe7 (light text)
  - Active background: gradient with proper shadow

- [ ] **User menu avatar** — Should be light colored (readable)
  - Was: #fffaf5 (specific light) ❌
  - Now: var(--text-primary) = #f4efe7 ✅

- [ ] **Field warnings** — Should show warning color
  - Text color should change from #a54b2a → var(--status-warning-text)

- [ ] **Status chip "revisada"** (yellow) — Should use warning colors
  - Was: hardcoded #b26a00 ❌
  - Now: var(--status-warning-bg/text) ✅

---

## 🎨 Color Verification

### Expected Colors in Dark Mode

| Component | Light Mode | Dark Mode | Variable |
|-----------|-----------|-----------|----------|
| Delete button | `#fee2e2` bg | lighter red | `var(--status-error-bg)` |
| Success alert | light green | light green | `var(--status-success-bg)` |
| Error alert | light red | light red | `var(--status-error-bg)` |
| Warning/revisada | light yellow | light yellow | `var(--status-warning-bg)` |
| Text primary | `#1c201f` | `#f4efe7` | `var(--text-primary)` |
| Text secondary | `#63586f` | `#e8dfd4` | `var(--text-secondary)` |
| Border | `#e1d4ee` | `#5a5349` | `var(--border-light)` |
| Modal bg | `#f9f2ff` | `#221f1d` | `var(--modal-bg)` |

---

## ✅ Pass/Fail Criteria

### PASS ✅
- All text is readable in both light and dark modes
- Buttons have sufficient contrast
- Alert/toast/confirm boxes are visible and readable
- No white backgrounds on dark mode (except where intentional)
- Colors are consistent with design system
- No visual regression from previous version

### FAIL ❌
- Any text is unreadable due to contrast
- Colors don't change between light/dark
- White text on light background or vice versa
- Confirm popup is invisible in dark mode
- Delete buttons have poor contrast

---

## 📝 Testing Notes

If you find issues:
1. Check which component has the problem
2. Check if it uses `var(--*)` (should use variables)
3. If not using variables, file an issue
4. If using variables, check identity-system.css to see if the variable is correct

Example issue report:
> "Delete button in /admin/pessoas is hard to read in dark mode. Currently using `var(--status-error-bg)` which is `rgba(252, 165, 165, 0.15)` — might need darker/more opaque version."

---

## 🚀 When Ready

Once all checks pass:
1. Close dev server: `Ctrl+C`
2. Run final build: `npm run build`
3. Deploy or commit changes (already committed on main)

---

**Estimated testing time:** 15-20 minutes  
**Critical sections:** Delete buttons, alerts, confirm popup, nav items  
**Optional sections:** All other components (regression check)
