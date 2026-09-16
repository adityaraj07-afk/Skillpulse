import { useState, useEffect, useMemo } from 'react';
import {
  Network, CheckCircle2, AlertCircle, Building2, Search,
  ArrowRight, ShieldCheck, FileCheck, RefreshCw, Database,
  ExternalLink, Layers, Check, Zap, Server
} from 'lucide-react';
import { Card, SectionTitle, Badge } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { integrationService, type EPFOResult, type GSTNResult, type EShramResult, type SIDHResult } from '@/services/integrationService';
import { type Trainee } from '@/data/mockData';

export function Integrations() {
  const [trainees, setTrainees] = useState<Trainee[]>(() => dataService.getTrainees());
  const [selectedTraineeId, setSelectedTraineeId] = useState<string>(trainees[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'epfo' | 'gstn' | 'eshram' | 'sidh'>('epfo');

  // Input states
  const [uanInput, setUanInput] = useState('101489201948');
  const [gstinInput, setGstinInput] = useState('27AABCT3518Q1Z4');
  const [eshramInput, setEshramInput] = useState('981240184910');

  // Loading & results
  const [isLoading, setIsLoading] = useState(false);
  const [epfoResult, setEpfoResult] = useState<EPFOResult | null>(null);
  const [gstnResult, setGstnResult] = useState<GSTNResult | null>(null);
  const [eshramResult, setEshramResult] = useState<EShramResult | null>(null);
  const [sidhResult, setSidhResult] = useState<SIDHResult | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setTrainees([...dataService.getTrainees()]);
    });
    return () => unsub();
  }, []);

  const selectedTrainee = useMemo(
    () => trainees.find((t) => t.id === selectedTraineeId) || trainees[0],
    [trainees, selectedTraineeId]
  );

  const handleVerifyEPFO = async () => {
    if (!selectedTrainee) return;
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      const res = await integrationService.verifyEPFO(selectedTrainee.id, uanInput);
      setEpfoResult(res);
      setSuccessMessage(`Trainee ${selectedTrainee.name} has been verified via EPFO! Status promoted to 'Employer-Verified'.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyGSTN = async () => {
    if (!selectedTrainee) return;
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      const res = await integrationService.verifyGSTN(selectedTrainee.id, gstinInput);
      setGstnResult(res);
      setSuccessMessage(`Business registration for ${selectedTrainee.name} verified via GSTN! Status promoted to 'Employer-Verified'.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEShram = async () => {
    if (!selectedTrainee) return;
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      const res = await integrationService.verifyEShram(selectedTrainee.id, eshramInput);
      setEshramResult(res);
      setSuccessMessage(`e-Shram unorganized worker registry confirmed for ${selectedTrainee.name}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySIDH = async () => {
    if (!selectedTrainee) return;
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      const res = await integrationService.verifySIDH(selectedTrainee.id);
      setSidhResult(res);
      setSuccessMessage(`Skill India Digital Hub credential verified for ${selectedTrainee.name}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            SIH Slide 03 Specification
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Government Integration Gateway</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Automated multi-system cross-verification adapters for EPFO/UAN, GSTN, e-Shram, and Skill India Digital Hub (SIDH)
        </p>
      </div>

      {/* Gateway Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">EPFO / UAN</h3>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Formal employment & monthly PF remittance check</p>
          <div className="mt-3 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span>Protocol: REST / OAuth 2.0</span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 dark:bg-emerald-950">Active</span>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">GSTN / ITR</h3>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-950" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Self-employed micro-enterprise tax filing check</p>
          <div className="mt-3 flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
            <span>Protocol: GSP Sandbox API</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 dark:bg-blue-950">Active</span>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">e-Shram</h3>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">National database for unorganized & informal workers</p>
          <div className="mt-3 flex items-center justify-between text-xs font-medium text-amber-600 dark:text-amber-400">
            <span>Protocol: National API Setu</span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 dark:bg-amber-950">Active</span>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">SIDH (NSDC)</h3>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-purple-500 ring-4 ring-purple-100 dark:ring-purple-950" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Central certification & NSQF qualification ledger</p>
          <div className="mt-3 flex items-center justify-between text-xs font-medium text-purple-600 dark:text-purple-400">
            <span>Protocol: SIDH Sync Engine</span>
            <span className="rounded bg-purple-50 px-1.5 py-0.5 dark:bg-purple-950">Active</span>
          </div>
        </Card>
      </div>

      {/* Trainee Selector & Gateway Terminal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Trainee Context */}
        <Card className="p-5 space-y-4">
          <SectionTitle
            title="Target Beneficiary"
            subtitle="Select candidate to run verification against"
            icon={<Search className="h-5 w-5" />}
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Select Trainee</label>
            <select
              value={selectedTraineeId}
              onChange={(e) => {
                setSelectedTraineeId(e.target.value);
                setEpfoResult(null);
                setGstnResult(null);
                setEshramResult(null);
                setSidhResult(null);
                setSuccessMessage(null);
              }}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {trainees.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.unifiedId}) — {t.employmentStatus}
                </option>
              ))}
            </select>
          </div>

          {selectedTrainee && (
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 space-y-2 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Unified ID:</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{selectedTrainee.unifiedId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Course:</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{selectedTrainee.courseName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Provider:</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{selectedTrainee.providerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Current Evidence State:</span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{selectedTrainee.evidence}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Reported Job:</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">{selectedTrainee.jobRole || 'Unplaced'}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </Card>

        {/* Right: Interactive Gateway Query Terminal */}
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">API Verification Console</h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('epfo')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'epfo'
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                EPFO / UAN
              </button>
              <button
                onClick={() => setActiveTab('gstn')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'gstn'
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                GSTN / ITR
              </button>
              <button
                onClick={() => setActiveTab('eshram')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'eshram'
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                e-Shram
              </button>
              <button
                onClick={() => setActiveTab('sidh')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'sidh'
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                SIDH Cert
              </button>
            </div>
          </div>

          {/* TAB 1: EPFO */}
          {activeTab === 'epfo' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">12-Digit UAN Number</label>
                  <input
                    type="text"
                    value={uanInput}
                    onChange={(e) => setUanInput(e.target.value)}
                    placeholder="e.g. 101489201948"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleVerifyEPFO}
                    disabled={isLoading || !uanInput}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    Query EPFO Gateway
                  </button>
                </div>
              </div>

              {epfoResult && (
                <div className="rounded-lg border border-gray-200 bg-gray-900 p-4 font-mono text-xs text-emerald-400 space-y-1">
                  <p className="text-gray-400">// 200 OK — EPFO API RESPONSE</p>
                  <p>&#123;</p>
                  <p className="pl-4">"uan": "{epfoResult.uan}",</p>
                  <p className="pl-4">"memberId": "{epfoResult.memberId}",</p>
                  <p className="pl-4">"establishment": "{epfoResult.establishmentName}",</p>
                  <p className="pl-4">"joiningDate": "{epfoResult.joiningDate}",</p>
                  <p className="pl-4">"lastRemittanceMonth": "{epfoResult.lastContributionMonth}",</p>
                  <p className="pl-4">"status": "{epfoResult.activeStatus ? 'ACTIVE_CONTRIBUTING' : 'INACTIVE'}",</p>
                  <p className="pl-4">"verified": {String(epfoResult.verified)}</p>
                  <p>&#125;</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GSTN */}
          {activeTab === 'gstn' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">15-Digit GSTIN / PAN</label>
                  <input
                    type="text"
                    value={gstinInput}
                    onChange={(e) => setGstinInput(e.target.value)}
                    placeholder="e.g. 27AABCT3518Q1Z4"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleVerifyGSTN}
                    disabled={isLoading || !gstinInput}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    Verify GST Filing
                  </button>
                </div>
              </div>

              {gstnResult && (
                <div className="rounded-lg border border-gray-200 bg-gray-900 p-4 font-mono text-xs text-blue-400 space-y-1">
                  <p className="text-gray-400">// 200 OK — GSTN GSP API RESPONSE</p>
                  <p>&#123;</p>
                  <p className="pl-4">"gstin": "{gstnResult.gstin}",</p>
                  <p className="pl-4">"tradeName": "{gstnResult.tradeName}",</p>
                  <p className="pl-4">"taxpayerType": "{gstnResult.taxpayerType}",</p>
                  <p className="pl-4">"registrationDate": "{gstnResult.registrationDate}",</p>
                  <p className="pl-4">"lastReturnFiling": "{gstnResult.lastReturnFiling}",</p>
                  <p className="pl-4">"status": "{gstnResult.status}",</p>
                  <p className="pl-4">"verified": {String(gstnResult.verified)}</p>
                  <p>&#125;</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: e-Shram */}
          {activeTab === 'eshram' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">12-Digit e-Shram UAN</label>
                  <input
                    type="text"
                    value={eshramInput}
                    onChange={(e) => setEshramInput(e.target.value)}
                    placeholder="e.g. 981240184910"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleVerifyEShram}
                    disabled={isLoading || !eshramInput}
                    className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    Check e-Shram
                  </button>
                </div>
              </div>

              {eshramResult && (
                <div className="rounded-lg border border-gray-200 bg-gray-900 p-4 font-mono text-xs text-amber-400 space-y-1">
                  <p className="text-gray-400">// 200 OK — e-SHRAM REGISTRY RESPONSE</p>
                  <p>&#123;</p>
                  <p className="pl-4">"uan12Digit": "{eshramResult.uan12Digit}",</p>
                  <p className="pl-4">"beneficiaryName": "{eshramResult.fullName}",</p>
                  <p className="pl-4">"primaryOccupation": "{eshramResult.occupation}",</p>
                  <p className="pl-4">"registeredDate": "{eshramResult.registeredDate}",</p>
                  <p className="pl-4">"insuranceCovered": {String(eshramResult.insuranceSchemeLinked)},</p>
                  <p className="pl-4">"verified": {String(eshramResult.verified)}</p>
                  <p>&#125;</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SIDH */}
          {activeTab === 'sidh' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Authenticate the training certification hash against National Skill Development Corporation (NSDC) registry.
              </p>
              <button
                onClick={handleVerifySIDH}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Sync with SIDH Repository
              </button>

              {sidhResult && (
                <div className="rounded-lg border border-gray-200 bg-gray-900 p-4 font-mono text-xs text-purple-400 space-y-1">
                  <p className="text-gray-400">// 200 OK — SIDH CERTIFICATION RECORD</p>
                  <p>&#123;</p>
                  <p className="pl-4">"certificateId": "{sidhResult.certificateId}",</p>
                  <p className="pl-4">"candidateId": "{sidhResult.candidateId}",</p>
                  <p className="pl-4">"courseName": "{sidhResult.courseName}",</p>
                  <p className="pl-4">"nsqfLevel": {sidhResult.nsqfLevel},</p>
                  <p className="pl-4">"issuingAuthority": "{sidhResult.assessingBody}",</p>
                  <p className="pl-4">"verified": {String(sidhResult.verified)}</p>
                  <p>&#125;</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
