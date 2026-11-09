import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { MathText } from './MathText';

export const BRIDGE_CIRCUIT_SVG = `<svg width="380" height="220" viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="max-w-full">
  <!-- Subtle Grid Pattern in Background -->
  <defs>
    <pattern id="bridge-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="380" height="220" fill="url(#bridge-grid)" />
  
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

export const SAWTOOTH_WAVEFORM_SVG = `<svg width="420" height="220" viewBox="0 0 420 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="max-w-full">
  <defs>
    <pattern id="sawtooth-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <rect width="420" height="220" fill="url(#sawtooth-grid)" />

  <!-- Shaded Area under Repeating Cycles -->
  <polygon points="65,150 155,50 155,150" fill="url(#waveFill)" />
  <polygon points="155,150 245,50 245,150" fill="url(#waveFill)" opacity="0.6" />
  <polygon points="245,150 335,50 335,150" fill="url(#waveFill)" opacity="0.3" />

  <!-- Horizontal Time Axis (t) -->
  <line x1="50" y1="150" x2="390" y2="150" stroke="#94a3b8" stroke-width="2" />
  <polygon points="390,146 398,150 390,154" fill="#94a3b8" />
  <text x="390" y="170" font-family="monospace" font-size="12" font-weight="bold" fill="#64748b">t (s)</text>

  <!-- Vertical Voltage Axis v(t) -->
  <line x1="65" y1="170" x2="65" y2="25" stroke="#94a3b8" stroke-width="2" />
  <polygon points="61,25 65,17 69,25" fill="#94a3b8" />
  <text x="75" y="28" font-family="monospace" font-size="13" font-weight="bold" fill="#6366f1">v(t) [V]</text>

  <!-- Peak Voltage Vm Dashed Guideline -->
  <line x1="50" y1="50" x2="360" y2="50" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
  <circle cx="65" cy="50" r="3" fill="#6366f1" />
  <text x="32" y="54" font-family="monospace" font-size="13" font-weight="bold" fill="#6366f1">Vm</text>

  <!-- Waveform Linear Ramps -->
  <!-- Cycle 1 (0 to T) -->
  <line x1="65" y1="150" x2="155" y2="50" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" />
  <line x1="155" y1="50" x2="155" y2="150" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" />
  <circle cx="155" cy="50" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />

  <!-- Cycle 2 (T to 2T) -->
  <line x1="155" y1="150" x2="245" y2="50" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" />
  <line x1="245" y1="50" x2="245" y2="150" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" />
  <circle cx="245" cy="50" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />

  <!-- Cycle 3 (2T to 3T) -->
  <line x1="245" y1="150" x2="335" y2="50" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" />
  <line x1="335" y1="50" x2="335" y2="150" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3" />
  <circle cx="335" cy="50" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />

  <!-- Origin (0,0) -->
  <circle cx="65" cy="150" r="3.5" fill="#64748b" />
  <text x="52" y="166" font-family="monospace" font-size="12" fill="#64748b">0</text>

  <!-- Time Period Markers -->
  <line x1="155" y1="147" x2="155" y2="153" stroke="#94a3b8" stroke-width="2" />
  <text x="150" y="168" font-family="monospace" font-size="12" font-weight="bold" fill="#6366f1">T</text>

  <line x1="245" y1="147" x2="245" y2="153" stroke="#94a3b8" stroke-width="2" />
  <text x="238" y="168" font-family="monospace" font-size="12" font-weight="bold" fill="#6366f1">2T</text>

  <line x1="335" y1="147" x2="335" y2="153" stroke="#94a3b8" stroke-width="2" />
  <text x="328" y="168" font-family="monospace" font-size="12" font-weight="bold" fill="#6366f1">3T</text>

  <!-- Mathematical Slope Label -->
  <rect x="75" y="85" width="84" height="20" rx="4" fill="#0f172a" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1" />
  <text x="80" y="99" font-family="monospace" font-size="10.5" font-weight="bold" fill="#38bdf8">v(t) = (Vm/T)·t</text>
</svg>`;

interface QuestionDiagramProps {
  images?: string[];
  questionText?: string;
}

export const QuestionDiagram: React.FC<QuestionDiagramProps> = ({ images, questionText = '' }) => {
  if (!images || images.length === 0) return null;

  const textLower = questionText.toLowerCase();

  // Strict 1:1 image and question targeting
  const isBridgeCircuit =
    images.some(img => img.includes('22bee2b')) ||
    ((textLower.includes('resistance between a and b') || textLower.includes('resistance between a & b')) &&
      !textLower.includes('waveform') &&
      !textLower.includes('r.m.s') &&
      !textLower.includes('rms'));

  const isSawtoothWaveform =
    images.some(img => img.includes('22bee3a')) ||
    ((textLower.includes('waveform') || textLower.includes('given waveform')) &&
      (textLower.includes('r.m.s') || textLower.includes('rms') || textLower.includes('v_rms') || textLower.includes('v_{\\text{rms}}')));

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

  if (isSawtoothWaveform) {
    return (
      <div className="my-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Reconstructed Official Examination Schematic Diagram</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
            Periodic Sawtooth Waveform (Fig. 22bee3a)
          </span>
        </div>

        <div
          className="overflow-x-auto flex justify-center py-2"
          dangerouslySetInnerHTML={{ __html: SAWTOOTH_WAVEFORM_SVG }}
        />

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Waveform Equation:</strong>{' '}
            <MathText text="$v(t) = \frac{V_m}{T} t \quad (0 \le t \le T)$" inline />
          </div>
          <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <MathText text="$V_{\text{rms}} = \frac{V_m}{\sqrt{3}} \approx 0.577 V_m$" inline />
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
