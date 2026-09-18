import { useState, useEffect } from 'react';
import {
  ShieldCheck, Mail, Phone, Calendar, CreditCard, CheckCircle2,
  User, ArrowRight, ArrowLeft, Download, RefreshCw, Copy, Check,
  Search, Eye, QrCode, Sparkles, Building2, MapPin, Award,
  GitMerge, Users, AlertCircle, Lock, Shield, FileCheck, Layers,
  Cpu, TrendingUp, Sparkle, ExternalLink
} from 'lucide-react';
import { dataService, type VerifiedProfile, type DuplicateCandidatePair } from '@/services/dataService';
import type { PageKey } from '@/components/Sidebar';

interface IdentityProfilesProps {
  onNavigate?: (page: PageKey) => void;
}

type TabType = 'overview' | 'verify' | 'duplicates' | 'directory';
type VerificationStep = 1 | 2 | 3 | 4 | 5;

export function IdentityProfiles({ onNavigate }: IdentityProfilesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentStep, setCurrentStep] = useState<VerificationStep>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Step 2: Mobile + OTP
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mockOtp, setMockOtp] = useState('749210');
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Step 3: Demographics
  const [dob, setDob] = useState('2002-06-18');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [guardianName, setGuardianName] = useState('');
  const [district, setDistrict] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');

  // Step 4: Aadhaar
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  // Step 5: Completed Profile
  const [generatedProfile, setGeneratedProfile] = useState<VerifiedProfile | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showQrDetails, setShowQrDetails] = useState(false);

  // Directory State
  const [profiles, setProfiles] = useState<VerifiedProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfileForModal, setSelectedProfileForModal] = useState<VerifiedProfile | null>(null);

  // Duplicate Pairs State
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicateCandidatePair[]>([]);
  const [activeHowItWorksStep, setActiveHowItWorksStep] = useState<number>(1);
  const [mergedPairToast, setMergedPairToast] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(dataService.getVerifiedProfiles());
    setDuplicatePairs(dataService.getDuplicatePairs());

    const unsub = dataService.subscribe(() => {
      setProfiles(dataService.getVerifiedProfiles());
      setDuplicatePairs(dataService.getDuplicatePairs());
    });
    return unsub;
  }, []);

  // Timer for OTP countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleAutoFillDemo = () => {
    setFullName('Aditya Sharma');
    setEmail('aditya.sharma2026@gmail.com');
    setMobile('9876543210');
    setGuardianName('Rajendra Sharma');
    setAadhaarNumber('4829 7612 9043');
    setAadhaarVerified(true);
    setOtpVerified(true);
    setOtpSent(true);
    setOtpCode('749210');
  };

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(code);
    setOtpSent(true);
    setResendTimer(30);
  };

  const handleVerifyOtp = () => {
    if (otpCode === mockOtp || otpCode.length === 6) {
      setOtpVerified(true);
    } else {
      alert(`Invalid OTP. Use mock code: ${mockOtp}`);
    }
  };

  const formatAadhaarInput = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.slice(i, i + 4));
    }
    setAadhaarNumber(parts.join(' '));
  };

  const handleVerifyAadhaar = () => {
    if (!aadhaarNumber || aadhaarNumber.replace(/\s/g, '').length < 12) {
      alert('Please enter a complete 12-digit Aadhaar number');
      return;
    }
    if (!dpdpConsent) {
      alert('Please accept the DPDP consent notice to proceed.');
      return;
    }
    setAadhaarVerifying(true);
    setTimeout(() => {
      setAadhaarVerifying(false);
      setAadhaarVerified(true);
    }, 1200);
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    if (!otpVerified && !otpSent) {
      setOtpVerified(true);
    }
    setCurrentStep(3);
  };

  const handleStep3Continue = () => {
    if (!guardianName) {
      setGuardianName('Ramesh ' + (fullName.split(' ')[1] || 'Sharma'));
    }
    setCurrentStep(4);
  };

  const handleStep4Continue = () => {
    if (!aadhaarVerified) {
      setAadhaarVerified(true);
    }
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SP-2026-IND-${randomSuffix}`;
    const rawAadhaar = aadhaarNumber.replace(/\s/g, '') || '482976129043';
    const masked = `XXXX XXXX ${rawAadhaar.slice(-4)}`;

    const newProfile: VerifiedProfile = {
      id: `vp-${Date.now()}`,
      skillPulseId: newId,
      fullName: fullName || 'Aditya Sharma',
      email: email || 'aditya.sharma2026@gmail.com',
      mobile: mobile ? `+91 ${mobile}` : '+91 98765 43210',
      dob: dob || '2002-06-18',
      gender: gender,
      guardianName: guardianName || 'Rajendra Sharma',
      district: district || 'Varanasi',
      state: state || 'Uttar Pradesh',
      aadhaarMasked: masked,
      aadhaarToken: `UIDAI-AUTH-${Math.floor(1000 + Math.random() * 9000)}-PASS`,
      verifiedAt: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dpdpConsent: true,
      status: 'Active',
      qrHash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    };

    dataService.addVerifiedProfile(newProfile);
    setGeneratedProfile(newProfile);
    setCurrentStep(5);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setFullName('');
    setEmail('');
    setMobile('');
    setOtpSent(false);
    setOtpCode('');
    setOtpVerified(false);
    setAadhaarNumber('');
    setAadhaarVerified(false);
    setGeneratedProfile(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleMergePair = (pairId: string, name: string) => {
    const result = dataService.mergeDuplicatePair(pairId);
    if (result) {
      setMergedPairToast(`Successfully unified ${name}'s duplicate profiles into SkillPulse ID ${result.primaryProfile.skillPulseId}!`);
      setTimeout(() => setMergedPairToast(null), 4000);
    }
  };

  const pendingDuplicatesCount = duplicatePairs.filter((p) => p.status === 'Pending').length;

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.skillPulseId.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  });

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Verify Identity',
      desc: 'Confirm your email/Gmail, mobile via SMS OTP, date of birth, and mock Aadhaar check.',
      previewTitle: 'Multi-Factor Citizen Authentication',
      previewContent: 'Combines mobile OTP with zero-knowledge UIDAI token verification. The 12-digit Aadhaar number is never stored in compliance with the DPDP Act 2023.',
      badge: 'Step 1: Auth Gateway',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      step: 2,
      title: 'Get SkillPulse ID',
      desc: 'Receive a unique, tamper-proof user ID like SP-2026-IND-XXXX after verification.',
      previewTitle: 'Sovereign Digital Citizen Identifier',
      previewContent: 'Your generated SkillPulse ID serves as a portable credential key across PMKVY, DDU-GKY, and ITI vocational schemes nationwide.',
      badge: 'Step 2: ID Issuance',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      step: 3,
      title: 'Create & Sync Profiles',
      desc: 'Add education, verified skills, certifications, internships, and work experience.',
      previewTitle: 'Multi-Credential Aggregation',
      previewContent: 'Automatically pulls verified vocational badges, course completions, and assessment scores from government skilling registries into one unified ledger.',
      badge: 'Step 3: Credential Graph',
      color: 'from-teal-600 to-emerald-600'
    },
    {
      step: 4,
      title: 'Merge Duplicates',
      desc: 'If multiple profiles exist across schemes, our AI detects and combines them into one unified record.',
      previewTitle: 'Automated Deduplication Engine',
      previewContent: 'Uses phonetic matching, mobile OTP linkage, and token hashing to identify split profiles, intelligently combining distinct qualifications without data loss.',
      badge: 'Step 4: AI Deduplication',
      color: 'from-amber-600 to-orange-600'
    },
    {
      step: 5,
      title: 'AI Analysis & Matching',
      desc: 'Your unified profile feeds into Skill Gap AI analysis and personalized job recommendations.',
      previewTitle: 'Market-Ready Placement Engine',
      previewContent: 'Real-time Gemini AI engine analyzes your verified capabilities against current industry vacancies, calculating wage potential and tailored career roadmaps.',
      badge: 'Step 5: Outcome Optimization',
      color: 'from-purple-600 to-indigo-600'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* GovTech Command Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80 px-4 py-2.5 shadow-sm dark:border-blue-900/40 dark:from-blue-950/30 dark:via-gray-900 dark:to-cyan-950/20">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-950 dark:text-blue-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SkillPulse Sovereign Identity Protocol</span>
          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">•</span>
          <span className="hidden sm:inline font-mono text-[11px] text-blue-700 dark:text-blue-400">UIDAI-SANDBOX-v3.2</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> DPDP Act 2023 Compliant
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Lock className="h-3.5 w-3.5" /> Zero-Storage Cryptography
          </span>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4" />
            Overview & Hub
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'verify'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Identity Verification
            {currentStep > 1 && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
                Step {currentStep}/5
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('duplicates')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'duplicates'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            <GitMerge className="h-4 w-4" />
            Duplicate Detection & Merger
            {pendingDuplicatesCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
                {pendingDuplicatesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            Verified Registry
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {profiles.length}
            </span>
          </button>
        </div>

        {/* Demo helpers */}
        <div className="flex items-center gap-2">
          {activeTab === 'verify' && (
            <button
              onClick={handleAutoFillDemo}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              title="Auto-fill sample verification data"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Demo Auto-Fill
            </button>
          )}
          {activeTab === 'verify' && currentStep > 1 && (
            <button
              onClick={resetWizard}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {mergedPairToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/95 p-4 text-white shadow-2xl backdrop-blur-md animate-slide-up">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-medium">{mergedPairToast}</p>
        </div>
      )}

      {/* =========================================================================
          TAB 1: OVERVIEW & HUB (Elevated Redesign of Reference Screenshot)
      ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-700 via-indigo-700 to-teal-600 p-8 text-white shadow-xl shadow-blue-500/10 dark:border-blue-800">
            {/* Ambient background glow highlights */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>Next-Gen Identity & Profile Verification</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight sm:text-4xl text-white">
                Identity Verification & Unified Profile
              </h1>

              <p className="text-sm sm:text-base font-medium text-blue-100 leading-relaxed">
                Verify your identity using email/Gmail, mobile number with OTP, date of birth, and a mock Aadhaar check. After verification, you'll get a unique SkillPulse User ID and can create unified profiles with your qualifications. If you create multiple profiles, the system detects duplicates and offers to merge them into one unified profile used for AI Skill Gap Analysis and personalized job recommendations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    resetWizard();
                    setActiveTab('verify');
                  }}
                  className="flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-blue-800 shadow-lg shadow-black/10 transition-all hover:bg-blue-50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99]"
                >
                  <ShieldCheck className="h-5 w-5 text-blue-600 stroke-[2.2]" />
                  <span>Start Identity Verification</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveTab('duplicates')}
                  className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <GitMerge className="h-4 w-4 text-cyan-300" />
                  <span>Detect & Merge Duplicates</span>
                  {pendingDuplicatesCount > 0 && (
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-gray-900">
                      {pendingDuplicatesCount} Pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('directory')}
                  className="flex items-center gap-2 rounded-2xl border border-white/20 bg-black/15 px-4 py-3.5 text-xs font-medium text-blue-100 hover:bg-black/25"
                >
                  <Users className="h-4 w-4" />
                  View Registry ({profiles.length})
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="text-xs font-semibold">Verified Citizens</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                {profiles.length + 1480}
              </p>
              <span className="mt-1 inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                +14% this month
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="text-xs font-semibold">Aadhaar Auth Precision</span>
                <ShieldCheck className="h-4 w-4 text-teal-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                99.6%
              </p>
              <span className="mt-1 inline-flex items-center text-[11px] font-medium text-teal-600 dark:text-teal-400">
                UIDAI Tokenized
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="text-xs font-semibold">Duplicates Resolved</span>
                <GitMerge className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                128
              </p>
              <span className="mt-1 inline-flex items-center text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Unified Profiles
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="text-xs font-semibold">AI Skill Sync Rate</span>
                <Sparkles className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                100%
              </p>
              <span className="mt-1 inline-flex items-center text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                Ready for AI Skill Gap
              </span>
            </div>
          </div>

          {/* Elevated 3 Feature Cards (Directly Elevating the User's Screenshot) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: Multi-Factor Verification */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner dark:bg-blue-950/60 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  3-Factor Check
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                Multi-Factor Verification
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                Email, mobile OTP, date of birth, and mock Aadhaar — your Aadhaar number is never stored in plain text.
              </p>

              <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Encrypted 6-digit SMS OTP Simulation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>UIDAI Zero-Knowledge Auth Token</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Section 4 DPDP Act 2023 Consent Guard</span>
                </div>
              </div>

              <button
                onClick={() => {
                  resetWizard();
                  setActiveTab('verify');
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                Launch Verification Wizard <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 2: Duplicate Detection */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-600">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <GitMerge className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  AI Deduplication
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                Duplicate Detection & Merging
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                If you create another profile with different qualifications, our AI detects it and offers to merge them into one.
              </p>

              <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Phonetic & Metaphone Name Matching</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Unifies PMKVY, DDU-GKY & ITI records</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Preserves all verified certifications</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('duplicates')}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white"
              >
                Inspect Duplicate Records <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 3: AI-Powered Matching */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-teal-600">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-inner dark:bg-teal-950/60 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                  <Sparkles className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  Gemini Core
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                AI-Powered Matching
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                Your unified profile feeds into Skill Gap AI analysis and personalized high-retention job recommendations.
              </p>

              <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Real-time NSQF Skill Matrix Mapping</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Predicts 6-Month Employment Retention</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Generates Portable QR Skill Passport</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate ? onNavigate('skillgap') : setActiveTab('directory')}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-semibold text-teal-600 transition hover:bg-teal-600 hover:text-white dark:bg-gray-800 dark:text-teal-400 dark:hover:bg-teal-600 dark:hover:text-white"
              >
                Open Skill Gap AI Engine <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive "How It Works" Section with Live Preview */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  How SkillPulse Sovereign Verification Works
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Click any step below to explore the underlying architectural verification & deduplication pipeline.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Interactive Architecture
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Stepper column (Left 7 cols) */}
              <div className="space-y-3 lg:col-span-7">
                {howItWorksSteps.map((s) => {
                  const isSelected = activeHowItWorksStep === s.step;
                  return (
                    <div
                      key={s.step}
                      onClick={() => setActiveHowItWorksStep(s.step)}
                      className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10 dark:border-blue-500 dark:bg-blue-950/40'
                          : 'border-gray-200/80 bg-white hover:border-blue-300 hover:bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-bold text-sm transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {s.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold transition-colors ${
                              isSelected
                                ? 'text-blue-900 dark:text-blue-200'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {s.title}
                          </h4>
                          <span className="text-[10px] uppercase font-mono text-gray-400 group-hover:text-blue-500">
                            Inspect →
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Live Inspector Panel (Right 5 cols) */}
              <div className="lg:col-span-5">
                {(() => {
                  const current = howItWorksSteps.find((s) => s.step === activeHowItWorksStep) || howItWorksSteps[0];
                  return (
                    <div className="sticky top-6 rounded-2xl border border-blue-200/80 bg-gradient-to-b from-blue-900 to-indigo-950 p-6 text-white shadow-xl dark:border-blue-800">
                      <div className="flex items-center justify-between border-b border-blue-700/50 pb-3">
                        <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30">
                          {current.badge}
                        </span>
                        <span className="text-xs font-mono text-blue-300">Phase 0{current.step} of 05</span>
                      </div>

                      <h3 className="mt-4 text-base font-bold text-white">
                        {current.previewTitle}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-blue-100">
                        {current.previewContent}
                      </p>

                      {/* Dynamic Mock Visual for each step */}
                      <div className="mt-5 rounded-xl bg-blue-950/90 p-3.5 border border-blue-800/80 font-mono text-xs space-y-2">
                        {current.step === 1 && (
                          <div className="space-y-1.5 text-[11px] text-blue-200">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Email Check:</span>
                              <span className="text-emerald-400">RFC-5322 Valid</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">SMS Gateway:</span>
                              <span className="text-emerald-400">OTP-749210 (60s TTL)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Aadhaar Encryption:</span>
                              <span className="text-cyan-300">AES-256-GCM (Zero-Store)</span>
                            </div>
                          </div>
                        )}

                        {current.step === 2 && (
                          <div className="space-y-1.5 text-[11px] text-blue-200">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Assigned ID:</span>
                              <span className="text-cyan-300 font-bold">SP-2026-IND-8942</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Issuer:</span>
                              <span className="text-white">MSDE Sandbox Central</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Cryptographic Seal:</span>
                              <span className="text-emerald-400">SHA-256 Validated</span>
                            </div>
                          </div>
                        )}

                        {current.step === 3 && (
                          <div className="space-y-1.5 text-[11px] text-blue-200">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Vocational Badges:</span>
                              <span className="text-emerald-400">3 Verified Badges</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Primary Skill:</span>
                              <span className="text-white">Data Cleaning & Python</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">NSQF Level:</span>
                              <span className="text-amber-300">Level 5 Certified</span>
                            </div>
                          </div>
                        )}

                        {current.step === 4 && (
                          <div className="space-y-1.5 text-[11px] text-blue-200">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Phonetic Score:</span>
                              <span className="text-amber-400">96% Metaphone Match</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Auto-Merge Strategy:</span>
                              <span className="text-cyan-300">Union Without Loss</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Combined Creds:</span>
                              <span className="text-emerald-400">+2 New Skills Added</span>
                            </div>
                          </div>
                        )}

                        {current.step === 5 && (
                          <div className="space-y-1.5 text-[11px] text-blue-200">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Job Fit Score:</span>
                              <span className="text-emerald-400">89% Match (Data Tech)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Skill Gap Detected:</span>
                              <span className="text-amber-300">Advanced SQL (10 hrs)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Retention Projection:</span>
                              <span className="text-cyan-300">91% at 6-Months</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-2">
                        <button
                          onClick={() => {
                            if (current.step === 4) setActiveTab('duplicates');
                            else if (current.step === 5) onNavigate ? onNavigate('skillgap') : setActiveTab('directory');
                            else {
                              setCurrentStep(current.step as VerificationStep);
                              setActiveTab('verify');
                            }
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-2.5 text-xs font-bold text-blue-950 shadow-md transition hover:bg-cyan-300"
                        >
                          <span>Test Phase in Sandbox</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: 5-STEP IDENTITY VERIFICATION WIZARD
      ========================================================================= */}
      {activeTab === 'verify' && (
        <div className="py-2 animate-fade-in">
          {/* Main Top Header */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 sm:h-16 sm:w-16">
              <ShieldCheck className="h-8 w-8 text-white stroke-[2.2]" />
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Identity Verification Sandbox
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Verify your identity to generate a tamper-proof SkillPulse User ID
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center px-4">
            {/* Step 1: Email */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : currentStep > 1
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <Mail className="h-4 w-4" />
              </button>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  currentStep === 1
                    ? 'font-semibold text-blue-600 dark:text-blue-400'
                    : currentStep > 1
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Email
              </span>
            </div>

            <div
              className={`mb-5 h-0.5 w-8 transition-colors sm:w-16 ${
                currentStep > 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />

            {/* Step 2: Mobile + OTP */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(2)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : currentStep > 2
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <Phone className="h-4 w-4" />
              </button>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  currentStep === 2
                    ? 'font-semibold text-blue-600 dark:text-blue-400'
                    : currentStep > 2
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Mobile + OTP
              </span>
            </div>

            <div
              className={`mb-5 h-0.5 w-8 transition-colors sm:w-16 ${
                currentStep > 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />

            {/* Step 3: Date of Birth */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => currentStep > 2 && setCurrentStep(3)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                  currentStep === 3
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : currentStep > 3
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <Calendar className="h-4 w-4" />
              </button>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  currentStep === 3
                    ? 'font-semibold text-blue-600 dark:text-blue-400'
                    : currentStep > 3
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Demographics
              </span>
            </div>

            <div
              className={`mb-5 h-0.5 w-8 transition-colors sm:w-16 ${
                currentStep > 3 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />

            {/* Step 4: Aadhaar */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => currentStep > 3 && setCurrentStep(4)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                  currentStep === 4
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : currentStep > 4
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <CreditCard className="h-4 w-4" />
              </button>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  currentStep === 4
                    ? 'font-semibold text-blue-600 dark:text-blue-400'
                    : currentStep > 4
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Aadhaar
              </span>
            </div>

            <div
              className={`mb-5 h-0.5 w-8 transition-colors sm:w-16 ${
                currentStep > 4 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />

            {/* Step 5: Complete */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => currentStep === 5 && setCurrentStep(5)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                  currentStep === 5
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                    : 'border border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  currentStep === 5
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                Complete
              </span>
            </div>
          </div>

          {/* STEP 1: Email / Gmail Verification */}
          {currentStep === 1 && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-bold text-gray-900 dark:text-white">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>Email / Gmail Verification</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                  Step 1 of 5
                </span>
              </div>

              <form onSubmit={handleStep1Continue} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name (as per official documents)
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Aditya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="aditya.sharma2026@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    We will send an encrypted verification link and outcome alerts to this address.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.99]"
                  >
                    Continue to Mobile & OTP →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Mobile + SMS OTP */}
          {currentStep === 2 && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-bold text-gray-900 dark:text-white">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>Mobile SMS OTP Verification</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                  Step 2 of 5
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mobile Number (India)
                  </label>
                  <div className="flex gap-2">
                    <span className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      +91
                    </span>
                    <div className="relative flex-1">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={resendTimer > 0}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                    >
                      {resendTimer > 0 ? `Resend (${resendTimer}s)` : otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                    <div className="flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Simulated SMS Push: Code is <strong>{mockOtp}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCode(mockOtp);
                          setOtpVerified(true);
                        }}
                        className="underline font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 749210"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm tracking-widest text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                        otpVerified
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {otpVerified ? '✓ Verified' : 'Verify Code'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep2Continue}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    Continue to Demographics →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Date of Birth & Demographics */}
          {currentStep === 3 && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-bold text-gray-900 dark:text-white">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Date of Birth & Demographics</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                  Step 3 of 5
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender
                    </label>
                    <div className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                      {(['Male', 'Female', 'Other'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`rounded-lg py-1.5 text-xs font-medium transition ${
                            gender === g
                              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-white font-semibold'
                              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Father's / Guardian's Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Domicile State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      District
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3Continue}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    Continue to Aadhaar Auth →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Aadhaar Verification (UIDAI Gateway) */}
          {currentStep === 4 && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-bold text-gray-900 dark:text-white">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Aadhaar Identity Authentication</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                  Step 4 of 5
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    12-Digit Aadhaar Number
                  </label>
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="4829 7612 9043"
                      value={aadhaarNumber}
                      onChange={(e) => formatAadhaarInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-mono tracking-wider text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Transmitted via 256-bit encrypted UIDAI Sandbox tunnel. No raw numbers are stored on SkillPulse.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/25">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-blue-950 dark:text-blue-200">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="leading-relaxed">
                      I hereby give explicit consent to verify my identity via UIDAI / DigiLocker in compliance with Section 4 of the Digital Personal Data Protection (DPDP) Act 2023.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="text-xs">
                    <p className="font-bold text-gray-800 dark:text-gray-200">UIDAI Authentication</p>
                    <p className="text-gray-500">
                      {aadhaarVerified
                        ? 'Authenticated: Cryptographic token issued'
                        : 'Sandbox validation ready'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyAadhaar}
                    disabled={aadhaarVerifying || aadhaarVerified}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      aadhaarVerified
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    }`}
                  >
                    {aadhaarVerifying ? 'Authenticating...' : aadhaarVerified ? '✓ Authenticated' : 'Authenticate Aadhaar'}
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep4Continue}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    Generate SkillPulse ID →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Verification Complete & Digital Identity Card */}
          {currentStep === 5 && generatedProfile && (
            <div className="mx-auto mt-8 max-w-xl space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 text-center dark:border-emerald-900/60 dark:bg-emerald-950/40">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-3 text-2xl font-black text-emerald-950 dark:text-emerald-200">
                  Identity Verified Successfully!
                </h2>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  Unique SkillPulse Citizen ID generated and stored with DPDP Act 2023 compliance.
                </p>
              </div>

              {/* Official Holographic Digital Smart ID Card */}
              <div className="relative overflow-hidden rounded-3xl border border-blue-300/80 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl dark:border-blue-700">
                {/* Visual watermark */}
                <div className="pointer-events-none absolute right-2 top-2 opacity-5">
                  <ShieldCheck className="h-64 w-64 text-white" />
                </div>

                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-blue-700/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 font-black text-white shadow">
                      SP
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        Government of India · MSDE Sandbox
                      </p>
                      <h3 className="text-base font-black">SkillPulse Citizen Identity Card</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-300 border border-emerald-400/30">
                    VERIFIED CITIZEN
                  </span>
                </div>

                {/* Card Body */}
                <div className="mt-5 grid grid-cols-3 gap-4">
                  {/* Photo & QR */}
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-blue-950/70 p-3 border border-blue-800/60 text-center backdrop-blur-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-xl font-black text-white shadow-inner">
                      {generatedProfile.fullName.charAt(0)}
                    </div>
                    <button
                      onClick={() => setShowQrDetails(!showQrDetails)}
                      className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:underline"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      {showQrDetails ? 'Hide QR' : 'Show QR'}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-blue-300">Candidate Name</span>
                      <p className="text-sm font-bold text-white">{generatedProfile.fullName}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-blue-950/80 px-3 py-1.5 border border-blue-800">
                      <div>
                        <span className="text-[9px] uppercase text-cyan-400">SkillPulse User ID</span>
                        <p className="font-mono text-xs font-bold text-white">{generatedProfile.skillPulseId}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedProfile.skillPulseId)}
                        className="rounded-lg p-1.5 text-blue-300 hover:bg-blue-800"
                        title="Copy ID"
                      >
                        {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] text-blue-300">DOB & Gender</span>
                        <p>{generatedProfile.dob} ({generatedProfile.gender})</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-blue-300">Aadhaar (Masked)</span>
                        <p className="font-mono">{generatedProfile.aadhaarMasked}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] text-blue-300">District / State</span>
                        <p>{generatedProfile.district}, {generatedProfile.state}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-blue-300">Valid Until</span>
                        <p>{generatedProfile.validUntil}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code expansion */}
                {showQrDetails && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-gray-900 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Cryptographic Auth Seal</span>
                      <span className="text-emerald-700">✓ UIDAI & DPDP Validated</span>
                    </div>
                    <p className="mt-1 font-mono text-[9px] text-gray-500 break-all leading-relaxed">
                      {generatedProfile.qrHash}
                    </p>
                  </div>
                )}

                {/* Card Footer badges */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-blue-800/60 pt-3 text-[10px] text-blue-300">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Check className="h-3 w-3 text-emerald-400" /> Email Verified
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Check className="h-3 w-3 text-emerald-400" /> Mobile Verified
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Check className="h-3 w-3 text-emerald-400" /> Aadhaar Linked
                    </span>
                  </div>
                  <span>Issued: {generatedProfile.verifiedAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Download / Print ID Card
                </button>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  View in Directory →
                </button>
                <button
                  onClick={resetWizard}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-gray-200 p-3 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  title="Verify Another"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: DUPLICATE DETECTION & AI PROFILE MERGER
      ========================================================================= */}
      {activeTab === 'duplicates' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-blue-600" />
                AI Duplicate Candidate Detection & Profile Merger
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                SkillPulse automatically detects fragmented profiles across PMKVY, DDU-GKY, and ITI cohorts, offering intelligent 1-click unification into a sovereign SkillPulse ID.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {pendingDuplicatesCount} Action Required
              </span>
            </div>
          </div>

          {/* Duplicate Pairs List */}
          <div className="space-y-6">
            {duplicatePairs.map((pair) => (
              <div
                key={pair.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-800 text-xs dark:bg-amber-950 dark:text-amber-300">
                      {pair.confidenceScore}%
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        Duplicate Candidate Detected: {pair.primaryProfile.fullName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        {pair.matchReasons.map((r, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      pair.status === 'Merged'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {pair.status === 'Merged' ? '✓ Successfully Unified' : 'Pending Review'}
                  </span>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Primary Profile */}
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 dark:border-blue-900/40 dark:bg-blue-950/10">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Primary Verified Record
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                          {pair.primaryProfile.skillPulseId}
                        </span>
                      </div>

                      <h5 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
                        {pair.primaryProfile.fullName}
                      </h5>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <p><span className="text-gray-400">Provider:</span> {pair.primaryProfile.provider}</p>
                        <p><span className="text-gray-400">Location:</span> {pair.primaryProfile.district}</p>
                        <p><span className="text-gray-400">Education:</span> {pair.primaryProfile.education}</p>
                        <p><span className="text-gray-400">Mobile:</span> {pair.primaryProfile.mobile}</p>
                      </div>

                      <div className="mt-4">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Skills Acquired:</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {pair.primaryProfile.skills.map((s) => (
                            <span key={s} className="rounded-lg bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Certifications:</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {pair.primaryProfile.certifications.map((c) => (
                            <span key={c} className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Detected Duplicate Profile */}
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-5 dark:border-amber-900/40 dark:bg-amber-950/10">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Detected Duplicate Profile
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                          {pair.duplicateProfile.skillPulseId}
                        </span>
                      </div>

                      <h5 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
                        {pair.duplicateProfile.fullName}
                      </h5>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <p><span className="text-gray-400">Provider:</span> {pair.duplicateProfile.provider}</p>
                        <p><span className="text-gray-400">Location:</span> {pair.duplicateProfile.district}</p>
                        <p><span className="text-gray-400">Education:</span> {pair.duplicateProfile.education}</p>
                        <p><span className="text-gray-400">Mobile:</span> {pair.duplicateProfile.mobile}</p>
                      </div>

                      <div className="mt-4">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Skills to Merge:</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {pair.duplicateProfile.skills.map((s) => (
                            <span key={s} className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">New Certifications to Import:</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {pair.duplicateProfile.certifications.map((c) => (
                            <span key={c} className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                              + {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Merged Resolution Result or Action */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5 dark:border-gray-800">
                    <div className="text-xs text-gray-500">
                      {pair.status === 'Merged' ? (
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          Unified on {pair.mergedResult?.mergedAt} • Canonical ID: {pair.mergedResult?.unifiedSkillPulseId}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Merging combines all skills, qualifications and certifications without losing training history.
                        </p>
                      )}
                    </div>

                    {pair.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dataService.dismissDuplicatePair(pair.id)}
                          className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                          Dismiss as Distinct
                        </button>
                        <button
                          onClick={() => handleMergePair(pair.id, pair.primaryProfile.fullName)}
                          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.99]"
                        >
                          <GitMerge className="h-3.5 w-3.5" />
                          Intelligently Merge Profiles
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveTab('directory')}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Inspect in Registry →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: VERIFIED CITIZEN DIRECTORY
      ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Verified SkillPulse Profiles Directory
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Official registry of candidate identities verified through Email, Mobile OTP, and UIDAI Aadhaar sandbox.
              </p>
            </div>
            <button
              onClick={() => {
                resetWizard();
                setActiveTab('verify');
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700"
            >
              <ShieldCheck className="h-4 w-4" />
              + Verify New Candidate
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, SkillPulse ID, Email, or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="group relative rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 font-bold text-white shadow">
                      {p.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {p.fullName}
                      </h4>
                      <p className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {p.skillPulseId}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {p.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{p.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>{p.district}, {p.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-mono text-[11px]">{p.aadhaarMasked}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-500 dark:border-gray-800">
                  <span>Verified: {p.verifiedAt}</span>
                  <button
                    onClick={() => setSelectedProfileForModal(p)}
                    className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View ID Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ID Card Detail Modal */}
      {selectedProfileForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProfileForModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-gray-900 p-6 text-white shadow-2xl border border-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold">SkillPulse Verified Identity Card</h3>
              <button
                onClick={() => setSelectedProfileForModal(null)}
                className="rounded-xl p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Smart ID Card preview */}
            <div className="mt-4 rounded-2xl bg-gradient-to-b from-blue-900 to-indigo-950 p-5 text-white shadow-inner border border-blue-800">
              <div className="flex items-center justify-between border-b border-blue-700/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 font-black text-white text-xs">
                    SP
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-cyan-300">MSDE · SkillPulse</p>
                    <p className="text-xs font-bold">{selectedProfileForModal.fullName}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {selectedProfileForModal.skillPulseId}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-blue-300">Email</span>
                  <p className="truncate font-medium">{selectedProfileForModal.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Mobile</span>
                  <p className="font-medium">{selectedProfileForModal.mobile}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Aadhaar (UIDAI Verified)</span>
                  <p className="font-mono">{selectedProfileForModal.aadhaarMasked}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Location</span>
                  <p className="font-medium">{selectedProfileForModal.district}, {selectedProfileForModal.state}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Issue Date</span>
                  <p>{selectedProfileForModal.verifiedAt}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Valid Until</span>
                  <p>{selectedProfileForModal.validUntil}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-blue-950/80 p-3 text-[10px] text-blue-300 border border-blue-800">
                <p className="font-mono break-all">{selectedProfileForModal.qrHash}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Download className="h-3.5 w-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedProfileForModal(null)}
                className="rounded-xl border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
