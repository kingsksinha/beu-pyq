import React, { useState } from 'react';
import { BookOpen, CheckCircle, CheckCircle2, ChevronDown, ChevronUp, FileCheck2, Lightbulb, Lock, Unlock } from 'lucide-react';
import { modelAnswerService } from '../../services/modelAnswerService';
import type { ModelAnswer } from '../../services/modelAnswerService';
import { MathText } from '../ui/MathText';

interface ModelAnswerCardProps {
  questionText: string;
  marks?: string;
  options?: string[];
  subNumber?: string;
  selectedOptionIndex?: number | null;
  defaultExpanded?: boolean;
  isAttempted?: boolean;
  onReveal?: () => void;
}

export const ModelAnswerCard: React.FC<ModelAnswerCardProps> = ({
  questionText,
  marks,
  options,
  subNumber,
  selectedOptionIndex,
  defaultExpanded = false,
  isAttempted = true,
  onReveal
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [manualUnlocked, setManualUnlocked] = useState(false);

  const modelAnswer: ModelAnswer = modelAnswerService.findModelAnswer(
    questionText,
    marks,
    options,
    subNumber
  );
  const isMcq = !!(modelAnswer.isMcq || (options && options.length > 0));
  const parsedMarksNum = marks ? parseInt(marks.replace(/[^0-9]/g, '') || (isMcq ? '2' : '7'), 10) : (isMcq ? 2 : 7);

  const unlocked = isAttempted || manualUnlocked;

  const handleToggle = () => {
    if (!unlocked) {
      // If locked, clicking expands to show unlock option or prompt
      setIsExpanded(prev => !prev);
      return;
    }
    setIsExpanded(prev => !prev);
  };

  const handleManualUnlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setManualUnlocked(true);
    setIsExpanded(true);
    if (onReveal) onReveal();
  };

  return (
    <div className={`mt-3 rounded-2xl border transition overflow-hidden shadow-2xs ${
      unlocked
        ? isMcq
          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-slate-800/80'
          : 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-slate-800/80'
        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50'
    }`}>
      {/* Header / Toggle Button */}
      <button
        onClick={handleToggle}
        className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5 transition select-none cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg shrink-0 ${
            unlocked 
              ? isMcq
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}>
            {unlocked ? (
              isMcq ? <CheckCircle2 className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm font-bold ${
                unlocked 
                  ? isMcq
                    ? 'text-emerald-950 dark:text-emerald-200'
                    : 'text-indigo-950 dark:text-indigo-200' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {isMcq
                  ? 'Official MCQ Answer Key & Analysis (2 Marks)'
                  : parsedMarksNum <= 3
                  ? `Model Solution & Scheme (${parsedMarksNum} Marks)`
                  : 'Official Model Answer & Marking Scheme (7 Marks)'}
              </span>
              {unlocked ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Key</span>
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Lock className="w-3 h-3" />
                  <span>Attempt to Unlock</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {unlocked ? modelAnswer.source : 'Attempt this question first to reveal verified solution'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unlocked ? (
            <span className={`text-xs font-semibold hidden sm:inline ${
              isMcq ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
            }`}>
              {isExpanded ? 'Hide Solution' : isMcq ? 'View Key & Explanation' : 'View Solution & Steps'}
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 hidden sm:inline">
              {isExpanded ? 'Close' : 'Unlock Solution'}
            </span>
          )}
          <div className="p-1 rounded-lg text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Locked Body Prompt (If user expands while locked) */}
      {!unlocked && isExpanded && (
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Answer Key Locked During Practice
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                To maximize your exam recall, attempt this question first by choosing an MCQ option or marking it as practiced.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleManualUnlock}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Reveal Solution Anyway</span>
            </button>
          </div>
        </div>
      )}

      {/* Expanded Solution Body (When Unlocked) */}
      {unlocked && isExpanded && (
        <div className="px-3.5 sm:px-6 pb-5 pt-2 border-t border-indigo-100 dark:border-indigo-950/80 space-y-3.5 animate-in fade-in duration-200">
          
          {/* MCQ Prominent Verified Answer Box */}
          {isMcq && modelAnswer.correctOptionText && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified Correct Option</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  2 Marks
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-mono pl-1">
                <MathText text={modelAnswer.correctOptionText} inline />
              </div>

              {/* Real-time comparison with user's selected choice */}
              {selectedOptionIndex !== null && selectedOptionIndex !== undefined && options && options[selectedOptionIndex] && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center gap-1.5 font-medium">
                  {(() => {
                    const userLetter = String.fromCharCode(97 + selectedOptionIndex); // 'a', 'b', 'c', 'd'
                    const correctLetter = (modelAnswer.correctOptionLetter || '').toLowerCase();
                    const isUserCorrect = correctLetter
                      ? userLetter === correctLetter
                      : (modelAnswer.correctOptionText || '').toLowerCase().includes(options[selectedOptionIndex].toLowerCase().slice(0, 15));
                    return isUserCorrect ? (
                      <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Your selection: <strong>({userLetter}) {options[selectedOptionIndex]}</strong> is correct! (+2 Marks)</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <span>Your selection was <strong>({userLetter})</strong>. Verified answer is <strong>{correctLetter ? `(${correctLetter})` : modelAnswer.correctOptionText}</strong>.</span>
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Marks Distribution Banner (for non-MCQ or when specifically detailed) */}
          {!isMcq && modelAnswer.marksDistribution && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Marking Weightage Breakdown:</span>
              </div>
              <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                {modelAnswer.marksDistribution}
              </p>
            </div>
          )}

          {/* Schematic Diagram if provided */}
          {modelAnswer.schematicSvg && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>Reconstructed Official Circuit Diagram</span>
              </div>
              <div
                className="overflow-x-auto flex justify-center py-2"
                dangerouslySetInnerHTML={{ __html: modelAnswer.schematicSvg }}
              />
            </div>
          )}

          {/* Key Formula Box */}
          {modelAnswer.keyFormula && (
            <div className="p-3.5 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Core Governing Formula / Condition
              </span>
              <div className="text-sm font-mono overflow-x-auto py-1">
                <MathText text={`$$${modelAnswer.keyFormula}$$`} />
              </div>
            </div>
          )}

          {/* Step-by-Step Points */}
          <div className="space-y-3">
            {modelAnswer.points.map((pt, idx) => (
              <div key={idx} className="space-y-1">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  <MathText text={pt.heading} inline />
                </h5>
                <div className={`text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-2.5 border-l-2 ${
                  isMcq ? 'border-emerald-300 dark:border-emerald-600' : 'border-indigo-300 dark:border-indigo-600'
                }`}>
                  <MathText text={pt.body} />
                </div>
              </div>
            ))}
          </div>

          {/* Examiner Tip */}
          {modelAnswer.examTip && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">BEU Examiner Tip: </span>
                <MathText text={modelAnswer.examTip} inline />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
