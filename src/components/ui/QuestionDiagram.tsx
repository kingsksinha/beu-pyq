import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { MathText } from './MathText';

export const BRIDGE_CIRCUIT_SVG = `<svg width="380" height="220" viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="max-w-full">
  <!-- Subtle Grid Pattern in Background -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="380" height="220" fill="url(#grid)" />
  
  <!-- Terminal Conductors -->
  <line x1="30" y1="110" x2="90" y2="110" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />
  <line x1="290" y1="110" x2="350" y2="110" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />
  
  <!-- Terminal Nodes A & B -->
  <circle cx="30" cy="110" r="7" fill="#4f46e5" stroke="#ffffff" stroke-width="2" />
  <text x="24" y="92" font-family="monospace" font-size="14" font-weight="bold" fill="#6366f1">A</text>
  <circle cx="350" cy="110" r="7" fill="#4f46e5" stroke="#ffffff" stroke-width="2" />
  <text x="344" y="92" font-family="monospace" font-size="14" font-weight="bold" fill="#6366f1">B</text>

  <!-- Diamond Bridge Arms -->
  <line x1="90" y1="110" x2="190" y2="35" stroke="#64748b" stroke-width="2.5" />
  <line x1="90" y1="110" x2="190" y2="185" stroke="#64748b" stroke-width="2.5" />
  <line x1="190" y1="35" x2="290" y2="110" stroke="#64748b" stroke-width="2.5" />
  <line x1="190" y1="185" x2="290" y2="110" stroke="#64748b" stroke-width="2.5" />
  
  <!-- Central Bridge Arm C to D -->
  <line x1="190" y1="35" x2="190" y2="185" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 3" />

  <!-- Bridge Junction Nodes C & D -->
  <circle cx="90" cy="110" r="4.5" fill="#6366f1" />
  <circle cx="290" cy="110" r="4.5" fill="#6366f1" />
  <circle cx="190" cy="35" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
  <text x="180" y="24" font-family="sans-serif" font-size="12" font-weight="bold" fill="#3b82f6">Node C</text>
  <circle cx="190" cy="185" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
  <text x="180" y="206" font-family="sans-serif" font-size="12" font-weight="bold" fill="#3b82f6">Node D</text>

  <!-- Resistor Badges with High Contrast -->
  <!-- R1 (A to C: 2 Ohm) -->
  <rect x="115" y="55" width="50" height="24" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
  <text x="123" y="72" font-family="monospace" font-size="12" font-weight="bold" fill="#a5b4fc">2 Ω</text>

  <!-- R2 (A to D: 4 Ohm) -->
  <rect x="115" y="142" width="50" height="24" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
  <text x="123" y="159" font-family="monospace" font-size="12" font-weight="bold" fill="#a5b4fc">4 Ω</text>

  <!-- R3 (C to B: 3 Ohm) -->
  <rect x="215" y="55" width="50" height="24" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
  <text x="223" y="72" font-family="monospace" font-size="12" font-weight="bold" fill="#a5b4fc">3 Ω</text>

  <!-- R4 (D to B: 6 Ohm) -->
  <rect x="215" y="142" width="50" height="24" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
  <text x="223" y="159" font-family="monospace" font-size="12" font-weight="bold" fill="#a5b4fc">6 Ω</text>

  <!-- R5 Central Resistor (5 Ohm) -->
  <rect x="165" y="98" width="50" height="24" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" />
  <text x="173" y="115" font-family="monospace" font-size="12" font-weight="bold" fill="#fca5a5">5 Ω</text>
</svg>`;

interface QuestionDiagramProps {
  images?: string[];
  questionText?: string;
}

export const QuestionDiagram: React.FC<QuestionDiagramProps> = ({ images, questionText = '' }) => {
  if (!images || images.length === 0) return null;

  const textLower = questionText.toLowerCase();
  const isBridgeCircuit =
    images.some(img => img.includes('22bee2b') || img.includes('bee')) ||
    textLower.includes('resistance between a and b') ||
    textLower.includes('resistance between a & b') ||
    textLower.includes('figure given below');

  if (isBridgeCircuit) {
    return (
      <div className="my-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Reconstructed Official Examination Schematic Diagram</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
            Terminals A – B Bridge Network
          </span>
        </div>

        <div
          className="overflow-x-auto flex justify-center py-2"
          dangerouslySetInnerHTML={{ __html: BRIDGE_CIRCUIT_SVG }}
        />

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Bridge Condition:</strong>{' '}
            <MathText text="$R_1/R_2 = 2/4 = 0.5$ and $R_3/R_4 = 3/6 = 0.5$ (Balanced, $I_{R_5} = 0\text{ A}$)" inline />
          </div>
          <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <MathText text="$R_{AB} = 3.33\,\Omega$" inline />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <ImageIcon className="w-4 h-4" />
          <span>University Exam Figure Reference</span>
        </span>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {images.join(', ')}
        </span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        This examination question references a schematic figure from the physical question paper sheet. Full step-by-step mathematical working, formulas, and evaluation scheme are provided in the <strong>Official Model Answer</strong> below.
      </p>
    </div>
  );
};
