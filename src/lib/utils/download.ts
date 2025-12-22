import { saveAs } from 'file-saver';

export function downloadClaudeMd(content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const filename = 'CLAUDE.md';
  saveAs(blob, filename);
}

export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  saveAs(blob, filename);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
