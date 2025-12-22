import { useState } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { Button } from '../ui/Button';
import { generateClaudeMd } from '../../lib/templates/claudeTemplate';
import { downloadClaudeMd, copyToClipboard } from '../../lib/utils/download';

export function Step9_Review() {
  const formData = useWizardStore((state) => state.formData);
  const [copied, setCopied] = useState(false);

  const claudeMdContent = generateClaudeMd(formData);

  const handleDownload = () => {
    downloadClaudeMd(claudeMdContent);
  };

  const handleCopy = async () => {
    await copyToClipboard(claudeMdContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Download</h2>
        <p className="mt-1 text-sm text-gray-600">
          Review your configuration and download your CLAUDE.md file.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Project</h3>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {formData.projectOverview.name || 'Not set'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Type:</strong> {formData.projectOverview.type}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Tech Stack</h3>
          <p className="text-sm text-gray-600">
            <strong>Language:</strong> {formData.techStack.language || 'Not set'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Framework:</strong> {formData.techStack.framework || 'None'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Testing</h3>
          <p className="text-sm text-gray-600">
            <strong>Framework:</strong> {formData.testing.framework || 'Not set'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Coverage:</strong> {formData.testing.coverageTarget}%
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Commands</h3>
          <p className="text-sm text-gray-600">
            {formData.commonCommands.length} command{formData.commonCommands.length !== 1 ? 's' : ''} configured
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">CLAUDE.md Preview</h3>
        <pre className="text-xs bg-white p-4 rounded border border-gray-200 overflow-x-auto max-h-96">
          {claudeMdContent}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} size="lg">
          ⬇️ Download CLAUDE.md
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
          <li>Download your CLAUDE.md file</li>
          <li>Place it in your project root directory</li>
          <li>Initialize Claude Code: <code className="bg-blue-100 px-1 rounded">claude</code></li>
          <li>Start building with Claude!</li>
        </ol>
      </div>
    </div>
  );
}
