import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Bookmark, 
  Calendar, 
  Clock, 
  Compass, 
  Flame, 
  Home, 
  Layers, 
  Library, 
  Moon, 
  Sun 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AppLogo } from '../ui/AppLogo';

interface SidebarProps {
  onOpenLegend: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenLegend }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Dashboard', icon: Home, to: '/' },
    { label: 'All Question Papers', icon: Compass, to: '/papers' },
    { label: 'B.Tech Years', icon: Layers, to: '/semesters' },
    { label: 'Subjects', icon: Library, to: '/subjects' },
    { label: 'Exam Sessions', icon: Calendar, to: '/years' },
    { label: 'Bookmarks', icon: Bookmark, to: '/bookmarks' },
    { label: 'Recently Viewed', icon: Clock, to: '/history' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800/80">
        <AppLogo size="md" />
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-50/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/60 dark:border-slate-700 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Legend trigger button */}
        <div className="pt-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Study Tools
          </div>
          <button
            onClick={onOpenLegend}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <Flame className="w-4 h-4 shrink-0 fill-rose-500/30" />
            <span>Star Rating Guide</span>
          </button>
        </div>
      </div>

      {/* Footer & Theme Toggle */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <span className="flex items-center gap-2.5">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="text-slate-800 dark:text-slate-200">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {theme}
          </span>
        </button>

        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border border-indigo-500/20 text-center space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            363 Papers · Sem 1–4 · 2012–25
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Crafted with</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent font-extrabold">By FBi</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
