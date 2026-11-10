import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  Clock, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  PlayCircle 
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import type { PaperCatalogItem } from '../../types/paper';
import { StarFrequency } from '../ui/StarFrequency';
import { formatBTechYear } from '../../utils/formatters';

interface PaperCardProps {
  paper: PaperCatalogItem;
  onBookmarkChange?: () => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(() => storageService.isPaperBookmarked(paper.id));

  const recordHistory = () => {
    storageService.addHistory({
      paperId: paper.id,
      subject_code: paper.subject_code,
      subject_name: paper.subject_name,
      semester: paper.semester,
      year: paper.year,
      exam_code: paper.exam_code
    });
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = storageService.togglePaperBookmark({
      paperId: paper.id,
      title: `${paper.subject_name} (${paper.year})`,
      subject_code: paper.subject_code,
      subject_name: paper.subject_name,
      semester: paper.semester,
      year: paper.year,
      exam_code: paper.exam_code
    });
    setIsBookmarked(added);
    if (onBookmarkChange) onBookmarkChange();
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
              {formatBTechYear(paper.semester)}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
              {paper.year}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
              Code: {paper.exam_code}
            </span>
          </div>

          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark paper'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Paper Title */}
        <Link to={`/paper/${paper.id}`} onClick={recordHistory} className="block">
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
            {paper.subject_name}
          </h3>
        </Link>

        {/* Meta details */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{paper.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Full Marks: {paper.full_marks}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{paper.question_count} Questions ({paper.total_subquestions} items)</span>
          </div>
          {paper.max_freq > 1 && (
            <div>
              <StarFrequency freq={paper.max_freq} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          to={`/paper/${paper.id}`}
          onClick={recordHistory}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <span>View Paper</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <Link
          to={`/practice/${paper.id}`}
          onClick={recordHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-2xs"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Practice</span>
        </Link>
      </div>
    </div>
  );
};
