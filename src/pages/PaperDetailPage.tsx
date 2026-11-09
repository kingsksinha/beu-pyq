import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Check, 
  Copy, 
  FileText, 
  HelpCircle, 
  PlayCircle, 
  Printer 
} from 'lucide-react';
import { PaperHeader } from '../components/paper/PaperHeader';
import { QuestionItem } from '../components/paper/QuestionItem';
import { dataService } from '../services/dataService';
import { storageService } from '../services/storageService';
import type { PaperCatalogItem, PaperDetail } from '../types/paper';

export const PaperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paper, setPaper] = useState<PaperDetail | null>(null);
  const [relatedPapers, setRelatedPapers] = useState<PaperCatalogItem[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    dataService.getPaperDetail(id).then(data => {
      if (!data) {
        setLoading(false);
        return;
      }
      setPaper(data);
      setIsBookmarked(storageService.isPaperBookmarked(data.id));

      // Record to history
      storageService.addHistory({
        paperId: data.id,
        subject_code: data.subject_code,
        subject_name: data.subject_name,
        semester: data.semester,
        year: data.year,
        exam_code: data.exam_code
      });

      // Find related papers (same subject other years, or same semester)
      dataService.getCatalog().then(catalog => {
        const related = catalog
          .filter(p => p.id !== data.id && (p.subject_code === data.subject_code || p.semester === data.semester))
          .sort((a, b) => {
            // prioritize same subject
            if (a.subject_code === data.subject_code && b.subject_code !== data.subject_code) return -1;
            if (b.subject_code === data.subject_code && a.subject_code !== data.subject_code) return 1;
            return parseInt(b.year, 10) - parseInt(a.year, 10);
          })
          .slice(0, 4);
        setRelatedPapers(related);
        setLoading(false);
      });
    });
  }, [id]);

  const handleBookmarkToggle = () => {
    if (!paper) return;
    const added = storageService.togglePaperBookmark({
      paperId: paper.id,
      title: `${paper.subject_name} (${paper.year})`,
      subject_code: paper.subject_code,
      subject_name: paper.subject_name,
      semester: paper.semester,
      year: paper.year,
      exam_code: paper.exam_code
    });
    setIsBookmarked(added);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="py-20 text-center space-y-4">
        <FileText className="w-12 h-12 mx-auto text-zinc-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Question Paper Not Found</h2>
        <p className="text-sm text-zinc-500">The requested paper ID does not exist in the archive.</p>
        <button
          onClick={() => navigate('/papers')}
          className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold"
        >
          Back to All Papers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Printable Area Wrapper */}
      <div id="printable-paper" className="space-y-6">
        {/* Navigation Breadcrumb & Actions Bar (Hidden during print) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Practice Mode Button */}
            <Link
              to={`/practice/${paper.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-xs transition"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Practice Mode</span>
            </Link>

            {/* Print / Download PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition"
              title="Print or Save as A4 PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / A4 PDF</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition ${
                isBookmarked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark paper'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Copy shareable link */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
              title="Copy shareable link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dedicated Print Top Header */}
        <div className="print:flex hidden items-center justify-between text-[9pt] font-semibold text-black pb-2 mb-3 border-b border-black">
          <span>Bihar Engineering University Examination Archive</span>
          <span>By Love By FBi ❤️</span>
        </div>

        {/* Paper Main Header */}
        <PaperHeader paper={paper} />

        {/* Paper Instructions */}
        {paper.instructions && paper.instructions.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
              <span>Official Examination Instructions</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pl-1">
              {paper.instructions.map((inst, idx) => (
                <li key={idx} className="marker:font-semibold marker:text-zinc-400">
                  {inst}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Question Blocks List */}
        <div className="space-y-6">
          {paper.questions.map(q => (
            <QuestionItem
              key={q.id}
              question={q}
              paperId={paper.id}
              paperInfo={{
                subject_code: paper.subject_code,
                subject_name: paper.subject_name,
                semester: paper.semester,
                year: paper.year,
                exam_code: paper.exam_code
              }}
            />
          ))}
        </div>

        {/* Printable & Screen Archive Stamp with "By Love By FBi" */}
        <div className="print-fbi-footer mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Bihar Engineering University (BEU) PYQ Archive</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-zinc-400">Code: {paper.exam_code}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
            <span>By Love By FBi</span>
            <span className="text-rose-500">❤️</span>
          </div>
        </div>
      </div>

      {/* Related Papers Section (Hidden in Print) */}
      {relatedPapers.length > 0 && (
        <div className="print:hidden pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Related Question Papers
            </h3>
            <Link
              to={`/papers?subject=${paper.subject_code}`}
              className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              View all {paper.subject_name} papers
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {relatedPapers.map(rel => (
              <Link
                key={rel.id}
                to={`/paper/${rel.id}`}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 transition block shadow-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1">
                  <span>Sem {rel.semester}</span>
                  <span>{rel.year}</span>
                </div>
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                  {rel.subject_name}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Code: {rel.exam_code} · {rel.question_count} Qs
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
