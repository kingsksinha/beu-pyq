import React, { useState } from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import type { Question, SubQuestion } from '../../types/paper';
import { MathText } from '../ui/MathText';
import { QuestionDiagram } from '../ui/QuestionDiagram';
import { StarFrequency } from '../ui/StarFrequency';
import { ModelAnswerCard } from './ModelAnswerCard';

interface QuestionItemProps {
  question: Question;
  paperId: string;
  paperInfo: {
    subject_code: string;
    subject_name: string;
    semester: number;
    year: string;
    exam_code: string;
  };
  highlightSubQuestionId?: string;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  paperId,
  paperInfo,
  highlightSubQuestionId
}) => {
  // Strip duplicate Q.X or Question X prefix if question.title already includes it
  const cleanTitle = (question.title || '').replace(/^(?:Q|Question)\.?\s*\d+[\s.:-]*/i, '').trim();

  return (
    <div className="question-block bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
      {/* Question Title & Marks */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono shrink-0">Q.{question.number}.</span>
            {cleanTitle ? (
              <MathText text={cleanTitle} inline />
            ) : (
              <MathText text={question.title} inline />
            )}
          </h3>
        </div>
        {question.marks && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 font-mono">
            {question.marks}
          </span>
        )}
      </div>

      {/* Sub-Questions List */}
      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/50">
        {question.subQuestions.map((sub, idx) => (
          <SubQuestionRow
            key={sub.id || idx}
            sub={sub}
            subIndex={idx}
            questionNumber={question.number}
            paperId={paperId}
            paperInfo={paperInfo}
            isHighlighted={highlightSubQuestionId === sub.id}
          />
        ))}
      </div>
    </div>
  );
};

interface SubQuestionRowProps {
  sub: SubQuestion;
  subIndex: number;
  questionNumber: number;
  paperId: string;
  paperInfo: {
    subject_code: string;
    subject_name: string;
    semester: number;
    year: string;
    exam_code: string;
  };
  isHighlighted?: boolean;
}

const SubQuestionRow: React.FC<SubQuestionRowProps> = ({
  sub,
  subIndex,
  questionNumber,
  paperId,
  paperInfo,
  isHighlighted = false
}) => {
  const [isBookmarked, setIsBookmarked] = useState(() => storageService.isQuestionBookmarked(sub.id));
  const [isRevisionMarked, setIsRevisionMarked] = useState(() => storageService.isMarkedForRevision(sub.id));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isDescriptiveAttempted, setIsDescriptiveAttempted] = useState(false);

  const subLabel = (sub.subNumber || String.fromCharCode(97 + subIndex)).trim();
  const escapedLabel = subLabel.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  // ONLY strip if explicitly formatted as a subquestion prefix like "(a) ", "a) ", or "a. "
  // NEVER strip bare letters from real words like "Critical" or "Calculate"
  const cleanSubText = (sub.text || '').replace(
    new RegExp(`^(?:\\(\\s*${escapedLabel}\\s*\\)|${escapedLabel}\\)|${escapedLabel}\\.)\\s+`, 'i'),
    ''
  ).trim();

  const hasOptions = !!(sub.options && sub.options.length > 0);
  const isAttempted = hasOptions ? selectedOption !== null : isDescriptiveAttempted;

  const handleBookmarkToggle = () => {
    const added = storageService.toggleQuestionBookmark({
      paperId,
      title: `${paperInfo.subject_name} Q.${questionNumber}(${sub.subNumber || subIndex + 1})`,
      subject_code: paperInfo.subject_code,
      subject_name: paperInfo.subject_name,
      semester: paperInfo.semester,
      year: paperInfo.year,
      exam_code: paperInfo.exam_code,
      questionId: sub.id,
      questionNumber,
      questionText: sub.text
    });
    setIsBookmarked(added);
  };

  const handleRevisionToggle = () => {
    const marked = storageService.toggleRevisionMark(sub.id);
    setIsRevisionMarked(marked);
  };

  return (
    <div
      id={sub.id}
      className={`subquestion-row pt-3 first:pt-0 transition-all rounded-xl ${
        isHighlighted
          ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 p-3'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: sub question number e.g. (a), (b) */}
        <div className="flex items-start gap-2.5 flex-1">
          <span className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 shrink-0 print:text-black">
            ({subLabel})
          </span>

          <div className="flex-1 space-y-2">
            <MathText text={cleanSubText || sub.text} className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 print:text-black" />

            {/* Images/Diagrams if any */}
            <QuestionDiagram images={sub.images} questionText={sub.text} />

            {/* MCQs Option List */}
            {sub.options && sub.options.length > 0 && (
              <div className="mt-3 space-y-1.5 pl-2 sm:pl-4 print:mt-1 print:space-y-0.5 print:pl-1">
                {sub.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(97 + optIdx);
                  const isSelected = selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setSelectedOption(optIdx)}
                      className={`mcq-option w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm border transition print:border-none print:p-0 print:gap-1.5 print:rounded-none print:bg-transparent ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-400 text-slate-900 dark:text-white font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`print:hidden w-5 h-5 rounded-md flex items-center justify-center font-mono text-xs shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {letter}
                      </span>
                      <span className="hidden print:inline-block font-mono font-bold text-xs text-black shrink-0">
                        ({letter})
                      </span>
                      <MathText text={opt} inline className="flex-1 print:text-black" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Official Model Answer & Marking Scheme */}
            <div className="print:hidden pt-1">
              <ModelAnswerCard
                questionText={sub.text}
                isAttempted={isAttempted}
                onReveal={() => setIsDescriptiveAttempted(true)}
              />
            </div>
          </div>
        </div>

        {/* Right: Star frequency & Quick Action icons (Hidden in Print) */}
        <div className="flex items-center gap-1.5 shrink-0 print:hidden">
          {sub.freq > 1 && (
            <StarFrequency freq={sub.freq} stars={sub.stars} size="sm" />
          )}

          <button
            onClick={handleRevisionToggle}
            className={`p-1.5 rounded-lg border transition ${
              isRevisionMarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isRevisionMarked ? 'Marked for revision' : 'Mark for revision'}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isRevisionMarked ? 'fill-amber-500/20' : ''}`} />
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove question bookmark' : 'Bookmark question'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
