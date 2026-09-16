import { useState, useEffect } from 'react';
import {
  Target, Briefcase, TrendingUp, FileCheck, ShoppingBag,
  Wrench, Award, IndianRupee, Clock, Info,
  CheckCircle2, AlertTriangle, Upload, FileText, ShieldCheck,
  Eye,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { KPICard } from '@/components/ui/KPICard';
import { Card, SectionTitle, Badge, EvidenceBadge, ProgressBar } from '@/components/ui';
import { kpis, type Trainee, type EvidenceState } from '@/data/mockData';
import { dataService } from '@/services/dataService';
import type { VerificationStatus } from '@/context/TraineeContext';
import { EvidenceReviewModal, type EvidenceReviewData } from '@/pages/admin/EvidenceReviewModal';

const VERIFICATION_STATUSES: VerificationStatus[] = [
  'Self-Reported',
  'Evidence Submitted',
  'Under Review',
  'Verified',
  'Needs Update',
];

function traineeVerificationStatus(t: Trainee): VerificationStatus {
  if (t.evidence === 'Employer-Verified') return 'Verified';
  if (t.evidence === 'Evidence-Supported') return 'Evidence Submitted';
  if (t.evidence === 'Under Review') return 'Under Review';
  return 'Self-Reported';
}

const verificationColors: Record<VerificationStatus, string> = {
  'Self-Reported': '#9ca3af',
  'Evidence Submitted': '#3380fc',
  'Under Review': '#f59e0b',
  'Verified': '#10b981',
  'Needs Update': '#f43f5e',
};

const verificationBadgeColors: Record<VerificationStatus, 'gray' | 'brand' | 'amber' | 'emerald' | 'rose'> = {
  'Self-Reported': 'gray',
  'Evidence Submitted': 'brand',
  'Under Review': 'amber',
  'Verified': 'emerald',
  'Needs Update': 'rose',
};

interface AdminVerificationState {
  status: VerificationStatus;
  verifierNotes?: string;
  reviewedAt?: string;
}

export function Outcomes() {
  const [traineesList, setTraineesList] = useState<Trainee[]>(() => dataService.getTrainees());
  const [verifications, setVerifications] = useState<Record<string, AdminVerificationState>>({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<EvidenceReviewData | null>(null);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setTraineesList([...dataService.getTrainees()]);
    });
    return () => unsub();
  }, []);

  const getVStatus = (t: Trainee): VerificationStatus =>
    verifications[t.id]?.status || traineeVerificationStatus(t);

  const handleStatusChange = (traineeId: string, status: VerificationStatus, notes: string) => {
    setVerifications((prev) => ({
      ...prev,
      [traineeId]: {
        status,
        verifierNotes: notes,
        reviewedAt: new Date().toLocaleString('en-IN'),
      },
    }));

    const evidenceMap: Record<VerificationStatus, EvidenceState> = {
      'Verified': 'Employer-Verified',
      'Evidence Submitted': 'Evidence-Supported',
      'Under Review': 'Under Review',
      'Needs Update': 'Disputed',
      'Self-Reported': 'Self-Reported',
    };
    dataService.verifyEvidence(traineeId, evidenceMap[status] || 'Evidence-Supported', notes);
  };

  const openReviewModal = (t: Trainee) => {
    const vState = verifications[t.id];
    const docs = vState?.status && vState.status !== 'Self-Reported'
      ? [{ id: 'doc-auth-1', fileName: 'employment_offer_letter.pdf', fileType: 'PDF', uploadedAt: t.joiningDate || 'N/A' }]
      : [];
    setReviewData({
      traineeId: t.id,
      traineeName: t.name,
      employmentStatus: t.employmentStatus,
      jobTitle: t.jobRole || undefined,
      employer: t.industry || undefined,
      salaryRange: t.salaryRange || undefined,
      jobLocation: t.jobLocation || undefined,
      joiningDate: t.joiningDate || undefined,
      submittedAt: t.joiningDate || 'N/A',
      verificationStatus: getVStatus(t),
      evidenceDocuments: docs,
      verifierNotes: vState?.verifierNotes,
      reviewedAt: vState?.reviewedAt,
    });
    setReviewModalOpen(true);
  };

  const verificationPieData = VERIFICATION_STATUSES.map((s) => ({
    name: s,
    value: traineesList.filter((t) => getVStatus(t) === s).length,
    color: verificationColors[s],
  })).filter((d) => d.value > 0);

  const employmentBreakdown = [
    { type: 'Placed (Relevant)', count: traineesList.filter((t) => t.jobRelevance === 'High' || t.jobRelevance === 'Moderate').length, color: '#10b981' },
    { type: 'Placed (Low Relevance)', count: traineesList.filter((t) => t.employmentStatus === 'Placed' && t.jobRelevance === 'Low').length, color: '#f59e0b' },
    { type: 'Self-Employed', count: traineesList.filter((t) => t.isSelfEmployed).length, color: '#8b5cf6' },
    { type: 'Apprenticeship', count: traineesList.filter((t) => t.isApprenticeship).length, color: '#f43f5e' },
    { type: 'Unplaced', count: traineesList.filter((t) => t.employmentStatus === 'Unplaced').length, color: '#ef4444' },
  ];

  const verifiedCount = traineesList.filter((t) => getVStatus(t) === 'Verified').length;
  const evidenceCount = traineesList.filter((t) => getVStatus(t) === 'Evidence Submitted').length;
  const reviewCount = traineesList.filter((t) => getVStatus(t) === 'Under Review').length;
  const selfReportedCount = traineesList.filter((t) => getVStatus(t) === 'Self-Reported').length;
  const needsUpdateCount = traineesList.filter((t) => getVStatus(t) === 'Needs Update').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Outcomes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Employment outcomes with evidence states and follow-up coverage</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Placed" value={kpis.traineesPlaced} icon={<Briefcase className="h-5 w-5" />} numerator={kpis.traineesPlaced} denominator={kpis.totalTrainees} color="emerald" />
        <KPICard title="Self-Employed" value={kpis.traineesSelfEmployed} icon={<ShoppingBag className="h-5 w-5" />} numerator={kpis.traineesSelfEmployed} denominator={kpis.totalTrainees} color="amber" />
        <KPICard title="Apprenticeship" value={kpis.traineesApprenticeship} icon={<Wrench className="h-5 w-5" />} numerator={kpis.traineesApprenticeship} denominator={kpis.totalTrainees} color="violet" />
        <KPICard title="Relevant Employment" value={kpis.relevantEmploymentRate} unit="%" icon={<Target className="h-5 w-5" />} numerator={kpis.traineesRelevant} denominator={kpis.totalTrainees} color="brand" />
      </div>

      {/* Verification KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Self-Reported</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{selfReportedCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-brand-500" />
            <span className="text-xs text-gray-500">Evidence Submitted</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{evidenceCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-gray-500">Under Review</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{reviewCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Verified</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{verifiedCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span className="text-xs text-gray-500">Needs Update</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{needsUpdateCount}</p>
        </Card>
      </div>

      {/* Important note */}
      <Card className="border-l-4 border-l-brand-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-brand-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Missing follow-up ≠ unemployed.</p>
            <p className="text-gray-500 dark:text-gray-400">
              Follow-up coverage: {kpis.followUpCoverage}% of trainees responded to all follow-ups. Metrics below show numerator/denominator for transparency.
              Trainees with no follow-up response are classified as "Unknown" — not "Unplaced."
            </p>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Employment Breakdown" icon={<Briefcase className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={employmentBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={2}>
                {employmentBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Verification Status" subtitle="Outcome verification breakdown" icon={<ShieldCheck className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={verificationPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={2}>
                {verificationPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {verificationPieData.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{e.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{e.value} trainees</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Outcome table */}
      <Card className="overflow-hidden">
        <div className="p-5 pb-0">
          <SectionTitle title="Trainee Outcomes Detail" subtitle="All trainees with evidence, verification, and follow-up status — click Review to open the evidence review flow" icon={<Target className="h-5 w-5" />} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Trainee</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Salary</th>
                <th className="px-4 py-3 font-medium">Relevance</th>
                <th className="px-4 py-3 font-medium">Retention</th>
                <th className="px-4 py-3 font-medium">Evidence</th>
                <th className="px-4 py-3 font-medium">Verification</th>
                <th className="px-4 py-3 font-medium">Follow-ups</th>
              </tr>
            </thead>
            <tbody>
              {traineesList.map((t) => {
                const responded = t.followUps.filter((f) => f.responded).length;
                const vStatus = getVStatus(t);
                const vState = verifications[t.id];
                return (
                  <tr key={t.id} className={`border-t border-gray-100 dark:border-gray-800 ${vStatus === 'Verified' ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : vStatus === 'Needs Update' ? 'bg-rose-50/30 dark:bg-rose-900/5' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                    <td className="px-4 py-3">
                      <Badge color={t.employmentStatus === 'Placed' ? 'emerald' : t.employmentStatus === 'Self-Employed' ? 'amber' : t.employmentStatus === 'Apprenticeship' ? 'violet' : 'rose'}>
                        {t.employmentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.salary ? `₹${t.salary.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-4 py-3">
                      {t.jobRelevance ? <Badge color={t.jobRelevance === 'High' ? 'emerald' : t.jobRelevance === 'Moderate' ? 'amber' : 'rose'} size="sm">{t.jobRelevance}</Badge> : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.isRetained ? `${t.retentionMonths}mo` : 'Pending'}</td>
                    <td className="px-4 py-3"><EvidenceBadge state={t.evidence} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {vStatus === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> VERIFIED
                          </span>
                        ) : vStatus === 'Self-Reported' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                            <FileText className="h-3 w-3" /> SELF-REPORTED
                          </span>
                        ) : (
                          <Badge color={verificationBadgeColors[vStatus]} size="sm">{vStatus}</Badge>
                        )}
                        {vState?.verifierNotes && (
                          <span title={vState.verifierNotes} className="text-xs text-gray-400">📝</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{responded}/4</span>
                          <div className="w-16"><ProgressBar value={responded} max={4} color={responded === 4 ? 'emerald' : responded >= 2 ? 'amber' : 'rose'} /></div>
                        </div>
                        <button
                          onClick={() => openReviewModal(t)}
                          className="flex items-center gap-1 rounded-lg border border-brand-200 px-2.5 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-400 dark:hover:bg-brand-900/20"
                          title="Open evidence review"
                        >
                          <Eye className="h-3.5 w-3.5" /> Review
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            DEMO — Admin/verifier status changes and document verification are simulated and stored in-memory only. No real government or employer verification is performed.
          </p>
        </div>
      </Card>

      <EvidenceReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        data={reviewData}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
