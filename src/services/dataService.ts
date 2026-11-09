import type { FilterState, PaperCatalogItem, PaperDetail, PlatformStats, SubjectItem } from '../types/paper';

let catalogCache: PaperCatalogItem[] | null = null;
let subjectsCache: SubjectItem[] | null = null;
let statsCache: PlatformStats | null = null;
const paperDetailCache = new Map<string, PaperDetail>();

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');

export const dataService = {
  async getCatalog(): Promise<PaperCatalogItem[]> {
    if (catalogCache) return catalogCache;
    try {
      const res = await fetch(`${BASE_URL}/data/papers_catalog.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PaperCatalogItem[] = await res.json();
      catalogCache = data;
      return data;
    } catch (err) {
      console.error('Failed to load papers catalog:', err);
      return [];
    }
  },

  async getSubjects(): Promise<SubjectItem[]> {
    if (subjectsCache) return subjectsCache;
    try {
      const res = await fetch(`${BASE_URL}/data/subjects.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SubjectItem[] = await res.json();
      subjectsCache = data;
      return data;
    } catch (err) {
      console.error('Failed to load subjects:', err);
      return [];
    }
  },

  async getStats(): Promise<PlatformStats | null> {
    if (statsCache) return statsCache;
    try {
      const res = await fetch(`${BASE_URL}/data/stats.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PlatformStats = await res.json();
      statsCache = data;
      return data;
    } catch (err) {
      console.error('Failed to load stats:', err);
      return null;
    }
  },

  async getPaperDetail(paperId: string): Promise<PaperDetail | null> {
    if (paperDetailCache.has(paperId)) {
      return paperDetailCache.get(paperId)!;
    }
    try {
      const res = await fetch(`${BASE_URL}/data/papers/${paperId}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PaperDetail = await res.json();
      paperDetailCache.set(paperId, data);
      return data;
    } catch (err) {
      console.error(`Failed to load paper ${paperId}:`, err);
      return null;
    }
  },

  filterAndSort(papers: PaperCatalogItem[], filters: FilterState): PaperCatalogItem[] {
    let result = papers.filter(p => {
      // Semester filter
      if (filters.semester !== 'ALL' && p.semester.toString() !== filters.semester) {
        return false;
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
