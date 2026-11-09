import React from 'react';
import { Link } from 'react-router-dom';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  clickable?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  clickable = true
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
  const subTextSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  const content = (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Premium Modern Vector Icon Emblem */}
      <div className={`relative ${iconSize} shrink-0 rounded-xl p-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition duration-300`}>
        <div className="w-full h-full bg-slate-950 dark:bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-pink-500/20 opacity-80" />
          
          {/* Vector SVG Crest */}
          <svg
            className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-300 relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Academic Cap & Shield Fusion */}
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
            {/* Sparkle Node */}
            <circle cx="12" cy="5" r="1" fill="#818cf8" stroke="none" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textSize}`}>
            BEU
          </span>
          <span className={`font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ${textSize}`}>
            PYQ
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-bold border border-indigo-500/20">
            PRO
          </span>
        </div>

        {showSubtitle && (
          <p className={`${subTextSize} font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1`}>
            <span>Academic Portal</span>
            <span>•</span>
            <span className="text-indigo-500 dark:text-indigo-400 font-extrabold">By FBi</span>
          </p>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block" title="BEU PYQ - Academic Portal By FBi">
        {content}
      </Link>
    );
  }

  return content;
};
