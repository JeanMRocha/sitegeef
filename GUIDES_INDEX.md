# 📋 GUIDES INDEX — Find What You Need

## 🚀 START HERE

**New session or codex?** → Start with this decision tree:

1. **I have 5 minutes** → Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. **I have 15 minutes** → Read [CONTINUATION_GUIDE.md](CONTINUATION_GUIDE.md)  
3. **I''m a technical agent** → Read [AGENT_GUIDE.md](AGENT_GUIDE.md)
4. **I need full context** → Read [CLAUDE.md](CLAUDE.md)

---

## 📚 GUIDE CATALOG

### Entry Points (Pick Based on Your Role)

| Guide | For | Time | Why |
|-------|-----|------|-----|
| **QUICK_REFERENCE.md** | Anyone rushing | 5 min | Instant cheat sheet + next action |
| **CONTINUATION_GUIDE.md** | Users/Non-tech | 15 min | Visual checklist + simple instructions |
| **AGENT_GUIDE.md** | Claude/Agents | 20 min | Technical details + decision tree |
| **CLAUDE.md** | Context needed | 30 min | Full project overview (read first if lost) |

---

### By Purpose

#### ⚡ "What do I do next?"
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) (2 min)  
→ [CONTINUATION_GUIDE.md](CONTINUATION_GUIDE.md) "NEXT ACTIONS" section (5 min)

#### 🔍 "What was done in this session?"
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) "WHAT WAS DONE" section  
→ [AGENT_GUIDE.md](AGENT_GUIDE.md) "COMPLETED WORK"  
→ git log (see commits)

#### 🧪 "How do I test/validate?"
→ [CONTINUATION_GUIDE.md](CONTINUATION_GUIDE.md) "Visual Testing Checklist"  
→ [AGENT_GUIDE.md](AGENT_GUIDE.md) "TESTING COMMANDS FOR AGENTS"

#### 📖 "Technical details for X?"
→ [AGENT_GUIDE.md](AGENT_GUIDE.md) "TECHNICAL DETAILS FOR AGENTS"  
→ [CLAUDE.md](CLAUDE.md) relevant section

#### 😕 "Something broke, what do I do?"
→ [AGENT_GUIDE.md](AGENT_GUIDE.md) "IF SOMETHING GOES WRONG"  
→ [CONTINUATION_GUIDE.md](CONTINUATION_GUIDE.md) skills section

---

## 🗺️ DOCUMENTATION STRUCTURE

```
Root (site-geef/)
├── CLAUDE.md ..................... 📍 PROJECT RULES (READ FIRST)
│
├── Guides (NEW - created this session)
├── CONTINUATION_GUIDE.md ......... User-friendly overview
├── AGENT_GUIDE.md ............... Technical reference
├── QUICK_REFERENCE.md ........... Fast lookup
└── GUIDES_INDEX.md .............. This file
│
├── docs/
│   ├── UI_UX_AUDIT_2026_05_31.md .............. 9 findings explained
│   ├── DARK_MODE_REMEDIATION_PLAN.md ........ Dark mode checklist
│   ├── DARK_MODE_VISUAL_TESTING_CHECKLIST.md  Testing guide
│   └── UI_UX_CORRECTIONS.md ................. Previous session work
│
├── HANDOFF.md ...................... Technical blueprint (from prev session)
│
├── styles/
│   ├── identity-system.css ...... 🎨 Design tokens (breakpoints, spacing, colors)
│   ├── utilities.css ............ 🔧 Reusable CSS classes (NEW)
│   ├── globals.css .............. Refactored (Phase 2, 3)
│   ├── admin.css ................ Refactored (Phase 2)
│   ├── admin-sidebar.css ........ Refactored (Phase 2)
│   ├── site-header.css .......... Refactored (Phase 2)
│   └── theme.css ................ Refactored (Phase 2)
│
├── components/
│   └── admin/instituicao/
│       ├── documentos-form.tsx ...... Refactored (Phase 1)
│       ├── endereco-form.tsx ........ Refactored (Phase 1)
│       └── missao-valores-form.tsx . Refactored (Phase 1)
│       admin-sidebar.tsx ........... Enhanced (Phase 3)
│
├── scripts/
│   └── validate-design-system.js .. Lint validation (NEW)
│
├── .eslintrc.json ................. Lint rules updated
├── .stylelintrc.json .............. NEW
└── package.json ................... Updated with lint:design-system script
```

---

## 🎯 DECISION FLOWS

### If You''re Starting This Session

```
START (You want to continue)
  ↓
Read QUICK_REFERENCE.md (5 min)
  ↓
[Do you understand what''s done?]
  ├─ NO → Read CONTINUATION_GUIDE.md (10 min)
  └─ YES → Continue
          ↓
          Pick your next action:
          A) Visual Testing (1-2h)
          B) Ship Ready (15m)
          C) Done (no more work)
```

### If Something Seems Wrong

```
START (Something unexpected)
  ↓
[What''s wrong?]
  ├─ Lint/Build failed → AGENT_GUIDE.md "IF SOMETHING GOES WRONG"
  ├─ Don''t know next step → QUICK_REFERENCE.md "NEXT ACTION"
  ├─ Need context → CLAUDE.md
  └─ Need technical details → AGENT_GUIDE.md "TECHNICAL DETAILS"
```

### If You''re a Codex/Agent Joining Fresh

```
START (Cold start, no context)
  ↓
1. Read CLAUDE.md (project rules)
2. Read AGENT_GUIDE.md (technical guide)
3. Verify state: git status, git log
4. Follow AGENT_GUIDE.md "DECISION TREE"
5. Execute your chosen action
```

---

## ✅ PRE-FLIGHT CHECKLIST

Before starting any action (Option A, B, or C):

```bash
# 1. Verify project state
git status              # Should be clean
git log --oneline | head -4  # Last 4 commits should show Phase 3, Phase 2, Phase 1, Lint

# 2. Verify key files exist
ls styles/utilities.css
ls scripts/validate-design-system.js
ls .stylelintrc.json

# 3. Install dependencies (if needed)
npm install

# 4. Quick lint check (should pass)
npm run lint:design-system
```

All should pass/exist. If not, read AGENT_GUIDE.md "STEP-BY-STEP FOR AGENT CONTINUATION"

---

## 🔗 QUICK LINKS TO KEY SECTIONS

### From CONTINUATION_GUIDE.md
- [Visual Testing Checklist](CONTINUATION_GUIDE.md#-se-continuar-com-visual-testing)
- [Ship Ready Checklist](CONTINUATION_GUIDE.md#-se-continuar-para-ship-ready)
- [Skills & Resources](CONTINUATION_GUIDE.md#-skills--recursos-disponíveis)

### From AGENT_GUIDE.md
- [Decision Tree](AGENT_GUIDE.md#-decision-tree-what-to-do-next)
- [Step-by-Step for Agents](AGENT_GUIDE.md#-step-by-step-for-agent-continuation)
- [Technical Details](AGENT_GUIDE.md#-technical-details-for-agents)
- [Troubleshooting](AGENT_GUIDE.md#-if-something-goes-wrong)

### From QUICK_REFERENCE.md
- [Pick Your Action](QUICK_REFERENCE.md#-next-action--pick-one)
- [Cheat Sheet](QUICK_REFERENCE.md#-cheat-sheet)
- [Common Questions](QUICK_REFERENCE.md#-common-questions)

### From CLAUDE.md
- [UI/UX Corrections](CLAUDE.md#ui-ux-corrections-2026-05-31)
- [Dark Mode Remediation](CLAUDE.md#dark-mode-remediation-2026-05-31)
- [UI/UX Audit Critical Fixes](CLAUDE.md#uiux-audit--critical-fixes-2026-05-31)

---

## 📞 HELP I''M STUCK

1. **Don''t know next step?** → QUICK_REFERENCE.md
2. **Need instructions?** → CONTINUATION_GUIDE.md
3. **Need technical help?** → AGENT_GUIDE.md
4. **Tests are failing?** → AGENT_GUIDE.md "IF SOMETHING GOES WRONG"
5. **Don''t understand project?** → CLAUDE.md

---

## 📊 SUMMARY

- ✅ **9 UI/UX findings resolved** (Phase 1-3)
- ✅ **Lint rules preventing regressions** (Phase 4)
- 📚 **4 comprehensive guides created** (This folder)
- 🎯 **Clear next action paths** (See QUICK_REFERENCE or CONTINUATION_GUIDE)
- 🚀 **Ready for Visual Testing or Ship** (Pick your option)

---

**Last Updated:** 2026-05-31  
**Status:** ✅ ALL GUIDES READY FOR NEXT SESSION  
**Next Step:** Pick QUICK_REFERENCE or CONTINUATION_GUIDE based on your role
