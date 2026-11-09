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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by subject, code, year, exam code..."
            className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-zinc-500 bg-zinc-200 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Content Area */}
        <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/40">
          {/* Recent Searches (when query empty) */}
          {!query.trim() && (
            <div className="p-3">
              {history.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        storageService.clearSearchHistory();
                        setHistory([]);
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((hist, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleHistoryClick(hist)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition"
                      >
                        {hist}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-zinc-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Type anything to search 363 BEU question papers</p>
                  <p className="text-xs text-zinc-400 mt-1">E.g. "Physics", "100201", "Mathematics", "2024", "DSA"</p>
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
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    item.type === 'subject'
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
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
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      <SearchHighlight text={item.subtitle} query={query} />
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* No results state */}
          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center text-zinc-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">No question papers found</p>
              <p className="text-xs text-zinc-400 mt-1">
                No papers or subjects matching "<span className="text-zinc-200 font-medium">{query}</span>"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">↑↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">↵</kbd> to open</span>
          </div>
          <span>Showing {results.length} results</span>
        </div>
      </div>
    </div>
  );
};
