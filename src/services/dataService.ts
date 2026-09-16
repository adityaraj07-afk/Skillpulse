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

const STORAGE_KEYS = {
  TRAINEES: 'skillpulse_trainees_v1',
  INTERVENTIONS: 'skillpulse_interventions_v1',
  AUDIT_LOGS: 'skillpulse_audit_logs_v1',
};

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

  public resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.TRAINEES);
    localStorage.removeItem(STORAGE_KEYS.INTERVENTIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    this.traineesCache = null;
    this.interventionsCache = null;
    this.auditLogsCache = null;
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
}

export const dataService = new DataService();
