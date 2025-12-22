import localforage from 'localforage';
import type { WizardState } from '../../types/wizard';

const STORAGE_KEY = 'claude-wizard-state';
const STORAGE_VERSION = 1;

interface StoredData {
  version: number;
  lastSaved: string;
  state: WizardState;
}

// Configure localforage
localforage.config({
  name: 'claude-project-wizard',
  storeName: 'wizard_data',
  description: 'Claude Code Project Setup Wizard data',
});

export async function saveWizardState(state: WizardState): Promise<void> {
  const data: StoredData = {
    version: STORAGE_VERSION,
    lastSaved: new Date().toISOString(),
    state: {
      ...state,
      // Convert Sets to Arrays for serialization
      completedSteps: state.completedSteps,
      skippedSteps: state.skippedSteps,
    },
  };

  await localforage.setItem(STORAGE_KEY, data);
}

export async function loadWizardState(): Promise<WizardState | null> {
  try {
    const data = await localforage.getItem<StoredData>(STORAGE_KEY);

    if (!data) {
      return null;
    }

    // Version check - migrate if needed
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, clearing data');
      await clearWizardState();
      return null;
    }

    return data.state;
  } catch (error) {
    console.error('Failed to load wizard state:', error);
    return null;
  }
}

export async function clearWizardState(): Promise<void> {
  await localforage.removeItem(STORAGE_KEY);
}

export async function hasStoredState(): Promise<boolean> {
  const data = await localforage.getItem(STORAGE_KEY);
  return data !== null;
}
