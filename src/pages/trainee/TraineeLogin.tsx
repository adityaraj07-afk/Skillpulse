import { useState } from 'react';
import { User, Lock, ArrowRight, LogIn } from 'lucide-react';
import { trainees } from '@/data/mockData';

interface TraineeLoginProps {
  onLogin: (traineeId: string) => void;
  onBackToAdmin?: () => void;
}

export function TraineeLogin({ onLogin, onBackToAdmin }: TraineeLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !password.trim()) {
      // In demo mode, if blank, automatically login as default demo trainee
      onLogin('T001');
      return;
    }

    const trimmed = email.trim().toLowerCase();
    const found = trainees.find(
      (t) =>
        t.id.toLowerCase() === trimmed ||
        t.unifiedId.toLowerCase() === trimmed ||
        t.email.toLowerCase() === trimmed ||
        t.name.toLowerCase().includes(trimmed)
    );

    if (found) {
      onLogin(found.id);
    } else {
      // Default to T001 for seamless prototype testing
      onLogin('T001');
    }
  };

  const handleDemoLogin = () => {
    onLogin('T001');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f3f8fd] via-[#f7fafe] to-[#edf4fc] p-4 text-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-white">
      {/* Top Logo & Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[#009ce8] to-[#0070ba] shadow-lg shadow-sky-500/20">
          <svg
            className="h-7 w-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h1 className="mt-3.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          SkillPulse
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 font-normal">
          Trainee Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-7 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email or Unified Trainee ID
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="e.g., SP-2025-00001"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter any password"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d61f3] py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#1554db] active:scale-[0.99]"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </button>
        </form>

        {/* OR Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Demo Trainee Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-[#eef6ff] py-2.5 text-xs sm:text-sm font-semibold text-blue-600 transition hover:bg-[#e2efff] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/40 active:scale-[0.99]"
        >
          <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Continue as Demo Trainee</span>
        </button>

        <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
          Explore the trainee portal with a pre-loaded demo profile
        </p>
      </div>

      {/* Footer Area Below Card */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          SkillPulse Trainee Portal — Prototype for SIH demonstration
        </p>

        {onBackToAdmin && (
          <button
            type="button"
            onClick={onBackToAdmin}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            — Back to Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
