/*
 * MEERA DEPLOYMENT CHECKLIST
 * Before deploying, verify in Vercel dashboard → Settings → Environment Variables:
 * - [ ] ANTHROPIC_API_KEY is set for Production environment (format: sk-ant-api03-...)
 * - [ ] GROQ_API_KEY is set for Production environment (used by /api/chatbot/message)
 * - [ ] All other required vars from lib/env-check.ts are present
 * - [ ] /api/meera/health returns { status: 'ok' } after deploy
 * - [ ] Meera activates within 3s on /home page in production
 *
 * MEERA HEALTH: If Meera shows 'resting' in production, check:
 * (1) Vercel env vars — GROQ_API_KEY and ANTHROPIC_API_KEY must both be set
 * (2) /api/meera/health endpoint — should return { status: 'ok' }
 * (3) Vercel function logs for MEERA_CONFIG_MISSING errors
 */

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const MEERA_SYSTEM_PROMPT =
  'You are Meera, a warm, knowledgeable sacred travel guide for Indian pilgrimage circuits (yatras). ' +
  'You speak with gentle authority, reference scripture naturally, never push, and always respect the ' +
  "user's sankalp (intention). Respond in 2–4 sentences unless the user asks for detail. " +
  "Use the user's name if known.";

function configMissing() {
  console.error('[meera] MEERA_CONFIG_MISSING: ANTHROPIC_API_KEY is not set. Check Vercel env vars.');
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
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return configMissing();

    let body: { message?: string } | null = null;
    try {
      body = (await req.json()) as { message?: string };
    } catch {
      return streamFailed(400, 'Failed to parse request body');
    }

    const text = body?.message?.trim();
    if (!text) return streamFailed(400, 'Missing message field');

    const client = new Anthropic({ apiKey });
    const model = process.env.MEERA_MODEL || 'claude-sonnet-4-6';

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const write = (event: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          const stream = await client.messages.create({
            model,
            max_tokens: 1024,
            stream: true,
            system: MEERA_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: text }],
          });

          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              write({ type: 'token', text: event.delta.text });
            }
          }

          write({ type: 'done' });
        } catch (err) {
          console.error('[meera] Stream error:', err);
          const code =
            err instanceof Anthropic.AuthenticationError ? 'unauthorized' : 'server_error';
          write({ type: 'error', code });
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
