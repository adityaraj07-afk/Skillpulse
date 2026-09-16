-- ==============================================================================
-- SkillPulse Database Schema (PostgreSQL / Supabase)
-- Smart India Hackathon 2026: Longitudinal Skilling Outcomes & Impact Measurement
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS
-- ==============================================================================

CREATE TYPE evidence_state_enum AS ENUM (
  'Self-Reported',
  'Evidence-Supported',
  'Employer-Verified',
  'Under Review',
  'Disputed',
  'Closed'
);

CREATE TYPE training_status_enum AS ENUM (
  'Enrolled',
  'In Training',
  'Completed',
  'Dropped Out',
  'Certified'
);

CREATE TYPE employment_status_enum AS ENUM (
  'Placed',
  'Self-Employed',
  'Apprenticeship',
  'Unplaced',
  'Unknown'
);

CREATE TYPE job_relevance_enum AS ENUM (
  'High',
  'Moderate',
  'Low'
);

CREATE TYPE follow_up_method_enum AS ENUM (
  'WhatsApp',
  'SMS',
  'Email',
  'Phone Call',
  'Assisted Follow-up'
);

CREATE TYPE follow_up_status_enum AS ENUM (
  'Pending',
  'Scheduled',
  'Sent',
  'Responded',
  'No Response',
  'Assisted',
  'Completed'
);

CREATE TYPE consent_category_enum AS ENUM (
  'Profile Data',
  'Training Data',
  'Employment Outcome Data',
  'Verification/Evidence',
  'Analytics & Programme Improvement'
);

CREATE TYPE consent_state_enum AS ENUM (
  'Given',
  'Pending',
  'Withdrawn'
);

CREATE TYPE intervention_status_enum AS ENUM (
  'Proposed',
  'In Progress',
  'Completed'
);

CREATE TYPE warning_severity_enum AS ENUM (
  'High',
  'Medium',
  'Low'
);

-- ==============================================================================
-- 2. TRAINING PROVIDERS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'India',
  trainees_total INT NOT NULL DEFAULT 0,
  placement_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  relevant_employment_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  retention_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  evidence_coverage NUMERIC(5,2) NOT NULL DEFAULT 0,
  skill_relevance NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_wage INT NOT NULL DEFAULT 0,
  cohort_size INT NOT NULL DEFAULT 0,
  sample_size INT NOT NULL DEFAULT 0,
  coverage_score INT NOT NULL DEFAULT 0,
  evidence_quality NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. TRAINEES TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS trainees (
  id TEXT PRIMARY KEY,
  unified_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Connects to Supabase Auth
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  education TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  course_name TEXT NOT NULL,
  provider_id TEXT REFERENCES providers(id) ON DELETE SET NULL,
  provider_name TEXT NOT NULL,
  cohort TEXT NOT NULL,
  certification TEXT NOT NULL DEFAULT 'NSDC Certificate',
  certified BOOLEAN NOT NULL DEFAULT FALSE,
  training_status training_status_enum NOT NULL DEFAULT 'Enrolled',
  employment_status employment_status_enum NOT NULL DEFAULT 'Unplaced',
  job_role TEXT,
  industry TEXT,
  job_location TEXT,
  joining_date DATE,
  salary INT,
  salary_range TEXT,
  job_relevance job_relevance_enum,
  retention_months INT NOT NULL DEFAULT 0,
  is_retained BOOLEAN NOT NULL DEFAULT FALSE,
  is_apprenticeship BOOLEAN NOT NULL DEFAULT FALSE,
  is_self_employed BOOLEAN NOT NULL DEFAULT FALSE,
  evidence evidence_state_enum NOT NULL DEFAULT 'Self-Reported',
  skill_readiness_score INT NOT NULL DEFAULT 0,
  skill_readiness_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  warnings TEXT[] NOT NULL DEFAULT '{}',
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  institution TEXT,
  training_centre TEXT,
  start_date DATE,
  completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. LONGITUDINAL FOLLOW-UPS TABLE (30, 90, 180, 365 Days)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_id TEXT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- '30 Days', '90 Days', '180 Days', '365 Days'
  days INT NOT NULL,
  employed BOOLEAN NOT NULL DEFAULT FALSE,
  salary INT,
  relevant BOOLEAN NOT NULL DEFAULT FALSE,
  retained BOOLEAN NOT NULL DEFAULT FALSE,
  livelihood_status TEXT NOT NULL DEFAULT 'Seeking Work',
  evidence evidence_state_enum NOT NULL DEFAULT 'Self-Reported',
  responded BOOLEAN NOT NULL DEFAULT FALSE,
  method follow_up_method_enum NOT NULL DEFAULT 'WhatsApp',
  status follow_up_status_enum NOT NULL DEFAULT 'Pending',
  due_date DATE,
  last_contacted TIMESTAMPTZ,
  next_follow_up DATE,
  is_overdue BOOLEAN NOT NULL DEFAULT FALSE,
  form_response JSONB, -- stores { currentStatus, occupation, employer, location, wageRange, usingSkills, needsTraining, comments }
  communication_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. TRAINEE TIMELINE EVENTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS trainee_timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_id TEXT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  stage TEXT NOT NULL, -- 'Training', 'Certification', 'Job Search', 'Outcome', 'Follow-up', 'Retention', 'Progression'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  evidence evidence_state_enum NOT NULL DEFAULT 'Self-Reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. DPDP ACT CONSENT RECORDS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_id TEXT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  category consent_category_enum NOT NULL,
  status consent_state_enum NOT NULL DEFAULT 'Pending',
  version TEXT NOT NULL DEFAULT 'v2.0',
  consent_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. EVIDENCE & VERIFICATION DOCUMENTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS evidence_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_id TEXT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT, -- Supabase Storage URL
  storage_path TEXT,
  file_size INT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status TEXT NOT NULL DEFAULT 'Evidence Submitted', -- 'Self-Reported', 'Evidence Submitted', 'Under Review', 'Verified', 'Needs Update'
  verifier_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

-- ==============================================================================
-- 8. GOVERNMENT INTEGRATION GATEWAY QUERIES (EPFO, GSTN, e-Shram, SIDH)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS integration_gateway_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainee_id TEXT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  gateway_type TEXT NOT NULL, -- 'EPFO', 'GSTN', 'e-Shram', 'SIDH'
  query_identifier TEXT NOT NULL, -- UAN, GSTIN, e-Shram UAN, etc.
  response_payload JSONB NOT NULL,
  verification_status TEXT NOT NULL, -- 'VERIFIED_ACTIVE', 'INACTIVE', 'FAILED'
  queried_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  queried_by TEXT NOT NULL DEFAULT 'System Admin'
);

-- ==============================================================================
-- 9. EARLY WARNINGS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS early_warnings (
  id TEXT PRIMARY KEY,
  trainee_id TEXT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  trainee_name TEXT NOT NULL,
  warning_type TEXT NOT NULL,
  severity warning_severity_enum NOT NULL DEFAULT 'Medium',
  risk_level TEXT NOT NULL DEFAULT 'Needs Attention',
  reason TEXT NOT NULL,
  confidence INT NOT NULL DEFAULT 70,
  recommendation TEXT NOT NULL,
  insufficient_evidence BOOLEAN NOT NULL DEFAULT FALSE,
  intervention_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. CLOSED-LOOP INTERVENTIONS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS interventions (
  id TEXT PRIMARY KEY,
  problem TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  action TEXT NOT NULL,
  owner TEXT NOT NULL,
  target_metric TEXT NOT NULL,
  baseline INT NOT NULL DEFAULT 0,
  target INT NOT NULL DEFAULT 0,
  status intervention_status_enum NOT NULL DEFAULT 'Proposed',
  intervention_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cohort_applied TEXT NOT NULL,
  linked_cohort TEXT,
  intervention_type TEXT,
  assigned_person TEXT,
  result TEXT,
  linked_warning_id TEXT,
  trainee_id TEXT REFERENCES trainees(id) ON DELETE SET NULL,
  trainee_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. DISTRICT INTELLIGENCE TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS district_intelligence (
  district TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  high_demand_skills TEXT[] NOT NULL DEFAULT '{}',
  training_available TEXT[] NOT NULL DEFAULT '{}',
  shortages TEXT[] NOT NULL DEFAULT '{}',
  employment_outcome INT NOT NULL DEFAULT 0,
  trainees_trained INT NOT NULL DEFAULT 0,
  trainees_placed INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. IMMUTABLE AUDIT LOGS (DPDP Act Compliance)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Allowed', -- 'Allowed' | 'Denied'
  consent_status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 13. INDEXES FOR HIGH-PERFORMANCE ANALYTICS
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_trainees_provider ON trainees(provider_id);
CREATE INDEX IF NOT EXISTS idx_trainees_district ON trainees(district);
CREATE INDEX IF NOT EXISTS idx_trainees_status ON trainees(employment_status);
CREATE INDEX IF NOT EXISTS idx_trainees_evidence ON trainees(evidence);
CREATE INDEX IF NOT EXISTS idx_follow_ups_trainee ON follow_ups(trainee_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_consent_trainee ON consent_records(trainee_id);
CREATE INDEX IF NOT EXISTS idx_warnings_trainee ON early_warnings(trainee_id);

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous/Public Read Policy (for Hackathon Evaluation & Local Demo)
-- When using anon key, allow authenticated and demo users to query data
CREATE POLICY "Allow public read access for demonstration" 
  ON trainees FOR SELECT USING (true);

CREATE POLICY "Allow public insert and update on trainees" 
  ON trainees FOR ALL USING (true);

CREATE POLICY "Allow public access for follow_ups" 
  ON follow_ups FOR ALL USING (true);

CREATE POLICY "Allow public access for consent_records" 
  ON consent_records FOR ALL USING (true);

CREATE POLICY "Allow public access for evidence_documents" 
  ON evidence_documents FOR ALL USING (true);

CREATE POLICY "Allow public access for audit_logs" 
  ON audit_logs FOR ALL USING (true);

-- ==============================================================================
-- 15. SEED DATA (CORE DISTRICT INTELLIGENCE)
-- ==============================================================================

INSERT INTO district_intelligence (district, state, high_demand_skills, training_available, shortages, employment_outcome, trainees_trained, trainees_placed)
VALUES 
  ('Pune', 'Maharashtra', ARRAY['Python', 'Cloud (AWS)', 'Power BI', 'React', 'DevOps'], ARRAY['Python', 'React', 'Digital Marketing', 'SQL'], ARRAY['Cloud (AWS)', 'Power BI', 'DevOps'], 82, 8, 7),
  ('Hyderabad', 'Telangana', ARRAY['Python', 'Machine Learning', 'Cloud (AWS)', 'Cybersecurity', 'SQL'], ARRAY['Python', 'SQL', 'Digital Marketing'], ARRAY['Cloud (AWS)', 'Machine Learning', 'Cybersecurity'], 75, 8, 6),
  ('Bengaluru', 'Karnataka', ARRAY['React', 'Node.js', 'Cloud (AWS)', 'Python', 'Tableau'], ARRAY['React', 'Node.js', 'Python', 'SQL', 'Machine Learning'], ARRAY['Cloud (AWS)', 'Tableau'], 86, 7, 6),
  ('Chennai', 'Tamil Nadu', ARRAY['Python', 'Cloud (AWS)', 'Data Visualization', 'Excel', 'Power BI'], ARRAY['Python', 'Excel', 'Digital Marketing'], ARRAY['Cloud (AWS)', 'Power BI', 'Data Visualization'], 71, 7, 5),
  ('Indore', 'Madhya Pradesh', ARRAY['Digital Marketing', 'SEO', 'Excel', 'Power BI', 'Python'], ARRAY['Digital Marketing', 'SEO', 'Excel'], ARRAY['Power BI', 'Python'], 68, 6, 4),
  ('Jaipur', 'Rajasthan', ARRAY['Python', 'SQL', 'Cloud (AWS)', 'React', 'Power BI'], ARRAY['Python', 'SQL'], ARRAY['Cloud (AWS)', 'React', 'Power BI'], 64, 5, 3)
ON CONFLICT (district) DO NOTHING;

-- Seed Sample Training Providers
INSERT INTO providers (id, name, district, state, trainees_total, placement_rate, relevant_employment_rate, retention_rate, evidence_coverage, skill_relevance, avg_wage, cohort_size, sample_size, coverage_score, evidence_quality)
VALUES
  ('P01', 'TechSkill Academy', 'Pune', 'Maharashtra', 8, 87.5, 75.0, 71.4, 87.5, 82.0, 24500, 30, 8, 88, 85),
  ('P02', 'Digital India Training Centre', 'Hyderabad', 'Telangana', 8, 75.0, 62.5, 66.7, 75.0, 74.0, 22000, 30, 8, 75, 78),
  ('P03', 'SkillBridge Institute', 'Bengaluru', 'Karnataka', 7, 85.7, 71.4, 83.3, 85.7, 86.0, 28000, 30, 7, 86, 88),
  ('P04', 'FutureTech Learning Hub', 'Chennai', 'Tamil Nadu', 7, 71.4, 57.1, 60.0, 71.4, 70.0, 20500, 30, 7, 71, 72)
ON CONFLICT (id) DO NOTHING;
