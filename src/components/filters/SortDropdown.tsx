import React from 'react';
import { ArrowDownUp } from 'lucide-react';
import type { SortMode } from '../../types/paper';

interface SortDropdownProps {
  currentSort: SortMode;
  onSortChange: (sort: SortMode) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowDownUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <select
        value={currentSort}
        onChange={e => onSortChange(e.target.value as SortMode)}
        className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer transition shadow-2xs"
      >
        <option value="newest">Newest Exam Year (2025 → 2012)</option>
        <option value="oldest">Oldest Exam Year (2012 → 2025)</option>
        <option value="subject-az">Subject Name (A → Z)</option>
        <option value="subject-za">Subject Name (Z → A)</option>
        <option value="semester-asc">Semester (1 → 4)</option>
        <option value="semester-desc">Semester (4 → 1)</option>
        <option value="questions-desc">Most Questions / Items</option>
        <option value="questions-asc">Least Questions / Items</option>
      </select>
    </div>
  );
};
