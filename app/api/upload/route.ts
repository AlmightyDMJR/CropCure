// ─── POST /api/upload ─────────────────────────────────────────────────────────
// Receives a multipart/form-data request with an `image` field.
// Validates the file, uploads it to InsForge storage, and creates a pending
// diagnosis row in the database.
//
// Returns: { success: true, image_url: string, diagnosis_id: string }

import { NextRequest } from 'next/server'
import { saveDiagnosis, uploadImageToStorage } from '@/lib/insforge'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  try {
    // TODO 8 ── Parse the incoming FormData and get the `image` File
    // const formData = await request.formData()
    // const file = formData.get('image') as File | null
    //
    // If no file: return Response.json({ success: false, error: 'No image file provided' }, { status: 400 })

    // ✏️  Write your FormData parsing here

    // TODO 9 ── Validate file type and size
    // Check file.type against ALLOWED_TYPES → 400 if invalid
    // Check file.size against MAX_SIZE_BYTES → 400 if too large

    // ✏️  Write your validation here

    // TODO 10 ── Generate a unique filename and convert to Buffer
    // const ext = file.name.split('.').pop() || 'jpg'
    // const filename = `${crypto.randomUUID()}.${ext}`
    // const buffer = Buffer.from(await file.arrayBuffer())

    // ✏️  Write your buffer conversion here

    // TODO 11 ── Upload to InsForge storage
    // const imageUrl = await uploadImageToStorage(buffer, filename)

    // ✏️  Write your storage upload here

    // TODO 12 ── Insert a pending row in the `diagnoses` table
    // const diagnosis = await saveDiagnosis({
    //   image_url: imageUrl,
    //   status: 'pending',
    //   visual_markers: [],
    //   top_possibilities: [],
    //   treatment_first_line: [],
    //   treatment_severe: [],
    //   diagnostic_notes: '',
    // })

    // ✏️  Write your database insert here

    // TODO 13 ── Return the success response
    // return Response.json({ success: true, image_url: imageUrl, diagnosis_id: diagnosis.id })

    return Response.json({ success: false, error: 'Route not implemented yet' }, { status: 501 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[upload route]', message)
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
