import { useState } from 'react';
import {
  LayoutDashboard, Award, Briefcase, TrendingUp,
  Clock, BadgeCheck, ShieldCheck, User, LogOut, X, Menu, Moon, Sun, Activity,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { ReactNode } from 'react';

export type TraineePageKey = 'dashboard' | 'profile' | 'privacy' | 'passport';

interface NavItem {
  key: TraineePageKey;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: 'profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
  { key: 'passport', label: 'Skill Passport', icon: <BadgeCheck className="h-5 w-5" /> },
  { key: 'privacy', label: 'Consent & Privacy', icon: <ShieldCheck className="h-5 w-5" /> },
];

interface TraineeSidebarProps {
  currentPage: TraineePageKey;
  onNavigate: (page: TraineePageKey) => void;
  onLogout: () => void;
  traineeName: string;
}

export function TraineeSidebar({ currentPage, onNavigate, onLogout, traineeName }: TraineeSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const sidebar = (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">SkillPulse</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Trainee Portal</p>
        </div>
        <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User info */}
      <div className="border-b border-gray-200 px-5 py-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
            {traineeName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{traineeName}</p>
            <p className="text-xs text-gray-400">Trainee</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              currentPage === item.key
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="border-t border-gray-200 px-3 py-3 dark:border-gray-800">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 px-3 py-3 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-900 lg:hidden"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <aside className="fixed left-0 top-0 z-50 h-full w-64 lg:hidden">
          {sidebar}
        </aside>
      )}
    </>
  );
}
