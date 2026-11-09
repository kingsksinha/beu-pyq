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
    chips.push({
      label: `Sem ${filters.semester}`,
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
      label: `Year: ${filters.year}`,
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
      <span className="text-[11px] font-semibold text-zinc-400">Active Filters:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
        >
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onResetAll}
        className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-0.5 rounded transition"
      >
        Clear all
      </button>
    </div>
  );
};
