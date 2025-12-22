import { useWizardStore } from '../../store/wizardStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { CommandData } from '../../types/wizard';

export function Step3_CommonCommands() {
  const commonCommands = useWizardStore((state) => state.formData.commonCommands);
  const updateFormData = useWizardStore((state) => state.updateFormData);
  const appliedPreset = useWizardStore((state) => state.appliedPreset);

  const handleAddCommand = () => {
    const newCommand: CommandData = { command: '', description: '' };
    updateFormData('commonCommands', [...commonCommands, newCommand]);
  };

  const handleRemoveCommand = (index: number) => {
    const updated = commonCommands.filter((_, i) => i !== index);
    updateFormData('commonCommands', updated);
  };

  const handleUpdateCommand = (
    index: number,
    field: 'command' | 'description',
    value: string
  ) => {
    const updated = commonCommands.map((cmd, i) =>
      i === index ? { ...cmd, [field]: value } : cmd
    );
    updateFormData('commonCommands', updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Common Commands</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add commands that Claude can use to build, test, and run your project.
        </p>
      </div>

      {/* Preset Info Banner (if preset applied) */}
      {appliedPreset && appliedPreset !== 'custom' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700">
            ✓ Commands pre-populated from <strong>{appliedPreset}</strong> preset.
            You can customize them below.
          </p>
        </div>
      )}

      {/* Empty State OR Command List */}
      {commonCommands.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No commands configured
          </h3>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Common commands help Claude understand how to build, test, and run your project.
          </p>
          <Button variant="outline" onClick={handleAddCommand}>
            <PlusIcon className="w-5 h-5 mr-2 inline" />
            Add Your First Command
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {commonCommands.map((cmd, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Input
                    label="Command"
                    required
                    placeholder="npm run dev"
                    value={cmd.command}
                    onChange={(e) => handleUpdateCommand(index, 'command', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCommand(index)}
                  className="ml-3 mt-7 text-red-600 hover:text-red-800"
                  aria-label={`Remove command: ${cmd.command || 'empty command'}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              <Input
                label="Description"
                required
                placeholder="Start development server"
                value={cmd.description}
                onChange={(e) => handleUpdateCommand(index, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Command Button (shown when list has items) */}
      {commonCommands.length > 0 && (
        <Button variant="outline" onClick={handleAddCommand}>
          <PlusIcon className="w-5 h-5 mr-2 inline" />
          Add Command
        </Button>
      )}
    </div>
  );
}
