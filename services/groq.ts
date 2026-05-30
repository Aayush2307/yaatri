import Groq from 'groq-sdk';
import { createGroq } from '@ai-sdk/groq';

export const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
export const GROQ_FAST_MODEL = process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant';

// Lazy singletons — instantiated on first call, not at module load time.
// This prevents build-time crashes when GROQ_API_KEY is absent from the
// build environment (it's only injected at runtime on Vercel).
let _groqClient: Groq | null = null;
let _groqProvider: ReturnType<typeof createGroq> | null = null;

export function getGroqClient(): Groq {
  if (!_groqClient) {
    _groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  }
  return _groqClient;
}

export function getGroqProvider(): ReturnType<typeof createGroq> {
  if (!_groqProvider) {
    _groqProvider = createGroq({ apiKey: process.env.GROQ_API_KEY! });
  }
  return _groqProvider;
}

// Back-compat aliases so existing imports don't need changing
export const groqClient = new Proxy({} as Groq, {
  get(_: Groq, prop: string | symbol) {
    return (getGroqClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const groqProvider = new Proxy({} as ReturnType<typeof createGroq>, {
  get(_: ReturnType<typeof createGroq>, prop: string | symbol) {
    return (getGroqProvider() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export interface TravelIntent {
  isPlanningIntent: boolean;
  destination: string | null;
  fromCity: string | null;
  travelMonth: string | null;
  peopleCount: number | null;
}

export async function extractTravelIntent(userMessage: string): Promise<TravelIntent> {
  try {
    const res = await getGroqClient().chat.completions.create({
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
