import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, FileText, Search, Sparkles, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { searchService } from '../../services/searchService';
import type { SearchResultItem } from '../../services/searchService';
import { storageService } from '../../services/storageService';
import type { PaperCatalogItem, SubjectItem } from '../../types/paper';
import { SearchHighlight } from './SearchHighlight';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [papers, setPapers] = useState<PaperCatalogItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load data on open
  useEffect(() => {
    if (isOpen) {
      setHistory(storageService.getSearchHistory());
      dataService.getCatalog().then(setPapers);
      dataService.getSubjects().then(setSubjects);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const res = searchService.search(query, papers, subjects);
    setResults(res);
    setSelectedIndex(0);
  }, [query, papers, subjects]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchResultItem) => {
    storageService.addSearchHistory(query);
    onClose();
    navigate(item.url);
  };

  const handleHistoryClick = (histQuery: string) => {
    setQuery(histQuery);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-24 px-2.5 sm:px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by subject, code, year, exam code..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Content Area */}
        <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {/* Recent Searches (when query empty) */}
          {!query.trim() && (
            <div className="p-3">
              {history.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        storageService.clearSearchHistory();
                        setHistory([]);
                      }}
                      className="text-xs text-slate-400 hover:text-rose-500 transition"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((hist, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleHistoryClick(hist)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition font-medium"
                      >
                        {hist}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-500" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Type anything to search authentic BEU question papers</p>
                  <p className="text-xs text-slate-400 mt-1">E.g. "Physics", "100201", "Mathematics", "2024", "DSA"</p>
                </div>
              )}
            </div>
          )}

          {/* Results list */}
          {query.trim() && results.length > 0 && (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-slate-900 dark:text-white border border-indigo-200 dark:border-indigo-800/80'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    item.type === 'subject'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {item.type === 'subject' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold truncate">
                        <SearchHighlight text={item.title} query={query} />
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      <SearchHighlight text={item.subtitle} query={query} />
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* No results state */}
          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No question papers found</p>
              <p className="text-xs text-slate-400 mt-1">
                No papers or subjects matching "<span className="text-indigo-400 font-medium">{query}</span>"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">↑↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">↵</kbd> to open</span>
          </div>
          <span className="font-mono">Showing {results.length} results</span>
        </div>
      </div>
    </div>
  );
};
