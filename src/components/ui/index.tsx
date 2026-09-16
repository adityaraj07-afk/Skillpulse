import type { ReactNode } from 'react';
import type { EvidenceState } from '@/data/mockData';
import { evidenceColors } from '@/data/mockData';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', hover = false, onClick, style }: CardProps) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  color?: 'brand' | 'accent' | 'emerald' | 'amber' | 'rose' | 'violet' | 'gray';
  size?: 'sm' | 'md';
}

const badgeColors = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function Badge({ children, color = 'gray', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'} ${badgeColors[color]}`}>
      {children}
    </span>
  );
}

export function EvidenceBadge({ state }: { state: EvidenceState }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${evidenceColors[state]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {state}
    </span>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionTitle({ title, subtitle, icon, action }: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon && <span className="text-brand-500">{icon}</span>}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'brand' | 'accent' | 'emerald' | 'amber' | 'rose' | 'violet' | 'gray';
  showLabel?: boolean;
  height?: string;
}

const barColors = {
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  gray: 'bg-gray-400',
};

export function ProgressBar({ value, max = 100, color = 'brand', showLabel = false, height = 'h-2' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${height}`}>
        <div className={`rounded-full ${barColors[color]} transition-all duration-500 ${height}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="mt-1 block text-xs text-gray-500">{pct}%</span>}
    </div>
  );
}
