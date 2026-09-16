import { useState } from 'react';
import {
  LayoutDashboard, Users, Target, Stethoscope, BrainCircuit,
  TrendingUp, AlertTriangle, Wrench, GraduationCap, Building2,
  MapPin, BadgeCheck, ShieldCheck, Menu, X, Moon, Sun, Activity,
  ClipboardList, Send, Server,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { ReactNode } from 'react';

export type PageKey =
  | 'overview' | 'trainees' | 'trainingdata' | 'outcomes' | 'autopsy' | 'skillgap'
  | 'retention' | 'earlywarning' | 'interventions' | 'nextcohort'
  | 'providers' | 'district' | 'passport' | 'privacy' | 'followups' | 'integrations';

interface NavItem {
  key: PageKey;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: 'trainees', label: 'Trainees', icon: <Users className="h-5 w-5" /> },
  { key: 'trainingdata', label: 'Training Data', icon: <ClipboardList className="h-5 w-5" /> },
  { key: 'outcomes', label: 'Outcomes', icon: <Target className="h-5 w-5" /> },
  { key: 'autopsy', label: 'Outcome Autopsy', icon: <Stethoscope className="h-5 w-5" /> },
  { key: 'skillgap', label: 'Skill Gap AI', icon: <BrainCircuit className="h-5 w-5" /> },
  { key: 'retention', label: 'Retention & Progression', icon: <TrendingUp className="h-5 w-5" /> },
  { key: 'earlywarning', label: 'Early Warning', icon: <AlertTriangle className="h-5 w-5" /> },
  { key: 'interventions', label: 'Interventions', icon: <Wrench className="h-5 w-5" /> },
  { key: 'nextcohort', label: 'Next-Cohort Learning', icon: <GraduationCap className="h-5 w-5" /> },
  { key: 'providers', label: 'Providers', icon: <Building2 className="h-5 w-5" /> },
  { key: 'district', label: 'District Intelligence', icon: <MapPin className="h-5 w-5" /> },
  { key: 'integrations', label: 'Govt Integrations', icon: <Server className="h-5 w-5" /> },
  { key: 'passport', label: 'Skill Passport', icon: <BadgeCheck className="h-5 w-5" /> },
  { key: 'privacy', label: 'Privacy & Consent', icon: <ShieldCheck className="h-5 w-5" /> },
  { key: 'followups', label: 'Follow-Up System', icon: <Send className="h-5 w-5" /> },
];

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
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
          <p className="text-xs text-gray-500 dark:text-gray-400">Outcome Intelligence</p>
        </div>
        <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              onNavigate(item.key);
              setMobileOpen(false);
            }}
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
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-900 lg:hidden"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <aside className="fixed left-0 top-0 z-50 h-full w-64 lg:hidden">
          {sidebar}
        </aside>
      )}
    </>
  );
}
