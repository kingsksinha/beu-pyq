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
    <div className="question-block bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-7 shadow-xs space-y-4 max-w-full overflow-hidden">
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
            questionMarks={question.marks}
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
  questionMarks?: string;
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
  questionMarks,
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

  // Resolve accurate marks:
  // 1. Explicit sub.marks
  // 2. If sub has options, it's an MCQ (2 Marks in BEU)
  // 3. Question 1 in BEU is ALWAYS compulsory 2-mark questions / MCQs
  // 4. If parent question marks mentions 2x, [2, or 14
  // 5. Otherwise default to 7 Marks
  const isQuestionOne = questionNumber === 1;
  const isParentTwoMarks = !!(questionMarks && /(?:2\s*x|\[2|\b14\b)/i.test(questionMarks));
  const resolvedMarks = sub.marks || (
    hasOptions || isQuestionOne || isParentTwoMarks
      ? '2 Marks'
      : '7 Marks'
  );

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
      className={`subquestion-row pt-4 first:pt-0 transition-all rounded-xl ${
        isHighlighted
          ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 p-3'
          : ''
      }`}
    >
      {/* Top Question Row: Question Text + Action Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
        {/* Left: (a) + Question Text */}
        <div className="flex items-start gap-2 sm:gap-2.5 flex-1 min-w-0">
          <span className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 shrink-0 print:text-black">
            ({subLabel})
          </span>

          <div className="flex-1 min-w-0">
            <MathText
              text={cleanSubText || sub.text}
              className="text-sm sm:text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed print:text-black break-words"
            />
          </div>
        </div>

        {/* Right / Top Badges & Actions */}
        <div className="flex items-center justify-end sm:justify-start gap-1.5 shrink-0 self-end sm:self-start pl-6 sm:pl-0 print:hidden">
          {sub.freq > 1 && (
            <StarFrequency freq={sub.freq} stars={sub.stars} size="sm" />
          )}

          <button
            onClick={handleRevisionToggle}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
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
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
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

      {/* Diagrams / Images if any */}
      <div className="pl-5 sm:pl-6 pt-1">
        <QuestionDiagram images={sub.images} questionText={sub.text} />
      </div>

      {/* MCQs Option List */}
      {sub.options && sub.options.length > 0 && (
        <div className="mt-2.5 sm:mt-3 space-y-1.5 pl-5 sm:pl-6 print:mt-1 print:space-y-0.5 print:pl-1">
          {sub.options.map((opt, optIdx) => {
            const letter = String.fromCharCode(97 + optIdx);
            const isSelected = selectedOption === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => setSelectedOption(optIdx)}
                className={`mcq-option w-full text-left flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm border transition cursor-pointer print:border-none print:p-0 print:gap-1.5 print:rounded-none print:bg-transparent ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/80 dark:bg-slate-800/90 shadow-2xs font-medium text-indigo-950 dark:text-indigo-100'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className={`print:hidden w-5 h-5 rounded-md flex items-center justify-center font-mono text-xs shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-indigo-400'
                }`}>
                  {letter}
                </span>
                <span className="hidden print:inline-block font-mono font-bold text-xs text-black shrink-0">
                  ({letter})
                </span>
                <MathText text={opt} inline className="flex-1 min-w-0 break-words print:text-black" />
              </button>
            );
          })}
        </div>
      )}

      {/* FULL-WIDTH Official Model Answer & Marking Scheme */}
      <div className="print:hidden pt-2 pl-0 sm:pl-6 w-full min-w-0">
        <ModelAnswerCard
          questionText={cleanSubText || sub.text}
          marks={resolvedMarks}
          options={sub.options}
          subNumber={sub.subNumber}
          selectedOptionIndex={selectedOption}
          isAttempted={isAttempted}
          onReveal={() => setIsDescriptiveAttempted(true)}
        />
      </div>
    </div>
  );
};
