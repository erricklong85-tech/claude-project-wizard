# Context Guard - Proactive Token Management

Execute the following steps to enable or manage automatic context usage monitoring and warnings.

## Purpose

Automatically monitor token usage and provide proactive warnings before hitting limits. Use this when:
- You want hands-free context management
- Prone to hitting token limits unexpectedly
- Want automatic save prompts at thresholds
- Need peace of mind during long sessions

**This monitors token usage and automatically warns/acts at configured thresholds.**

## Usage

```
/project:context-guard             # Enable with defaults
/project:context-guard custom      # Configure thresholds
/project:context-guard stop        # Disable monitoring
/project:context-guard status      # Check current status
```

## Default Thresholds

```
70% (140k tokens):  ℹ️ Info banner
85% (170k tokens):  ⚠️ Warning + suggest /project:save
95% (190k tokens):  🚨 Critical + auto-checkpoint
98% (196k tokens):  ⛔ Emergency + force /project:save
```

## Step 1: Configuration Setup

### Default Configuration

When started without "custom":

```bash
cat > .claude/context-guard.config.json << 'EOF'
{
  "enabled": true,
  "thresholds": {
    "info": {
      "percentage": 70,
      "tokens": 140000,
      "action": "display-banner",
      "message": "Context building up. Consider checkpointing soon.",
      "repeat": false
    },
    "warning": {
      "percentage": 85,
      "tokens": 170000,
      "action": "suggest-save",
      "message": "Context usage high. Recommend /project:save",
      "repeat": false,
      "autoCheckpoint": false
    },
    "critical": {
      "percentage": 95,
      "tokens": 190000,
      "action": "auto-checkpoint",
      "message": "CRITICAL: Context nearly full!",
      "repeat": true,
      "repeatInterval": 5000,
      "autoCheckpoint": true
    },
    "emergency": {
      "percentage": 98,
      "tokens": 196000,
      "action": "force-save",
      "message": "EMERGENCY: Context limit reached!",
      "autoSave": true,
      "blockActions": false
    }
  },
  "checkInterval": "after-each-tool-use",
  "lastCheck": null,
  "lastWarning": null,
  "warningHistory": [],
  "statistics": {
    "warningsIssued": 0,
    "autoCheckpoints": 0,
    "autoSaves": 0,
    "peakUsage": 0
  }
}
EOF
```

### Custom Configuration

If "custom" mode:

```
⚙️ Context Guard Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configure warning thresholds and actions:

📊 Threshold 1: Info Level
   Percentage: [70]% (140,000 tokens)
   Action: Display info banner
   Auto-checkpoint: [no]
   Repeat warning: [no]

📊 Threshold 2: Warning Level
   Percentage: [85]% (170,000 tokens)
   Action: Suggest /project:save
   Auto-checkpoint: [no]
   Repeat warning: [no]

📊 Threshold 3: Critical Level
   Percentage: [95]% (190,000 tokens)
   Action: Auto-checkpoint + strong warning
   Auto-checkpoint: [yes]
   Repeat warning: [yes] every [5] interactions

📊 Threshold 4: Emergency Level
   Percentage: [98]% (196,000 tokens)
   Action: Force /project:save
   Auto-save: [yes]
   Block further actions: [no]

🔔 Notification Style:
   [ ] Minimal (one-line notices)
   [X] Standard (formatted boxes)
   [ ] Verbose (detailed breakdowns)

💡 Smart Features:
   [X] Track token velocity (rate of increase)
   [X] Estimate time to next threshold
   [X] Suggest optimal save timing
   [ ] Auto-pause at thresholds (wait for confirmation)

💾 Save configuration? (y/n): _
```

Save to `.claude/context-guard.config.json`

## Step 2: Enable Monitoring

Create state file:

```bash
cat > .claude/context-guard-state.json << 'EOF'
{
  "enabled": true,
  "startTime": "2025-12-26T21:30:00Z",
  "currentTokens": 95000,
  "maxTokens": 200000,
  "percentage": 47.5,
  "thresholdsReached": [],
  "lastCheck": "2025-12-26T21:30:00Z",
  "checksPerformed": 0,
  "velocity": {
    "tokensPerMinute": 750,
    "averagePerInteraction": 2500,
    "trend": "increasing"
  }
}
EOF
```

Display confirmation:

```
✅ Context Guard Enabled!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ Monitoring: Active
📊 Current usage: 95,234 tokens (47.6%)

⚠️ Warning Thresholds:
   • 70% (140k) - Info banner
   • 85% (170k) - Suggest save
   • 95% (190k) - Auto-checkpoint
   • 98% (196k) - Force save

📈 Token Velocity:
   Current rate: ~750 tokens/minute
   Estimated time to 85%: ~98 minutes
   Suggested save around: 11:00 PM

💡 Management:
   • /project:context-guard status  - Check status
   • /project:context-guard stop    - Disable guard
   • /project:context-guard custom  - Reconfigure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Context guard is now monitoring token usage.
Continue working normally!
```

## Step 3: Monitoring Logic

**When to Check:**
- After each tool use (if configured)
- Every N interactions (if configured)
- On-demand via status command

**Check Procedure:**

```bash
# Read current token usage (from /context command or estimate)
CURRENT_TOKENS=95234
MAX_TOKENS=200000
PERCENTAGE=$(awk "BEGIN {print ($CURRENT_TOKENS / $MAX_TOKENS) * 100}")

# Read config
CONFIG=".claude/context-guard.config.json"
STATE=".claude/context-guard-state.json"

# Check each threshold
for threshold in info warning critical emergency; do
  THRESHOLD_PCT=$(jq -r ".thresholds.$threshold.percentage" "$CONFIG")
  THRESHOLD_TOKENS=$(jq -r ".thresholds.$threshold.tokens" "$CONFIG")
  ACTION=$(jq -r ".thresholds.$threshold.action" "$CONFIG")

  # Check if threshold reached
  if [ $(awk "BEGIN {print ($PERCENTAGE >= $THRESHOLD_PCT)}") -eq 1 ]; then
    # Check if already warned for this threshold
    ALREADY_WARNED=$(jq -r ".thresholdsReached | contains([\"$threshold\"])" "$STATE")

    if [ "$ALREADY_WARNED" != "true" ]; then
      # First time reaching this threshold
      trigger_warning "$threshold" "$ACTION"

      # Mark as reached
      jq ".thresholdsReached += [\"$threshold\"]" "$STATE" > .tmp && mv .tmp "$STATE"
    else
      # Check if repeat warning is enabled
      REPEAT=$(jq -r ".thresholds.$threshold.repeat" "$CONFIG")
      if [ "$REPEAT" = "true" ]; then
        # Check if enough interactions passed
        # ... repeat logic ...
        trigger_warning "$threshold" "$ACTION"
      fi
    fi
  fi
done

# Update state
jq ".currentTokens = $CURRENT_TOKENS |
    .percentage = $PERCENTAGE |
    .lastCheck = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\" |
    .checksPerformed += 1" "$STATE" > .tmp && mv .tmp "$STATE"
```

## Step 4: Warning Display

### Info Level (70%)

```
ℹ️ Context Info
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current usage: 140,523 tokens (70.3%)

You're doing great! Just a heads up that context is building up.
Consider checkpointing soon to preserve progress.

📊 Estimate: ~30k tokens remaining (~15-20 interactions)

💡 Quick action: /project:checkpoint

[This message won't repeat]
```

### Warning Level (85%)

```
⚠️ Context Warning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current usage: 170,234 tokens (85.1%)

🎯 Recommendation: Save and clear context soon

You have approximately 30k tokens left (~15 interactions).

Options:
1. /project:save - Save state and clear now (recommended)
2. /project:checkpoint - Quick save, keep working
3. Continue working (will warn again at 95%)

What would you like to do? (1/2/3 or Enter to continue)
```

Wait for user input:
- If 1: Execute `/project:save`
- If 2: Execute `/project:checkpoint`
- If 3 or Enter: Continue (will warn at 95%)

### Critical Level (95%)

```
🚨 CRITICAL: Context Limit Approaching
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current usage: 190,455 tokens (95.2%)
Remaining: Only ~10k tokens (~5 interactions)

⚠️ STRONG RECOMMENDATION: Save and clear immediately

🤖 Auto-checkpoint triggered: Creating emergency checkpoint...
   ✅ Checkpoint created: [hash]

Please take action NOW:
• Type: /project:save
• Or risk hitting the limit

[If auto-checkpoint configured:]
✅ Emergency checkpoint created automatically
💾 Your work is safe, but clear context soon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This warning will repeat every 5 interactions until you save.

Save now? (y/n):
```

If yes: Execute `/project:save`
If no: Continue with repeated warnings

### Emergency Level (98%)

```
⛔ EMERGENCY: Context Limit Reached
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current usage: 196,789 tokens (98.4%)
Remaining: < 4k tokens (2-3 interactions)

🚨 AUTOMATIC ACTION REQUIRED

Creating emergency save...
✅ State saved: SESSION_STATE.json
✅ Checkpoint created: [hash]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Resume Command (copy before clearing):

Read CLAUDE.md and SESSION_STATE.json. Continue with: [current task]. Dev server at http://localhost:5173.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If autoSave enabled:]
🤖 Executing automatic save in 10 seconds...
   Press Ctrl+C to cancel

   10... 9... 8...

[After countdown:]
   Executing: /project:save

[If autoSave disabled:]
⚠️ You MUST clear context manually:
   /project:save

Failure to act may result in context loss!
```

## Step 5: Token Velocity Tracking

Track rate of token increase:

```bash
# On each check
CURRENT_TIME=$(date +%s)
LAST_CHECK_TIME=$(jq -r '.lastCheck' "$STATE" | date -f - +%s)
TIME_DIFF=$((CURRENT_TIME - LAST_CHECK_TIME))

LAST_TOKENS=$(jq -r '.currentTokens' "$STATE")
TOKEN_DIFF=$((CURRENT_TOKENS - LAST_TOKENS))

# Calculate rate
TOKENS_PER_SECOND=$(awk "BEGIN {print $TOKEN_DIFF / $TIME_DIFF}")
TOKENS_PER_MINUTE=$(awk "BEGIN {print $TOKENS_PER_SECOND * 60}")

# Update velocity
jq ".velocity.tokensPerMinute = $TOKENS_PER_MINUTE |
    .velocity.lastCalculated = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"" \
    "$STATE" > .tmp && mv .tmp "$STATE"

# Estimate time to next threshold
NEXT_THRESHOLD=170000  # 85%
TOKENS_NEEDED=$((NEXT_THRESHOLD - CURRENT_TOKENS))
MINUTES_TO_THRESHOLD=$(awk "BEGIN {print $TOKENS_NEEDED / $TOKENS_PER_MINUTE}")

# Display in warnings
echo "📈 Token velocity: ~${TOKENS_PER_MINUTE} tokens/min"
echo "⏱️ Estimated time to 85%: ~${MINUTES_TO_THRESHOLD} minutes"
```

## Status Command

When `/project:context-guard status` is run:

```
📊 Context Guard Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: 9:45 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ Status: ✅ Active and monitoring

📊 Current Usage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tokens: 95,234 / 200,000 (47.6%)
Level: Normal ✅

Visual: [████████░░░░░░░░░░░░] 47.6%

📈 Velocity Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rate: ~750 tokens/minute
Trend: Increasing steadily
Peak usage: 95,234 tokens (current)

⏱️ Projections
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Time to 70% (140k): Already passed ✅
Time to 85% (170k): ~98 minutes (~11:23 PM)
Time to 95% (190k): ~125 minutes (~11:50 PM)

💡 Recommendation: Plan to /project:save around 11:15 PM

⚠️ Threshold Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 70% Info - Not reached
⏳ 85% Warning - ~98 min away
⏳ 95% Critical - ~125 min away
⏳ 98% Emergency - ~133 min away

📊 Session Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Monitoring since: 8:30 PM (1h 15m ago)
Checks performed: 127
Warnings issued: 0
Auto-checkpoints: 0
Auto-saves: 0

⚙️ Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thresholds: 70% / 85% / 95% / 98%
Auto-checkpoint at: 95%
Auto-save at: 98%
Check interval: After each tool use

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Everything looks good! Keep working.
   Next checkpoint recommended in ~1.5 hours.
```

## Stop Command

When `/project:context-guard stop` is run:

```bash
# Update state
jq '.enabled = false |
    .stoppedAt = "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"' \
    .claude/context-guard-state.json > .tmp && mv .tmp .claude/context-guard-state.json

# Display summary
WARNINGS=$(jq -r '.statistics.warningsIssued' .claude/context-guard-state.json)
CHECKPOINTS=$(jq -r '.statistics.autoCheckpoints' .claude/context-guard-state.json)
SAVES=$(jq -r '.statistics.autoSaves' .claude/context-guard-state.json)
PEAK=$(jq -r '.statistics.peakUsage' .claude/context-guard-state.json)

echo "✅ Context Guard Stopped"
echo ""
echo "📊 Session Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Warnings issued: $WARNINGS"
echo "• Auto-checkpoints: $CHECKPOINTS"
echo "• Auto-saves: $SAVES"
echo "• Peak usage: $PEAK tokens"
echo ""
echo "Context guard disabled. You can re-enable anytime with:"
echo "/project:context-guard"
```

## Error Handling

**Can't determine token usage:**
```
⚠️ Token Detection Failed

Cannot read current token usage.
Context guard requires token information to function.

This might mean:
• /context command unavailable
• Permission issues
• Claude Code version incompatibility

Continue without monitoring? (not recommended)
(y/n):
```

**Config file corrupted:**
```
❌ Configuration Error

Context guard config is corrupted.

Options:
1. Reset to defaults
2. Reconfigure from scratch
3. Disable context guard

Choice (1/2/3):
```

**Emergency save fails:**
```
🚨 EMERGENCY SAVE FAILED

Error: [error message]

Your context is at 98% and save failed!

IMMEDIATE ACTION REQUIRED:
1. Manually run: /project:checkpoint
2. Copy important information
3. Prepare to lose context

Retry save? (y/n):
```

## Integration with Other Commands

**With /project:checkpoint:**
- Resets threshold tracking after checkpoint
- Updates token count
- Recalculates velocity

**With /project:save:**
- Automatically stops guard during save
- Restarts after context clear
- Resets all thresholds

**With /project:auto-save:**
- Coordinates to avoid double-checkpointing
- Shares token usage data
- Can trigger auto-save early if critical

## Smart Features

1. **Adaptive Thresholds:**
   - Learn user behavior (when they typically save)
   - Adjust warning timing based on patterns
   - Reduce warnings if user consistently saves early

2. **Context Awareness:**
   - Don't warn during complex operations
   - Batch warnings (don't spam)
   - Quiet mode during presentations/demos

3. **Trend Analysis:**
   - Detect rapid token increase (complex task)
   - Predict when limit will be hit
   - Suggest save timing proactively

4. **Smart Recovery:**
   - If emergency save fails, try checkpoint
   - If checkpoint fails, create manual backup
   - Never lose data due to limits

## Implementation Notes

**Token Detection Methods:**
1. Parse `/context` command output (most accurate)
2. Estimate from conversation length (fallback)
3. Track incremental changes (supplementary)

**State Persistence:**
- State file survives Claude restarts
- Config file version controlled
- History logged for analysis

**Performance:**
- Lightweight checks (< 100ms)
- No blocking operations
- Async where possible

**Files:**
- State: `.claude/context-guard-state.json` (gitignored)
- Config: `.claude/context-guard.config.json` (tracked)
- Logs: `.claude/context-guard.log` (gitignored)
- History: `.claude/context-guard-history.jsonl` (optional, tracked)

## Usage Best Practices

1. **Enable early in session** (not when already at 80%)
2. **Trust the warnings** (designed conservatively)
3. **Don't disable during critical work** (when you need it most)
4. **Review velocity** (understand your usage patterns)
5. **Combine with auto-save** (maximum protection)

The goal: **Never hit the context limit unexpectedly.**
