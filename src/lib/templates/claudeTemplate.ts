import type { WizardFormData } from '../../types/wizard';

export function generateClaudeMd(formData: WizardFormData): string {
  const sections: string[] = [];

  // Header
  sections.push(`# ${formData.projectOverview.name} - Claude Code Configuration\n`);

  // Project Overview
  sections.push('## Project Overview\n');
  sections.push(`${formData.projectOverview.description}\n`);
  sections.push(`**Project Type:** ${formData.projectOverview.type}\n`);

  // Tech Stack
  sections.push('## Tech Stack\n');
  sections.push(`- **Language:** ${formData.techStack.language}`);
  if (formData.techStack.framework) {
    sections.push(`- **Framework:** ${formData.techStack.framework}`);
  }
  sections.push(`- **Package Manager:** ${formData.techStack.packageManager}`);
  sections.push(`- **Runtime:** ${formData.techStack.runtime}`);
  if (formData.techStack.customDependencies && formData.techStack.customDependencies.length > 0) {
    sections.push(`- **Key Dependencies:** ${formData.techStack.customDependencies.join(', ')}`);
  }
  sections.push('');

  // Common Commands
  if (formData.commonCommands && formData.commonCommands.length > 0) {
    sections.push('## Common Commands\n');
    formData.commonCommands.forEach((cmd) => {
      sections.push(`- \`${cmd.command}\` - ${cmd.description}`);
    });
    sections.push('');
  }

  // Code Style Guidelines
  sections.push('## Code Style Guidelines\n');
  sections.push(`- **Module System:** ${formData.codeStyle.moduleSystem}`);
  sections.push(`- **Indentation:** ${formData.codeStyle.indentation}`);

  if (formData.codeStyle.patterns && formData.codeStyle.patterns.length > 0) {
    sections.push('\n**Coding Patterns:**');
    formData.codeStyle.patterns.forEach((pattern) => {
      sections.push(`- ${pattern}`);
    });
  }

  if (formData.codeStyle.additionalGuidelines) {
    sections.push(`\n${formData.codeStyle.additionalGuidelines}`);
  }
  sections.push('');

  // Testing Instructions
  sections.push('## Testing Instructions\n');
  sections.push(`- **Framework:** ${formData.testing.framework}`);
  sections.push(`- **Coverage Target:** ${formData.testing.coverageTarget}%`);
  sections.push(`- **Mock External APIs:** ${formData.testing.mockExternalAPIs ? 'Yes' : 'No'}`);
  sections.push(`- **Run Before Commit:** ${formData.testing.runBeforeCommit ? 'Yes' : 'No'}`);

  if (formData.testing.additionalGuidelines) {
    sections.push(`\n${formData.testing.additionalGuidelines}`);
  }
  sections.push('');

  // Git Workflow
  sections.push('## Git Workflow\n');
  sections.push(`- **Branch Naming:** ${formData.gitWorkflow.branchNaming}`);
  sections.push(
    `- **Commit Format:** ${formData.gitWorkflow.commitFormat === 'conventional' ? 'Conventional Commits (feat:, fix:, chore:)' : formData.gitWorkflow.customCommitFormat || 'Custom'}`
  );
  sections.push(`- **Run Tests Before Commit:** ${formData.gitWorkflow.runTestsBeforeCommit ? 'Yes' : 'No'}`);
  sections.push(`- **Squash Before Merge:** ${formData.gitWorkflow.squashBeforeMerge ? 'Yes' : 'No'}`);
  sections.push('');

  // Environment Setup
  sections.push('## Environment Setup\n');

  if (Object.keys(formData.environment.requiredVersions).length > 0) {
    sections.push('**Required Versions:**');
    Object.entries(formData.environment.requiredVersions).forEach(([key, value]) => {
      sections.push(`- ${key}: ${value}`);
    });
    sections.push('');
  }

  if (formData.environment.environmentVariables && formData.environment.environmentVariables.length > 0) {
    sections.push('**Environment Variables:**');
    formData.environment.environmentVariables.forEach((envVar) => {
      const requiredBadge = envVar.required ? '(Required)' : '(Optional)';
      sections.push(`- \`${envVar.name}\` ${requiredBadge}`);
      if (envVar.description) {
        sections.push(`  - ${envVar.description}`);
      }
      if (envVar.example) {
        sections.push(`  - Example: \`${envVar.example}\``);
      }
    });
    sections.push('');
  }

  if (formData.environment.setupInstructions) {
    sections.push('**Setup Instructions:**\n');
    sections.push(formData.environment.setupInstructions);
    sections.push('');
  }

  // Advanced Configuration
  if (formData.advanced) {
    sections.push('## Advanced Configuration\n');

    // MCP Servers
    const enabledMCPServers = formData.advanced.mcpServers.filter((server) => server.enabled);
    if (enabledMCPServers.length > 0) {
      sections.push('**MCP Servers:**');
      enabledMCPServers.forEach((server) => {
        sections.push(`- ${server.name}`);
      });
      sections.push('');
    }

    // Permissions
    sections.push('**Permissions (Auto-allowed Tools):**');
    const permissions = formData.advanced.permissions;
    const allowedTools: string[] = [];

    if (permissions.edit) allowedTools.push('Edit');
    if (permissions.read) allowedTools.push('Read');
    if (permissions.write) allowedTools.push('Write');
    if (permissions.bash) allowedTools.push('Bash');
    if (permissions.gitCommit) allowedTools.push('Bash(git commit)');
    if (permissions.gitPush) allowedTools.push('Bash(git push)');
    if (permissions.glob) allowedTools.push('Glob');
    if (permissions.grep) allowedTools.push('Grep');
    if (permissions.mcpServers) allowedTools.push('MCP Servers');
    if (permissions.webFetch) allowedTools.push('WebFetch');
    if (permissions.webSearch) allowedTools.push('WebSearch');

    sections.push(`- ${allowedTools.join(', ')}`);
    sections.push('');

    // Project Quirks
    if (formData.advanced.projectQuirks) {
      sections.push('## Project-Specific Notes\n');
      sections.push(formData.advanced.projectQuirks);
      sections.push('');
    }

    // Files to Avoid
    if (formData.advanced.filesToAvoid) {
      sections.push('## Files to Avoid Modifying\n');
      sections.push(formData.advanced.filesToAvoid);
      sections.push('');
    }
  }

  // Footer
  sections.push('---\n');
  sections.push(`*Generated by Claude Code Project Setup Wizard*  `);
  sections.push(`*Last Updated: ${new Date().toLocaleDateString()}*`);

  return sections.join('\n');
}

// Preview version that only shows completed sections
export function generateProgressivePreview(
  formData: Partial<WizardFormData>,
  completedSteps: Set<number>
): string {
  const sections: string[] = [];

  // Step 0: Project Overview
  if (completedSteps.has(0) && formData.projectOverview) {
    sections.push(`# ${formData.projectOverview.name || '[Project Name]'} - Claude Code Configuration\n`);
    sections.push('## Project Overview\n');
    sections.push(`${formData.projectOverview.description || '[Project Description]'}\n`);
    sections.push(`**Project Type:** ${formData.projectOverview.type || 'app'}\n`);
  }

  // Step 1: Tech Stack
  if (completedSteps.has(1) && formData.techStack) {
    sections.push('## Tech Stack\n');
    if (formData.techStack.language) {
      sections.push(`- **Language:** ${formData.techStack.language}`);
    }
    if (formData.techStack.framework) {
      sections.push(`- **Framework:** ${formData.techStack.framework}`);
    }
    if (formData.techStack.packageManager) {
      sections.push(`- **Package Manager:** ${formData.techStack.packageManager}`);
    }
    if (formData.techStack.runtime) {
      sections.push(`- **Runtime:** ${formData.techStack.runtime}`);
    }
    sections.push('');
  }

  // Step 2: Common Commands
  if (completedSteps.has(2) && formData.commonCommands && formData.commonCommands.length > 0) {
    sections.push('## Common Commands\n');
    formData.commonCommands.forEach((cmd) => {
      sections.push(`- \`${cmd.command}\` - ${cmd.description}`);
    });
    sections.push('');
  }

  // Step 3: Code Style
  if (completedSteps.has(3) && formData.codeStyle) {
    sections.push('## Code Style Guidelines\n');
    sections.push(`- **Module System:** ${formData.codeStyle.moduleSystem}`);
    sections.push(`- **Indentation:** ${formData.codeStyle.indentation}`);
    if (formData.codeStyle.patterns && formData.codeStyle.patterns.length > 0) {
      sections.push('\n**Coding Patterns:**');
      formData.codeStyle.patterns.forEach((pattern) => {
        sections.push(`- ${pattern}`);
      });
    }
    sections.push('');
  }

  // Step 4: Testing
  if (completedSteps.has(4) && formData.testing) {
    sections.push('## Testing Instructions\n');
    sections.push(`- **Framework:** ${formData.testing.framework}`);
    sections.push(`- **Coverage Target:** ${formData.testing.coverageTarget}%`);
    sections.push('');
  }

  // Step 5: Git Workflow
  if (completedSteps.has(5) && formData.gitWorkflow) {
    sections.push('## Git Workflow\n');
    sections.push(`- **Branch Naming:** ${formData.gitWorkflow.branchNaming}`);
    sections.push(
      `- **Commit Format:** ${formData.gitWorkflow.commitFormat === 'conventional' ? 'Conventional Commits' : 'Custom'}`
    );
    sections.push('');
  }

  // Step 6: Environment
  if (completedSteps.has(6) && formData.environment) {
    sections.push('## Environment Setup\n');
    if (Object.keys(formData.environment.requiredVersions || {}).length > 0) {
      sections.push('**Required Versions:**');
      Object.entries(formData.environment.requiredVersions).forEach(([key, value]) => {
        sections.push(`- ${key}: ${value}`);
      });
    }
    sections.push('');
  }

  // Step 7: Advanced Config
  if (completedSteps.has(7) && formData.advanced) {
    const enabledMCPServers = formData.advanced.mcpServers?.filter((s) => s.enabled) || [];
    if (enabledMCPServers.length > 0) {
      sections.push('## MCP Servers\n');
      enabledMCPServers.forEach((server) => {
        sections.push(`- ${server.name}`);
      });
      sections.push('');
    }
  }

  if (sections.length === 0) {
    return '# Start filling out the wizard to see your CLAUDE.md preview\n\nYour configuration will appear here as you complete each step.';
  }

  return sections.join('\n');
}
