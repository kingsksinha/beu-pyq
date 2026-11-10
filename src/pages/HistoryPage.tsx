import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, RotateCcw, Trash2, Trophy } from 'lucide-react';
import { storageService } from '../services/storageService';
import { formatBTechYear } from '../utils/formatters';
import type { HistoryItem } from '../types/paper';
import type { PracticeScoreRecord } from '../services/storageService';

export const HistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'scores'>('papers');
  const [history, setHistory] = useState<HistoryItem[]>(() => storageService.getHistory());
  const [scores, setScores] = useState<PracticeScoreRecord[]>(() => storageService.getPracticeScores());

  useEffect(() => {
    const refresh = () => {
      setHistory(storageService.getHistory());
      setScores(storageService.getPracticeScores());
    };
    refresh();

    window.addEventListener('beu-history-updated', refresh);
    window.addEventListener('beu-score-updated', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('beu-history-updated', refresh);
      window.removeEventListener('beu-score-updated', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleClearHistory = () => {
    if (activeTab === 'papers') {
      if (window.confirm('Are you sure you want to clear your viewed papers history?')) {
        storageService.clearHistory();
        setHistory([]);
      }
    } else {
      if (window.confirm('Are you sure you want to clear your practice scorecard history?')) {
        storageService.clearPracticeScores();
        setScores([]);
      }
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Activity & Score Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            History & Practice Scorecards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your recently accessed papers and review your past exam practice scores.
          </p>
        </div>

        {((activeTab === 'papers' && history.length > 0) || (activeTab === 'scores' && scores.length > 0)) && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear {activeTab === 'papers' ? 'History' : 'Scores'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'papers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Viewed Papers ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'scores'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Practice Scorecards ({scores.length})</span>
        </button>
      </div>

      {/* Tab 1: Viewed Papers */}
      {activeTab === 'papers' && (
        <>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map(item => (
                <div
                  key={item.paperId}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition hover:shadow-md"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/80">
                        {formatBTechYear(item.semester)} · {item.year}
                      </span>
                      <span>Code: {item.exam_code}</span>
                      <span>·</span>
                      <span>{formatTime(item.viewedAt)}</span>
                    </div>

                    <Link to={`/paper/${item.paperId}`}>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate">
                        {item.subject_name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/practice/${item.paperId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                    >
                      <span>Practice</span>
                    </Link>

                    <Link
                      to={`/paper/${item.paperId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-500/20"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <Clock className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No Viewed Papers Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Papers you inspect or practice will automatically appear here for easy resumption.
              </p>
              <div className="pt-2">
                <Link
                  to="/papers"
                  className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold transition shadow-md shadow-indigo-500/20"
                >
                  Browse Question Papers
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Practice Scorecards */}
      {activeTab === 'scores' && (
        <>
          {scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map(sc => (
                <div
                  key={sc.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition hover:shadow-md"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/80">
                        {formatBTechYear(sc.semester)} · {sc.year}
                      </span>
                      <span>·</span>
                      <span>{formatTime(sc.timestamp)}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                      {sc.subject_name}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                      <span>{sc.attemptedCount} of {sc.totalItems} attempted</span>
                      <span>·</span>
                      <span>Accuracy: <strong>{sc.accuracy !== null && sc.accuracy !== undefined ? `${sc.accuracy}%` : 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {sc.marksEarned} <span className="text-xs text-slate-400 font-normal">/ {sc.possibleMarks} M</span>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {sc.percentage}% Score
                      </div>
                    </div>

                    <Link
                      to={`/practice/${sc.paperId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <Trophy className="w-10 h-10 mx-auto text-amber-500/50" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No Practice Tests Completed Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Take an interactive practice test on any paper to generate and track your scorecards here.
              </p>
              <div className="pt-2">
                <Link
                  to="/papers?sort=newest"
                  className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold transition shadow-md shadow-indigo-500/20"
                >
                  Start a Practice Test
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
