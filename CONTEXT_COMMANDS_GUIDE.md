# Comprehensive Guide to Context Management Commands

Based on the documentation, here's a complete guide to the 8 custom slash commands in your project:

---

## 📊 Quick Reference Table

| Command | Type | Clears Context? | When to Use | Frequency |
|---------|------|-----------------|-------------|-----------|
| `/project:checkpoint` | Manual | ❌ No | Save progress | Every 30-60 min |
| `/project:save` | Manual | ✅ Yes | High token usage | At 85%+ (170k tokens) |
| `/project:end-session` | Manual | ⚙️ Optional | End of work day | Once per day |
| `/project:resume` | Manual | ❌ No | After save/break | Start of session |
| `/project:status` | Read-only | ❌ No | Check state | Anytime |
| `/project:rollback` | Manual | ❌ No | Undo checkpoint | Rare/mistakes |
| `/project:auto-save` | Automation | ❌ No | Long sessions | Once at session start |
| `/project:context-guard` | Automation | ⚠️ At 98% | Always | Once at session start |

---

## 🎯 The 8 Commands Explained

### Tier 1: Core Operations (Manual Use)

#### 1️⃣ `/project:checkpoint`
**Purpose:** Quick progress save without disrupting your flow

**What It Does:**
- ✅ Analyzes your git changes
- ✅ Generates smart commit message (format: `checkpoint: [project] description`)
- ✅ Updates CLAUDE.md with current progress
- ✅ Creates backup (CLAUDE.md.backup)
- ✅ Commits to git
- ❌ **Does NOT** clear context

**When to Use:**
- Every 30-60 minutes during active coding
- Before starting risky operations (refactoring, major changes)
- After completing a feature or bug fix
- Before taking breaks

**Example Output:**
```
Analyzing changes: 2 files changed (App.tsx, store.ts)
Commit message: "checkpoint: [wizard-ui] update Step 3 validation"
CLAUDE.md updated
Commit created: a1b2c3d
```

**Perfect For:** Regular "save points" like in a video game

---

#### 2️⃣ `/project:save`
**Purpose:** Save complete session state AND clear context (nuclear option)

**What It Does:**
- ✅ Interactive prompts (accomplishments, next actions, blockers)
- ✅ Generates SESSION_STATE.json (complete state snapshot)
- ✅ Creates precise resume command
- ✅ Updates CLAUDE.md
- ✅ Commits to git
- ✅ **Clears context** (calls `/clear` internally)
- ✅ Provides exact command to resume

**When to Use:**
- **Token usage > 85%** (~170k tokens) - This is THE signal
- Switching to completely different task
- Before extended breaks (> 1 hour)
- When conversation feels cluttered/confused

**Interactive Prompts:**
1. "What did you accomplish this session?"
2. "What are you currently working on?"
3. "What's the next action?"
4. "Any blockers or issues?"

**After Save, You'll Get:**
```bash
Resume with this command:
Read CLAUDE.md and SESSION_STATE.json. Current: Implementing Step 4 validation.
Next: Test edge cases. Dev server at http://localhost:5173.
```

**Perfect For:** Preventing context overflow, clean slate resumption

---

#### 3️⃣ `/project:end-session`
**Purpose:** Comprehensive end-of-day shutdown with analytics

**What It Does:**
- ✅ Comprehensive session summary
- ✅ Creates session archive (`sessions/SESSION_2025-12-27_*.md`)
- ✅ Calculates statistics (duration, commits, productivity rating)
- ✅ Optional cleanup (stop background tasks, commit changes, push)
- ✅ Updates CLAUDE.md session history
- ✅ Optional context clear
- ✅ Provides resume instructions for next session

**When to Use:**
- End of work day
- Before vacation/extended break
- After completing major milestone
- When you're done for a while

**Session Archive Includes:**
- Full timeline of work done
- Files changed
- Commits made
- Productivity self-rating (1-5)
- Next session priorities

**Perfect For:** Creating a permanent record of your work session

---

### Tier 2: Intelligence Layer (Smart Assistance)

#### 4️⃣ `/project:resume`
**Purpose:** Intelligently restart from a saved session

**What It Does:**
- ✅ Loads SESSION_STATE.json or session archive
- ✅ Lists available sessions (`--list` flag)
- ✅ Validates environment (branch, files, git state)
- ✅ Selective restoration (choose what to restore)
- ✅ Restarts background tasks (like `npm run dev`)
- ✅ Restores TodoWrite state
- ✅ Displays full context for continuation

**When to Use:**
- After running `/project:save`
- Starting a new Claude session
- Resuming after a break

**Usage Examples:**
```bash
/project:resume              # Resume last session
/project:resume --list       # Show all available sessions
/project:resume 2025-12-27_054419  # Resume specific session
```

**What It Shows You:**
- ✅ What you accomplished
- ✅ What you were working on
- ✅ Next planned actions
- ✅ Any blockers
- ✅ Environment state (branch, running tasks)

**Perfect For:** Picking up exactly where you left off

---

#### 5️⃣ `/project:status`
**Purpose:** Non-destructive state overview (read-only, safe to run anytime)

**What It Does:**
- ✅ Context usage with visual graphs
- ✅ Git state (branch, commits ahead/behind, uncommitted changes)
- ✅ Background tasks health
- ✅ TodoWrite progress (X/Y complete)
- ✅ Session state summary
- ✅ Smart recommendations (when to checkpoint/save)
- ✅ Token velocity analysis (tokens per minute)
- ❌ **NEVER modifies anything**

**When to Use:**
- Getting oriented after resuming
- Before starting work
- Checking if checkpoint needed
- Understanding current state
- Anytime you're curious!

**Example Output:**
```
📊 Context: 95k / 200k (47.5%) ████████░░ Healthy ✅
📦 Git: feature/wizard (clean, 2 commits ahead)
🔄 Tasks: npm run dev (running 2h 15m)
✅ Todos: 5/8 complete (63%)
💡 Recommendation: Checkpoint in ~45 minutes
⚡ Velocity: 850 tokens/min (projected limit in 2h 4m)
```

**Perfect For:** Quick health check without changing anything

---

#### 6️⃣ `/project:rollback`
**Purpose:** Undo the last checkpoint/save operation

**What It Does:**
- ✅ Finds last checkpoint/save commit
- ✅ Shows diff of what will be undone
- ✅ Multiple rollback methods (revert/reset/restore)
- ✅ Safety confirmations required
- ✅ Multiple backup layers
- ✅ Dry-run mode (`--dry-run`)
- ✅ Warns if already pushed to remote

**When to Use:**
- Checkpoint captured wrong state
- Commit message incorrect
- Need to undo recent checkpoint
- Testing rollback functionality
- Made a mistake

**Usage Examples:**
```bash
/project:rollback              # Rollback last checkpoint
/project:rollback --list       # Show recent checkpoints
/project:rollback --dry-run    # Preview without executing
/project:rollback a1b2c3d      # Rollback specific commit
```

**Safety Features:**
- Creates backup: `CLAUDE.md.rollback-backup`
- Shows preview before executing
- Requires confirmation
- Detects if pushed to remote (warns about force-push)

**Perfect For:** "Oops, that checkpoint was wrong"

---

### Tier 3: Automation (Set It & Forget It)

#### 7️⃣ `/project:auto-save`
**Purpose:** Automatic background checkpointing

**What It Does:**
- ✅ Automatic checkpoints at intervals (default 30 min)
- ✅ Condition-based triggering (only if files changed + commits exist)
- ✅ Configurable interval (5-120 minutes)
- ✅ State persistence across sessions
- ✅ Statistics tracking
- ✅ Adaptive intervals (pauses when idle)

**When to Use:**
- Long coding sessions (> 2 hours)
- Hands-free progress tracking
- When you want consistent backups

**Usage Examples:**
```bash
/project:auto-save           # Start with 30-min interval
/project:auto-save 15        # Custom 15-min interval
/project:auto-save stop      # Disable auto-save
/project:auto-save status    # Show stats
```

**Conditions for Auto-Checkpoint:**
- Interval elapsed (e.g., 30 minutes)
- Files have changed since last checkpoint
- Git commits exist

**Notifications:**
```
✅ Auto-checkpoint #3 created (30 min elapsed)
⏭️ Next checkpoint in 30 minutes
```

**Perfect For:** Long sessions where you might forget to checkpoint

---

#### 8️⃣ `/project:context-guard`
**Purpose:** Proactive token monitoring with graduated warnings

**What It Does:**
- ✅ Four-tier warnings (70% / 85% / 95% / 98%)
- ✅ Token velocity tracking (tokens per minute)
- ✅ Time-to-threshold estimates
- ✅ **Automatic emergency save at 98%**
- ✅ Graduated actions (info → warn → auto-checkpoint → force-save)
- ✅ Smart warning repetition (doesn't spam)

**When to Use:**
- **Always!** Enable at the start of EVERY session
- Long development sessions
- Peace of mind

**Warning Thresholds:**

| Threshold | Tokens | Action | Severity |
|-----------|--------|--------|----------|
| 70% | 140k | ℹ️ Info banner | Low |
| 85% | 170k | ⚠️ Suggest `/project:save` | Medium |
| 95% | 190k | 🚨 Auto-checkpoint + strong warning | High |
| 98% | 196k | ⛔ **Emergency save (automatic)** | Critical |

**Usage Examples:**
```bash
/project:context-guard        # Enable monitoring
/project:context-guard status # Show velocity & projections
/project:context-guard stop   # Disable (not recommended)
```

**Example Warnings:**
```
At 70%: ℹ️ Context usage: 140k (70%). Healthy pace.
At 85%: ⚠️ Context usage: 170k (85%). Recommend /project:save soon.
At 95%: 🚨 CRITICAL! 190k (95%). Auto-checkpoint created. Save NOW!
At 98%: ⛔ EMERGENCY! Executing automatic save...
```

**Perfect For:** Never getting surprised by hitting the token limit

---

## 🔄 Common Workflows

### Workflow 1: Full-Day Session (Recommended)

```bash
# Morning - Start session
/project:context-guard              # Enable token monitoring
/project:auto-save 30               # Enable 30-min auto-checkpoints

# Work normally
# ... coding, testing, debugging ...
# (Auto-checkpoints happen automatically every 30 min)

# Midday - When warned at 85%
/project:save                       # Save state and clear context

# Immediately after save
[Paste the resume command provided]

# Continue working
# ... more coding ...

# End of day
/project:end-session                # Comprehensive shutdown + archive
```

**Result:** Complete protection, automatic backups, clean history

---

### Workflow 2: Quick Session (< 2 hours)

```bash
# Work
# ... coding ...

# Checkpoint periodically
/project:checkpoint                 # Every 30-60 minutes

# End session
/project:end-session
```

**Result:** Simple, manual control, good for short bursts

---

### Workflow 3: Resume After Break

```bash
# See what sessions are available
/project:resume --list

# Resume specific session
/project:resume 2025-12-27_054419

# Or resume last session
/project:resume

# Check current state
/project:status
```

**Result:** Back to work instantly with full context

---

### Workflow 4: Emergency Recovery

```bash
# If you forgot to checkpoint
/project:rollback --list           # See recent saves
/project:rollback a1b2c3d          # Rollback to specific point

# If context suddenly full (98%)
# (context-guard will auto-save automatically)
# Or manually:
/project:save                      # Force save NOW
```

---

## 💡 Decision Tree: Which Command to Use?

```
Are you starting a new session?
├─ YES → Run /project:context-guard and /project:auto-save
└─ NO → Continue below

Have you been working for 30-60 minutes?
├─ YES → Run /project:checkpoint
└─ NO → Continue below

Is token usage > 85% (170k)?
├─ YES → Run /project:save
└─ NO → Continue below

Are you ending work for the day?
├─ YES → Run /project:end-session
└─ NO → Continue below

Do you want to check current state?
├─ YES → Run /project:status
└─ NO → You're good!
```

---

## 🎓 Best Practices

1. **Enable automation early:**
   - Always run `/project:context-guard` at session start
   - Use `/project:auto-save 30` for sessions > 2 hours

2. **Checkpoint frequently:**
   - Every 30-60 minutes
   - Before risky operations
   - After completing features

3. **Save before hitting limits:**
   - Trust the 85% warning
   - Don't wait for 95%
   - Emergency save at 98% is last resort

4. **End sessions properly:**
   - Use `/project:end-session` at end of day
   - Creates valuable session history
   - Enables better analytics

5. **Review status regularly:**
   - Check `/project:status` when resuming
   - Understand your token velocity
   - Plan save timing proactively

---

## 🛡️ Safety Features

- **Multiple backups:** CLAUDE.md.backup, SESSION_STATE.json, session archives, git reflog
- **Confirmation required:** Destructive operations ask for confirmation
- **Preview before action:** See diffs before rollbacks
- **Non-destructive by default:** Operations won't break your work
- **State validation:** Checks git state, file existence, branch awareness

---

## 🔧 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "No sessions found to resume" | Run `/project:checkpoint` or `/project:save` first |
| "Checkpoint failed - git error" | Ensure git repo initialized, check permissions |
| "Context guard not warning" | Check `/project:context-guard status`, restart if needed |
| "Auto-save not checkpointing" | Verify files changed, check `/project:auto-save status` |

---

## 🎯 TL;DR - The Essential Commands

For most people, you only need these 4 commands:

1. **`/project:context-guard`** - Run once at session start (protects you)
2. **`/project:checkpoint`** - Run every 30-60 min (saves progress)
3. **`/project:save`** - Run when warned at 85% (clears context)
4. **`/project:end-session`** - Run at end of day (archives session)

Everything else is optional or automatic!

---

This system is designed to prevent you from ever losing work or hitting the context limit unexpectedly. The automation commands (`context-guard` and `auto-save`) handle most of the work for you, while the manual commands give you precise control when needed.
