import React from 'react';
import { X } from 'lucide-react';
import type { FilterState, SubjectItem } from '../../types/paper';

interface ActiveFilterChipsProps {
  filters: FilterState;
  subjects: SubjectItem[];
  onRemoveFilter: (changed: Partial<FilterState>) => void;
  onResetAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  subjects,
  onRemoveFilter,
  onResetAll
}) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.semester !== 'ALL') {
    const yearLabels: Record<string, string> = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };
    chips.push({
      label: yearLabels[filters.semester] || `Year ${filters.semester}`,
      onRemove: () => onRemoveFilter({ semester: 'ALL' })
    });
  }

  if (filters.subject !== 'ALL') {
    const subj = subjects.find(s => s.code === filters.subject);
    chips.push({
      label: `Subject: ${subj ? subj.name : filters.subject}`,
      onRemove: () => onRemoveFilter({ subject: 'ALL' })
    });
  }

  if (filters.year !== 'ALL') {
    chips.push({
      label: `Session: ${filters.year}`,
      onRemove: () => onRemoveFilter({ year: 'ALL' })
    });
  }

  if (filters.examCode) {
    chips.push({
      label: `Code: "${filters.examCode}"`,
      onRemove: () => onRemoveFilter({ examCode: '' })
    });
  }

  if (filters.query) {
    chips.push({
      label: `Keyword: "${filters.query}"`,
      onRemove: () => onRemoveFilter({ query: '' })
    });
  }

  if (filters.highFreqOnly) {
    chips.push({
      label: `High-Yield Repeated Only`,
      onRemove: () => onRemoveFilter({ highFreqOnly: false })
    });
  }

  if (filters.hasMcqOnly) {
    chips.push({
      label: `Contains MCQs`,
      onRemove: () => onRemoveFilter({ hasMcqOnly: false })
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-[11px] font-bold text-slate-400">Active Filters:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
        >
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onResetAll}
        className="text-xs text-rose-500 hover:text-rose-600 font-bold px-2 py-0.5 rounded transition"
      >
        Clear all
      </button>
    </div>
  );
};
