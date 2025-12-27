# Project Status - Read-Only State Report

Execute the following steps to display a comprehensive, non-destructive overview of current project state.

## Purpose

Quick status check without making ANY modifications. Use this to:
- Get oriented after resuming a session
- Check current state before starting work
- Understand context/token usage
- See what's uncommitted or running
- Decide what to do next

**CRITICAL: This command is 100% READ-ONLY. Never modify any files, git state, or background tasks.**

## Execution

Gather all information silently, then display formatted report.

### 1. Collect Context Usage

```bash
# This would use the /context command, but for now capture token estimate
# Parse from system or estimate based on conversation length
```

Extract:
- Current token count
- Max tokens (200,000)
- Percentage used
- Recommendation (if > 85%: suggest save)

### 2. Collect Git State

Run these in parallel:

```bash
# Branch and status
git branch --show-current
git status --short
git status --branch --porcelain

# Last commit
git log -1 --pretty=format:"%h %s (%cr)"

# Check remote tracking
git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null || echo "0	0"

# Today's commits
git log --since="today" --oneline | wc -l

# Uncommitted file count and details
git status --short | wc -l
git diff --stat
```

### 3. Collect Background Tasks

Parse `/tasks` command output to extract:
- Task IDs
- Commands running
- Duration (if available)
- URLs (for dev servers)
- Status (running/stopped/error)

### 4. Collect TodoWrite State

Check if TodoWrite todos exist:
- Count completed items
- Count in-progress items (should be 0 or 1)
- Count pending items
- Get current in-progress task description

### 5. Collect Session State

Check for SESSION_STATE.json:
- If exists: Parse last save time
- If exists: Get session ID
- Check for recent session files
- Count checkpoints today (from git log)

Read CLAUDE.md "Current Session" section if it exists:
- Last checkpoint time
- Current work description
- Next actions
- Blockers

### 6. Generate Status Report

Display comprehensive formatted report:

```
📊 Project Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: [current time]
Project: [directory name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Context Usage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: [count] tokens ([percentage]% of 200,000)
Status: [✅ Healthy | ⚠️ Getting high | 🚨 Critical]
Recommendation: [specific suggestion based on percentage]

Token Thresholds:
• 0-70% (0-140k): ✅ Plenty of room
• 70-85% (140k-170k): ⚠️ Consider checkpointing
• 85-95% (170k-190k): ⚠️ Recommend /project:save soon
• 95-100% (190k-200k): 🚨 Save immediately!

Current: [visual bar graph]
[████████░░] 75.5%

📂 Git State
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch: [branch-name] ([ahead] commits ahead, [behind] behind origin)
Status: [Clean working tree | [n] uncommitted files]

Last Commit:
[hash] [message] ([time ago])

[If uncommitted files:]
Uncommitted Changes ([count] files):
  M src/App.tsx (+45/-12 lines)
  M CLAUDE.md (+8/-2 lines)
  ?? new-file.txt

[If ahead/behind remote:]
Remote Status:
• [ahead] commits ahead of origin/[branch]
• [behind] commits behind origin/[branch]
[Action: git push | git pull | git pull && git push]

Today's Activity:
• Commits: [count] commits today
• First commit: [time] ([message])
• Last commit: [time] ([message])

🏃 Background Tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[If tasks running:]
Running: [count] tasks

1. [task-id] • npm run dev
   Duration: 2h 15m
   Status: ✅ Healthy
   URL: http://localhost:5173/

2. [task-id] • npm run test:watch
   Duration: 45m
   Status: ⚠️ 2 tests failing

[If no tasks:]
No background tasks running

[Suggestions:]
💡 Start dev server: npm run dev
💡 Start tests: npm run test:watch

✅ TodoWrite Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [completed]/[total] tasks ([percentage]% complete)

• Completed: [count]
• In Progress: [count] (current: [description])
• Pending: [count]

[If in-progress task:]
🚧 Currently Working On:
   [task description from TodoWrite]

[If no todos:]
No todos tracked (use TodoWrite to create task list)

💾 Session State
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[If SESSION_STATE.json exists:]
Last Save: [time ago] (session: [session-id])
Save Type: [checkpoint | save-and-clear | end-session]
Backup: ✅ CLAUDE.md.backup ([time ago])

[If CLAUDE.md has Current Session section:]
Current Focus (from CLAUDE.md):
• Working on: [current work from CLAUDE.md]
• Next action: [next action from CLAUDE.md]
• Blockers: [blockers or "None"]

[If no session state:]
No active session state found
💡 Use /project:checkpoint to start tracking

Checkpoints Today:
• Total: [count] checkpoints
• Last: [time ago] ([commit message])

Recent Sessions:
• [session-id] - [description] ([time ago])
• [session-id] - [description] ([time ago])

🎯 Recommendations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Smart recommendations based on state:]

[If uncommitted changes for > 30 min:]
⚠️ You have uncommitted changes. Consider:
   /project:checkpoint - Quick save progress

[If no checkpoints in > 1 hour:]
💡 Haven't checkpointed in a while. Consider:
   /project:checkpoint - Save current progress

[If tokens > 85%:]
🚨 Context usage high ([percentage]%). Strongly recommend:
   /project:save - Save state and clear context

[If ahead of remote:]
💡 You have [count] unpushed commits. Consider:
   git push origin [branch]

[If behind remote:]
⚠️ Your branch is behind remote. Consider:
   git pull origin [branch]

[If no background tasks but dev server expected:]
💡 Dev server not running. Start with:
   npm run dev

[If tests failing:]
⚠️ Tests are failing. Consider fixing before continuing.

[If no issues:]
✅ Everything looks good! You're ready to work.

⚡ Quick Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on current state, here's what you can do:

• /project:checkpoint - Save progress (recommended every 30-60 min)
• /project:save - Save and clear context (at [calculated token threshold]k tokens)
• /project:resume - Restart from last save
• /project:end-session - End work session

[If uncommitted:]
• git add . && git commit -m "[suggested message]" - Commit changes

[If ahead:]
• git push - Push to remote

[If behind:]
• git pull - Pull from remote

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status check complete • No files modified • Context preserved
```

## Output Variations

### Healthy State (< 70% tokens, clean git, running tasks)

```
📊 Project Status: ✅ Healthy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Context: 45,230 tokens (22.6%) - Plenty of room
✅ Git: Clean working tree on main
✅ Tasks: Dev server running (http://localhost:5173)
✅ Todos: 5/8 complete (63%)

🎯 Next: Continue with current task
💡 Checkpoint recommended in ~45 minutes
```

### Warning State (85% tokens OR uncommitted files)

```
📊 Project Status: ⚠️ Needs Attention
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Context: 172,340 tokens (86.2%) - Getting high!
⚠️ Git: 3 uncommitted files for 45 minutes
✅ Tasks: 2 running (dev + tests)
✅ Todos: 7/10 complete (70%)

🚨 RECOMMENDED ACTIONS:
1. /project:checkpoint - Save uncommitted work
2. /project:save - Clear context (recommended NOW)
```

### Critical State (> 95% tokens)

```
📊 Project Status: 🚨 CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 Context: 192,450 tokens (96.2%) - NEARLY FULL!
⚠️ Git: 2 uncommitted files
✅ Tasks: All running
✅ Todos: On track

🚨 URGENT: SAVE IMMEDIATELY!
→ /project:save

You're 1-2 interactions from hitting the limit.
Context will be lost if you don't save now.
```

### First Session (no state files)

```
📊 Project Status: New Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ️ Context: 25,120 tokens (12.6%) - Fresh start
✅ Git: on main, clean
❌ No session state found
❌ No todos tracked

💡 Getting Started:
• Use TodoWrite to create task list
• Use /project:checkpoint to start tracking
• This appears to be your first session with context management
```

## Smart Analysis Features

### 1. Token Usage Velocity

Track how fast tokens are accumulating:
```
📈 Token Usage Trend:
Last hour: +45k tokens (+22.5%)
Current rate: ~750 tokens/min
Estimated time to 85%: ~32 minutes

💡 Recommend checkpoint around [time]
```

### 2. Commit Patterns

```
📊 Commit Activity (Today):
8:30 AM - 2 commits (setup)
10:15 AM - 5 commits (active development)
2:00 PM - 1 commit (checkpoint)

Pattern: Regular activity, on track
```

### 3. Task Health

```
🏥 Task Health Check:
• npm run dev: ✅ Running 2h 15m, no errors
• npm run test:watch: ⚠️ Running 45m, 2 failures

Suggestion: Address test failures before continuing
```

### 4. Session Continuity

```
🔗 Session Timeline:
Today: 2h 30m (current)
Yesterday: 3h 45m (8 commits)
2 days ago: 2h 15m (5 commits)

Average: 2h 50m per session
Typical productivity: 4-6 commits/session
```

## Error Handling

**Git repository not found:**
```
⚠️ Not a Git Repository

This directory doesn't appear to be a git repository.
Git-related features will be limited.

Initialize git? (y/n)
```

**Can't read CLAUDE.md:**
```
ℹ️ CLAUDE.md not found or unreadable

Session tracking features limited.
Status based on git and tasks only.
```

**No /tasks command available:**
```
ℹ️ Background tasks: Unknown

Cannot detect running tasks.
Check manually with: ps aux | grep node
```

## Implementation Notes

- **READ-ONLY**: Absolutely no file modifications
- Run all git commands with no side effects
- Use --porcelain for machine-readable output
- Handle missing files gracefully
- Display "Unknown" rather than error for missing data
- Keep execution fast (< 2 seconds total)
- Use parallel command execution where possible
- Cache results to avoid redundant calls
- Format output for both human reading and quick scanning
- Use visual indicators (✅⚠️🚨) for quick status assessment
- Always end with actionable recommendations
- Adapt recommendations based on actual state
- Link to other commands for next steps
- Make it safe to run frequently (no overhead)
- Display generation timestamp for reference
