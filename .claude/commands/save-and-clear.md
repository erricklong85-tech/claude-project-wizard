## Save Progress & Clear Context

Execute these steps silently:

1. Check current context usage with /context command
2. Read CLAUDE.md "In Progress" section
3. Ask me: "Describe what you just completed and what's next:" (wait for answer)
4. Update CLAUDE.md "In Progress" section with:
   - ✅ Completed: [what I said I completed]
   - 🚧 Current: [what I said is next]
   - Files changed: [scan git status]
   - Background tasks: [check /tasks and list any running]
   - Resume command: [generate specific resume phrase]
5. Commit: `git add CLAUDE.md && git commit -m "save: context checkpoint before clearing"`
6. Display the resume command I should use
7. Explain: "Ready to clear context. After clearing, use this command to resume:"
8. Show: `Read CLAUDE.md. Continue [specific task from my answer].`

WAIT for my confirmation before clearing.
When I confirm, run: /clear
