import type { FilterState, PaperCatalogItem, PaperDetail, PlatformStats, SubjectItem } from '../types/paper';
import { curriculumService } from './curriculumService';

let catalogCache: PaperCatalogItem[] | null = null;
let subjectsCache: SubjectItem[] | null = null;
let statsCache: PlatformStats | null = null;
const paperDetailCache = new Map<string, PaperDetail>();
let lastError: Error | null = null;

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');
const TRANSIENT_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/**
 * Fetch helper that retries strictly on transient network failures and 5xx/429 server statuses.
 * Ordinary 404s and client errors (4xx) are NOT retried.
 */
async function fetchWithTransientRetry(url: string, maxRetries = 2, baseDelay = 250): Promise<Response> {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        lastError = null;
        return res;
      }

      // Do NOT retry 404 or non-transient 4xx errors
      if (!TRANSIENT_STATUSES.has(res.status)) {
        const error = new Error(`HTTP ${res.status}: ${res.statusText} (${url})`);
        lastError = error;
        throw error;
      }

      // Transient server/rate-limiting error (5xx, 429)
      if (attempt >= maxRetries) {
        const error = new Error(`HTTP ${res.status} after ${maxRetries + 1} attempts (${url})`);
        lastError = error;
        throw error;
      }

      attempt++;
      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt - 1)));
    } catch (err: any) {
      // If it's a non-transient HTTP error, immediately propagate
      if (err.message && err.message.startsWith('HTTP 4') && !err.message.includes('429') && !err.message.includes('408')) {
        lastError = err;
        throw err;
      }

      // If network failure (TypeError/Failed to fetch)
      if (attempt >= maxRetries) {
        lastError = err;
        throw err;
      }

      attempt++;
      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt - 1)));
    }
  }
}

export const dataService = {
  getLastError(): Error | null {
    return lastError;
  },

  clearCache(): void {
    catalogCache = null;
    subjectsCache = null;
    statsCache = null;
    paperDetailCache.clear();
    lastError = null;
  },

  async getCatalog(): Promise<PaperCatalogItem[]> {
    if (catalogCache) return catalogCache;
    try {
      const res = await fetchWithTransientRetry(`${BASE_URL}/data/papers_catalog.json`);
      const data: PaperCatalogItem[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Catalog data is empty or invalid');
      }
      data.forEach(item => {
        item.branch = curriculumService.detectBranch(item.exam_code, item.subject_code);
      });
      catalogCache = data;
      return data;
    } catch (err: any) {
      console.error('Failed to load papers catalog:', err);
      lastError = err instanceof Error ? err : new Error(String(err));
      return [];
    }
  },

  async getSubjects(): Promise<SubjectItem[]> {
    if (subjectsCache) return subjectsCache;
    try {
      const [res, catalog] = await Promise.all([
        fetchWithTransientRetry(`${BASE_URL}/data/subjects.json`),
        this.getCatalog()
      ]);
      const data: SubjectItem[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Subjects data is empty or invalid');
      }

      const subjectBranches = new Map<string, Set<string>>();
      catalog.forEach(p => {
        const b = p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code);
        if (!subjectBranches.has(p.subject_code)) {
          subjectBranches.set(p.subject_code, new Set());
        }
        subjectBranches.get(p.subject_code)!.add(b);
      });

      data.forEach(item => {
        const primary = curriculumService.detectBranch(undefined, item.code);
        item.branch = primary;
        const bSet = subjectBranches.get(item.code) || new Set();
        bSet.add(primary);
        item.branches = Array.from(bSet);
      });

      subjectsCache = data;
      return data;
    } catch (err: any) {
      console.error('Failed to load subjects:', err);
      lastError = err instanceof Error ? err : new Error(String(err));
      return [];
    }
  },

  async getStats(): Promise<PlatformStats | null> {
    if (statsCache) return statsCache;
    try {
      const res = await fetchWithTransientRetry(`${BASE_URL}/data/stats.json`);
      const data: PlatformStats = await res.json();
      if (!data || typeof data.totalPapers !== 'number') {
        throw new Error('Stats data is invalid');
      }
      statsCache = data;
      return data;
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      lastError = err instanceof Error ? err : new Error(String(err));
      return null;
    }
  },

  async getPaperDetail(paperId: string): Promise<PaperDetail | null> {
    if (paperDetailCache.has(paperId)) {
      return paperDetailCache.get(paperId)!;
    }
    try {
      const res = await fetchWithTransientRetry(`${BASE_URL}/data/papers/${paperId}.json`);
      const data: PaperDetail = await res.json();
      if (!data || !data.id || !Array.isArray(data.questions)) {
        throw new Error(`Paper data for ${paperId} is invalid`);
      }
      paperDetailCache.set(paperId, data);
      return data;
    } catch (err: any) {
      console.error(`Failed to load paper ${paperId}:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
      return null;
    }
  },

  filterAndSort(papers: PaperCatalogItem[], filters: FilterState): PaperCatalogItem[] {
    let result = papers.filter(p => {
      // Semester filter
      if (filters.semester !== 'ALL' && p.semester.toString() !== filters.semester) {
        return false;
      }
      // Branch filter
      if (filters.branch && filters.branch !== 'ALL') {
        const itemBranch = p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code);
        if (itemBranch !== filters.branch) {
          return false;
        }
      }
      // Subject filter
      if (filters.subject !== 'ALL' && p.subject_code !== filters.subject) {
        return false;
      }
      // Year filter
      if (filters.year !== 'ALL' && p.year !== filters.year) {
        return false;
      }
      // Exam code filter
      if (filters.examCode && !p.exam_code.toLowerCase().includes(filters.examCode.toLowerCase())) {
        return false;
      }
      // MCQs only
      if (filters.hasMcqOnly && !p.has_mcq) {
        return false;
      }
      // High frequency only
      if (filters.highFreqOnly && p.max_freq < 3) {
        return false;
      }
      // Query text search
      if (filters.query && filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSubject = p.subject_name.toLowerCase().includes(q);
        const matchCode = p.exam_code.toLowerCase().includes(q);
        const matchYear = p.year.includes(q);
        const matchSubjCode = p.subject_code.toLowerCase().includes(q);
        if (!matchTitle && !matchSubject && !matchCode && !matchYear && !matchSubjCode) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return parseInt(b.year, 10) - parseInt(a.year, 10);
        case 'oldest':
          return parseInt(a.year, 10) - parseInt(b.year, 10);
        case 'subject-az':
          return a.subject_name.localeCompare(b.subject_name);
        case 'subject-za':
          return b.subject_name.localeCompare(a.subject_name);
        case 'semester-asc':
          return a.semester - b.semester;
        case 'semester-desc':
          return b.semester - a.semester;
        case 'year-asc':
          return parseInt(a.year, 10) - parseInt(b.year, 10);
        case 'year-desc':
          return parseInt(b.year, 10) - parseInt(a.year, 10);
        case 'questions-desc':
          return b.total_subquestions - a.total_subquestions;
        case 'questions-asc':
          return a.total_subquestions - b.total_subquestions;
        default:
          return 0;
      }
    });

    return result;
  }
};
