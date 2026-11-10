import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, FileQuestion } from 'lucide-react';
import { FilterBar } from '../components/filters/FilterBar';
import { PaperCard } from '../components/paper/PaperCard';
import { dataService } from '../services/dataService';
import { curriculumService } from '../services/curriculumService';
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
      branch: searchParams.get('branch') || 'ALL',
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

    // If subject is selected, ensure subject actually has papers for the chosen semester & branch; otherwise reset to ALL
    if (updated.subject !== 'ALL' && catalog.length > 0) {
      let pool = catalog;
      if (updated.semester !== 'ALL') {
        const semNum = parseInt(updated.semester, 10);
        pool = pool.filter(p => p.semester === semNum);
      }
      if (updated.branch && updated.branch !== 'ALL') {
        pool = pool.filter(p => (p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code)) === updated.branch);
      }
      const isSubjValid = pool.some(p => p.subject_code === updated.subject);
      if (!isSubjValid) {
        updated.subject = 'ALL';
      }
    }

    const params = new URLSearchParams();
    if (updated.semester !== 'ALL') params.set('semester', updated.semester);
    if (updated.branch && updated.branch !== 'ALL') params.set('branch', updated.branch);
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

  // Keep URL parameters consistent if invalid semester/branch/subject combination is provided
  useEffect(() => {
    if (catalog.length > 0 && filters.subject !== 'ALL') {
      let pool = catalog;
      if (filters.semester !== 'ALL') {
        const semNum = parseInt(filters.semester, 10);
        pool = pool.filter(p => p.semester === semNum);
      }
      if (filters.branch && filters.branch !== 'ALL') {
        pool = pool.filter(p => (p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code)) === filters.branch);
      }
      const isSubjValid = pool.some(p => p.subject_code === filters.subject);
      if (!isSubjValid) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('subject');
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [catalog, filters.semester, filters.branch, filters.subject, searchParams, setSearchParams]);

  // Compute available examination years from catalog matching active semester, branch & subject
  const availableYears = useMemo(() => {
    let pool = catalog;
    if (filters.semester !== 'ALL') {
      const semNum = parseInt(filters.semester, 10);
      pool = pool.filter(p => p.semester === semNum);
    }
    if (filters.branch && filters.branch !== 'ALL') {
      pool = pool.filter(p => (p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code)) === filters.branch);
    }
    if (filters.subject !== 'ALL') {
      pool = pool.filter(p => p.subject_code === filters.subject);
    }
    const yearsSet = new Set(pool.map(p => p.year));
    return Array.from(yearsSet).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  }, [catalog, filters.semester, filters.branch, filters.subject]);

  // Apply filtering and sorting to underlying dataset
  const filteredPapers = useMemo(() => {
    return dataService.filterAndSort(catalog, filters);
  }, [catalog, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Complete Repository Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          All Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Filter and sort across all 363 B.Tech examination papers from Bihar Engineering University
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <FilterBar
        filters={filters}
        subjects={subjects}
        catalog={catalog}
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
        <div className="py-16 text-center bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4 shadow-xs">
          <FileQuestion className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Question Papers Matched Your Filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Try relaxing your filter criteria or search for a broader subject title or examination code.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-500/20"
          >
            Clear All Active Filters
          </button>
        </div>
      )}
    </div>
  );
};
