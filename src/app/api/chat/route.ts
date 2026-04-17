import fs from 'fs'
import os from 'os'
import path from 'path'
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Helper: support either a path to a service-account JSON (GOOGLE_APPLICATION_CREDENTIALS)
// or the full JSON string in GOOGLE_CREDENTIALS (useful for deploy platforms like Netlify).
function ensureGoogleCredentials() {
  // Already set
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return

  const credsJson = process.env.GOOGLE_CREDENTIALS
  if (!credsJson) return

  // Only attempt to write a temp file when running in Node (not an Edge runtime)
  try {
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      const tmpPath = path.join(os.tmpdir(), `gcloud_creds_${process.pid}_${Date.now()}.json`)
      fs.writeFileSync(tmpPath, credsJson, { encoding: 'utf8', mode: 0o600 })
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath
    }
  } catch (e) {
    // ignore; we'll surface missing creds later
  }
}

ensureGoogleCredentials()

export async function POST(req: Request) {
  console.log("[v0] POST /api/chat called")
  
  // If no credentials are available, return an informative error instead of failing silently.
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_CREDENTIALS) {
    console.log("[v0] No API key found")
    return new Response(
      JSON.stringify({
        error:
          'Google credentials not found. Set GOOGLE_GENERATIVE_AI_API_KEY in environment variables.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  console.log("[v0] API key exists")
  let { messages } = await req.json()
  console.log("[v0] Messages received:", messages?.length || 0)

  //   if (!messages || messages.length === 0) {
  //     messages = [
  //       {
  //         id: Date.now().toString(), // Unique ID for the initial message
  //         role: 'assistant',
  //         content: 'Hello! I am your travel assistant. Where would you like to escape this time?',
  //       },
  //     ];
  //   }

  try {
    console.log("[v0] Creating model instance...")
    const model = google('gemini-1.5-flash', {
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })
    console.log("[v0] Model created, calling streamText...")
    
    const result = await streamText({
    model,
    messages,
    system:
      `You are a professional Travel agent` +
      `You help user with the best posible well structured information about travel itineraries. ` +
      `Respond to the users request with a list ` +
      `of the best stops to make in their destination.` +
      `Please be very concise` +
      `You can ask these questions one at a time to understand their needs: Hey Wassup Musaafir, Where are planing a trip this time?, What will be the dates of travel ?, For how many days are you planning this trip ?` +
      `While asking budget, ask per person budget can always consider currency in INR unless user explicitly told to change.` +
      `And before giving itinerary take time and explore all the online reviews, comments, and youtube video transcription and instagram reels transcription to suggest best possinle itinerary.` +
      `depending on users answers, suggest him hotels and transport options.` +
      `having go through their online reviews before suggesting` +
      `Include one section called "Things to carry" based on weather and terrains` +
      `add meals also in iternary` +
      `Do not answer any irrevalent questions to traveling.` +
      `Please format your responses using Markdown. Use **bold**, *italic*, lists, and other formatting`,

    // prompt: `Based on all the questions user answered and the system prompts Format a well structured response about Iternary along with hotels cabs to take, different transport options, local foods to try and things to carry section according to weather and terrain`,
    })

    const stream = result.toDataStreamResponse()
    console.log("[v0] Stream created successfully")
    return stream
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Error details:", errorMessage)
    return new Response(
      JSON.stringify({
        error: 'Failed to call Gemini API: ' + errorMessage
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
