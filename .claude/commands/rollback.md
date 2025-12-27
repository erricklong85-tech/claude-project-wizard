# Rollback - Undo Last Checkpoint/Save

Execute the following steps to safely undo the last checkpoint, save, or end-session operation.

## Purpose

Safely revert to the previous state when:
- Checkpoint captured wrong state
- Commit message was incorrect
- Need to undo recent checkpoint
- Testing rollback functionality
- Accidentally checkpointed too early

**IMPORTANT: This is a DESTRUCTIVE operation. Use with caution.**

## Usage

```
/project:rollback              # Undo last checkpoint/save operation
/project:rollback --list       # List recent checkpoints
/project:rollback <commit-hash> # Rollback to specific commit
/project:rollback --dry-run    # Show what would be rolled back
```

## Pre-flight Safety Checks

1. **Verify uncommitted work:**
   ```bash
   git status --short
   ```

   If uncommitted changes exist:
   ```
   ⚠️ Uncommitted Changes Detected

   You have [count] uncommitted files.
   Rolling back may lose this work if it conflicts.

   Uncommitted files:
   [list files]

   Options:
   1. Stash changes first (recommended)
   2. Commit changes first
   3. Continue anyway (risky!)
   4. Cancel rollback

   Choice (1/2/3/4):
   ```

2. **Verify rollback target exists:**
   Check for checkpoint/save commits:
   ```bash
   git log --grep="checkpoint:" -1 --pretty=format:"%H %s"
   git log --grep="save:" -1 --pretty=format:"%H %s"
   git log --grep="end session:" -1 --pretty=format:"%H %s"
   ```

3. **Check if already pushed:**
   ```bash
   git log origin/[branch]..HEAD
   ```

   If last checkpoint was pushed:
   ```
   ⚠️ WARNING: Pushed to Remote

   The checkpoint you want to rollback (commit [hash]) has been
   pushed to origin/[branch].

   Rolling back requires FORCE PUSH which can cause issues for others.

   Are you sure you want to continue? (yes/NO)
   [Require typing "yes" in full to confirm]
   ```

## Step 1: Find Rollback Target

### If no arguments (default: rollback last checkpoint)

```bash
# Find last checkpoint/save/end-session commit
LAST_CHECKPOINT=$(git log --grep="checkpoint:\|save:\|end session:" -1 --pretty=format:"%H")
```

Parse commit details:
```bash
git show --stat $LAST_CHECKPOINT
```

### If --list flag

Display recent checkpoints:

```
📚 Recent Checkpoints
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 0c84a28 (15 minutes ago) [CURRENT]
   checkpoint: test Phase 1 checkpoint functionality
   Files: CLAUDE.md (+42)

2. c26b366 (2 hours ago)
   feat: implement Tier 1 core commands (Phase 1A-C)
   Files: 3 files (+1113)

3. 3d5bb43 (3 hours ago)
   feat: add context management foundation (Phase 0)
   Files: 6 files (+431)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use: /project:rollback <commit-hash>
Example: /project:rollback c26b366
```

Exit after displaying list.

### If commit hash provided

Validate hash exists:
```bash
git rev-parse --verify $COMMIT_HASH
```

If invalid:
```
❌ Invalid Commit Hash

Commit "$COMMIT_HASH" not found.

Use /project:rollback --list to see available commits.
```

## Step 2: Show Rollback Preview

Display what will be rolled back:

```
⚠️ Rollback Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Current State:
   Commit: 0c84a28
   Message: "checkpoint: test Phase 1 checkpoint functionality"
   Time: 15 minutes ago
   Files: CLAUDE.md (+42)

⏪ Will rollback to:
   Commit: c26b366
   Message: "feat: implement Tier 1 core commands (Phase 1A-C)"
   Time: 2 hours ago

🔍 Changes that will be UNDONE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

git diff c26b366..0c84a28:

 CLAUDE.md | 42 ++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 42 insertions(+)

[Show actual diff of changes that will be lost]

⚠️ Files affected:
• CLAUDE.md will revert to state from 2 hours ago

⚠️ You will lose:
• Current Session section added to CLAUDE.md
• Session tracking updates
• ~42 lines of content

✅ Safety Measures:
• CLAUDE.md.backup exists (created 15 min ago) ✅
• Can re-apply changes from backup if needed
• Backup will be preserved at: CLAUDE.md.rollback-backup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This will:
✅ Restore CLAUDE.md to previous state
✅ Remove commit 0c84a28 from history
✅ Preserve your current uncommitted changes (if any)
✅ Keep a backup for recovery

Continue with rollback? (y/n)
```

## Step 3: Execute Rollback

Based on rollback method:

### Method A: Git Revert (Safest - adds new commit)

Best when commit was pushed or when you want to keep history:

```bash
echo "Creating revert commit..."

# Revert the commit (creates new commit that undoes changes)
git revert $CHECKPOINT_COMMIT --no-edit

# Customize revert commit message
git commit --amend -m "rollback: revert checkpoint $SHORT_HASH

Reverted commit: $SHORT_HASH
Original message: $ORIGINAL_MESSAGE
Reason: User-requested rollback via /project:rollback

Files restored:
$FILES_LIST

🤖 Automated rollback

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

echo "✅ Rollback complete (via git revert)"
```

### Method B: Git Reset (Clean history - removes commit)

Best when commit not pushed and you want clean history:

```bash
echo "Resetting to previous commit..."

# Create safety backup of current state
cp CLAUDE.md CLAUDE.md.rollback-backup
echo "✅ Created safety backup: CLAUDE.md.rollback-backup"

# Reset to previous commit (keeps working directory changes)
git reset --soft HEAD~1

echo "✅ Commit removed from history"
echo "ℹ️ Files kept in staging area (not lost)"
```

### Method C: Restore from Backup (CLAUDE.md only)

Best when you just want to restore CLAUDE.md without affecting git:

```bash
echo "Restoring from backup..."

# Verify backup exists
if [ -f "CLAUDE.md.backup" ]; then
  # Create rollback backup first
  cp CLAUDE.md CLAUDE.md.rollback-backup

  # Restore from backup
  cp CLAUDE.md.backup CLAUDE.md

  echo "✅ CLAUDE.md restored from backup"
  echo "ℹ️ Git history unchanged"
  echo "💾 Previous state saved to: CLAUDE.md.rollback-backup"
else
  echo "❌ No backup file found (CLAUDE.md.backup)"
  echo "Cannot restore without backup"
  exit 1
fi
```

## Step 4: Handle Edge Cases

### If uncommitted changes conflict

```bash
# Check if uncommitted changes conflict with rollback
git status --short

# If conflicts detected
if [ conflicts ]; then
  echo "⚠️ Conflict Detected"
  echo ""
  echo "Your uncommitted changes conflict with the rollback."
  echo ""
  echo "Options:"
  echo "1. Stash current changes, rollback, then re-apply stash"
  echo "2. Commit current changes first, then rollback"
  echo "3. Abort rollback"
  echo ""
  read -p "Choice (1/2/3): " choice

  case $choice in
    1)
      git stash push -m "Pre-rollback stash"
      # perform rollback
      git stash pop
      ;;
    2)
      echo "Please commit your changes first"
      exit 1
      ;;
    3)
      echo "Rollback cancelled"
      exit 0
      ;;
  esac
fi
```

### If rollback affects multiple files

```bash
# Check scope of rollback
FILES_CHANGED=$(git diff --name-only $TARGET_COMMIT..HEAD | wc -l)

if [ $FILES_CHANGED -gt 3 ]; then
  echo "⚠️ Large Rollback Scope"
  echo ""
  echo "This rollback affects $FILES_CHANGED files."
  echo ""
  git diff --name-status $TARGET_COMMIT..HEAD
  echo ""
  echo "This is more than a typical checkpoint. Are you sure? (y/n)"
  read -p "> " confirm

  if [ "$confirm" != "y" ]; then
    echo "Rollback cancelled"
    exit 0
  fi
fi
```

### If trying to rollback pushed commit

```bash
# Check if commit exists on remote
git branch -r --contains $CHECKPOINT_COMMIT

if [ $? -eq 0 ]; then
  echo "🚨 DANGER: Pushed Commit"
  echo ""
  echo "This commit has been pushed to remote."
  echo "Rollback requires force push!"
  echo ""
  echo "This can cause problems if:"
  echo "• Others have pulled your branch"
  echo "• Automated systems reference this commit"
  echo "• CI/CD has processed this commit"
  echo ""
  echo "Type 'FORCE ROLLBACK' to confirm (or anything else to cancel):"
  read -p "> " confirm

  if [ "$confirm" != "FORCE ROLLBACK" ]; then
    echo "Rollback cancelled (wise choice!)"
    exit 0
  fi

  # Perform rollback
  # ... rollback code ...

  echo ""
  echo "⚠️ Don't forget to force push:"
  echo "git push --force-with-lease origin [branch]"
fi
```

## Step 5: Restore Session State

If rolling back affected SESSION_STATE.json:

```bash
# Check if SESSION_STATE.json was in the rolled-back commit
if git show $CHECKPOINT_COMMIT:SESSION_STATE.json >/dev/null 2>&1; then
  echo "ℹ️ Session state was affected by rollback"

  # Try to restore previous session state
  PREV_COMMIT=$(git log $CHECKPOINT_COMMIT~1 -1 --pretty=format:"%H")

  if git show $PREV_COMMIT:SESSION_STATE.json >/dev/null 2>&1; then
    git show $PREV_COMMIT:SESSION_STATE.json > SESSION_STATE.json
    echo "✅ Restored previous SESSION_STATE.json"
  else
    echo "⚠️ No previous session state found - removed SESSION_STATE.json"
    rm -f SESSION_STATE.json
  fi
fi
```

## Step 6: Display Rollback Results

```
✅ Rollback Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Rollback Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Rolled back from:
   0c84a28 "checkpoint: test Phase 1 checkpoint functionality"

✅ Restored to:
   c26b366 "feat: implement Tier 1 core commands (Phase 1A-C)"

📝 Changes Reverted:
   • CLAUDE.md: Removed Current Session section (42 lines)
   • Commit removed from history

💾 Safety Backups Created:
   • CLAUDE.md.rollback-backup (your pre-rollback state)
   • CLAUDE.md.backup (still available)

🎯 Current State:
   Branch: feature/context-management-v2
   HEAD: c26b366
   Working tree: [clean | n uncommitted files]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Recovery Options (if you change your mind):

1. Re-apply from backup:
   cp CLAUDE.md.rollback-backup CLAUDE.md

2. Re-create the checkpoint:
   /project:checkpoint

3. View what was rolled back:
   cat CLAUDE.md.rollback-backup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If pushed to remote:]
⚠️ NEXT STEP REQUIRED:

Your rollback removed a commit that was pushed to remote.
You MUST force push to update the remote:

   git push --force-with-lease origin feature/context-management-v2

⚠️ Only do this if you're sure no one else is using this branch!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Error Handling

**No checkpoints found:**
```
ℹ️ No Checkpoints to Rollback

Couldn't find any checkpoint, save, or end-session commits to rollback.

Recent commits:
[show last 3 commits]

These aren't checkpoint commits. Use standard git to revert:
• git reset HEAD~1 (undo last commit)
• git revert [hash] (revert specific commit)

/project:rollback is specifically for checkpoint management commits.
```

**Git operation fails:**
```
❌ Rollback Failed

Error: [git error message]

Your repository state is unchanged (safe).

Possible causes:
• Merge conflicts
• Locked files
• Permission issues
• Corrupted git state

Manual rollback:
1. git reset --soft HEAD~1
2. Review changes: git status
3. Re-commit if needed

Contact support if error persists.
```

**Backup file missing:**
```
⚠️ No Backup Found

CLAUDE.md.backup doesn't exist.
Cannot safely rollback without backup.

Options:
1. Proceed anyway (risky - may lose current CLAUDE.md)
2. Create manual backup first
3. Cancel rollback

Choice (1/2/3):
```

**Already at oldest checkpoint:**
```
ℹ️ At First Checkpoint

This is the first checkpoint in your session.
There's nothing to rollback to.

You can:
• Keep this checkpoint
• Delete it manually: git reset --hard HEAD~1
• Start fresh: git checkout [previous-commit]

/project:rollback cannot go back further.
```

## Safety Features

1. **Multiple Backup Layers:**
   - CLAUDE.md.backup (from checkpoint)
   - CLAUDE.md.rollback-backup (created during rollback)
   - Git reflog (automatic git safety net)

2. **Dry-run Mode:**
   ```bash
   /project:rollback --dry-run
   # Shows what WOULD be rolled back without doing it
   ```

3. **Confirmation Required:**
   - Always ask before destructive operations
   - Require full typing for dangerous operations (force push)
   - Show diff preview before rollback

4. **Rollback History:**
   - Track rollbacks in .claude/rollback_history.log
   - Store: timestamp, from-commit, to-commit, reason
   - Helpful for debugging repeated rollbacks

5. **Git Reflog Integration:**
   ```bash
   # Can always recover via reflog
   git reflog
   git reset --hard [reflog-entry]
   ```

## Advanced Usage

### Rollback Chain (undo multiple checkpoints)

```bash
/project:rollback c26b366
# This rolls back ALL commits after c26b366
```

Display warning:
```
⚠️ Multiple Commits Will Be Removed

Rollback to c26b366 will remove these commits:
1. 0c84a28 - checkpoint: test Phase 1 checkpoint functionality
2. 1a2b3c4 - checkpoint: another test
3. 4d5e6f7 - checkpoint: third checkpoint

Total: 3 commits will be removed

This is a BIG rollback. Are you absolutely sure? (yes/NO)
```

### Selective File Rollback

```bash
/project:rollback --file CLAUDE.md
# Roll back ONLY CLAUDE.md, keep other changes
```

### Rollback and Re-apply

```bash
/project:rollback --reapply
# Rollback but keep changes in staging area for re-committing
```

## Implementation Notes

- Always prefer `git revert` over `git reset` for pushed commits
- Use `git reset --soft` to keep work (safer than --hard)
- Create backups BEFORE any destructive operation
- Validate git state after rollback
- Update SESSION_STATE.json if affected
- Clean up old backup files (keep last 5)
- Log all rollbacks for audit trail
- Test rollback thoroughly before destructive ops
- Provide clear recovery instructions
- Make it hard to accidentally rollback (confirmations)
- Display clear before/after state
- Link to git reflog for advanced recovery
