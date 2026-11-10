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

interface ScoredResult {
  item: SearchResultItem;
  score: number;
}

export const searchService = {
  search(query: string, papers: PaperCatalogItem[], subjects: SubjectItem[]): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const scoredResults: ScoredResult[] = [];

    // 0. Search Engineering Branches & Curriculum Cycles
    for (const b of MAJOR_BRANCHES) {
      const matchKey = b.key.toLowerCase() === q;
      const matchPrefix = b.prefix === q;
      const matchShort = b.shortName.toLowerCase() === q;
      const matchLabel = b.label.toLowerCase().includes(q);

      if (matchKey || matchPrefix || matchShort || matchLabel) {
        let score = 30;
        if (matchKey || matchPrefix) score = 110;
        else if (matchShort) score = 90;
        else if (b.label.toLowerCase().startsWith(q)) score = 70;

        scoredResults.push({
          item: {
            id: `branch_${b.key}`,
            type: 'branch',
            title: b.label,
            subtitle: `BEU Prefix: ${b.prefix} · View all department question papers and subjects`,
            badge: b.shortName,
            url: `/papers?branch=${b.key}`,
            meta: { branch: b.key }
          },
          score
        });
      }
    }

    // Check Group A / Group B / Physics Cycle / Chemistry Cycle queries
    if (q.includes('group a') || q.includes('group b') || q.includes('physics cycle') || q.includes('chemistry cycle')) {
      scoredResults.push({
        item: {
          id: 'curriculum_cycles',
          type: 'curriculum',
          title: '1st Year Foundation: Group A & Group B Cycles',
          subtitle: 'Physics Cycle & Chemistry Cycle semester swaps for all BEU B.Tech branches',
          badge: '1st Year',
          url: '/semesters?sem=1',
          meta: { semester: 1 }
        },
        score: 95
      });
    }

    // Check if query is a revised syllabus code with a PYQ alias (e.g. 105301 -> 100403)
    const aliasInfo = curriculumService.resolvePyqAlias(q);
    const revisedInfo = curriculumService.getRevisedSyllabusInfo(q);

    // 1. Search Subjects
    for (const subj of subjects) {
      const branchKey = subj.branch || curriculumService.detectBranch(undefined, subj.code);
      const branchMeta = curriculumService.getMajorBranchMeta(branchKey);

      const codeLower = subj.code.toLowerCase();
      const nameLower = subj.name.toLowerCase();

      const exactCode = codeLower === q;
      const startsCode = codeLower.startsWith(q);
      const exactName = nameLower === q;
      const startsName = nameLower.startsWith(q);
      const matchName = nameLower.includes(q);
      const matchCode = codeLower.includes(q);
      const matchBranch = branchMeta.label.toLowerCase().includes(q) || branchMeta.shortName.toLowerCase() === q;

      if (exactCode || startsCode || exactName || startsName || matchName || matchCode || matchBranch) {
        let score = 25;
        if (exactCode) score = 120;
        else if (exactName) score = 100;
        else if (startsCode) score = 85;
        else if (startsName) score = 75;
        else if (matchCode) score = 60;
        else if (matchName) score = 40;

        scoredResults.push({
          item: {
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
          },
          score
        });
      }
    }

    // 2. Search Papers
    let matchingPapersCount = 0;
    for (const p of papers) {
      const branchKey = p.branch || curriculumService.detectBranch(p.exam_code, p.subject_code);
      const branchMeta = curriculumService.getMajorBranchMeta(branchKey);

      const examCodeLower = p.exam_code.toLowerCase();
      const subjectCodeLower = p.subject_code.toLowerCase();
      const titleLower = p.title.toLowerCase();
      const subjectNameLower = p.subject_name.toLowerCase();

      const exactExamCode = examCodeLower === q;
      const startsExamCode = examCodeLower.startsWith(q);
      const exactSubjectCode = subjectCodeLower === q;
      const exactSubjectName = subjectNameLower === q;
      const startsSubjectName = subjectNameLower.startsWith(q);

      const matchTitle = titleLower.includes(q);
      const matchSubject = subjectNameLower.includes(q);
      const matchCode = examCodeLower.includes(q);
      const matchYear = p.year.includes(q);
      const matchBTechYear =
        formatBTechYear(p.semester).toLowerCase().includes(q) ||
        `year ${p.semester}`.includes(q) ||
        `sem ${p.semester}`.includes(q);
      const matchBranch = branchMeta.label.toLowerCase().includes(q) || branchMeta.shortName.toLowerCase() === q;

      const matchAlias =
        (aliasInfo && p.exam_code.toLowerCase().includes(aliasInfo.pyqCode.toLowerCase())) ||
        (revisedInfo && p.exam_code.toLowerCase().includes(revisedInfo.revisedCode.toLowerCase()));

      if (
        exactExamCode || startsExamCode || exactSubjectCode || exactSubjectName ||
        startsSubjectName || matchTitle || matchSubject || matchCode || matchYear ||
        matchBTechYear || matchBranch || matchAlias
      ) {
        matchingPapersCount++;

        let score = 20;
        if (exactExamCode) score = 130;
        else if (exactSubjectCode) score = 115;
        else if (exactSubjectName) score = 95;
        else if (startsExamCode) score = 85;
        else if (startsSubjectName) score = 70;
        else if (matchCode) score = 55;
        else if (matchSubject) score = 45;
        else if (matchAlias) score = 65;

        // Give recency boost to papers (e.g. 2024 > 2020)
        const yearNum = parseInt(p.year, 10);
        if (!isNaN(yearNum)) {
          score += Math.max(0, yearNum - 2018);
        }

        const aliasNote = matchAlias
          ? ` · [Revised 2024–2026 Code: ${aliasInfo ? q : revisedInfo?.revisedCode}]`
          : '';

        scoredResults.push({
          item: {
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
          },
          score
        });
      }
    }

    // Sort all scored results by relevance score descending
    scoredResults.sort((a, b) => b.score - a.score);

    // If there are many matching papers, add an expansion action item
    if (matchingPapersCount > 8) {
      scoredResults.unshift({
        item: {
          id: `explore_filter_${q}`,
          type: 'curriculum',
          title: `Explore All ${matchingPapersCount} Papers for "${query.trim()}"`,
          subtitle: `Open Papers Explorer with full filters (branch, semester, year, high-yield)`,
          badge: `${matchingPapersCount} Results`,
          url: `/papers?q=${encodeURIComponent(query.trim())}`,
          meta: {}
        },
        score: 999
      });
    }

    // Return top 25 highest relevance items
    return scoredResults.slice(0, 25).map(sr => sr.item);
  }
};
