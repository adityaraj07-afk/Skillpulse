# SkillPulse — From Training to Verified Outcomes

**Longitudinal Skilling Outcomes & Impact Measurement System**  
*Smart India Hackathon (SIH 2026)*

---

## 🎯 Executive Overview

India’s vocational skilling ecosystem (PMKVY, DDU-GKY, State Skill Missions) traditionally stops monitoring beneficiaries the moment certification is completed. As a result, policymakers, training providers, and employers lack ground truth on:
- Actual post-training employment vs. underemployment.
- Longitudinal retention (30, 90, 180, and 365-day benchmarks).
- Real wage progression and quality of livelihood.
- Emerging skill gaps between curriculum and local industry demand.

**SkillPulse** bridges this critical gap through a consent-driven, privacy-preserving, longitudinal outcome tracking platform that converts self-reported employment claims into **empirically verified impact**.

---

## 🏛️ System Architecture

SkillPulse implements a multi-tier, modular architecture designed for high scalability and government system compatibility:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           SkillPulse Ecosystem                            │
├─────────────────────────────────────┬─────────────────────────────────────┤
│            Admin & SSDM Portal      │          Trainee Portal             │
│   - District Intelligence           │   - Digital Skill Passport          │
│   - Early Warning & Interventions   │   - Consent Preferences (DPDP Act)  │
│   - Multi-Level Outcome Review      │   - Longitudinal Follow-Up Surveys  │
│   - Provider Performance Benchmarks │   - Career Progression Tracking     │
└──────────────────┬──────────────────┴──────────────────┬──────────────────┘
                   │                                     │
                   ▼                                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    Persistence & Data Service Layer                       │
│    (Persistent LocalStorage Store / Supabase PostgreSQL Live Client)     │
└──────────────────┬────────────────────────────────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                   Government Integration Gateway                          │
│   ├── EPFO / UAN Check        (Formal employment & PF contribution)       │
│   ├── GSTN / ITR Check        (Self-employed & informal micro-enterprises) │
│   ├── e-Shram Sync            (Unorganized worker registry)               │
│   └── SIDH (Skill India Hub)  (Candidate certification authentication)    │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 5-Tier Verification Ladder
Instead of binary "placed / not placed" claims, SkillPulse grades outcomes on an evidence ladder:
1. **Self-Reported**: Trainee updates status via survey or portal.
2. **Evidence-Supported**: Trainee/center uploads offer letter, pay slip, or bank statement.
3. **Employer-Verified**: Direct corporate or HR verification via portal or EPFO contribution.
4. **Under Review**: Document flagged for manual assessment.
5. **Disputed**: Evidence conflict detected (triggers audit).

### 2. Multi-Channel Longitudinal Follow-Ups
- Automated cadences at **30, 90, 180, and 365 days**.
- Multi-channel delivery support: **WhatsApp, SMS, Phone Call, and Field-Assisted Follow-Up**.
- **"Missing follow-up ≠ Unemployed" principle**: Non-respondents are strictly classified as *Unknown* with follow-up coverage indicators to avoid distorting employment rates.

### 3. AI-Powered Skill Gap Analysis & Matching
- Compares trainee competencies against local district industry demand.
- Radar charts highlighting surplus vs. shortage competencies.
- Automated bridging module recommendations to boost employability.

### 4. Early Warning & Closed-Loop Interventions
- Machine-learning heuristics detect dropout and retention risks early.
- Direct conversion of alerts into assigned intervention action plans (mentorship, replacement, upskilling).

### 5. Verifiable Digital Skill Passport
- Dynamic, portable skill credential with verifiable QR code.
- Displays verified employment history, competencies, and longitudinal retention badge.

### 6. DPDP Act (2023) Compliance
- Granular consent management for each data tier (Profile, Training, Employment, Analytics).
- Trainee right to withdraw consent at any time.
- Immutable audit log of all administrative and external data access.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS (v3.4) with Dark/Light mode & custom glassmorphic tokens
- **Data Visualizations**: Recharts (Radar, Bar, Line charts)
- **Icons**: Lucide React
- **Data Layer**: Persistent client-side data service with Supabase PostgreSQL client integration
- **Target Backend Microservices**: NestJS / Python FastAPI (Analytics & ML engine)

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 👥 User Roles

- **Admin / Mission Director**: Access through the main navigation to monitor district analytics, conduct multi-tier evidence reviews, query the Government Integration Gateway, and export official Impact Reports.
- **Trainee**: Access via **Trainee Portal Login** at the bottom of the sidebar or direct route to review consents, update employment records, complete follow-up forms, and share their Skill Passport.
