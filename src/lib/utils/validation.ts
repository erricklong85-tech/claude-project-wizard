import { z } from 'zod';

export const projectOverviewSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Use lowercase letters, numbers, and hyphens only (no spaces or uppercase)'
    ),
  type: z.enum(['automation', 'client-project', 'app', 'website', 'library', 'other']),
  description: z.string().min(10, 'Please provide a meaningful description (at least 10 characters)'),
});

export const techStackSchema = z.object({
  language: z.string().min(1, 'Programming language is required'),
  framework: z.string().nullable(),
  packageManager: z.enum(['npm', 'pnpm', 'yarn', 'bun', 'pip', 'poetry']),
  runtime: z.string().min(1, 'Runtime version is required (e.g., Node 20+, Python 3.11+)'),
  customDependencies: z.array(z.string()).optional(),
});

export const commandSchema = z.object({
  command: z.string().min(1, 'Command is required'),
  description: z.string().min(1, 'Description is required'),
});

export const commonCommandsSchema = z.array(commandSchema).min(1, 'At least one command is required');

export const codeStyleSchema = z.object({
  moduleSystem: z.string().min(1, 'Module system is required'),
  indentation: z.enum(['2 spaces', '4 spaces', 'tabs']),
  patterns: z.array(z.string()),
  additionalGuidelines: z.string().optional(),
});

export const testingSchema = z.object({
  framework: z.string().min(1, 'Testing framework is required'),
  coverageTarget: z.number().min(0).max(100),
  mockExternalAPIs: z.boolean(),
  runBeforeCommit: z.boolean(),
  additionalGuidelines: z.string().optional(),
});

export const gitWorkflowSchema = z.object({
  branchNaming: z.string().min(1, 'Branch naming convention is required'),
  commitFormat: z.enum(['conventional', 'custom']),
  customCommitFormat: z.string().optional(),
  runTestsBeforeCommit: z.boolean(),
  squashBeforeMerge: z.boolean(),
});

export const environmentVariableSchema = z.object({
  name: z.string().min(1, 'Variable name is required'),
  required: z.boolean(),
  example: z.string().optional(),
  description: z.string().optional(),
});

export const environmentSchema = z.object({
  requiredVersions: z.record(z.string(), z.string()),
  environmentVariables: z.array(environmentVariableSchema),
  setupInstructions: z.string().optional(),
});

export const permissionsSchema = z.object({
  edit: z.boolean(),
  read: z.boolean(),
  write: z.boolean(),
  bash: z.boolean(),
  gitCommit: z.boolean(),
  gitPush: z.boolean(),
  glob: z.boolean(),
  grep: z.boolean(),
  mcpServers: z.boolean(),
  webFetch: z.boolean(),
  webSearch: z.boolean(),
});

export const advancedConfigSchema = z.object({
  mcpServers: z.array(
    z.object({
      name: z.string(),
      enabled: z.boolean(),
    })
  ),
  permissions: permissionsSchema,
  projectQuirks: z.string().optional(),
  filesToAvoid: z.string().optional(),
});

// Helper function to validate a specific step
export function validateStep(stepNumber: number, data: any): { success: boolean; errors?: any } {
  try {
    switch (stepNumber) {
      case 0:
        projectOverviewSchema.parse(data);
        break;
      case 1:
        techStackSchema.parse(data);
        break;
      case 2:
        commonCommandsSchema.parse(data);
        break;
      case 3:
        codeStyleSchema.parse(data);
        break;
      case 4:
        testingSchema.parse(data);
        break;
      case 5:
        gitWorkflowSchema.parse(data);
        break;
      case 6:
        environmentSchema.parse(data);
        break;
      case 7:
        advancedConfigSchema.parse(data);
        break;
      default:
        return { success: true };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
}
