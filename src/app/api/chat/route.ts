import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  let { messages } = await req.json();
    
//   if (!messages || messages.length === 0) {
//     messages = [
//       {
//         id: Date.now().toString(), // Unique ID for the initial message
//         role: 'assistant',
//         content: 'Hello! I am your travel assistant. Where would you like to escape this time?',
//       },
//     ];
//   }


  const result = await streamText({
    model: google(`gemini-1.5-flash`),
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
    
  });

  return result.toDataStreamResponse();
}