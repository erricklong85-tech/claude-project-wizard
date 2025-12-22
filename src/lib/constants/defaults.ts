import type { SmartPreset, MCPServer, PermissionsData } from '../../types/wizard';

export const DEFAULT_PERMISSIONS: PermissionsData = {
  edit: true,
  read: true,
  write: true,
  bash: false,
  gitCommit: true,
  gitPush: false,
  glob: true,
  grep: true,
  mcpServers: false,
  webFetch: false,
  webSearch: false,
};

export const MCP_SERVERS_OPTIONS: Record<string, MCPServer> = {
  puppeteer: { name: 'Puppeteer (Browser Automation)', enabled: false },
  github: { name: 'GitHub Integration', enabled: false },
  filesystem: { name: 'Filesystem Operations', enabled: false },
  braveSearch: { name: 'Brave Search', enabled: false },
};

export const SMART_PRESETS: Record<'react-vite' | 'nextjs' | 'python-flask', SmartPreset> = {
  'react-vite': {
    techStack: {
      language: 'TypeScript',
      framework: 'React',
      packageManager: 'npm',
      runtime: 'Node 20+',
      customDependencies: [],
    },
    commonCommands: [
      { command: 'npm run dev', description: 'Start development server' },
      { command: 'npm run build', description: 'Build for production' },
      { command: 'npm run lint', description: 'Run ESLint' },
      { command: 'npm run typecheck', description: 'Run TypeScript compiler' },
      { command: 'npm test', description: 'Run test suite' },
    ],
    codeStyle: {
      moduleSystem: 'ES modules',
      indentation: '2 spaces',
      patterns: [
        'Functional components over class components',
        'Custom hooks for reusable logic',
        'TypeScript strict mode enabled',
        'Destructure props and imports',
      ],
      additionalGuidelines: 'Follow React best practices and use hooks for state management.',
    },
    testing: {
      framework: 'Vitest',
      coverageTarget: 80,
      mockExternalAPIs: true,
      runBeforeCommit: true,
      additionalGuidelines: 'Write tests for all components and utility functions. Use React Testing Library for component tests.',
    },
    gitWorkflow: {
      branchNaming: 'feature/*, fix/*, chore/*',
      commitFormat: 'conventional',
      runTestsBeforeCommit: true,
      squashBeforeMerge: true,
    },
    environment: {
      requiredVersions: {
        'Node.js': '20+',
      },
      environmentVariables: [
        {
          name: 'VITE_API_URL',
          required: false,
          example: 'http://localhost:3000/api',
          description: 'API endpoint URL',
        },
      ],
      setupInstructions: 'Copy .env.example to .env.local and fill in required values.',
    },
    advanced: {
      mcpServers: [
        { name: 'github', enabled: true },
        { name: 'filesystem', enabled: true },
      ],
      permissions: DEFAULT_PERMISSIONS,
      projectQuirks: '',
      filesToAvoid: 'dist/, node_modules/, .env.local',
    },
  },

  'nextjs': {
    techStack: {
      language: 'TypeScript',
      framework: 'Next.js',
      packageManager: 'npm',
      runtime: 'Node 20+',
      customDependencies: [],
    },
    commonCommands: [
      { command: 'npm run dev', description: 'Start development server' },
      { command: 'npm run build', description: 'Build for production' },
      { command: 'npm run start', description: 'Start production server' },
      { command: 'npm run lint', description: 'Run ESLint' },
      { command: 'npm run typecheck', description: 'Run TypeScript compiler' },
      { command: 'npm test', description: 'Run test suite' },
    ],
    codeStyle: {
      moduleSystem: 'ES modules',
      indentation: '2 spaces',
      patterns: [
        'Use App Router over Pages Router',
        'Server Components by default, Client Components when needed',
        'TypeScript strict mode enabled',
        'Prefer server-side data fetching',
      ],
      additionalGuidelines: 'Follow Next.js 14+ conventions. Use Server Components for data fetching, Client Components for interactivity.',
    },
    testing: {
      framework: 'Vitest',
      coverageTarget: 80,
      mockExternalAPIs: true,
      runBeforeCommit: true,
      additionalGuidelines: 'Test Server Actions, API routes, and components separately. Mock external API calls.',
    },
    gitWorkflow: {
      branchNaming: 'feature/*, fix/*, chore/*',
      commitFormat: 'conventional',
      runTestsBeforeCommit: true,
      squashBeforeMerge: true,
    },
    environment: {
      requiredVersions: {
        'Node.js': '20+',
      },
      environmentVariables: [
        {
          name: 'DATABASE_URL',
          required: true,
          example: 'postgresql://user:password@localhost:5432/dbname',
          description: 'Database connection string',
        },
        {
          name: 'NEXTAUTH_SECRET',
          required: false,
          example: 'your-secret-key',
          description: 'NextAuth.js secret for JWT encryption',
        },
      ],
      setupInstructions: 'Copy .env.example to .env.local and configure database connection.',
    },
    advanced: {
      mcpServers: [
        { name: 'github', enabled: true },
        { name: 'filesystem', enabled: true },
      ],
      permissions: DEFAULT_PERMISSIONS,
      projectQuirks: '',
      filesToAvoid: '.next/, node_modules/, .env.local',
    },
  },

  'python-flask': {
    techStack: {
      language: 'Python',
      framework: 'Flask',
      packageManager: 'pip',
      runtime: 'Python 3.11+',
      customDependencies: [],
    },
    commonCommands: [
      { command: 'flask run', description: 'Start development server' },
      { command: 'pytest', description: 'Run test suite' },
      { command: 'mypy .', description: 'Run type checker' },
      { command: 'black .', description: 'Format code with Black' },
      { command: 'flake8', description: 'Run linter' },
    ],
    codeStyle: {
      moduleSystem: 'Python modules',
      indentation: '4 spaces',
      patterns: [
        'Follow PEP 8 style guide',
        'Use type hints for function signatures',
        'Blueprint pattern for routes',
        'Factory pattern for app creation',
      ],
      additionalGuidelines: 'Use Flask blueprints for modular code organization. Follow Python best practices.',
    },
    testing: {
      framework: 'pytest',
      coverageTarget: 85,
      mockExternalAPIs: true,
      runBeforeCommit: true,
      additionalGuidelines: 'Write unit tests for routes and business logic. Use pytest fixtures for test data.',
    },
    gitWorkflow: {
      branchNaming: 'feature/*, fix/*, chore/*',
      commitFormat: 'conventional',
      runTestsBeforeCommit: true,
      squashBeforeMerge: true,
    },
    environment: {
      requiredVersions: {
        'Python': '3.11+',
      },
      environmentVariables: [
        {
          name: 'FLASK_APP',
          required: true,
          example: 'app.py',
          description: 'Flask application entry point',
        },
        {
          name: 'FLASK_ENV',
          required: false,
          example: 'development',
          description: 'Flask environment (development/production)',
        },
        {
          name: 'DATABASE_URL',
          required: true,
          example: 'postgresql://user:password@localhost/dbname',
          description: 'Database connection string',
        },
      ],
      setupInstructions: 'Create virtual environment: python -m venv venv, activate it, and run: pip install -r requirements.txt',
    },
    advanced: {
      mcpServers: [
        { name: 'github', enabled: true },
        { name: 'filesystem', enabled: true },
      ],
      permissions: DEFAULT_PERMISSIONS,
      projectQuirks: '',
      filesToAvoid: '__pycache__/, venv/, .env',
    },
  },
};

export const INITIAL_FORM_DATA = {
  projectOverview: {
    name: '',
    type: 'app' as const,
    description: '',
  },
  techStack: {
    language: '',
    framework: null,
    packageManager: 'npm' as const,
    runtime: '',
  },
  commonCommands: [],
  codeStyle: {
    moduleSystem: 'ES modules',
    indentation: '2 spaces' as const,
    patterns: [],
  },
  testing: {
    framework: '',
    coverageTarget: 80,
    mockExternalAPIs: true,
    runBeforeCommit: true,
  },
  gitWorkflow: {
    branchNaming: 'feature/*, fix/*, chore/*',
    commitFormat: 'conventional' as const,
    runTestsBeforeCommit: true,
    squashBeforeMerge: true,
  },
  environment: {
    requiredVersions: {},
    environmentVariables: [],
  },
  advanced: {
    mcpServers: Object.values(MCP_SERVERS_OPTIONS),
    permissions: DEFAULT_PERMISSIONS,
  },
};
