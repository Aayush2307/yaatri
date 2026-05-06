import { NextResponse, type NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

// Fix 8: Log missing env vars at module load so Vercel build logs surface them immediately
const MISSING_VARS = ['GROQ_API_KEY', 'GROQ_API_URL'].filter((k) => !process.env[k]);
if (MISSING_VARS.length) {
  console.error(`[chatbot] Missing required env vars: ${MISSING_VARS.join(', ')}`);
}

const RATE_LIMIT_MAX = 20;
const MAX_MESSAGE_LENGTH = 500;
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

// Fix 3: Upstash Redis rate limiter — gracefully disabled when credentials are absent
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

if (!redis) {
  console.warn('[chatbot] UPSTASH_REDIS_REST_URL/TOKEN not configured — rate limiting disabled');
}

async function checkRateLimit(ip: string): Promise<boolean> {
  if (!redis) return true;
  try {
    const key = `chatbot:ratelimit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60); // 1-minute sliding window
    return count <= RATE_LIMIT_MAX;
  } catch {
    console.warn('[chatbot] Redis rate limit check failed — allowing request');
    return true;
  }
}

const SYSTEM_PROMPT =
  'You are a premium spiritual travel concierge for the Yaatri platform. Your responses must be human-readable, conversational, and meticulously formatted. Use clean spacing, headings, and bullet points. Never expose backend JSON, object logs, or technical data inside the message. Convert all API results into a fluid, user-friendly summary. Keep emojis minimal and professional.';

const PLANNER_PROMPT =
  'You are an AI planner. Decide which tools to call based on the user\'s message and recent conversation context. Return a JSON object matching this exact schema: {"message": string, "intent": string, "actions": [{"type":"redirect","label": string, "url": string}], "toolCalls": [{"name": "search_temples|get_muhurat|search_routes|booking_options", "params": {"query": "search text", "date": "optional date", "location": "optional location"}}]}. Do not include markdown code blocks. For `search_temples`, always supply a `query` parameter (e.g., {"query": "Delhi"} or {"query": "Akshardham"}). If no tool is needed, leave `toolCalls` empty.';

type MsgArray = Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;

type ChatAction = {
  type: 'redirect';
  label: string;
  url: string;
};

type ToolCall = {
  name: 'search_temples' | 'get_muhurat' | 'search_routes' | 'booking_options';
  params: Record<string, string | number | boolean | null | undefined>;
};

type ChatPlan = {
  message: string;
  intent: string;
  actions?: ChatAction[];
  toolCalls?: ToolCall[];
};

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  return ip || request.headers.get('x-real-ip') || 'anonymous';
}

function isDisallowedContent(message: string) {
  const text = message.toLowerCase();
  if (/\b(kill|murder|suicide|self-harm|bomb|terror)\b/.test(text)) return true;
  if (/\b(hate|genocide|nazi|white power)\b/.test(text)) return true;
  if (/\b(child|minor).*(sexual|nude|porn|abuse)\b/.test(text)) return true;
  return false;
}

async function callGroq(messages: MsgArray, forceJson = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'Chatbot is not configured. Missing GROQ_API_KEY.' } as const;
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      stream: false,
      temperature: 0.4,
      messages,
      ...(forceJson ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    return { ok: false, error: 'Chatbot provider error. Please try again.' } as const;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return { ok: false, error: 'Chatbot response was empty.' } as const;
  }

  return { ok: true, content } as const;
}

// Fix 4: Groq → Anthropic fallback. Only attempted when ANTHROPIC_API_KEY is set.
async function callLLM(
  messages: MsgArray,
  forceJson = false,
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  const groqResult = await callGroq(messages, forceJson);
  if (groqResult.ok) return groqResult;

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return groqResult; // propagate original error if no fallback configured

  try {
    const model = process.env.MEERA_MODEL || 'claude-haiku-4-5-20251001';
    const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content);
    const chatMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const systemPrompt = forceJson
      ? `${systemParts.join('\n\n')}\n\nAlways respond with valid JSON only. No markdown fences.`
      : systemParts.join('\n\n');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model, max_tokens: 1024, system: systemPrompt, messages: chatMessages }),
    });

    if (res.ok) {
      const data = (await res.json()) as { content?: Array<{ text?: string }> };
      const content = data.content?.[0]?.text?.trim();
      if (content) return { ok: true, content };
    }
  } catch {
    // Anthropic fallback failed — return original Groq error below
  }

  return groqResult;
}

function tryParsePlan(raw: string): ChatPlan | null {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as ChatPlan;
    }
    const cleaned = raw.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
    return JSON.parse(cleaned) as ChatPlan;
  } catch {
    return null;
  }
}

async function runTool(
  name: ToolCall['name'],
  params: ToolCall['params'],
  origin: string,
  authToken?: string | null,
) {
  const url = new URL(
    `/api/${
      name === 'search_temples'
        ? 'temples'
        : name === 'get_muhurat'
          ? 'muhurat'
          : name === 'search_routes'
            ? 'destinations'
            : 'bookings/search'
    }`,
    origin,
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  const headers = new Headers();
  if (name === 'booking_options' && authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await fetch(url.toString(), { method: 'GET', headers });
  if (!response.ok) {
    return { ok: false, error: 'Tool request failed.' };
  }

  const data = (await response.json()) as { ok?: boolean; data?: unknown; error?: string };
  if (!data.ok) {
    return { ok: false, error: data.error || 'Tool request failed.' };
  }

  return { ok: true, data: data.data };
}

// Fix 5: Accept userId so new sessions are linked to the authenticated user
async function resolveSession(sessionId?: string | null, userId?: string | null): Promise<string | null> {
  try {
    if (sessionId) {
      const existing = await db.chatSession.findUnique({ where: { id: sessionId } });
      if (existing) return existing.id;
    }
    const created = await db.chatSession.create({ data: userId ? { userId } : {} });
    return created.id;
  } catch {
    // DB not yet migrated or Prisma client not generated — session persistence skipped.
    return sessionId ?? null;
  }
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  const allowed = await checkRateLimit(clientKey);
  if (!allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 },
    );
  }

  let payload: { message?: string; sessionId?: string; authToken?: string } | null = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request payload.' }, { status: 400 });
  }

  const message = payload?.message?.trim();
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ message: 'Message is required and must be under 500 characters.' }, { status: 400 });
  }

  if (isDisallowedContent(message)) {
    return NextResponse.json({ message: 'I cannot help with that. I can assist with Yaatri travel and temple planning.' }, { status: 400 });
  }

  // Fix 5: decode JWT (supports both { userId } and { id } payload shapes)
  let userId: string | null = null;
  if (payload?.authToken) {
    const decoded = verifyJWT(payload.authToken);
    if (decoded && typeof decoded === 'object') {
      const d = decoded as Record<string, unknown>;
      userId = (d.userId as string | null) ?? (d.id as string | null) ?? null;
    }
  }

  const sessionId = await resolveSession(payload?.sessionId, userId);

  // Fetch conversation history for context (gracefully skipped if DB unavailable)
  let history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  try {
    if (sessionId) {
      const pastMessages = await db.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });
      history = pastMessages.map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      }));
    }
  } catch {
    // DB unavailable — continuing without conversation history.
  }

  // Persist user message (gracefully skipped if DB unavailable)
  try {
    if (sessionId) {
      await db.chatMessage.create({
        data: { sessionId, role: 'user', content: message },
      });
    }
  } catch {
    // DB persistence unavailable — continuing without saving message.
  }

  const planResult = await callLLM(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: PLANNER_PROMPT },
      ...history,
      { role: 'user', content: message },
    ],
    true,
  );

  if (!planResult.ok) {
    return NextResponse.json({ message: planResult.error, actions: [], intent: 'error', sessionId }, { status: 502 });
  }

  const plan = tryParsePlan(planResult.content) || {
    message: planResult.content,
    intent: 'general',
    actions: [],
    toolCalls: [],
  };

  let toolSummary = 'No tool calls.';
  if (plan.toolCalls && plan.toolCalls.length > 0) {
    const results = [] as Array<{ name: string; result: unknown }>;
    for (const toolCall of plan.toolCalls) {
      const result = await runTool(toolCall.name, toolCall.params, request.nextUrl.origin, payload?.authToken);
      results.push({ name: toolCall.name, result });
    }
    toolSummary = JSON.stringify(results);
  }

  // Fix 1 (preserved): Tool results system msg placed BEFORE history to satisfy Groq's message ordering
  const finalResult = await callLLM(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: 'Use the tool results to craft a final JSON response. Structure it exactly like PLANNER_PROMPT. The `message` field MUST be beautifully formatted Markdown (headings, lists) to be shown directly to the user. Never include JSON syntax in the `message` string. Return a valid JSON object.' },
      { role: 'system', content: `Tool results: ${toolSummary}` },
      ...history,
      { role: 'user', content: message },
    ],
    true,
  );

  if (!finalResult.ok) {
    return NextResponse.json({ message: finalResult.error, actions: [], intent: 'error', sessionId }, { status: 502 });
  }

  const finalPlan = tryParsePlan(finalResult.content) || {
    message: finalResult.content,
    intent: plan.intent || 'general',
    actions: plan.actions || [],
  };

  // Persist assistant message (gracefully skipped if DB unavailable)
  try {
    if (sessionId) {
      await db.chatMessage.create({
        data: { sessionId, role: 'assistant', content: finalPlan.message },
      });
    }
  } catch {
    // DB persistence unavailable — continuing without saving message.
  }

  return NextResponse.json({
    message: finalPlan.message,
    actions: finalPlan.actions || [],
    intent: finalPlan.intent || plan.intent || 'general',
    sessionId,
  });
}
