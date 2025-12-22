import { create } from 'zustand';
import type { WizardStore, WizardFormData, PresetType } from '../types/wizard';
import { INITIAL_FORM_DATA, SMART_PRESETS } from '../lib/constants/defaults';
import { saveWizardState, loadWizardState, clearWizardState } from '../lib/utils/storage';

const initialState = {
  currentStep: 0,
  formData: INITIAL_FORM_DATA as WizardFormData,
  completedSteps: new Set<number>(),
  skippedSteps: new Set<number>(),
  lastSaved: null,
  appliedPreset: null,
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  ...initialState,

  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },

  updateFormData: <K extends keyof WizardFormData>(
    section: K,
    data: Partial<WizardFormData[K]>
  ) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [section]: Array.isArray(data)
          ? data
          : {
              ...state.formData[section],
              ...data,
            },
      },
    }));

    // Auto-save after update
    setTimeout(() => {
      get().saveToStorage();
    }, 500);
  },

  markStepCompleted: (step: number) => {
    set((state) => {
      const newCompleted = new Set(state.completedSteps);
      newCompleted.add(step);

      // Remove from skipped if it was there
      const newSkipped = new Set(state.skippedSteps);
      newSkipped.delete(step);

      return {
        completedSteps: newCompleted,
        skippedSteps: newSkipped,
      };
    });
  },

  toggleSkipStep: (step: number) => {
    set((state) => {
      const newSkipped = new Set(state.skippedSteps);

      if (newSkipped.has(step)) {
        newSkipped.delete(step);
      } else {
        newSkipped.add(step);
        // Remove from completed if skipping
        const newCompleted = new Set(state.completedSteps);
        newCompleted.delete(step);
        return {
          skippedSteps: newSkipped,
          completedSteps: newCompleted,
        };
      }

      return { skippedSteps: newSkipped };
    });
  },

  applyPreset: (preset: PresetType) => {
    if (preset === 'custom') {
      return;
    }

    const presetData = SMART_PRESETS[preset];

    if (!presetData) {
      console.error(`Preset ${preset} not found`);
      return;
    }

    set((state) => ({
      formData: {
        ...state.formData,
        techStack: { ...presetData.techStack },
        commonCommands: [...presetData.commonCommands],
        codeStyle: {
          ...state.formData.codeStyle,
          ...presetData.codeStyle,
        },
        testing: {
          ...state.formData.testing,
          ...presetData.testing,
        },
        gitWorkflow: {
          ...state.formData.gitWorkflow,
          ...presetData.gitWorkflow,
        },
        environment: {
          requiredVersions: { ...presetData.environment.requiredVersions },
          environmentVariables: presetData.environment.environmentVariables
            ? [...presetData.environment.environmentVariables]
            : [],
          setupInstructions: presetData.environment.setupInstructions,
        },
        advanced: {
          ...state.formData.advanced,
          ...presetData.advanced,
          mcpServers: presetData.advanced.mcpServers
            ? [...presetData.advanced.mcpServers]
            : state.formData.advanced.mcpServers,
        },
      },
      appliedPreset: preset,
    }));

    // Mark steps as completed that were filled by preset
    set((state) => {
      const newCompleted = new Set(state.completedSteps);
      newCompleted.add(1); // Tech stack
      newCompleted.add(2); // Common commands
      newCompleted.add(3); // Code style
      newCompleted.add(4); // Testing
      newCompleted.add(5); // Git workflow
      newCompleted.add(6); // Environment
      return { completedSteps: newCompleted };
    });

    // Save after applying preset
    setTimeout(() => {
      get().saveToStorage();
    }, 500);
  },

  resetWizard: () => {
    set(initialState);
    clearWizardState();
  },

  loadFromStorage: async () => {
    const savedState = await loadWizardState();

    if (savedState) {
      set({
        ...savedState,
        completedSteps: new Set(savedState.completedSteps),
        skippedSteps: new Set(savedState.skippedSteps),
      });
    }
  },

  saveToStorage: async () => {
    const state = get();
    await saveWizardState({
      currentStep: state.currentStep,
      formData: state.formData,
      completedSteps: state.completedSteps,
      skippedSteps: state.skippedSteps,
      lastSaved: new Date().toISOString(),
      appliedPreset: state.appliedPreset,
    });

    set({ lastSaved: new Date().toISOString() });
  },
}));
