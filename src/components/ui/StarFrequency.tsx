import React from 'react';
import { Flame, Star } from 'lucide-react';

interface StarFrequencyProps {
  freq: number;
  stars?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const StarFrequency: React.FC<StarFrequencyProps> = ({
  freq,
  stars,
  showLabel = false,
  size = 'sm'
}) => {
  if (!freq || freq <= 1) return null;

  // Color mapping based on original reference repo semantics
  let badgeColor = '';
  let label = '';
  let isSuperHot = false;

  if (freq >= 6) {
    badgeColor = 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30';
    label = 'Super Repeat';
    isSuperHot = true;
  } else if (freq === 5) {
    badgeColor = 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30';
    label = 'Very High Yield';
  } else if (freq === 4) {
    badgeColor = 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/30';
    label = 'High Yield';
  } else if (freq === 3) {
    badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    label = 'Repeated 3x';
  } else if (freq === 2) {
    badgeColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
    label = 'Repeated 2x';
  }

  const starString = stars || '★'.repeat(Math.min(freq, 5));

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border px-2 py-0.5 select-none transition-all ${
        size === 'sm' ? 'text-[11px]' : 'text-xs px-2.5 py-1'
      } ${badgeColor}`}
      title={`Repeated ${freq} times across BEU question papers (${label})`}
    >
      {isSuperHot ? (
        <Flame className="w-3.5 h-3.5 fill-rose-500/30 shrink-0" />
      ) : (
        <Star className="w-3 h-3 fill-current shrink-0" />
      )}
      <span className="tracking-tighter font-mono">{starString}</span>
      <span className="text-[10px] opacity-90 font-medium">({freq}x)</span>
      {showLabel && <span className="ml-0.5 opacity-80 font-normal">· {label}</span>}
    </span>
  );
};
