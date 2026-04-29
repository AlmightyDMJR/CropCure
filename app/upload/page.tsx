'use client'

// ─── Upload page ──────────────────────────────────────────────────────────────
// This is a client component because it uses useState and useRouter.
// Flow:
//   1. User picks a file in <UploadZone>
//   2. User clicks "Analyze Plant"
//   3. handleAnalyze: POST /api/upload → POST /api/diagnose → navigate to results

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoGuide from '@/components/PhotoGuide'
import UploadZone from '@/components/UploadZone'
import LoadingDiagnosis from '@/components/LoadingDiagnosis'

type StepStatus = 'waiting' | 'active' | 'complete'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<[StepStatus, StepStatus, StepStatus]>(['waiting', 'waiting', 'waiting'])
  const [error, setError] = useState<string | null>(null)

  const setStep = (idx: 0 | 1 | 2, status: StepStatus) => {
    setSteps((prev) => {
      const next = [...prev] as [StepStatus, StepStatus, StepStatus]
      next[idx] = status
      return next
    })
  }

  // TODO 19 ── handleAnalyze
  // This is the main orchestration function. When the user clicks "Analyze Plant":
  //
  // 1. Guard: return early if no file, reset error, set loading=true,
  //    set steps to ['active', 'waiting', 'waiting']
  //
  // 2. STEP 1 — Upload:
  //    - Build a FormData, append the file under the key 'image'
  //    - POST to /api/upload
  //    - Parse JSON as uploadData
  //    - If !uploadRes.ok or !uploadData.success → throw new Error(uploadData.error ?? 'Upload failed')
  //    - setStep(0, 'complete'); setStep(1, 'active')
  //
  // 3. STEP 2 — Diagnose:
  //    - POST to /api/diagnose with JSON { image_url: uploadData.image_url, diagnosis_id: uploadData.diagnosis_id }
  //    - If !diagnoseRes.ok → throw new Error(diagnoseData.error ?? 'Diagnosis failed')
  //    - setStep(1, 'complete'); setStep(2, 'active')
  //    - await a 500ms delay so users can read "Saving results"
  //
  // 4. Navigate to /results/[diagnosis_id]
  //    - router.push(`/results/${uploadData.diagnosis_id}`)
  //
  // 5. In catch: setError(message), setLoading(false), reset steps to all 'waiting'

  const handleAnalyze = async () => {
    // ✏️  Write your implementation here
    setError('handleAnalyze not implemented yet')
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Crop Diagnosis</p>
        <h1 className="font-display text-4xl font-semibold text-slate-900 leading-tight">
          Upload your plant photo
        </h1>
        <p className="mt-2 text-sm text-slate-500">Get a full AI diagnosis with treatment steps in under 30 seconds.</p>
      </div>

      {/* Photo tips */}
      <div className="mb-6">
        <PhotoGuide />
      </div>

      {/* Upload zone */}
      <UploadZone onFileSelect={setFile} />

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}. Please try again.
        </div>
      )}

      {/* CTA button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="mt-5 w-full py-4 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        style={{
          background: file && !loading ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#94a3b8',
          boxShadow: file && !loading ? '0 8px 24px -4px rgba(22, 163, 74, 0.35)' : 'none',
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Analyzing…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
            Analyze Plant
          </>
        )}
      </button>

      {/* Loading stepper */}
      {loading && (
        <div className="mt-5">
          <LoadingDiagnosis steps={steps} />
        </div>
      )}
    </div>
  )
}
