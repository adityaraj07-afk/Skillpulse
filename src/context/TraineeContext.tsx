import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Trainee, type FollowUp } from '@/data/mockData';
import { dataService } from '@/services/dataService';

export type OutcomeStatus =
  | 'Placed'
  | 'Self-Employed'
  | 'Apprenticeship'
  | 'Higher Education'
  | 'Further Training'
  | 'Looking for Work'
  | 'Not Currently Working';

export type VerificationStatus =
  | 'Self-Reported'
  | 'Evidence Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Needs Update';

export interface EvidenceDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  verified?: boolean;
}

export interface OutcomeUpdate {
  employmentStatus: OutcomeStatus;
  verificationStatus: VerificationStatus;
  evidenceDocuments: EvidenceDocument[];
  jobTitle?: string;
  employer?: string;
  joiningDate?: string;
  jobLocation?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | '';
  salaryRange?: string;
  businessType?: string;
  startDate?: string;
  incomeRange?: string;
  organization?: string;
  role?: string;
  stipend?: string;
  apprenticeshipStatus?: 'Ongoing' | 'Completed' | 'Discontinued' | '';
  courseName?: string;
  institutionName?: string;
  location?: string;
  jobRelevance?: 'High' | 'Moderate' | 'Low';
  jobRole?: string;
  industry?: string;
  salaryRangeLegacy?: string;
  jobLocationLegacy?: string;
}

export interface OutcomeUpdateRecord extends OutcomeUpdate {
  submittedAt: string;
  verifierNotes?: string;
  reviewedAt?: string;
}

interface TraineeContextValue {
  traineeId: string;
  trainee: Trainee;
  outcomeUpdate: OutcomeUpdateRecord | null;
  updateOutcome: (update: OutcomeUpdate) => void;
  updateVerificationStatus: (status: VerificationStatus, notes?: string) => void;
  uploadEvidence: (fileName: string, fileType: string) => void;
  followUpUpdates: Record<string, OutcomeUpdateRecord>;
  followUps: FollowUp[];
  updateFollowUp: (period: string, update: OutcomeUpdate) => void;
}

const TraineeContext = createContext<TraineeContextValue | null>(null);

function isEmployedType(status: OutcomeStatus): boolean {
  return status === 'Placed' || status === 'Self-Employed' || status === 'Apprenticeship';
}

function mapStatusToTrainee(status: OutcomeStatus): Trainee['employmentStatus'] {
  switch (status) {
    case 'Placed': return 'Placed';
    case 'Self-Employed': return 'Self-Employed';
    case 'Apprenticeship': return 'Apprenticeship';
    default: return 'Unplaced';
  }
}

function mapVerificationToEvidence(v: VerificationStatus): Trainee['evidence'] {
  switch (v) {
    case 'Verified': return 'Employer-Verified';
    case 'Evidence Submitted': return 'Evidence-Supported';
    case 'Under Review': return 'Under Review';
    default: return 'Self-Reported';
  }
}

export function TraineeProvider({ traineeId, children }: { traineeId: string; children: ReactNode }) {
  const [currentTrainee, setCurrentTrainee] = useState<Trainee>(() => {
    return dataService.getTraineeById(traineeId) || dataService.getTrainees()[0];
  });

  const [outcomeUpdate, setOutcomeUpdate] = useState<OutcomeUpdateRecord | null>(null);
  const [followUpUpdates, setFollowUpUpdates] = useState<Record<string, OutcomeUpdateRecord>>({});

  useEffect(() => {
    const syncTrainee = () => {
      const found = dataService.getTraineeById(traineeId);
      if (found) setCurrentTrainee({ ...found });
    };

    syncTrainee();
    const unsubscribe = dataService.subscribe(syncTrainee);
    return () => unsubscribe();
  }, [traineeId]);

  const updateOutcome = (update: OutcomeUpdate) => {
    const record: OutcomeUpdateRecord = {
      ...update,
      submittedAt: new Date().toLocaleString('en-IN'),
    };
    setOutcomeUpdate(record);

    // Persist changes to real storage service
    dataService.updateOutcome(traineeId, {
      employmentStatus: mapStatusToTrainee(update.employmentStatus),
      jobRole: update.jobTitle || update.businessType || update.role || currentTrainee.jobRole,
      industry: update.employer || update.organization || currentTrainee.industry,
      jobLocation: update.jobLocation || update.location || currentTrainee.jobLocation,
      salaryRange: update.salaryRange || update.incomeRange || update.stipend || currentTrainee.salaryRange,
      evidence: mapVerificationToEvidence(update.verificationStatus),
      jobRelevance: update.jobRelevance || currentTrainee.jobRelevance,
    });
  };

  const updateVerificationStatus = (status: VerificationStatus, notes?: string) => {
    setOutcomeUpdate((prev) =>
      prev
        ? {
            ...prev,
            verificationStatus: status,
            verifierNotes: notes !== undefined ? notes : prev.verifierNotes,
            reviewedAt: new Date().toLocaleString('en-IN'),
          }
        : prev
    );

    dataService.verifyEvidence(traineeId, mapVerificationToEvidence(status), notes);
  };

  const uploadEvidence = (fileName: string, fileType: string) => {
    const doc: EvidenceDocument = {
      id: `doc-${Date.now()}`,
      fileName,
      fileType,
      uploadedAt: new Date().toLocaleString('en-IN'),
      verified: false,
    };

    setOutcomeUpdate((prev) => {
      const existingDocs = prev?.evidenceDocuments || [];
      const updatedDocs = [...existingDocs, doc];
      const newStatus: VerificationStatus = 'Evidence Submitted';

      return {
        ...(prev || {
          employmentStatus: currentTrainee.employmentStatus as OutcomeStatus,
          verificationStatus: newStatus,
          evidenceDocuments: updatedDocs,
        }),
        verificationStatus: newStatus,
        evidenceDocuments: updatedDocs,
        submittedAt: new Date().toLocaleString('en-IN'),
      };
    });

    dataService.verifyEvidence(traineeId, 'Evidence-Supported', `Trainee uploaded evidence file: ${fileName}`);
  };

  const updateFollowUp = (period: string, update: OutcomeUpdate) => {
    setFollowUpUpdates((prev) => ({
      ...prev,
      [period]: { ...update, submittedAt: new Date().toLocaleString('en-IN') },
    }));

    const daysMap: Record<string, number> = {
      '30 Days': 30,
      '90 Days': 90,
      '180 Days': 180,
      '365 Days': 365,
    };
    const days = daysMap[period] || 30;

    dataService.submitFollowUp(traineeId, days, {
      currentStatus: update.employmentStatus === 'Placed' ? 'Employed' : update.employmentStatus === 'Self-Employed' ? 'Self-employed' : 'Looking for work',
      occupation: update.jobTitle || update.jobRole || '',
      employer: update.employer || update.industry || '',
      location: update.jobLocation || update.location || '',
      wageRange: update.salaryRange || '',
      usingSkills: update.jobRelevance === 'High' || update.jobRelevance === 'Moderate',
      needsTraining: false,
      comments: 'Follow-up submitted through Trainee Portal',
    });
  };

  const followUps: FollowUp[] = currentTrainee.followUps.map((f) => {
    const update = followUpUpdates[f.period];
    if (!update) return f;
    const employed = isEmployedType(update.employmentStatus);
    return {
      ...f,
      responded: true,
      employed,
      salary: null,
      relevant: employed && (update.jobRelevance === 'High' || update.jobRelevance === 'Moderate'),
      retained: employed && f.days >= 180,
      livelihoodStatus: employed ? (update.jobRelevance === 'High' ? 'Relevant Employment' : 'Employed (Low Relevance)') : 'Seeking Work',
      evidence: mapVerificationToEvidence(update.verificationStatus),
    };
  });

  return (
    <TraineeContext.Provider
      value={{
        traineeId,
        trainee: { ...currentTrainee, followUps },
        outcomeUpdate,
        updateOutcome,
        updateVerificationStatus,
        uploadEvidence,
        followUpUpdates,
        followUps,
        updateFollowUp,
      }}
    >
      {children}
    </TraineeContext.Provider>
  );
}

export function useTrainee(): TraineeContextValue {
  const ctx = useContext(TraineeContext);
  if (!ctx) throw new Error('useTrainee must be used within TraineeProvider');
  return ctx;
}
