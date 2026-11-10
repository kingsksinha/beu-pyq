import React from 'react';
import { Clock, FileText, Hash, Info, Sparkles } from 'lucide-react';
import type { PaperDetail } from '../../types/paper';
import { curriculumService } from '../../services/curriculumService';
import { formatBTechYear } from '../../utils/formatters';

interface PaperHeaderProps {
  paper: PaperDetail;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({ paper }) => {
  const branchKey = curriculumService.detectBranch(paper.exam_code, paper.subject_code);
  const branchMeta = curriculumService.getMajorBranchMeta(branchKey);
  const revisedInfo = curriculumService.getRevisedSyllabusInfo(paper.exam_code);

  return (
    <div className="paper-header-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-8 text-center shadow-xs max-w-full overflow-hidden">
      {/* Top FBi Platform Credit */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-2xs mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Curated & Engineered with ❤️ by <strong>FBi</strong></span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400">
          Bihar Engineering University, Patna
        </span>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${branchMeta.badgeBg} ${branchMeta.badgeText} ${branchMeta.badgeBorder}`}
        >
          {branchMeta.shortName}
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
        {paper.subject_name}
      </h1>

      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
        B.Tech {formatBTechYear(paper.semester)} Examination, {paper.year}
      </p>

      {/* Revised Syllabus Notice */}
      {revisedInfo && (
        <div className="mt-4 max-w-xl mx-auto p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 text-left sm:text-center">
          <Info className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong className="font-bold">BEU 2024–2026 Revised Syllabus:</strong> This paper corresponds to Revised Course Code{' '}
            <strong className="font-mono underline">{revisedInfo.revisedCode}</strong> ({revisedInfo.name}).
          </span>
        </div>
      )}

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
