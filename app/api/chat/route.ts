import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are CropCure AI, a specialized agricultural assistant for farmers and gardeners. 
You are an expert in:
- Crop diseases, pests, and plant health issues
- Plant care, growth stages, and cultivation techniques
- Weather impacts on crops and farming schedules
- Soil health, fertilization, and irrigation
- Organic and conventional treatment methods
- Regional farming practices and crop varieties

Keep your answers practical, clear, and actionable, short and compressed. When discussing treatments, always mention both organic and conventional options when possible. 
If asked about something related to agriculture,plants or crops then reply , else politely redirect the conversation to crop, plant, or weather-related topics.
Use simple language that farmers can easily understand.`


function stripThinkingTags(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^[\s\n]+/, '') 
    .trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const apiKey = process.env.OLLAMA_API_KEY?.trim()
    if (!apiKey) {
      console.error('[chat] OLLAMA_API_KEY is missing or empty')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // 30-second hard timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    let response: Response
    try {
      response = await fetch('https://ollama.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen3-next:80b',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
          max_tokens: 1500,  
          temperature: 0.7,
          stream: false,
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[chat] Ollama API error:', response.status, errorText)
      return NextResponse.json(
        { error: `AI model error (${response.status})` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[chat] Raw response choices:', JSON.stringify(data.choices?.[0]?.message))

    const rawContent: string = data.choices?.[0]?.message?.content ?? ''
    const reply = stripThinkingTags(rawContent)

    if (!reply) {
      // Thinking-only response or empty — fall back to a safe message
      console.warn('[chat] Empty reply after stripping think tags. Raw:', rawContent)
      return NextResponse.json({
        reply: "I'm here to help with your crops and plants! Could you please re-send your question?"
      })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[chat] Request timed out')
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 })
    }
    console.error('[chat] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
