// ─── AI vision analysis (Claude / Anthropic) ─────────────────────────────────
// Despite the filename, this module uses the Anthropic SDK (claude-opus-4-5).
// It sends a base64-encoded plant photo to Claude and parses the structured
// JSON diagnosis that comes back.

import Anthropic from '@anthropic-ai/sdk'
import type { DiagnosisResult } from './types'

// The Anthropic client reads ANTHROPIC_API_KEY from the environment automatically.
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ─── System prompt ───────────────────────────────────────────────────────────
// This is the detailed prompt that instructs Claude how to think about a
// plant photo and what JSON shape to return. Keep it as-is; you will focus
// on the API call below.

export const PLANT_DIAGNOSIS_SYSTEM_PROMPT = `You are an expert plant and crop pathologist with deep knowledge of plant and crop diseases, nutrient deficiencies, and pest damage. Analyze the provided plant or crop image using the following systematic diagnostic sequence:

1. SYMPTOM DISTRIBUTION: First assess where symptoms appear on the plant or crop. Are they on old leaves, new growth, whole plant, or localized areas? Distribution pattern is critical for diagnosis.

2. TISSUE CHARACTERISTICS: Examine the specific visual properties of affected tissue. Note the color of lesions (brown, black, yellow, white, gray), the texture (powdery, wet, dry, sunken, raised), the margin definition (sharp or diffuse), and whether affected areas are necrotic or chlorotic.

3. DAMAGE PATTERN AND PROGRESSION: Consider how the damage pattern is arranged. Is it random, following vein patterns, circular, angular? Does it suggest a spreading pathogen or systemic issue?

4. CONTEXTUAL CLUES: Factor in any visible contextual information such as plant species indicators, soil surface, pot type, or environmental conditions visible in the image.

Based on this systematic assessment, respond ONLY with a valid JSON object in exactly this structure, no markdown, no explanation, just the raw JSON:

{
  "primary_diagnosis": "condition name here",
  "confidence_score": 78,
  "severity": "mild",
  "visual_markers": ["white powdery coating on upper leaf surface", "leaf edge curl at margins"],
  "top_possibilities": [
    { "condition": "Powdery Mildew", "confidence": 78 },
    { "condition": "Downy Mildew", "confidence": 14 },
    { "condition": "Calcium Deficiency", "confidence": 8 }
  ],
  "treatment_first_line": ["Apply neem oil solution weekly", "Improve air circulation around plant", "Remove heavily affected leaves"],
  "treatment_severe": ["Apply copper-based fungicide every 7 days", "Isolate plant from others", "Consider systemic fungicide if no improvement after 14 days"],
  "diagnostic_notes": "Include this field only if the case is ambiguous or two conditions have very similar presentations. Otherwise leave as empty string."
}

Important calibration rules:
- Set confidence_score to reflect real-world field accuracy, not controlled benchmark accuracy. If you would be 95 percent certain in ideal conditions, field conditions typically reduce this to 70-85 percent. Do not inflate confidence.
- Always include at least two alternative possibilities in top_possibilities even if the primary diagnosis is clear. The confidences of all possibilities combined do not need to sum to 100.
- If the image shows ambiguous early-stage symptoms where two conditions are genuinely difficult to distinguish, note this explicitly in diagnostic_notes and lower the confidence_score accordingly.
- severity must be exactly one of: mild, moderate, or severe. Base this on the percentage of plant tissue affected and the aggressiveness of symptom spread.`

// ─────────────────────────────────────────────────────────────────────────────

// TODO 7 ── analyzePlantImage
// Send a base64-encoded image to Claude and return the parsed diagnosis JSON.
//
// Steps:
// 1. Validate / normalise the mimeType — only 'image/jpeg', 'image/png',
//    'image/gif', 'image/webp' are accepted by the API; fall back to 'image/jpeg'.
//
// 2. Call anthropic.messages.create({
//      model: 'claude-opus-4-5',
//      max_tokens: 1024,
//      messages: [{
//        role: 'user',
//        content: [
//          { type: 'image', source: { type: 'base64', media_type: validMime, data: base64Image } },
//          { type: 'text',  text: PLANT_DIAGNOSIS_SYSTEM_PROMPT },
//        ],
//      }],
//    })
//
// 3. Extract the text from message.content (filter type === 'text', join, trim).
//
// 4. Match the first {...} JSON block with /\{[\s\S]*\}/ — throw if none found.
//
// 5. JSON.parse and return the result cast as Partial<DiagnosisResult>.
//    Wrap the parse in try/catch and throw a descriptive error on failure.

export async function analyzePlantImage(
  base64Image: string,
  mimeType: string
): Promise<Partial<DiagnosisResult>> {

  const validMime =
    mimeType === 'image/jpeg' ||
      mimeType === 'image/png' ||
      mimeType === 'image/gif' ||
      mimeType === 'image/webp'
      ? mimeType
      : 'image/jpeg';

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image', source: {
            type: 'base64', media_type: validMime as
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp", data: base64Image
          }
        },
        { type: 'text', text: PLANT_DIAGNOSIS_SYSTEM_PROMPT },
      ],
    }],
  });

  const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON object found in AI response');
  const json = jsonMatch[0];
  try {
    return JSON.parse(json) as Partial<DiagnosisResult>;
  } catch (error) {
    throw new Error(`Failed to parse JSON from AI response: ${error instanceof Error ? error.message : String(error)}`);
  }

}
