# Enhanced Checkpoint - Smart Progress Save

Execute the following steps to create an intelligent checkpoint without clearing context.

## Pre-flight Checks

1. **Verify Git Repository:**
   - Run: `git rev-parse --git-dir 2>/dev/null`
   - If fails: Offer to `git init` or continue without git

2. **Check for Merge Conflicts:**
   - Run: `git diff --check`
   - If conflicts found: Alert user and abort

3. **Check Current Token Usage:**
   - Run: `/context` command
   - Parse the output to get current token count
   - If > 170k (85%): Suggest using `/project:save` instead

4. **Verify CLAUDE.md Exists:**
   - Check if CLAUDE.md exists in project root
   - If not found: Create basic structure or warn user

## Analyze Current State

Run these commands in parallel:

```bash
# Get detailed diff statistics
git diff --stat

# Get short status
git status --short

# Get current branch
git branch --show-current

# Get last commit
git log -1 --pretty=format:"%h %s"

# Count uncommitted files
git status --short | wc -l
```

## Generate Smart Commit Message

Based on the analysis:

**If 0 uncommitted files:**
- Display: "No changes detected since last checkpoint. Skip checkpoint? (y/n)"
- If yes: Exit gracefully
- If no: Continue with current state capture only

**If 1-2 files changed:**
- Use specific file names in message
- Example: "checkpoint: update App.tsx and store.ts validation"

**If 3+ files changed:**
- Analyze file patterns (same directory, same feature)
- Use feature/area description
- Example: "checkpoint: wizard Step 3 implementation"

**Branch awareness:**
- If branch is not main/master: Include branch context
- Example: "checkpoint: [feature/auth] add login validation"

**Message format:**
```
checkpoint: [scope] - [description]

Files: [changed files or summary]
Branch: [current branch]
Token usage: [current tokens] ([percentage]%)

🤖 Auto-generated checkpoint
```

## Interactive Prompt

Ask user (single prompt, not one-at-a-time):

```
📝 Checkpoint Wizard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-detected changes: [summarize changes from git diff]

1. Add context or modify message? (press Enter to accept, or type details)
   Suggested: "checkpoint: [auto-generated description]"
   > [user input or Enter]

2. What's your next action? (one line)
   > [user input]
```

## Update CLAUDE.md

1. **Create Backup:**
   ```bash
   cp CLAUDE.md CLAUDE.md.backup
   ```

2. **Find or Create "Current Session" Section:**
   - Search for: `### 🚧 Current Session`
   - If not found: Add after "Current Status" section
   - If CLAUDE.md doesn't have sections: Append at end

3. **Update Session Information:**
   - Timestamp: Current ISO format
   - Last Checkpoint: Current time + commit hash (after commit)
   - Branch: Current git branch
   - Token Usage: From /context
   - Accomplished: Keep existing or infer from commits
   - Currently Working On: User's answer or infer from changes
   - Next Actions: User's "next action" answer
   - Uncommitted Changes: From git status

4. **Use Edit tool to update** (preserve existing structure)

## Execute Commit

1. **Stage CLAUDE.md:**
   ```bash
   git add CLAUDE.md
   ```

2. **Commit with generated message:**
   ```bash
   git commit -m "[full commit message from above]"
   ```

3. **Capture commit hash:**
   ```bash
   git log -1 --pretty=format:"%h"
   ```

4. **Update CLAUDE.md with commit hash** (if not already included)

## Display Summary

Show confirmation:

```
✅ Checkpoint Created Successfully!

📝 Commit Message:
   [the commit message used]

💾 Commit Hash: [short hash]

📊 Current State:
   • Branch: [branch name]
   • Files changed: [count] files
   • Token usage: [count] ([percentage]% of limit)
   • Backup created: CLAUDE.md.backup

🎯 Next Action:
   [user's next action from prompt]

💡 Quick Actions:
   • /project:rollback - Undo this checkpoint if needed
   • /project:status - View current project status
   • /project:save - Save and clear context (if tokens getting high)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Context preserved. Continue working!
```

## Error Handling

**Git command fails:**
- Display error message
- Check if .git exists
- Offer to initialize repo or continue without git
- Never abort completely - always give user options

**CLAUDE.md locked/inaccessible:**
- Display which process has the file locked (if detectable)
- Wait 3 seconds and retry once
- If still locked: Offer to skip CLAUDE.md update
- Continue with git commit only

**Disk full:**
- Alert user immediately
- Display available disk space
- Abort operation (don't corrupt files)

**Commit fails (hooks, permissions, etc):**
- Display the exact error message
- Don't rollback any file changes
- Keep CLAUDE.md.backup for manual recovery
- Suggest manual commit command

**No changes but user forces checkpoint:**
- Create state capture in CLAUDE.md only
- No git commit
- Update timestamps and context

## Smart Features

1. **Auto-detect current task:**
   - Look at recent commit messages
   - Look at git diff file names
   - Look at existing CLAUDE.md "Currently Working On"
   - Suggest continuation if pattern detected

2. **Skip unnecessary checkpoints:**
   - If identical to last checkpoint (< 1 minute ago, no changes)
   - Warn user and ask to confirm

3. **Checkpoint numbering:**
   - Track checkpoint count in CLAUDE.md
   - Display: "Checkpoint #5 created"

4. **Token awareness:**
   - If tokens > 85%: Warn and suggest /project:save
   - If tokens > 95%: Strongly recommend /project:save, ask to confirm continuing

## Implementation Notes

- Run git commands from project root directory
- Use absolute paths when editing CLAUDE.md
- Preserve all existing CLAUDE.md content (only update session section)
- All operations should be non-destructive (backups first)
- ALWAYS create CLAUDE.md.backup before modifications
- Never clear context (that's what /project:save is for)
- Keep messages concise but informative
- Use emojis sparingly (only in headers/sections for visual hierarchy)
