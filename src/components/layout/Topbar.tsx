import React from 'react';
import { Flame, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AppLogo } from '../ui/AppLogo';

interface TopbarProps {
  onOpenSearch: () => void;
  onOpenLegend: () => void;
  onToggleMobileNav: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSearch,
  onOpenLegend,
  onToggleMobileNav
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Logo */}
        <div className="lg:hidden shrink-0">
          <AppLogo size="sm" showSubtitle={false} />
        </div>

        {/* Global Search trigger bar (Linear style) */}
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-xl transition shadow-2xs text-left"
        >
          <span className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="truncate text-zinc-500 dark:text-zinc-400">Search subjects, exam codes, question papers...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            <span>Ctrl</span><span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-4">
        {/* FBi Creator Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs">
          <span>By FBi</span>
          <span className="text-rose-500 animate-pulse">❤️</span>
        </div>

        <button
          onClick={onOpenLegend}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
          title="Question repeat rating guide"
        >
          <Flame className="w-3.5 h-3.5 fill-rose-500/30" />
          <span>Star Guide</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-zinc-300" /> : <Moon className="w-4 h-4 text-zinc-700" />}
        </button>
      </div>
    </header>
  );
};
