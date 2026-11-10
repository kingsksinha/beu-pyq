import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Library, Search } from 'lucide-react';
import { dataService } from '../services/dataService';
import type { SubjectItem } from '../types/paper';
import { formatBTechYear } from '../utils/formatters';

export const SubjectDirectoryPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getSubjects().then(subjs => {
      setSubjects(subjs);
      setLoading(false);
    });
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
      const matchesSem = selectedSemester === 'ALL' || s.semesters.includes(parseInt(selectedSemester, 10));
      return matchesSearch && matchesSem;
    });
  }, [subjects, searchQuery, selectedSemester]);

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
          <Library className="w-4 h-4" />
          <span>Subject Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          All 92 Engineering Subjects
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse complete course catalogs across all branches of Bihar Engineering University.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 92 subjects by name or code (e.g. Physics, DSA, bee)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        <select
          value={selectedSemester}
          onChange={e => setSelectedSemester(e.target.value)}
          className="w-full sm:w-48 text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All B.Tech Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>

      {/* Matching Count */}
      <div className="text-xs text-slate-400 font-medium">
        Showing {filteredSubjects.length} of {subjects.length} subjects
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredSubjects.map(subj => (
          <Link
            key={subj.code}
            to={`/papers?subject=${subj.code}`}
            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {subj.code}
                  </span>
                  {subj.semesters.map(sem => (
                    <span
                      key={sem}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                    >
                      {formatBTechYear(sem)}
                    </span>
                  ))}
                </div>

                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                  {subj.paperCount} Papers
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                {subj.name}
              </h3>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{subj.totalSubquestions} Questions</span>
                {subj.maxFreq > 1 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
                    <Flame className="w-3 h-3 fill-amber-500/30" />
                    <span>Up to {subj.maxFreq}x Repeat</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              <span>View Question Papers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-indigo-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
