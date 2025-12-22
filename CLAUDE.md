# Claude Code Project Setup Wizard - Project Documentation

## Project Overview

**Name:** Claude Code Project Setup Wizard
**Type:** Progressive Web Application (PWA)
**Repository:** C:\Users\erric_sgphddc\Projects\claude-project-wizard
**Purpose:** Interactive wizard that converts the Claude Code Project Setup SOP into a guided form with smart presets, enabling users to generate customized CLAUDE.md files in under 2 minutes.

**Description:** This tool streamlines the process of creating CLAUDE.md configuration files for new projects by providing a multi-step wizard interface with intelligent defaults. Users can either manually configure each section or apply one of three smart presets (React+Vite, Next.js, Python+Flask) that auto-populate all settings.

---

## Current Status

**Last Updated:** December 21, 2025
**Development Phase:** Phase 2 - Step Implementation In Progress
**Production Status:** Demo/Testing Only (Local Development)

### ✅ Completed (MVP - Phase 1)
- ✅ Multi-step wizard with 9 steps and progress tracking
- ✅ Step 1: Project Overview (name, type, description)
- ✅ Step 2: Tech Stack with 3 smart presets (React+Vite, Next.js, Python+Flask)
- ✅ Step 9: Review & Download with summary cards
- ✅ Progressive live preview (right panel updates in real-time)
- ✅ Auto-save to localStorage (every 5 seconds)
- ✅ CLAUDE.md template generator with full SOP compliance
- ✅ Download functionality (saves to Downloads folder)
- ✅ Responsive design (desktop 60/40 split, tablet stacked)
- ✅ Successfully tested end-to-end on Windows/Chrome
- ✅ Fixed button visibility issue (custom colors → standard Tailwind)

### ✅ Completed (Phase 2 - Step Implementations)
- ✅ **Step 3: Common Commands** - Full implementation with dynamic add/remove list
  - Empty state with helpful messaging and emoji
  - Command cards with inline editing (command + description)
  - Trash icon button for removal (no confirmation needed)
  - Add command button with plus icon from Heroicons
  - Preset info banner when preset is applied
  - Integrates with Zustand store using `updateFormData`
  - Auto-save inherited from store (500ms debounce)
  - Accessible with proper ARIA labels
  - Files: `Step3_CommonCommands.tsx` (created), `WizardContainer.tsx` (updated)

### 🚧 In Progress (Phase 2)
- None (awaiting next development session)

### 📋 Planned (Phase 2 Backlog)
1. **Full Step Implementation** - Replace placeholder steps 4-8 with complete forms:
   - Step 4: Code Style Guidelines (module system, indentation, patterns)
   - Step 5: Testing Strategy (framework, coverage, mocking)
   - Step 6: Git Workflow (branch naming, commit format, hooks)
   - Step 7: Environment Setup (versions, env vars, setup instructions)
   - Step 8: Advanced Config (MCP servers, permissions, custom commands)

2. **Import/Export Configuration** - Save/load wizard state as JSON file

3. **Generate Additional Files:**
   - `.claude/commands/*.md` - Custom slash commands
   - `.claude/settings.json` - Permissions configuration

4. **PWA Features:**
   - Service worker for offline support
   - Add to home screen functionality
   - Cache CLAUDE.md templates

5. **UX Enhancements:**
   - Keyboard shortcuts (Ctrl+Left/Right for step navigation)
   - "Recently Used" configurations dropdown
   - Template library (save favorite configs)

6. **Deployment:**
   - Deploy to Vercel for public access
   - Add analytics to track preset usage
   - Create landing page with demo video

7. **More Presets:**
   - Vue + Vite
   - Angular
   - Go (Gin framework)
   - Ruby on Rails
   - .NET Core

### 🐛 Known Issues
- None currently

### 💡 Next Session Recommendations
1. **Option A:** Continue implementing steps 4-8 (recommend Step 4: Code Style - similar complexity to Step 3)
2. **Option B:** Deploy current progress to Vercel for public testing and feedback
3. **Option C:** Add 2-3 more tech stack presets (Vue, Angular, Go)
4. **Option D:** Implement Import/Export config feature for power users
5. **Option E:** Implement Step 5: Testing Strategy (another dynamic list pattern)

---

## Tech Stack

### Core Dependencies
- **Vite** `^5.x` - Build tool and dev server (HMR, fast builds)
- **React** `^18.x` - UI library
- **TypeScript** `^5.x` - Type safety and better DX
- **Zustand** `^4.x` - Lightweight state management with persistence
- **Tailwind CSS** `v4.x` - Utility-first styling (@tailwindcss/postcss plugin)
- **Zod** `^3.x` - Runtime type validation for forms
- **React Hook Form** `^7.x` - High-performance form handling (not fully integrated yet)
- **@headlessui/react** `^2.x` - Accessible UI components
- **markdown-it** `^14.x` - Markdown rendering for live preview
- **localforage** `^1.x` - localStorage with IndexedDB fallback
- **file-saver** `^2.x` - Client-side file downloads

### Why These Choices?
- **Zustand over Redux:** Simpler API, less boilerplate, built-in persistence middleware
- **Zod over Yup:** Better TypeScript integration, more powerful schemas
- **Tailwind v4:** Latest version with improved PostCSS setup
- **localforage over raw localStorage:** Handles quota limits gracefully with IndexedDB fallback
- **markdown-it over remark:** Simpler API for our use case (just preview rendering)

---

## Architecture

### Component Hierarchy
```
App.tsx
└── WizardContainer.tsx (main orchestrator)
    ├── Header (title, subtitle)
    ├── ProgressIndicator (step dots 1-9)
    ├── Grid Layout (60% form | 40% preview)
    │   ├── FormSection
    │   │   ├── StepRenderer (dynamic component loader)
    │   │   │   ├── Step1_ProjectOverview.tsx
    │   │   │   ├── Step2_TechStack.tsx ⭐ (preset button logic)
    │   │   │   ├── PlaceholderStep (steps 3-8)
    │   │   │   └── Step9_Review.tsx
    │   │   └── StepNavigation (← Previous | Next →)
    │   └── LivePreview.tsx (progressive markdown preview)
    └── useAutoSave() hook (saves every 5s)
```

### State Management Pattern (Zustand)
```typescript
// wizardStore.ts
interface WizardState {
  currentStep: number;               // 0-8 (9 steps total)
  formData: WizardFormData;          // All form values
  completedSteps: Set<number>;       // Tracks which steps are done
  skippedSteps: Set<number>;         // Optional steps user skipped
  appliedPreset: PresetType | null;  // 'react-vite' | 'nextjs' | 'python-flask'
  lastSaved: string | null;          // ISO timestamp

  // Actions
  setCurrentStep(step: number): void;
  updateFormData(section, data): void;
  applyPreset(preset): void;
  markStepCompleted(step): void;
  resetWizard(): void;
  saveToStorage(): Promise<void>;
  loadFromStorage(): Promise<void>;
}
```

### File Structure Overview
```
src/
├── components/
│   ├── wizard/
│   │   ├── WizardContainer.tsx      # Main wizard orchestrator
│   │   ├── ProgressIndicator.tsx    # Step dots visual (not yet implemented)
│   │   ├── StepNavigation.tsx       # Built into WizardContainer
│   │   └── StepRenderer.tsx         # Built into WizardContainer
│   ├── steps/
│   │   ├── Step1_ProjectOverview.tsx   # Name, type, description
│   │   ├── Step2_TechStack.tsx         # ⭐ Preset buttons + form
│   │   └── Step9_Review.tsx            # Summary + download
│   ├── preview/
│   │   └── LivePreview.tsx          # Progressive CLAUDE.md preview
│   ├── shared/
│   │   ├── Header.tsx               # Built into WizardContainer
│   │   └── FormField.tsx            # Generic wrapper (not used yet)
│   └── ui/
│       ├── Button.tsx               # Reusable button (primary/secondary/outline)
│       ├── Input.tsx                # Text input with label + error
│       ├── Select.tsx               # Dropdown select
│       └── Toggle.tsx               # Not implemented yet
├── store/
│   └── wizardStore.ts               # ⭐ Central state management
├── lib/
│   ├── templates/
│   │   └── claudeTemplate.ts        # ⭐ Generates CLAUDE.md from form data
│   ├── utils/
│   │   ├── validation.ts            # Zod schemas for each step
│   │   ├── download.ts              # file-saver wrapper
│   │   └── storage.ts               # localforage wrapper
│   └── constants/
│       └── defaults.ts              # ⭐ Smart preset definitions
├── types/
│   └── wizard.ts                    # All TypeScript interfaces
├── hooks/
│   └── useAutoSave.ts               # Auto-save + load on mount
└── styles/
    └── index.css                    # Tailwind imports + base styles
```

### Critical Files (Most Important to Understand)

1. **`src/store/wizardStore.ts`** (126 lines)
   - Central state management for entire wizard
   - Handles preset application logic
   - Manages auto-save to localStorage

2. **`src/lib/templates/claudeTemplate.ts`** (231 lines)
   - `generateClaudeMd()` - Main template function
   - `generateProgressivePreview()` - Live preview version
   - Transforms form data into properly formatted markdown

3. **`src/lib/constants/defaults.ts`** (200+ lines)
   - Defines all 3 smart presets (React+Vite, Next.js, Python+Flask)
   - Contains default values for all form sections
   - Easy to extend with new presets

4. **`src/components/wizard/WizardContainer.tsx`** (142 lines)
   - Main wizard UI and navigation logic
   - Renders current step component dynamically
   - Handles Previous/Next button state

5. **`src/components/steps/Step2_TechStack.tsx`** (153 lines)
   - Most complex step with conditional logic
   - Preset button implementation
   - Framework options change based on language selection

---

## Development Workflow

### Starting Development Server
```bash
cd C:\Users\erric_sgphddc\Projects\claude-project-wizard
npm run dev
```
Opens at: http://localhost:5173

### Building for Production
```bash
npm run build
```
Output: `dist/` folder ready for deployment

### Preview Production Build
```bash
npm run preview
```

### How the Wizard Works (User Flow)

1. **Step 1:** User enters project name, type, description
2. **Step 2:** User clicks a preset button OR manually fills tech stack
   - Clicking preset triggers `applyPreset()` in store
   - Auto-fills Steps 2-8 with smart defaults
   - Marks those steps as "completed"
3. **Steps 3-8:** User sees placeholder screens (or can customize if preset applied)
4. **Step 9:** User reviews summary cards and full CLAUDE.md preview
5. **Download:** User clicks "Download CLAUDE.md" → file saved to Downloads folder
6. **Auto-Save:** Every 5 seconds, entire wizard state saves to localStorage
7. **Resume:** Next visit, wizard offers to resume from saved state

### Testing Locally
```bash
# 1. Start server
npm run dev

# 2. Open http://localhost:5173

# 3. Test preset flow:
#    - Fill Step 1: "test-project", "app", "Test description"
#    - Click "React + Vite" preset in Step 2
#    - Navigate to Step 9
#    - Click "Download CLAUDE.md"
#    - Verify file in Downloads folder
#    - Refresh browser, confirm auto-resume works
```

---

## Smart Presets Explained

### How Presets Work
Location: `src/lib/constants/defaults.ts`

Each preset is a `SmartPreset` object containing:
```typescript
interface SmartPreset {
  techStack: TechStackData;
  commonCommands: CommandData[];
  codeStyle: Partial<CodeStyleData>;
  testing: Partial<TestingData>;
  gitWorkflow: Partial<GitWorkflowData>;
  environment: Partial<EnvironmentData>;
  advanced: Partial<AdvancedConfigData>;
}
```

When a preset is applied:
1. All form sections are updated with preset values
2. Steps 2-8 are marked as "completed"
3. User can still customize any field
4. Live preview updates immediately

### Current Presets

**React + Vite:**
- Language: TypeScript
- Framework: React
- Package Manager: npm
- Runtime: Node 20+
- Commands: dev, build, lint, typecheck, test
- Testing: Vitest (80% coverage)
- MCP Servers: github, filesystem

**Next.js:**
- Language: TypeScript
- Framework: Next.js
- Package Manager: npm
- Runtime: Node 20+
- Commands: dev, build, start, lint, typecheck, test
- Testing: Vitest (80% coverage)
- Includes: DATABASE_URL, NEXTAUTH_SECRET env vars
- MCP Servers: github, filesystem

**Python + Flask:**
- Language: Python
- Framework: Flask
- Package Manager: pip
- Runtime: Python 3.11+
- Commands: flask run, pytest, mypy, black, flake8
- Testing: pytest (85% coverage)
- Code Style: PEP 8, 4 spaces
- MCP Servers: github, filesystem

### Adding a New Preset
1. Open `src/lib/constants/defaults.ts`
2. Add new entry to `SMART_PRESETS` object
3. Define all 7 sections (techStack, commands, codeStyle, testing, git, environment, advanced)
4. Update `PresetType` in `src/types/wizard.ts`
5. Add button in `src/components/steps/Step2_TechStack.tsx`

---

## How to Resume Development

### Quick Start
```bash
cd C:\Users\erric_sgphddc\Projects\claude-project-wizard
npm run dev
```
Open http://localhost:5173 in browser

### For Claude in Next Session
**Minimal context prompt:**
> "I'm resuming work on the Claude Code Project Setup Wizard located at `C:\Users\erric_sgphddc\Projects\claude-project-wizard`. Read CLAUDE.md for the current status and architecture. I want to [implement Step 3 / add Vue preset / deploy to Vercel / etc.]."

This uses only ~2k tokens instead of 116k!

### Context-Saving Tips
- ✅ Always start with "Read CLAUDE.md"
- ✅ Reference specific file paths when discussing changes
- ✅ Use `/compact` command if context gets too full
- ✅ For major refactors, use `/clear` and start fresh with CLAUDE.md

---

## Common Development Tasks

### Add a New Tech Stack Preset
1. Edit `src/lib/constants/defaults.ts`
2. Add new preset object (copy existing preset as template)
3. Update `src/types/wizard.ts` → `PresetType` union
4. Add button in `src/components/steps/Step2_TechStack.tsx`
5. Test by clicking button and verifying all fields populate

### Implement a Full Step (Replace Placeholder)
Example: Step 3 - Common Commands
1. Create `src/components/steps/Step3_CommonCommands.tsx`
2. Use `useWizardStore` to get/update `formData.commonCommands`
3. Add dynamic list with add/remove buttons
4. Update `src/components/wizard/WizardContainer.tsx` → replace PlaceholderStep
5. Test navigation and auto-save

### Modify Template Output
1. Edit `src/lib/templates/claudeTemplate.ts`
2. Find the section you want to change (search for "## Section Name")
3. Update string interpolation or formatting
4. Test by going to Step 9 and checking preview

### Change Styling/Colors
- **Buttons:** `src/components/ui/Button.tsx` → `variantStyles` object
- **Forms:** `src/components/ui/Input.tsx` and `Select.tsx`
- **Global:** `src/index.css` and `tailwind.config.js`
- **Note:** Using standard Tailwind colors (orange-600) not custom claude-* colors

---

## Testing Notes

### Last Successful Test: December 20, 2025

**Test Flow:**
1. ✅ Filled Step 1: `test-wizard-project`, type=app, description
2. ✅ Clicked "React + Vite" preset button
3. ✅ Verified auto-population of tech stack fields
4. ✅ Navigated through steps 3-8 (placeholders)
5. ✅ Reached Step 9 Review page
6. ✅ Downloaded CLAUDE.md to `C:\Users\erric_sgphddc\Downloads\CLAUDE.md`
7. ✅ Verified file contents (all sections present, properly formatted)
8. ✅ Confirmed auto-save by refreshing browser (state restored)

**Bugs Fixed:**
- Button visibility issue (custom `claude-600` color not rendering → changed to `orange-600`)
- Tailwind v4 configuration (added `@tailwindcss/postcss` plugin)

**Known Working Features:**
- ✅ Step navigation (Previous/Next buttons)
- ✅ Progress dots clickable (jump to any step)
- ✅ Preset application (all 3 presets tested)
- ✅ Live preview updates in real-time
- ✅ Auto-save every 5 seconds
- ✅ Download generates valid markdown
- ✅ Responsive layout (tested on 1920x1080 desktop)

---

## Project-Specific Notes

### Windows-Specific Considerations
- File paths use `C:\Users\...` format
- Dev server runs on localhost:5173 (Vite default)
- Downloads save to user's Downloads folder by default
- PowerShell commands work (no Git Bash required)

### Tailwind v4 Migration Notes
- Using new `@import "tailwindcss"` syntax in `index.css`
- PostCSS config uses `@tailwindcss/postcss` plugin
- **DO NOT use** `@layer` or `@apply` directives (v4 compatibility issues)
- Custom colors defined in `tailwind.config.js` may not work - use standard Tailwind palette

### State Persistence Details
- localStorage key: `claude-wizard-state`
- Stored data includes: formData, currentStep, completedSteps, lastSaved
- Storage wrapper: `localforage` (automatic IndexedDB fallback if quota exceeded)
- Auto-save runs every 5 seconds via `useAutoSave` hook
- Resume dialog NOT implemented (auto-loads on mount)

---

## Git Workflow

**Branch Naming:** Not using branches yet (direct main development)
**Commit Format:** Not yet committed to git
**Next Steps:** Should initialize git and create initial commit

### Recommended First Commit
```bash
cd C:\Users\erric_sgphddc\Projects\claude-project-wizard
git init
git add .
git commit -m "feat: initial MVP implementation of Claude Code wizard

- Multi-step wizard with 9 steps
- 3 smart presets (React+Vite, Next.js, Python+Flask)
- Live preview and auto-save
- Download CLAUDE.md functionality
- Tested end-to-end successfully

🤖 Generated with Claude Code"
```

---

## Deployment Considerations (Future)

### Vercel Deployment (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

### Build Configuration
- Output: `dist/` folder (static files)
- Framework: Vite
- Build command: `npm run build`
- Install command: `npm install`
- No environment variables needed (client-side only)

### Domain Suggestions
- `claude-wizard.vercel.app`
- `setup-claude.dev`
- `claudeconfig.io`

---

## Performance Metrics

**Build Time:** ~1.1s
**Bundle Size:**
- JS: 255.47 kB (gzipped: 79.21 kB)
- CSS: 13.63 kB (gzipped: 3.60 kB)

**Lighthouse Scores (Local):** Not yet measured
**Target for Production:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 90+

---

## FAQ / Troubleshooting

**Q: Dev server won't start?**
A: Run `npm install` first, then `npm run dev`

**Q: Buttons not visible?**
A: Check that Tailwind colors are using standard palette (orange-600) not custom claude-* colors

**Q: Auto-save not working?**
A: Check browser console for localStorage errors. Try clearing storage and refreshing.

**Q: Download button does nothing?**
A: Check browser's download settings. Some browsers block downloads from localhost.

**Q: How to reset wizard state?**
A: Open DevTools → Application → Storage → Local Storage → Clear

**Q: How to add more presets?**
A: Edit `src/lib/constants/defaults.ts` and `src/components/steps/Step2_TechStack.tsx`

---

## Related Documents

- **Original SOP:** `C:\Users\erric_sgphddc\Claude-Code-Project-Setup-SOP.md`
- **README:** `C:\Users\erric_sgphddc\Projects\claude-project-wizard\README.md`
- **Implementation Plans:**
  - MVP Plan: `C:\Users\erric_sgphddc\.claude\plans\frolicking-drifting-dongarra.md`
  - Step 3 Plan: `C:\Users\erric_sgphddc\.claude\plans\sunny-forging-hopcroft.md`

---

## Changelog

### December 21, 2025 - Step 3 Implementation
- ✅ **Implemented Step 3: Common Commands** (replaced placeholder)
- ✅ Created `Step3_CommonCommands.tsx` component
  - Dynamic add/remove list for commands
  - Empty state with emoji and helpful messaging
  - Command cards with inline editing (command + description)
  - Trash icon button for removal using Heroicons
  - Add command button with plus icon
  - Preset info banner integration
  - Full Zustand store integration
  - Accessible with ARIA labels
- ✅ Updated `WizardContainer.tsx` to use new component
- ✅ Tested with empty state and preset-populated data
- ✅ Dev server running successfully at localhost:5173
- ✅ Updated CLAUDE.md documentation with progress

### December 20, 2025 - MVP Complete
- ✅ Initial project setup (Vite + React + TypeScript)
- ✅ Zustand store with persistence
- ✅ Smart defaults for 3 tech stacks
- ✅ CLAUDE.md template generator
- ✅ Steps 1, 2, 9 implemented
- ✅ Placeholder steps 3-8
- ✅ Live preview component
- ✅ Auto-save functionality
- ✅ Download feature
- ✅ End-to-end testing completed
- ✅ Bug fix: Button visibility (Tailwind v4 colors)
- ✅ Created comprehensive CLAUDE.md documentation

---

**End of Documentation**

*For your next session, simply say: "Read CLAUDE.md and let's [do something specific]"*

*This will use ~2k tokens instead of 116k+ tokens of chat history!* 🎉
