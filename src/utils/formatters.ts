/**
 * Formats semester number (1, 2, 3, 4) into engineering academic year label.
 */
export const formatBTechYear = (sem: number | string | undefined | null): string => {
  if (sem === undefined || sem === null || sem === '' || sem === 'ALL') {
    return 'All Years';
  }
  const n = typeof sem === 'string' ? parseInt(sem, 10) : sem;
  switch (n) {
    case 1:
      return '1st Year';
    case 2:
      return '2nd Year';
    case 3:
      return '3rd Year';
    case 4:
      return '4th Year';
    default:
      return !isNaN(n) && n > 0 ? `Year ${n}` : 'All Years';
  }
};

/**
 * Resolves the accurate marks for a subquestion based on BEU examination conventions:
 * 1. Explicit sub.marks if present
 * 2. Question 1 in BEU is ALWAYS compulsory 2-mark questions (MCQs or short answer)
 * 3. MCQs (with multiple choice options) are 2 Marks
 * 4. Question 2 through 9 parent marks (typically "[14]" or "14", or breakdown like "[7+7=14]"):
 *    - If breakdown like "[7+7=14]" or "[6+8=14]" -> index-based marks
 *    - If parent title says "short notes on any four" -> 14/4 = 3.5 Marks
 *    - If 2 subquestions: 14/2 = 7 Marks
 *    - If 1 subquestion: 14 Marks
 *    - If 3 subquestions: 5 Marks
 * 5. Questions 2-9 MUST NEVER mistakenly resolve to 2 Marks!
 */
export function resolveSubQuestionMarks(
  questionNumber: number,
  subIndex: number,
  totalSubQuestions: number,
  subMarks?: string,
  parentMarks?: string,
  hasOptions?: boolean,
  parentTitle?: string
): string {
  // 1. Explicit sub.marks
  if (subMarks && subMarks.trim()) {
    const cleanSub = subMarks.trim();
    const numMatch = cleanSub.match(/\d+(\.\d+)?/);
    if (numMatch) {
      return `${numMatch[0]} Marks`;
    }
  }

  // 2. Question 1 or MCQs with options are ALWAYS 2 marks
  if (questionNumber === 1 || hasOptions) {
    return '2 Marks';
  }

  // 3. Parent title check for short note choices, e.g. "short notes on any four"
  if (parentTitle && /any\s+four/i.test(parentTitle)) {
    return '3.5 Marks';
  }
  if (parentTitle && /any\s+three/i.test(parentTitle)) {
    return '4.5 Marks';
  }

  // 4. Parent marks parsing
  if (parentMarks && parentMarks.trim()) {
    const cleanParent = parentMarks.replace(/[\[\]]/g, '').trim();

    // Check addition splits like 7+7=14, 6+8=14, 4+4+6=14
    const sumPart = cleanParent.includes('=') ? cleanParent.split('=')[0] : cleanParent;
    if (sumPart.includes('+')) {
      const parts = sumPart
        .split('+')
        .map(p => parseFloat(p.trim()))
        .filter(n => !isNaN(n));
      if (parts.length > subIndex && parts[subIndex] !== undefined) {
        return `${parts[subIndex]} Marks`;
      }
    }

    // Check Q1 pattern like 2x7=14 or 2*7
    if (/2\s*[x*×]\s*7/i.test(cleanParent)) {
      return '2 Marks';
    }

    // Match total marks number like "14"
    const totalMatch = cleanParent.match(/\b(\d+)\b/);
    if (totalMatch) {
      const total = parseInt(totalMatch[1], 10);
      if (totalSubQuestions > 0) {
        // e.g. 14 / 2 = 7 Marks, 14 / 1 = 14 Marks
        const perSub = Math.round(total / totalSubQuestions);
        return `${perSub} Marks`;
      }
      return `${total} Marks`;
    }
  }

  // 5. Questions 2-9 standard fallback: single subquestion is 14 marks, otherwise 7 marks
  return totalSubQuestions === 1 ? '14 Marks' : '7 Marks';
}

export function resolveSubQuestionMarksNum(
  questionNumber: number,
  subIndex: number,
  totalSubQuestions: number,
  subMarks?: string,
  parentMarks?: string,
  hasOptions?: boolean,
  parentTitle?: string
): number {
  const str = resolveSubQuestionMarks(
    questionNumber,
    subIndex,
    totalSubQuestions,
    subMarks,
    parentMarks,
    hasOptions,
    parentTitle
  );
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : (questionNumber === 1 || hasOptions ? 2 : 7);
}
