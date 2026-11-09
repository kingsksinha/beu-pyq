import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Trash2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import type { HistoryItem } from '../types/paper';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>(() => storageService.getHistory());

  useEffect(() => {
    const refresh = () => {
      setHistory(storageService.getHistory());
    };
    refresh();

    window.addEventListener('beu-history-updated', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('beu-history-updated', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your viewing history?')) {
      storageService.clearHistory();
      setHistory([]);
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
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Viewing Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            Recently Viewed Papers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            History of question papers and practice sessions you have recently accessed.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map(item => (
            <div
              key={item.paperId}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-1">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700">
                    Sem {item.semester} · {item.year}
                  </span>
                  <span>Code: {item.exam_code}</span>
                  <span>·</span>
                  <span>{formatTime(item.viewedAt)}</span>
                </div>

                <Link to={`/paper/${item.paperId}`}>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition truncate">
                    {item.subject_name}
                  </h3>
                </Link>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/practice/${item.paperId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition"
                >
                  <span>Practice</span>
                </Link>

                <Link
                  to={`/paper/${item.paperId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition"
                >
                  <span>View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
          <Clock className="w-10 h-10 mx-auto text-zinc-400 dark:text-zinc-600" />
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Recent History</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Papers you inspect or practice will automatically appear here for easy resumption.
          </p>
          <div className="pt-2">
            <Link
              to="/papers"
              className="inline-block px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold"
            >
              Browse Question Papers
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
