import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { curriculumService, MAJOR_BRANCHES, type MajorBranchKey } from '../services/curriculumService';
import type { SubjectItem } from '../types/paper';

export const SemesterDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<'A' | 'B'>('B');

  const selectedSem = parseInt(searchParams.get('sem') || '1', 10);
  const selectedBranch = (searchParams.get('branch') as MajorBranchKey) || 'ALL';

  useEffect(() => {
    dataService.getSubjects().then(subjs => {
      setSubjects(subjs);
      setLoading(false);
    });
  }, []);

  const handleSemChange = (sem: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sem', sem.toString());
    setSearchParams(nextParams);
  };

  const handleBranchChange = (branch: MajorBranchKey) => {
    const nextParams = new URLSearchParams(searchParams);
    if (branch === 'ALL') {
      nextParams.delete('branch');
    } else {
      nextParams.set('branch', branch);
    }
    setSearchParams(nextParams);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const yearLabels: Record<number, string> = {
    1: '1st Year',
    2: '2nd Year',
    3: '3rd Year',
    4: '4th Year'
  };

  const yearDescriptions: Record<number, string> = {
    1: '1st Year Foundation Engineering Curriculum: Physics & Chemistry Cycles with Mathematics-1 & 2, Basic Electrical, Workshop, and English.',
    2: '2nd Year Core Foundational Curriculum: Department-specific core subjects for CSE, Civil, Mechanical, Electrical, and ECE.',
    3: '3rd Year Advanced Engineering Curriculum: Specialized departmental modules, engineering design, lab theory, and professional electives.',
    4: '4th Year Final Year Curriculum: Advanced engineering applications, project preparation, industrial electives, and open university electives.'
  };

  // Filter subjects by year
  const semSubjects = subjects.filter(s => s.semesters.includes(selectedSem));

  // Further filter by branch if selected
  const displaySubjects = semSubjects.filter(s => {
    if (selectedBranch === 'ALL') return true;
    const branch = s.branch || curriculumService.detectBranch(undefined, s.code);
    return s.branches ? s.branches.includes(selectedBranch) : branch === selectedBranch;
  });

  const year1Data = curriculumService.getYear1Curriculum();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>BEU Official Academic Curriculum</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          B.Tech Year-wise Question Papers & Curriculum
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official Bihar Engineering University course catalogs, Group A/B foundation cycles, and branch-wise department archives.
        </p>
      </div>

      {/* Year Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {[1, 2, 3, 4].map(sem => {
          const isSelected = sem === selectedSem;
          return (
            <button
              key={sem}
              onClick={() => handleSemChange(sem)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {yearLabels[sem]}
            </button>
          );
        })}
      </div>

      {/* 1st Year Special Foundation Interactive Cycle Guide */}
      {selectedSem === 1 && year1Data && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-md space-y-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                1st Year Foundation: Group A & Group B Cycle Structure
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              BEU Foundation Model
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            BEU 1st Year engineering follows a <strong>Semester Cycle Swap</strong>: Group A branches take the Physics Cycle in 1st Semester and Chemistry Cycle in 2nd Semester. Group B branches take Chemistry Cycle in 1st Semester and Physics Cycle in 2nd Semester.
          </p>

          {/* Group Switcher Tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveGroup('B')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeGroup === 'B'
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              Group B (CSE, IT, ECE, EE, EEE, VLSI)
            </button>
            <button
              onClick={() => setActiveGroup('A')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeGroup === 'A'
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              Group A (Civil, Mech, Mining, Aero, Chem)
            </button>
          </div>

          {/* Cycle Roadmap Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1st Semester of Chosen Group */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {activeGroup === 'B' ? '1st Sem: Chemistry Cycle' : '1st Sem: Physics Cycle'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Semester 1
                </span>
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                {(activeGroup === 'B'
                  ? year1Data.chemistry_cycle_subjects
                  : year1Data.physics_cycle_subjects.slice(0, 3)
                ).map((s: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 ml-2">
                        (Code: {s.code_sem1 || s.code_sem2 || s.code})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2nd Semester of Chosen Group */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {activeGroup === 'B' ? '2nd Sem: Physics Cycle' : '2nd Sem: Chemistry Cycle'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Semester 2
                </span>
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                {(activeGroup === 'B'
                  ? year1Data.physics_cycle_subjects.slice(0, 3)
                  : year1Data.chemistry_cycle_subjects
                ).map((s: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 ml-2">
                        (Code: {s.code_sem2 || s.code_sem1 || s.code})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Year Summary Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {yearLabels[selectedSem]} Engineering Subjects
            </h2>
            {selectedBranch !== 'ALL' && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {selectedBranch}
              </span>
            )}
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 font-mono">
            {displaySubjects.length} Subjects
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {yearDescriptions[selectedSem]}
        </p>

        {/* Branch Switcher Tabs for Years 2, 3, 4 */}
        {selectedSem > 1 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Engineering Department:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleBranchChange('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedBranch === 'ALL'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Departments ({semSubjects.length})
              </button>
              {MAJOR_BRANCHES.filter(b => b.key !== 'COMMON').map(b => {
                const isSelected = selectedBranch === b.key;
                const branchCount = semSubjects.filter(s => {
                  const branch = s.branch || curriculumService.detectBranch(undefined, s.code);
                  return s.branches ? s.branches.includes(b.key) : branch === b.key;
                }).length;
                return (
                  <button
                    key={b.key}
                    onClick={() => handleBranchChange(b.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{b.shortName}</span>
                    <span className="text-[10px] opacity-75 font-mono">({branchCount})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            to={`/papers?semester=${selectedSem}${selectedBranch !== 'ALL' ? `&branch=${selectedBranch}` : ''}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>
              Explore all question papers for {yearLabels[selectedSem]}
              {selectedBranch !== 'ALL' ? ` (${selectedBranch})` : ''}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-xs text-slate-400">
            Click any subject below to view specific examination sessions
          </span>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {displaySubjects.map(subj => {
          const branchKey = subj.branch || curriculumService.detectBranch(undefined, subj.code);
          const branchMeta = curriculumService.getMajorBranchMeta(branchKey);

          return (
            <Link
              key={subj.code}
              to={`/papers?semester=${selectedSem}&subject=${subj.code}`}
              className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
                      {subj.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${branchMeta.badgeBg} ${branchMeta.badgeText} ${branchMeta.badgeBorder}`}
                    >
                      {branchMeta.shortName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                    {subj.paperCount} Papers
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                  {subj.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {subj.totalSubquestions} extracted questions · Sessions: {subj.years.slice(0, 4).join(', ')}
                  {subj.years.length > 4 ? '...' : ''}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <span>View {subj.paperCount} Papers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-indigo-500" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
