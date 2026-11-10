import type { PaperCatalogItem, SubjectItem } from '../types/paper';
import { curriculumService, MAJOR_BRANCHES } from './curriculumService';
import { formatBTechYear } from '../utils/formatters';

export interface SearchResultItem {
  id: string;
  type: 'paper' | 'subject' | 'branch' | 'curriculum';
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
    branch?: string;
  };
}

export const searchService = {
  search(query: string, papers: PaperCatalogItem[], subjects: SubjectItem[]): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 0. Search Engineering Branches & Curriculum Cycles
    for (const b of MAJOR_BRANCHES) {
      const matchKey = b.key.toLowerCase() === q;
      const matchLabel = b.label.toLowerCase().includes(q);
      const matchShort = b.shortName.toLowerCase().includes(q);
      const matchPrefix = b.prefix === q;

      if (matchKey || matchLabel || matchShort || matchPrefix) {
        results.push({
          id: `branch_${b.key}`,
          type: 'branch',
          title: b.label,
          subtitle: `BEU Prefix: ${b.prefix} · View all department question papers and subjects`,
          badge: b.shortName,
          url: `/papers?branch=${b.key}`,
          meta: { branch: b.key }
        });
      }
    }

    // Check Group A / Group B / Physics Cycle / Chemistry Cycle queries
    if (q.includes('group a') || q.includes('group b') || q.includes('physics cycle') || q.includes('chemistry cycle')) {
      results.push({
        id: 'curriculum_cycles',
        type: 'curriculum',
        title: '1st Year Foundation: Group A & Group B Cycles',
        subtitle: 'Physics Cycle & Chemistry Cycle semester swaps for all BEU B.Tech branches',
        badge: '1st Year',
        url: '/semesters?sem=1',
        meta: { semester: 1 }
      });
    }

    // Check if query is a revised syllabus code with a PYQ alias (e.g. 105301 -> 100403)
    const aliasInfo = curriculumService.resolvePyqAlias(q);
    const revisedInfo = curriculumService.getRevisedSyllabusInfo(q);

    // 1. Search Subjects
    for (const subj of subjects) {
      const branchKey = subj.branch || curriculumService.detectBranch(undefined, subj.code);
      const branchMeta = curriculumService.getMajorBranchMeta(branchKey);

      const matchName = subj.name.toLowerCase().includes(q);
      const matchCode = subj.code.toLowerCase().includes(q);
      const matchBranch = branchMeta.label.toLowerCase().includes(q) || branchMeta.shortName.toLowerCase() === q;

      if (matchName || matchCode || matchBranch) {
        results.push({
          id: `subj_${subj.code}`,
          type: 'subject',
          title: subj.name,
          subtitle: `Subject Code: ${subj.code} · Dept: ${branchMeta.shortName} · ${subj.paperCount} Papers · ${subj.semesters.map(s => formatBTechYear(s)).join(', ')}`,
          badge: `${subj.paperCount} Papers`,
          url: `/papers?subject=${subj.code}`,
          meta: {
            subjectCode: subj.code,
            paperCount: subj.paperCount,
            branch: branchKey
          }
        });
      }
      if (results.length >= 8) break;
    }

    // 2. Search Papers
    let paperCount = 0;
    for (const p of papers) {
      const branchKey = p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code);
      const branchMeta = curriculumService.getMajorBranchMeta(branchKey);

      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSubject = p.subject_name.toLowerCase().includes(q);
      const matchCode = p.exam_code.toLowerCase().includes(q);
      const matchYear = p.year.includes(q);
      const matchBTechYear =
        formatBTechYear(p.semester).toLowerCase().includes(q) ||
        `year ${p.semester}`.includes(q) ||
        `sem ${p.semester}`.includes(q);
      const matchBranch = branchMeta.label.toLowerCase().includes(q) || branchMeta.shortName.toLowerCase() === q;

      // Also match if query matches a syllabus alias (e.g. searching 105301 matches papers with exam_code 100403)
      const matchAlias =
        (aliasInfo && p.exam_code.toLowerCase().includes(aliasInfo.pyqCode.toLowerCase())) ||
        (revisedInfo && p.exam_code.toLowerCase().includes(revisedInfo.revisedCode.toLowerCase()));

      if (matchTitle || matchSubject || matchCode || matchYear || matchBTechYear || matchBranch || matchAlias) {
        const aliasNote = matchAlias
          ? ` · [Revised 2024–2026 Code: ${aliasInfo ? q : revisedInfo?.revisedCode}]`
          : '';

        results.push({
          id: p.id,
          type: 'paper',
          title: `${p.subject_name} (${p.year})`,
          subtitle: `${formatBTechYear(p.semester)} · ${branchMeta.shortName} · Code: ${p.exam_code}${aliasNote} · ${p.duration} · ${p.full_marks} Marks · ${p.question_count} Questions`,
          badge: `${formatBTechYear(p.semester)} · ${p.year}`,
          url: `/paper/${p.id}`,
          meta: {
            semester: p.semester,
            year: p.year,
            examCode: p.exam_code,
            subjectCode: p.subject_code,
            branch: branchKey
          }
        });
        paperCount++;
      }
      if (paperCount >= 20) break;
    }

    return results;
  }
};
