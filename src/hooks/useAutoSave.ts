import { useEffect } from 'react';
import { useWizardStore } from '../store/wizardStore';

export function useAutoSave(interval = 5000) {
  const saveToStorage = useWizardStore((state) => state.saveToStorage);

  useEffect(() => {
    const timer = setInterval(() => {
      saveToStorage();
    }, interval);

    return () => clearInterval(timer);
  }, [saveToStorage, interval]);
}

export function useLoadSavedState() {
  const loadFromStorage = useWizardStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
}
