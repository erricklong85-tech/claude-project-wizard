import { WizardContainer } from './components/wizard/WizardContainer';
import { useAutoSave, useLoadSavedState } from './hooks/useAutoSave';

function App() {
  // Load saved state on mount
  useLoadSavedState();

  // Auto-save every 5 seconds
  useAutoSave(5000);

  return <WizardContainer />;
}

export default App;
