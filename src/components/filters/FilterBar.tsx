import React, { useMemo } from 'react';
import { Filter, RotateCcw, Sparkles } from 'lucide-react';
import type { FilterState, PaperCatalogItem, SortMode, SubjectItem } from '../../types/paper';
import { curriculumService, MAJOR_BRANCHES } from '../../services/curriculumService';
import { ActiveFilterChips } from './ActiveFilterChips';
import { SortDropdown } from './SortDropdown';

interface FilterBarProps {
  filters: FilterState;
  subjects: SubjectItem[];
  catalog: PaperCatalogItem[];
  availableYears: string[];
  totalMatches: number;
  totalPapers: number;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  subjects,
  catalog,
  availableYears,
  totalMatches,
  totalPapers,
  onFilterChange,
  onResetFilters
}) => {
  // Filter subjects by selected year AND branch based on actual catalog paper availability
  const availableSubjects = useMemo(() => {
    if (!catalog || catalog.length === 0) return subjects;

    let pool = catalog;
    if (filters.semester !== 'ALL') {
      const semNum = parseInt(filters.semester, 10);
      pool = pool.filter(p => p.semester === semNum);
    }
    if (filters.branch && filters.branch !== 'ALL') {
      pool = pool.filter(p => (p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code)) === filters.branch);
    }

    const matchingCodes = new Set(pool.map(p => p.subject_code));
    return subjects
      .filter(s => matchingCodes.has(s.code))
      .map(s => {
        const countInPool = pool.filter(p => p.subject_code === s.code).length;
        return {
          ...s,
          filteredPaperCount: countInPool
        };
      });
  }, [catalog, subjects, filters.semester, filters.branch]);

  const handleSemesterChange = (newSem: string) => {
    const changes: Partial<FilterState> = { semester: newSem };

    // If a subject was selected, verify it belongs to the newly chosen semester and branch
    if (newSem !== 'ALL' && filters.subject !== 'ALL' && catalog) {
      let pool = catalog;
      const semNum = parseInt(newSem, 10);
      pool = pool.filter(p => p.semester === semNum);
      if (filters.branch && filters.branch !== 'ALL') {
        pool = pool.filter(p => (p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code)) === filters.branch);
      }
      const isSubjValid = pool.some(p => p.subject_code === filters.subject);
      if (!isSubjValid) {
        changes.subject = 'ALL';
      }
    }

    onFilterChange(changes);
  };

  const handleBranchChange = (newBranch: string) => {
    const changes: Partial<FilterState> = { branch: newBranch };
    if (newBranch !== 'ALL' && filters.subject !== 'ALL' && catalog) {
      let pool = catalog;
      if (filters.semester !== 'ALL') {
        const semNum = parseInt(filters.semester, 10);
        pool = pool.filter(p => p.semester === semNum);
      }
      pool = pool.filter(p => (p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code)) === newBranch);
      const isSubjValid = pool.some(p => p.subject_code === filters.subject);
      if (!isSubjValid) {
        changes.subject = 'ALL';
      }
    }
    onFilterChange(changes);
  };

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Filter & Sort Papers</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            (Showing {totalMatches} of {totalPapers})
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <SortDropdown
            currentSort={filters.sort}
            onSortChange={(sort: SortMode) => onFilterChange({ sort })}
          />
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800 cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Select Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Academic Year Filter (1st to 4th Year) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            B.Tech Year
          </label>
          <select
            value={filters.semester}
            onChange={e => handleSemesterChange(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Years (1st–4th)</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {/* Engineering Branch Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Branch / Dept
          </label>
          <select
            value={filters.branch || 'ALL'}
            onChange={e => handleBranchChange(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Branches</option>
            {MAJOR_BRANCHES.map(b => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter - Dynamically filtered to only show subjects of the selected year and branch */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Subject ({availableSubjects.length})
          </label>
          <select
            value={filters.subject}
            onChange={e => onFilterChange({ subject: e.target.value })}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 truncate cursor-pointer"
          >
            <option value="ALL">
              {filters.semester === 'ALL' && (!filters.branch || filters.branch === 'ALL')
                ? `All Subjects (${subjects.length})`
                : `All Filtered (${availableSubjects.length})`}
            </option>
            {availableSubjects.map(s => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.filteredPaperCount ?? s.paperCount}p)
              </option>
            ))}
          </select>
        </div>

        {/* Examination Session / Year Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Exam Session
          </label>
          <select
            value={filters.year}
            onChange={e => onFilterChange({ year: e.target.value })}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Sessions (2012–2025)</option>
            {availableYears.map(yr => (
              <option key={yr} value={yr}>
                Session {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Code Input Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Exam Code
          </label>
          <input
            type="text"
            value={filters.examCode}
            onChange={e => onFilterChange({ examCode: e.target.value })}
            placeholder="E.g. 100201 or 105301..."
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Feature Toggles Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 select-none">
          <input
            type="checkbox"
            checked={!!filters.highFreqOnly}
            onChange={e => onFilterChange({ highFreqOnly: e.target.checked })}
            className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
          />
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Yield / Repeated Only (≥3★)</span>
          </span>
        </label>

        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 select-none">
          <input
            type="checkbox"
            checked={!!filters.hasMcqOnly}
            onChange={e => onFilterChange({ hasMcqOnly: e.target.checked })}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:text-indigo-400"
          />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            Contains MCQs
          </span>
        </label>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips
        filters={filters}
        subjects={subjects}
        onRemoveFilter={onFilterChange}
        onResetAll={onResetFilters}
      />
    </div>
  );
};
