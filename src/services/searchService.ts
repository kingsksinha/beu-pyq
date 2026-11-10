import type { PaperCatalogItem, SubjectItem } from '../types/paper';
import { formatBTechYear } from '../utils/formatters';

export interface SearchResultItem {
  id: string;
  type: 'paper' | 'subject';
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
  meta: {
    semester?: number;
    year?: string;
    examCode?: string;
    subjectCode?: string;
    paperCount?: number;
  };
}

export const searchService = {
  search(query: string, papers: PaperCatalogItem[], subjects: SubjectItem[]): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 1. Search Subjects
    for (const subj of subjects) {
      const matchName = subj.name.toLowerCase().includes(q);
      const matchCode = subj.code.toLowerCase().includes(q);
      if (matchName || matchCode) {
        results.push({
          id: `subj_${subj.code}`,
          type: 'subject',
          title: subj.name,
          subtitle: `Subject Code: ${subj.code} · ${subj.paperCount} Papers · Years: ${subj.semesters.map(s => formatBTechYear(s)).join(', ')}`,
          badge: `${subj.paperCount} Papers`,
          url: `/papers?subject=${subj.code}`,
          meta: {
            subjectCode: subj.code,
            paperCount: subj.paperCount
          }
        });
      }
      if (results.length >= 8) break;
    }

    // 2. Search Papers
    let paperCount = 0;
    for (const p of papers) {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSubject = p.subject_name.toLowerCase().includes(q);
      const matchCode = p.exam_code.toLowerCase().includes(q);
      const matchYear = p.year.includes(q);
      const matchBTechYear = formatBTechYear(p.semester).toLowerCase().includes(q) || `year ${p.semester}`.includes(q) || `sem ${p.semester}`.includes(q);

      if (matchTitle || matchSubject || matchCode || matchYear || matchBTechYear) {
        results.push({
          id: p.id,
          type: 'paper',
          title: `${p.subject_name} (${p.year})`,
          subtitle: `${formatBTechYear(p.semester)} · Code: ${p.exam_code} · ${p.duration} · ${p.full_marks} Marks · ${p.question_count} Questions`,
          badge: `${formatBTechYear(p.semester)} · ${p.year}`,
          url: `/paper/${p.id}`,
          meta: {
            semester: p.semester,
            year: p.year,
            examCode: p.exam_code,
            subjectCode: p.subject_code
          }
        });
        paperCount++;
      }
      if (paperCount >= 20) break;
    }

    return results;
  }
};
