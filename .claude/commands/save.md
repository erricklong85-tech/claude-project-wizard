# Smart Save & Clear - Intelligent Context Reset

Execute the following steps to save complete state, generate resume command, and clear context safely.

## Purpose

Save full session state before clearing context. Use this when:
- Token usage > 80k (40% of limit) - approaching limit
- Switching to completely different task
- Before long break (> 1 hour)
- Context feels cluttered/unfocused

## Pre-flight Checks

1. **Check Token Usage:**
   - Run: `/context` command
   - Parse current token count
   - If < 80k: Display warning
     ```
     ℹ️ Token usage is only [count] ([percentage]%).
     You have plenty of room left. Save anyway? (y/n)
     ```
   - If user says no: Exit gracefully

2. **Check for Uncommitted Changes:**
   - Run: `git status --short`
   - If uncommitted changes found:
     ```
     ⚠️ You have [count] uncommitted files.

     Options:
     1. Commit them now (recommended)
     2. Continue anyway (they'll be saved in state)
     3. Cancel save

     Choice (1/2/3):
     ```
   - If option 1: Run `/project:checkpoint` first, then resume save

3. **List Background Tasks:**
   - Run: `/tasks` command
   - Parse all running tasks
   - Display count: "[count] background tasks running"

4. **Check TodoWrite State:**
   - Check if TodoWrite todos exist
   - Parse completed, in-progress, pending items

## Interactive State Capture

Display consolidated prompt (NOT one-at-a-time):

```
📝 Context Save Wizard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current session info:
• Branch: [current branch]
• Last commit: [hash] [message]
• Token usage: [count] ([percentage]%)
• Background tasks: [count] running

Please provide context for resuming:

1. What did you just accomplish? (bullet points or summary)
   > [user input]

2. What are you working on now?
   > [user input]

3. What should happen next?
   > [user input]

4. Any issues or blockers? (optional)
   > [user input or press Enter to skip]

💡 Tip: Press Enter on any field to auto-fill from git/todos
```

## Capture Complete State

Run these commands in parallel:

```bash
# Git information
git log -1 --pretty=format:"%h %s"
git status --short
git branch --show-current
git rev-list --count --left-right @{upstream}...HEAD 2>/dev/null || echo "0	0"

# Environment
node --version
npm --version
uname -s || echo "Windows"
pwd
```

Parse `/tasks` output to get background tasks with:
- Task ID
- Command
- Status
- URL (if applicable, like dev servers)

## Generate SESSION_STATE.json

Create SESSION_STATE.json in project root with this structure:

```json
{
  "timestamp": "[ISO 8601 current time]",
  "sessionId": "[YYYY-MM-DD_HHMMSS format]",
  "sessionEnded": false,
  "git": {
    "branch": "[current branch]",
    "lastCommit": {
      "hash": "[short hash]",
      "message": "[commit message]"
    },
    "uncommittedChanges": ["[array of file paths from git status]"],
    "remote": {
      "ahead": [commits ahead],
      "behind": [commits behind]
    }
  },
  "backgroundTasks": [
    {
      "id": "[task ID]",
      "command": "[command that started task]",
      "status": "running",
      "startTime": "[ISO time if available]",
      "url": "[URL if dev server, else null]"
    }
  ],
  "todos": {
    "completed": ["[array of completed todo strings]"],
    "inProgress": ["[array of in-progress todo strings]"],
    "pending": ["[array of pending todo strings]"]
  },
  "tokenUsage": {
    "current": [token count],
    "max": 200000,
    "percentage": [calculated percentage]
  },
  "userContext": {
    "accomplished": "[user answer 1]",
    "currentWork": "[user answer 2]",
    "nextAction": "[user answer 3]",
    "blockers": "[user answer 4 or empty string]"
  },
  "environment": {
    "node": "[version]",
    "npm": "[version]",
    "platform": "[win32/darwin/linux]",
    "cwd": "[working directory]"
  },
  "resumeCommand": "[generated below]",
  "metadata": {
    "sessionDuration": [calculated from session start if available, else 0],
    "checkpointCount": [count from CLAUDE.md or 0],
    "commitCount": [commits today from git log --since="today"]
  }
}
```

## Generate Resume Command

Create optimized resume command based on state:

```
Read CLAUDE.md and SESSION_STATE.json. Current: [currentWork from user]. Next: [nextAction from user]. [Background task info if any].
```

Example:
```
Read CLAUDE.md and SESSION_STATE.json. Current: Implementing /project:save command. Next: Test state preservation and integration. Dev server running at http://localhost:5173 (task b5585c9).
```

Store this in `resumeCommand` field of SESSION_STATE.json.

## Update CLAUDE.md

1. **Create Backup:**
   ```bash
   cp CLAUDE.md CLAUDE.md.backup
   ```

2. **Update "Current Session" Section:**

Add or update this section (preserve existing structure):

```markdown
### 🚧 Current Session ([session date/time])

**Status:** Ready to resume
**Session ID:** [sessionId from JSON]
**Started:** [session start time if known]
**Last Checkpoint:** [current time]
**Branch:** [git branch]
**Token Usage:** [current]/[max] ([percentage]%)

#### Accomplished This Session
[user answer 1, formatted as bullets if not already]

#### Currently Working On
[user answer 2]

#### Next Actions
[user answer 3, formatted as checklist]

#### Active Environment
- **Dev Server:** [URL from background tasks, or "None"]
- **Background Tasks:**
  [list each task: `command` (task: ID, status)]
- **Uncommitted Changes:**
  [list files or "Clean working tree"]

#### Blockers/Issues
[user answer 4 or "None"]

#### Resume Command
```
[the exact resume command from SESSION_STATE.json]
```
```

3. **Update "Recent Sessions" Section:**

Add link to this session (we'll create session file in end-session):

```markdown
### 📚 Recent Sessions

- **[Date Time]** - [Brief summary from currentWork] ([session ID])
```

## Commit State

1. **Stage Files:**
   ```bash
   git add CLAUDE.md SESSION_STATE.json
   ```

2. **Commit:**
   ```bash
   git commit -m "save: context checkpoint at [percentage]% token usage

   Accomplished: [brief summary of user answer 1]
   Next: [user answer 3]

   Background tasks: [count] running
   Uncommitted files: [count]

   🤖 Auto-save before context clear

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

3. **Capture commit hash:**
   ```bash
   git log -1 --pretty=format:"%h"
   ```

## Display Resume Instructions

Show comprehensive resume guide:

```
✅ Complete State Saved Successfully!

📊 Context Reduction
   Before: [current tokens] ([percentage]%)
   After clear: ~20k (10%) [estimated]
   Reduction: ~[calculated] tokens ([reduction percentage]%)

💾 State Files
   ✅ SESSION_STATE.json created
   ✅ CLAUDE.md updated
   ✅ Backup created: CLAUDE.md.backup
   ✅ Changes committed: [commit hash]

📋 Captured State
   • Git: [branch] ([ahead/behind info])
   • Todos: [completed] completed, [in-progress] active, [pending] pending
   • Tasks: [count] background processes
   • Uncommitted: [count] files

🎯 To Resume After Clearing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Copy and paste this exact command:

[THE RESUME COMMAND FROM SESSION_STATE.JSON]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT: Copy the command above before clearing!

Ready to clear context? (y/n):
```

## Wait for Confirmation

- Wait for user to type 'y' or press Enter
- If 'n' or anything else: Exit without clearing
- User can copy the resume command while deciding

## Clear Context

On confirmation:

```
Clearing context in 3... 2... 1...

/clear
```

Execute the `/clear` command.

## Error Handling

**Git fails:**
- Save SESSION_STATE.json anyway
- Warn user
- Don't clear context
- Offer manual commit

**CLAUDE.md locked:**
- Save SESSION_STATE.json
- Skip CLAUDE.md update
- Warn user
- Continue to commit and clear

**SESSION_STATE.json write fails:**
- ABORT - don't clear context
- Critical error - user loses state if we clear
- Show error and exit

**Disk full:**
- ABORT - don't clear context
- Alert user
- Free up space first

**User cancels during prompts:**
- Clean exit
- No changes made
- Context preserved

## Smart Features

1. **Auto-fill from context:**
   - If user presses Enter on prompts, attempt to auto-fill:
     - Accomplished: Summarize from recent commits
     - Currently working on: From CLAUDE.md existing section
     - Next action: Infer from todos or branch name

2. **Validate resume command:**
   - Test that CLAUDE.md and SESSION_STATE.json exist before clearing
   - Ensure resume command is not empty
   - Check that referenced files are readable

3. **Session history:**
   - Track last 5 session IDs
   - Store in .claude/session_history.json (optional)
   - Use for /project:resume --list

4. **Token usage trends:**
   - Compare to last save
   - Show if usage increased rapidly
   - Suggest auto-save if pattern detected

## Implementation Notes

- This is a DESTRUCTIVE operation (clears context)
- Triple-check all state is saved before clearing
- ALWAYS wait for user confirmation
- Make resume command as clear as possible
- Test SESSION_STATE.json is valid JSON before clearing
- Background tasks keep running after context clear
- Git state remains unchanged (just context clears)
- Users can Ctrl+C to cancel at any time
