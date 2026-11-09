import React from 'react';

interface SearchHighlightProps {
  text: string;
  query: string;
  className?: string;
}

export const SearchHighlight: React.FC<SearchHighlightProps> = ({ text, query, className = '' }) => {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const trimmedQuery = query.trim();
  const escaped = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 rounded px-1 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};
