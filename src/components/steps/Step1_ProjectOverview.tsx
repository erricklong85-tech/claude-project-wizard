import { useWizardStore } from '../../store/wizardStore';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';

export function Step1_ProjectOverview() {
  const projectOverview = useWizardStore((state) => state.formData.projectOverview);
  const updateFormData = useWizardStore((state) => state.updateFormData);

  const handleChange = (field: keyof typeof projectOverview, value: any) => {
    updateFormData('projectOverview', { [field]: value });
  };

  const projectTypeOptions = [
    { value: 'automation', label: 'Automation' },
    { value: 'client-project', label: 'Client Project' },
    { value: 'app', label: 'Application' },
    { value: 'website', label: 'Website' },
    { value: 'library', label: 'Library/Package' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
        <p className="mt-1 text-sm text-gray-600">
          Let's start with the basics. Tell us about your project.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Project Name"
          required
          placeholder="my-awesome-project"
          value={projectOverview.name}
          onChange={(e) => handleChange('name', e.target.value)}
          helperText="Use lowercase letters, numbers, and hyphens only (no spaces)"
        />

        <Select
          label="Project Type"
          required
          options={projectTypeOptions}
          value={projectOverview.type}
          onChange={(e) => handleChange('type', e.target.value)}
        />

        <Textarea
          label="Project Description"
          required
          placeholder="A brief description of what this project does..."
          value={projectOverview.description}
          onChange={(e) => handleChange('description', e.target.value)}
          helperText="Describe the purpose and main features of your project"
          rows={4}
        />
      </div>
    </div>
  );
}
