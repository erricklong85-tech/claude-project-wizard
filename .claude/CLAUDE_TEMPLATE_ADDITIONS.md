# CLAUDE.md Template Additions for Context Management

This file documents the sections to add to any CLAUDE.md for full context management support.

## Add these sections to your CLAUDE.md:

---

### 🚧 Current Session (Auto-managed by context commands)

**Status:** Ready to resume
**Session ID:** 2025-12-26_170000
**Started:** 2025-12-26 17:00
**Last Checkpoint:** 2025-12-26 17:45 (commit: a3b2c1d)
**Branch:** feature/context-management-v2
**Token Usage:** 145,000/200,000 (72.5%)

#### Accomplished This Session
- Created SESSION_STATE.json schema
- Enhanced CLAUDE.md structure
- Implemented /project:checkpoint command

#### Currently Working On
- Implementing /project:save command
- Testing state preservation

#### Next Actions
- [ ] Complete Tier 1 commands (checkpoint, save, end-session)
- [ ] Test integration between all three commands
- [ ] Commit Tier 1 implementation

#### Active Environment
- **Dev Server:** http://localhost:5173 (task: b5585c9)
- **Background Tasks:**
  - `npm run dev` (task: b5585c9, running 2h 15m)
  - `npm run test:watch` (task: a1b2c3d, running 45m)
- **Uncommitted Changes:**
  - `.claude/SESSION_STATE.schema.json` (new)
  - `CLAUDE.md` (modified)

#### Blockers/Issues
- None currently

#### Resume Command
```
Read CLAUDE.md and SESSION_STATE.json. Current: Implementing /project:save. Next: Test state preservation. Dev server running (task b5585c9).
```

---

### 📚 Recent Sessions

Sessions are stored in `sessions/` directory. Each session creates a detailed markdown file.

- **2025-12-26 17:00** - Context management implementation ([session notes](sessions/SESSION_2025-12-26_170000.md))
- **2025-12-25 14:30** - Testing wizard Step 1-2 ([session notes](sessions/SESSION_2025-12-25_143000.md))
- **2025-12-24 09:15** - Initial wizard setup ([session notes](sessions/SESSION_2025-12-24_091500.md))

**View all sessions:** `ls -lt sessions/`

---

### 🔧 Context Management Commands

This project uses custom context management commands for efficient development sessions.

**Core Commands:**
- `/project:checkpoint` - Quick save progress without clearing context
- `/project:save` - Save complete state and clear context (use at ~160k tokens)
- `/project:end-session` - Comprehensive end-of-day shutdown with analytics

**Intelligence Commands:**
- `/project:resume` - Intelligently restart from saved session
- `/project:status` - Quick read-only state report (no modifications)
- `/project:rollback` - Undo last checkpoint/save

**Automation:**
- `/project:auto-save` - Enable automatic checkpointing every N minutes
- `/project:context-guard` - Auto-warn at token thresholds (70/85/95/98%)

**Best Practices:**
- Checkpoint every 30-60 minutes during active work
- Save & clear when token usage > 85% (~170k tokens)
- Always end-session at end of work day
- Use /project:resume to start each session

---

## Session State Files

The context management system creates these files:

- **SESSION_STATE.json** - Current session state (updated by checkpoint/save)
- **CLAUDE.md.backup** - Automatic backup before modifications
- **sessions/SESSION_YYYY-MM-DD_HHMMSS.md** - Archived session reports

**Note:** SESSION_STATE.json is gitignored (contains runtime state), but session archives are committed.

---

## Integration Instructions

To add context management to your CLAUDE.md:

1. Copy the "Current Session" section template above
2. Add the "Recent Sessions" section after your "Current Status" section
3. Add the "Context Management Commands" section to your documentation area
4. Update "Current Session" section via commands (automated)
5. Manual updates go in the existing project-specific sections

The context management commands will automatically maintain the "Current Session" section.
