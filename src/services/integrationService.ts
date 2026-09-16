import { dataService } from './dataService';

export interface EPFOResult {
  uan: string;
  memberId: string;
  establishmentName: string;
  joiningDate: string;
  lastContributionMonth: string;
  activeStatus: boolean;
  wageCategory: string;
  verified: boolean;
}

export interface GSTNResult {
  gstin: string;
  tradeName: string;
  registrationDate: string;
  status: 'Active' | 'Inactive';
  taxpayerType: 'Regular' | 'Composition';
  lastReturnFiling: string;
  verified: boolean;
}

export interface EShramResult {
  uan12Digit: string;
  fullName: string;
  occupation: string;
  registeredDate: string;
  insuranceSchemeLinked: boolean;
  status: 'Active' | 'Pending';
  verified: boolean;
}

export interface SIDHResult {
  certificateId: string;
  candidateId: string;
  courseName: string;
  nsqfLevel: number;
  assessingBody: string;
  issueDate: string;
  verified: boolean;
}

class IntegrationService {
  // Simulate EPFO / UAN Check
  public async verifyEPFO(traineeId: string, uan: string): Promise<EPFOResult> {
    await new Promise((r) => setTimeout(r, 800)); // Network delay simulation

    const trainee = dataService.getTraineeById(traineeId);
    const isValid = uan.length === 12 && /^\d+$/.test(uan);

    const result: EPFOResult = {
      uan,
      memberId: `MH/BAN/00${uan.slice(-6)}/000/0001`,
      establishmentName: trainee?.industry || 'Tata Consultancy Services Ltd',
      joiningDate: trainee?.joiningDate || '2025-05-15',
      lastContributionMonth: 'August 2026',
      activeStatus: isValid,
      wageCategory: trainee?.salary ? `₹${trainee.salary.toLocaleString('en-IN')}` : '₹22,000',
      verified: isValid,
    };

    if (isValid && trainee) {
      dataService.verifyEvidence(
        traineeId,
        'Employer-Verified',
        `Auto-verified via EPFO Gateway (UAN: ${uan}). Active PF contribution detected at ${result.establishmentName}.`
      );
    }

    return result;
  }

  // Simulate GSTN / ITR Check
  public async verifyGSTN(traineeId: string, gstin: string): Promise<GSTNResult> {
    await new Promise((r) => setTimeout(r, 700));

    const trainee = dataService.getTraineeById(traineeId);
    const isValid = gstin.length >= 10;

    const result: GSTNResult = {
      gstin: gstin.toUpperCase(),
      tradeName: trainee ? `${trainee.name} Enterprises` : 'Creative Media Works',
      registrationDate: '2025-06-10',
      status: isValid ? 'Active' : 'Inactive',
      taxpayerType: 'Composition',
      lastReturnFiling: 'Q1 FY 2026-27 (GSTR-4)',
      verified: isValid,
    };

    if (isValid && trainee) {
      dataService.verifyEvidence(
        traineeId,
        'Employer-Verified',
        `Auto-verified via GSTN Gateway (GSTIN: ${gstin.toUpperCase()}). Business actively filing tax returns.`
      );
    }

    return result;
  }

  // Simulate e-Shram Check
  public async verifyEShram(traineeId: string, uan12: string): Promise<EShramResult> {
    await new Promise((r) => setTimeout(r, 600));

    const trainee = dataService.getTraineeById(traineeId);
    const isValid = uan12.length === 12;

    const result: EShramResult = {
      uan12Digit: uan12,
      fullName: trainee?.name || 'Registered Beneficiary',
      occupation: trainee?.jobRole || 'Technician / Data Entry Operator',
      registeredDate: '2025-03-20',
      insuranceSchemeLinked: true,
      status: isValid ? 'Active' : 'Pending',
      verified: isValid,
    };

    if (isValid && trainee) {
      dataService.verifyEvidence(
        traineeId,
        'Evidence-Supported',
        `Cross-referenced with National Unorganized Workers Database (e-Shram: ${uan12}).`
      );
    }

    return result;
  }

  // Simulate SIDH Certification Check
  public async verifySIDH(traineeId: string): Promise<SIDHResult> {
    await new Promise((r) => setTimeout(r, 500));

    const trainee = dataService.getTraineeById(traineeId);
    return {
      certificateId: `SIDH-2025-NSDC-${trainee?.id.replace('T', '') || '101'}`,
      candidateId: trainee?.unifiedId || 'SP-2025-001',
      courseName: trainee?.courseName || 'Data Analytics',
      nsqfLevel: 5,
      assessingBody: 'National Skill Development Corporation (NSDC)',
      issueDate: trainee?.completionDate || '2025-04-20',
      verified: true,
    };
  }
}

export const integrationService = new IntegrationService();
