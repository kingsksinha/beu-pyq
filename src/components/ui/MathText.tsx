import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * Safely decodes HTML entities commonly found in scraped exam datasets
 */
const decodeHtmlEntities = (raw: string): string => {
  return raw
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
};

/**
 * Robustly renders LaTeX math with graceful resilience against common OCR/dataset quirks
 */
const renderKatexSafe = (math: string, displayMode: boolean): string => {
  try {
    return katex.renderToString(math, { displayMode, throwOnError: true });
  } catch {
    // If strict fails, normalize common quirks:
    let fixed = math;
    // Fix unescaped isolated & outside matrix/cases/array environments
    if (!fixed.includes('\\begin{')) {
      fixed = fixed.replace(/(?<!\\)&/g, '\\&');
    }
    // Fix double-escaped or missing braces in superscripts like ^\circ -> ^{\circ}
    fixed = fixed.replace(/\^\\([a-zA-Z]+)/g, '^{\\$1}');

    try {
      return katex.renderToString(fixed, { displayMode, throwOnError: true });
    } catch {
      // Fallback with throwOnError: false
      return katex.renderToString(fixed, { displayMode, throwOnError: false });
    }
  }
};

export const MathText: React.FC<MathTextProps> = ({ text, className = '', inline = false }) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';

    // 1. Decode HTML entities (e.g. &gt; -> >, &lt; -> <, &amp; -> &)
    const decoded = decodeHtmlEntities(text);

    // 2. Normalize any double-escaped math delimiters
    const normalized = decoded.replace(/\\\\([()[\]])/g, '\\$1');

    // Regex to detect math delimiters:
    // Block: \[ ... \] or $$ ... $$
    // Inline: \( ... \) or $ ... $
    const mathRegex = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\$[^\$\n]+?\$)/g;

    const parts = normalized.split(mathRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Check for block math
      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = renderKatexSafe(math, true);
          return <span key={index} className="my-2 block overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
        const math = part.slice(2, -2).trim();
        try {
          const html = renderKatexSafe(math, true);
          return <span key={index} className="my-2 block overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      // Check for inline math
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = renderKatexSafe(math, false);
          return <span key={index} className="inline-block mx-0.5 align-baseline" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      if (part.startsWith('$') && part.endsWith('$') && part.length > 2 && !part.slice(1, -1).includes('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = renderKatexSafe(math, false);
          return <span key={index} className="inline-block mx-0.5 align-baseline" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      // Plain text
      return <span key={index}>{part}</span>;
    });
  }, [text]);

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag className={`leading-relaxed text-slate-800 dark:text-slate-200 break-words ${className}`}>
      {renderedContent}
    </Tag>
  );
};
