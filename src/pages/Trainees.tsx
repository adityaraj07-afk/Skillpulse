import { useState, useMemo, useEffect } from 'react';
import {
  Users, Search, Filter, X, GraduationCap, Briefcase,
  MapPin, Calendar, IndianRupee, Award, ChevronRight,
  TrendingUp, Clock, FileCheck, AlertTriangle,
} from 'lucide-react';
import { Card, Badge, EvidenceBadge, ProgressBar, SectionTitle } from '@/components/ui';
import { type Trainee } from '@/data/mockData';
import { dataService } from '@/services/dataService';

export function Trainees() {
  const [traineesList, setTraineesList] = useState<Trainee[]>(() => dataService.getTrainees());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setTraineesList([...dataService.getTrainees()]);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return traineesList.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.unifiedId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.employmentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [traineesList, search, statusFilter]);

  if (selectedTrainee) {
    return <TraineeProfile trainee={selectedTrainee} onBack={() => setSelectedTrainee(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trainees</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Unified trainee profiles with outcomes, evidence, and timeline</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or Unified Trainee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Placed">Placed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Apprenticeship">Apprenticeship</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Trainee</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">District</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Evidence</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTrainee(t)}
                  className="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.unifiedId}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.courseName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.providerName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.district}</td>
                  <td className="px-4 py-3">
                    <Badge color={t.employmentStatus === 'Placed' ? 'emerald' : t.employmentStatus === 'Self-Employed' ? 'amber' : t.employmentStatus === 'Apprenticeship' ? 'violet' : 'rose'}>
                      {t.employmentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3"><EvidenceBadge state={t.evidence} /></td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-900 dark:text-white">{t.skillReadinessScore}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </td>
                  <td className="px-4 py-3"><ChevronRight className="h-4 w-4 text-gray-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">No trainees found.</div>
        )}
      </Card>
    </div>
  );
}

function TraineeProfile({ trainee, onBack }: { trainee: Trainee; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
        ← Back to Trainees
      </button>

      {/* Header card */}
      <Card className="p-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white">
              {trainee.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{trainee.name}</h2>
              <p className="text-sm text-gray-500">{trainee.unifiedId}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge color="brand">{trainee.cohort}</Badge>
                <Badge color={trainee.employmentStatus === 'Placed' ? 'emerald' : trainee.employmentStatus === 'Self-Employed' ? 'amber' : trainee.employmentStatus === 'Apprenticeship' ? 'violet' : 'rose'}>
                  {trainee.employmentStatus}
                </Badge>
                {trainee.warnings.length > 0 && <Badge color="amber"><AlertTriangle className="mr-1 h-3 w-3" />{trainee.warnings.length} warnings</Badge>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Skill Readiness Index</p>
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{trainee.skillReadinessScore}<span className="text-lg text-gray-400">/100</span></p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Prototype Indicator — Not Official</p>
          </div>
        </div>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Profile details */}
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle title="Personal & Education" icon={<Users className="h-5 w-5" />} />
            <dl className="space-y-3 text-sm">
              <DetailRow label="Age" value={`${trainee.age}`} />
              <DetailRow label="Gender" value={trainee.gender} />
              <DetailRow label="District" value={`${trainee.district}, ${trainee.state}`} icon={<MapPin className="h-4 w-4" />} />
              <DetailRow label="Education" value={trainee.education} icon={<GraduationCap className="h-4 w-4" />} />
            </dl>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Training & Certification" icon={<Award className="h-5 w-5" />} />
            <dl className="space-y-3 text-sm">
              <DetailRow label="Course" value={trainee.courseName} />
              <DetailRow label="Provider" value={trainee.providerName} />
              <DetailRow label="Cohort" value={trainee.cohort} />
              <DetailRow label="Certification" value={trainee.certification} />
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Certified</span>
                <Badge color={trainee.certified ? 'emerald' : 'amber'}>{trainee.certified ? 'Yes' : 'Pending'}</Badge>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Skills" icon={<TrendingUp className="h-5 w-5" />} />
            <div className="flex flex-wrap gap-2">
              {trainee.skills.map((s) => (
                <Badge key={s} color="brand">{s}</Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle: Employment */}
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle title="Employment" icon={<Briefcase className="h-5 w-5" />} />
            <dl className="space-y-3 text-sm">
              <DetailRow label="Status" value={trainee.employmentStatus} />
              <DetailRow label="Job Role" value={trainee.jobRole || '—'} />
              <DetailRow label="Industry" value={trainee.industry || '—'} />
              <DetailRow label="Joining Date" value={trainee.joiningDate || '—'} icon={<Calendar className="h-4 w-4" />} />
              <DetailRow label="Salary Range" value={trainee.salaryRange || '—'} icon={<IndianRupee className="h-4 w-4" />} />
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Job Relevance</span>
                {trainee.jobRelevance ? <Badge color={trainee.jobRelevance === 'High' ? 'emerald' : trainee.jobRelevance === 'Moderate' ? 'amber' : 'rose'}>{trainee.jobRelevance}</Badge> : <span className="text-gray-400">—</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Retention</span>
                <span className="font-medium text-gray-900 dark:text-white">{trainee.isRetained ? `${trainee.retentionMonths} months` : 'Pending'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Evidence</span>
                <EvidenceBadge state={trainee.evidence} />
              </div>
            </dl>
          </Card>

          {/* Follow-ups */}
          <Card className="p-5">
            <SectionTitle title="Follow-ups" subtitle="30 / 90 / 180 days / 12 months" icon={<Clock className="h-5 w-5" />} />
            <div className="space-y-3">
              {trainee.followUps.map((f) => (
                <div key={f.period} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{f.period}</span>
                    <div className="flex items-center gap-2">
                      {!f.responded && <Badge color="amber" size="sm">No Response</Badge>}
                      {f.employed ? <Badge color="emerald" size="sm">Employed</Badge> : <Badge color="rose" size="sm">Not Employed</Badge>}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>Salary: {f.salary ? `₹${f.salary.toLocaleString('en-IN')}` : '—'}</span>
                    <span>Relevance: {f.relevant ? 'Yes' : 'No'}</span>
                    <span>Status: {f.livelihoodStatus}</span>
                  </div>
                  <div className="mt-1.5"><EvidenceBadge state={f.evidence} /></div>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              DEMO DATA — Follow-up responses are simulated for prototype demonstration.
            </p>
          </Card>
        </div>

        {/* Right: Timeline */}
        <div>
          <Card className="p-5">
            <SectionTitle title="Journey Timeline" subtitle="Training → Certification → Outcome → Follow-ups → Retention → Progression" icon={<FileCheck className="h-5 w-5" />} />
            <div className="relative">
              {trainee.timeline.map((event, i) => (
                <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Line */}
                  {i < trainee.timeline.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-px bg-gray-200 dark:bg-gray-700" />
                  )}
                  {/* Dot */}
                  <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    event.stage === 'Training' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400' :
                    event.stage === 'Certification' ? 'bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400' :
                    event.stage === 'Outcome' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' :
                    event.stage === 'Follow-up' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
                    event.stage === 'Retention' ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    </div>
                    <p className="text-xs text-gray-500">{event.date}</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{event.description}</p>
                    <div className="mt-1.5"><EvidenceBadge state={event.evidence} /></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Evidence upload */}
      <Card className="p-5">
        <SectionTitle title="Evidence Upload" subtitle="Upload documents for prototype evidence verification" icon={<FileCheck className="h-5 w-5" />} />
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <FileCheck className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Drag and drop evidence documents here, or click to browse</p>
          <p className="mt-1 text-xs text-gray-400">Accepts: PDF, JPG, PNG (offer letters, salary slips, certificates)</p>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          If OCR is used, information will be extracted but requires human confirmation. OCR itself does not prove authenticity. Employer verification shown in this prototype is SIMULATED.
        </p>
      </Card>
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
        {icon && <span className="text-gray-400">{icon}</span>}
        {value}
      </span>
    </div>
  );
}
