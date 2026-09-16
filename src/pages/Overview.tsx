import {
  Users, Briefcase, Target, TrendingUp, FileCheck,
  ShoppingBag, Wrench, AlertTriangle, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { KPICard } from '@/components/ui/KPICard';
import { Card, SectionTitle, ProgressBar, Badge } from '@/components/ui';
import {
  kpis, outcomeFunnel, nonPlacementReasons, wageProgression,
  skillsVsDemand, employmentRetentionTrend, trainees,
} from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';

interface OverviewProps {
  onNavigate: (page: PageKey) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const maxFunnel = outcomeFunnel[0].value;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-xl bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700 p-6 text-white animate-fade-in">
        <h2 className="text-2xl font-bold">SkillPulse Intelligence Dashboard</h2>
        <p className="mt-1 text-sm text-brand-100">
          Tracking skilling outcomes, diagnosing value leakage, and connecting interventions to the next cohort.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('integrations')} className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30 border border-white/20">
            Govt Integrations Gateway (EPFO/GSTN) →
          </button>
          <button onClick={() => onNavigate('autopsy')} className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/25">
            Outcome Autopsy →
          </button>
          <button onClick={() => onNavigate('skillgap')} className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/25">
            Skill Gap AI →
          </button>
          <button onClick={() => onNavigate('nextcohort')} className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/25">
            Next-Cohort Learning →
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Trainees" value={kpis.totalTrainees} icon={<Users className="h-5 w-5" />} color="brand" />
        <KPICard title="Employment Rate" value={kpis.employmentRate} unit="%" icon={<Briefcase className="h-5 w-5" />} trend={-3} trendLabel="vs last quarter" numerator={kpis.traineesPlaced + kpis.traineesSelfEmployed + kpis.traineesApprenticeship} denominator={kpis.totalTrainees} color="emerald" />
        <KPICard title="Relevant Employment" value={kpis.relevantEmploymentRate} unit="%" icon={<Target className="h-5 w-5" />} trend={-5} trendLabel="key metric" numerator={kpis.traineesRelevant} denominator={kpis.totalTrainees} color="accent" />
        <KPICard title="6-Month Retention" value={kpis.retentionRate} unit="%" icon={<TrendingUp className="h-5 w-5" />} trend={-8} trendLabel="of placed" numerator={kpis.traineesRetained} denominator={kpis.traineesPlaced} color="violet" />
        <KPICard title="Evidence Coverage" value={kpis.evidenceCoverage} unit="%" icon={<FileCheck className="h-5 w-5" />} trend={4} trendLabel="vs last quarter" numerator={kpis.traineesEvidence} denominator={kpis.totalTrainees} color="brand" />
        <KPICard title="Self-Employment" value={kpis.selfEmploymentRate} unit="%" icon={<ShoppingBag className="h-5 w-5" />} numerator={kpis.traineesSelfEmployed} denominator={kpis.totalTrainees} color="amber" />
        <KPICard title="Apprenticeships" value={kpis.apprenticeshipRate} unit="%" icon={<Wrench className="h-5 w-5" />} numerator={kpis.traineesApprenticeship} denominator={kpis.totalTrainees} color="rose" />
        <KPICard title="Skill Gaps Identified" value={kpis.skillGaps} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
      </div>

      {/* Follow-up coverage notice */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Follow-up Coverage: {kpis.followUpCoverage}% of trainees responded to all follow-ups</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Missing follow-up ≠ unemployed. Metrics above show numerator/denominator where applicable. Low follow-up coverage reduces confidence in outcome estimates.
            </p>
          </div>
        </div>
      </Card>

      {/* Outcome Funnel + Non-placement reasons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Outcome Funnel" subtitle="From enrollment to progression" icon={<Target className="h-5 w-5" />} />
          <div className="space-y-3">
            {outcomeFunnel.map((stage, i) => {
              const dropOff = i > 0 ? outcomeFunnel[i - 1].value - stage.value : 0;
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{stage.value}%</span>
                      <span className="text-xs text-gray-400">({stage.count})</span>
                      {dropOff > 0 && (
                        <Badge color="rose" size="sm">-{dropOff}pp</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <ProgressBar
                      value={stage.value}
                      max={maxFunnel}
                      color={i >= 3 ? 'amber' : i >= 5 ? 'rose' : 'brand'}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
            <button onClick={() => onNavigate('autopsy')} className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
              View detailed Outcome Autopsy <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Non-Placement Reasons" subtitle="Why trainees weren't placed" icon={<AlertTriangle className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nonPlacementReasons} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis type="category" dataKey="reason" stroke="#9ca3af" fontSize={12} width={110} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3380fc" radius={[0, 4, 4, 0]} name="%" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Employment & Retention Trend */}
      <Card className="p-5">
        <SectionTitle title="Employment & Retention Over Time" subtitle="Monthly trend post-training" icon={<TrendingUp className="h-5 w-5" />} />
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={employmentRetentionTrend} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3380fc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3380fc" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="employment" stroke="#3380fc" strokeWidth={2} fill="url(#empGrad)" name="Employment %" />
            <Area type="monotone" dataKey="retention" stroke="#14b8a6" strokeWidth={2} fill="url(#retGrad)" name="Retention %" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Wage Progression + Skills vs Demand */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Wage Progression" subtitle="Avg. wage vs market median" icon={<TrendingUp className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={wageProgression} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Legend />
              <Line type="monotone" dataKey="wage" stroke="#3380fc" strokeWidth={2} name="Trainee Wage" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="market" stroke="#14b8a6" strokeWidth={2} strokeDasharray="5 5" name="Market Median" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Training Skills vs Market Demand" subtitle="Alignment analysis" icon={<Target className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillsVsDemand} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="skill" stroke="#9ca3af" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="training" fill="#3380fc" radius={[4, 4, 0, 0]} name="Training %" />
              <Bar dataKey="demand" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Demand %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent trainees */}
      <Card className="p-5">
        <SectionTitle
          title="Recent Trainees"
          subtitle="Latest trainee outcomes"
          icon={<Users className="h-5 w-5" />}
          action={<button onClick={() => onNavigate('trainees')} className="text-sm font-medium text-brand-600 dark:text-brand-400">View all →</button>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="pb-2 pr-4 font-medium">Trainee</th>
                <th className="pb-2 pr-4 font-medium">Course</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Relevance</th>
                <th className="pb-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {trainees.slice(0, 6).map((t) => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                  <td className="py-2.5 pr-4">
                    <div className="font-medium text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.unifiedId}</div>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{t.courseName}</td>
                  <td className="py-2.5 pr-4">
                    <Badge color={t.employmentStatus === 'Placed' ? 'emerald' : t.employmentStatus === 'Self-Employed' ? 'amber' : t.employmentStatus === 'Apprenticeship' ? 'violet' : 'rose'}>
                      {t.employmentStatus}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-4">
                    {t.jobRelevance ? <Badge color={t.jobRelevance === 'High' ? 'emerald' : t.jobRelevance === 'Moderate' ? 'amber' : 'rose'} size="sm">{t.jobRelevance}</Badge> : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="py-2.5">
                    <span className="font-bold text-gray-900 dark:text-white">{t.skillReadinessScore}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
