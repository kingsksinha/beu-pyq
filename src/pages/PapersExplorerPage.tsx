import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, FileQuestion } from 'lucide-react';
import { FilterBar } from '../components/filters/FilterBar';
import { PaperCard } from '../components/paper/PaperCard';
import { dataService } from '../services/dataService';
import type { FilterState, PaperCatalogItem, SortMode, SubjectItem } from '../types/paper';

export const PapersExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [catalog, setCatalog] = useState<PaperCatalogItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL query parameters to preserve state across back-navigation
  const filters: FilterState = useMemo(() => {
    return {
      semester: searchParams.get('semester') || 'ALL',
      subject: searchParams.get('subject') || 'ALL',
      year: searchParams.get('year') || 'ALL',
      examCode: searchParams.get('code') || '',
      query: searchParams.get('q') || '',
      sort: (searchParams.get('sort') as SortMode) || 'newest',
      hasMcqOnly: searchParams.get('mcq') === 'true',
      highFreqOnly: searchParams.get('high_yield') === 'true'
    };
  }, [searchParams]);

  useEffect(() => {
    Promise.all([
      dataService.getCatalog(),
      dataService.getSubjects()
    ]).then(([papers, subjs]) => {
      setCatalog(papers);
      setSubjects(subjs);
      setLoading(false);
    });
  }, []);

  // Update URL params when filters change
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    const params = new URLSearchParams();

    if (updated.semester !== 'ALL') params.set('semester', updated.semester);
    if (updated.subject !== 'ALL') params.set('subject', updated.subject);
    if (updated.year !== 'ALL') params.set('year', updated.year);
    if (updated.examCode) params.set('code', updated.examCode);
    if (updated.query) params.set('q', updated.query);
    if (updated.sort !== 'newest') params.set('sort', updated.sort);
    if (updated.hasMcqOnly) params.set('mcq', 'true');
    if (updated.highFreqOnly) params.set('high_yield', 'true');

    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Compute available examination years from catalog
  const availableYears = useMemo(() => {
    const yearsSet = new Set(catalog.map(p => p.year));
    return Array.from(yearsSet).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  }, [catalog]);

  // Apply filtering and sorting to underlying dataset
  const filteredPapers = useMemo(() => {
    return dataService.filterAndSort(catalog, filters);
  }, [catalog, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span>Complete Repository Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          All Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Filter and sort across all 363 semester exam papers from Bihar Engineering University
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <FilterBar
        filters={filters}
        subjects={subjects}
        availableYears={availableYears}
        totalMatches={filteredPapers.length}
        totalPapers={catalog.length}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 space-y-4 shadow-xs">
          <FileQuestion className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600" />
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              No Question Papers Matched Your Filters
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1">
              Try relaxing your filter criteria or search for a broader subject title or examination code.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition shadow-xs"
          >
            Clear All Active Filters
          </button>
        </div>
      )}
    </div>
  );
};
