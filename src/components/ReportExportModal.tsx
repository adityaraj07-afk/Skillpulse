import { useState, useRef } from 'react';
import {
  FileText, Download, Printer, X, CheckCircle2,
  Building2, ShieldCheck, TrendingUp, Users, Award
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { extendedKpis, providers, districtData } from '@/data/mockData';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportExportModal({ isOpen, onClose }: ReportExportModalProps) {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const trainees = dataService.getTrainees();
  const totalTrainees = trainees.length;
  const certifiedTrainees = trainees.filter((t) => t.certified).length;
  const placedTrainees = trainees.filter((t) => t.employmentStatus === 'Placed' || t.employmentStatus === 'Self-Employed').length;
  const employerVerified = trainees.filter((t) => t.evidence === 'Employer-Verified').length;
  const evidenceSupported = trainees.filter((t) => t.evidence === 'Evidence-Supported').length;
  const selfReported = trainees.filter((t) => t.evidence === 'Self-Reported').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Official Skilling Outcome & Impact Report
              </h2>
              <p className="text-xs text-gray-500">Ministry of Skill Development & Entrepreneurship (MSDE) / SIH 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition"
            >
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="mt-6 space-y-6 text-gray-900 dark:text-gray-100 print:text-black">
          {/* Header Banner */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-brand-50 to-blue-50 p-5 dark:border-gray-800 dark:from-gray-800 dark:to-gray-800/80">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  CONFIDENTIAL IMPACT AUDIT REPORT
                </span>
                <h1 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  SkillPulse Longitudinal Outcomes Benchmark
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Report Ref: SP-MSDE-2026-Q3 • Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> DPDP Act Verified
                </span>
              </div>
            </div>
          </div>

          {/* Key Executive Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Executive Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-gray-200 p-3 bg-white dark:border-gray-800 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Total Beneficiaries</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{totalTrainees}</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">100% Cohort Ingestion</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 bg-white dark:border-gray-800 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Certified Beneficiaries</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{certifiedTrainees}</p>
                <p className="text-[11px] text-blue-600 mt-0.5">{Math.round((certifiedTrainees / totalTrainees) * 100)}% Pass Rate</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 bg-white dark:border-gray-800 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Reported Placements</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{placedTrainees}</p>
                <p className="text-[11px] text-brand-600 mt-0.5">{Math.round((placedTrainees / totalTrainees) * 100)}% Employment Rate</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 bg-white dark:border-gray-800 dark:bg-gray-800">
                <p className="text-xs text-gray-500">Evidence Verification Rate</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">
                  {Math.round(((employerVerified + evidenceSupported) / totalTrainees) * 100)}%
                </p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Verified Outcomes</p>
              </div>
            </div>
          </div>

          {/* 5-Tier Verification Distribution */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">5-Tier Outcome Verification Breakdown</h3>
            <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-2.5">Verification Tier</th>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5">Beneficiaries</th>
                    <th className="px-4 py-2.5">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">Employer-Verified</td>
                    <td className="px-4 py-2.5 text-gray-500">Direct corporate authentication or EPFO PF check</td>
                    <td className="px-4 py-2.5 font-semibold">{employerVerified}</td>
                    <td className="px-4 py-2.5 font-semibold">{Math.round((employerVerified / totalTrainees) * 100)}%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-blue-600">Evidence-Supported</td>
                    <td className="px-4 py-2.5 text-gray-500">Offer letter, salary slip, or bank statement uploaded</td>
                    <td className="px-4 py-2.5 font-semibold">{evidenceSupported}</td>
                    <td className="px-4 py-2.5 font-semibold">{Math.round((evidenceSupported / totalTrainees) * 100)}%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-amber-600">Self-Reported Only</td>
                    <td className="px-4 py-2.5 text-gray-500">Beneficiary claimed via WhatsApp/SMS without documents</td>
                    <td className="px-4 py-2.5 font-semibold">{selfReported}</td>
                    <td className="px-4 py-2.5 font-semibold">{Math.round((selfReported / totalTrainees) * 100)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* District Performance Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">District Level Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {districtData.slice(0, 3).map((d) => (
                <div key={d.district} className="rounded-lg border border-gray-200 p-3 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/40">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{d.district}</span>
                    <span className="text-xs font-semibold text-brand-600">{d.employmentOutcome}% Outcome</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Key Shortages: {d.shortages.slice(0, 2).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff / Seal */}
          <div className="border-t border-gray-200 pt-6 flex justify-between items-end text-xs text-gray-500 dark:border-gray-800">
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">SkillPulse Verification Protocol</p>
              <p>Certified under DPDP Act 2023 Digital Safeguards</p>
            </div>
            <div className="text-right">
              <div className="inline-block border-b border-gray-400 pb-1 mb-1 w-36 text-center font-serif text-gray-800 dark:text-gray-200 italic">
                National Mission Dir.
              </div>
              <p>Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
