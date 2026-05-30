/*
 * MEERA DEPLOYMENT CHECKLIST
 * Before deploying, verify in Vercel dashboard → Settings → Environment Variables:
 * - [ ] GROQ_API_KEY is set for Production environment (get free at console.groq.com/keys)
 * - [ ] GROQ_MODEL is set (default: llama-3.3-70b-versatile)
 * - [ ] All other required vars from lib/env-check.ts are present
 * - [ ] /api/meera/health returns { status: 'ok' } after deploy
 * - [ ] Meera activates within 3s on /home page in production
 *
 * MEERA HEALTH: If Meera shows 'resting' in production, check:
 * (1) Vercel env vars — GROQ_API_KEY must be set
 * (2) /api/meera/health endpoint — should return { status: 'ok' }
 * (3) Vercel function logs for MEERA_CONFIG_MISSING errors
 */

import { NextRequest } from 'next/server';
import { groqProvider, GROQ_MODEL } from '@/services/groq';
import { streamText } from 'ai';

const MEERA_SYSTEM_PROMPT =
  'You are Meera, a warm and knowledgeable spiritual travel concierge for the Yaatri platform. ' +
  'You help pilgrims plan yatras with deep knowledge of temples, auspicious timings, sacred routes, and devotional travel. ' +
  "When helping someone plan a yatra:\n" +
  "- If you don't know their starting city, ask early (\"Where will you be travelling from?\")\n" +
  '- Mention the train or flight options briefly (e.g. "From Mumbai, a direct train to Haridwar takes about 20 hours")\n' +
  '- Always mention dharamshala or temple trust accommodation options alongside regular hotels — budget-conscious pilgrims appreciate this\n' +
  '- For Kedarnath, always mention the helicopter option as it is important for senior pilgrims\n' +
  'Your tone is gentle, reverent, and practical. Format responses with clean spacing and natural prose. ' +
  "Never expose JSON or technical data. Keep responses focused on the pilgrim's journey. " +
  "Use the user's name if known.";

function configMissing() {
  console.error('[meera] MEERA_CONFIG_MISSING: GROQ_API_KEY is not set. Check Vercel env vars.');
  return new Response(
    JSON.stringify({ error: 'MEERA_CONFIG_MISSING', hint: 'Check Vercel env vars' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } },
  );
}

function streamFailed(status = 500, detail?: string) {
  if (detail) console.error(`[meera] streamFailed(${status}):`, detail);
  return new Response(JSON.stringify({ error: 'stream_failed' }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return configMissing();

    let body: { message?: string } | null = null;
    try {
      body = (await req.json()) as { message?: string };
    } catch {
      return streamFailed(400, 'Failed to parse request body');
    }

    const text = body?.message?.trim();
    if (!text) return streamFailed(400, 'Missing message field');

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const write = (event: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          const result = await streamText({
            model: groqProvider(GROQ_MODEL),
            system: MEERA_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: text }],
            maxOutputTokens: 1024,
            temperature: 0.7,
          });

          for await (const chunk of result.textStream) {
            write({ type: 'token', text: chunk });
          }

          write({ type: 'done' });
        } catch (err) {
          console.error('[meera] Stream error:', err);
          write({ type: 'error', code: 'server_error' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[meera] Unhandled error in POST handler:', err);
    return streamFailed(500, String(err));
  }
}
