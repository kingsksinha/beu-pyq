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
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
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
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span>Curriculum Organization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          Semester-wise Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Select your engineering semester to explore subject catalogs and past examination papers.
        </p>
      </div>

      {/* Semester Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {[1, 2, 3, 4].map(sem => {
          const isSelected = sem === selectedSem;
          return (
            <button
              key={sem}
              onClick={() => handleSemChange(sem)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              Semester {sem}
            </button>
          );
        })}
      </div>

      {/* Selected Semester Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Semester {selectedSem} Engineering Subjects
          </h2>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            {semSubjects.length} Subjects Available
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {semesterDescriptions[selectedSem]}
        </p>
        <div className="mt-4">
          <Link
            to={`/papers?semester=${selectedSem}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            <span>View all question papers for Semester {selectedSem}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {semSubjects.map(subj => (
          <Link
            key={subj.code}
            to={`/papers?semester=${selectedSem}&subject=${subj.code}`}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded">
                  Code: {subj.code}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {subj.paperCount} Papers
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition line-clamp-2">
                {subj.name}
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                {subj.totalSubquestions} extracted questions · Years: {subj.years.slice(0, 4).join(', ')}{subj.years.length > 4 ? '...' : ''}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span>View {subj.paperCount} Papers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
