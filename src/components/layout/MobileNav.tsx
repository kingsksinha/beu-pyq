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
  Search, 
  X 
} from 'lucide-react';
import { AppLogo } from '../ui/AppLogo';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenLegend: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenLegend
}) => {
  const navItems = [
    { label: 'Dashboard', icon: Home, to: '/' },
    { label: 'All Question Papers', icon: Compass, to: '/papers' },
    { label: 'Semester-wise', icon: Layers, to: '/semesters' },
    { label: 'Subject-wise', icon: Library, to: '/subjects' },
    { label: 'Year Archive', icon: Calendar, to: '/years' },
    { label: 'Bookmarks', icon: Bookmark, to: '/bookmarks' },
    { label: 'Recently Viewed', icon: Clock, to: '/history' },
  ];

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={onClose}
        >
          {/* Drawer Content */}
          <div
            className="w-72 max-w-[85vw] h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-zinc-200 dark:border-zinc-800">
              <AppLogo size="sm" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto py-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="pt-4">
                <button
                  onClick={() => {
                    onClose();
                    onOpenLegend();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20"
                >
                  <Flame className="w-4 h-4 shrink-0 fill-rose-500/30" />
                  <span>Star Rating Guide</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 text-center space-y-0.5">
              <div>Bihar Engineering University PYQs</div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">By Love By FBi ❤️</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar (Mobile only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition ${
              isActive ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400 dark:text-zinc-500'
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/papers"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition ${
              isActive ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400 dark:text-zinc-500'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Papers</span>
        </NavLink>

        {/* Center Search Button (Monochrome Vercel style) */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center w-11 h-11 -mt-4 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md transition hover:scale-105 active:scale-95"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <NavLink
          to="/semesters"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition ${
              isActive ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400 dark:text-zinc-500'
            }`
          }
        >
          <Layers className="w-4 h-4" />
          <span>Semesters</span>
        </NavLink>

        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-medium transition ${
              isActive ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400 dark:text-zinc-500'
            }`
          }
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </NavLink>
      </nav>
    </>
  );
};
