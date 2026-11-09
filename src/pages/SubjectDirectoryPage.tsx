import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Library, Search } from 'lucide-react';
import { dataService } from '../services/dataService';
import type { SubjectItem } from '../types/paper';

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
          <Library className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span>Subject Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          All 92 Engineering Subjects
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Browse complete course catalogs across all branches of Bihar Engineering University.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 92 subjects by name or code (e.g. Physics, DSA, bee)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-zinc-800 dark:text-zinc-200"
          />
        </div>

        <select
          value={selectedSemester}
          onChange={e => setSelectedSemester(e.target.value)}
          className="w-full sm:w-48 text-xs sm:text-sm font-medium bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-500"
        >
          <option value="ALL">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
        </select>
      </div>

      {/* Matching Count */}
      <div className="text-xs text-zinc-400 font-medium">
        Showing {filteredSubjects.length} of {subjects.length} subjects
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map(subj => (
          <Link
            key={subj.code}
            to={`/papers?subject=${subj.code}`}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {subj.code}
                  </span>
                  {subj.semesters.map(sem => (
                    <span
                      key={sem}
                      className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                    >
                      Sem {sem}
                    </span>
                  ))}
                </div>

                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {subj.paperCount} Papers
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition line-clamp-2">
                {subj.name}
              </h3>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>{subj.totalSubquestions} Extracted Questions</span>
                {subj.maxFreq > 1 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 font-mono">
                    <Flame className="w-3 h-3 fill-amber-500/30" />
                    <span>Up to {subj.maxFreq}x Repeat</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span>View Question Papers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
