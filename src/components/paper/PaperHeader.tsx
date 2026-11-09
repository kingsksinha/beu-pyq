import React from 'react';
import { Clock, FileText, Hash } from 'lucide-react';
import type { PaperDetail } from '../../types/paper';

interface PaperHeaderProps {
  paper: PaperDetail;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({ paper }) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
      <div className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400">
        Bihar Engineering University, Patna
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
        {paper.subject_name}
      </h1>

      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
        B.Tech {paper.semester === 1 ? '1st' : paper.semester === 2 ? '2nd' : paper.semester === 3 ? '3rd' : `${paper.semester}th`} Semester Examination, {paper.year}
      </p>

      {/* Meta Specs Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Time: {paper.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Hash className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Paper Code: {paper.exam_code}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Full Marks: {paper.full_marks}</span>
        </div>
      </div>
    </div>
  );
};
