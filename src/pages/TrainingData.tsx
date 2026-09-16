import { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap, Search, Plus, Upload, X, FileUp, CheckCircle2,
  AlertTriangle, Download, Filter, Building, Calendar, BadgeCheck,
  Edit3, Trash2,
} from 'lucide-react';
import { Card, SectionTitle, Badge } from '@/components/ui';
import { trainingStatusColors, csvSampleData, type Trainee, type TrainingStatus } from '@/data/mockData';
import { dataService } from '@/services/dataService';

interface TrainingRecord {
  id: string;
  traineeId: string;
  traineeName: string;
  programme: string;
  course: string;
  provider: string;
  centre: string;
  district: string;
  state: string;
  startDate: string;
  completionDate: string;
  skills: string;
  certificationStatus: TrainingStatus;
}

function toTrainingRecord(t: Trainee): TrainingRecord {
  return {
    id: t.id,
    traineeId: t.unifiedId,
    traineeName: t.name,
    programme: t.cohort,
    course: t.courseName,
    provider: t.providerName,
    centre: t.trainingCentre,
    district: t.district,
    state: t.state,
    startDate: t.startDate,
    completionDate: t.completionDate,
    skills: t.skills.join('; '),
    certificationStatus: t.trainingStatus,
  };
}

export function TrainingData() {
  const [records, setRecords] = useState<TrainingRecord[]>(() => dataService.getTrainees().map(toTrainingRecord));
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setRecords(dataService.getTrainees().map(toTrainingRecord));
    });
    return () => unsub();
  }, []);

  const providers = useMemo(() => [...new Set(records.map((r) => r.provider))], [records]);
  const districts = useMemo(() => [...new Set(records.map((r) => r.district))], [records]);
  const statuses: TrainingStatus[] = ['Enrolled', 'In Training', 'Completed', 'Dropped Out', 'Certified'];

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch = !search ||
        r.traineeName.toLowerCase().includes(search.toLowerCase()) ||
        r.traineeId.toLowerCase().includes(search.toLowerCase()) ||
        r.course.toLowerCase().includes(search.toLowerCase());
      const matchProvider = filterProvider === 'all' || r.provider === filterProvider;
      const matchStatus = filterStatus === 'all' || r.certificationStatus === filterStatus;
      const matchDistrict = filterDistrict === 'all' || r.district === filterDistrict;
      return matchSearch && matchProvider && matchStatus && matchDistrict;
    });
  }, [records, search, filterProvider, filterStatus, filterDistrict]);

  const handleSave = (record: TrainingRecord) => {
    if (editingRecord) {
      setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
    } else {
      setRecords((prev) => [record, ...prev]);
    }

    const existing = dataService.getTraineeById(record.id);
    const updatedTrainee: Trainee = existing
      ? {
          ...existing,
          name: record.traineeName,
          courseName: record.course,
          providerName: record.provider,
          trainingCentre: record.centre,
          district: record.district,
          state: record.state,
          startDate: record.startDate,
          completionDate: record.completionDate,
          skills: record.skills.split(';').map((s) => s.trim()),
          trainingStatus: record.certificationStatus,
        }
      : {
          id: record.id,
          unifiedId: record.traineeId,
          name: record.traineeName,
          age: 23,
          gender: 'Female',
          district: record.district,
          state: record.state,
          education: 'Graduate',
          skills: record.skills.split(';').map((s) => s.trim()),
          courseName: record.course,
          providerId: 'P01',
          providerName: record.provider,
          cohort: record.programme,
          certification: 'NSDC Certificate Level 4',
          certified: record.certificationStatus === 'Certified',
          employmentStatus: 'Unplaced',
          jobRole: null,
          industry: null,
          jobLocation: null,
          joiningDate: null,
          salary: null,
          salaryRange: null,
          jobRelevance: null,
          retentionMonths: 0,
          isRetained: false,
          isApprenticeship: false,
          isSelfEmployed: false,
          evidence: 'Self-Reported',
          followUps: [],
          timeline: [],
          skillReadinessScore: 75,
          skillReadinessBreakdown: [],
          warnings: [],
          trainingStatus: record.certificationStatus,
          dateOfBirth: '2002-05-15',
          phone: '+91 98765 43210',
          email: `${record.traineeName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          institution: 'Skill Academy',
          trainingCentre: record.centre,
          startDate: record.startDate,
          completionDate: record.completionDate,
          consentRecords: [],
        };

    dataService.updateTrainee(updatedTrainee);
    setShowAddModal(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Training Data</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage training records — add manually or import via CSV</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCSVModal(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FileUp className="h-4 w-4" /> CSV Import
          </button>
          <button
            onClick={() => { setEditingRecord(null); setShowAddModal(true); }}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Add Trainee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Records" value={records.length} icon={<GraduationCap className="h-5 w-5" />} color="brand" />
        <StatCard label="Certified" value={records.filter((r) => r.certificationStatus === 'Certified').length} icon={<BadgeCheck className="h-5 w-5" />} color="emerald" />
        <StatCard label="In Training" value={records.filter((r) => r.certificationStatus === 'In Training' || r.certificationStatus === 'Enrolled').length} icon={<Calendar className="h-5 w-5" />} color="amber" />
        <StatCard label="Dropped Out" value={records.filter((r) => r.certificationStatus === 'Dropped Out').length} icon={<AlertTriangle className="h-5 w-5" />} color="rose" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Providers</option>
              {providers.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
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
                <th className="px-4 py-3 font-medium">Programme</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Centre</th>
                <th className="px-4 py-3 font-medium">District</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{r.traineeName}</p>
                    <p className="text-xs text-gray-400">{r.traineeId}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.programme}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.course}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.provider}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.centre}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.district}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <p>{r.startDate}</p>
                    <p className="text-gray-400">{r.completionDate}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${trainingStatusColors[r.certificationStatus]}`}>
                      {r.certificationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setEditingRecord(r); setShowAddModal(true); }}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <Filter className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No records match your filters</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddEditModal
          record={editingRecord}
          onClose={() => { setShowAddModal(false); setEditingRecord(null); }}
          onSave={handleSave}
        />
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <CSVImportModal
          onClose={() => setShowCSVModal(false)}
          onImport={(newRecords) => {
            setRecords((prev) => [...newRecords, ...prev]);
            setShowCSVModal(false);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: 'brand' | 'emerald' | 'amber' | 'rose' }) {
  const colors = {
    brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</span>
      </div>
    </Card>
  );
}

function AddEditModal({ record, onClose, onSave }: { record: TrainingRecord | null; onClose: () => void; onSave: (r: TrainingRecord) => void }) {
  const [form, setForm] = useState<TrainingRecord>(
    record || {
      id: `T${String(Date.now()).slice(-4)}`,
      traineeId: `SP-2025-${String(Date.now()).slice(-5)}`,
      traineeName: '',
      programme: 'DDU-GY',
      course: '',
      provider: 'TechSkill Academy',
      centre: '',
      district: 'Pune',
      state: 'Maharashtra',
      startDate: '2025-06-01',
      completionDate: '2025-09-01',
      skills: '',
      certificationStatus: 'Enrolled',
    }
  );

  const fieldClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{record ? 'Edit Training Record' : 'Add Training Record'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Trainee Name"><input className={fieldClass} value={form.traineeName} onChange={(e) => setForm({ ...form, traineeName: e.target.value })} /></Field>
            <Field label="Trainee ID"><input className={fieldClass} value={form.traineeId} onChange={(e) => setForm({ ...form, traineeId: e.target.value })} /></Field>
            <Field label="Programme"><input className={fieldClass} value={form.programme} onChange={(e) => setForm({ ...form, programme: e.target.value })} /></Field>
            <Field label="Course"><input className={fieldClass} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></Field>
            <Field label="Training Provider"><input className={fieldClass} value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} /></Field>
            <Field label="Training Centre"><input className={fieldClass} value={form.centre} onChange={(e) => setForm({ ...form, centre: e.target.value })} /></Field>
            <Field label="District"><input className={fieldClass} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></Field>
            <Field label="State"><input className={fieldClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></Field>
            <Field label="Start Date"><input type="date" className={fieldClass} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field label="Completion Date"><input type="date" className={fieldClass} value={form.completionDate} onChange={(e) => setForm({ ...form, completionDate: e.target.value })} /></Field>
            <Field label="Skills (semicolon-separated)"><input className={fieldClass} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Python;SQL;Power BI" /></Field>
            <Field label="Certification Status">
              <select className={fieldClass} value={form.certificationStatus} onChange={(e) => setForm({ ...form, certificationStatus: e.target.value as TrainingStatus })}>
                <option value="Enrolled">Enrolled</option>
                <option value="In Training">In Training</option>
                <option value="Completed">Completed</option>
                <option value="Dropped Out">Dropped Out</option>
                <option value="Certified">Certified</option>
              </select>
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
            <button
              onClick={() => form.traineeName && form.course && onSave(form)}
              disabled={!form.traineeName || !form.course}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {record ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function CSVImportModal({ onClose, onImport }: { onClose: () => void; onImport: (records: TrainingRecord[]) => void }) {
  const [step, setStep] = useState<'upload' | 'preview' | 'summary'>('upload');
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<{ valid: TrainingRecord[]; errors: { row: number; errors: string[] }[] }>({ valid: [], errors: [] });

  const handleLoadSample = () => {
    setCsvText(csvSampleData);
    parseCSV(csvSampleData);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map((h) => h.trim());
    const valid: TrainingRecord[] = [];
    const errors: { row: number; errors: string[] }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',').map((c) => c.trim());
      const rowErrors: string[] = [];

      const traineeName = cells[headers.indexOf('Trainee Name')] || '';
      const traineeId = cells[headers.indexOf('Trainee ID')] || '';
      const programme = cells[headers.indexOf('Programme')] || '';
      const course = cells[headers.indexOf('Course')] || '';
      const provider = cells[headers.indexOf('Training Provider')] || '';
      const centre = cells[headers.indexOf('Training Centre')] || '';
      const district = cells[headers.indexOf('District')] || '';
      const state = cells[headers.indexOf('State')] || '';
      const startDate = cells[headers.indexOf('Start Date')] || '';
      const completionDate = cells[headers.indexOf('Completion Date')] || '';
      const skills = cells[headers.indexOf('Skills Acquired')] || '';
      const certStatus = cells[headers.indexOf('Certification Status')] || 'Enrolled';

      if (!traineeName) rowErrors.push('Missing trainee name');
      if (!course) rowErrors.push('Missing course');
      if (!provider) rowErrors.push('Missing provider');
      if (!centre) rowErrors.push('Missing training centre');
      if (!district) rowErrors.push('Missing district');
      if (!completionDate) rowErrors.push('Missing completion date');

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors });
      } else {
        valid.push({
          id: `CSV-${i}`,
          traineeId,
          traineeName,
          programme,
          course,
          provider,
          centre,
          district,
          state,
          startDate,
          completionDate,
          skills,
          certificationStatus: (['Enrolled', 'In Training', 'Completed', 'Dropped Out', 'Certified'].includes(certStatus) ? certStatus : 'Enrolled') as TrainingStatus,
        });
      }
    }

    setParsedRows({ valid, errors });
    setStep('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    onImport(parsedRows.valid);
    setStep('summary');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">CSV Import</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>

          {step === 'upload' && (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                <Upload className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">Upload a CSV file with training records</p>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-3 mx-auto block text-sm text-gray-500" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>
              <button
                onClick={handleLoadSample}
                className="w-full rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300"
              >
                Load Sample CSV Data
              </button>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-xs font-medium text-gray-500">Required columns:</p>
                <p className="mt-1 text-xs text-gray-400">Trainee ID, Trainee Name, Programme, Course, Training Provider, Training Centre, District, State, Start Date, Completion Date, Skills Acquired, Certification Status</p>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500">Total Rows</p>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{parsedRows.valid.length + parsedRows.errors.length}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                  <p className="text-xs text-gray-500">Valid</p>
                  <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{parsedRows.valid.length}</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-3 text-center dark:bg-rose-900/20">
                  <p className="text-xs text-gray-500">Errors</p>
                  <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">{parsedRows.errors.length}</p>
                </div>
              </div>

              {parsedRows.errors.length > 0 && (
                <div className="rounded-lg border border-rose-200 p-4 dark:border-rose-800">
                  <p className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="h-4 w-4" /> Invalid Rows
                  </p>
                  <div className="mt-2 space-y-2">
                    {parsedRows.errors.map((err, i) => (
                      <div key={i} className="text-xs text-rose-600 dark:text-rose-400">
                        Row {err.row}: {err.errors.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedRows.valid.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr className="text-left text-gray-500">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Course</th>
                        <th className="px-3 py-2">Provider</th>
                        <th className="px-3 py-2">District</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.valid.map((r, i) => (
                        <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{r.traineeName}</td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.course}</td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.provider}</td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.district}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${trainingStatusColors[r.certificationStatus]}`}>
                              {r.certificationStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep('upload')} className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
                <button
                  onClick={handleImport}
                  disabled={parsedRows.valid.length === 0}
                  className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
                >
                  Import {parsedRows.valid.length} Valid Records
                </button>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="mt-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white">Import Complete</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500">Imported</p>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{parsedRows.valid.length + parsedRows.errors.length}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                  <p className="text-xs text-gray-500">Successful</p>
                  <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{parsedRows.valid.length}</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
                  <p className="text-xs text-gray-500">Errors</p>
                  <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">{parsedRows.errors.length}</p>
                </div>
              </div>
              <button onClick={onClose} className="mt-5 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700">Done</button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
