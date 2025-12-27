# End Session - Comprehensive Shutdown & Archive

Execute the following steps to safely end your work session with complete state preservation and optional cleanup.

## Purpose

Comprehensive end-of-session workflow for:
- End of work day
- Before vacation or extended break
- After completing major milestone
- Stopping work on project for a while

## Pre-flight Checks

1. **Check Token Usage:**
   - Run: `/context` command
   - If > 100k tokens: Suggest running `/project:save` first to clear context
   - Display: "Token usage is [count]. Recommend /project:save first? (y/n)"
   - If yes: Run `/project:save`, then resume end-session after user resumes

2. **Scan for Uncommitted Changes:**
   - Run: `git status --short`
   - Count uncommitted files
   - Display in summary

3. **List Background Tasks:**
   - Run: `/tasks` command
   - Parse and count all running tasks
   - Will ask user about these later

4. **Calculate Session Duration:**
   - Try to determine session start:
     - First commit today: `git log --since="today" --reverse --pretty=format:"%ct" | head -1`
     - Or estimate from SESSION_STATE.json if exists
     - Or default to "Unknown"
   - Calculate duration from start to now

## Session Summary Collection

Display comprehensive form:

```
📋 End of Session Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session Overview:
• Started: [calculated or estimated time]
• Duration: [calculated hours/minutes]
• Branch: [current branch]
• Commits today: [count from git log --since="today" --oneline | wc -l]
• Token usage: [current] ([percentage]%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please summarize your session:

1. What did you accomplish today? (bullet points recommended)
   💡 Auto-suggestions from commits:
   [Show recent commit messages as suggestions]

   > [user input - multiline supported]

2. Any bugs/issues encountered? (optional)
   > [user input or press Enter to skip]

3. What's the priority for next session?
   💡 Suggestions from todos:
   [Show pending todos]

   > [user input]

4. Rate this session's productivity (1-5, optional - for analytics):
   1 = Struggled  2 = Slow  3 = Normal  4 = Good  5 = Excellent
   > [user input or press Enter to skip]
```

## Capture Final State

Run these commands in parallel:

```bash
# Git comprehensive state
git branch --show-current
git log -1 --pretty=format:"%h %s"
git status --short
git log --since="today" --oneline | wc -l
git diff --stat HEAD

# Count lines changed today
git log --since="today" --pretty=tformat: --numstat | awk '{added+=$1; removed+=$2} END {print added, removed}'

# Environment
node --version
npm --version
pwd
```

Parse `/tasks` for all background processes.

## Create Session Archive File

Generate filename: `sessions/SESSION_[YYYY-MM-DD_HHMMSS].md`

Create comprehensive session report:

```markdown
# Session Report - [Month DD, YYYY H:MM AM/PM]

## Session Overview

- **Duration:** [calculated] hours [minutes] minutes
- **Branch:** [current branch]
- **Commits:** [count] commits today
- **Files Changed:** [count] files across [count] commits
- **Lines Changed:** +[added lines]/-[removed lines]
- **Token Usage:** [current]/[max] ([percentage]%)

## Accomplishments

[User answer 1, formatted as markdown bullets if not already]

## Issues Encountered

[User answer 2, or "None reported"]

## Next Session Priority

[User answer 3]

## Session Quality

**Rating:** [user answer 4]/5 [or "Not rated"]

## Technical State

### Git Status
- **Current Branch:** [branch name]
- **Status:** [clean | N uncommitted files]
- **Latest Commit:** [hash] "[message]"
- **Ahead/Behind:** [ahead] commits ahead, [behind] behind origin/[branch]

### Commit History (Today)

```
[Output of: git log --since="today" --oneline]
```

### File Changes Summary

```
[Output of: git diff --stat HEAD~[commit count today]..HEAD]
```

### Background Tasks

[For each task from /tasks:]
- **[Task ID]:** `[command]` - [status] ([duration if available])
  [URL if applicable]

### Uncommitted Changes

[If any:]
```
[Output of: git status --short]
```
[Else: "Clean working tree ✅"]

## Environment Snapshot

```json
{
  "node": "[version]",
  "npm": "[version]",
  "platform": "[detected platform]",
  "cwd": "[working directory]",
  "git": {
    "branch": "[branch]",
    "commit": "[hash]",
    "remote": "[remote URL if available]"
  }
}
```

## Session Statistics

- ✅ **Todos Completed:** [count from TodoWrite completed]
- 🚧 **Todos In Progress:** [count from TodoWrite in-progress]
- ⏸️ **Todos Pending:** [count from TodoWrite pending]
- 📝 **Commits Made:** [count today]
- ⏱️ **Session Duration:** [hours]h [minutes]m
- 🎯 **Productivity:** [rating]/5 [or "Not rated"]

## Resume Instructions

To resume this session later:

```bash
cd [working directory]
claude
# Then paste:
/project:resume [session ID]
```

Or manually:

```bash
git checkout [branch name]
# Then read CLAUDE.md and sessions/SESSION_[ID].md for context
```

## Quick Reference

**Session ID:** `[YYYY-MM-DD_HHMMSS]`
**Created:** [ISO timestamp]
**Branch:** [branch name]
**Last Commit:** [hash]

---

*Generated by Claude Code context management system*
```

Save this file to `sessions/SESSION_[ID].md`.

## Update CLAUDE.md

1. **Create Backup:**
   ```bash
   cp CLAUDE.md CLAUDE.md.backup
   ```

2. **Update "Current Session" section:**
   - Change status to: "Session ended"
   - Add end time
   - Keep all existing info

3. **Update "Recent Sessions" section:**
   Add this session to the top of the list:

   ```markdown
   ### 📚 Recent Sessions

   - **[Date Time]** - [Brief summary from accomplishments] ([session notes](sessions/SESSION_[ID].md))
   [... keep last 10 sessions, archive older ones]
   ```

4. **Update SESSION_STATE.json** (if exists):
   - Set `"sessionEnded": true`
   - Update timestamp
   - Add end time

## Cleanup Options

Display multi-select options:

```
🧹 Cleanup Options
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select cleanup actions (space to toggle, enter to confirm):

[ ] Stop all background tasks ([count] running)
[ ] Commit uncommitted changes ([count] files)
[X] Push to remote (recommended)
[ ] Clear node_modules (saves disk space)
[ ] Archive old session files (> 30 days)
[ ] None - keep everything as-is

Selected: [show selected items]
Confirm? (y/n):
```

## Execute Cleanup Actions

Based on user selections:

### 1. Stop Background Tasks

For each task:
```
Stopping task [task ID]: [command]
```

Run: `/tasks kill [task-id]` or appropriate kill command

Confirm:
```
✅ Stopped [count] background tasks
```

### 2. Commit Uncommitted Changes

```bash
git add .
git commit -m "end session: [date] - uncommitted work

[Brief summary from user's accomplishments]

Files: [list files from git status]

🤖 End-of-session auto-commit

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3. Commit Session Files

Always commit CLAUDE.md and session archive:

```bash
git add CLAUDE.md sessions/SESSION_[ID].md SESSION_STATE.json
git commit -m "end session: [date] - [brief summary]

Accomplished:
[Summarized from user answer 1 - first 2-3 bullets]

Next session priority:
[user answer 3]

Session stats:
- Duration: [duration]
- Commits: [count]
- Productivity: [rating]/5

🤖 End-of-session checkpoint

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 4. Push to Remote

If user selected push:

```bash
# Get current branch
BRANCH=$(git branch --show-current)

# Push with tracking
git push -u origin $BRANCH

# Show result
git log origin/$BRANCH..HEAD --oneline
```

If already up-to-date:
```
✅ Already up-to-date with origin/[branch]
```

If push fails:
```
⚠️ Push failed: [error message]
Continuing anyway - you can push manually later
```

### 5. Optional: Create Session Tag

Ask: "Create a git tag for this session? (y/n)"

If yes:
```bash
git tag -a "session-[YYYY-MM-DD]" -m "Session checkpoint: [brief summary]"
git push origin session-[YYYY-MM-DD]
```

## Generate Final Report

Display comprehensive end-of-session report:

```
✅ Session Ended Successfully!

📊 Session Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Duration:        [X hours Y minutes]
Commits:         [count] commits [pushed/not pushed]
Files Changed:   [count] files (+[added]/-[removed] lines)
Todos Done:      [completed]/[total] ([percentage]%)
Productivity:    [rating]/5 [or "Not rated"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Session Archived
   File: sessions/SESSION_[ID].md
   Size: [file size]
   ✅ Committed and [pushed/ready to push]

📝 Documentation Updated
   ✅ CLAUDE.md updated
   ✅ Backup created: CLAUDE.md.backup
   [✅ SESSION_STATE.json updated if exists]

🧹 Cleanup Performed
   [For each selected cleanup action:]
   ✅ [Action description]

🎯 Next Session Priority
   → [user's answer 3]

📚 Session Notes
   View full session report:
   cat sessions/SESSION_[ID].md

🔄 To Resume This Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Method 1 (Recommended):
   /project:resume [session ID]

Method 2 (Manual):
   git checkout [branch]
   Read sessions/SESSION_[ID].md for context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌙 Great work today!

Clear context now? (y/n):
```

## Optional: Clear Context

Wait for user confirmation:
- If 'y' or Enter: Run `/clear`
- If 'n': Exit and preserve context

If clearing:
```
Context cleared. Session ended.

To resume: /project:resume [session ID]

Goodbye! 👋
```

## Error Handling

**Git commit fails:**
- Don't abort entire end-session
- Save session file anyway
- Warn user
- Offer manual commit command

**Can't create session file:**
- Critical error
- Warn user
- Save summary to CLAUDE.md instead
- Don't clear context

**Background task won't stop:**
- Show error
- List remaining tasks
- Continue with other cleanup
- Warn user to manually kill

**Push fails:**
- Not critical
- Show error
- Continue with rest
- Remind user to push later

**CLAUDE.md locked:**
- Wait and retry
- If still locked, save session file anyway
- Don't update CLAUDE.md
- Warn user

## Smart Features

1. **Session Analytics:**
   - Track session patterns over time
   - Calculate average duration
   - Track productivity ratings
   - Suggest optimal session length

2. **Commit Analysis:**
   - Parse commit messages
   - Identify common patterns
   - Suggest accomplishments based on commits

3. **Auto-suggestions:**
   - Pull from git commits for accomplishments
   - Pull from todos for next priorities
   - Learn from past session summaries

4. **Smart Cleanup:**
   - Don't offer to clear node_modules if small
   - Don't offer to stop tasks if none running
   - Auto-select push if unpushed commits exist

5. **Session Continuity:**
   - Link to previous session if same branch
   - Show what changed since last session
   - Highlight if returning after long break

## Implementation Notes

- This is the MOST comprehensive command
- Can take 5-10 minutes to complete properly
- Worth the time for clean session endings
- Session files are permanent records (commit them!)
- Background tasks can be restarted easily
- Productivity ratings are optional but valuable
- Always create session file before cleanup
- Never lose data - save first, cleanup second
- Make it easy to resume - that's the goal
