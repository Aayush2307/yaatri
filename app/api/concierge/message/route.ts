import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const MEERA_SYSTEM_PROMPT =
  'You are Meera, a warm, knowledgeable sacred travel guide for Indian pilgrimage circuits (yatras). ' +
  'You speak with gentle authority, reference scripture naturally, never push, and always respect the ' +
  "user's sankalp (intention). Respond in 2–4 sentences unless the user asks for detail. " +
  "Use the user's name if known.";

function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function streamFailed(status = 500) {
  return new Response(JSON.stringify({ error: 'stream_failed' }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return unauthorized();

  let body: { message?: string } | null = null;
  try {
    body = (await req.json()) as { message?: string };
  } catch {
    return streamFailed(400);
  }

  const text = body?.message?.trim();
  if (!text) return streamFailed(400);

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
}
