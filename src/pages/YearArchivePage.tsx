import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { dataService } from '../services/dataService';
import type { PaperCatalogItem } from '../types/paper';
import { formatBTechYear } from '../utils/formatters';

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
          <Calendar className="w-4 h-4" />
          <span>Historical Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Examination Session Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse question papers across 14 historical examination sessions from 2012 to 2025.
        </p>
      </div>

      {/* Year Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {years.map(y => (
          <Link
            key={y.year}
            to={`/papers?year=${y.year}`}
            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition font-mono tracking-tight">
                  {y.year}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 font-mono">
                  {y.count} Papers
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{y.subjectsCount} Engineering Subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>B.Tech Years: {y.semesters.map(s => formatBTechYear(s)).join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              <span>Explore {y.year} Question Papers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-indigo-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
