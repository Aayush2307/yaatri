import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { groqClient, GROQ_MODEL } from '@/services/groq';
import { MEERA_SYSTEM_PROMPT, BUDGET_LABELS } from '@/prompts/meera-system-prompt';
import type { YatraBrief } from '@/types/yatra';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const DaySchema = z.object({
  day: z.string(),
  title: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  stay: z.string().optional(),
  logisticalNote: z.string().optional(),
  auspiciousTag: z.string().optional(),
});

const ItinerarySchema = z.object({
  title: z.string(),
  destination: z.string(),
  duration: z.string(),
  blessing: z.string(),
  summary: z.string(),
  days: z.array(DaySchema).min(1),
  auspiciousDates: z.array(z.string()),
  estimatedCostRange: z.string(),
  includes: z.array(z.string()),
  insiderSecret: z.string(),
  notes: z.union([z.string(), z.array(z.string())]).optional().transform((v) =>
    Array.isArray(v) ? v.join(' ') : v
  ),
});

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const brief = (await req.json()) as Partial<YatraBrief>;
    const { destination, fromCity, travelMonth, groupSize, budgetTier, specialNeeds } = brief;

    if (!destination || !fromCity || !travelMonth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const needsText =
      !specialNeeds || specialNeeds.length === 0
        ? 'None stated'
        : specialNeeds.join(', ');

    const userPrompt = `Create a sacred yatra itinerary for:
- Destination: ${destination}
- Travelling from: ${fromCity}
- Travel month: ${travelMonth}
- Group size: ${groupSize ?? 1} person(s)
- Budget: ${BUDGET_LABELS[budgetTier ?? 'standard'] ?? 'standard'}
- Special needs / sankalp: ${needsText}`;

    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.72,
      max_tokens: 3500,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: MEERA_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return NextResponse.json({ error: 'Empty response from model' }, { status: 502 });
    }

    const parsed = ItinerarySchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error('[yatra/generate] validation failed:', parsed.error.issues);
      return NextResponse.json({ error: 'Invalid itinerary structure' }, { status: 502 });
    }

    return NextResponse.json(parsed.data);
  } catch (err) {
    console.error('[yatra/generate] error:', err);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
