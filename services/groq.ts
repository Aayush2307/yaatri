import Groq from 'groq-sdk';
import { createGroq } from '@ai-sdk/groq';

// Direct SDK client — used for intent extraction (non-streaming, JSON mode)
export const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// Vercel AI SDK provider — used for streaming chat responses
export const groqProvider = createGroq({ apiKey: process.env.GROQ_API_KEY! });

export const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
export const GROQ_FAST_MODEL = process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant';

export interface TravelIntent {
  isPlanningIntent: boolean;
  destination: string | null;
  fromCity: string | null;
  travelMonth: string | null;
  peopleCount: number | null;
}

export async function extractTravelIntent(userMessage: string): Promise<TravelIntent> {
  try {
    const res = await groqClient.chat.completions.create({
      model: GROQ_FAST_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Extract travel planning intent from user messages about yatra (Hindu pilgrimage) trips.
Return ONLY valid JSON with this exact structure:
{
  "isPlanningIntent": boolean,
  "destination": string | null,
  "fromCity": string | null,
  "travelMonth": string | null,
  "peopleCount": number | null
}
isPlanningIntent is true if the user mentions wanting to visit a temple, go on a yatra, book travel, find hotels, or plan a pilgrimage trip.`,
        },
        { role: 'user', content: userMessage },
      ],
    });
    return JSON.parse(res.choices[0].message.content || '{}') as TravelIntent;
  } catch {
    return { isPlanningIntent: false, destination: null, fromCity: null, travelMonth: null, peopleCount: null };
  }
}
