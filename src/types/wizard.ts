export type ProjectType = 'automation' | 'client-project' | 'app' | 'website' | 'library' | 'other';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'pip' | 'poetry';

export type PresetType = 'react-vite' | 'nextjs' | 'python-flask' | 'custom';

export interface ProjectOverviewData {
  name: string;
  type: ProjectType;
  description: string;
}

export interface TechStackData {
  language: string;
  framework: string | null;
  packageManager: PackageManager;
  runtime: string;
  customDependencies?: string[];
}

export interface CommandData {
  command: string;
  description: string;
}

export interface CodeStyleData {
  moduleSystem: string;
  indentation: '2 spaces' | '4 spaces' | 'tabs';
  patterns: string[];
  additionalGuidelines?: string;
}

export interface TestingData {
  framework: string;
  coverageTarget: number;
  mockExternalAPIs: boolean;
  runBeforeCommit: boolean;
  additionalGuidelines?: string;
}

export interface GitWorkflowData {
  branchNaming: string;
  commitFormat: 'conventional' | 'custom';
  customCommitFormat?: string;
  runTestsBeforeCommit: boolean;
  squashBeforeMerge: boolean;
}

export interface EnvironmentVariable {
  name: string;
  required: boolean;
  example?: string;
  description?: string;
}

export interface EnvironmentData {
  requiredVersions: Record<string, string>;
  environmentVariables: EnvironmentVariable[];
  setupInstructions?: string;
}

export interface MCPServer {
  name: string;
  enabled: boolean;
}

export interface PermissionsData {
  edit: boolean;
  read: boolean;
  write: boolean;
  bash: boolean;
  gitCommit: boolean;
  gitPush: boolean;
  glob: boolean;
  grep: boolean;
  mcpServers: boolean;
  webFetch: boolean;
  webSearch: boolean;
}

export interface AdvancedConfigData {
  mcpServers: MCPServer[];
  permissions: PermissionsData;
  projectQuirks?: string;
  filesToAvoid?: string;
}

export interface WizardFormData {
  projectOverview: ProjectOverviewData;
  techStack: TechStackData;
  commonCommands: CommandData[];
  codeStyle: CodeStyleData;
  testing: TestingData;
  gitWorkflow: GitWorkflowData;
  environment: EnvironmentData;
  advanced: AdvancedConfigData;
}

export interface WizardState {
  currentStep: number;
  formData: WizardFormData;
  completedSteps: Set<number>;
  skippedSteps: Set<number>;
  lastSaved: string | null;
  appliedPreset: PresetType | null;
}

export interface WizardStore extends WizardState {
  setCurrentStep: (step: number) => void;
  updateFormData: <K extends keyof WizardFormData>(
    section: K,
    data: Partial<WizardFormData[K]>
  ) => void;
  markStepCompleted: (step: number) => void;
  toggleSkipStep: (step: number) => void;
  applyPreset: (preset: PresetType) => void;
  resetWizard: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export interface SmartPreset {
  techStack: TechStackData;
  commonCommands: CommandData[];
  codeStyle: Partial<CodeStyleData>;
  testing: Partial<TestingData>;
  gitWorkflow: Partial<GitWorkflowData>;
  environment: Partial<EnvironmentData>;
  advanced: Partial<AdvancedConfigData>;
}
