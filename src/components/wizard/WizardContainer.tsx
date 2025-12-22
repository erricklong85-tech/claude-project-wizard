import React from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { Button } from '../ui/Button';
import { Step1_ProjectOverview } from '../steps/Step1_ProjectOverview';
import { Step2_TechStack } from '../steps/Step2_TechStack';
import { Step3_CommonCommands } from '../steps/Step3_CommonCommands';
import { Step9_Review } from '../steps/Step9_Review';
import { LivePreview } from '../preview/LivePreview';

// Placeholder components for steps 3-8 (for MVP)
const PlaceholderStep = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-600">
        This section will be fully implemented soon. For now, you can skip to the next step.
      </p>
    </div>
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm text-yellow-800">
        ⚠️ This step is using default values from the preset. You can customize later.
      </p>
    </div>
  </div>
);

export function WizardContainer() {
  const currentStep = useWizardStore((state) => state.currentStep);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);
  const markStepCompleted = useWizardStore((state) => state.markStepCompleted);

  const steps = [
    { component: Step1_ProjectOverview, title: 'Project Overview' },
    { component: Step2_TechStack, title: 'Tech Stack' },
    { component: Step3_CommonCommands, title: 'Commands' },
    { component: () => <PlaceholderStep title="Code Style" />, title: 'Code Style' },
    { component: () => <PlaceholderStep title="Testing Strategy" />, title: 'Testing' },
    { component: () => <PlaceholderStep title="Git Workflow" />, title: 'Git Workflow' },
    { component: () => <PlaceholderStep title="Environment Setup" />, title: 'Environment' },
    { component: () => <PlaceholderStep title="Advanced Config" />, title: 'Advanced' },
    { component: Step9_Review, title: 'Review & Download' },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    markStepCompleted(currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-claude-600">Claude Code Project Setup Wizard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create your perfect CLAUDE.md configuration in minutes
          </p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentStep
                      ? 'bg-claude-600 text-white'
                      : index < currentStep
                        ? 'bg-claude-100 text-claude-700'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${index < currentStep ? 'bg-claude-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-center text-sm font-medium text-gray-700">
            {steps[currentStep].title}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CurrentStepComponent />

              {/* Navigation */}
              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </span>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>Next →</Button>
                ) : (
                  <Button variant="secondary" disabled>
                    Finished
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
