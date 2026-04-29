// ─── POST /api/diagnose ───────────────────────────────────────────────────────
// Receives { image_url, diagnosis_id } as JSON.
// Fetches the image, converts to base64, calls the Claude vision analysis,
// and updates the diagnosis row to status='complete' (or 'error' on failure).
//
// Has a 25-second hard timeout to avoid serverless function timeouts.

import { NextRequest } from 'next/server'
import { analyzePlantImage } from '@/lib/gemini'
import { updateDiagnosis } from '@/lib/insforge'

// Map of file extensions → MIME types for the Anthropic API
const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

function getMimeFromUrl(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase() ?? 'jpg'
  return MIME_MAP[ext] ?? 'image/jpeg'
}

export async function POST(request: NextRequest) {
  let diagnosis_id: string | undefined

  try {
    // TODO 14 ── Parse the JSON body
    // const body = await request.json()
    // const { image_url, diagnosis_id: id } = body as { image_url?: string; diagnosis_id?: string }
    // If either is missing → return 400
    // Set diagnosis_id = id so the catch block can mark it as 'error'

    // ✏️  Write your JSON parsing and validation here

    // TODO 15 ── Set up a 25-second timeout race
    // const timeoutPromise = new Promise<never>((_, reject) =>
    //   setTimeout(() => reject(new Error('TIMEOUT')), 25000)
    // )

    // ✏️  Write your timeout promise here

    // TODO 16 ── Build the analysis promise
    // This async function should:
    //   1. fetch(image_url) and check response.ok
    //   2. Convert arrayBuffer → base64 string using Buffer.from(...).toString('base64')
    //   3. Get the mimeType with getMimeFromUrl(image_url)
    //   4. Return analyzePlantImage(base64, mimeType)
    //
    // const analysisPromise = async () => { ... }

    // ✏️  Write your analysis promise here

    // TODO 17 ── Race the analysis against the timeout
    // const analysisResult = await Promise.race([analysisPromise(), timeoutPromise])

    // ✏️  Write your Promise.race here

    // TODO 18 ── Update the diagnosis row to 'complete'
    // const updated = await updateDiagnosis(id, { ...analysisResult, status: 'complete' })
    // return Response.json(updated)

    // ✏️  Write your database update and return here

    return Response.json({ error: 'Route not implemented yet' }, { status: 501 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[diagnose route]', message)

    // Mark the diagnosis row as 'error' so the UI can show the failure state
    if (diagnosis_id) {
      try {
        await updateDiagnosis(diagnosis_id, { status: 'error' })
      } catch (updateErr) {
        console.error('[diagnose route] failed to mark error status', updateErr)
      }
    }

    if (message === 'TIMEOUT') {
      return Response.json({ error: 'Analysis timed out. Please try again.' }, { status: 504 })
    }

    return Response.json({ error: message }, { status: 500 })
  }
}
