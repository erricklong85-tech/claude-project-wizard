# Auto-Save - Background Automatic Checkpointing

Execute the following steps to enable or manage automatic background checkpointing.

## Purpose

Enable "set it and forget it" automatic checkpointing during active development. Use this when:
- Working on long coding sessions (> 2 hours)
- Want hands-free progress tracking
- Prone to forgetting manual checkpoints
- Want consistent checkpoint intervals

**This runs in the background and automatically triggers /project:checkpoint at regular intervals.**

## Usage

```
/project:auto-save                 # Start with defaults (30 min interval)
/project:auto-save 15              # Custom interval (15 minutes)
/project:auto-save 45              # Custom interval (45 minutes)
/project:auto-save stop            # Stop auto-save
/project:auto-save status          # Check if running
/project:auto-save config          # Show/edit configuration
```

## Step 1: Parse Command Arguments

Determine mode based on arguments:

- **No arguments** → Start with default settings
- **Number (5-120)** → Start with custom interval in minutes
- **"stop"** → Stop auto-save
- **"status"** → Show current status
- **"config"** → Interactive configuration

Validate interval:
```
if interval < 5:
  error: "Minimum interval is 5 minutes (too frequent causes overhead)"
if interval > 120:
  error: "Maximum interval is 120 minutes (2 hours - too infrequent)"
```

## Step 2: Configuration (if first time or "config" mode)

Display interactive configuration:

```
⚙️ Auto-Save Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Checkpoint Interval:
   Current: 30 minutes (default)
   Range: 5-120 minutes
   Recommended: 15-45 minutes

   Enter interval in minutes [30]: _

🎯 Checkpoint Conditions (when to checkpoint):
   Select conditions to check before checkpointing:

   [X] Files have changed (git status dirty)
   [X] At least 1 commit since last checkpoint
   [ ] Token usage increased > 10k tokens
   [X] TodoWrite todos have been updated
   [ ] Specific time of day (hourly on the hour)

   Toggle with space, Enter to confirm

📝 Commit Message Prefix:
   Current: "auto-checkpoint"

   Use custom prefix? (y/n): _
   [if yes] Enter prefix: _

🔔 Notifications:
   [ ] Show notification on each checkpoint
   [X] Only notify on errors
   [ ] Silent mode (no notifications)

   Select mode: _

💾 Save Configuration:
   [X] Save these settings for future sessions
   [ ] Use only for this session

   Confirm? (y/n): _
```

Save configuration to `.claude/auto-save.config.json`:

```json
{
  "interval": 30,
  "conditions": {
    "filesChanged": true,
    "commitsExist": true,
    "tokenIncrease": false,
    "todosUpdated": true,
    "timeOfDay": false
  },
  "commitPrefix": "auto-checkpoint",
  "notifications": "errors-only",
  "persistent": true,
  "lastStarted": null,
  "totalCheckpoints": 0
}
```

## Step 3: Start Auto-Save Loop

**IMPORTANT: This needs to run as a background process that doesn't block Claude's interaction.**

### Approach A: Bash Background Job (Simplest)

Create a shell script that loops:

```bash
#!/bin/bash
# .claude/auto-save-loop.sh

INTERVAL=$1  # in minutes
CONFIG_FILE=".claude/auto-save.config.json"
PID_FILE=".claude/auto-save.pid"

# Save PID
echo $$ > "$PID_FILE"

while true; do
  # Sleep for interval
  sleep $((INTERVAL * 60))

  # Check conditions from config
  FILES_CHANGED=$(git status --short | wc -l)

  # Read config
  if [ -f "$CONFIG_FILE" ]; then
    # Parse conditions (simplified - real version would parse JSON)
    CHECK_FILES=$(grep -q '"filesChanged": true' "$CONFIG_FILE" && echo 1 || echo 0)
  fi

  # Decide if checkpoint needed
  SHOULD_CHECKPOINT=0

  if [ $CHECK_FILES -eq 1 ] && [ $FILES_CHANGED -gt 0 ]; then
    SHOULD_CHECKPOINT=1
  fi

  # Execute checkpoint if conditions met
  if [ $SHOULD_CHECKPOINT -eq 1 ]; then
    # Trigger checkpoint via Claude
    # (This is the tricky part - need to signal Claude)
    echo "[$(date)] Auto-checkpoint triggered" >> .claude/auto-save.log

    # Create a signal file that Claude can detect
    touch .claude/auto-save-trigger
  fi
done
```

Start the background job:
```bash
bash .claude/auto-save-loop.sh 30 &
echo $! > .claude/auto-save.pid
```

### Approach B: Periodic Check (More Practical)

Instead of true background process, use a **state file** that Claude checks periodically:

```json
// .claude/auto-save-state.json
{
  "enabled": true,
  "interval": 30,
  "lastCheckpoint": "2025-12-26T21:30:00Z",
  "nextCheckpoint": "2025-12-26T22:00:00Z",
  "checkpointCount": 3
}
```

Claude can check this file after each tool use and trigger checkpoint if time elapsed.

**This is more practical since Claude controls the checkpoint execution.**

## Step 4: Monitoring & State Management

Create state file:

```bash
cat > .claude/auto-save-state.json << EOF
{
  "enabled": true,
  "interval": 30,
  "lastCheckpoint": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "nextCheckpoint": "$(date -u -d "+30 minutes" +"%Y-%m-%dT%H:%M:%SZ")",
  "checkpointCount": 0,
  "pid": $$,
  "startTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "conditions": {
    "filesChanged": true,
    "commitsExist": true,
    "tokenIncrease": false,
    "todosUpdated": true
  }
}
EOF
```

Create log file:
```bash
echo "[$(date)] Auto-save started with ${INTERVAL}min interval" >> .claude/auto-save.log
```

## Step 5: Display Confirmation

```
✅ Auto-Save Enabled!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Checkpoint Interval: Every 30 minutes
📝 Next checkpoint: ~9:00 PM (in 28 minutes)

🎯 Auto-save will checkpoint when:
   ✅ Files have changed (git status dirty)
   ✅ At least 1 commit since last checkpoint
   ✅ Todos have been updated

🔕 Notifications: Errors only

📊 Session Tracking:
   • Checkpoints created: 0
   • Started: 8:32 PM
   • PID: [process-id if applicable]

💡 Management Commands:
   • /project:auto-save status  - Check current status
   • /project:auto-save stop    - Disable auto-save
   • /project:auto-save config  - Change settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-save is now running in the background.
You can continue working normally!
```

## Status Command

When `/project:auto-save status` is run:

```bash
# Read state file
if [ ! -f ".claude/auto-save-state.json" ]; then
  echo "❌ Auto-save is not running"
  exit 0
fi

# Parse state
ENABLED=$(jq -r '.enabled' .claude/auto-save-state.json)
INTERVAL=$(jq -r '.interval' .claude/auto-save-state.json)
LAST=$(jq -r '.lastCheckpoint' .claude/auto-save-state.json)
NEXT=$(jq -r '.nextCheckpoint' .claude/auto-save-state.json)
COUNT=$(jq -r '.checkpointCount' .claude/auto-save-state.json)

# Calculate time since last and until next
# ... time calculations ...

# Display status
echo "📊 Auto-Save Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Status: ${ENABLED} $(if [ "$ENABLED" = "true" ]; then echo "✅ Running"; else echo "❌ Stopped"; fi)"
echo "Interval: $INTERVAL minutes"
echo "Next checkpoint: $NEXT (~XX minutes)"
echo ""
echo "Session Stats:"
echo "• Checkpoints created: $COUNT"
echo "• Last checkpoint: $LAST (XX minutes ago)"
echo "• Total runtime: XX hours XX minutes"
echo ""
echo "Conditions:"
# ... list active conditions ...
```

## Stop Command

When `/project:auto-save stop` is run:

```bash
# Check if running
if [ ! -f ".claude/auto-save-state.json" ]; then
  echo "ℹ️ Auto-save is not running"
  exit 0
fi

# Read PID if available
PID=$(jq -r '.pid' .claude/auto-save-state.json 2>/dev/null)

# Kill process if running
if [ -n "$PID" ] && kill -0 $PID 2>/dev/null; then
  kill $PID
  echo "✅ Stopped auto-save process (PID: $PID)"
else
  echo "ℹ️ No active process found (may have already stopped)"
fi

# Update state file
jq '.enabled = false' .claude/auto-save-state.json > .tmp && mv .tmp .claude/auto-save-state.json

# Log
echo "[$(date)] Auto-save stopped" >> .claude/auto-save.log

# Display summary
COUNT=$(jq -r '.checkpointCount' .claude/auto-save-state.json)
echo ""
echo "📊 Auto-Save Session Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Total checkpoints created: $COUNT"
echo "• Average interval: [calculated]"
echo "• Runtime: [calculated]"
echo ""
echo "✅ Auto-save stopped successfully"
```

## Checkpoint Trigger Logic

When Claude detects it's time to checkpoint (either via background signal or periodic check):

```bash
# Check if auto-save is enabled
if [ ! -f ".claude/auto-save-state.json" ]; then
  exit 0  # Not enabled
fi

ENABLED=$(jq -r '.enabled' .claude/auto-save-state.json)
if [ "$ENABLED" != "true" ]; then
  exit 0  # Disabled
fi

# Check if it's time
NEXT_CHECKPOINT=$(jq -r '.nextCheckpoint' .claude/auto-save-state.json)
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ "$CURRENT_TIME" < "$NEXT_CHECKPOINT" ]; then
  exit 0  # Not time yet
fi

# Check conditions
# ... evaluate each enabled condition ...

# If all conditions met, trigger checkpoint
if [ $CONDITIONS_MET -eq 1 ]; then
  echo "🤖 Auto-checkpoint triggered (interval elapsed)"

  # Run checkpoint command
  # /project:checkpoint --auto

  # Update state
  jq '.lastCheckpoint = "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'" |
      .nextCheckpoint = "'$(date -u -d "+${INTERVAL} minutes" +"%Y-%m-%dT%H:%M:%SZ")'" |
      .checkpointCount += 1' \
      .claude/auto-save-state.json > .tmp && mv .tmp .claude/auto-save-state.json

  # Log
  echo "[$(date)] Auto-checkpoint #$COUNT created" >> .claude/auto-save.log
fi
```

## Error Handling

**Config file corrupted:**
```
❌ Configuration Error

Auto-save config file is corrupted or invalid.

Recreate with defaults? (y/n)
```

**Checkpoint fails:**
```
⚠️ Auto-Checkpoint Failed

Error: [error message from checkpoint command]

Auto-save will retry at next interval.
Logged to: .claude/auto-save.log

Continue with auto-save? (y/n)
```

**Interval too aggressive:**
```
⚠️ High Checkpoint Frequency

You've set a 5-minute interval, which will create
12 checkpoints per hour.

This may clutter your git history.

Recommendations:
• 15 min - Active development
• 30 min - Normal work
• 45 min - Light work

Continue with 5-minute interval? (y/n)
```

**Disk space low:**
```
⚠️ Low Disk Space

Available: 500 MB
Auto-save creates checkpoints which consume disk space.

Options:
1. Continue (risky)
2. Stop auto-save
3. Increase interval to reduce frequency

Choice (1/2/3):
```

## Integration with Other Commands

**With /project:checkpoint:**
- Auto-save calls checkpoint with `--auto` flag
- Checkpoint knows it's automated (different commit message)
- Auto checkpoints are tagged differently in git log

**With /project:save:**
- If user manually runs `/project:save`, auto-save pauses
- Resets interval after manual save
- Logs manual intervention

**With /project:end-session:**
- End-session automatically stops auto-save
- Includes auto-save stats in session summary

## Smart Features

1. **Adaptive Intervals:**
   - Detect periods of inactivity (no commits for 30 min)
   - Temporarily pause auto-save during inactivity
   - Resume when activity detected

2. **Smart Conditions:**
   - Only checkpoint if meaningful changes exist
   - Skip if last checkpoint was < 5 min ago (even if interval elapsed)
   - Detect if in middle of operation (tests running, build in progress)

3. **Statistics Tracking:**
   - Average time between commits
   - Most productive hours
   - Checkpoint effectiveness score

4. **Conflict Avoidance:**
   - Don't checkpoint during git operations
   - Wait for background tasks to stabilize
   - Avoid checkpointing during file saves

## Implementation Notes

**Critical Constraints:**
- Claude Code doesn't have true background processes
- Must work within single-session context
- Can't rely on system cron or scheduled tasks
- State must persist in files
- Detection must be passive (file-based signals)

**Recommended Implementation:**
- Use state file (.claude/auto-save-state.json)
- Claude checks state after tool operations
- If interval elapsed + conditions met → auto-checkpoint
- Lightweight, no actual background process needed
- Works across Claude restarts (state persists)

**Alternative: Hook Integration**
- Use Claude Code hooks (if available)
- Hook: `on-tool-use-complete`
- Check auto-save state after each tool use
- Trigger checkpoint if needed

**File Locations:**
- State: `.claude/auto-save-state.json`
- Config: `.claude/auto-save.config.json`
- Logs: `.claude/auto-save.log`
- PID (if used): `.claude/auto-save.pid`

**Gitignore:**
Add to `.gitignore`:
```
.claude/auto-save-state.json
.claude/auto-save.log
.claude/auto-save.pid
```

Keep config tracked (for consistent settings across machines).
