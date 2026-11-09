import React from 'react';
import { Flame, HelpCircle, X } from 'lucide-react';

interface FrequencyLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FrequencyLegendModal: React.FC<FrequencyLegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    { stars: '★★★★★★+', label: '6+ Times Repeated', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', desc: 'Critical "Must Read" questions recurring in almost every exam cycle.' },
    { stars: '★★★★★', label: '5 Times Repeated', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', desc: 'Very high yield questions; highly likely to appear in upcoming exams.' },
    { stars: '★★★★', label: '4 Times Repeated', color: 'text-lime-600 dark:text-lime-400 bg-lime-500/10 border-lime-500/30', desc: 'High priority questions; core university curriculum topic.' },
    { stars: '★★★', label: '3 Times Repeated', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30', desc: 'Repeated multiple times across previous academic years.' },
    { stars: '★★', label: '2 Times Repeated', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30', desc: 'Appeared in at least two different examination years.' },
    { stars: '★', label: '1 Time / Standard', color: 'text-slate-500 dark:text-slate-400 bg-slate-500/10 border-slate-500/30', desc: 'Standard syllabus question appeared once in this format.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2 text-amber-500 font-semibold">
            <Flame className="w-5 h-5 fill-amber-500/30" />
            <h3 className="text-base text-slate-900 dark:text-white font-bold">Question Repetition & Star Rating System</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            BEU previous year questions have been algorithmically analyzed across 14 years of past examinations (2012–2025). Star ratings highlight recurring concepts so you can prioritize your study sessions.
          </p>

          <div className="space-y-2">
            {rules.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border font-mono ${r.color}`}>
                    {r.stars}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px] text-right">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">How to use this:</span> Focus first on 3★ to 6★ questions during revision. In the "Practice Mode" tab, you can filter specifically for high-yield questions only.
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-500/20"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
