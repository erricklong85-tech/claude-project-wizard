# Resume Session - Smart Restart

Execute the following steps to intelligently restart from a saved session state.

## Purpose

Automatically restore your development environment and context from a previous session. Use this when:
- Starting a new Claude Code session
- After running `/project:save` and clearing context
- Resuming work after a break
- Switching between projects

## Usage

```
/project:resume                          # Resume from last session
/project:resume 2025-12-26_170000       # Resume from specific session ID
/project:resume --list                   # List available sessions
```

## Step 1: Find Target Session

**If no argument provided:**
1. Look for SESSION_STATE.json in project root
2. If found: Use this as the session to resume
3. If not found: Look for most recent session file in `sessions/` directory
4. If no sessions found: Display error and exit

**If session ID provided (e.g., 2025-12-26_170000):**
1. Look for `sessions/SESSION_[ID].md`
2. If found: Use this session
3. If not found: Display error with available sessions

**If --list flag:**
1. Find all files in `sessions/` directory
2. Parse session files for metadata
3. Display list:
   ```
   📚 Available Sessions
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   1. 2025-12-26_170000 (2 hours ago)
      Testing context management commands
      Duration: 3h 45m | Commits: 8 | Branch: feature/context-management-v2

   2. 2025-12-25_143000 (yesterday)
      Testing wizard Step 1-2
      Duration: 2h 30m | Commits: 5 | Branch: master

   3. 2025-12-24_091500 (2 days ago)
      Initial wizard setup
      Duration: 4h 15m | Commits: 12 | Branch: master

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Use: /project:resume [session-id]
   ```
4. Exit after display

## Step 2: Parse Session State

**If using SESSION_STATE.json:**
1. Read and parse JSON file
2. Extract all fields:
   - git.branch
   - git.uncommittedChanges
   - backgroundTasks
   - todos
   - userContext
   - resumeCommand
3. Validate all referenced files still exist
4. Check if git branch still exists

**If using session file (.md):**
1. Read session markdown file
2. Parse sections to extract:
   - Branch name (from Technical State section)
   - Accomplishments
   - Next priorities
   - Background tasks
   - Session duration
3. Extract resume instructions from "Resume Instructions" section

## Step 3: Display Session Overview

Show comprehensive preview before restoring:

```
📂 Resuming Session: December 26, 2025 5:00 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Last worked on: 2 hours ago
⏱️ Session duration: 3h 45m
🌿 Branch: feature/context-management-v2
📝 Commits made: 8

✅ Accomplished:
• Created context management foundation
• Implemented Tier 1 core commands
• Tested /project:checkpoint

🚧 Was working on:
• Testing Phase 1 checkpoint command
• Preparing for Phase 2 implementation

🎯 Next action:
• Complete Phase 1D testing, then move to Phase 2

⚠️ Issues/Blockers:
• None reported

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 4: Validate Environment

Run validation checks:

```bash
# 1. Check current vs saved branch
CURRENT_BRANCH=$(git branch --show-current)
SAVED_BRANCH="[from session state]"

if [ "$CURRENT_BRANCH" != "$SAVED_BRANCH" ]; then
  echo "⚠️ Branch mismatch!"
  echo "   Current: $CURRENT_BRANCH"
  echo "   Session was on: $SAVED_BRANCH"
  echo ""
  echo "Switch to $SAVED_BRANCH? (y/n)"
  # Wait for input
  # If yes: git checkout $SAVED_BRANCH
fi

# 2. Check for new commits since session
git log $SAVED_COMMIT..HEAD --oneline

if [ $? -eq 0 ] && [ -n "$(git log $SAVED_COMMIT..HEAD --oneline)" ]; then
  echo "ℹ️ New commits since last session:"
  git log $SAVED_COMMIT..HEAD --oneline
  echo ""
  echo "This is expected? (y/n)"
fi

# 3. Check for file conflicts
SAVED_FILES="[from uncommittedChanges]"
git status --short

# Compare current uncommitted with saved
# Alert if different
```

Display validation results:

```
🔍 Environment Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Branch matches: feature/context-management-v2
✅ No new commits since session (last: 0c84a28)
⚠️ Uncommitted files differ:
   Session had: 0 files
   Current has: 2 files (CLAUDE.md, test.txt)

   Is this expected? Common if you manually changed files.

ℹ️ Background tasks: Not running (can restart)
✅ All referenced files exist

Continue with resume? (y/n)
```

## Step 5: Restore Environment Options

Display multi-select options:

```
🔧 Environment Restoration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select what to restore (space to toggle, enter to confirm):

[X] Switch to session branch (feature/context-management-v2)
[X] Restore TodoWrite state
[ ] Restart background tasks ([count] tasks)
    → npm run dev (will start at http://localhost:5173)
    → npm run test:watch
[ ] Install dependencies (if package.json changed)
    → npm install (only if package.json modified since session)
[ ] None - manual setup

Selected: 2 items
Continue? (y/n)
```

## Step 6: Execute Restoration

Based on user selections:

### Switch Branch (if selected)

```bash
git checkout [session-branch]
echo "✅ Switched to branch: [session-branch]"
```

### Restore TodoWrite State (if selected)

Use TodoWrite tool to restore todos from session state:

```
Parsing session todos:
• Completed: [list from session.todos.completed]
• In Progress: [list from session.todos.inProgress]
• Pending: [list from session.todos.pending]
```

Call TodoWrite with restored todo list, marking the first in-progress item as current.

Display:
```
✅ Todos Restored:
   ✅ [count] completed
   🚧 [count] in progress (resuming: [first in-progress item])
   ⏳ [count] pending
```

### Restart Background Tasks (if selected)

For each task from session state:

```bash
# Example: Restart dev server
echo "Starting: npm run dev"
npm run dev &
NEW_TASK_ID=$!

# Capture new task ID
echo "✅ Started: npm run dev (new task: $NEW_TASK_ID)"
echo "   URL: http://localhost:5173"

# Wait a moment for server to start
sleep 3

# Verify it's running
if lsof -i :5173 >/dev/null 2>&1; then
  echo "   ✅ Server is live"
else
  echo "   ⚠️ Server may not have started - check manually"
fi
```

Display summary:
```
✅ Background Tasks Started:
   • npm run dev → http://localhost:5173 (task: [new-id])
   • npm run test:watch (task: [new-id])

💡 New task IDs differ from session (normal after restart)
```

### Install Dependencies (if selected)

```bash
echo "📦 Checking for dependency changes..."

# Compare package.json from session commit vs current
git diff [session-commit] package.json

if [ $? -eq 0 ] && [ -n "$(git diff [session-commit] package.json)" ]; then
  echo "📦 package.json changed - installing dependencies..."
  npm install
else
  echo "✅ No dependency changes detected"
fi
```

## Step 7: Set Context

Display final context summary to help Claude understand where we are:

```
✅ Session Restored Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Current Focus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[userContext.currentWork from session]

📍 Next Action
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[userContext.nextAction from session]

🌐 Active Environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Branch: [branch name]
• Dev server: [URL] (task: [task-id])
• Last commit: [hash] "[message]"
• Uncommitted files: [count]

📚 Quick Context Recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Previously accomplished:
[First 3 bullet points from accomplishments]

Session stats:
• Duration: [duration]
• Commits: [count]
• Time since: [elapsed time]

⚠️ Known Blockers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[userContext.blockers or "None"]

💡 Ready to Continue!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?
1. Continue with "[next action from session]" (recommended)
2. Review changes since last session (git diff)
3. Check current project status (/project:status)
4. Switch to different task

Your choice (1/2/3/4 or describe):
```

## Step 8: Interactive Next Steps

Based on user choice:

**Choice 1 (Continue with next action):**
- Display: "Great! Continuing with: [next action]"
- Update TodoWrite to mark that action as in_progress
- Ready to work

**Choice 2 (Review changes):**
```bash
echo "📊 Changes since session commit [hash]:"
git diff [session-commit]..HEAD --stat
git diff [session-commit]..HEAD
```

**Choice 3 (Project status):**
- Run `/project:status` command

**Choice 4 (Different task):**
- Ask: "What would you like to work on instead?"
- Update context accordingly

## Error Handling

**No session files found:**
```
⚠️ No Sessions Found

Couldn't find any session state to resume from.

Checked:
• SESSION_STATE.json (not found)
• sessions/ directory (empty or doesn't exist)

This might be your first session, or sessions haven't been saved yet.

💡 To create a session:
• Use /project:checkpoint to save progress
• Use /project:save to save and clear context
• Use /project:end-session at end of work

Start fresh? (y/n)
```

**Session file corrupted/invalid:**
```
❌ Session File Error

File: [session-file]
Error: [JSON parse error or missing fields]

Available sessions:
[List other sessions]

Try a different session? (y/n)
```

**Git branch deleted:**
```
⚠️ Branch Not Found

Session was on branch: [saved-branch]
This branch no longer exists.

Options:
1. Create new branch with same name
2. Continue on current branch ([current-branch])
3. Choose different branch
4. Cancel resume

Choice (1/2/3/4):
```

**Background task won't start:**
```
⚠️ Task Start Failed

Command: [command]
Error: [error message]

Options:
1. Retry
2. Skip this task
3. Start manually later

Choice (1/2/3):
```

**File conflicts:**
```
⚠️ File Conflict Detected

Session expected:
• [file1] to be uncommitted
• [file2] to be clean

Current state:
• [file1] is clean
• [file2] has changes

This might indicate:
• You worked outside the session
• Git state changed
• Files were committed/modified

Continue anyway? (y/n)
```

## Smart Features

1. **Time-based suggestions:**
   - If session > 7 days old: "This is an old session. Code may have changed significantly. Review recent commits?"
   - If session < 1 hour old: "Recent session! Picking up right where you left off."

2. **Branch awareness:**
   - If resuming on different branch than saved: Strong warning
   - If branch has diverged: Show divergence details
   - Suggest fetching/pulling if remote changes

3. **Conflict detection:**
   - If multiple sessions on same branch: Ask which to use
   - If overlapping sessions: Warn about potential confusion

4. **Learning from patterns:**
   - Remember user preferences (always restart dev server? never install deps?)
   - Adapt restoration suggestions based on history

5. **Session continuity:**
   - Link to previous/next sessions on same branch
   - Show related sessions (same feature)
   - Build session chains for feature work

6. **Smart defaults:**
   - Auto-select most common options
   - Skip prompts if only one valid choice
   - Batch similar actions together

## Implementation Notes

- Always validate session data before acting
- Be defensive with file operations (check existence)
- Don't assume git state matches session
- Background tasks get new PIDs (can't restore original)
- TodoWrite state is best-effort (may not be 100% accurate)
- User should always confirm before major actions
- Display comprehensive context for Claude to understand
- Make resume command idempotent (safe to run multiple times)
- If in doubt, ask user rather than assume
- Preserve all user context from session for continuity
