import { useWizardStore } from '../../store/wizardStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { PresetType } from '../../types/wizard';

export function Step2_TechStack() {
  const techStack = useWizardStore((state) => state.formData.techStack);
  const updateFormData = useWizardStore((state) => state.updateFormData);
  const applyPreset = useWizardStore((state) => state.applyPreset);
  const appliedPreset = useWizardStore((state) => state.appliedPreset);

  const handleChange = (field: keyof typeof techStack, value: any) => {
    updateFormData('techStack', { [field]: value });
  };

  const handleApplyPreset = (preset: PresetType) => {
    applyPreset(preset);
  };

  const languageOptions = [
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'Python', label: 'Python' },
    { value: 'Go', label: 'Go' },
    { value: 'Rust', label: 'Rust' },
    { value: 'Java', label: 'Java' },
    { value: 'Other', label: 'Other' },
  ];

  const getFrameworkOptions = () => {
    const lang = techStack.language;
    if (lang === 'TypeScript' || lang === 'JavaScript') {
      return [
        { value: 'React', label: 'React' },
        { value: 'Next.js', label: 'Next.js' },
        { value: 'Vue', label: 'Vue' },
        { value: 'Svelte', label: 'Svelte' },
        { value: 'Node.js/Express', label: 'Node.js/Express' },
        { value: 'None', label: 'None' },
      ];
    } else if (lang === 'Python') {
      return [
        { value: 'Flask', label: 'Flask' },
        { value: 'Django', label: 'Django' },
        { value: 'FastAPI', label: 'FastAPI' },
        { value: 'None', label: 'None' },
      ];
    }
    return [{ value: 'None', label: 'None' }];
  };

  const getPackageManagerOptions = () => {
    const lang = techStack.language;
    if (lang === 'TypeScript' || lang === 'JavaScript') {
      return [
        { value: 'npm', label: 'npm' },
        { value: 'pnpm', label: 'pnpm' },
        { value: 'yarn', label: 'yarn' },
        { value: 'bun', label: 'bun' },
      ];
    } else if (lang === 'Python') {
      return [
        { value: 'pip', label: 'pip' },
        { value: 'poetry', label: 'Poetry' },
      ];
    }
    return [{ value: 'npm', label: 'npm' }];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>
        <p className="mt-1 text-sm text-gray-600">
          Define your project's technology stack or choose a preset below.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="bg-claude-50 border border-claude-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Start with Presets</h3>
        <div className="flex gap-3 flex-wrap">
          <Button
            type="button"
            variant={appliedPreset === 'react-vite' ? 'primary' : 'outline'}
            onClick={() => handleApplyPreset('react-vite')}
          >
            React + Vite
          </Button>
          <Button
            type="button"
            variant={appliedPreset === 'nextjs' ? 'primary' : 'outline'}
            onClick={() => handleApplyPreset('nextjs')}
          >
            Next.js
          </Button>
          <Button
            type="button"
            variant={appliedPreset === 'python-flask' ? 'primary' : 'outline'}
            onClick={() => handleApplyPreset('python-flask')}
          >
            Python + Flask
          </Button>
        </div>
        {appliedPreset && (
          <p className="mt-3 text-sm text-claude-700">
            ✓ Applied <strong>{appliedPreset}</strong> preset. You can customize the values below.
          </p>
        )}
      </div>

      {/* Manual Form Fields */}
      <div className="space-y-4">
        <Select
          label="Programming Language"
          required
          options={languageOptions}
          value={techStack.language}
          onChange={(e) => handleChange('language', e.target.value)}
        />

        <Select
          label="Framework"
          options={getFrameworkOptions()}
          value={techStack.framework || ''}
          onChange={(e) => handleChange('framework', e.target.value || null)}
        />

        <Select
          label="Package Manager"
          required
          options={getPackageManagerOptions()}
          value={techStack.packageManager}
          onChange={(e) => handleChange('packageManager', e.target.value)}
        />

        <Input
          label="Runtime Version"
          required
          placeholder="e.g., Node 20+, Python 3.11+"
          value={techStack.runtime}
          onChange={(e) => handleChange('runtime', e.target.value)}
          helperText="Specify the minimum required runtime version"
        />
      </div>
    </div>
  );
}
