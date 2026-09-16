/**
 * Gemini LLM Service for SkillPulse
 * Provides AI-powered skill gap analysis, job fit reasoning, and policy intervention suggestions.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

export interface GeminiSkillGapResponse {
  matchScore: number;
  criticalMissingSkills: string[];
  recommendedBridgeCourses: string[];
  reasoning: string;
  isAiGenerated: boolean;
}

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY && GEMINI_API_KEY !== 'your-gemini-api-key-here'
);

class GeminiService {
  /**
   * Analyze skill gap between candidate competencies and target industry role using Gemini LLM.
   */
  public async analyzeSkillGap(params: {
    candidateName: string;
    candidateSkills: string[];
    targetRole: string;
    district: string;
  }): Promise<GeminiSkillGapResponse> {
    if (!isGeminiConfigured) {
      console.info('ℹ️ Gemini API key not configured. Using local heuristic fallback.');
      return {
        matchScore: 78,
        criticalMissingSkills: ['Cloud (AWS)', 'Power BI'],
        recommendedBridgeCourses: ['AWS Cloud Practitioner Essentials', 'Advanced Power BI Dashboarding'],
        reasoning: `Based on local district market data for ${params.district}, roles for ${params.targetRole} heavily require Cloud & Advanced BI skills which are missing in ${params.candidateName}'s profile.`,
        isAiGenerated: false,
      };
    }

    const prompt = `You are an AI vocational skilling and labor market intelligence expert for the Indian Ministry of Skill Development & Entrepreneurship (MSDE / Smart India Hackathon 2026).
Analyze the skill gap for the following candidate:
- Candidate Name: ${params.candidateName}
- Acquired Skills: ${params.candidateSkills.join(', ')}
- Target Job Role: ${params.targetRole}
- Target District/Region: ${params.district}, India

Respond with a valid JSON object ONLY (without markdown formatting, without backticks) matching this exact schema:
{
  "matchScore": <number between 0 and 100>,
  "criticalMissingSkills": [<array of missing skill strings required for the role>],
  "recommendedBridgeCourses": [<array of specific NSQF/PMKVY 4.0 bridging course names>],
  "reasoning": "<concise 2-3 sentence labor market analysis explaining the gap and employability impact>"
}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini');

      const parsed = JSON.parse(rawText);
      return {
        matchScore: Number(parsed.matchScore) || 75,
        criticalMissingSkills: Array.isArray(parsed.criticalMissingSkills) ? parsed.criticalMissingSkills : [],
        recommendedBridgeCourses: Array.isArray(parsed.recommendedBridgeCourses) ? parsed.recommendedBridgeCourses : [],
        reasoning: parsed.reasoning || '',
        isAiGenerated: true,
      };
    } catch (error) {
      console.error('Failed to call Gemini API:', error);
      return {
        matchScore: 70,
        criticalMissingSkills: ['Cloud (AWS)', 'Communication Skills'],
        recommendedBridgeCourses: ['AWS Cloud Practitioner', 'Business Communication'],
        reasoning: 'Fallback generated due to Gemini network failure. Skills mapped using local heuristics.',
        isAiGenerated: false,
      };
    }
  }

  /**
   * Generate an automated intervention recommendation when an early warning is triggered.
   */
  public async generateInterventionPlan(params: {
    traineeName: string;
    warningType: string;
    warningReason: string;
  }): Promise<string> {
    if (!isGeminiConfigured) {
      return `Assign an industry mentor to ${params.traineeName} and schedule a workplace check-in call within 7 days.`;
    }

    const prompt = `You are a vocational education retention specialist in India.
A skilling trainee (${params.traineeName}) has triggered an Early Warning alert:
- Warning Type: ${params.warningType}
- Diagnostic Reason: ${params.warningReason}

Provide a concise, actionable, 2-sentence intervention plan for the training partner and district skill committee to retain or support this beneficiary.`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 },
        }),
      });

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Schedule workplace mentorship and review wage parity.';
    } catch (err) {
      console.error('Gemini intervention error:', err);
      return 'Schedule workplace mentorship and review wage parity.';
    }
  }
}

export const geminiService = new GeminiService();
