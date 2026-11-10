import curriculumData from '../data/beuCurriculum.json';

export interface BranchPrefixInfo {
  prefix: string;
  name: string;
  shortCode: string;
  category: 'core' | 'specialization' | 'emerging' | 'common';
}

export interface CycleSubject {
  code_sem1?: string;
  code_sem2?: string;
  code?: string;
  sem?: number;
  name: string;
  branch?: string;
}

export interface BranchSubject {
  code: string;
  name: string;
  pyq_alias?: string;
  isRevised?: boolean;
}

export type MajorBranchKey = 'ALL' | 'COMMON' | 'CSE' | 'CE' | 'ME' | 'EE' | 'ECE' | 'IT' | 'EEE';

export interface MajorBranchMeta {
  key: MajorBranchKey;
  label: string;
  shortName: string;
  prefix: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const MAJOR_BRANCHES: MajorBranchMeta[] = [
  {
    key: 'COMMON',
    label: '1st Year Foundation',
    shortName: 'Common',
    prefix: '100',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800/80'
  },
  {
    key: 'CSE',
    label: 'Computer Science & Engg (CSE)',
    shortName: 'CSE',
    prefix: '105',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    badgeBorder: 'border-cyan-200 dark:border-cyan-800/80'
  },
  {
    key: 'CE',
    label: 'Civil Engineering (CE)',
    shortName: 'Civil',
    prefix: '101',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/80'
  },
  {
    key: 'ME',
    label: 'Mechanical Engineering (ME)',
    shortName: 'Mechanical',
    prefix: '102',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/80'
  },
  {
    key: 'EE',
    label: 'Electrical Engineering (EE)',
    shortName: 'Electrical',
    prefix: '103',
    badgeBg: 'bg-yellow-50 dark:bg-yellow-950/60',
    badgeText: 'text-yellow-700 dark:text-yellow-300',
    badgeBorder: 'border-yellow-200 dark:border-yellow-800/80'
  },
  {
    key: 'ECE',
    label: 'Electronics & Communication (ECE)',
    shortName: 'ECE',
    prefix: '104',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800/80'
  },
  {
    key: 'IT',
    label: 'Information Technology (IT)',
    shortName: 'IT',
    prefix: '106',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/80'
  },
  {
    key: 'EEE',
    label: 'Electrical & Electronics (EEE)',
    shortName: 'EEE',
    prefix: '110',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/80'
  }
];

// Heuristic subject mapping for subjects that may use common or legacy codes
const SUBJECT_TO_BRANCH_MAP: Record<string, MajorBranchKey> = {
  // CSE
  dsa: 'CSE',
  os: 'CSE',
  dbms: 'CSE',
  coa: 'CSE',
  daa: 'CSE',
  cd: 'CSE',
  ai: 'CSE',
  ml: 'CSE',
  cn: 'CSE',
  se: 'CSE',
  cns: 'CSE',
  discrete: 'CSE',
  java: 'CSE',
  cpp: 'CSE',
  formal: 'CSE',

  // Civil
  survey: 'CE',
  geotech1: 'CE',
  geotech2: 'CE',
  solid: 'CE',
  mom: 'CE',
  structure: 'CE',
  doss: 'CE',
  trans: 'CE',
  env1: 'CE',
  env2: 'CE',
  hydraulic: 'CE',
  hydro: 'CE',
  geology: 'CE',
  cem: 'CE',
  mte: 'CE',
  disaster: 'CE',
  cons: 'CE',
  mech: 'CE',

  // Mechanical
  thermo: 'ME',
  som: 'ME',
  fluid: 'ME',
  flmach: 'ME',
  heat: 'ME',
  kom: 'ME',
  dom: 'ME',
  dome: 'ME',
  mantech: 'ME',
  mats: 'ME',
  instrumentation: 'ME',
  automan: 'ME',
  eme: 'ME',

  // Electrical
  bee: 'COMMON',
  power1: 'EE',
  power2: 'EE',
  pe: 'EE',
  emachines1: 'EE',
  emachines2: 'EE',
  emft: 'EE',
  signals: 'EE',
  eca: 'EE',
  micro: 'EE',
  mains: 'EEE',

  // ECE
  electronics: 'ECE',
  analog: 'ECE',
  digicom: 'ECE',
  anacom: 'ECE',
  adcom: 'ECE',
  digc: 'ECE',
  de: 'ECE',
  dsp: 'ECE',
  emth: 'ECE',
  lint: 'ECE',
  mam: 'ECE',
  network: 'ECE',
  semi: 'ECE',
  eim: 'ECE',

  // Common / 1st Year
  phy: 'COMMON',
  che: 'COMMON',
  math1: 'COMMON',
  math2: 'COMMON',
  math3: 'COMMON',
  pps: 'COMMON',
  wp: 'COMMON',
  eng: 'COMMON',
  egd: 'COMMON',
  be: 'COMMON',
  pp: 'COMMON',
  iwd: 'COMMON',
  itw: 'COMMON',
  human: 'COMMON',
  psd: 'COMMON',
  cs: 'COMMON',
  bio: 'COMMON',
  ath: 'COMMON',
  impact: 'COMMON'
};

// Bidirectional PYQ alias mappings
const REVISED_TO_PYQ_ALIAS: Record<string, { pyqCode: string; name: string; branch: MajorBranchKey }> = {
  // CSE
  '105301': { pyqCode: '100403', name: 'Digital Electronics', branch: 'CSE' },
  '105302': { pyqCode: '100304', name: 'Data Structure and Algorithms', branch: 'CSE' },
  '105303': { pyqCode: '105606', name: 'Object Oriented Programming using JAVA', branch: 'CSE' },
  '105304': { pyqCode: '100404', name: 'Discrete Mathematics and Graph Theory', branch: 'CSE' },
  '105305': { pyqCode: '105403', name: 'Operating Systems', branch: 'CSE' },

  // CE
  '101301': { pyqCode: '101405', name: 'Solid Mechanics', branch: 'CE' },
  '101302': { pyqCode: '100312', name: 'Engineering Mathematics-III (PDE, Prob/Stat)', branch: 'CE' },
  '101304': { pyqCode: '101308', name: 'Surveying and Geomatics', branch: 'CE' },
  '101305': { pyqCode: '101404', name: 'Fluid Mechanics', branch: 'CE' },
  '101306': { pyqCode: '101406', name: 'Materials, Testing & Evaluation', branch: 'CE' },

  // ME
  '102301': { pyqCode: '100309', name: 'Engineering Mechanics', branch: 'ME' },
  '102302': { pyqCode: '102402', name: 'Material Science and Engineering', branch: 'ME' },
  '102303': { pyqCode: '100312', name: 'Engineering Mathematics-III (PDE, Prob/Stat)', branch: 'ME' },
  '102305': { pyqCode: '100303', name: 'Basic Electronics Engineering', branch: 'ME' },

  // EE
  '103301': { pyqCode: '100306', name: 'Electrical Circuit Analysis', branch: 'EE' },
  '103302': { pyqCode: '100302', name: 'Analog Electronics', branch: 'EE' },
  '103303': { pyqCode: '100307', name: 'Electrical Machine-I', branch: 'EE' },
  '103304': { pyqCode: '103403', name: 'Engineering Mathematics-III (PDE, Prob/Stat)', branch: 'EE' },
  '103305': { pyqCode: '100310', name: 'Engineering Mechanics', branch: 'EE' },

  // ECE
  '104304': { pyqCode: '104305', name: 'Signal & System', branch: 'ECE' },
  '104305': { pyqCode: '104303', name: 'Engineering Mathematics-III (PDE, Prob/Stat)', branch: 'ECE' }
};

// Reverse map: PYQ legacy code -> Revised code
const PYQ_TO_REVISED_MAP: Record<string, { revisedCode: string; name: string; branch: MajorBranchKey }> = {};
Object.entries(REVISED_TO_PYQ_ALIAS).forEach(([revisedCode, info]) => {
  PYQ_TO_REVISED_MAP[info.pyqCode] = {
    revisedCode,
    name: info.name,
    branch: info.branch
  };
});

export const curriculumService = {
  /**
   * Return complete curriculum JSON
   */
  getRawCurriculum() {
    return curriculumData;
  },

  /**
   * Return all 30 BEU branch prefixes mapped by prefix string
   */
  getBranchPrefixes(): Record<string, string> {
    return (curriculumData as any).branch_code_prefixes || {};
  },

  /**
   * Return list of 30 prefixes with parsed shortcode and category
   */
  getBranchPrefixList(): BranchPrefixInfo[] {
    const prefixes = this.getBranchPrefixes();
    return Object.entries(prefixes).map(([prefix, fullName]) => {
      let shortCode = prefix;
      const match = fullName.match(/\(([^)]+)\)/);
      if (match) shortCode = match[1];

      let category: BranchPrefixInfo['category'] = 'core';
      const num = parseInt(prefix, 10);
      if (num === 100) category = 'common';
      else if (num >= 151 && num <= 157) category = 'specialization';
      else if (num >= 159) category = 'emerging';

      return {
        prefix,
        name: fullName,
        shortCode,
        category
      };
    });
  },

  /**
   * Decode branch from exam code or subject code
   */
  detectBranch(examCode?: string, subjectCode?: string): MajorBranchKey {
    if (examCode) {
      const code = examCode.trim().toUpperCase();

      // Specific branch abbreviations in code (e.g. PCC-CE-206, ME-201, EC-102, PCC-IT-302)
      if (code.includes('-CE-') || code.startsWith('CE-')) return 'CE';
      if (code.includes('-ME-') || code.startsWith('ME-')) return 'ME';
      if (code.includes('-IT-') || code.startsWith('IT-')) return 'IT';
      if (code.includes('-EEE-')) return 'EEE';
      if (code.includes('-EE-') || code.startsWith('EE-')) return 'EE';
      if (code.includes('-EC-') || code.startsWith('EC-')) return 'ECE';
      if (code.includes('-CS-') || code.startsWith('CS-')) return 'CSE';

      // Standard 3-digit prefixes
      if (code.startsWith('105') || code.startsWith('051') || code.startsWith('151') || code.startsWith('152') || code.startsWith('153') || code.startsWith('157')) return 'CSE';
      if (code.startsWith('101') || code.startsWith('011')) return 'CE';
      if (code.startsWith('102') || code.startsWith('021')) return 'ME';
      if (code.startsWith('103') || code.startsWith('031')) return 'EE';
      if (code.startsWith('104')) return 'ECE';
      if (code.startsWith('106')) return 'IT';
      if (code.startsWith('110')) return 'EEE';

      // 100 prefix: In 1st year (code 1001xx or 1002xx), it is Common Foundation
      if (code.startsWith('100')) {
        const semDigit = code.length >= 4 ? code[3] : '';
        if (semDigit === '1' || semDigit === '2') {
          return 'COMMON';
        }
        // If higher semester (sem 3, 4, etc.), map by subject
        if (subjectCode && SUBJECT_TO_BRANCH_MAP[subjectCode.toLowerCase()]) {
          return SUBJECT_TO_BRANCH_MAP[subjectCode.toLowerCase()];
        }
        return 'COMMON';
      }

      if (code.startsWith('211') || code.startsWith('ESC') || code.startsWith('BSC')) {
        if (subjectCode && SUBJECT_TO_BRANCH_MAP[subjectCode.toLowerCase()]) {
          return SUBJECT_TO_BRANCH_MAP[subjectCode.toLowerCase()];
        }
        return 'COMMON';
      }
    }

    if (subjectCode) {
      const mapped = SUBJECT_TO_BRANCH_MAP[subjectCode.toLowerCase()];
      if (mapped) return mapped;
    }

    return 'COMMON';
  },

  /**
   * Return metadata for a major branch key
   */
  getMajorBranchMeta(key?: string): MajorBranchMeta {
    if (!key) return MAJOR_BRANCHES[0];
    const upper = key.toUpperCase();
    return (
      MAJOR_BRANCHES.find(b => b.key === upper) || {
        key: 'COMMON',
        label: 'Foundation',
        shortName: 'Common',
        prefix: '100',
        badgeBg: 'bg-slate-100 dark:bg-slate-800',
        badgeText: 'text-slate-600 dark:text-slate-400',
        badgeBorder: 'border-slate-200 dark:border-slate-700'
      }
    );
  },

  /**
   * Year 1 curriculum info: Group A, Group B, Physics Cycle, Chemistry Cycle
   */
  getYear1Curriculum() {
    return (curriculumData as any).years.year_1;
  },

  /**
   * Return official syllabus subjects for a branch and year
   */
  getBranchSyllabusForYear(branch: 'CSE' | 'CE' | 'ME' | 'EE' | 'ECE', yearNum: number): BranchSubject[] {
    const branchData = (curriculumData as any).years?.branches?.[branch];
    if (!branchData) return [];

    const yearKey = `year_${yearNum}`;
    const yearObj = branchData[yearKey];
    if (!yearObj) return [];

    const subjects: BranchSubject[] = [];

    // Semesters in this year
    Object.entries(yearObj).forEach(([semKey, list]) => {
      if (Array.isArray(list)) {
        const isRevised = semKey.includes('revised');
        list.forEach((item: any) => {
          subjects.push({
            code: item.code,
            name: item.name,
            pyq_alias: item.pyq_alias,
            isRevised
          });
        });
      }
    });

    return subjects;
  },

  /**
   * Given a revised course code (e.g. 105301), return legacy PYQ alias code
   */
  resolvePyqAlias(revisedCode: string) {
    return REVISED_TO_PYQ_ALIAS[revisedCode.trim()] || null;
  },

  /**
   * Given a legacy PYQ exam code (e.g. 100403), return revised 2024–2026 syllabus code
   */
  getRevisedSyllabusInfo(pyqCode: string) {
    return PYQ_TO_REVISED_MAP[pyqCode.trim()] || null;
  }
};
