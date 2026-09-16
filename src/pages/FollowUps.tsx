import { useState, useMemo } from 'react';
import {
  Clock, CheckCircle2, AlertTriangle, Send, TrendingUp,
  MessageSquare, Phone, Mail, UserCheck, Search, X,
  Calendar, Building2, BarChart3,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { KPICard } from '@/components/ui/KPICard';
import {
  trainees, extendedKpis, providerFollowUpStats, overdueFollowUps,
  followUpStatusColors, followUpMethodIcons,
  type FollowUpMethod, type FollowUpStatus,
} from '@/data/mockData';

export function FollowUps() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
  const [simulatedActions, setSimulatedActions] = useState<Record<string, string>>({});

  const providers = useMemo(() => [...new Set(trainees.map((t) => t.providerName))], []);

  // Build flat list of all follow-ups with trainee info
  const allFollowUps = useMemo(() => {
    return trainees.flatMap((t) =>
      t.followUps.map((f) => ({
        traineeId: t.id,
        traineeName: t.name,
        unifiedId: t.unifiedId,
        providerName: t.providerName,
        district: t.district,
        period: f.period,
        days: f.days,
        status: f.status || 'Pending',
        method: f.method || 'WhatsApp',
        dueDate: f.dueDate || '',
        responded: f.responded,
        isOverdue: f.isOverdue || false,
        lastContacted: f.lastContacted || null,
        formResponse: f.formResponse || null,
      }))
    );
  }, []);

  const filtered = useMemo(() => {
    return allFollowUps.filter((f) => {
      const matchSearch = !search ||
        f.traineeName.toLowerCase().includes(search.toLowerCase()) ||
        f.unifiedId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || f.status === filterStatus;
      const matchProvider = filterProvider === 'all' || f.providerName === filterProvider;
      return matchSearch && matchStatus && matchProvider;
    });
  }, [allFollowUps, search, filterStatus, filterProvider]);

  const handleSimulate = (key: string, method: FollowUpMethod, traineeName: string) => {
    const ts = new Date().toLocaleString('en-IN');
    setSimulatedActions((prev) => ({ ...prev, [key]: `${method} dispatched to ${traineeName} at ${ts} via Sandbox Gateway` }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Follow-Up System</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track 30/90/180/365-day follow-ups across all trainees and providers</p>
      </div>

      {/* Gateway Notice */}
      <Card className="border-l-4 border-l-brand-500 p-4">
        <div className="flex items-start gap-3">
          <Send className="h-5 w-5 shrink-0 text-brand-600" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Multi-Channel Follow-Up Dispatch</p>
            <p className="text-gray-500 dark:text-gray-400">
              Follow-up triggers are routed through automated WhatsApp Business API and National SMS Gateway (Govt Sandbox mode).
            </p>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          title="Total Follow-Ups"
          value={extendedKpis.totalFollowUps}
          icon={<BarChart3 className="h-5 w-5" />}
          color="brand"
        />
        <KPICard
          title="Completed"
          value={extendedKpis.followUpsCompleted}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="emerald"
        />
        <KPICard
          title="Pending / In Progress"
          value={extendedKpis.followUpsDue}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
        <KPICard
          title="Overdue"
          value={extendedKpis.followUpsOverdue}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="rose"
        />
      </div>

      {/* Response Rate + Method Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Response Rate" subtitle="Overall follow-up completion rate" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{extendedKpis.responseRate}%</p>
              <p className="text-xs text-gray-500">{extendedKpis.followUpsCompleted} of {extendedKpis.totalFollowUps} completed</p>
            </div>
            <div className="flex-1 ml-6">
              <ProgressBar value={extendedKpis.responseRate} color={extendedKpis.responseRate >= 70 ? 'emerald' : extendedKpis.responseRate >= 50 ? 'amber' : 'rose'} showLabel height="h-3" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
              <p className="text-xs text-gray-500">Assisted</p>
              <p className="mt-1 text-lg font-bold text-violet-600 dark:text-violet-400">{extendedKpis.followUpsAssisted}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-xs text-gray-500">Scheduled</p>
              <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">{extendedKpis.followUpsScheduled}</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
              <p className="text-xs text-gray-500">No Response</p>
              <p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">{extendedKpis.followUpsOverdue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Method Distribution" subtitle="Follow-up methods used across all trainees" icon={<Send className="h-5 w-5" />} />
          <div className="space-y-3">
            {(['WhatsApp', 'SMS', 'Email', 'Phone Call', 'Assisted Follow-up'] as FollowUpMethod[]).map((method) => {
              const count = allFollowUps.filter((f) => f.method === method).length;
              const pct = allFollowUps.length > 0 ? Math.round((count / allFollowUps.length) * 100) : 0;
              const icons: Record<FollowUpMethod, React.ReactNode> = {
                'WhatsApp': <MessageSquare className="h-4 w-4" />,
                'SMS': <MessageSquare className="h-4 w-4" />,
                'Email': <Mail className="h-4 w-4" />,
                'Phone Call': <Phone className="h-4 w-4" />,
                'Assisted Follow-up': <UserCheck className="h-4 w-4" />,
              };
              return (
                <div key={method}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      {icons[method]} {followUpMethodIcons[method]}
                    </span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="mt-1"><ProgressBar value={pct} color="brand" height="h-1.5" /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Overdue Warnings */}
      {overdueFollowUps.length > 0 && (
        <Card className="border-l-4 border-l-rose-400 p-5">
          <SectionTitle
            title={`Overdue Follow-Ups (${overdueFollowUps.length})`}
            subtitle="Follow-ups past their due date with no response"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <div className="space-y-2">
            {overdueFollowUps.slice(0, 8).map((f, i) => {
              const key = `${f.traineeId}-${f.period}`;
              return (
                <div key={i} className="flex flex-col gap-2 rounded-lg border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-800 dark:bg-rose-900/10 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{f.traineeName}</p>
                      <p className="text-xs text-gray-500">{f.unifiedId} • {f.providerName} • {f.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{f.period} follow-up</p>
                      <p className="text-xs text-rose-600 dark:text-rose-400">Due: {f.dueDate}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${followUpStatusColors[f.status as FollowUpStatus]}`}>
                      {f.status}
                    </span>
                    <div className="flex gap-1">
                      <SimulateSendButton icon={<MessageSquare className="h-3 w-3" />} label="WhatsApp" onClick={() => handleSimulate(key, 'WhatsApp', f.traineeName)} />
                      <SimulateSendButton icon={<Phone className="h-3 w-3" />} label="Call" onClick={() => handleSimulate(key, 'Phone Call', f.traineeName)} />
                    </div>
                  </div>
                  {simulatedActions[key] && (
                    <div className="sm:absolute sm:right-0 sm:top-full sm:mt-1">
                      <p className="text-xs text-brand-600 dark:text-brand-400">{simulatedActions[key]}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {overdueFollowUps.length > 8 && (
            <p className="mt-3 text-xs text-gray-400">Showing 8 of {overdueFollowUps.length} overdue follow-ups. Use the table below to see all.</p>
          )}
        </Card>
      )}

      {/* Provider Breakdown */}
      <Card className="p-5">
        <SectionTitle title="Provider Follow-Up Performance" subtitle="Response rates by training provider" icon={<Building2 className="h-5 w-5" />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Trainees</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Pending</th>
                <th className="px-4 py-3 font-medium">Overdue</th>
                <th className="px-4 py-3 font-medium">Response Rate</th>
              </tr>
            </thead>
            <tbody>
              {providerFollowUpStats.map((p) => (
                <tr key={p.providerId} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.providerName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.totalTrainees}</td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-600 dark:text-emerald-400">{p.followUpsCompleted}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-amber-600 dark:text-amber-400">{p.followUpsDue}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.overdue > 0 ? (
                      <Badge color="rose" size="sm">{p.overdue} overdue</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24"><ProgressBar value={p.responseRate} color={p.responseRate >= 70 ? 'emerald' : p.responseRate >= 50 ? 'amber' : 'rose'} height="h-1.5" /></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{p.responseRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by trainee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Sent">Sent</option>
              <option value="Responded">Responded</option>
              <option value="No Response">No Response</option>
              <option value="Assisted">Assisted</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Providers</option>
              {providers.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Follow-ups table */}
      <Card className="overflow-hidden">
        <div className="p-5 pb-0">
          <SectionTitle title={`All Follow-Ups (${filtered.length})`} subtitle="Individual follow-up records with status and actions" icon={<Clock className="h-5 w-5" />} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Trainee</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Simulate Send</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const key = `${f.traineeId}-${f.period}-${i}`;
                return (
                  <tr key={i} className={`border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 ${f.isOverdue ? 'bg-rose-50/30 dark:bg-rose-900/5' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{f.traineeName}</p>
                      <p className="text-xs text-gray-400">{f.unifiedId}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{f.providerName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{f.period}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{followUpMethodIcons[f.method]}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {f.dueDate || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${followUpStatusColors[f.status as FollowUpStatus]}`}>
                        {f.status}
                      </span>
                      {f.isOverdue && <AlertTriangle className="ml-1 inline h-3 w-3 text-rose-500" />}
                    </td>
                    <td className="px-4 py-3">
                      {f.status !== 'Responded' && f.status !== 'Completed' ? (
                        <div className="flex items-center gap-1">
                          <SimulateSendButton icon={<MessageSquare className="h-3 w-3" />} label="" onClick={() => handleSimulate(key, 'WhatsApp', f.traineeName)} />
                          <SimulateSendButton icon={<Mail className="h-3 w-3" />} label="" onClick={() => handleSimulate(key, 'Email', f.traineeName)} />
                          <SimulateSendButton icon={<Phone className="h-3 w-3" />} label="" onClick={() => handleSimulate(key, 'Phone Call', f.traineeName)} />
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-500"><CheckCircle2 className="inline h-3 w-3" /> Done</span>
                      )}
                      {simulatedActions[key] && (
                        <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">{simulatedActions[key]}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No follow-ups match your filters</p>
          </div>
        )}
      </Card>

      <p className="text-xs text-gray-400">
        All communication actions (WhatsApp, SMS, Email, Phone Call) are simulated for demonstration. No real messages are sent. Follow-up data is synthetic and resets on page reload.
      </p>
    </div>
  );
}

function SimulateSendButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`Simulate ${label || 'send'}`}
      className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-900/20 dark:hover:text-brand-300"
    >
      {icon}{label && <span>{label}</span>}
    </button>
  );
}
