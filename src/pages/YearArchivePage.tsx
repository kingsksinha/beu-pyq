import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { dataService } from '../services/dataService';
import type { PaperCatalogItem } from '../types/paper';

interface YearSummary {
  year: string;
  count: number;
  semesters: number[];
  subjectsCount: number;
}

export const YearArchivePage: React.FC = () => {
  const [years, setYears] = useState<YearSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getCatalog().then((papers: PaperCatalogItem[]) => {
      const yearMap: Record<string, { count: number; sems: Set<number>; subjs: Set<string> }> = {};
      
      papers.forEach(p => {
        if (!yearMap[p.year]) {
          yearMap[p.year] = { count: 0, sems: new Set(), subjs: new Set() };
        }
        yearMap[p.year].count++;
        yearMap[p.year].sems.add(p.semester);
        yearMap[p.year].subjs.add(p.subject_code);
      });

      const list: YearSummary[] = Object.keys(yearMap)
        .sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
        .map(yr => ({
          year: yr,
          count: yearMap[yr].count,
          semesters: Array.from(yearMap[yr].sems).sort((a, b) => a - b),
          subjectsCount: yearMap[yr].subjs.size
        }));

      setYears(list);
      setLoading(false);
    });
  }, []);

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
          <Calendar className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span>Historical Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          Year-wise Question Paper Archive
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Browse examination sessions spanning 14 academic years from 2012 to 2025.
        </p>
      </div>

      {/* Year Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.map(y => (
          <Link
            key={y.year}
            to={`/papers?year=${y.year}`}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition font-mono">
                  {y.year}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {y.count} Papers
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{y.subjectsCount} Different Engineering Subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Semesters Covered: {y.semesters.map(s => `Sem ${s}`).join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span>Explore {y.year} Question Papers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
