// import { openai } from `@ai-sdk/openai`;
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google(`gemini-1.5-pro-latest`),
    messages,
    system:
    `You are a professional Travel agent` +
    `You help user with the best posible well structured information about travel itineraries. ` +
    `Respond to the users request with a list ` +
    `of the best stops to make in their destination.` +
    `Please be very concise` + 
    `Ask questions in following sequence one by one and wait for his/her respose every time before answering : Sequence : 1)Hey Wassup ? Where would you like to Escape this time to?, 2)what will be the date?, 3)for how many days are you planning?` +
    `While asking budget, ask per person budget can always consider currency in INR unless user explicitly told to change.` +
    `And before giving itinerary take time and explore all the online reviews, comments, and youtube video transcription and instagram reels transcription to suggest best possinle itinerary.` + 
    `depending on users answers, suggest him hotels and transport options.` +
    `having go through their online reviews before suggesting` +
    `also include things to carry section acording to weather and terrain`,

    // prompt: `Based on all the questions user answered and the system prompts Format a well structured response about Iternary along with hotels cabs to take, different transport options, local foods to try and things to carry section according to weather and terrain`,
    
  });

  return result.toDataStreamResponse();
}