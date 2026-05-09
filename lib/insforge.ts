// ─── InsForge client + database helpers ──────────────────────────────────────
// This file sets up the InsForge SDK client and exposes typed CRUD helpers
// used by both API routes and server-side page fetches.

import { createClient } from '@insforge/sdk'
import type { DiagnosisResult } from './types'

// TODO 1 ── Create the InsForge client
// Use createClient() from @insforge/sdk, passing in your env vars:
//   baseUrl  → process.env.NEXT_PUBLIC_INSFORGE_BASE_URL
//   anonKey  → process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
//
// const insforge = createClient({ ... })
//
// export default insforge

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: typeof window === 'undefined' 
    ? (process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY) 
    : process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
})

export default insforge

// ─────────────────────────────────────────────────────────────────────────────

// TODO 2 ── saveDiagnosis
// Insert a new row into the `diagnoses` table and return the created record.
// Steps:
//   1. Call insforge.database.from('diagnoses').insert(data).select().single()
//   2. If `error` is truthy, throw new Error(`Failed to save diagnosis: ${error.message}`)
//   3. Return result cast as DiagnosisResult

export async function saveDiagnosis(data: Partial<DiagnosisResult>): Promise<DiagnosisResult> {
  

  const {data: result, error} = await insforge.database.from('diagnoses').insert(data).select().single();
  if(error){
    throw new Error(`Failed to save diagnosis: ${error.message}`);
  }
  return result as DiagnosisResult;
}

// ─────────────────────────────────────────────────────────────────────────────

// TODO 3 ── updateDiagnosis
// Update an existing row by `id` and return the updated record.
// Steps:
//   1. Call insforge.database.from('diagnoses').update(data).eq('id', id).select().single()
//   2. Throw on error, return cast result

export async function updateDiagnosis(id: string, data: Partial<DiagnosisResult>): Promise<DiagnosisResult> {
 

  const {data: result, error} = await insforge.database.from('diagnoses').update(data).eq('id', id).select().single();
  if(error){
    throw new Error(`Failed to update diagnosis: ${error.message}`);
  }
  return result as DiagnosisResult;
}

// ─────────────────────────────────────────────────────────────────────────────

// TODO 4 ── getDiagnosis
// Fetch a single row by primary key.
// Steps:
//   1. Call insforge.database.from('diagnoses').select().eq('id', id).single()
//   2. Throw if error or no result

export async function getDiagnosis(id: string): Promise<DiagnosisResult> {
  
  const {data: result, error} = await insforge.database.from('diagnoses').select().eq('id', id).single();
  if(error){
    throw new Error(`Failed to get diagnosis: ${error?.message}`);
  }
  if(!result){
    throw new Error(`Diagnosis not found`);
  }
  return result as DiagnosisResult;
}

// ─────────────────────────────────────────────────────────────────────────────

// TODO 5 ── getDiagnosisHistory
// Fetch the last `limit` rows ordered newest-first.
// Steps:
//   1. Call insforge.database.from('diagnoses').select()
//      .order('created_at', { ascending: false }).limit(limit)
//   2. Throw on error, return (results ?? []) cast as DiagnosisResult[]

export async function getDiagnosisHistory(limit = 20): Promise<DiagnosisResult[]> {
  const { data: { user } } = await insforge.auth.getCurrentUser();
  let query = insforge.database.from('diagnoses').select()
    .order('created_at', {ascending: false}).limit(limit);

  if (user) {
    query = query.eq('user_id', user.id);
  } else {
    query = query.is('user_id', null);
  }

  const {data: results, error} = await query;
  if(error){
    throw new Error(`Failed to get diagnosis history: ${error.message}`);
  }
  return (results ?? []) as DiagnosisResult[];
}

// ─────────────────────────────────────────────────────────────────────────────

// TODO 6 ── uploadImageToStorage
// Upload a plant photo to the `plant-images` bucket and return the public URL.
// Steps:
//   1. Convert Buffer → Blob (use file.buffer.slice(...) to get a plain ArrayBuffer)
//   2. Call insforge.storage.from('plant-images').upload(filename, blob)
//   3. Throw on error or missing data.url, return data.url

export async function uploadImageToStorage(file: Buffer | Blob, filename: string): Promise<string> {
  // ✏️  Write your implementation here
  let blob : Blob;
  if(Buffer.isBuffer(file)){
    const copy = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    blob = new Blob([copy]);
  }else{
    blob = file;
  }

  const {data, error} = await insforge.storage.from('plant-images').upload(filename, blob);
  if(error){
    throw new Error(`Failed to upload image to storage: ${error.message}`);
  }

  if(!data?.url){
    throw new Error('Image uploaded but no URL returned');
  }

  return data.url;
}
