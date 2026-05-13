import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const model = process.env.MEERA_MODEL || 'claude-sonnet-4-6';

  const missing: string[] = [];
  if (!apiKey) missing.push('ANTHROPIC_API_KEY');
  if (!groqKey) missing.push('GROQ_API_KEY');

  if (missing.length > 0) {
    console.error('[meera/health] MEERA_CONFIG_MISSING:', missing.join(', '));
    return NextResponse.json(
      { status: 'error', reason: `MEERA_CONFIG_MISSING: ${missing.join(', ')} not set` },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: 'ok', model, timestamp: Date.now() });
}
