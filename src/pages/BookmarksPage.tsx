import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, HelpCircle, Trash2 } from 'lucide-react';
import { MathText } from '../components/ui/MathText';
import { storageService } from '../services/storageService';
import type { BookmarkItem } from '../types/paper';

export const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [activeTab, setActiveTab] = useState<'papers' | 'questions'>('papers');

  useEffect(() => {
    setBookmarks(storageService.getBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    storageService.removeBookmark(id);
    setBookmarks(storageService.getBookmarks());
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your saved bookmarks?')) {
      storageService.clearAllBookmarks();
      setBookmarks([]);
    }
  };

  const paperBookmarks = bookmarks.filter(b => b.type === 'paper');
  const questionBookmarks = bookmarks.filter(b => b.type === 'question');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <Bookmark className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Saved Academic Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Your Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Quickly revisit saved question papers and individual practice questions.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Bookmarks</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'papers'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Bookmarked Papers ({paperBookmarks.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'questions'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Saved Questions ({questionBookmarks.length})
        </button>
      </div>

      {/* Papers Tab Content */}
      {activeTab === 'papers' && (
        <div>
          {paperBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paperBookmarks.map(b => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-xs hover:border-zinc-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold border border-zinc-200 dark:border-zinc-700">
                        Sem {b.semester} · {b.year}
                      </span>
                      <span>Code: {b.exam_code}</span>
                    </div>

                    <Link to={`/paper/${b.paperId}`} className="block">
                      <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition line-clamp-2">
                        {b.subject_name}
                      </h3>
                    </Link>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <Link
                      to={`/paper/${b.paperId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                    >
                      <span>Open Paper</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleRemove(b.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
              <Bookmark className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" />
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Bookmarked Question Papers</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Click the bookmark icon on any paper card or detail view to save papers for quick access.
              </p>
              <Link
                to="/papers"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition"
              >
                Browse All Papers
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Questions Tab Content */}
      {activeTab === 'questions' && (
        <div>
          {questionBookmarks.length > 0 ? (
            <div className="space-y-3">
              {questionBookmarks.map(b => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-mono">
                        {b.subject_name} · Sem {b.semester} ({b.year})
                      </span>
                      {b.questionNumber && (
                        <span className="text-xs font-bold text-zinc-500 font-mono">
                          Q.{b.questionNumber}
                        </span>
                      )}
                    </div>

                    {b.questionText && (
                      <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 line-clamp-2">
                        <MathText text={b.questionText} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <Link
                      to={`/paper/${b.paperId}#${b.questionId || ''}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition"
                    >
                      <span>Jump to Question</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleRemove(b.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
              <HelpCircle className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" />
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Saved Questions</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Save individual questions while viewing a paper or during practice mode to build your custom revision bank.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
