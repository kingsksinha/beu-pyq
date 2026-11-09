import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const BRIDGE_CIRCUIT_SVG = `<svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="max-w-full">
  <line x1="20" y1="100" x2="70" y2="100" stroke="#6366f1" stroke-width="2.5" />
  <line x1="270" y1="100" x2="320" y2="100" stroke="#6366f1" stroke-width="2.5" />
  <circle cx="20" cy="100" r="5" fill="#4f46e5" />
  <text x="14" y="85" font-family="monospace" font-size="13" font-weight="bold" fill="#6366f1">A</text>
  <circle cx="320" cy="100" r="5" fill="#4f46e5" />
  <text x="314" y="85" font-family="monospace" font-size="13" font-weight="bold" fill="#6366f1">B</text>
  <line x1="70" y1="100" x2="170" y2="30" stroke="#64748b" stroke-width="2" />
  <line x1="70" y1="100" x2="170" y2="170" stroke="#64748b" stroke-width="2" />
  <line x1="170" y1="30" x2="270" y2="100" stroke="#64748b" stroke-width="2" />
  <line x1="170" y1="170" x2="270" y2="100" stroke="#64748b" stroke-width="2" />
  <line x1="170" y1="30" x2="170" y2="170" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4 2" />
  <circle cx="70" cy="100" r="4" fill="#6366f1" />
  <circle cx="270" cy="100" r="4" fill="#6366f1" />
  <circle cx="170" cy="30" r="4" fill="#3b82f6" />
  <text x="165" y="20" font-family="sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">C</text>
  <circle cx="170" cy="170" r="4" fill="#3b82f6" />
  <text x="165" y="190" font-family="sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">D</text>
  <rect x="95" y="50" width="46" height="20" rx="5" fill="#f8fafc" stroke="#6366f1" stroke-width="1.5" />
  <text x="100" y="64" font-family="monospace" font-size="11" font-weight="bold" fill="#4338ca">2 Ω</text>
  <rect x="95" y="130" width="46" height="20" rx="5" fill="#f8fafc" stroke="#6366f1" stroke-width="1.5" />
  <text x="100" y="144" font-family="monospace" font-size="11" font-weight="bold" fill="#4338ca">4 Ω</text>
  <rect x="195" y="50" width="46" height="20" rx="5" fill="#f8fafc" stroke="#6366f1" stroke-width="1.5" />
  <text x="200" y="64" font-family="monospace" font-size="11" font-weight="bold" fill="#4338ca">3 Ω</text>
  <rect x="195" y="130" width="46" height="20" rx="5" fill="#f8fafc" stroke="#6366f1" stroke-width="1.5" />
  <text x="200" y="144" font-family="monospace" font-size="11" font-weight="bold" fill="#4338ca">6 Ω</text>
  <rect x="148" y="90" width="44" height="20" rx="5" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
  <text x="153" y="104" font-family="monospace" font-size="11" font-weight="bold" fill="#b91c1c">5 Ω</text>
</svg>`;

interface QuestionDiagramProps {
  images?: string[];
  questionText?: string;
}

export const QuestionDiagram: React.FC<QuestionDiagramProps> = ({ images, questionText = '' }) => {
  if (!images || images.length === 0) return null;

  const textLower = questionText.toLowerCase();
  const isBridgeCircuit =
    images.some(img => img.includes('22bee2b')) ||
    textLower.includes('resistance between a and b') ||
    textLower.includes('resistance between a & b');

  if (isBridgeCircuit) {
    return (
      <div className="my-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            <span>Official Examination Circuit Schematic</span>
          </span>
          <span className="text-[10px] font-mono font-medium text-slate-400">Fig. Q.2 (b)</span>
        </div>
        <div
          className="overflow-x-auto flex justify-center py-2"
          dangerouslySetInnerHTML={{ __html: BRIDGE_CIRCUIT_SVG }}
        />
      </div>
    );
  }

  return (
    <div className="my-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
      <ImageIcon className="w-4 h-4 shrink-0 text-slate-400" />
      <span>
        Question Diagram referenced in official university examination sheet ({images.join(', ')}).
      </span>
    </div>
  );
};
