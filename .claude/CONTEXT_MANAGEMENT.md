# Context Management System v2.0

**Complete session state management and context optimization for Claude Code projects.**

## 📚 Overview

This context management system provides 8 custom slash commands organized in 3 tiers, enabling efficient long-form development sessions without hitting token limits.

**Total Specification:** 3,736 lines across 8 commands
**Development Time:** ~3 hours
**Test Status:** Checkpoint command validated ✅

---

## 🎯 Quick Start

```bash
# Enable context monitoring
/project:context-guard

# Work normally...
# (system automatically warns at 70%, 85%, 95%, 98%)

# When warned at 85%, save state:
/project:save

# After context clears, resume:
/project:resume
```

That's it! The system handles the rest.

---

## 📦 System Architecture

```
Context Management System v2.0
│
├── Tier 1: Core Operations (Manual)
│   ├── /project:checkpoint      - Quick progress saves
│   ├── /project:save            - State capture + context clear
│   └── /project:end-session     - Comprehensive shutdown
│
├── Tier 2: Intelligence Layer (Smart Assistance)
│   ├── /project:resume          - Intelligent session restart
│   ├── /project:status          - Read-only state report
│   └── /project:rollback        - Undo checkpoint/save
│
└── Tier 3: Automation (Hands-free)
    ├── /project:auto-save       - Background checkpointing
    └── /project:context-guard   - Token threshold warnings
```

---

## 🚀 Command Reference

### Tier 1: Core Operations

#### `/project:checkpoint`
**Size:** 6.2K | **Type:** Manual | **Destructive:** No

Quick progress save without clearing context.

**When to use:**
- Every 30-60 minutes during active work
- Before starting risky operations
- After completing a feature or fix
- Before long breaks

**What it does:**
- ✅ Analyzes git changes
- ✅ Generates smart commit message
- ✅ Updates CLAUDE.md session tracking
- ✅ Creates backup (CLAUDE.md.backup)
- ✅ Commits to git
- ❌ Does NOT clear context

**Example:**
```bash
/project:checkpoint
# Analyzes: 2 files changed (App.tsx, store.ts)
# Message: "checkpoint: [wizard-ui] update Step 3 validation"
# Updates CLAUDE.md with progress
# Commit created: a1b2c3d
```

---

#### `/project:save`
**Size:** 9.5K | **Type:** Manual | **Destructive:** Yes (clears context)

Save complete session state and clear context.

**When to use:**
- Token usage > 85% (~170k tokens)
- Switching to completely different task
- Before extended breaks (> 1 hour)
- When context feels cluttered

**What it does:**
- ✅ Interactive state capture (accomplishments, next actions, blockers)
- ✅ Generates SESSION_STATE.json (complete state)
- ✅ Creates resume command
- ✅ Updates CLAUDE.md
- ✅ Commits to git
- ✅ Clears context (via /clear)
- ✅ Provides exact resume command

**Example:**
```bash
/project:save
# Prompts for: accomplishments, current work, next action, blockers
# Creates: SESSION_STATE.json
# Generates resume command
# Saves and commits
# Clears context (170k → 20k tokens)
```

**Resume after save:**
```bash
Read CLAUDE.md and SESSION_STATE.json. Current: Implementing Step 4. Next: Test validation logic. Dev server at http://localhost:5173.
```

---

#### `/project:end-session`
**Size:** 12K | **Type:** Manual | **Destructive:** Optional

Comprehensive end-of-day shutdown with analytics.

**When to use:**
- End of work day
- Before vacation/extended break
- After completing major milestone
- When stopping work for a while

**What it does:**
- ✅ Comprehensive session summary
- ✅ Creates session archive (sessions/SESSION_*.md)
- ✅ Calculates statistics (duration, commits, productivity)
- ✅ Optional cleanup (stop tasks, commit changes, push)
- ✅ Updates CLAUDE.md history
- ✅ Optional context clear
- ✅ Provides resume instructions

**Example:**
```bash
/project:end-session
# Summary prompts: accomplishments, issues, next priority, rating
# Creates: sessions/SESSION_2025-12-26_170000.md
# Stats: 3h 45m, 8 commits, productivity 4/5
# Cleanup: stop tasks, commit, push
# Context cleared
```

---

### Tier 2: Intelligence Layer

#### `/project:resume`
**Size:** 13K | **Type:** Manual | **Destructive:** No

Intelligently restart from saved session.

**When to use:**
- After running /project:save
- Starting new Claude session
- Resuming after break

**What it does:**
- ✅ Loads SESSION_STATE.json or session archive
- ✅ Lists available sessions (--list flag)
- ✅ Validates environment (branch, files, git state)
- ✅ Selective restoration (choose what to restore)
- ✅ Restarts background tasks
- ✅ Restores TodoWrite state
- ✅ Displays full context for continuation

**Example:**
```bash
/project:resume
# Finds last session
# Shows: accomplished, current work, next actions
# Validates: branch matches, files unchanged
# Restarts: dev server
# Restores: todos
# Ready to continue!

/project:resume --list
# Shows all available sessions with previews
```

---

#### `/project:status`
**Size:** 12K | **Type:** Read-only | **Destructive:** No

Non-destructive state overview.

**When to use:**
- Getting oriented after resuming
- Before starting work
- Checking if checkpoint needed
- Understanding current state

**What it does:**
- ✅ Context usage with visual graphs
- ✅ Git state (branch, commits, changes)
- ✅ Background tasks health
- ✅ TodoWrite progress
- ✅ Session state summary
- ✅ Smart recommendations
- ✅ Token velocity analysis
- ❌ NEVER modifies anything

**Example:**
```bash
/project:status
# Context: 95k (47.5%) - Healthy ✅
# Git: feature/wizard (clean, 2 ahead)
# Tasks: npm run dev (running 2h)
# Todos: 5/8 complete (63%)
# Recommendation: Checkpoint in ~45 min
```

---

#### `/project:rollback`
**Size:** 15K | **Type:** Manual | **Destructive:** Yes

Undo last checkpoint/save operation.

**When to use:**
- Checkpoint captured wrong state
- Commit message incorrect
- Need to undo recent checkpoint
- Testing rollback functionality

**What it does:**
- ✅ Finds last checkpoint/save commit
- ✅ Shows diff of what will be undone
- ✅ Multiple rollback methods (revert/reset/restore)
- ✅ Safety confirmations
- ✅ Multiple backup layers
- ✅ Dry-run mode (--dry-run)
- ✅ Push detection with warnings

**Example:**
```bash
/project:rollback
# Shows: Last checkpoint (0c84a28) 15 min ago
# Diff: CLAUDE.md (+42/-0)
# Confirm: y
# Rollback complete
# Backup: CLAUDE.md.rollback-backup

/project:rollback --list
# Shows recent checkpoints to choose from
```

---

### Tier 3: Automation

#### `/project:auto-save`
**Size:** 13K | **Type:** Background | **Destructive:** No

Automatic background checkpointing.

**When to use:**
- Long coding sessions (> 2 hours)
- Hands-free progress tracking
- Consistent checkpoint intervals

**What it does:**
- ✅ Automatic checkpoints at intervals (default 30 min)
- ✅ Condition-based triggering (files changed, commits exist)
- ✅ Configurable interval (5-120 minutes)
- ✅ State persistence across sessions
- ✅ Statistics tracking
- ✅ Adaptive intervals (pause when idle)

**Example:**
```bash
/project:auto-save
# Starts with 30-minute interval
# Auto-checkpoints when files changed + commits exist
# Notification: "Auto-checkpoint #3 created"

/project:auto-save 15
# Custom 15-minute interval

/project:auto-save stop
# Disables auto-save

/project:auto-save status
# Shows stats: 5 checkpoints, next in 12 min
```

---

#### `/project:context-guard`
**Size:** 18K | **Type:** Background | **Destructive:** Conditional

Proactive token monitoring with warnings.

**When to use:**
- Always (enable at session start)
- Long development sessions
- Peace of mind

**What it does:**
- ✅ Four-tier warnings (70%/85%/95%/98%)
- ✅ Token velocity tracking
- ✅ Time-to-threshold estimates
- ✅ Automatic emergency saves at 98%
- ✅ Graduated actions (info → warn → auto-checkpoint → force-save)
- ✅ Smart warning repetition

**Thresholds:**
- **70% (140k):** ℹ️ Info banner
- **85% (170k):** ⚠️ Suggest /project:save
- **95% (190k):** 🚨 Auto-checkpoint + strong warning
- **98% (196k):** ⛔ Emergency save (automatic)

**Example:**
```bash
/project:context-guard
# Enables monitoring
# At 85%: "⚠️ Context usage: 170k (85%). Recommend /project:save"
# At 95%: "🚨 CRITICAL! Auto-checkpoint created. Save NOW!"
# At 98%: "⛔ EMERGENCY! Executing automatic save..."

/project:context-guard status
# Shows velocity, projections, time to thresholds
```

---

## 💼 Common Workflows

### Daily Development Session

```bash
# 1. Start session
/project:context-guard             # Enable monitoring
/project:auto-save 30              # Enable auto-checkpoints

# 2. Work normally
# ... coding ...
# (Auto-checkpoints happen automatically)

# 3. Mid-session (when warned at 85%)
/project:save                      # Save and clear

# 4. Resume immediately
[Paste resume command from save]

# 5. End of day
/project:end-session               # Comprehensive shutdown
```

### Quick Session (< 2 hours)

```bash
# 1. Work
# ... coding ...

# 2. Checkpoint periodically
/project:checkpoint                # Every 30-60 min

# 3. End
/project:end-session
```

### Resume Previous Session

```bash
# 1. See available sessions
/project:resume --list

# 2. Resume specific session
/project:resume 2025-12-26_170000

# 3. Or resume last session
/project:resume
```

### Emergency Recovery

```bash
# If you forgot to checkpoint:
/project:rollback --list          # See recent saves
/project:rollback a1b2c3d         # Rollback to specific point

# If context suddenly full:
# (context-guard will auto-save at 98%)
# Or manually:
/project:save                     # Force save NOW
```

---

## 📂 File Structure

```
project-root/
├── .claude/
│   ├── commands/
│   │   ├── checkpoint.md           # Core: Quick saves
│   │   ├── save.md                 # Core: State + clear
│   │   ├── end-session.md          # Core: Shutdown
│   │   ├── resume.md               # Intelligence: Restart
│   │   ├── status.md               # Intelligence: Report
│   │   ├── rollback.md             # Intelligence: Undo
│   │   ├── auto-save.md            # Automation: Background
│   │   ├── context-guard.md        # Automation: Monitoring
│   │   └── README.md               # Command index
│   ├── SESSION_STATE.schema.json   # State specification
│   ├── SESSION_STATE.example.json  # Example state
│   ├── CLAUDE_TEMPLATE_ADDITIONS.md# Integration guide
│   ├── auto-save.config.json       # Auto-save settings (tracked)
│   ├── auto-save-state.json        # Auto-save state (gitignored)
│   ├── context-guard.config.json   # Guard settings (tracked)
│   └── context-guard-state.json    # Guard state (gitignored)
├── sessions/
│   ├── SESSION_2025-12-26_170000.md# Archived sessions
│   └── .gitkeep
├── SESSION_STATE.json              # Current state (gitignored)
├── CLAUDE.md                       # Project docs (with session tracking)
└── CLAUDE.md.backup                # Auto-created backups (gitignored)
```

---

## ⚙️ Configuration

### .gitignore Additions

```gitignore
# Context Management - Runtime state
SESSION_STATE.json
CLAUDE.md.backup
*.backup
.claude/auto-save-state.json
.claude/auto-save.log
.claude/auto-save.pid
.claude/context-guard-state.json
.claude/context-guard.log

# Keep these tracked:
# .claude/auto-save.config.json
# .claude/context-guard.config.json
# sessions/
```

### CLAUDE.md Integration

Add this section to your CLAUDE.md:

```markdown
### 🚧 Current Session

[Automatically updated by /project:checkpoint and /project:save]

### 📚 Recent Sessions

- **2025-12-26 17:00** - Context management implementation ([notes](sessions/SESSION_2025-12-26_170000.md))

### 🔧 Context Management Commands

This project uses custom context management commands:

**Core:** /project:checkpoint, /project:save, /project:end-session
**Intelligence:** /project:resume, /project:status, /project:rollback
**Automation:** /project:auto-save, /project:context-guard

See `.claude/CONTEXT_MANAGEMENT.md` for full documentation.
```

---

## 📊 Statistics & Analytics

The system tracks:
- Checkpoint frequency
- Session duration
- Token usage patterns
- Productivity ratings
- Commit patterns
- Warning effectiveness

View stats:
```bash
/project:status                   # Current session stats
/project:auto-save status         # Auto-save statistics
/project:context-guard status     # Token usage analytics
```

---

## 🛡️ Safety Features

1. **Multiple Backup Layers:**
   - CLAUDE.md.backup (automatic)
   - SESSION_STATE.json (complete state)
   - Session archives (permanent record)
   - Git reflog (ultimate safety net)

2. **Confirmation Requirements:**
   - Destructive operations require confirmation
   - Force operations require typing full phrases
   - Preview diffs before rollbacks

3. **Error Recovery:**
   - Operations designed to be non-destructive by default
   - Fallbacks for all critical operations
   - Clear recovery instructions

4. **State Validation:**
   - Git state validated before operations
   - File existence checked
   - Branch awareness
   - Conflict detection

---

## 🎓 Best Practices

1. **Enable automation early:**
   ```bash
   /project:context-guard    # Start of every session
   /project:auto-save 30     # For sessions > 2 hours
   ```

2. **Checkpoint frequently:**
   - Every 30-60 minutes
   - Before risky operations
   - After completing features

3. **Save before hitting limits:**
   - Trust the 85% warning
   - Don't wait for 95%
   - Emergency save at 98% is last resort

4. **End sessions properly:**
   - Use /project:end-session at end of day
   - Creates valuable session history
   - Enables better analytics

5. **Review status regularly:**
   - Check /project:status when resuming
   - Understand your token velocity
   - Plan save timing proactively

---

## 🔧 Troubleshooting

### "No sessions found to resume"
- Use /project:checkpoint or /project:save first
- Check `sessions/` directory exists
- Verify SESSION_STATE.json exists

### "Checkpoint failed - git error"
- Ensure git repository initialized
- Check file permissions
- Verify no merge conflicts

### "Context guard not warning"
- Check `/project:context-guard status`
- Verify state file exists
- Restart: `/project:context-guard stop` then `/project:context-guard`

### "Auto-save not creating checkpoints"
- Check conditions: `/project:auto-save status`
- Verify files have changed
- Check interval hasn't elapsed yet

### "Emergency save failed at 98%"
- Manually run `/project:checkpoint`
- Copy important information
- Clear context manually
- Report issue

---

## 📈 Future Enhancements

Planned features:
- Cloud sync integration
- Session replay capability
- Team collaboration features
- AI session insights
- Smart branch management
- Session templates
- Custom hooks

---

## 📝 Version History

**v2.0** (2025-12-26)
- Initial release
- 8 commands across 3 tiers
- 3,736 lines of specifications
- Comprehensive state management
- Full automation support

---

## 🤝 Contributing

This system is part of the claude-project-wizard project.

**Repository:** https://github.com/erricklong85-tech/claude-project-wizard
**Issues:** Report via GitHub Issues
**License:** MIT

---

## 📞 Support

**Documentation:**
- This file: `.claude/CONTEXT_MANAGEMENT.md`
- Individual commands: `.claude/commands/*.md`
- Template guide: `.claude/CLAUDE_TEMPLATE_ADDITIONS.md`

**Quick Help:**
```bash
/project:status      # See current state
/project:resume --list  # See available sessions
```

---

**Built with Claude Code | Context Management System v2.0**

*Never hit the context limit unexpectedly again.*
