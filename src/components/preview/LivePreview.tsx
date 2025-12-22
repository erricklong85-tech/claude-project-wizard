import { useMemo } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { generateProgressivePreview } from '../../lib/templates/claudeTemplate';
import { Button } from '../ui/Button';
import { downloadClaudeMd } from '../../lib/utils/download';

export function LivePreview() {
  const formData = useWizardStore((state) => state.formData);
  const completedSteps = useWizardStore((state) => state.completedSteps);

  const previewContent = useMemo(() => {
    return generateProgressivePreview(formData, completedSteps);
  }, [formData, completedSteps]);

  const handleDownload = () => {
    downloadClaudeMd(previewContent);
  };

  return (
    <div className="sticky top-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Live Preview</h3>
        <Button size="sm" onClick={handleDownload} disabled={completedSteps.size === 0}>
          Download
        </Button>
      </div>

      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-700">
          {previewContent}
        </pre>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
        {completedSteps.size} / 8 sections completed
      </div>
    </div>
  );
}
