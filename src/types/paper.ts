export interface SubQuestion {
  id: string;
  subNumber: string; // 'a', 'b', 'c', etc.
  text: string;
  freq: number;
  stars?: string;
  options?: string[]; // MCQs choices
  images?: string[];
}

export interface Question {
  id: string;
  number: number;
  title: string;
  marks?: string;
  subQuestions: SubQuestion[];
}

export interface PaperDetail {
  id: string;
  semester: number;
  subject_code: string;
  subject_name: string;
  year: string;
  exam_code: string;
  duration: string;
  full_marks: string;
  title: string;
  question_count: number;
  total_subquestions: number;
  max_freq: number;
  has_mcq: boolean;
  instructions: string[];
  questions: Question[];
}

export interface PaperCatalogItem {
  id: string;
  semester: number;
  subject_code: string;
  subject_name: string;
  year: string;
  exam_code: string;
  duration: string;
  full_marks: string;
  question_count: number;
  total_subquestions: number;
  max_freq: number;
  has_mcq: boolean;
  title: string;
  branch?: string;
}

export interface SubjectItem {
  code: string;
  name: string;
  semesters: number[];
  years: string[];
  paperCount: number;
  totalSubquestions: number;
  maxFreq: number;
  branch?: string;
  branches?: string[];
  filteredPaperCount?: number;
}

export interface PlatformStats {
  totalPapers: number;
  totalSubjects: number;
  totalSemesters: number;
  totalSubQuestions: number;
  totalQuestions: number;
  semesterDistribution: Record<string, number>;
  yearDistribution: Record<string, number>;
  topSubjects: SubjectItem[];
}

export type SortMode = 
  | 'newest'
  | 'oldest'
  | 'subject-az'
  | 'subject-za'
  | 'semester-asc'
  | 'semester-desc'
  | 'year-asc'
  | 'year-desc'
  | 'questions-desc'
  | 'questions-asc';

export interface FilterState {
  semester: string; // 'ALL' or '1', '2', '3', '4'
  subject: string;  // 'ALL' or subject_code
  branch?: string;   // 'ALL' or 'COMMON' | 'CSE' | 'CE' | 'ME' | 'EE' | 'ECE' | 'IT' | 'EEE'
  year: string;     // 'ALL' or year e.g. '2024'
  examCode: string; // keyword match on exam code
  query: string;    // text search query
  sort: SortMode;
  hasMcqOnly?: boolean;
  highFreqOnly?: boolean;
}

export interface BookmarkItem {
  id: string;
  paperId: string;
  type: 'paper' | 'question';
  title: string;
  subject_code: string;
  subject_name: string;
  semester: number;
  year: string;
  exam_code: string;
  questionId?: string;
  questionNumber?: number;
  questionText?: string;
  savedAt: number;
}

export interface HistoryItem {
  paperId: string;
  subject_code: string;
  subject_name: string;
  semester: number;
  year: string;
  exam_code: string;
  viewedAt: number;
}
