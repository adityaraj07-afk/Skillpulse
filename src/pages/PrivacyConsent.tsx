import {
  ShieldCheck, Lock, Eye, FileCheck, UserCheck, UserX,
  Download, AlertTriangle, Info, ScrollText,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { auditLogs, kpis } from '@/data/mockData';

export function PrivacyConsent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy & Consent</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Data protection, consent management, and access controls</p>
      </div>

      {/* Key principle */}
      <Card className="border-l-4 border-l-brand-400 p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-brand-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Missing follow-up ≠ unemployed.</p>
            <p className="text-gray-500 dark:text-gray-400">
              All outcome metrics show numerator/denominator and follow-up coverage. Trainees who don't respond to follow-ups are classified as "Unknown" — never assumed unemployed. This prevents penalizing trainees for data collection gaps.
            </p>
          </div>
        </div>
      </Card>

      {/* Consent management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Consent Management" subtitle="Trainee-level data sharing permissions" icon={<UserCheck className="h-5 w-5" />} />
          <div className="space-y-3">
            <ConsentRow label="Employment data sharing" status="Granted" enabled />
            <ConsentRow label="Skill profile visibility to employers" status="Granted" enabled />
            <ConsentRow label="Aggregated/anonymized analytics" status="Granted" enabled />
            <ConsentRow label="Longitudinal follow-up contact" status="Granted" enabled />
            <ConsentRow label="Cross-provider data visibility" status="Denied" />
            <ConsentRow label="Third-party sharing" status="Withdrawn" />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700">
              <UserCheck className="h-4 w-4" /> Grant All
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-gray-700 dark:hover:bg-rose-900/20">
              <UserX className="h-4 w-4" /> Withdraw All
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Data Minimization" subtitle="Only necessary data is collected" icon={<Lock className="h-5 w-5" />} />
          <div className="space-y-3">
            <DataMinRow label="Name & Unified ID" status="Collected" reason="Identity verification" />
            <DataMinRow label="Education & Skills" status="Collected" reason="Skill matching" />
            <DataMinRow label="Employment status" status="Collected" reason="Outcome tracking" />
            <DataMinRow label="Salary range" status="Collected" reason="Wage progression" />
            <DataMinRow label="Aadhaar" status="Not Collected" reason="Data minimization principle (DPDP Act 2023)" />
            <DataMinRow label="Phone number" status="Anonymized" reason="Follow-up only" />
            <DataMinRow label="Bank details" status="Not Collected" reason="Not required" />
            <DataMinRow label="Personal documents" status="Not Stored" reason="Only evidence metadata" />
          </div>
        </Card>
      </div>

      {/* Role-based access */}
      <Card className="p-5">
        <SectionTitle title="Role-Based Access Control" subtitle="Who can see what" icon={<Eye className="h-5 w-5" />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Own Data</th>
                <th className="px-4 py-3 font-medium">Cohort Data</th>
                <th className="px-4 py-3 font-medium">District Data</th>
                <th className="px-4 py-3 font-medium">Cross-Provider</th>
                <th className="px-4 py-3 font-medium">Anonymized Analytics</th>
              </tr>
            </thead>
            <tbody>
              <AccessRow role="Trainee" perms={['Full', '—', '—', '—', 'Yes']} />
              <AccessRow role="Training Provider" perms={['Own trainees only', 'Own cohort', '—', 'Denied', 'Yes']} />
              <AccessRow role="District Admin" perms={['—', 'Own district', 'Full', 'Denied', 'Yes']} />
              <AccessRow role="State Mission" perms={['—', 'Statewide', 'Statewide', 'Denied', 'Yes']} />
              <AccessRow role="Central Govt" perms={['—', '—', '—', 'Denied', 'Yes']} />
              <AccessRow role="Employer (Verifier)" perms={['Verification only', '—', '—', '—', '—']} />
            </tbody>
          </table>
        </div>
      </Card>

      {/* Anonymized analytics */}
      <Card className="p-5">
        <SectionTitle title="Anonymized & Aggregated Analytics" subtitle="Public-facing metrics use anonymized data only" icon={<FileCheck className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Follow-up Coverage</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{kpis.followUpCoverage}%</p>
            <div className="mt-2"><ProgressBar value={kpis.followUpCoverage} color={kpis.followUpCoverage > 80 ? 'emerald' : 'amber'} /></div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">Data Anonymized for Public</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</p>
            <p className="text-xs text-gray-400">All public dashboards use aggregated data</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500">PII Stored</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">Minimal</p>
            <p className="text-xs text-gray-400">Data minimization principle applied</p>
          </div>
        </div>
      </Card>

      {/* Audit logs */}
      <Card className="overflow-hidden">
        <div className="p-5 pb-0">
          <SectionTitle title="Audit Logs" subtitle="All data access is logged and reviewable" icon={<ScrollText className="h-5 w-5" />} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Consent</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 text-xs text-gray-500">{log.timestamp}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.actor}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.resource}</td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-500">{log.consentStatus}</span></td>
                  <td className="px-4 py-3">
                    <Badge color={log.status === 'Allowed' ? 'emerald' : 'rose'} size="sm">{log.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Data rights */}
      <Card className="p-5">
        <SectionTitle title="Trainee Data Rights" icon={<ShieldCheck className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RightCard icon={<Eye className="h-5 w-5" />} title="Right to View" desc="Trainees can view all data held about them at any time." />
          <RightCard icon={<Download className="h-5 w-5" />} title="Right to Export" desc="Trainees can download their Skill Passport data." />
          <RightCard icon={<UserX className="h-5 w-5" />} title="Right to Withdraw Consent" desc="Trainees can withdraw consent for data sharing at any time." />
          <RightCard icon={<AlertTriangle className="h-5 w-5" />} title="Right to Dispute" desc="Trainees can dispute employment or evidence records." />
        </div>
      </Card>
    </div>
  );
}

function ConsentRow({ label, status, enabled }: { label: string; status: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${enabled ? 'text-emerald-600 dark:text-emerald-400' : status === 'Withdrawn' ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`}>
          {status}
        </span>
        <div className={`relative h-5 w-9 rounded-full transition ${enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${enabled ? 'left-4' : 'left-0.5'}`} />
        </div>
      </div>
    </div>
  );
}

function DataMinRow({ label, status, reason }: { label: string; status: string; reason: string }) {
  const color = status === 'Collected' ? 'amber' : status === 'Anonymized' ? 'brand' : 'emerald';
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <p className="text-xs text-gray-400">{reason}</p>
      </div>
      <Badge color={color as 'amber' | 'brand' | 'emerald'} size="sm">{status}</Badge>
    </div>
  );
}

function AccessRow({ role, perms }: { role: string; perms: string[] }) {
  return (
    <tr className="border-t border-gray-100 dark:border-gray-800">
      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{role}</td>
      {perms.map((p, i) => (
        <td key={i} className="px-4 py-3">
          {p === 'Denied' ? <Badge color="rose" size="sm">Denied</Badge> :
           p === '—' ? <span className="text-xs text-gray-400">—</span> :
           p === 'Yes' ? <Badge color="emerald" size="sm">Yes</Badge> :
           <span className="text-xs text-gray-600 dark:text-gray-400">{p}</span>}
        </td>
      ))}
    </tr>
  );
}

function RightCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
