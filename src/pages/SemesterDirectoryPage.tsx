import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { dataService } from '../services/dataService';
import type { SubjectItem } from '../types/paper';

export const SemesterDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedSem = parseInt(searchParams.get('sem') || '1', 10);

  useEffect(() => {
    dataService.getSubjects().then(subjs => {
      setSubjects(subjs);
      setLoading(false);
    });
  }, []);

  const handleSemChange = (sem: number) => {
    setSearchParams({ sem: sem.toString() });
  };

  const semSubjects = subjects.filter(s => s.semesters.includes(selectedSem));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const semesterDescriptions: Record<number, string> = {
    1: 'Foundation engineering courses including Engineering Physics, Mathematics-1, Basic Electrical, English, and Engineering Mechanics.',
    2: 'Second semester core syllabus covering Engineering Chemistry, Programming for Problem Solving (PPS), Mathematics-2, and Workshop Practices.',
    3: 'Branch specific foundational courses: Data Structures, Discrete Mathematics, Digital Electronics, Analog Circuits, and Mechanics of Materials.',
    4: 'Advanced core curriculum including Design and Analysis of Algorithms (DAA), Operating Systems, DBMS, Computer Organization, and Fluid Mechanics.'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Curriculum Organization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Semester-wise Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select your engineering semester to explore subject catalogs and past examination papers.
        </p>
      </div>

      {/* Semester Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {[1, 2, 3, 4].map(sem => {
          const isSelected = sem === selectedSem;
          return (
            <button
              key={sem}
              onClick={() => handleSemChange(sem)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              Semester {sem}
            </button>
          );
        })}
      </div>

      {/* Selected Semester Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Semester {selectedSem} Engineering Subjects
          </h2>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 font-mono">
            {semSubjects.length} Subjects Available
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {semesterDescriptions[selectedSem]}
        </p>
        <div className="mt-4">
          <Link
            to={`/papers?semester=${selectedSem}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View all question papers for Semester {selectedSem}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {semSubjects.map(subj => (
          <Link
            key={subj.code}
            to={`/papers?semester=${selectedSem}&subject=${subj.code}`}
            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
                  Code: {subj.code}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                  {subj.paperCount} Papers
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                {subj.name}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {subj.totalSubquestions} extracted questions · Years: {subj.years.slice(0, 4).join(', ')}{subj.years.length > 4 ? '...' : ''}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              <span>View {subj.paperCount} Papers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-indigo-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
