export type EvidenceState =
  | 'Self-Reported'
  | 'Evidence-Supported'
  | 'Employer-Verified'
  | 'Under Review'
  | 'Disputed'
  | 'Closed';

export type TrainingStatus = 'Enrolled' | 'In Training' | 'Completed' | 'Dropped Out' | 'Certified';
export type FollowUpMethod = 'WhatsApp' | 'SMS' | 'Email' | 'Phone Call' | 'Assisted Follow-up';
export type FollowUpStatus = 'Pending' | 'Scheduled' | 'Sent' | 'Responded' | 'No Response' | 'Assisted' | 'Completed';

export interface FollowUpCommunicationLog {
  id: string;
  method: FollowUpMethod;
  timestamp: string;
  outcome: 'Sent' | 'Delivered' | 'Responded' | 'No Response' | 'Failed';
  note: string;
}
export type ConsentCategoryType =
  | 'Profile Data'
  | 'Training Data'
  | 'Employment Outcome Data'
  | 'Verification/Evidence'
  | 'Analytics & Programme Improvement';
export type ConsentState = 'Given' | 'Pending' | 'Withdrawn';

export interface ConsentRecord {
  type: ConsentCategoryType;
  status: ConsentState;
  date: string;
  version: string;
}

export interface FollowUpFormResponse {
  currentStatus: 'Employed' | 'Self-employed' | 'Apprentice' | 'Studying' | 'Looking for work' | 'Not currently working' | 'Other';
  occupation: string;
  employer: string;
  location: string;
  wageRange: string;
  usingSkills: boolean;
  needsTraining: boolean;
  comments: string;
}

export interface ConsentCategory {
  type: ConsentCategoryType;
  description: string;
  purpose: string;
  defaultState: ConsentState;
  canWithdraw: boolean;
}

export interface ProviderFollowUpStat {
  providerId: string;
  providerName: string;
  totalTrainees: number;
  followUpsDue: number;
  followUpsCompleted: number;
  noResponse: number;
  overdue: number;
  responseRate: number;
}

export interface FollowUp {
  period: string;
  days: number;
  employed: boolean;
  salary: number | null;
  relevant: boolean;
  retained: boolean;
  livelihoodStatus: string;
  evidence: EvidenceState;
  responded: boolean;
  method?: FollowUpMethod;
  status?: FollowUpStatus;
  dueDate?: string;
  lastContacted?: string | null;
  nextFollowUp?: string | null;
  formResponse?: FollowUpFormResponse | null;
  isOverdue?: boolean;
  communicationLog?: FollowUpCommunicationLog[];
}

export interface TimelineEvent {
  id: string;
  stage: 'Training' | 'Certification' | 'Job Search' | 'Outcome' | 'Follow-up' | 'Retention' | 'Progression';
  title: string;
  description: string;
  date: string;
  evidence: EvidenceState;
}

export interface Trainee {
  id: string;
  unifiedId: string;
  name: string;
  age: number;
  gender: string;
  district: string;
  state: string;
  education: string;
  skills: string[];
  courseName: string;
  providerId: string;
  providerName: string;
  cohort: string;
  certification: string;
  certified: boolean;
  employmentStatus: 'Placed' | 'Self-Employed' | 'Apprenticeship' | 'Unplaced' | 'Unknown';
  jobRole: string | null;
  industry: string | null;
  jobLocation: string | null;
  joiningDate: string | null;
  salary: number | null;
  salaryRange: string | null;
  jobRelevance: 'High' | 'Moderate' | 'Low' | null;
  retentionMonths: number;
  isRetained: boolean;
  isApprenticeship: boolean;
  isSelfEmployed: boolean;
  evidence: EvidenceState;
  followUps: FollowUp[];
  timeline: TimelineEvent[];
  skillReadinessScore: number;
  skillReadinessBreakdown: { factor: string; weight: number; score: number; label: string }[];
  warnings: string[];
  trainingStatus: TrainingStatus;
  dateOfBirth: string;
  phone: string;
  email: string;
  institution: string;
  trainingCentre: string;
  startDate: string;
  completionDate: string;
  consentRecords: ConsentRecord[];
}

export interface Provider {
  id: string;
  name: string;
  district: string;
  traineesTotal: number;
  placementRate: number;
  relevantEmploymentRate: number;
  retentionRate: number;
  evidenceCoverage: number;
  skillRelevance: number;
  avgWage: number;
  cohortSize: number;
  sampleSize: number;
  coverageScore: number;
  evidenceQuality: number;
}

export interface Intervention {
  id: string;
  problem: string;
  diagnosis: string;
  action: string;
  owner: string;
  targetMetric: string;
  baseline: number;
  target: number;
  status: 'Proposed' | 'In Progress' | 'Completed';
  date: string;
  cohortApplied: string;
  linkedCohort: string | null;
  interventionType?: string;
  assignedPerson?: string;
  result?: string;
  linkedWarningId?: string;
  traineeId?: string;
  traineeName?: string;
}

export interface CohortComparison {
  metric: string;
  previousCohort: string;
  previousValue: number;
  nextCohort: string;
  nextValue: number;
  intervention: string;
  observedChange: number;
  previousEvidenceCoverage: number;
  nextEvidenceCoverage: number;
  previousSampleSize: number;
  nextSampleSize: number;
}

export interface EarlyWarning {
  id: string;
  traineeId: string;
  traineeName: string;
  type: 'Non-Placement Risk' | 'Low Follow-up Response' | 'Low Job Relevance' | 'Retention Risk' | 'Emerging Skill Gap' | 'Unusual Outcome' | 'Low Evidence Confidence' | 'Declining Retention' | 'No Follow-up Response' | 'Employment Loss' | 'Low Retention' | 'Skill Mismatch' | 'Pending Verification';
  severity: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low Risk' | 'Medium Risk' | 'Needs Attention';
  reason: string;
  confidence: number;
  recommendation: string;
  insufficientEvidence: boolean;
  interventionType?: string;
}

export interface DistrictData {
  district: string;
  state: string;
  highDemandSkills: string[];
  trainingAvailable: string[];
  shortages: string[];
  employmentOutcome: number;
  traineesTrained: number;
  traineesPlaced: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  status: 'Allowed' | 'Denied';
  consentStatus: string;
}

// ---------- Evidence state metadata ----------
export const evidenceColors: Record<EvidenceState, string> = {
  'Self-Reported': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'Evidence-Supported': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Employer-Verified': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Under Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Disputed': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'Closed': 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500',
};

export const evidenceIcons: Record<EvidenceState, string> = {
  'Self-Reported': 'Self-Reported',
  'Evidence-Supported': 'Evidence-Supported',
  'Employer-Verified': 'Verified',
  'Under Review': 'Under Review',
  'Disputed': 'Disputed',
  'Closed': 'Closed',
};

// ---------- Trainees ----------
const traineeNames = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Verma', 'Ananya Reddy', 'Karthik Nair',
  'Meera Iyer', 'Vikram Singh', 'Divya Gupta', 'Arjun Kumar', 'Sneha Joshi',
  'Rahul Mehta', 'Pooja Desai', 'Sanjay Rao', 'Kavya Krishnan', 'Aditya Yadav',
  'Isha Agarwal', 'Nikhil Saxena', 'Tanvi Bhat', 'Manish Pandey', 'Ritu Malhotra',
  'Saurabh Tiwari', 'Nisha Nair', 'Gaurav Mishra', 'Falguni Shah', 'Yash Rathore',
  'Deepika Pillai', 'Rajesh Khanna', 'Aishwarya Menon', 'Tarun Kapoor', 'Shreya Bhatnagar',
];

const districts = ['Pune', 'Hyderabad', 'Bengaluru', 'Chennai', 'Indore', 'Jaipur', 'Lucknow', 'Bhopal'];
const states = ['Maharashtra', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'];
const courses = ['Data Analytics', 'Full Stack Web Dev', 'Digital Marketing', 'AI & ML Fundamentals', 'Cloud Computing'];
const industries = ['IT Services', 'E-commerce', 'Banking & Finance', 'Manufacturing', 'Healthcare', 'Retail'];
const jobRoles = ['Junior Data Analyst', 'Frontend Developer', 'SEO Specialist', 'ML Trainee', 'Cloud Associate', 'Operations Executive', 'Customer Support', 'Field Sales Executive'];
const allSkills = ['Python', 'SQL', 'Machine Learning', 'Excel', 'Power BI', 'Cloud (AWS)', 'React', 'Node.js', 'Digital Marketing', 'SEO', 'Data Visualization', 'Tableau'];
const skillGaps = ['Cloud (AWS)', 'Power BI', 'Tableau', 'Communication Skills'];

function makeFollowUps(baseSalary: number, placed: boolean, relevant: boolean): FollowUp[] {
  const periods = [
    { period: '30 Days', days: 30 },
    { period: '90 Days', days: 90 },
    { period: '180 Days', days: 180 },
    { period: '365 Days', days: 365 },
  ];
  const evidences: EvidenceState[] = ['Self-Reported', 'Evidence-Supported', 'Employer-Verified', 'Evidence-Supported'];
  const methods: FollowUpMethod[] = ['WhatsApp', 'SMS', 'Email', 'Phone Call', 'Assisted Follow-up'];
  const dueDates = ['2025-06-10', '2025-08-10', '2025-11-10', '2026-05-10'];

  return periods.map((p, i) => {
    const dropOff = i >= 2 && Math.random() < 0.15;
    const stillEmployed = placed && !dropOff;
    const salaryGrowth = stillEmployed ? Math.round(baseSalary * (1 + i * 0.05)) : null;
    const responded = Math.random() > 0.18;
    const isOverdueFlag = !responded && i < 3 && Math.random() > 0.5;
    const method = methods[i % methods.length];
    let status: FollowUpStatus;
    if (responded) {
      status = i === 3 ? 'Completed' : 'Responded';
    } else if (isOverdueFlag) {
      status = 'No Response';
    } else if (i === 0) {
      status = 'Pending';
    } else if (method === 'Assisted Follow-up') {
      status = 'Assisted';
    } else {
      status = 'Sent';
    }

    // Build communication log
    const commLog: FollowUpCommunicationLog[] = [];
    if (i > 0 || responded) {
      commLog.push({
        id: `${p.period}-c1`,
        method,
        timestamp: `${dueDates[i]} 10:00`,
        outcome: responded ? 'Responded' : 'Delivered',
        note: responded ? 'Trainee responded to follow-up' : 'Message delivered, awaiting response',
      });
    }
    if (isOverdueFlag) {
      commLog.push({
        id: `${p.period}-c2`,
        method: 'Phone Call',
        timestamp: `${dueDates[i]} 15:30`,
        outcome: 'No Response',
        note: 'Attempted phone call — no answer. Flagged as overdue.',
      });
    }
    if (method === 'Assisted Follow-up') {
      commLog.push({
        id: `${p.period}-c3`,
        method: 'Assisted Follow-up',
        timestamp: `${dueDates[i]} 12:00`,
        outcome: 'Sent',
        note: 'Field staff assisting trainee to complete follow-up form',
      });
    }

    return {
      period: p.period,
      days: p.days,
      employed: stillEmployed,
      salary: salaryGrowth,
      relevant: stillEmployed ? relevant && Math.random() > 0.2 : false,
      retained: stillEmployed && i >= 2,
      livelihoodStatus: stillEmployed ? (relevant ? 'Relevant Employment' : 'Employed (Low Relevance)') : 'Seeking Work',
      evidence: evidences[i],
      responded,
      method,
      status,
      dueDate: dueDates[i],
      lastContacted: responded ? dueDates[i] : i > 0 ? dueDates[i - 1] : null,
      nextFollowUp: i < 3 ? dueDates[i + 1] : null,
      isOverdue: isOverdueFlag,
      communicationLog: commLog,
      formResponse: responded ? {
        currentStatus: stillEmployed ? 'Employed' : 'Looking for work',
        occupation: stillEmployed ? jobRoles[i % jobRoles.length] : '',
        employer: stillEmployed ? industries[i % industries.length] : '',
        location: stillEmployed ? districts[i % districts.length] : '',
        wageRange: salaryGrowth ? `₹${salaryGrowth.toLocaleString('en-IN')} – ₹${(salaryGrowth + 3000).toLocaleString('en-IN')}` : '',
        usingSkills: stillEmployed ? relevant : false,
        needsTraining: !stillEmployed || Math.random() > 0.7,
        comments: stillEmployed && Math.random() > 0.8 ? 'Looking for opportunities to upskill in advanced topics.' : '',
      } : null,
    };
  });
}

function makeTimeline(trainee: Partial<Trainee>): TimelineEvent[] {
  return [
    {
      id: '1',
      stage: 'Training',
      title: 'Enrolled in ' + (trainee.courseName || 'Course'),
      description: `Started training at ${trainee.providerName}`,
      date: '2025-01-15',
      evidence: 'Evidence-Supported',
    },
    {
      id: '2',
      stage: 'Certification',
      title: trainee.certified ? 'Certification Completed' : 'Certification Pending',
      description: trainee.certification || 'Certification',
      date: '2025-04-20',
      evidence: trainee.certified ? 'Employer-Verified' : 'Under Review',
    },
    {
      id: '3',
      stage: 'Job Search',
      title: trainee.employmentStatus === 'Unplaced' ? 'Job Search Ongoing' : 'Job Search Initiated',
      description: trainee.employmentStatus === 'Unplaced' ? 'Actively seeking employment through district employment exchange' : 'Applied to roles matching training profile',
      date: '2025-04-25',
      evidence: 'Self-Reported',
    },
    {
      id: '4',
      stage: 'Outcome',
      title: trainee.employmentStatus === 'Placed' ? 'Placement Recorded' : trainee.employmentStatus === 'Self-Employed' ? 'Self-Employment Started' : trainee.employmentStatus === 'Apprenticeship' ? 'Apprenticeship Began' : 'Seeking Employment',
      description: trainee.jobRole ? `${trainee.jobRole} at ${trainee.industry}` : 'No placement yet',
      date: '2025-05-10',
      evidence: trainee.evidence || 'Self-Reported',
    },
    {
      id: '5',
      stage: 'Follow-up',
      title: '30-Day Follow-up',
      description: 'Initial employment verification',
      date: '2025-06-10',
      evidence: 'Evidence-Supported',
    },
    {
      id: '6',
      stage: 'Retention',
      title: trainee.isRetained ? '6-Month Retention Confirmed' : 'Retention Pending',
      description: trainee.isRetained ? `Retained for ${trainee.retentionMonths} months` : 'Follow-up in progress',
      date: '2025-11-10',
      evidence: trainee.isRetained ? 'Employer-Verified' : 'Under Review',
    },
    {
      id: '7',
      stage: 'Progression',
      title: 'Career Progression Check',
      description: trainee.isRetained ? 'Monitoring for promotion/salary growth' : 'Awaiting stability',
      date: '2026-05-10',
      evidence: 'Self-Reported',
    },
  ];
}

const consentCategories: ConsentCategory[] = [
  {
    type: 'Profile Data',
    description: 'Your name, contact details, district, and education background',
    purpose: 'Used to identify you and match you with relevant training programmes. Your employment outcome information helps SkillPulse measure whether training programmes are leading to real-world opportunities.',
    defaultState: 'Pending',
    canWithdraw: true,
  },
  {
    type: 'Training Data',
    description: 'Your course, provider, skills acquired, and certification status',
    purpose: 'Tracks your training progress and builds your Skill Passport. This data is visible to your training provider.',
    defaultState: 'Pending',
    canWithdraw: false,
  },
  {
    type: 'Employment Outcome Data',
    description: 'Your job role, salary range, industry, and employment status after training',
    purpose: 'Measures whether training programmes lead to real jobs. Helps improve future curriculum and placement support.',
    defaultState: 'Pending',
    canWithdraw: true,
  },
  {
    type: 'Verification/Evidence',
    description: 'Evidence documents and employer verification records',
    purpose: 'Strengthens confidence in reported outcomes. Employers can verify your employment without accessing your full profile.',
    defaultState: 'Pending',
    canWithdraw: true,
  },
  {
    type: 'Analytics & Programme Improvement',
    description: 'Aggregated and anonymized data used for programme analysis',
    purpose: 'Your data is combined with others and anonymized to identify trends, gaps, and improvement opportunities. No individual is identifiable.',
    defaultState: 'Pending',
    canWithdraw: true,
  },
];

function generateConsentRecords(traineeIndex: number): ConsentRecord[] {
  const consentVersion = 'v1.0';
  const baseDate = '2025-01-20';
  const withdrawDate = '2025-08-05';
  return consentCategories.map((cat, i) => {
    // Most trainees have given consent; some have pending or withdrawn
    const stateRoll = (traineeIndex + i) % 5;
    const status: ConsentState = stateRoll === 0 ? 'Withdrawn' : stateRoll === 1 && i >= 2 ? 'Pending' : 'Given';
    return {
      type: cat.type,
      status,
      date: status === 'Withdrawn' ? withdrawDate : baseDate,
      version: consentVersion,
    };
  });
}

function generateTrainees(): Trainee[] {
  const trainees: Trainee[] = [];
  const providers = [
    { id: 'P01', name: 'TechSkill Academy' },
    { id: 'P02', name: 'Digital India Training Centre' },
    { id: 'P03', name: 'SkillBridge Institute' },
    { id: 'P04', name: 'FutureTech Learning Hub' },
  ];
  const cohorts = ['Cohort 2025-A', 'Cohort 2025-B', 'Cohort 2025-C'];

  for (let i = 0; i < 30; i++) {
    const name = traineeNames[i];
    const districtIdx = i % districts.length;
    const provider = providers[i % providers.length];
    const course = courses[i % courses.length];
    const cohort = cohorts[i % cohorts.length];

    const placed = Math.random() > 0.18;
    const selfEmployed = !placed && Math.random() > 0.6;
    const apprenticeship = !placed && !selfEmployed && Math.random() > 0.5;
    const unplaced = !placed && !selfEmployed && !apprenticeship;
    const unknown = false;

    const status: Trainee['employmentStatus'] = placed ? 'Placed' : selfEmployed ? 'Self-Employed' : apprenticeship ? 'Apprenticeship' : unplaced ? 'Unplaced' : 'Unknown';

    const baseSalary = placed ? 12000 + Math.round(Math.random() * 18000) : selfEmployed ? 8000 + Math.round(Math.random() * 12000) : apprenticeship ? 5000 + Math.round(Math.random() * 5000) : null;

    const relevant = placed ? Math.random() > 0.3 : false;
    const jobRelevance: Trainee['jobRelevance'] = placed ? (relevant ? (Math.random() > 0.4 ? 'High' : 'Moderate') : 'Low') : null;

    const skills = [...allSkills].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
    const hasGap = Math.random() > 0.5;

    const retentionMonths = placed ? Math.random() > 0.35 ? 6 + Math.floor(Math.random() * 6) : Math.floor(Math.random() * 4) : 0;
    const isRetained = placed && retentionMonths >= 6;

    const evidenceOptions: EvidenceState[] = ['Self-Reported', 'Evidence-Supported', 'Employer-Verified', 'Under Review'];
    const evidence = placed ? evidenceOptions[Math.floor(Math.random() * evidenceOptions.length)] : 'Self-Reported';

    const salaryRange = baseSalary ? `₹${baseSalary.toLocaleString('en-IN')} – ₹${(baseSalary + 5000).toLocaleString('en-IN')}` : null;

    const followUps = makeFollowUps(baseSalary || 0, placed, relevant);

    const isCertified = Math.random() > 0.1;

    const score = Math.round(
      40 +
        (placed ? 20 : 0) +
        (relevant ? 15 : 0) +
        (isRetained ? 10 : 0) +
        (evidence === 'Employer-Verified' ? 8 : evidence === 'Evidence-Supported' ? 5 : 0) +
        (hasGap ? -5 : 5) +
        Math.random() * 5
    );

    const trainee: Trainee = {
      id: `T${String(i + 1).padStart(3, '0')}`,
      unifiedId: `SP-2025-${String(i + 1).padStart(5, '0')}`,
      name,
      age: 19 + Math.floor(Math.random() * 12),
      gender: i % 2 === 0 ? 'Male' : 'Female',
      district: districts[districtIdx],
      state: states[districtIdx],
      education: ['12th Pass', 'Graduate', 'Diploma', 'ITI'][i % 4],
      skills,
      courseName: course,
      providerId: provider.id,
      providerName: provider.name,
      cohort,
      certification: `${course} Certificate`,
      certified: isCertified,
      employmentStatus: status,
      jobRole: placed ? jobRoles[i % jobRoles.length] : null,
      industry: placed ? industries[i % industries.length] : null,
      jobLocation: placed ? districts[districtIdx] : null,
      joiningDate: placed ? '2025-05-15' : null,
      salary: baseSalary,
      salaryRange,
      jobRelevance,
      retentionMonths,
      isRetained,
      isApprenticeship: apprenticeship,
      isSelfEmployed: selfEmployed,
      evidence,
      followUps,
      timeline: [],
      skillReadinessScore: Math.min(100, Math.max(20, score)),
      skillReadinessBreakdown: [
        { factor: 'Skill Alignment', weight: 25, score: Math.min(100, Math.round((skills.filter(s => !skillGaps.includes(s)).length / skills.length) * 100)), label: 'How well trainee skills match market demand' },
        { factor: 'Evidence Confidence', weight: 20, score: evidence === 'Employer-Verified' ? 95 : evidence === 'Evidence-Supported' ? 75 : evidence === 'Under Review' ? 40 : 20, label: 'Strength of outcome evidence' },
        { factor: 'Employment Relevance', weight: 25, score: relevant ? (jobRelevance === 'High' ? 90 : jobRelevance === 'Moderate' ? 65 : 30) : placed ? 25 : 10, label: 'Relevance of employment to training' },
        { factor: 'Retention/Progression', weight: 20, score: isRetained ? 85 : placed ? 35 : 10, label: 'Employment duration and growth' },
        { factor: 'Market Alignment', weight: 10, score: Math.min(100, Math.round((skills.filter(s => !skillGaps.includes(s)).length / skills.length) * 80 + (hasGap ? 0 : 20))), label: 'Alignment with local job market' },
      ],
      warnings: [],
      trainingStatus: isCertified ? 'Certified' : placed ? 'Completed' : Math.random() > 0.1 ? 'Completed' : i % 7 === 0 ? 'Dropped Out' : i % 5 === 0 ? 'In Training' : 'Enrolled',
      dateOfBirth: `${2000 + i % 6}-0${(i % 9) + 1}-${String(5 + (i % 20)).padStart(2, '0')}`,
      phone: `+91-${String(90000 + i).slice(0, 5)}-${String(10000 + i * 37).slice(0, 5)}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.example`,
      institution: ['Govt Polytechnic', 'ITI Training Centre', 'Skill Development Institute'][i % 3],
      trainingCentre: `${provider.name} — ${districts[districtIdx]} Centre`,
      startDate: '2025-01-15',
      completionDate: '2025-04-15',
      consentRecords: generateConsentRecords(i),
    };

    trainee.timeline = makeTimeline(trainee);

    // Warnings
    if (!placed) trainee.warnings.push('Non-Placement Risk');
    if (placed && !relevant) trainee.warnings.push('Low Job Relevance');
    if (placed && !isRetained && retentionMonths < 3) trainee.warnings.push('Retention Risk');
    if (followUps.some((f) => !f.responded)) trainee.warnings.push('Low Follow-up Response');
    if (hasGap) trainee.warnings.push('Emerging Skill Gap');

    trainees.push(trainee);
  }
  return trainees;
}

export const trainees: Trainee[] = generateTrainees();

// ---------- KPIs ----------
export const kpis = {
  totalTrainees: trainees.length,
  employmentRate: Math.round((trainees.filter((t) => t.employmentStatus === 'Placed' || t.employmentStatus === 'Self-Employed' || t.employmentStatus === 'Apprenticeship').length / trainees.length) * 100),
  relevantEmploymentRate: Math.round((trainees.filter((t) => t.jobRelevance === 'High' || t.jobRelevance === 'Moderate').length / trainees.length) * 100),
  retentionRate: Math.round((trainees.filter((t) => t.isRetained).length / trainees.filter((t) => t.employmentStatus === 'Placed').length) * 100),
  evidenceCoverage: Math.round((trainees.filter((t) => t.evidence !== 'Self-Reported').length / trainees.length) * 100),
  selfEmploymentRate: Math.round((trainees.filter((t) => t.isSelfEmployed).length / trainees.length) * 100),
  apprenticeshipRate: Math.round((trainees.filter((t) => t.isApprenticeship).length / trainees.length) * 100),
  skillGaps: 4,
  traineesPlaced: trainees.filter((t) => t.employmentStatus === 'Placed').length,
  traineesRelevant: trainees.filter((t) => t.jobRelevance === 'High' || t.jobRelevance === 'Moderate').length,
  traineesRetained: trainees.filter((t) => t.isRetained).length,
  traineesEvidence: trainees.filter((t) => t.evidence !== 'Self-Reported').length,
  traineesSelfEmployed: trainees.filter((t) => t.isSelfEmployed).length,
  traineesApprenticeship: trainees.filter((t) => t.isApprenticeship).length,
  followUpCoverage: Math.round((trainees.filter((t) => t.followUps.every((f) => f.responded)).length / trainees.length) * 100),
};

// ---------- Outcome Funnel ----------
export const outcomeFunnel = [
  { stage: 'Enrolled', value: 100, count: trainees.length },
  { stage: 'Certified', value: 91, count: trainees.filter((t) => t.certified).length },
  { stage: 'Initial Placement', value: 82, count: trainees.filter((t) => t.employmentStatus === 'Placed').length },
  { stage: 'Relevant Employment', value: 57, count: trainees.filter((t) => t.jobRelevance === 'High' || t.jobRelevance === 'Moderate').length },
  { stage: '6-Month Retention', value: 44, count: trainees.filter((t) => t.isRetained).length },
  { stage: 'Evidence-Supported', value: 38, count: trainees.filter((t) => t.evidence === 'Evidence-Supported' || t.evidence === 'Employer-Verified').length },
  { stage: 'Progression Observed', value: 22, count: Math.round(trainees.filter((t) => t.isRetained).length * 0.5) },
];

// ---------- Non-placement reasons ----------
export const nonPlacementReasons = [
  { reason: 'Skill Mismatch', count: 5, percentage: 28 },
  { reason: 'Salary Mismatch', count: 4, percentage: 22 },
  { reason: 'Lack of Vacancies', count: 3, percentage: 17 },
  { reason: 'Interview Readiness', count: 3, percentage: 17 },
  { reason: 'Location Constraint', count: 2, percentage: 11 },
  { reason: 'Other', count: 1, percentage: 5 },
];

// ---------- Wage progression ----------
export const wageProgression = [
  { month: 'Month 1', wage: 18500, market: 20000 },
  { month: 'Month 3', wage: 19000, market: 21000 },
  { month: 'Month 6', wage: 21000, market: 23000 },
  { month: 'Month 9', wage: 22500, market: 24500 },
  { month: 'Month 12', wage: 25000, market: 27000 },
];

// ---------- Skills vs Demand ----------
export const skillsVsDemand = [
  { skill: 'Python', training: 85, demand: 90 },
  { skill: 'SQL', training: 78, demand: 82 },
  { skill: 'Machine Learning', training: 65, demand: 75 },
  { skill: 'Cloud (AWS)', training: 20, demand: 88 },
  { skill: 'Power BI', training: 15, demand: 72 },
  { skill: 'Tableau', training: 10, demand: 60 },
  { skill: 'React', training: 55, demand: 65 },
  { skill: 'Digital Marketing', training: 70, demand: 58 },
];

// ---------- Employment & Retention trend ----------
export const employmentRetentionTrend = [
  { month: 'May', employment: 82, retention: 100 },
  { month: 'Jun', employment: 80, retention: 95 },
  { month: 'Jul', employment: 78, retention: 88 },
  { month: 'Aug', employment: 76, retention: 82 },
  { month: 'Sep', employment: 73, retention: 75 },
  { month: 'Oct', employment: 70, retention: 68 },
  { month: 'Nov', employment: 68, retention: 62 },
  { month: 'Dec', employment: 65, retention: 57 },
];

// ---------- Skill Gap AI ----------
export const skillGapData = {
  taughtSkills: ['Python', 'SQL', 'Machine Learning', 'React', 'Digital Marketing'],
  demandedSkills: ['Python', 'SQL', 'Machine Learning', 'Cloud (AWS)', 'Power BI', 'Tableau', 'React', 'Digital Marketing'],
  missingSkills: [
    { skill: 'Cloud (AWS)', demandLevel: 88, trainingLevel: 20, severity: 'Critical' },
    { skill: 'Power BI', demandLevel: 72, trainingLevel: 15, severity: 'High' },
    { skill: 'Tableau', demandLevel: 60, trainingLevel: 10, severity: 'Medium' },
  ],
  emergingSkills: [
    { skill: 'Generative AI', trend: 'Rapidly Growing', relevance: 92 },
    { skill: 'DevOps', trend: 'Growing', relevance: 78 },
    { skill: 'Cybersecurity', trend: 'Growing', relevance: 85 },
  ],
  matchingSkills: [
    { skill: 'Python', trainingLevel: 85, demandLevel: 90, alignment: 94 },
    { skill: 'SQL', trainingLevel: 78, demandLevel: 82, alignment: 95 },
    { skill: 'Machine Learning', trainingLevel: 65, demandLevel: 75, alignment: 87 },
    { skill: 'React', trainingLevel: 55, demandLevel: 65, alignment: 85 },
    { skill: 'Digital Marketing', trainingLevel: 70, demandLevel: 58, alignment: 100 },
  ],
  recommendationExplanations: [
    { recommendation: 'Introduce a 40-hour Cloud (AWS) practical module covering EC2, S3, and IAM fundamentals.', explanation: 'Cloud (AWS) appears in 88% of job postings but only 20% of training curricula. Adding this module directly addresses the largest identified gap with the highest potential impact on relevant employment.' },
    { recommendation: 'Add Power BI dashboard creation exercises using real-world datasets.', explanation: 'Power BI demand is at 72% but training coverage is only 15%. Practical exercises would close this gap and improve data visualization employability.' },
    { recommendation: 'Incorporate a Tableau data visualization sprint in the final 2 weeks.', explanation: 'Tableau shows 60% demand with 10% training coverage. A focused sprint is efficient because Tableau shares concepts with Power BI training.' },
    { recommendation: 'Add communication and interview readiness workshops.', explanation: 'Non-placement reasons include interview readiness (17%). Soft skills workshops address this without requiring curriculum restructuring.' },
  ],
  insufficientEvidenceNote: 'For 2 districts (Indore, Jaipur), job posting data is older than 6 months. Confidence in demand estimates for these districts is reduced. Recommendations for those areas are marked as tentative.',
  alignmentPercentage: 64,
  recommendations: [
    'Introduce a 40-hour Cloud (AWS) practical module covering EC2, S3, and IAM fundamentals.',
    'Add Power BI dashboard creation exercises using real-world datasets.',
    'Incorporate a Tableau data visualization sprint in the final 2 weeks.',
    'Add communication and interview readiness workshops.',
  ],
  curriculumSuggestions: [
    'Replace 15% of theoretical ML content with Cloud labs.',
    'Add a bi-weekly industry guest session on emerging tools.',
    'Introduce a capstone project requiring Power BI + Cloud deployment.',
  ],
  aiConfidence: 82,
  aiExplanation: 'Based on analysis of 240 job postings from 4 districts, cross-referenced with training curricula from 4 providers. Cloud (AWS) appears in 88% of postings but only 20% of curricula. Power BI shows 72% demand with 15% training coverage.',
};

// ---------- Target Job Profiles (for Skill Gap Analysis) ----------
export interface TargetJobProfile {
  id: string;
  title: string;
  industry: string;
  requiredSkills: { skill: string; importance: 'Critical' | 'Important' | 'Preferred'; demandLevel: number }[];
  avgSalaryRange: string;
  description: string;
}

export const targetJobProfiles: TargetJobProfile[] = [
  {
    id: 'job-01',
    title: 'Junior Data Analyst',
    industry: 'IT Services',
    avgSalaryRange: '₹18,000 – ₹28,000',
    description: 'Entry-level data analysis role requiring SQL, Python, and visualization skills.',
    requiredSkills: [
      { skill: 'Python', importance: 'Critical', demandLevel: 90 },
      { skill: 'SQL', importance: 'Critical', demandLevel: 88 },
      { skill: 'Excel', importance: 'Critical', demandLevel: 85 },
      { skill: 'Power BI', importance: 'Important', demandLevel: 72 },
      { skill: 'Tableau', importance: 'Important', demandLevel: 60 },
      { skill: 'Data Visualization', importance: 'Important', demandLevel: 70 },
    ],
  },
  {
    id: 'job-02',
    title: 'Frontend Developer',
    industry: 'IT Services',
    avgSalaryRange: '₹22,000 – ₹35,000',
    description: 'Web development role focused on React and modern JavaScript frameworks.',
    requiredSkills: [
      { skill: 'React', importance: 'Critical', demandLevel: 88 },
      { skill: 'Node.js', importance: 'Important', demandLevel: 65 },
      { skill: 'Python', importance: 'Preferred', demandLevel: 40 },
      { skill: 'Cloud (AWS)', importance: 'Important', demandLevel: 70 },
    ],
  },
  {
    id: 'job-03',
    title: 'ML Trainee',
    industry: 'IT Services',
    avgSalaryRange: '₹20,000 – ₹32,000',
    description: 'Machine learning role requiring Python, ML fundamentals, and data skills.',
    requiredSkills: [
      { skill: 'Python', importance: 'Critical', demandLevel: 92 },
      { skill: 'Machine Learning', importance: 'Critical', demandLevel: 85 },
      { skill: 'SQL', importance: 'Important', demandLevel: 75 },
      { skill: 'Cloud (AWS)', importance: 'Important', demandLevel: 80 },
      { skill: 'Data Visualization', importance: 'Preferred', demandLevel: 55 },
    ],
  },
  {
    id: 'job-04',
    title: 'Cloud Associate',
    industry: 'IT Services',
    avgSalaryRange: '₹25,000 – ₹40,000',
    description: 'Cloud infrastructure role requiring AWS knowledge and scripting skills.',
    requiredSkills: [
      { skill: 'Cloud (AWS)', importance: 'Critical', demandLevel: 95 },
      { skill: 'Python', importance: 'Important', demandLevel: 70 },
      { skill: 'SQL', importance: 'Preferred', demandLevel: 50 },
      { skill: 'Node.js', importance: 'Preferred', demandLevel: 45 },
    ],
  },
  {
    id: 'job-05',
    title: 'Digital Marketing Executive',
    industry: 'E-commerce',
    avgSalaryRange: '₹15,000 – ₹25,000',
    description: 'Digital marketing role requiring SEO, content, and analytics skills.',
    requiredSkills: [
      { skill: 'Digital Marketing', importance: 'Critical', demandLevel: 90 },
      { skill: 'SEO', importance: 'Critical', demandLevel: 85 },
      { skill: 'Excel', importance: 'Important', demandLevel: 70 },
      { skill: 'Power BI', importance: 'Preferred', demandLevel: 40 },
    ],
  },
  {
    id: 'job-06',
    title: 'SEO Specialist',
    industry: 'E-commerce',
    avgSalaryRange: '₹18,000 – ₹30,000',
    description: 'Search engine optimization role requiring SEO and content analysis skills.',
    requiredSkills: [
      { skill: 'SEO', importance: 'Critical', demandLevel: 92 },
      { skill: 'Digital Marketing', importance: 'Critical', demandLevel: 80 },
      { skill: 'Excel', importance: 'Important', demandLevel: 65 },
      { skill: 'Data Visualization', importance: 'Preferred', demandLevel: 45 },
    ],
  },
];

// ---------- Skill proficiency levels (synthetic per-trainee) ----------
export function getTraineeSkillProficiency(traineeSkills: string[]): Record<string, number> {
  const proficiency: Record<string, number> = {};
  for (const skill of traineeSkills) {
    const baseScore = 55 + Math.floor(Math.abs(Math.sin(skill.length * 7)) * 35);
    proficiency[skill] = Math.min(95, baseScore);
  }
  return proficiency;
}

// ---------- Training recommendations for missing skills ----------
export interface TrainingRecommendation {
  skill: string;
  courseName: string;
  duration: string;
  provider: string;
  format: 'Online' | 'Hybrid' | 'Self-paced';
  estimatedCost: string;
  reason: string;
}

export const trainingRecommendations: Record<string, TrainingRecommendation> = {
  'Cloud (AWS)': {
    skill: 'Cloud (AWS)',
    courseName: 'AWS Cloud Practitioner Essentials',
    duration: '40 hours (2 weeks)',
    provider: 'AWS Training & Certification',
    format: 'Online',
    estimatedCost: 'Free (AWS Skill Builder)',
    reason: 'AWS appears in 88% of IT job postings. Foundational cloud knowledge is essential for most data and development roles.',
  },
  'Power BI': {
    skill: 'Power BI',
    courseName: 'Microsoft Power BI Data Analyst',
    duration: '30 hours (2 weeks)',
    provider: 'Microsoft Learn',
    format: 'Self-paced',
    estimatedCost: 'Free (Microsoft Learn)',
    reason: 'Power BI is demanded in 72% of data analyst roles. Dashboard creation skills complement existing SQL and Excel knowledge.',
  },
  'Tableau': {
    skill: 'Tableau',
    courseName: 'Tableau Fundamentals',
    duration: '20 hours (1 week)',
    provider: 'Tableau Public Resources',
    format: 'Online',
    estimatedCost: 'Free (Tableau Public)',
    reason: 'Tableau appears in 60% of data visualization roles. Concepts overlap with Power BI, making it quick to learn.',
  },
  'Data Visualization': {
    skill: 'Data Visualization',
    courseName: 'Data Visualization Best Practices',
    duration: '15 hours (1 week)',
    provider: 'Google Data Studio',
    format: 'Self-paced',
    estimatedCost: 'Free',
    reason: 'Data visualization is a cross-cutting skill demanded in 70% of analyst roles. Builds on existing Excel and SQL skills.',
  },
  'Node.js': {
    skill: 'Node.js',
    courseName: 'Node.js Backend Development',
    duration: '35 hours (3 weeks)',
    provider: 'freeCodeCamp',
    format: 'Online',
    estimatedCost: 'Free',
    reason: 'Node.js complements React skills for full-stack development roles. Demanded in 65% of frontend developer postings.',
  },
  'SEO': {
    skill: 'SEO',
    courseName: 'SEO Fundamentals Certification',
    duration: '25 hours (2 weeks)',
    provider: 'HubSpot Academy',
    format: 'Self-paced',
    estimatedCost: 'Free',
    reason: 'SEO is critical for digital marketing roles, appearing in 85% of job postings in e-commerce and marketing sectors.',
  },
  'Machine Learning': {
    skill: 'Machine Learning',
    courseName: 'Machine Learning Specialization',
    duration: '60 hours (4 weeks)',
    provider: 'Coursera (Stanford)',
    format: 'Online',
    estimatedCost: 'Free (Financial Aid)',
    reason: 'ML skills are demanded in 75% of AI/ML trainee roles. Builds on Python and data fundamentals.',
  },
  'Excel': {
    skill: 'Excel',
    courseName: 'Advanced Excel for Data Analysis',
    duration: '15 hours (1 week)',
    provider: 'ExcelIsFun',
    format: 'Self-paced',
    estimatedCost: 'Free (YouTube)',
    reason: 'Excel is a foundational skill for 85% of data roles. Advanced functions (VLOOKUP, PivotTables) are frequently tested in interviews.',
  },
  'React': {
    skill: 'React',
    courseName: 'React Development Path',
    duration: '40 hours (3 weeks)',
    provider: 'Meta (Coursera)',
    format: 'Online',
    estimatedCost: 'Free (Financial Aid)',
    reason: 'React is demanded in 88% of frontend developer roles. Core skill for modern web development.',
  },
  'Python': {
    skill: 'Python',
    courseName: 'Python for Data Science',
    duration: '30 hours (2 weeks)',
    provider: 'IBM (Coursera)',
    format: 'Online',
    estimatedCost: 'Free (Financial Aid)',
    reason: 'Python is the most demanded programming skill, appearing in 90% of data and ML roles.',
  },
  'SQL': {
    skill: 'SQL',
    courseName: 'SQL for Data Science',
    duration: '20 hours (1 week)',
    provider: 'DataCamp',
    format: 'Self-paced',
    estimatedCost: 'Free (First Course)',
    reason: 'SQL is critical for 88% of data analyst roles. Database querying is a core requirement.',
  },
  'Digital Marketing': {
    skill: 'Digital Marketing',
    courseName: 'Digital Marketing Fundamentals',
    duration: '30 hours (2 weeks)',
    provider: 'Google Digital Garage',
    format: 'Online',
    estimatedCost: 'Free',
    reason: 'Digital marketing is demanded in 90% of marketing roles. Covers SEO, SEM, and social media marketing.',
  },
};

// ---------- Synthetic Job Listings (for AI-Assisted Job Matching) ----------
export interface JobListing {
  id: string;
  title: string;
  employer: string;
  location: string;
  salaryRange: string;
  requiredSkills: { skill: string; importance: 'Critical' | 'Important' | 'Preferred'; demandLevel: number }[];
  qualification: string;
  trainingPreferred: string[];
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Apprenticeship';
  postedDate: string;
  description: string;
}

export const jobListings: JobListing[] = [
  {
    id: 'JOB-001',
    title: 'Junior Data Analyst',
    employer: 'TCS Digital',
    location: 'Pune',
    salaryRange: '₹18,000 – ₹28,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Data Analytics', 'Full Stack Web Dev'],
    jobType: 'Full-time',
    postedDate: '2026-09-10',
    description: 'Entry-level data analyst role working with SQL, Python, and BI tools to generate business insights.',
    requiredSkills: [
      { skill: 'Python', importance: 'Critical', demandLevel: 90 },
      { skill: 'SQL', importance: 'Critical', demandLevel: 88 },
      { skill: 'Excel', importance: 'Critical', demandLevel: 85 },
      { skill: 'Power BI', importance: 'Important', demandLevel: 72 },
      { skill: 'Data Visualization', importance: 'Important', demandLevel: 70 },
    ],
  },
  {
    id: 'JOB-002',
    title: 'Frontend Developer',
    employer: 'Wipro Technologies',
    location: 'Bengaluru',
    salaryRange: '₹22,000 – ₹35,000',
    qualification: 'B.Tech / B.E. / Any Graduate',
    trainingPreferred: ['Full Stack Web Dev'],
    jobType: 'Full-time',
    postedDate: '2026-09-12',
    description: 'Build responsive web applications using React and modern JavaScript frameworks.',
    requiredSkills: [
      { skill: 'React', importance: 'Critical', demandLevel: 88 },
      { skill: 'Node.js', importance: 'Important', demandLevel: 65 },
      { skill: 'Cloud (AWS)', importance: 'Important', demandLevel: 70 },
      { skill: 'Python', importance: 'Preferred', demandLevel: 40 },
    ],
  },
  {
    id: 'JOB-003',
    title: 'ML Trainee',
    employer: 'Infosys AI Labs',
    location: 'Hyderabad',
    salaryRange: '₹20,000 – ₹32,000',
    qualification: 'B.Tech / B.Sc / Any Graduate',
    trainingPreferred: ['AI & ML Fundamentals', 'Data Analytics'],
    jobType: 'Full-time',
    postedDate: '2026-09-08',
    description: 'Work on machine learning models, data pipelines, and AI-driven solutions for enterprise clients.',
    requiredSkills: [
      { skill: 'Python', importance: 'Critical', demandLevel: 92 },
      { skill: 'Machine Learning', importance: 'Critical', demandLevel: 85 },
      { skill: 'SQL', importance: 'Important', demandLevel: 75 },
      { skill: 'Cloud (AWS)', importance: 'Important', demandLevel: 80 },
      { skill: 'Data Visualization', importance: 'Preferred', demandLevel: 55 },
    ],
  },
  {
    id: 'JOB-004',
    title: 'Cloud Support Associate',
    employer: 'AWS India',
    location: 'Hyderabad',
    salaryRange: '₹25,000 – ₹40,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Cloud Computing'],
    jobType: 'Full-time',
    postedDate: '2026-09-14',
    description: 'Provide technical support for AWS cloud infrastructure, troubleshoot customer issues.',
    requiredSkills: [
      { skill: 'Cloud (AWS)', importance: 'Critical', demandLevel: 95 },
      { skill: 'Python', importance: 'Important', demandLevel: 70 },
      { skill: 'SQL', importance: 'Preferred', demandLevel: 50 },
    ],
  },
  {
    id: 'JOB-005',
    title: 'Digital Marketing Executive',
    employer: 'Flipkart',
    location: 'Bengaluru',
    salaryRange: '₹15,000 – ₹25,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Digital Marketing'],
    jobType: 'Full-time',
    postedDate: '2026-09-11',
    description: 'Manage digital marketing campaigns, SEO optimization, and social media strategy for e-commerce.',
    requiredSkills: [
      { skill: 'Digital Marketing', importance: 'Critical', demandLevel: 90 },
      { skill: 'SEO', importance: 'Critical', demandLevel: 85 },
      { skill: 'Excel', importance: 'Important', demandLevel: 70 },
      { skill: 'Data Visualization', importance: 'Preferred', demandLevel: 45 },
    ],
  },
  {
    id: 'JOB-006',
    title: 'SEO Specialist',
    employer: 'Zomato',
    location: 'Delhi NCR',
    salaryRange: '₹18,000 – ₹30,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Digital Marketing'],
    jobType: 'Full-time',
    postedDate: '2026-09-09',
    description: 'Drive organic traffic growth through SEO strategies, keyword research, and content optimization.',
    requiredSkills: [
      { skill: 'SEO', importance: 'Critical', demandLevel: 92 },
      { skill: 'Digital Marketing', importance: 'Critical', demandLevel: 80 },
      { skill: 'Excel', importance: 'Important', demandLevel: 65 },
    ],
  },
  {
    id: 'JOB-007',
    title: 'Data Analyst Apprentice',
    employer: 'Accenture',
    location: 'Pune',
    salaryRange: '₹15,000 – ₹22,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Data Analytics'],
    jobType: 'Apprenticeship',
    postedDate: '2026-09-13',
    description: 'Apprenticeship program for fresh graduates to learn data analytics on the job with mentorship.',
    requiredSkills: [
      { skill: 'SQL', importance: 'Critical', demandLevel: 85 },
      { skill: 'Excel', importance: 'Critical', demandLevel: 80 },
      { skill: 'Python', importance: 'Important', demandLevel: 70 },
      { skill: 'Power BI', importance: 'Preferred', demandLevel: 50 },
    ],
  },
  {
    id: 'JOB-008',
    title: 'Operations Executive',
    employer: 'Amazon India',
    location: 'Chennai',
    salaryRange: '₹16,000 – ₹24,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Data Analytics', 'Digital Marketing'],
    jobType: 'Full-time',
    postedDate: '2026-09-07',
    description: 'Manage daily operations, track KPIs using Excel and dashboards, and coordinate with teams.',
    requiredSkills: [
      { skill: 'Excel', importance: 'Critical', demandLevel: 85 },
      { skill: 'SQL', importance: 'Important', demandLevel: 65 },
      { skill: 'Data Visualization', importance: 'Important', demandLevel: 60 },
      { skill: 'Power BI', importance: 'Preferred', demandLevel: 45 },
    ],
  },
  {
    id: 'JOB-009',
    title: 'Full Stack Developer',
    employer: 'Startup: TechVerse',
    location: 'Bengaluru',
    salaryRange: '₹28,000 – ₹45,000',
    qualification: 'B.Tech / B.E. / MCA',
    trainingPreferred: ['Full Stack Web Dev'],
    jobType: 'Full-time',
    postedDate: '2026-09-15',
    description: 'Join a fast-growing startup to build end-to-end web applications with React and Node.js.',
    requiredSkills: [
      { skill: 'React', importance: 'Critical', demandLevel: 90 },
      { skill: 'Node.js', importance: 'Critical', demandLevel: 85 },
      { skill: 'Cloud (AWS)', importance: 'Important', demandLevel: 75 },
      { skill: 'SQL', importance: 'Important', demandLevel: 65 },
    ],
  },
  {
    id: 'JOB-010',
    title: 'Business Intelligence Analyst',
    employer: 'Cognizant',
    location: 'Hyderabad',
    salaryRange: '₹22,000 – ₹35,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Data Analytics'],
    jobType: 'Full-time',
    postedDate: '2026-09-06',
    description: 'Create dashboards and reports using Power BI and Tableau to support business decision-making.',
    requiredSkills: [
      { skill: 'Power BI', importance: 'Critical', demandLevel: 88 },
      { skill: 'SQL', importance: 'Critical', demandLevel: 82 },
      { skill: 'Tableau', importance: 'Important', demandLevel: 70 },
      { skill: 'Excel', importance: 'Important', demandLevel: 75 },
      { skill: 'Python', importance: 'Preferred', demandLevel: 50 },
    ],
  },
  {
    id: 'JOB-011',
    title: 'Marketing Analytics Trainee',
    employer: 'Swiggy',
    location: 'Bengaluru',
    salaryRange: '₹16,000 – ₹24,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Digital Marketing', 'Data Analytics'],
    jobType: 'Full-time',
    postedDate: '2026-09-10',
    description: 'Analyze marketing campaign performance, SEO metrics, and customer data to drive growth.',
    requiredSkills: [
      { skill: 'Digital Marketing', importance: 'Important', demandLevel: 75 },
      { skill: 'SEO', importance: 'Important', demandLevel: 70 },
      { skill: 'Excel', importance: 'Critical', demandLevel: 80 },
      { skill: 'Data Visualization', importance: 'Important', demandLevel: 65 },
    ],
  },
  {
    id: 'JOB-012',
    title: 'Cloud Operations Trainee',
    employer: 'Microsoft India',
    location: 'Hyderabad',
    salaryRange: '₹20,000 – ₹30,000',
    qualification: 'Any Graduate',
    trainingPreferred: ['Cloud Computing'],
    jobType: 'Apprenticeship',
    postedDate: '2026-09-12',
    description: 'Entry-level cloud operations role with structured training in Azure and AWS environments.',
    requiredSkills: [
      { skill: 'Cloud (AWS)', importance: 'Critical', demandLevel: 85 },
      { skill: 'Python', importance: 'Important', demandLevel: 65 },
      { skill: 'SQL', importance: 'Preferred', demandLevel: 45 },
    ],
  },
];

// ---------- Job Match Result Interface ----------
export interface JobMatchResult {
  job: JobListing;
  matchingSkills: { skill: string; proficiency: number; importance: string }[];
  missingSkills: { skill: string; importance: string; demandLevel: number }[];
  matchPercentage: number;
  locationMatch: boolean;
  qualificationMatch: boolean;
  trainingMatch: boolean;
}

export function calculateJobMatch(
  traineeId: string,
  job: JobListing
): JobMatchResult {
  const trainee = trainees.find((t) => t.id === traineeId) || trainees[0];
  const proficiency = getTraineeSkillProficiency(trainee.skills);

  const matching: JobMatchResult['matchingSkills'] = [];
  const missing: JobMatchResult['missingSkills'] = [];

  for (const req of job.requiredSkills) {
    const prof = proficiency[req.skill];
    if (prof !== undefined) {
      matching.push({ skill: req.skill, proficiency: prof, importance: req.importance });
    } else {
      missing.push({ skill: req.skill, importance: req.importance, demandLevel: req.demandLevel });
    }
  }

  // Weighted match percentage: critical skills weighted 3x, important 2x, preferred 1x
  const weightMap = { Critical: 3, Important: 2, Preferred: 1 };
  let totalWeight = 0;
  let matchedWeight = 0;
  for (const req of job.requiredSkills) {
    const w = weightMap[req.importance];
    totalWeight += w;
    if (proficiency[req.skill] !== undefined) {
      matchedWeight += w;
    }
  }
  const matchPercentage = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  const locationMatch = trainee.district === job.location || true; // synthetic: show all locations
  const qualificationMatch = job.qualification === 'Any Graduate' || true;
  const trainingMatch = job.trainingPreferred.includes(trainee.courseName) || job.trainingPreferred.length === 0;

  return {
    job,
    matchingSkills: matching.sort((a, b) => {
      const order = { Critical: 0, Important: 1, Preferred: 2 };
      return order[a.importance as keyof typeof order] - order[b.importance as keyof typeof order];
    }),
    missingSkills: missing.sort((a, b) => {
      const order = { Critical: 0, Important: 1, Preferred: 2 };
      return order[a.importance as keyof typeof order] - order[b.importance as keyof typeof order];
    }),
    matchPercentage,
    locationMatch,
    qualificationMatch,
    trainingMatch,
  };
}

// ---------- Providers ----------
export const providers: Provider[] = [
  {
    id: 'P01', name: 'TechSkill Academy', district: 'Pune',
    traineesTotal: 8, placementRate: 88, relevantEmploymentRate: 65, retentionRate: 50,
    evidenceCoverage: 75, skillRelevance: 72, avgWage: 22000, cohortSize: 8, sampleSize: 7,
    coverageScore: 88, evidenceQuality: 75,
  },
  {
    id: 'P02', name: 'Digital India Training Centre', district: 'Hyderabad',
    traineesTotal: 8, placementRate: 75, relevantEmploymentRate: 50, retentionRate: 38,
    evidenceCoverage: 50, skillRelevance: 55, avgWage: 18000, cohortSize: 8, sampleSize: 6,
    coverageScore: 75, evidenceQuality: 50,
  },
  {
    id: 'P03', name: 'SkillBridge Institute', district: 'Bengaluru',
    traineesTotal: 7, placementRate: 86, relevantEmploymentRate: 71, retentionRate: 57,
    evidenceCoverage: 86, skillRelevance: 80, avgWage: 25000, cohortSize: 7, sampleSize: 7,
    coverageScore: 100, evidenceQuality: 86,
  },
  {
    id: 'P04', name: 'FutureTech Learning Hub', district: 'Chennai',
    traineesTotal: 7, placementRate: 71, relevantEmploymentRate: 43, retentionRate: 29,
    evidenceCoverage: 43, skillRelevance: 50, avgWage: 16000, cohortSize: 7, sampleSize: 5,
    coverageScore: 71, evidenceQuality: 43,
  },
];

// ---------- Interventions ----------
export const interventions: Intervention[] = [
  {
    id: 'INT-001',
    problem: 'Low relevant employment (57%)',
    diagnosis: 'Curriculum lacks Power BI and Cloud modules which appear in 72-88% of local job postings. Trainees accept lower-relevance roles due to missing skills.',
    action: 'Add Power BI practical module with real-world datasets',
    owner: 'TechSkill Academy',
    targetMetric: 'Relevant Employment Rate',
    baseline: 57,
    target: 70,
    status: 'Completed',
    date: '2025-06-15',
    cohortApplied: 'Cohort 2025-A',
    linkedCohort: 'Cohort 2025-B',
  },
  {
    id: 'INT-002',
    problem: 'Retention drop at 6 months (44%)',
    diagnosis: 'Exit interviews indicate workplace adjustment issues and salary below market median. No mentorship support available post-placement.',
    action: 'Launch mentorship and workplace adjustment support program',
    owner: 'SkillBridge Institute',
    targetMetric: '6-Month Retention Rate',
    baseline: 44,
    target: 60,
    status: 'In Progress',
    date: '2025-08-01',
    cohortApplied: 'Cohort 2025-B',
    linkedCohort: null,
  },
  {
    id: 'INT-003',
    problem: 'Emerging skill gap: Cloud (AWS)',
    diagnosis: 'Cloud (AWS) appears in 88% of job postings but only 20% of curricula. Trainees lack foundational cloud skills required for most data/IT roles.',
    action: 'Introduce 40-hour AWS fundamentals certification track',
    owner: 'Digital India Training Centre',
    targetMetric: 'Cloud Skill Coverage',
    baseline: 20,
    target: 65,
    status: 'Proposed',
    date: '2025-09-10',
    cohortApplied: 'Cohort 2025-C',
    linkedCohort: null,
  },
  {
    id: 'INT-004',
    problem: 'Low evidence coverage (38%)',
    diagnosis: 'Only 38% of outcomes have evidence beyond self-report. Follow-up response rate at 85%. No employer verification workflow in place.',
    action: 'Implement automated follow-up system with employer verification workflow',
    owner: 'All Providers',
    targetMetric: 'Evidence-Supported Outcome Rate',
    baseline: 38,
    target: 70,
    status: 'In Progress',
    date: '2025-07-20',
    cohortApplied: 'Cohort 2025-B',
    linkedCohort: null,
    interventionType: 'Request Evidence',
    assignedPerson: 'Priya Patel (Verification Officer)',
    result: 'Evidence coverage improved from 38% to 52%. 3 trainees submitted documents.',
  },
  {
    id: 'INT-005',
    problem: 'Skill mismatch — trainee working in unrelated field',
    diagnosis: 'Trainee T005 (Karthik Nair) trained in Data Analytics but placed as Customer Support. Skills match rate: 35%.',
    action: 'Recommend additional training in data analytics; connect to relevant job openings',
    owner: 'TechSkill Academy',
    targetMetric: 'Relevant Employment Rate',
    baseline: 35,
    target: 70,
    status: 'In Progress',
    date: '2026-09-05',
    cohortApplied: 'Cohort 2025-B',
    linkedCohort: null,
    interventionType: 'Recommend Additional Training',
    assignedPerson: 'Rahul Mehta (Placement Officer)',
    result: 'Enrolled in Power BI bridging module. 2 relevant job interviews scheduled.',
  },
  {
    id: 'INT-006',
    problem: 'No follow-up response from 3 trainees',
    diagnosis: 'Trainees T008, T012, T015 have not responded to 2+ follow-up surveys. Employment status unknown for 30+ days.',
    action: 'Initiate assisted follow-up via field staff; attempt phone contact',
    owner: 'Digital India Training Centre',
    targetMetric: 'Follow-up Response Rate',
    baseline: 50,
    target: 85,
    status: 'In Progress',
    date: '2026-09-08',
    cohortApplied: 'Cohort 2025-B',
    linkedCohort: null,
    interventionType: 'Assisted Follow-up',
    assignedPerson: 'Sneha Joshi (Field Coordinator)',
    result: '1 of 3 trainees contacted via phone. 2 pending address visits.',
  },
  {
    id: 'INT-007',
    problem: 'Employment loss — trainee lost job after 90 days',
    diagnosis: 'Trainee T010 (Sneha Joshi) was employed at 30-day follow-up but reported unemployed at 90-day follow-up. Employment ended.',
    action: 'Show matching job opportunities; connect to district employment exchange',
    owner: 'SkillBridge Institute',
    targetMetric: 'Re-placement Rate',
    baseline: 0,
    target: 100,
    status: 'Proposed',
    date: '2026-09-12',
    cohortApplied: 'Cohort 2025-B',
    linkedCohort: null,
    interventionType: 'Show Job Opportunities',
    assignedPerson: 'Arjun Kumar (Placement Officer)',
    result: 'Pending — job matching in progress.',
  },
];

// ---------- Cohort Comparison ----------
export const cohortComparisons: CohortComparison[] = [
  {
    metric: 'Relevant Employment Rate',
    previousCohort: 'Cohort 2025-A',
    previousValue: 57,
    nextCohort: 'Cohort 2025-B',
    nextValue: 68,
    intervention: 'Added Power BI practical module',
    observedChange: 11,
    previousEvidenceCoverage: 38,
    nextEvidenceCoverage: 52,
    previousSampleSize: 10,
    nextSampleSize: 10,
  },
  {
    metric: 'Evidence-Supported Outcome Rate',
    previousCohort: 'Cohort 2025-A',
    previousValue: 38,
    nextCohort: 'Cohort 2025-B',
    nextValue: 52,
    intervention: 'Automated follow-up + employer verification workflow',
    observedChange: 14,
    previousEvidenceCoverage: 38,
    nextEvidenceCoverage: 52,
    previousSampleSize: 10,
    nextSampleSize: 10,
  },
  {
    metric: 'Skill Alignment %',
    previousCohort: 'Cohort 2025-A',
    previousValue: 64,
    nextCohort: 'Cohort 2025-B',
    nextValue: 78,
    intervention: 'Curriculum updated with Cloud + Power BI modules',
    observedChange: 14,
    previousEvidenceCoverage: 38,
    nextEvidenceCoverage: 52,
    previousSampleSize: 10,
    nextSampleSize: 10,
  },
];

// ---------- Early Warnings ----------
const severityToRisk = (severity: 'High' | 'Medium' | 'Low'): 'Low Risk' | 'Medium Risk' | 'Needs Attention' => {
  if (severity === 'High') return 'Needs Attention';
  if (severity === 'Medium') return 'Medium Risk';
  return 'Low Risk';
};

const warningInterventionMap: Record<string, string> = {
  'Non-Placement Risk': 'Show Job Opportunities',
  'Low Follow-up Response': 'Assisted Follow-up',
  'No Follow-up Response': 'Assisted Follow-up',
  'Low Job Relevance': 'Recommend Additional Training',
  'Skill Mismatch': 'Recommend Additional Training',
  'Retention Risk': 'Workplace Mentorship',
  'Low Retention': 'Workplace Mentorship',
  'Declining Retention': 'Re-placement Support',
  'Employment Loss': 'Show Job Opportunities',
  'Emerging Skill Gap': 'Curriculum Update',
  'Unusual Outcome': 'Outcome Verification',
  'Low Evidence Confidence': 'Request Evidence',
  'Pending Verification': 'Request Evidence',
};

export const earlyWarnings: EarlyWarning[] = trainees
  .filter((t) => t.warnings.length > 0)
  .slice(0, 12)
  .map((t, i) => {
    const type = t.warnings[0] as EarlyWarning['type'];
    const severity: 'High' | 'Medium' | 'Low' = type === 'Non-Placement Risk' ? 'High' : type === 'Retention Risk' ? 'High' : type === 'Low Job Relevance' ? 'Medium' : type === 'Declining Retention' ? 'High' : type === 'Unusual Outcome' ? 'Medium' : type === 'Low Evidence Confidence' ? 'Medium' : 'Low';
    return {
      id: `EW-${String(i + 1).padStart(3, '0')}`,
      traineeId: t.id,
      traineeName: t.name,
      type,
      severity,
      riskLevel: severityToRisk(severity),
      reason: getWarningReason(type, t),
      confidence: 60 + Math.floor(Math.abs(Math.sin(i * 13)) * 35),
      recommendation: getWarningRecommendation(type),
      insufficientEvidence: Math.abs(Math.cos(i * 7)) > 0.7,
      interventionType: warningInterventionMap[type] || 'Review Required',
    };
  });

// ---------- Additional synthetic early warnings (new types) ----------
const additionalWarnings: EarlyWarning[] = trainees
  .filter((t) => t.warnings.length === 0)
  .slice(0, 8)
  .map((t, i) => {
    const types: EarlyWarning['type'][] = ['No Follow-up Response', 'Employment Loss', 'Low Retention', 'Skill Mismatch', 'Pending Verification'];
    const type = types[i % types.length];
    const severity: 'High' | 'Medium' | 'Low' = type === 'Employment Loss' ? 'High' : type === 'No Follow-up Response' ? 'Medium' : type === 'Pending Verification' ? 'Low' : 'Medium';
    return {
      id: `EW-${String(13 + i).padStart(3, '0')}`,
      traineeId: t.id,
      traineeName: t.name,
      type,
      severity,
      riskLevel: severityToRisk(severity),
      reason: getWarningReason(type, t),
      confidence: 55 + Math.floor(Math.abs(Math.sin(i * 11)) * 40),
      recommendation: getWarningRecommendation(type),
      insufficientEvidence: Math.abs(Math.cos(i * 5)) > 0.6,
      interventionType: warningInterventionMap[type] || 'Review Required',
    };
  });

export const allEarlyWarnings: EarlyWarning[] = [...earlyWarnings, ...additionalWarnings];

function getWarningReason(type: string, t: Trainee): string {
  switch (type) {
    case 'Non-Placement Risk':
      return `Trainee ${t.name} has been certified but not placed after 60+ days. District ${t.district} shows limited vacancies in ${t.courseName}. 2 of 4 follow-ups unanswered.`;
    case 'Low Follow-up Response':
      return `${t.followUps.filter((f) => !f.responded).length} of 4 follow-up surveys unanswered. Cannot verify employment status.`;
    case 'No Follow-up Response':
      return `Trainee ${t.name} has not responded to ${t.followUps.filter((f) => !f.responded).length} of 4 follow-up surveys. No contact established in 30+ days. Employment status unknown.`;
    case 'Low Job Relevance':
      return `Placed as ${t.jobRole} in ${t.industry} but training was in ${t.courseName}. Skills match rate below 40%.`;
    case 'Skill Mismatch':
      return `Trainee ${t.name} was trained in ${t.courseName} but is working in an unrelated field. Skills from training are not being used on the job. Match rate: 35%.`;
    case 'Retention Risk':
      return `Employment lasted only ${t.retentionMonths} months. Salary below district median. No progression observed.`;
    case 'Low Retention':
      return `Trainee ${t.name} has been employed for only ${t.retentionMonths} months. Retention below 6-month benchmark. Risk of early job loss.`;
    case 'Declining Retention':
      return `Retention trend is declining: employed at 30-day follow-up but not at 90-day follow-up. Salary dropped or became null. Indicates early job loss.`;
    case 'Employment Loss':
      return `Trainee ${t.name} was employed at 30-day follow-up but reported as unemployed at 90-day follow-up. Employment has ended. Needs re-placement support.`;
    case 'Emerging Skill Gap':
      return `Training curriculum does not cover Cloud (AWS) or Power BI, which appear in 80%+ of local job postings.`;
    case 'Unusual Outcome':
      return `Employment outcome pattern is atypical: placed in an industry unrelated to training with a salary 40%+ below cohort median. Possible data quality issue or genuine mismatch.`;
    case 'Low Evidence Confidence':
      return `Outcome is self-reported only. No supporting documents uploaded. 0 of 4 follow-ups have evidence beyond self-report. Confidence in outcome is low.`;
    case 'Pending Verification':
      return `Trainee ${t.name}'s outcome is awaiting verification. Evidence documents have been requested but not yet submitted. Verification pending for 15+ days.`;
    default:
      return 'Insufficient evidence to determine cause.';
  }
}

function getWarningRecommendation(type: string): string {
  switch (type) {
    case 'Non-Placement Risk':
      return 'Connect to district employment exchange; consider bridge internship or apprenticeship.';
    case 'Low Follow-up Response':
      return 'Switch to phone-based follow-up; offer small incentive for survey completion.';
    case 'No Follow-up Response':
      return 'Initiate assisted follow-up via field staff; attempt phone contact; visit trainee address if needed.';
    case 'Low Job Relevance':
      return 'Recommend upskilling in relevant domain; explore internal transfer options with employer.';
    case 'Skill Mismatch':
      return 'Recommend additional training in relevant skills; explore job opportunities matching current training profile.';
    case 'Retention Risk':
      return 'Assign workplace mentor; check for salary parity; explore alternative placement.';
    case 'Low Retention':
      return 'Assign workplace mentor; schedule check-in calls; monitor for signs of job dissatisfaction.';
    case 'Declining Retention':
      return 'Contact trainee to understand reason for leaving; offer re-placement support; check for systemic issues with employer.';
    case 'Employment Loss':
      return 'Show matching job opportunities; connect to district employment exchange; offer re-placement support.';
    case 'Emerging Skill Gap':
      return 'Add missing skills to next cohort curriculum; offer bridging module to current trainees.';
    case 'Unusual Outcome':
      return 'Verify outcome with employer; check if data entry error; confirm trainee actually employed in stated role.';
    case 'Low Evidence Confidence':
      return 'Request evidence upload (offer letter, salary slip); schedule employer verification call.';
    case 'Pending Verification':
      return 'Request evidence documents (offer letter, salary slip); send reminder to trainee; schedule verification call.';
    default:
      return 'Gather more data before recommending action.';
  }
}

// ---------- District Intelligence ----------
export const districtData: DistrictData[] = [
  {
    district: 'Pune', state: 'Maharashtra',
    highDemandSkills: ['Python', 'Cloud (AWS)', 'Power BI', 'React', 'DevOps'],
    trainingAvailable: ['Python', 'React', 'Digital Marketing', 'SQL'],
    shortages: ['Cloud (AWS)', 'Power BI', 'DevOps'],
    employmentOutcome: 82, traineesTrained: 8, traineesPlaced: 7,
  },
  {
    district: 'Hyderabad', state: 'Telangana',
    highDemandSkills: ['Python', 'Machine Learning', 'Cloud (AWS)', 'Cybersecurity', 'SQL'],
    trainingAvailable: ['Python', 'SQL', 'Digital Marketing'],
    shortages: ['Cloud (AWS)', 'Machine Learning', 'Cybersecurity'],
    employmentOutcome: 75, traineesTrained: 8, traineesPlaced: 6,
  },
  {
    district: 'Bengaluru', state: 'Karnataka',
    highDemandSkills: ['React', 'Node.js', 'Cloud (AWS)', 'Python', 'Tableau'],
    trainingAvailable: ['React', 'Node.js', 'Python', 'SQL', 'Machine Learning'],
    shortages: ['Cloud (AWS)', 'Tableau'],
    employmentOutcome: 86, traineesTrained: 7, traineesPlaced: 6,
  },
  {
    district: 'Chennai', state: 'Tamil Nadu',
    highDemandSkills: ['Python', 'Cloud (AWS)', 'Data Visualization', 'Excel', 'Power BI'],
    trainingAvailable: ['Python', 'Excel', 'Digital Marketing'],
    shortages: ['Cloud (AWS)', 'Power BI', 'Data Visualization'],
    employmentOutcome: 71, traineesTrained: 7, traineesPlaced: 5,
  },
  {
    district: 'Indore', state: 'Madhya Pradesh',
    highDemandSkills: ['Digital Marketing', 'SEO', 'Excel', 'Power BI', 'Python'],
    trainingAvailable: ['Digital Marketing', 'SEO', 'Excel'],
    shortages: ['Power BI', 'Python'],
    employmentOutcome: 68, traineesTrained: 0, traineesPlaced: 0,
  },
  {
    district: 'Jaipur', state: 'Rajasthan',
    highDemandSkills: ['Python', 'SQL', 'Cloud (AWS)', 'React', 'Power BI'],
    trainingAvailable: ['Python', 'SQL'],
    shortages: ['Cloud (AWS)', 'React', 'Power BI'],
    employmentOutcome: 64, traineesTrained: 0, traineesPlaced: 0,
  },
];

// ---------- Audit Logs ----------
export const auditLogs: AuditLog[] = [
  { id: 'A001', timestamp: '2026-09-15 10:23:14', actor: 'Admin (State Mission)', action: 'Viewed trainee profile', resource: 'T003 (Priya Patel)', status: 'Allowed', consentStatus: 'Consent Active' },
  { id: 'A002', timestamp: '2026-09-15 09:45:02', actor: 'Provider (TechSkill Academy)', action: 'Uploaded evidence document', resource: 'T007 (Vikram Singh)', status: 'Allowed', consentStatus: 'Consent Active' },
  { id: 'A003', timestamp: '2026-09-14 16:30:55', actor: 'Admin (District Pune)', action: 'Exported aggregated analytics', resource: 'Pune District Report', status: 'Allowed', consentStatus: 'Anonymized' },
  { id: 'A004', timestamp: '2026-09-14 14:12:30', actor: 'Provider (FutureTech)', action: 'Attempted to view trainee from other provider', resource: 'T005 (Karthik Nair)', status: 'Denied', consentStatus: 'No Cross-Provider Access' },
  { id: 'A005', timestamp: '2026-09-13 11:08:22', actor: 'Trainee (T003)', action: 'With consent for employment data', resource: 'Own Profile', status: 'Allowed', consentStatus: 'Consent Granted' },
  { id: 'A006', timestamp: '2026-09-13 08:55:10', actor: 'System', action: 'Auto-anonymized data for public dashboard', resource: 'State-level Dashboard', status: 'Allowed', consentStatus: 'Anonymized' },
  { id: 'A007', timestamp: '2026-09-12 17:40:33', actor: 'Admin (Central)', action: 'Generated Skill Passport QR', resource: 'T011 (Rahul Mehta)', status: 'Allowed', consentStatus: 'Consent Active' },
  { id: 'A008', timestamp: '2026-09-12 13:20:15', actor: 'Trainee (T008)', action: 'Withdrew consent for data sharing', resource: 'Own Profile', status: 'Allowed', consentStatus: 'Consent Withdrawn' },
];

// ---------- Consent Categories ----------
export { consentCategories };

// ---------- Training Status helpers ----------
export const trainingStatusColors: Record<TrainingStatus, string> = {
  'Enrolled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'In Training': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Dropped Out': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'Certified': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
};

export const followUpStatusColors: Record<FollowUpStatus, string> = {
  'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Sent': 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  'Responded': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'No Response': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'Assisted': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

// ---------- Extended KPIs ----------
export const extendedKpis = {
  trainingCompleted: trainees.filter((t) => t.trainingStatus === 'Completed' || t.trainingStatus === 'Certified').length,
  certified: trainees.filter((t) => t.certified).length,
  followUpsDue: trainees.reduce((sum, t) => sum + t.followUps.filter((f) => f.status === 'Pending' || f.status === 'Scheduled' || f.status === 'Sent').length, 0),
  followUpsCompleted: trainees.reduce((sum, t) => sum + t.followUps.filter((f) => f.status === 'Completed' || f.status === 'Responded').length, 0),
  followUpsOverdue: trainees.reduce((sum, t) => sum + t.followUps.filter((f) => f.isOverdue || (f.status === 'No Response' && !f.responded)).length, 0),
  followUpsAssisted: trainees.reduce((sum, t) => sum + t.followUps.filter((f) => f.status === 'Assisted' || f.method === 'Assisted Follow-up').length, 0),
  followUpsScheduled: trainees.reduce((sum, t) => sum + t.followUps.filter((f) => f.status === 'Scheduled').length, 0),
  totalFollowUps: trainees.reduce((sum, t) => sum + t.followUps.length, 0),
  responseRate: (() => {
    const total = trainees.reduce((sum, t) => sum + t.followUps.length, 0);
    const completed = trainees.reduce((sum, t) => sum + t.followUps.filter((f) => f.status === 'Completed' || f.status === 'Responded').length, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  })(),
  consentRate: Math.round((trainees.filter((t) => t.consentRecords.filter((c) => c.status === 'Given').length >= 3).length / trainees.length) * 100),
};

// ---------- Overdue Follow-Ups List ----------
export const overdueFollowUps = trainees
  .flatMap((t) => t.followUps
    .filter((f) => f.isOverdue || (f.status === 'No Response' && !f.responded))
    .map((f) => ({
      traineeId: t.id,
      traineeName: t.name,
      unifiedId: t.unifiedId,
      providerName: t.providerName,
      district: t.district,
      period: f.period,
      days: f.days,
      dueDate: f.dueDate || '',
      method: f.method || 'WhatsApp',
      status: f.status || 'No Response',
    }))
  )
  .sort((a, b) => a.days - b.days);

// ---------- Provider Follow-Up Stats ----------
export const providerFollowUpStats: ProviderFollowUpStat[] = providers.map((p) => {
  const pTrainees = trainees.filter((t) => t.providerId === p.id);
  const allFollowUps = pTrainees.flatMap((t) => t.followUps);
  const due = allFollowUps.filter((f) => f.status === 'Pending' || f.status === 'Scheduled' || f.status === 'Sent').length;
  const completed = allFollowUps.filter((f) => f.status === 'Completed' || f.status === 'Responded').length;
  const noResp = allFollowUps.filter((f) => f.status === 'No Response').length;
  const overdue = allFollowUps.filter((f) => f.status === 'No Response' && !f.responded).length;
  const total = allFollowUps.length;
  return {
    providerId: p.id,
    providerName: p.name,
    totalTrainees: pTrainees.length,
    followUpsDue: due,
    followUpsCompleted: completed,
    noResponse: noResp,
    overdue,
    responseRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
});

// ---------- Follow-Up Methods (for display) ----------
export const followUpMethodIcons: Record<FollowUpMethod, string> = {
  'WhatsApp': 'WhatsApp',
  'SMS': 'SMS',
  'Email': 'Email',
  'Phone Call': 'Phone Call',
  'Assisted Follow-up': 'Assisted',
};

// ---------- CSV Import Sample Data ----------
export const csvSampleData = `Trainee ID,Trainee Name,Programme,Course,Training Provider,Training Centre,District,State,Start Date,Completion Date,Skills Acquired,Certification Status
SP-2025-00031,Ravi Deshmukh,DDU-GY,Data Analytics,TechSkill Academy,Pune Centre,Pune,Maharashtra,2025-06-01,2025-09-01,Python;SQL;Power BI,Certified
SP-2025-00032,Anita Kulkarni,DDU-GY,Full Stack Web Dev,Digital India Training Centre,Hyderabad Centre,Hyderabad,Telangana,2025-06-01,2025-09-01,React;Node.js;JavaScript,Completed
SP-2025-00033,Manoj Reddy,PMKVY,Digital Marketing,SkillBridge Institute,Bengaluru Centre,Bengaluru,Karnataka,2025-06-15,2025-09-15,SEO;Social Media;Content Marketing,Pending
SP-2025-00034,Sneha Rao,PMKVY,Cloud Computing,FutureTech Learning Hub,Chennai Centre,Chennai,Tamil Nadu,2025-07-01,2025-10-01,AWS;Docker;Kubernetes,In Training
SP-2025-00035,Invalid Row,DDU-GY,,TechSkill Academy,,Pune,,2025-06-01,,Python,
SP-2025-00036,Kavya Sharma,DDU-GY,AI & ML Fundamentals,TechSkill Academy,Pune Centre,Indore,Madhya Pradesh,2025-07-15,2025-10-15,Machine Learning;Python;TensorFlow,Certified`;
