import {
  trainees as defaultTrainees,
  interventions as defaultInterventions,
  auditLogs as defaultAuditLogs,
  type Trainee,
  type Intervention,
  type AuditLog,
  type EvidenceState,
  type ConsentCategoryType,
  type ConsentState,
  type FollowUpFormResponse,
} from '@/data/mockData';

export interface VerifiedProfile {
  id: string;
  skillPulseId: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  guardianName: string;
  district: string;
  state: string;
  aadhaarMasked: string;
  aadhaarToken: string;
  verifiedAt: string;
  validUntil: string;
  dpdpConsent: boolean;
  status: 'Active' | 'Under Audit' | 'Revoked';
  qrHash: string;
}

const STORAGE_KEYS = {
  TRAINEES: 'skillpulse_trainees_v1',
  INTERVENTIONS: 'skillpulse_interventions_v1',
  AUDIT_LOGS: 'skillpulse_audit_logs_v1',
  VERIFIED_PROFILES: 'skillpulse_verified_profiles_v1',
};

const defaultVerifiedProfiles: VerifiedProfile[] = [
  {
    id: 'vp-001',
    skillPulseId: 'SP-2026-IND-8942',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    mobile: '+91 98765 43210',
    dob: '2001-08-14',
    gender: 'Male',
    guardianName: 'Ramesh Sharma',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    aadhaarMasked: 'XXXX XXXX 5821',
    aadhaarToken: 'UIDAI-AUTH-9042-PASS',
    verifiedAt: '2026-08-12',
    validUntil: '2029-08-12',
    dpdpConsent: true,
    status: 'Active',
    qrHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  },
  {
    id: 'vp-002',
    skillPulseId: 'SP-2026-IND-4129',
    fullName: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    mobile: '+91 98123 45678',
    dob: '2002-11-23',
    gender: 'Female',
    guardianName: 'Dinesh Patel',
    district: 'Ahmedabad',
    state: 'Gujarat',
    aadhaarMasked: 'XXXX XXXX 8943',
    aadhaarToken: 'UIDAI-AUTH-6721-PASS',
    verifiedAt: '2026-08-18',
    validUntil: '2029-08-18',
    dpdpConsent: true,
    status: 'Active',
    qrHash: 'sha256:3a4b9c1d8e7f2a5b6c9d0e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
  },
  {
    id: 'vp-003',
    skillPulseId: 'SP-2026-IND-7301',
    fullName: 'Amit Kumar',
    email: 'amit.kumar99@gmail.com',
    mobile: '+91 97234 56789',
    dob: '2000-04-05',
    gender: 'Male',
    guardianName: 'Suresh Kumar',
    district: 'Patna',
    state: 'Bihar',
    aadhaarMasked: 'XXXX XXXX 2390',
    aadhaarToken: 'UIDAI-AUTH-4109-PASS',
    verifiedAt: '2026-08-25',
    validUntil: '2029-08-25',
    dpdpConsent: true,
    status: 'Active',
    qrHash: 'sha256:9f8e7d6c5b4a3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
  },
  {
    id: 'vp-004',
    skillPulseId: 'SP-2026-IND-6194',
    fullName: 'Ananya Roy',
    email: 'ananya.roy@gmail.com',
    mobile: '+91 96345 67890',
    dob: '2003-01-30',
    gender: 'Female',
    guardianName: 'Subhas Roy',
    district: 'Kolkata',
    state: 'West Bengal',
    aadhaarMasked: 'XXXX XXXX 6712',
    aadhaarToken: 'UIDAI-AUTH-8821-PASS',
    verifiedAt: '2026-09-02',
    validUntil: '2029-09-02',
    dpdpConsent: true,
    status: 'Active',
    qrHash: 'sha256:2b4d6f8a0c2e4a6c8e0a2c4e6a8c0e2a4c6e8a0c2e4a6c8e0a2c4e6a8c0e2a4c',
  },
];

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in dataService listener', e);
    }
  });
}

class DataService {
  private traineesCache: Trainee[] | null = null;
  private interventionsCache: Intervention[] | null = null;
  private auditLogsCache: AuditLog[] | null = null;
  private verifiedProfilesCache: VerifiedProfile[] | null = null;

  public subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // --- Trainees ---
  public getTrainees(): Trainee[] {
    if (this.traineesCache) return this.traineesCache;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRAINEES);
      if (stored) {
        this.traineesCache = JSON.parse(stored);
        return this.traineesCache!;
      }
    } catch (e) {
      console.warn('Failed to read trainees from localStorage, using seed data', e);
    }
    this.traineesCache = [...defaultTrainees];
    this.persistTrainees();
    return this.traineesCache;
  }

  public getTraineeById(id: string): Trainee | undefined {
    return this.getTrainees().find((t) => t.id === id || t.unifiedId === id);
  }

  public updateTrainee(updated: Trainee): void {
    const list = this.getTrainees();
    const idx = list.findIndex((t) => t.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.traineesCache = list;
    this.persistTrainees();
    notifyListeners();
  }

  public updateOutcome(traineeId: string, outcomeData: Partial<Trainee>): void {
    const trainee = this.getTraineeById(traineeId);
    if (!trainee) return;

    const updated: Trainee = {
      ...trainee,
      ...outcomeData,
      timeline: [
        ...trainee.timeline,
        {
          id: String(Date.now()),
          stage: 'Outcome',
          title: `Outcome Updated (${outcomeData.employmentStatus || trainee.employmentStatus})`,
          description: outcomeData.jobRole ? `${outcomeData.jobRole} at ${outcomeData.industry || 'Employer'}` : 'Outcome record revised',
          date: new Date().toISOString().split('T')[0],
          evidence: outcomeData.evidence || trainee.evidence || 'Self-Reported',
        },
      ],
    };

    this.updateTrainee(updated);
    this.addAuditLog({
      actor: `Trainee (${trainee.name})`,
      action: `Updated employment status to ${outcomeData.employmentStatus || trainee.employmentStatus}`,
      resource: `${trainee.unifiedId} (${trainee.name})`,
      status: 'Allowed',
      consentStatus: 'Consent Active',
    });
  }

  public verifyEvidence(traineeId: string, newEvidence: EvidenceState, verificationNote?: string): void {
    const trainee = this.getTraineeById(traineeId);
    if (!trainee) return;

    const updated: Trainee = {
      ...trainee,
      evidence: newEvidence,
      timeline: [
        ...trainee.timeline,
        {
          id: String(Date.now()),
          stage: 'Retention',
          title: `Evidence Level Promoted: ${newEvidence}`,
          description: verificationNote || `Administrative verification completed. State changed to ${newEvidence}.`,
          date: new Date().toISOString().split('T')[0],
          evidence: newEvidence,
        },
      ],
    };

    this.updateTrainee(updated);
    this.addAuditLog({
      actor: 'Admin / Verification Gateway',
      action: `Promoted evidence state to ${newEvidence}`,
      resource: `${trainee.unifiedId} (${trainee.name})`,
      status: 'Allowed',
      consentStatus: 'Consent Active',
    });
  }

  public updateConsent(traineeId: string, category: ConsentCategoryType, status: ConsentState): void {
    const trainee = this.getTraineeById(traineeId);
    if (!trainee) return;

    const existingIndex = trainee.consentRecords.findIndex((c) => c.type === category);
    const updatedRecords = [...trainee.consentRecords];

    if (existingIndex >= 0) {
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        status,
        date: new Date().toISOString().split('T')[0],
      };
    } else {
      updatedRecords.push({
        type: category,
        status,
        date: new Date().toISOString().split('T')[0],
        version: 'v2.0',
      });
    }

    this.updateTrainee({ ...trainee, consentRecords: updatedRecords });
    this.addAuditLog({
      actor: `Trainee (${trainee.name})`,
      action: `${status === 'Given' ? 'Granted' : 'Withdrew'} consent for ${category}`,
      resource: 'Own Profile',
      status: 'Allowed',
      consentStatus: `Consent ${status}`,
    });
  }

  public submitFollowUp(traineeId: string, days: number, formResponse: FollowUpFormResponse): void {
    const trainee = this.getTraineeById(traineeId);
    if (!trainee) return;

    const updatedFollowUps = trainee.followUps.map((f) => {
      if (f.days === days) {
        return {
          ...f,
          responded: true,
          status: 'Completed' as const,
          lastContacted: new Date().toISOString().split('T')[0],
          formResponse,
          employed: formResponse.currentStatus === 'Employed' || formResponse.currentStatus === 'Self-employed' || formResponse.currentStatus === 'Apprentice',
          relevant: formResponse.usingSkills,
          evidence: 'Evidence-Supported' as EvidenceState,
        };
      }
      return f;
    });

    const isEmployed = formResponse.currentStatus === 'Employed' || formResponse.currentStatus === 'Self-employed';
    const updated: Trainee = {
      ...trainee,
      followUps: updatedFollowUps,
      employmentStatus: formResponse.currentStatus === 'Self-employed' ? 'Self-Employed' : isEmployed ? 'Placed' : trainee.employmentStatus,
      jobRole: formResponse.occupation || trainee.jobRole,
      industry: formResponse.employer || trainee.industry,
    };

    this.updateTrainee(updated);
  }

  // --- Interventions ---
  public getInterventions(): Intervention[] {
    if (this.interventionsCache) return this.interventionsCache;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
      if (stored) {
        this.interventionsCache = JSON.parse(stored);
        return this.interventionsCache!;
      }
    } catch (e) {
      console.warn('Failed to read interventions from localStorage', e);
    }
    this.interventionsCache = [...defaultInterventions];
    this.persistInterventions();
    return this.interventionsCache;
  }

  public addIntervention(intervention: Intervention): void {
    const list = this.getInterventions();
    list.unshift(intervention);
    this.interventionsCache = list;
    this.persistInterventions();
    notifyListeners();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    if (this.auditLogsCache) return this.auditLogsCache;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) {
        this.auditLogsCache = JSON.parse(stored);
        return this.auditLogsCache!;
      }
    } catch (e) {
      console.warn('Failed to read audit logs from localStorage', e);
    }
    this.auditLogsCache = [...defaultAuditLogs];
    this.persistAuditLogs();
    return this.auditLogsCache;
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const list = this.getAuditLogs();
    const now = new Date();
    const newLog: AuditLog = {
      id: `A${String(list.length + 1).padStart(3, '0')}`,
      timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
      ...entry,
    };
    list.unshift(newLog);
    this.auditLogsCache = list;
    this.persistAuditLogs();
    notifyListeners();
  }

  // --- Verified Profiles ---
  public getVerifiedProfiles(): VerifiedProfile[] {
    if (this.verifiedProfilesCache) return this.verifiedProfilesCache;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VERIFIED_PROFILES);
      if (stored) {
        this.verifiedProfilesCache = JSON.parse(stored);
        return this.verifiedProfilesCache!;
      }
    } catch (e) {
      console.warn('Failed to read verified profiles from localStorage', e);
    }
    this.verifiedProfilesCache = [...defaultVerifiedProfiles];
    this.persistVerifiedProfiles();
    return this.verifiedProfilesCache;
  }

  public addVerifiedProfile(profile: VerifiedProfile): void {
    const list = [...this.getVerifiedProfiles()];
    list.unshift(profile);
    this.verifiedProfilesCache = list;
    this.persistVerifiedProfiles();
    this.addAuditLog({
      action: 'Identity Verified & SkillPulse ID Generated',
      resource: `${profile.fullName} (${profile.skillPulseId})`,
      actor: 'System / UIDAI Gateway',
      status: 'Allowed',
      consentStatus: 'Consent Active',
    });
    notifyListeners();
  }

  public resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.TRAINEES);
    localStorage.removeItem(STORAGE_KEYS.INTERVENTIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.VERIFIED_PROFILES);
    this.traineesCache = null;
    this.interventionsCache = null;
    this.auditLogsCache = null;
    this.verifiedProfilesCache = null;
    notifyListeners();
  }

  private persistTrainees() {
    try {
      if (this.traineesCache) {
        localStorage.setItem(STORAGE_KEYS.TRAINEES, JSON.stringify(this.traineesCache));
      }
    } catch (e) {
      console.warn('Could not persist trainees', e);
    }
  }

  private persistInterventions() {
    try {
      if (this.interventionsCache) {
        localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(this.interventionsCache));
      }
    } catch (e) {
      console.warn('Could not persist interventions', e);
    }
  }

  private persistAuditLogs() {
    try {
      if (this.auditLogsCache) {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogsCache));
      }
    } catch (e) {
      console.warn('Could not persist audit logs', e);
    }
  }

  private persistVerifiedProfiles() {
    try {
      if (this.verifiedProfilesCache) {
        localStorage.setItem(STORAGE_KEYS.VERIFIED_PROFILES, JSON.stringify(this.verifiedProfilesCache));
      }
    } catch (e) {
      console.warn('Could not persist verified profiles', e);
    }
  }
}

export const dataService = new DataService();
