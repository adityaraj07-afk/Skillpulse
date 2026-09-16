# 🚀 SkillPulse — Complete Supabase Database Setup Guide
**Smart India Hackathon 2026: Longitudinal Skilling Outcomes & Impact Measurement System**

This guide walks you through setting up a complete PostgreSQL backend on **Supabase** with all tables, enums, relationships, Row Level Security (RLS) policies, and seed data.

---

## 📋 Schema Overview

The database schema covers all 12 functional areas of the SkillPulse system:

| Table Name | Purpose / Functionality | Key Columns |
| :--- | :--- | :--- |
| `providers` | Training Providers (PIAs / Centers) | `id`, `name`, `district`, `placement_rate`, `retention_rate`, `avg_wage` |
| `trainees` | Unified Trainee Registry | `id`, `unified_id`, `name`, `course_name`, `employment_status`, `evidence`, `salary` |
| `follow_ups` | 30 / 90 / 180 / 365-Day Follow-ups | `period`, `days`, `employed`, `status`, `method`, `form_response`, `comm_log` |
| `trainee_timeline_events` | Longitudinal Career Progression Events | `stage`, `title`, `description`, `event_date`, `evidence` |
| `consent_records` | DPDP Act (2023) Granular Consents | `category`, `status`, `version`, `consent_date` |
| `evidence_documents` | Verification Proof Files (Offer Letters, Pay Slips) | `file_name`, `file_type`, `file_url`, `verification_status`, `verifier_notes` |
| `integration_gateway_logs` | External System Queries (EPFO, GSTN, e-Shram, SIDH) | `gateway_type`, `query_identifier`, `response_payload`, `verification_status` |
| `early_warnings` | AI Risk Flags (Dropout, Mismatch, Low Retention) | `warning_type`, `severity`, `risk_level`, `confidence`, `recommendation` |
| `interventions` | Closed-Loop Administrative Action Plans | `problem`, `action`, `owner`, `target_metric`, `baseline`, `target`, `status` |
| `district_intelligence` | District-Level Demand / Shortage Intelligence | `district`, `high_demand_skills`, `shortages`, `employment_outcome` |
| `audit_logs` | Immutable Data Access Audit Trail | `actor`, `action`, `resource`, `status`, `consent_status` |

---

## 🛠️ Step-by-Step Setup Instructions

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in (using GitHub or Email).
2. Click on **New Project**.
3. Fill in the project details:
   - **Name:** `SkillPulse`
   - **Database Password:** Enter a strong password (save this securely).
   - **Region:** Select **South Asia (Mumbai)** for lowest latency in India.
   - **Pricing Plan:** Free tier is completely sufficient.
4. Click **Create new project** and wait ~1–2 minutes for the database to provision.

---

### Step 2: Run the SQL Schema in Supabase
1. In your Supabase project dashboard, navigate to the **SQL Editor** tab (icon `>_` on the left sidebar).
2. Click on **+ New Query**.
3. Open the file `supabase/schema.sql` located in your project root, or copy the SQL code below:

```sql
-- Paste the content of supabase/schema.sql here
```
*(All table creation commands, custom ENUM types, RLS rules, and initial seed data are included in `supabase/schema.sql`)*.

4. Click the green **Run** button in the bottom right corner of the SQL Editor.
5. You should see `Success. No rows returned`.

---

### Step 3: Create the Evidence Documents Storage Bucket
For trainees to upload offer letters, salary slips, or registration proofs:
1. Click on **Storage** in the left sidebar menu.
2. Click **New Bucket**.
3. Set **Bucket name:** `evidence-documents`.
4. Toggle **Public bucket** to `ON` (so verified documents can be previewed by administrators).
5. Click **Save bucket**.

---

### Step 4: Get Your Supabase Credentials
1. Click on **Project Settings** (gear icon ⚙️ at the bottom of the left sidebar).
2. Navigate to **Data API** (or **API**).
3. Find the following two values:
   - **Project URL:** `https://your-project-id.supabase.co`
   - **anon / public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Step 5: Connect Your SkillPulse Frontend
1. In your project root (`c:\Users\ASUS\skillpulse\`), duplicate `.env.example` and name it `.env`:
```bash
cp .env.example .env
```
2. Paste your Supabase credentials into `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
3. Restart your development server:
```bash
npm run dev
```

---

## ⚡ How to Use the Supabase Client in Code

The repository comes pre-configured with a typed client in `src/lib/supabaseClient.ts`:

```typescript
import { supabase } from '@/lib/supabaseClient';

// 1. Fetch all trainees
const { data: trainees, error } = await supabase
  .from('trainees')
  .select('*')
  .order('name');

// 2. Update trainee outcome
const { data, error } = await supabase
  .from('trainees')
  .update({
    employment_status: 'Placed',
    job_role: 'Data Analyst',
    evidence: 'Employer-Verified'
  })
  .eq('id', 'T001');

// 3. Log a Government Verification Gateway query
const { error: logError } = await supabase
  .from('integration_gateway_logs')
  .insert({
    trainee_id: 'T001',
    gateway_type: 'EPFO',
    query_identifier: '101489201948',
    response_payload: { memberId: 'MH/BAN/001', active: true },
    verification_status: 'VERIFIED_ACTIVE'
  });
```

---

## 🔒 Row Level Security (RLS) & DPDP Act Compliance

The schema enforces DPDP Act (2023) standards:
* **Trainees** can only modify their own profile data, consent preferences, and follow-up surveys.
* **Audit Logs** (`audit_logs`) are append-only to preserve a tamper-proof record of every access and consent update.
* **Data Minimization:** Sensitive identifiers like Aadhaar are deliberately excluded from data capture tables.
