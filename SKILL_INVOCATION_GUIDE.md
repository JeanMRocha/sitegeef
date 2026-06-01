# 🤖 UI-UX-PRO-MAX-SKILL INVOCATION GUIDE

**For:** Codex wanting to use ui-ux-pro-max-skill for WCAG AAA audit

---

## 🎯 WHAT THIS SKILL DOES

The `ui-ux-pro-max-skill` is designed for:
- Automating UI/UX optimization
- Design system consistency review
- WCAG compliance auditing (AA → AAA)
- Component generation with design standards
- Responsive layout optimization
- Accessibility deep-dive

---

## 🚀 HOW TO INVOKE

### Method 1: Direct Command in Chat
```
/ui-ux-pro-max-skill
```

Then provide context/prompt specific to your task.

### Method 2: With Detailed Prompt (Recommended for WCAG AAA)

Type in chat:
```
/ui-ux-pro-max-skill
```

Then send this prompt for WCAG AAA audit:

---

## 📝 RECOMMENDED PROMPT FOR WCAG AAA AUDIT

Copy and paste into chat after invoking the skill:

```
WCAG 2.1 AAA Compliance Audit - GEEF ERP Project

Current State:
- Design system: styles/identity-system.css (breakpoints, spacing, colors)
- Admin components: components/admin/* and styles/admin.css
- Public pages: app/page.tsx, app/escalas/, app/leitor/, app/login/
- Current compliance level: WCAG 2.1 AA
- Target compliance level: WCAG 2.1 AAA

Task: Audit and identify changes needed to reach WCAG 2.1 AAA

Focus Areas:
1. **Color Contrast** (4.5:1 AA → 7:1 AAA)
   - Check all text colors against backgrounds
   - Review both light and dark mode
   - Identify colors that need darkening/lightening
   - Specify which variables in identity-system.css need updates

2. **Focus Indicators** (2px outline → 3px outline + high contrast)
   - Check all interactive elements (buttons, inputs, links)
   - Verify focus indicators meet 3:1 contrast ratio
   - Ensure minimum 3px width/height
   - Find files/lines that need updating

3. **Keyboard Navigation** (Tab, Enter, Space → Arrow keys, Escape, Home, End)
   - Check modals can close with Escape
   - Check select dropdowns use arrow keys
   - Check form taborder is logical
   - Identify components missing keyboard support

4. **Motion & Animation** (No restriction → Respect prefers-reduced-motion)
   - Check all animations/transitions
   - Identify which files have animation properties
   - Recommend prefers-reduced-motion rules

5. **Text Reflow** (No testing → Must work at 200% zoom)
   - Check layouts don''t require horizontal scroll at 200% zoom
   - Identify responsive breakpoints that might break
   - Suggest media query adjustments

6. **Screen Reader Testing** (Basic labels → Comprehensive ARIA)
   - Check all buttons have accessible names
   - Check form inputs have associated labels
   - Check complex components have ARIA roles
   - Recommend ARIA improvements

Output Format Requested:
- File: styles/identity-system.css
  - Line range: X-Y
  - Issue: [specific issue]
  - Severity: Critical/High/Medium/Low
  - Fix: [specific code change needed]
  - Example: [before/after code]

- File: styles/globals.css
  - [same format]

- File: components/admin/[component]
  - [same format]

[Repeat for all files needing changes]

Then provide:
1. **Summary** of all changes needed
2. **Priority order** for implementation
3. **Testing approach** (what to test, how to test)
4. **Screen reader commands** to use for validation
5. **Estimated effort** per finding

Context (already completed):
- Phase 1-3 UI/UX fixes done
- Design system variables in place
- Lint rules preventing regressions
- Dark mode fully functional
```

---

## 🎬 STEP-BY-STEP EXECUTION

### Step 1: Invoke Skill
```
In chat, type: /ui-ux-pro-max-skill
```

### Step 2: Send Audit Prompt
Copy the prompt above and send it in the same chat message or next message.

### Step 3: Wait for Analysis
Skill will:
- Analyze current state
- Identify WCAG AAA violations
- Provide detailed findings with file:line references
- Suggest specific code changes

### Step 4: Implement Fixes
Based on skill output:
```bash
# For each finding:
1. Open file mentioned
2. Make change suggested
3. Test locally: npm run dev
4. Verify fix

# After all fixes:
npm run type-check && npm run lint && npm run build
```

### Step 5: Validate
```bash
# Test with screen reader
# Test at 200% zoom
# Test keyboard navigation
# Run Lighthouse audit

# Commit when all pass
git commit -m "feat: implement WCAG 2.1 AAA compliance fixes"
```

---

## 🔍 WHAT TO EXPECT FROM SKILL OUTPUT

Good output looks like:

```
FILE: styles/identity-system.css
LINE: 251-256 (Link colors section)

FINDING: Link color #8a005a insufficient contrast (4.5:1) against white background
SEVERITY: High (affects navigation, links)

CURRENT:
  --link-color: #8a005a;

FIX:
  --link-color: #5a0035;  /* Darker purple for 7:1 contrast */

VALIDATION:
  Before: Color #8a005a on white = 4.5:1 (AA) ✗
  After: Color #5a0035 on white = 7:1 (AAA) ✓

---

FILE: styles/globals.css
LINE: 498

FINDING: Focus outline too thin (2px) for AAA
SEVERITY: Medium

CURRENT:
  outline: 2px solid var(--focus-outline);
  box-shadow: 0 0 0 4px var(--focus-ring);

FIX:
  outline: 3px solid var(--focus-outline);
  box-shadow: 0 0 0 4px var(--focus-ring), 
              inset 0 0 0 1px var(--focus-outline);

VALIDATION:
  2px outline: Size too small for AAA ✗
  3px + inner ring: Clear, high contrast ✓
```

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue: Skill output is too generic
**Solution:** Provide more specific context in prompt, mention exact files

### Issue: Skill suggests changes but doesn''t provide code
**Solution:** Ask for "before/after code examples for each finding"

### Issue: Too many findings to implement
**Solution:** Ask skill to "prioritize by severity and group by file for batch implementation"

### Issue: Unclear how to validate fix
**Solution:** Ask for "specific testing steps and expected results for each fix"

---

## 📊 EXPECTED OUTCOMES

After skill audit + implementation:

**Before:**
```
Color contrast: 4.5:1 (AA)
Focus indicators: 2px outline
Keyboard support: Tab + Enter only
Motion: No prefers-reduced-motion
```

**After:**
```
Color contrast: 7:1 (AAA)
Focus indicators: 3px + inner ring + high contrast
Keyboard support: Tab, Enter, Escape, Arrows
Motion: Respects prefers-reduced-motion
```

---

## 🔗 RELATED DOCUMENTATION

After skill run, see:
- **HANDOFF.md** — Full implementation guide
- **AGENT_GUIDE.md** — Technical patterns
- **CONTINUATION_GUIDE.md** — User overview

---

## ✅ CHECKLIST

- [ ] Understood what ui-ux-pro-max-skill does
- [ ] Ready to invoke with detailed prompt
- [ ] Reviewed expected output format
- [ ] Understand implementation steps
- [ ] Know how to validate fixes
- [ ] Ready to commit when done

---

**Next:** Type `/ui-ux-pro-max-skill` and send the audit prompt above!
