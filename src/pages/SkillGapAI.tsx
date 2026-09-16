import { useState, useMemo } from 'react';
import {
  BrainCircuit, AlertTriangle, TrendingUp, Lightbulb,
  CheckCircle2, XCircle, Sparkles, BookOpen, Info,
  Target, Zap, ChevronRight, Award, Clock, Briefcase,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { skillGapData, skillsVsDemand, trainees, targetJobProfiles, getTraineeSkillProficiency, trainingRecommendations, type TargetJobProfile } from '@/data/mockData';
import { JobMatchingModal } from '@/pages/admin/JobMatchingModal';
import { geminiService, isGeminiConfigured } from '@/services/geminiService';

const radarData = skillsVsDemand.map((s) => ({
  skill: s.skill,
  Training: s.training,
  Demand: s.demand,
}));

interface SkillGapAnalysisResult {
  jobProfile: TargetJobProfile;
  matchingSkills: { skill: string; proficiency: number; importance: string; demandLevel: number }[];
  missingSkills: { skill: string; importance: string; demandLevel: number; recommendation?: typeof trainingRecommendations[string] }[];
  improvementSkills: { skill: string; proficiency: number; targetLevel: number; importance: string }[];
  matchPercentage: number;
  recommendations: typeof trainingRecommendations[string][];
  aiReasoning?: string;
}

function analyzeSkillGap(traineeId: string, jobProfile: TargetJobProfile): SkillGapAnalysisResult {
  const trainee = trainees.find((t) => t.id === traineeId) || trainees[0];
  const proficiency = getTraineeSkillProficiency(trainee.skills);

  const matching: SkillGapAnalysisResult['matchingSkills'] = [];
  const missing: SkillGapAnalysisResult['missingSkills'] = [];
  const improvement: SkillGapAnalysisResult['improvementSkills'] = [];

  for (const req of jobProfile.requiredSkills) {
    const prof = proficiency[req.skill];
    if (prof === undefined) {
      missing.push({
        skill: req.skill,
        importance: req.importance,
        demandLevel: req.demandLevel,
        recommendation: trainingRecommendations[req.skill],
      });
    } else {
      matching.push({
        skill: req.skill,
        proficiency: prof,
        importance: req.importance,
        demandLevel: req.demandLevel,
      });
      if (prof < 70) {
        improvement.push({
          skill: req.skill,
          proficiency: prof,
          targetLevel: 80,
          importance: req.importance,
        });
      }
    }
  }

  const totalRequired = jobProfile.requiredSkills.length;
  const matchPercentage = Math.round((matching.length / totalRequired) * 100);
  const recommendations = missing
    .map((m) => m.recommendation)
    .filter((r): r is NonNullable<typeof r> => r !== undefined);

  return {
    jobProfile,
    matchingSkills: matching.sort((a, b) => b.demandLevel - a.demandLevel),
    missingSkills: missing.sort((a, b) => {
      const order = { Critical: 0, Important: 1, Preferred: 2 };
      return order[a.importance as keyof typeof order] - order[b.importance as keyof typeof order];
    }),
    improvementSkills: improvement.sort((a, b) => b.proficiency - a.proficiency),
    matchPercentage,
    recommendations,
  };
}

export function SkillGapAI() {
  const [selectedTraineeId, setSelectedTraineeId] = useState(trainees[0].id);
  const [selectedJobId, setSelectedJobId] = useState(targetJobProfiles[0].id);
  const [analysis, setAnalysis] = useState<SkillGapAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  const selectedTrainee = useMemo(
    () => trainees.find((t) => t.id === selectedTraineeId) || trainees[0],
    [selectedTraineeId]
  );
  const selectedJob = useMemo(
    () => targetJobProfiles.find((j) => j.id === selectedJobId) || targetJobProfiles[0],
    [selectedJobId]
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    // Initial heuristic analysis
    const result = analyzeSkillGap(selectedTraineeId, selectedJob);

    // If Gemini API is configured in .env, enhance with LLM labor market reasoning
    if (isGeminiConfigured) {
      try {
        const geminiRes = await geminiService.analyzeSkillGap({
          candidateName: selectedTrainee.name,
          candidateSkills: selectedTrainee.skills,
          targetRole: selectedJob.title,
          district: selectedTrainee.district,
        });
        if (geminiRes?.reasoning) {
          result.aiReasoning = geminiRes.reasoning;
        }
      } catch (err) {
        console.warn('Gemini analysis failed, using fallback:', err);
      }
    }

    // Small delay for smooth UI feedback
    setTimeout(() => {
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 600);
  };

  const radarAnalysisData = useMemo(() => {
    if (!analysis) return [];
    const prof = getTraineeSkillProficiency(selectedTrainee.skills);
    return analysis.jobProfile.requiredSkills.map((req) => ({
      skill: req.skill.length > 12 ? req.skill.slice(0, 10) + '…' : req.skill,
      'Your Level': prof[req.skill] || 0,
      'Required': req.demandLevel,
    }));
  }, [analysis, selectedTrainee]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skill Gap AI</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Comparing skills taught vs skills demanded by the job market</p>
      </div>

      {/* Provenance */}
      <div className="flex items-center gap-2">
        <Badge color={isGeminiConfigured ? 'emerald' : 'brand'}>
          {isGeminiConfigured ? '✨ Gemini LLM Engine Active' : 'AI Labor Market Engine'}
        </Badge>
        <span className="text-xs text-gray-500">NSQF Labor Market Competency Mapping</span>
      </div>

      {/* ========== NEW: Per-Trainee Skill Gap Analysis ========== */}
      <Card className="border-l-4 border-l-brand-400 p-5">
        <SectionTitle
          title="Trainee Skill Gap Analysis"
          subtitle="Compare a trainee's current skills against a target job's requirements"
          icon={<Target className="h-5 w-5" />}
        />

        {/* Selectors */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Select Trainee</label>
            <select
              value={selectedTraineeId}
              onChange={(e) => { setSelectedTraineeId(e.target.value); setAnalysis(null); }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {trainees.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — {t.courseName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Job Role</label>
            <select
              value={selectedJobId}
              onChange={(e) => { setSelectedJobId(e.target.value); setAnalysis(null); }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {targetJobProfiles.map((j) => (
                <option key={j.id} value={j.id}>{j.title} — {j.industry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Trainee skills summary */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTrainee.name}'s Current Skills</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTrainee.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <CheckCircle2 className="h-3 w-3" /> {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Target job info */}
        <div className="mt-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedJob.title}</p>
              <p className="text-xs text-gray-500">{selectedJob.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Avg Salary</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedJob.avgSalaryRange}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selectedJob.requiredSkills.map((req) => (
              <span key={req.skill} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                req.importance === 'Critical' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                : req.importance === 'Important' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'
              }`}>
                {req.skill} · {req.importance}
              </span>
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <BrainCircuit className="h-4 w-4 animate-pulse" /> Analyzing…
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Analyze Skill Gap
                </>
              )}
            </button>
            <button
              onClick={() => setShowJobs(true)}
              className="flex items-center gap-2 rounded-lg border border-brand-300 bg-brand-50 px-6 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300 dark:hover:bg-brand-900/40"
            >
              <Briefcase className="h-4 w-4" /> View Matching Jobs
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-6 space-y-5 animate-fade-in">
            {/* Match percentage header */}
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 p-5 dark:from-brand-900/20 dark:to-accent-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skill Match for {analysis.jobProfile.title}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{analysis.matchPercentage}%</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Match</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{analysis.matchingSkills.length}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Missing</span>
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{analysis.missingSkills.length}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={analysis.matchPercentage}
                  color={analysis.matchPercentage >= 75 ? 'emerald' : analysis.matchPercentage >= 50 ? 'amber' : 'rose'}
                />
              </div>
            </div>

            {/* AI Reasoning card */}
            {analysis.aiReasoning && (
              <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-purple-50/90 p-4 text-xs dark:border-indigo-800 dark:from-indigo-950/40 dark:to-purple-950/40">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300 mb-1.5 text-sm">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Gemini LLM Labor Market Diagnostic
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                  {analysis.aiReasoning}
                </p>
              </div>
            )}

            {/* Radar chart comparison */}
            {radarAnalysisData.length > 0 && (
              <Card className="p-5">
                <SectionTitle title="Skill Level vs Job Requirements" subtitle="Your proficiency compared to demanded levels" icon={<TrendingUp className="h-5 w-5" />} />
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarAnalysisData}>
                    <PolarGrid stroke="#e5e7eb" className="dark:opacity-20" />
                    <PolarAngleAxis dataKey="skill" stroke="#9ca3af" fontSize={10} />
                    <PolarRadiusAxis stroke="#9ca3af" fontSize={10} angle={90} />
                    <Radar name="Your Level" dataKey="Your Level" stroke="#3380fc" fill="#3380fc" fillOpacity={0.3} />
                    <Radar name="Required" dataKey="Required" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Matching skills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Matching Skills ({analysis.matchingSkills.length})</h3>
              </div>
              <div className="space-y-2">
                {analysis.matchingSkills.map((skill) => (
                  <div key={skill.skill} className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-900/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                        <Badge color={skill.importance === 'Critical' ? 'rose' : skill.importance === 'Important' ? 'amber' : 'gray'} size="sm">{skill.importance}</Badge>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{skill.proficiency}%</span>
                    </div>
                    <div className="mt-2"><ProgressBar value={skill.proficiency} color="emerald" /></div>
                  </div>
                ))}
                {analysis.matchingSkills.length === 0 && (
                  <p className="text-sm text-gray-400">No matching skills found. All required skills are missing.</p>
                )}
              </div>
            </div>

            {/* Missing skills */}
            {analysis.missingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Missing Skills ({analysis.missingSkills.length})</h3>
                </div>
                <div className="space-y-2">
                  {analysis.missingSkills.map((skill) => (
                    <div key={skill.skill} className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-800 dark:bg-rose-900/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-rose-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                          <Badge color={skill.importance === 'Critical' ? 'rose' : skill.importance === 'Important' ? 'amber' : 'gray'} size="sm">{skill.importance}</Badge>
                        </div>
                        <span className="text-xs text-gray-400">Demand: {skill.demandLevel}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills needing improvement */}
            {analysis.improvementSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Skills Needing Improvement ({analysis.improvementSkills.length})</h3>
                </div>
                <div className="space-y-2">
                  {analysis.improvementSkills.map((skill) => (
                    <div key={skill.skill} className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-900/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                        </div>
                        <span className="text-xs text-gray-400">{skill.proficiency}% → Target: {skill.targetLevel}%</span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={skill.proficiency} color="amber" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended training */}
            {analysis.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-brand-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recommended Training for Missing Skills</h3>
                </div>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec) => (
                    <div key={rec.skill} className="rounded-lg border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-800 dark:bg-brand-900/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-5 w-5 shrink-0 text-brand-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.courseName}</p>
                            <p className="text-xs text-gray-500">For: {rec.skill}</p>
                          </div>
                        </div>
                        <Badge color="brand" size="sm">{rec.format}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1"><Clock className="h-3 w-3" /> {rec.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Provider</p>
                          <p className="font-medium text-gray-900 dark:text-white">{rec.provider}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Cost</p>
                          <p className="font-medium text-emerald-600 dark:text-emerald-400">{rec.estimatedCost}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Skill</p>
                          <p className="font-medium text-gray-900 dark:text-white">{rec.skill}</p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-md bg-white/60 px-3 py-2 dark:bg-gray-900/40">
                        <p className="text-xs font-semibold text-brand-600 uppercase">Why this recommendation?</p>
                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI disclaimer */}
            <div className="rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  AI / DEMO RECOMMENDATION — These skill gap analysis results and training recommendations are generated from simulated data for demonstration purposes only. They are not guaranteed employment outcomes. Actual job requirements may vary by employer and location.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <JobMatchingModal
        open={showJobs}
        onClose={() => setShowJobs(false)}
        traineeId={selectedTraineeId}
      />

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <h3 className="text-sm font-bold uppercase text-gray-400">Cohort-Level Analysis (Existing)</h3>
      </div>

      {/* AI confidence banner */}
      <Card className="border-l-4 border-l-brand-400 p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <BrainCircuit className="h-6 w-6 shrink-0 text-brand-500" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Analysis</h3>
              <Badge color="brand">Confidence: {skillGapData.aiConfidence}%</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{skillGapData.aiExplanation}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Skill Alignment:</span>
              <div className="w-32"><ProgressBar value={skillGapData.alignmentPercentage} color={skillGapData.alignmentPercentage > 70 ? 'emerald' : 'amber'} /></div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{skillGapData.alignmentPercentage}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Insufficient evidence note */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Insufficient Evidence (Partial)</p>
            <p className="text-gray-500 dark:text-gray-400">{skillGapData.insufficientEvidenceNote}</p>
          </div>
        </div>
      </Card>

      {/* Gap comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Skills Taught vs Market Demand" icon={<TrendingUp className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsVsDemand} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="skill" stroke="#9ca3af" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="training" fill="#3380fc" radius={[4, 4, 0, 0]} name="Training %" />
              <Bar dataKey="demand" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Demand %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Skill Coverage Radar" icon={<BrainCircuit className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" className="dark:opacity-20" />
              <PolarAngleAxis dataKey="skill" stroke="#9ca3af" fontSize={10} />
              <PolarRadiusAxis stroke="#9ca3af" fontSize={10} angle={90} />
              <Radar name="Training" dataKey="Training" stroke="#3380fc" fill="#3380fc" fillOpacity={0.3} />
              <Radar name="Demand" dataKey="Demand" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Matching skills */}
      <Card className="p-5">
        <SectionTitle title="Matching Skills" subtitle="Skills where training meets market demand" icon={<CheckCircle2 className="h-5 w-5" />} />
        <div className="space-y-3">
          {skillGapData.matchingSkills.map((skill) => (
            <div key={skill.skill} className="rounded-lg border border-emerald-200 p-3 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                </div>
                <Badge color="emerald" size="sm">{skill.alignment}% aligned</Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Training Coverage</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={skill.trainingLevel} color="brand" />
                    <span className="text-sm font-medium">{skill.trainingLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Market Demand</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={skill.demandLevel} color="accent" />
                    <span className="text-sm font-medium">{skill.demandLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Missing skills */}
      <Card className="p-5">
        <SectionTitle title="Missing Skills (Critical Gaps)" subtitle="High demand but low training coverage" icon={<AlertTriangle className="h-5 w-5" />} />
        <div className="space-y-4">
          {skillGapData.missingSkills.map((gap) => (
            <div key={gap.skill} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{gap.skill}</span>
                </div>
                <Badge color={gap.severity === 'Critical' ? 'rose' : gap.severity === 'High' ? 'amber' : 'gray'}>
                  {gap.severity}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Training Coverage</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={gap.trainingLevel} color="rose" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{gap.trainingLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Market Demand</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={gap.demandLevel} color="brand" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{gap.demandLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emerging skills */}
      <Card className="p-5">
        <SectionTitle title="Emerging Skills" subtitle="Growing demand not yet in curricula" icon={<Sparkles className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {skillGapData.emergingSkills.map((skill) => (
            <div key={skill.skill} className="rounded-lg bg-gradient-to-br from-brand-50 to-accent-50 p-4 dark:from-brand-900/20 dark:to-accent-900/20">
              <p className="font-medium text-gray-900 dark:text-white">{skill.skill}</p>
              <p className="text-xs text-gray-500">{skill.trend}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Relevance:</span>
                <ProgressBar value={skill.relevance} color="accent" />
                <span className="text-xs font-medium">{skill.relevance}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations with explanations */}
      <Card className="p-5">
        <SectionTitle title="AI Recommended Upskilling" subtitle="Each recommendation includes an explanation" icon={<Lightbulb className="h-5 w-5" />} />
        <div className="space-y-4">
          {skillGapData.recommendationExplanations.map((rec, i) => (
            <div key={i} className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.recommendation}</p>
                  <div className="mt-2 rounded-md bg-white/60 px-3 py-2 dark:bg-gray-900/40">
                    <p className="text-xs font-semibold text-brand-600 uppercase">Why?</p>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{rec.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Curriculum suggestions */}
      <Card className="p-5">
        <SectionTitle title="Curriculum Suggestions" icon={<BookOpen className="h-5 w-5" />} />
        <div className="space-y-3">
          {skillGapData.curriculumSuggestions.map((sug, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-accent-50 px-3 py-3 dark:bg-accent-900/20">
              <BookOpen className="h-5 w-5 shrink-0 text-accent-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{sug}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Example */}
      <Card className="p-5 border-l-4 border-l-accent-400">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Example Analysis</h3>
        <div className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <p className="text-xs font-medium text-emerald-600 uppercase">Training</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Python, ML, SQL</p>
          </div>
          <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
            <p className="text-xs font-medium text-brand-600 uppercase">Market Demand</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Python, ML, SQL, Cloud, Power BI</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
            <p className="text-xs font-medium text-rose-600 uppercase">Gap</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Cloud + Power BI</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
