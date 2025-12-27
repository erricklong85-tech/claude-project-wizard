# Claude Code Custom Commands

This directory contains custom slash commands for context management.

## Available Commands

### Tier 1: Core Operations
- **checkpoint.md** - `/project:checkpoint` - Quick save progress without clearing context
- **save.md** - `/project:save` - Save complete state and clear context
- **end-session.md** - `/project:end-session` - Comprehensive end-of-day shutdown

### Tier 2: Intelligence Layer
- **resume.md** - `/project:resume` - Intelligently restart from saved session
- **status.md** - `/project:status` - Quick read-only state report
- **rollback.md** - `/project:rollback` - Undo last checkpoint/save

### Tier 3: Automation
- **auto-save.md** - `/project:auto-save` - Enable automatic checkpointing
- **context-guard.md** - `/project:context-guard` - Auto-warn at token thresholds

## Usage

Type `/project:` in Claude Code and tab-complete to see available commands.

Example:
```
/project:checkpoint
/project:save
/project:resume
```

## Command Format

Commands are markdown files that contain instructions for Claude to follow.
They can use all Claude Code tools (Bash, Read, Edit, git, etc).

## Documentation

See `.claude/CLAUDE_TEMPLATE_ADDITIONS.md` for integration with CLAUDE.md
See `.claude/SESSION_STATE.schema.json` for session state format
