import katex from 'katex';
import type { PaperDetail } from '../types/paper';
import { formatBTechYear } from './formatters';

/**
 * Normalizes and converts raw math text containing LaTeX math delimiters
 * (\( ... \), $ ... $, \[ ... \], $$ ... $$) into pre-rendered KaTeX HTML.
 */
function renderMathHtml(text: string): string {
  if (!text) return '';

  // Normalize any double-escaped math delimiters from JSON strings
  const normalized = text.replace(/\\\\([()[\]])/g, '\\$1');

  // Regex to detect math delimiters:
  // Block math: \[ ... \] or $$ ... $$
  // Inline math: \( ... \) or $ ... $
  const mathRegex = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\$[^\$\n]+?\$)/g;

  const parts = normalized.split(mathRegex);

  return parts
    .map(part => {
      if (!part) return '';

      // Block math: \[ ... \]
      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const math = part.slice(2, -2).trim();
        try {
          return `<div class="math-block">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`;
        } catch {
          return `<div class="math-block"><code>${escapeHtml(part)}</code></div>`;
        }
      }

      // Block math: $$ ... $$
      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
        const math = part.slice(2, -2).trim();
        try {
          return `<div class="math-block">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`;
        } catch {
          return `<div class="math-block"><code>${escapeHtml(part)}</code></div>`;
        }
      }

      // Inline math: \( ... \)
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2).trim();
        try {
          return katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch {
          return `<code>${escapeHtml(part)}</code>`;
        }
      }

      // Inline math: $ ... $
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2 && !part.slice(1, -1).includes('$')) {
        const math = part.slice(1, -1).trim();
        try {
          return katex.renderToString(math, { displayMode: false, throwOnError: false });
        } catch {
          return `<code>${escapeHtml(part)}</code>`;
        }
      }

      // Plain text: escape HTML entities
      return escapeHtml(part);
    })
    .join('');
}

/**
 * Generates and triggers download of a self-contained, offline-ready,
 * fully styled printable HTML document for a BEU Question Paper.
 */
export const downloadPaperOfflineHtml = (paper: PaperDetail) => {
  const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitizeFilename(paper.subject_name)}_${paper.year}_BEU_PYQ.html`;

  const questionsHtml = paper.questions
    .map(q => {
      const subQuestionsHtml = (q.subQuestions || [])
        .map((sub, i) => {
          const subLabel = (sub.subNumber || String.fromCharCode(97 + i)).trim();
          const escapedLabel = subLabel.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const cleanSubText = (sub.text || '').replace(
            new RegExp(`^(?:\\(\\s*${escapedLabel}\\s*\\)|${escapedLabel}\\)|${escapedLabel}\\.)\\s+`, 'i'),
            ''
          ).trim();

          const optionsHtml =
            sub.options && sub.options.length > 0
              ? `<div class="mcq-grid">
                  ${sub.options
                    .map((opt, optIndex) => {
                      const letter = String.fromCharCode(97 + optIndex);
                      return `<div class="mcq-option"><span class="opt-key">(${letter})</span> <span class="opt-text">${renderMathHtml(opt)}</span></div>`;
                    })
                    .join('')}
                </div>`
              : '';

          const freqBadge =
            sub.freq > 1
              ? `<span class="freq-badge">★ ${sub.stars || 'Repeated'} (${sub.freq}x)</span>`
              : '';

          const diagramNote =
            sub.images && sub.images.length > 0
              ? `<div class="diagram-notice">📐 <strong>Diagram Referenced:</strong> Refer to official examination figure [${sub.images.join(', ')}]</div>`
              : '';

          return `
            <div class="sub-question">
              <div class="sub-header">
                <span class="sub-label">(${subLabel})</span>
                ${freqBadge}
              </div>
              <div class="sub-text">${renderMathHtml(cleanSubText || sub.text)}</div>
              ${diagramNote}
              ${optionsHtml}
            </div>
          `;
        })
        .join('');

      const cleanTitle = (q.title || '').replace(/^(?:Q|Question)\.?\s*\d+[\s.:-]*/i, '').trim();

      return `
        <div class="question-card">
          <div class="question-header">
            <div class="q-title">
              <strong>Q.${q.number}</strong> ${cleanTitle ? renderMathHtml(cleanTitle) : renderMathHtml(q.title || '')}
            </div>
            ${q.marks ? `<div class="q-marks">${escapeHtml(q.marks)}</div>` : ''}
          </div>
          <div class="sub-list">
            ${subQuestionsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  const instructionsHtml = (paper.instructions || [])
    .map(inst => `<li>${escapeHtml(inst)}</li>`)
    .join('');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(paper.subject_name)} (${paper.year}) - BEU PYQ Vault</title>
  
  <!-- KaTeX CSS for High-Resolution Math Equations & Formulas -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">

  <style>
    :root {
      --primary: #4f46e5;
      --primary-light: #eef2ff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg: #f8fafc;
      --card-bg: #ffffff;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --text: #f1f5f9;
        --text-muted: #94a3b8;
        --border: #334155;
        --bg: #090d16;
        --card-bg: #0f172a;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.6;
      padding: 24px 16px;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vault-logo {
      font-size: 13px;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.02em;
    }
    .fbi-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(244, 63, 94, 0.1);
      color: #e11d48;
      border: 1px solid rgba(244, 63, 94, 0.25);
      padding: 2px 9px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .print-btn {
      background: var(--primary);
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }
    .print-btn:hover { opacity: 0.9; }
    .paper-banner {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    }
    .fbi-header-credit {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(79, 70, 229, 0.08);
      color: var(--primary);
      border: 1px solid rgba(79, 70, 229, 0.2);
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .univ-name {
      font-size: 13px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .subject-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .course-title {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      padding-top: 12px;
      border-top: 1px dashed var(--border);
    }
    .instructions-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .inst-title {
      font-size: 12px;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .instructions-card ol {
      padding-left: 20px;
      font-size: 13px;
      color: var(--text-muted);
    }
    .instructions-card li { margin-bottom: 4px; }
    .question-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
    }
    .q-title { font-size: 15px; font-weight: 700; }
    .q-marks {
      font-family: monospace;
      font-size: 13px;
      font-weight: 700;
      background: var(--bg);
      border: 1px solid var(--border);
      padding: 2px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }
    .sub-question {
      margin-bottom: 18px;
      padding-left: 8px;
    }
    .sub-question:last-child { margin-bottom: 0; }
    .sub-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .sub-label {
      font-family: monospace;
      font-weight: 700;
      color: var(--primary);
      font-size: 13px;
    }
    .freq-badge {
      font-size: 11px;
      font-weight: 700;
      color: #e11d48;
      background: rgba(225, 29, 72, 0.1);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .sub-text {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 10px;
    }
    .diagram-notice {
      background: var(--primary-light);
      color: var(--primary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .mcq-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-top: 8px;
    }
    @media (min-width: 600px) {
      .mcq-grid { grid-template-columns: 1fr 1fr; }
    }
    .mcq-option {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .opt-key { font-weight: 700; color: var(--primary); }
    .footer {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    
    /* KaTeX Offline Fallback & Typography */
    .katex {
      font-size: 1.08em;
      font-weight: normal;
      text-rendering: auto;
      direction: ltr;
      white-space: nowrap;
      text-indent: 0;
      line-height: 1.2;
      display: inline-block;
    }
    .katex-display {
      display: block;
      margin: 0.8em 0;
      text-align: center;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .math-block {
      margin: 10px 0;
      padding: 8px;
      overflow-x: auto;
      text-align: center;
      background: var(--bg);
      border-radius: 8px;
    }

    @media print {
      body { background: #ffffff !important; color: #000000 !important; padding: 0 !important; }
      .toolbar { display: none !important; }
      .container { max-width: 100% !important; margin: 0 !important; }
      .paper-banner, .instructions-card, .question-card {
        border: 1px solid #d4d4d8 !important;
        background: transparent !important;
        box-shadow: none !important;
        page-break-inside: avoid;
        margin-bottom: 12px !important;
      }
      .fbi-header-credit {
        border: 1px solid #4f46e5 !important;
        color: #4f46e5 !important;
        background: transparent !important;
      }
      .mcq-option { background: transparent !important; border: 1px solid #e4e4e7 !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="toolbar">
      <div class="toolbar-brand">
        <span class="vault-logo">BEU PYQ Vault - Offline Paper</span>
        <span class="fbi-pill">By Love By FBi ❤️</span>
      </div>
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <div class="paper-banner">
      <div class="fbi-header-credit">
        <span>Curated & Engineered with ❤️ by <strong>FBi</strong> • Official Student Archive</span>
      </div>
      <div class="univ-name">Bihar Engineering University, Patna</div>
      <h1 class="subject-title">${escapeHtml(paper.subject_name)}</h1>
      <div class="course-title">B.Tech ${formatBTechYear(paper.semester)} Examination, ${paper.year}</div>
      <div class="meta-row">
        <span>⏱️ Time: ${escapeHtml(paper.duration || '03 Hours')}</span>
        <span>🏷️ Exam Code: ${escapeHtml(paper.exam_code || 'N/A')}</span>
        <span>📊 Full Marks: ${escapeHtml(paper.full_marks || '70')}</span>
      </div>
    </div>

    ${
      paper.instructions && paper.instructions.length > 0
        ? `<div class="instructions-card">
            <div class="inst-title">Official Examination Instructions</div>
            <ol>${instructionsHtml}</ol>
          </div>`
        : ''
    }

    <div class="questions-container">
      ${questionsHtml}
    </div>

    <div class="footer">
      Bihar Engineering University Examination Archive &bull; Handcrafted with ❤️ by <strong>FBi</strong> &bull; For Academic Use Only
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
