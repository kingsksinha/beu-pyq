import type { BookmarkItem, HistoryItem } from '../types/paper';

const STORAGE_KEYS = {
  BOOKMARKS: 'beu_pyq_bookmarks_v1',
  HISTORY: 'beu_pyq_history_v1',
  SEARCH_HISTORY: 'beu_pyq_searches_v1',
  REVISION_MARKS: 'beu_pyq_revisions_v1',
  PRACTICE_PROGRESS: 'beu_pyq_practice_v1',
  THEME: 'beu_pyq_theme_v1'
} as const;

export const storageService = {
  // --- Bookmarks ---
  getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isPaperBookmarked(paperId: string): boolean {
    const list = this.getBookmarks();
    return list.some(b => b.paperId === paperId && b.type === 'paper');
  },

  isQuestionBookmarked(questionId: string): boolean {
    const list = this.getBookmarks();
    return list.some(b => b.questionId === questionId && b.type === 'question');
  },

  togglePaperBookmark(item: Omit<BookmarkItem, 'savedAt' | 'id' | 'type'>): boolean {
    const list = this.getBookmarks();
    const existingIndex = list.findIndex(b => b.paperId === item.paperId && b.type === 'paper');
    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return false; // removed
    } else {
      const newBookmark: BookmarkItem = {
        ...item,
        id: `paper_${item.paperId}`,
        type: 'paper',
        savedAt: Date.now()
      };
      list.unshift(newBookmark);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return true; // added
    }
  },

  toggleQuestionBookmark(item: Omit<BookmarkItem, 'savedAt' | 'id' | 'type'> & { questionId: string; questionText?: string; questionNumber?: number }): boolean {
    const list = this.getBookmarks();
    const existingIndex = list.findIndex(b => b.questionId === item.questionId && b.type === 'question');
    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return false;
    } else {
      const newBookmark: BookmarkItem = {
        ...item,
        id: `q_${item.questionId}`,
        type: 'question',
        savedAt: Date.now()
      };
      list.unshift(newBookmark);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return true;
    }
  },

  removeBookmark(id: string): void {
    const list = this.getBookmarks().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
  },

  clearAllBookmarks(): void {
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
  },

  // --- Recently Viewed Papers ---
  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistory(item: Omit<HistoryItem, 'viewedAt'>): void {
    const list = this.getHistory().filter(h => h.paperId !== item.paperId);
    list.unshift({ ...item, viewedAt: Date.now() });
    // keep max 50 items
    if (list.length > 50) list.length = 50;
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
    window.dispatchEvent(new Event('beu-history-updated'));
  },

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  // --- Search History ---
  getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSearchHistory(query: string): void {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    const list = this.getSearchHistory().filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    list.unshift(trimmed);
    if (list.length > 10) list.length = 10;
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(list));
  },

  clearSearchHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  // --- Revision Marks (for practice) ---
  getRevisionList(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_MARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isMarkedForRevision(subQuestionId: string): boolean {
    return this.getRevisionList().includes(subQuestionId);
  },

  toggleRevisionMark(subQuestionId: string): boolean {
    const list = this.getRevisionList();
    const idx = list.indexOf(subQuestionId);
    if (idx >= 0) {
      list.splice(idx, 1);
      localStorage.setItem(STORAGE_KEYS.REVISION_MARKS, JSON.stringify(list));
      return false;
    } else {
      list.push(subQuestionId);
      localStorage.setItem(STORAGE_KEYS.REVISION_MARKS, JSON.stringify(list));
      return true;
    }
  },

  // --- Theme ---
  getTheme(): 'dark' | 'light' {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light'; // Default to inviting, crisp, readable light mode
  },

  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
