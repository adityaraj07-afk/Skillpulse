import { useState, useEffect } from 'react';
import {
  ShieldCheck, Mail, Phone, Calendar, CreditCard, CheckCircle2,
  User, ArrowRight, ArrowLeft, Download, RefreshCw, Copy, Check,
  Search, Eye, QrCode, Sparkles, Building2, MapPin, Award
} from 'lucide-react';
import { dataService, type VerifiedProfile } from '@/services/dataService';
import type { PageKey } from '@/components/Sidebar';

interface IdentityProfilesProps {
  onNavigate?: (page: PageKey) => void;
}

type VerificationStep = 1 | 2 | 3 | 4 | 5;

export function IdentityProfiles({ onNavigate }: IdentityProfilesProps) {
  const [activeTab, setActiveTab] = useState<'verify' | 'directory'>('verify');
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

  useEffect(() => {
    setProfiles(dataService.getVerifiedProfiles());
    const unsub = dataService.subscribe(() => {
      setProfiles(dataService.getVerifiedProfiles());
    });
    return unsub;
  }, []);

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
      // Auto verify for smooth prototyping experience if user directly clicks continue
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
    // Generate unique SkillPulse ID
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

  // Directory filter
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.skillPulseId.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Tabs & Quick Demo Helper */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'verify'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Identity Verification
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'directory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <User className="h-4 w-4" />
            Verified Profiles Directory
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {profiles.length}
            </span>
          </button>
        </div>

        {activeTab === 'verify' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillDemo}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              title="Auto-fill sample verification data"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Demo Auto-Fill
            </button>
            {currentStep > 1 && (
              <button
                onClick={resetWizard}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'verify' ? (
        <div className="py-2">
          {/* Main Top Icon matching user image */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00a8cc] shadow-lg shadow-cyan-500/25 sm:h-16 sm:w-16">
              <ShieldCheck className="h-8 w-8 text-white stroke-[2.2]" />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Identity Verification
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Verify your identity to generate a unique SkillPulse User ID
            </p>
          </div>

          {/* Stepper matching screenshot */}
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
                Date of Birth
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

          {/* Step 1: Email / Gmail Verification (Exact Image Match) */}
          {currentStep === 1 && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-white">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Email / Gmail Verification</span>
              </div>

              <form onSubmit={handleStep1Continue} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
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
                      placeholder="your.email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  Continue →
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Mobile + OTP */}
          {currentStep === 2 && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-white">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>Mobile + OTP Verification</span>
                </div>
                <span className="text-xs font-medium text-gray-500">Step 2 of 5</span>
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
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                    <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                      <span>Mock SMS Received: Verification Code is <strong>{mockOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCode(mockOtp);
                          setOtpVerified(true);
                        }}
                        className="underline hover:text-emerald-900"
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
                      className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm tracking-widest text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                        otpVerified
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'
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
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date of Birth & Demographics */}
          {currentStep === 3 && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-white">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Date of Birth & Demographics</span>
                </div>
                <span className="text-xs font-medium text-gray-500">Step 3 of 5</span>
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
                      State
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
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Aadhaar Verification (UIDAI Gateway) */}
          {currentStep === 4 && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-white">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Aadhaar Identity Authentication</span>
                </div>
                <span className="text-xs font-medium text-gray-500">Step 4 of 5</span>
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
                    Numbers are transmitted via 256-bit encrypted UIDAI Sandbox tunnel.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-blue-950 dark:text-blue-200">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      I hereby give explicit consent to verify my identity via UIDAI / DigiLocker in compliance with Section 4 of the Digital Personal Data Protection (DPDP) Act 2023.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                  <div className="text-xs">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">UIDAI Authentication</p>
                    <p className="text-gray-500">
                      {aadhaarVerified
                        ? 'Authenticated: Token active & linked to mobile'
                        : 'Sandbox validation ready'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyAadhaar}
                    disabled={aadhaarVerifying || aadhaarVerified}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      aadhaarVerified
                        ? 'bg-emerald-600 text-white'
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

          {/* Step 5: Verification Complete & Digital Identity Card */}
          {currentStep === 5 && generatedProfile && (
            <div className="mx-auto mt-8 max-w-xl space-y-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="mt-3 text-xl font-bold text-emerald-950 dark:text-emerald-200">
                  Identity Verified Successfully!
                </h2>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  Unique SkillPulse Citizen ID generated and registered in MSDE Sandbox store.
                </p>
              </div>

              {/* Digital Smart Card Display */}
              <div className="overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-b from-blue-900 to-indigo-950 p-6 text-white shadow-xl dark:border-blue-800">
                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-blue-700/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold text-white shadow">
                      SP
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                        Government of India · MSDE Sandbox
                      </p>
                      <h3 className="text-base font-bold">SkillPulse Identity Card</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-300 border border-emerald-400/30">
                    VERIFIED CITIZEN
                  </span>
                </div>

                {/* Card Body */}
                <div className="mt-5 grid grid-cols-3 gap-4">
                  {/* Photo & QR */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-blue-950/60 p-3 border border-blue-800/60 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-xl font-bold text-white shadow-inner">
                      {generatedProfile.fullName.charAt(0)}
                    </div>
                    <button
                      onClick={() => setShowQrDetails(!showQrDetails)}
                      className="mt-3 flex items-center gap-1 text-[10px] text-cyan-300 hover:underline"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      {showQrDetails ? 'Hide QR' : 'Show QR'}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-blue-300">Candidate Name</span>
                      <p className="text-sm font-bold">{generatedProfile.fullName}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-blue-950/80 px-2.5 py-1.5 border border-blue-800">
                      <div>
                        <span className="text-[9px] uppercase text-cyan-400">SkillPulse User ID</span>
                        <p className="font-mono text-xs font-bold text-white">{generatedProfile.skillPulseId}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedProfile.skillPulseId)}
                        className="rounded p-1 text-blue-300 hover:bg-blue-800"
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
                  <div className="mt-4 rounded-xl bg-white p-3 text-gray-900 animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span>Cryptographic Auth Seal</span>
                      <span className="text-emerald-700">✓ UIDAI & DPDP Validated</span>
                    </div>
                    <p className="mt-1 font-mono text-[9px] text-gray-500 break-all">
                      {generatedProfile.qrHash}
                    </p>
                  </div>
                )}

                {/* Card Footer badges */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-blue-800/60 pt-3 text-[10px] text-blue-300">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-400" /> Email Verified
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-400" /> Mobile Verified
                    </span>
                    <span className="flex items-center gap-1">
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
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" /> Download / Print ID Card
                </button>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  View in Directory →
                </button>
                <button
                  onClick={resetWizard}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 p-3 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  title="Verify Another"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Badges below card matching screenshot */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="rounded-md bg-amber-100 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              PROTOTYPE
            </span>
            <span className="rounded-md bg-gray-100 px-3 py-1 text-[11px] font-medium tracking-wider text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              MOCK VERIFICATION
            </span>
          </div>
        </div>
      ) : (
        /* Tab 2: Verified Profiles Directory */
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Verified SkillPulse Profiles Directory
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official registry of candidate identities verified through Email, Mobile OTP, and UIDAI Aadhaar sandbox.
              </p>
            </div>
            <button
              onClick={() => {
                resetWizard();
                setActiveTab('verify');
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700"
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
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 font-bold text-white shadow">
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
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {p.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
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
                    className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={() => setSelectedProfileForModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-gray-900 p-6 text-white shadow-2xl border border-blue-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold">SkillPulse Verified Identity Card</h3>
              <button
                onClick={() => setSelectedProfileForModal(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Smart ID Card preview */}
            <div className="mt-4 rounded-xl bg-gradient-to-b from-blue-900 to-indigo-950 p-5 text-white shadow-inner border border-blue-800">
              <div className="flex items-center justify-between border-b border-blue-700/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white text-xs">
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
                  <p className="truncate">{selectedProfileForModal.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Mobile</span>
                  <p>{selectedProfileForModal.mobile}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Aadhaar (UIDAI Verified)</span>
                  <p className="font-mono">{selectedProfileForModal.aadhaarMasked}</p>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Location</span>
                  <p>{selectedProfileForModal.district}, {selectedProfileForModal.state}</p>
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

              <div className="mt-4 rounded-lg bg-blue-950/80 p-2.5 text-[10px] text-blue-300 border border-blue-800">
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
