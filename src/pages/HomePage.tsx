import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle2,
  Clock, 
  Compass, 
  FileCheck,
  FileText, 
  Flame, 
  Heart,
  Library, 
  Printer,
  Sparkles, 
  Trophy,
  Zap 
} from 'lucide-react';
import { PaperCard } from '../components/paper/PaperCard';
import { dataService } from '../services/dataService';
import { storageService } from '../services/storageService';
import type { HistoryItem, PaperCatalogItem, PlatformStats } from '../types/paper';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentUploads, setRecentUploads] = useState<PaperCatalogItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>(() => storageService.getHistory().slice(0, 4));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataService.getStats(),
      dataService.getCatalog()
    ]).then(([statsData, catalog]) => {
      setStats(statsData);
      const latest = catalog
        .filter(p => p.year === '2025' || p.year === '2024')
        .slice(0, 6);
      setRecentUploads(latest);
      setHistory(storageService.getHistory().slice(0, 4));
      setLoading(false);
    });

    const refreshHistory = () => {
      setHistory(storageService.getHistory().slice(0, 4));
    };
    window.addEventListener('beu-history-updated', refreshHistory);
    window.addEventListener('focus', refreshHistory);
    return () => {
      window.removeEventListener('beu-history-updated', refreshHistory);
      window.removeEventListener('focus', refreshHistory);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const semesterCards = [
    { sem: 1, name: '1st Semester', desc: 'Engineering Physics, Basic Electrical, Maths-1, English', papers: stats?.semesterDistribution['1'] || 93 },
    { sem: 2, name: '2nd Semester', desc: 'Engineering Chemistry, PPS, Maths-2, Workshop', papers: stats?.semesterDistribution['2'] || 92 },
    { sem: 3, name: '3rd Semester', desc: 'DSA, Digital Electronics, Analog Circuits, Maths-3', papers: stats?.semesterDistribution['3'] || 89 },
    { sem: 4, name: '4th Semester', desc: 'DAA, OS, DBMS, Discrete Mathematics, Networks', papers: stats?.semesterDistribution['4'] || 89 },
  ];

  return (
    <div className="space-y-10 pb-6">
      {/* =========================================================================
          HERO BANNER: Attractive, Modern Academic UI with Ambient Glow & FBi Credit
         ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-10 lg:p-12 border border-slate-200/90 dark:border-slate-800 shadow-md">
        {/* Subtle Ambient Radial Backdrops */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-indigo-500/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* FBi Platform Attribution Pill */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>BEU Archive Platform • Engineered & Curated by FBi</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
          </div>

          {/* Hero Headline with Modern Gradient Accent */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Bihar Engineering University <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Official PYQ & Practice Platform
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Access <strong>363 verified semester examination papers</strong> across <strong>92 engineering branches</strong>. Featuring KaTeX vector math derivations, 6★ repetition frequency intelligence, interactive practice scoring, and official BEU model answer keys.
          </p>

          {/* Feature Micro-Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>363 Authentic Papers</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Randomized MCQs</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Unlockable Model Answers</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Crafted by FBi</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              to="/papers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-md shadow-indigo-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Papers</span>
            </Link>

            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            >
              <Library className="w-4 h-4" />
              <span>Browse 92 Subjects</span>
            </Link>

            <Link
              to="/papers?sort=newest"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition"
            >
              <Trophy className="w-4 h-4" />
              <span>Practice Engine</span>
            </Link>
          </div>
        </div>

        {/* Clean Blueprint Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_70%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      </section>

      {/* =========================================================================
          DASHBOARD CREATOR SPOTLIGHT: Dedicated Credit Card for ME FBi
         ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* FBi Avatar Badge with Gradient Ring */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-pink-300">
                FBi
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" title="Active Platform Lead" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                  Creator & Platform Architect
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>Lead Developer</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Designed & Engineered with Passion by FBi
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                Dedicated to every Bihar Engineering University (BEU) student. Built with 100% authentic university exam archives, syllabus-calibrated marking schemes, KaTeX mathematical proofs, and interactive exam practice.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/papers"
              className="flex-1 md:flex-initial text-center px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 transition shadow-sm"
            >
              Start Studying
            </Link>
            <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/40">
              <span>By Love By FBi</span>
              <span className="text-rose-400 animate-pulse">❤️</span>
            </div>
          </div>
        </div>

        {/* Ambient Corner Flare */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* =========================================================================
          KEY STUDY ACCELERATORS: Practice Mode, High Yield Radar, Model Answers
         ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Accelerator 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              Interactive Practice Mode
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Test your recall on authentic questions. Randomized MCQ choices, real-time score calculation, and answer keys that unlock automatically upon attempting.
            </p>
          </div>
          <Link
            to="/papers?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline"
          >
            <span>Launch Practice Session</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Accelerator 2 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-rose-400 dark:hover:border-rose-600 transition group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-400/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 fill-rose-500/20" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
              High-Yield Repeat Radar
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Filter questions by star repetition frequency (1★ to 6+★). Focus directly on topics guaranteed to carry heavy weight in BEU semester exams.
            </p>
          </div>
          <Link
            to="/papers?highYield=true"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:underline"
          >
            <span>Filter High-Yield (≥3★)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Accelerator 3 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              Official A4 Print & PDF
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              High-resolution print stylesheet formatted for A4 examination printouts. Includes clean university headers and official "By Love By FBi ❤️" stamp.
            </p>
          </div>
          <Link
            to="/papers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline"
          >
            <span>Browse Printable Papers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          LIVE PLATFORM STATISTICS CARDS (Polished with Accent Indicators)
         ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Papers</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalPapers || 363}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Semesters 1 to 4 Complete</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Subjects</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalSubjects || 92}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">B.Tech Engineering Branches</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Questions Indexed</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalSubQuestions.toLocaleString() || '8,828'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Formulas, MCQs & Options</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Archive Span</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                2012–2025
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">14 Continuous Exam Years</p>
        </div>
      </section>

      {/* =========================================================================
          SEMESTER LAUNCHPADS
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Semester Launchpads</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instant jump to your current semester syllabus</p>
          </div>
          <Link
            to="/semesters"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Semesters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {semesterCards.map(s => (
            <Link
              key={s.sem}
              to={`/papers?semester=${s.sem}`}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Semester {s.sem}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300">
                    {s.papers} Papers
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Browse Papers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-indigo-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          HIGH YIELD ENGINEERING SUBJECTS
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">High-Yield Engineering Subjects</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Branches with the highest verified question repetition rate</p>
          </div>
          <Link
            to="/subjects"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All 92 Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {stats?.topSubjects.slice(0, 6).map(subj => (
            <Link
              key={subj.code}
              to={`/papers?subject=${subj.code}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {subj.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Code: <code className="font-mono">{subj.code}</code> · {subj.paperCount} Papers · {subj.totalSubquestions} Qs
                </p>
              </div>

              {subj.maxFreq >= 4 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                  <Flame className="w-3 h-3 fill-rose-500/30" />
                  <span>{subj.maxFreq}x Repeat</span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          RECENT EXAMINATION PAPERS (2024-2025)
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Examination Papers</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest BEU examination papers from the 2024 and 2025 exam cycle</p>
          </div>
          <Link
            to="/papers?sort=newest"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Papers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentUploads.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          RECENTLY VIEWED PAPERS (Reactive)
         ========================================================================= */}
      {history.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recently Viewed</span>
              </h2>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full History
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {history.map(item => (
              <Link
                key={item.paperId}
                to={`/paper/${item.paperId}`}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition block shadow-xs"
              >
                <div className="text-[10px] text-slate-400 font-mono">
                  Sem {item.semester} · {item.year}
                </div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate mt-1">
                  {item.subject_name}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          PLATFORM FOOTER: Dedicated FBi Signature & Verification
         ========================================================================= */}
      <footer className="pt-8 pb-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <span>Bihar Engineering University (BEU) PYQ Archive</span>
          <span>•</span>
          <span>363 Authentic Papers (2012–2025)</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <span>Crafted with</span>
          <span className="text-rose-500 animate-pulse">❤️</span>
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent font-extrabold">By Love By FBi</span>
        </div>
      </footer>
    </div>
  );
};
