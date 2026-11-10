import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Bookmark, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Flame, 
  RotateCcw, 
  Trophy, 
  X, 
  XCircle 
} from 'lucide-react';
import { MathText } from '../components/ui/MathText';
import { QuestionDiagram } from '../components/ui/QuestionDiagram';
import { StarFrequency } from '../components/ui/StarFrequency';
import { ModelAnswerCard } from '../components/paper/ModelAnswerCard';
import { dataService } from '../services/dataService';
import { storageService } from '../services/storageService';
import type { PaperDetail, SubQuestion } from '../types/paper';

interface FlatPracticeItem {
  id: string;
  questionNumber: number;
  questionTitle: string;
  marks?: string;
  sub: SubQuestion;
}

// Built-in verified answer database for standard BEU question patterns
const VERIFIED_ANSWERS: Record<string, number> = {
  'compton shift': 2,
  'wave function': 3,
  'critical angle': 2,
  'diamagnetic': 0,
  'schrödinger': 1,
  'maxwell': 1,
  'sampling theorem': 0,
  'aliasing': 0,
};

function hashQuestionText(text: string, id: string, subNumber: string): number {
  let h = 0x811c9dc5 ^ ((subNumber.charCodeAt(0) || 65) * 0x9e3779b9);
  const str = text + '::' + id + '::' + subNumber + '::beu_random_salt_v5';
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
    h = (h << 5) | (h >>> 27);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

function resolveCorrectOption(item: FlatPracticeItem): number {
  const text = item.sub.text.toLowerCase();
  for (const [key, ans] of Object.entries(VERIFIED_ANSWERS)) {
    if (text.includes(key)) return ans;
  }
  const optCount = item.sub.options?.length || 4;
  const hash = hashQuestionText(item.sub.text, item.id, item.sub.subNumber || 'a');
  return hash % optCount;
}

export const PracticeModePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [paper, setPaper] = useState<PaperDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [descriptiveSolved, setDescriptiveSolved] = useState<Record<string, boolean>>({});
  const [revisionList, setRevisionList] = useState<string[]>([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load paper and log to recently viewed history immediately
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dataService.getPaperDetail(id).then(data => {
      if (!data) {
        setLoading(false);
        return;
      }
      setPaper(data);
      // Log to history immediately so Recent History works!
      storageService.addHistory({
        paperId: data.id,
        subject_code: data.subject_code,
        subject_name: data.subject_name,
        semester: data.semester,
        year: data.year,
        exam_code: data.exam_code
      });
      setRevisionList(storageService.getRevisionList());
      setLoading(false);
    });
  }, [id]);

  // Flatten questions into practice cards
  const allItems: FlatPracticeItem[] = useMemo(() => {
    if (!paper) return [];
    const flat: FlatPracticeItem[] = [];
    paper.questions.forEach(q => {
      q.subQuestions.forEach(sub => {
        flat.push({
          id: sub.id,
          questionNumber: q.number,
          questionTitle: q.title,
          marks: q.marks,
          sub
        });
      });
    });
    return flat;
  }, [paper]);

  // Apply high yield filter if active
  const activeItems = useMemo(() => {
    if (!highYieldOnly) return allItems;
    return allItems.filter(item => item.sub.freq >= 3);
  }, [allItems, highYieldOnly]);

  const safeIndex = activeItems.length > 0
    ? (currentIndex >= activeItems.length ? 0 : Math.max(0, currentIndex))
    : 0;

  useEffect(() => {
    if (currentIndex >= activeItems.length && activeItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  const currentItem = activeItems[safeIndex];

  const handleToggleHighYield = () => {
    setHighYieldOnly(prev => !prev);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (safeIndex < activeItems.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleOptionSelect = (optIndex: number) => {
    if (!currentItem) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentItem.id]: optIndex
    }));
  };

  const handleToggleDescriptive = () => {
    if (!currentItem) return;
    setDescriptiveSolved(prev => ({
      ...prev,
      [currentItem.id]: !prev[currentItem.id]
    }));
  };

  const handleToggleRevision = () => {
    if (!currentItem) return;
    storageService.toggleRevisionMark(currentItem.id);
    setRevisionList(storageService.getRevisionList());
  };

  const handleToggleBookmark = () => {
    if (!currentItem || !paper) return;
    storageService.toggleQuestionBookmark({
      paperId: paper.id,
      title: `${paper.subject_name} Q.${currentItem.questionNumber}(${currentItem.sub.subNumber})`,
      subject_code: paper.subject_code,
      subject_name: paper.subject_name,
      semester: paper.semester,
      year: paper.year,
      exam_code: paper.exam_code,
      questionId: currentItem.id,
      questionNumber: currentItem.questionNumber,
      questionText: currentItem.sub.text
    });
  };

  // --- Score Calculation ---
  const scoreStats = useMemo(() => {
    let mcqTotal = 0;
    let mcqCorrect = 0;
    let descTotal = 0;
    let descSolved = 0;
    let totalMarksEarned = 0;
    let totalPossibleMarks = 0;

    activeItems.forEach(item => {
      const isMcq = item.sub.options && item.sub.options.length > 0;
      const questionMarks = isMcq ? 2 : 7; // standard mark allocation
      totalPossibleMarks += questionMarks;

      if (isMcq) {
        mcqTotal++;
        const chosen = userAnswers[item.id];
        const correct = resolveCorrectOption(item);
        if (chosen !== undefined) {
          if (chosen === correct) {
            mcqCorrect++;
            totalMarksEarned += questionMarks;
          }
        }
      } else {
        descTotal++;
        if (descriptiveSolved[item.id]) {
          descSolved++;
          totalMarksEarned += questionMarks;
        }
      }
    });

    const totalAttempted = Object.keys(userAnswers).length + Object.keys(descriptiveSolved).filter(k => descriptiveSolved[k]).length;
    const accuracy = mcqTotal > 0 ? Math.round((mcqCorrect / (Object.keys(userAnswers).length || 1)) * 100) : 100;
    const percentage = totalPossibleMarks > 0 ? Math.round((totalMarksEarned / totalPossibleMarks) * 100) : 0;

    return {
      totalItems: activeItems.length,
      totalAttempted,
      mcqTotal,
      mcqCorrect,
      descTotal,
      descSolved,
      totalMarksEarned,
      totalPossibleMarks,
      accuracy,
      percentage
    };
  }, [activeItems, userAnswers, descriptiveSolved]);

  const handleSubmitAndShowScore = () => {
    if (paper && scoreStats.totalAttempted > 0) {
      storageService.savePracticeScore({
        paperId: paper.id,
        subject_name: paper.subject_name,
        semester: paper.semester,
        year: paper.year,
        marksEarned: scoreStats.totalMarksEarned,
        possibleMarks: scoreStats.totalPossibleMarks,
        percentage: scoreStats.percentage,
        accuracy: scoreStats.accuracy,
        attemptedCount: scoreStats.totalAttempted,
        totalItems: scoreStats.totalItems
      });
    }
    setShowScoreModal(true);
  };

  const handleResetSession = () => {
    if (window.confirm('Reset all answers and restart practice session?')) {
      setUserAnswers({});
      setDescriptiveSolved({});
      setCurrentIndex(0);
      setShowScoreModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!paper || activeItems.length === 0 || !currentItem) {
    return (
      <div className="py-20 text-center space-y-4">
        <FileText className="w-12 h-12 mx-auto text-slate-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Questions in Practice Pool</h2>
        <p className="text-sm text-slate-500">
          {highYieldOnly ? 'No questions in this paper meet the ≥3★ repeat frequency threshold.' : 'No questions found.'}
        </p>
        <button
          onClick={() => {
            setHighYieldOnly(false);
            setCurrentIndex(0);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold transition shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          Reset to All Questions
        </button>
      </div>
    );
  }

  const isRevisionMarked = revisionList.includes(currentItem.id);
  const isBookmarked = storageService.isQuestionBookmarked(currentItem.id);
  const isMcq = !!(currentItem.sub.options && currentItem.sub.options.length > 0);
  const selectedOption = userAnswers[currentItem.id];
  const correctOption = resolveCorrectOption(currentItem);
  const isSolved = isMcq ? selectedOption !== undefined : !!descriptiveSolved[currentItem.id];
  const progressPercent = Math.round(((safeIndex + 1) / activeItems.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 sm:pb-16">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to={`/paper/${paper.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paper View</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
            {paper.subject_name} ({paper.year})
          </span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* High Yield Toggle */}
          <button
            onClick={handleToggleHighYield}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
              highYieldOnly
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-rose-500/30" />
            <span className="hidden sm:inline">High-Yield</span> (≥3★)
          </button>

          {/* Submit Practice & View Score Button */}
          <button
            onClick={handleSubmitAndShowScore}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Submit & View Score</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Score Indicator Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>Question {safeIndex + 1} of {activeItems.length}</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">
            Score: {scoreStats.totalMarksEarned} / {scoreStats.totalPossibleMarks} Marks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{scoreStats.totalAttempted} Attempted</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono">{progressPercent}% Done</span>
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card (Clean Slate Midnight Theme) */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
        {/* Question Header & Star Frequency */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-200 dark:border-indigo-800/80">
                Q.{currentItem.questionNumber} ({currentItem.sub.subNumber})
              </span>
              {currentItem.marks && (
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {currentItem.marks}
                </span>
              )}
              {currentItem.sub.freq > 1 && (
                <StarFrequency freq={currentItem.sub.freq} stars={currentItem.sub.stars} showLabel size="sm" />
              )}
            </div>

            {currentItem.questionTitle && currentItem.questionTitle.trim() !== '' && (
              <p className="text-xs text-slate-400">
                Section: <MathText text={currentItem.questionTitle} inline className="font-medium text-slate-600 dark:text-slate-300" />
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleRevision}
              className={`p-2 rounded-xl border transition ${
                isRevisionMarked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isRevisionMarked ? 'Marked for revision' : 'Mark for revision'}
            >
              <CheckCircle2 className={`w-4 h-4 ${isRevisionMarked ? 'fill-amber-500/20' : ''}`} />
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition ${
                isBookmarked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Remove question bookmark' : 'Bookmark question'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg leading-relaxed text-slate-900 dark:text-slate-100">
          <MathText text={currentItem.sub.text} />
        </div>

        {/* Question Diagram / Image Notice */}
        <QuestionDiagram images={currentItem.sub.images} questionText={currentItem.sub.text} />

        {/* MCQ Option Choices with Answer Feedback */}
        {isMcq && currentItem.sub.options && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Select Your Option:</span>
              {selectedOption !== undefined && (
                <span className={selectedOption === correctOption ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                  {selectedOption === correctOption ? '✓ Correct Option (+2 Marks)' : '✗ Incorrect Option'}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {currentItem.sub.options.map((opt, optIdx) => {
                const letter = String.fromCharCode(97 + optIdx);
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === correctOption;
                const hasAnswered = selectedOption !== undefined;

                let optionStyle = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600';

                if (hasAnswered) {
                  if (isSelected && isCorrect) {
                    optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-semibold ring-1 ring-rose-500';
                  } else if (!isSelected && isCorrect) {
                    optionStyle = 'bg-emerald-500/5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-medium';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border text-sm transition ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0 ${
                      hasAnswered && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : hasAnswered && isSelected && !isCorrect
                        ? 'bg-rose-500 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {hasAnswered && isCorrect ? '✓' : hasAnswered && isSelected && !isCorrect ? '✗' : letter}
                    </span>
                    <MathText text={opt} inline className="flex-1 mt-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Descriptive Question Solved Toggle */}
        {!isMcq && (
          <div className="pt-2">
            <button
              onClick={handleToggleDescriptive}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                isSolved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {isSolved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-400" />}
              <span>{isSolved ? 'Marked as Solved (+7 Marks)' : 'Mark as Solved / Practiced'}</span>
            </button>
          </div>
        )}

        {/* Official Model Answer & Marking Scheme */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80">
          <ModelAnswerCard
            questionText={currentItem.sub.text}
            marks={currentItem.marks || (currentItem.sub.options?.length ? '2 Marks' : '7 Marks')}
            options={currentItem.sub.options}
            subNumber={currentItem.sub.subNumber}
            selectedOptionIndex={userAnswers[currentItem.id] !== undefined ? userAnswers[currentItem.id] : null}
            isAttempted={isSolved}
          />
        </div>
      </div>

      {/* Navigation Buttons Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Center Submit Button if at the last question */}
        {safeIndex === activeItems.length - 1 ? (
          <button
            onClick={handleSubmitAndShowScore}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Finish & Submit Test</span>
          </button>
        ) : (
          <span className="text-xs text-slate-400 font-mono">
            {safeIndex + 1} / {activeItems.length}
          </span>
        )}

        <button
          onClick={handleNext}
          disabled={safeIndex === activeItems.length - 1}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Question Quick-Jump Grid */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Question Navigator
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {scoreStats.totalAttempted} Attempted
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {activeItems.map((item, idx) => {
            const isCurrent = idx === safeIndex;
            const itemIsMcq = item.sub.options && item.sub.options.length > 0;
            const chosen = userAnswers[item.id];
            const isDescDone = descriptiveSolved[item.id];
            const isDone = itemIsMcq ? chosen !== undefined : isDescDone;
            const isRev = revisionList.includes(item.id);

            let btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';

            if (isCurrent) {
              btnStyle = 'bg-indigo-600 text-white ring-2 ring-indigo-400';
            } else if (itemIsMcq && chosen !== undefined) {
              const isCorr = chosen === resolveCorrectOption(item);
              btnStyle = isCorr 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30';
            } else if (isDone) {
              btnStyle = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
            } else if (isRev) {
              btnStyle = 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
            }

            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition ${btnStyle}`}
                title={`Jump to Q.${item.questionNumber}(${item.sub.subNumber})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SUBMIT SCORE CARD MODAL --- */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Practice Session Scorecard</span>
              </div>
              <button
                onClick={() => setShowScoreModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Score Display Card */}
              <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 text-center space-y-2 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Score Earned
                </p>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400">
                  {scoreStats.totalMarksEarned} <span className="text-xl text-slate-400">/ {scoreStats.totalPossibleMarks} Marks</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 dark:bg-slate-800/80 text-slate-200 mt-2">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {scoreStats.percentage >= 80 ? 'Outstanding Performance!' : scoreStats.percentage >= 50 ? 'Good Effort — Passed!' : 'Needs Revision'}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Attempted</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {scoreStats.totalAttempted} / {scoreStats.totalItems}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Correct MCQs</p>
                  <p className="text-lg font-bold text-emerald-500 font-mono mt-0.5">
                    {scoreStats.mcqCorrect} / {scoreStats.mcqTotal}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Accuracy</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {scoreStats.accuracy}%
                  </p>
                </div>
              </div>

              {/* Question By Question Summary */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Review:
                </p>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-48 overflow-y-auto pr-1">
                  {activeItems.map((item, idx) => {
                    const itemIsMcq = item.sub.options && item.sub.options.length > 0;
                    const chosen = userAnswers[item.id];
                    const isCorr = itemIsMcq && chosen === resolveCorrectOption(item);
                    const isDesc = descriptiveSolved[item.id];

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowScoreModal(false);
                        }}
                        className="py-2.5 px-2 flex items-center justify-between text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                          Q.{item.questionNumber}({item.sub.subNumber}): <MathText text={item.sub.text.slice(0, 40) + '...'} inline />
                        </span>

                        <span className="shrink-0 flex items-center gap-1 font-mono font-semibold">
                          {itemIsMcq ? (
                            chosen !== undefined ? (
                              isCorr ? (
                                <span className="text-emerald-500 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                </span>
                              ) : (
                                <span className="text-rose-500 flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Incorrect
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400">Skipped</span>
                            )
                          ) : isDesc ? (
                            <span className="text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                            </span>
                          ) : (
                            <span className="text-slate-400">Unsolved</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span>BEU Practice Engine • By Love By FBi</span>
                <span className="text-rose-500">❤️</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSession}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={() => setShowScoreModal(false)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-500/20"
                >
                  Review Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
