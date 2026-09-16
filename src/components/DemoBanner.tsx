import { ShieldCheck, Activity, Database } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="flex flex-wrap items-center justify-between border-b border-brand-100 bg-gradient-to-r from-brand-50/80 via-blue-50/60 to-indigo-50/80 px-4 py-1.5 text-xs text-brand-900 dark:border-brand-900/40 dark:from-brand-950/40 dark:via-gray-900 dark:to-gray-900 dark:text-brand-300">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold tracking-wide uppercase text-[11px] text-brand-700 dark:text-brand-400">
          MSDE Live Sandbox Environment
        </span>
        <span className="hidden sm:inline text-gray-400 dark:text-gray-600">•</span>
        <span className="hidden sm:inline text-gray-600 dark:text-gray-400">
          Smart India Hackathon 2026 Verification Protocol
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
          <Database className="h-3 w-3" /> Persistent Store Connected
        </span>
        <span className="hidden md:flex items-center gap-1 text-gray-500">
          <ShieldCheck className="h-3 w-3 text-brand-600" /> DPDP Act Safeguards Active
        </span>
      </div>
    </div>
  );
}
