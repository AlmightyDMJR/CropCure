# CropCure Project

> AI-powered plant disease diagnosis built with **Next.js 16**, **Ollama Llava AI (Consensus)**, and **InsForge**.

This is the **workshop starter** for building PlantCheck from scratch. The full UI is already here — your job is to implement the backend logic step by step.

---

## What's already built for you

| Layer | Status |
|-------|--------|
| Home page (`app/page.tsx`) | ✅ Complete |
| Navbar, PhotoGuide, UploadZone | ✅ Complete |
| LoadingDiagnosis stepper | ✅ Complete |
| DiagnosisCard, ConfidenceBar, SeverityBadge | ✅ Complete |
| VisualMarkers, DifferentialList, TreatmentPanel | ✅ Complete |
| Results page + History page | ✅ Complete |
| TypeScript types (`lib/types.ts`) | ✅ Complete |
| Global CSS + Tailwind config | ✅ Complete |

---

## What you'll build (the TODOs)

Each TODO is numbered so you can follow along in order during the workshop.

### Part 1 — Database layer (`lib/insforge.ts`)

| TODO | Task |
|------|------|
| **TODO 1** | Create the InsForge client with `createClient()` |
| **TODO 2** | `saveDiagnosis` — insert a new row |
| **TODO 3** | `updateDiagnosis` — update a row by id |
| **TODO 4** | `getDiagnosis` — fetch a single row |
| **TODO 5** | `getDiagnosisHistory` — fetch last N rows |
| **TODO 6** | `uploadImageToStorage` — upload to `plant-images` bucket |

### Part 2 — AI integration (`lib/gemini.ts`)

| TODO | Task |
|------|------|
| **TODO 7** | `analyzePlantImage` — call Claude vision API and parse JSON |

### Part 3 — API routes

| TODO | Task |
|------|------|
| **TODO 8–13** | `/api/upload` — parse FormData, validate, upload, save pending row |
| **TODO 14–18** | `/api/diagnose` — fetch image, base64, run AI, update row |

### Part 4 — Upload page (`app/upload/page.tsx`)

| TODO | Task |
|------|------|
| **TODO 19** | `handleAnalyze` — orchestrate upload → diagnose → navigate |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
INSFORGE_BASE_URL=https://your-project.insforge.io
INSFORGE_ANON_KEY=your-anon-key
```

### 3. Create the InsForge database table

Run this SQL in your InsForge project dashboard (SQL editor):

```sql
create table diagnoses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  image_url text,
  primary_diagnosis text,
  confidence_score integer,
  severity text check (severity in ('mild', 'moderate', 'severe')),
  visual_markers text[] default '{}',
  top_possibilities jsonb default '[]',
  treatment_first_line text[] default '{}',
  treatment_severe text[] default '{}',
  diagnostic_notes text default '',
  status text default 'pending' check (status in ('pending', 'complete', 'error'))
);
```

### 4. Create the storage bucket

In the InsForge dashboard → Storage → New bucket → name it **`plant-images`** → set to public.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Workshop order

Work through the TODOs in this order for the smoothest experience:

1. **TODO 1** — wire up the InsForge client (everything depends on this)
2. **TODO 6** — implement storage upload (needed by the upload route)
3. **TODO 2** — implement `saveDiagnosis`
4. **TODO 8–13** — implement `/api/upload` and test it with a REST client
5. **TODO 7** — implement `analyzePlantImage` (the Claude call)
6. **TODO 3** — implement `updateDiagnosis`
7. **TODO 14–18** — implement `/api/diagnose`
8. **TODO 19** — implement `handleAnalyze` in the upload page and test end-to-end
9. **TODO 4 & 5** — implement `getDiagnosis` + `getDiagnosisHistory` so the results and history pages work

---

## Key files reference

```
starter/
├── app/
│   ├── page.tsx                    ← Landing page (complete)
│   ├── layout.tsx                  ← Root layout + Navbar (complete)
│   ├── globals.css                 ← Tailwind + CSS utilities (complete)
│   ├── upload/
│   │   └── page.tsx                ← TODO 19: handleAnalyze
│   ├── history/
│   │   └── page.tsx                ← Uses getDiagnosisHistory (complete)
│   ├── results/[id]/
│   │   ├── page.tsx                ← Uses getDiagnosis (complete)
│   │   ├── PendingResults.tsx      ← Polls every 3s (complete)
│   │   └── ShareButton.tsx         ← Clipboard copy (complete)
│   └── api/
│       ├── upload/route.ts         ← TODO 8–13
│       └── diagnose/route.ts       ← TODO 14–18
├── components/                     ← All UI components (complete)
└── lib/
    ├── types.ts                    ← TypeScript interfaces (complete)
    ├── insforge.ts                 ← TODO 1–6
    └── gemini.ts                   ← TODO 7 (uses Anthropic, not Google)
```

---

