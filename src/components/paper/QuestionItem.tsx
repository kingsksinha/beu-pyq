import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { storageService } from '../../services/storageService';
import type { Question, SubQuestion } from '../../types/paper';
import { MathText } from '../ui/MathText';
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
    <div className="question-block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
      {/* Question Title & Marks */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-start gap-2">
            <span className="text-zinc-500 font-mono shrink-0">Q.{question.number}.</span>
            {cleanTitle ? (
              <MathText text={cleanTitle} inline />
            ) : (
              <MathText text={question.title} inline />
            )}
          </h3>
        </div>
        {question.marks && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shrink-0 font-mono">
            {question.marks}
          </span>
        )}
      </div>

      {/* Sub-Questions List */}
      <div className="space-y-4 divide-y divide-zinc-100 dark:divide-zinc-800/50">
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
  // Strip duplicate leading (a), a), etc. if sub.text begins with the sub question letter
  const escapedLabel = subLabel.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const cleanSubText = (sub.text || '').replace(
    new RegExp(`^\\(?\\s*${escapedLabel}\\s*\\)?[.:-]*\\s*`, 'i'),
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
          ? 'ring-2 ring-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 p-3'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: sub question number e.g. (a), (b) */}
        <div className="flex items-start gap-2.5 flex-1">
          <span className="font-bold text-xs sm:text-sm text-zinc-400 font-mono mt-0.5 shrink-0">
            ({subLabel})
          </span>

          <div className="flex-1 space-y-2">
            <MathText text={cleanSubText || sub.text} className="text-sm sm:text-[15px]" />

            {/* Images/Diagrams if any */}
            {sub.images && sub.images.length > 0 && (
              <div className="my-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 shrink-0 text-zinc-400" />
                <span>Question Diagram referenced in official university examination sheet.</span>
              </div>
            )}

            {/* MCQs Option List */}
            {sub.options && sub.options.length > 0 && (
              <div className="mt-3 space-y-1.5 pl-2 sm:pl-4">
                {sub.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(97 + optIdx);
                  const isSelected = selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setSelectedOption(optIdx)}
                      className={`mcq-option w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm border transition ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-500 dark:border-zinc-400 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-xs shrink-0 ${
                        isSelected
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}>
                        {letter}
                      </span>
                      <MathText text={opt} inline className="flex-1" />
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
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
