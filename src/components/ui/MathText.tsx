import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '', inline = false }) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';

    // Normalize any double-escaped math delimiters
    const normalized = text.replace(/\\\\([()[\]])/g, '\\$1');

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
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return <span key={index} className="my-2 block overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 3) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return <span key={index} className="my-2 block overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      // Check for inline math
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return <span key={index} className="inline-block mx-0.5 align-baseline" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <code key={index} className="px-1 py-0.5 text-xs bg-muted rounded font-mono">{part}</code>;
        }
      }

      if (part.startsWith('$') && part.endsWith('$') && part.length > 2 && !part.slice(1, -1).includes('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
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
