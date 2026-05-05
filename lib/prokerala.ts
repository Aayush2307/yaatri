import { db } from '@/lib/db';

type TokenState = {
  accessToken: string;
  expiresAt: number;
};

let tokenState: TokenState | null = null;

const API_BASE = process.env.PROKERALA_API_BASE || 'https://api.prokerala.com/v2';
const TOKEN_URL = process.env.PROKERALA_TOKEN_URL || 'https://api.prokerala.com/token';
const CACHE_TTL_MINUTES = Number(process.env.PROKERALA_CACHE_TTL_MINUTES || '1440');
const AYANAMSA = process.env.PROKERALA_AYANAMSA || '1';

function resolveOffset(timezone?: string) {
  if (!timezone) return 'Z';
  if (timezone.includes('Asia/Kolkata')) return '+05:30';
  return 'Z';
}

export function buildProkeralaDateTime(date: string, timezone?: string) {
  const offset = resolveOffset(timezone);
  return `${date}T06:00:00${offset}`;
}

export function getProkeralaAyanamsa() {
  return AYANAMSA;
}

function buildCacheKey(endpoint: string, params: Record<string, string | number>) {
  const keys = Object.keys(params).sort();
  const query = keys.map((key) => `${key}=${params[key]}`).join('&');
  return `${endpoint}?${query}`;
}

async function getAccessToken() {
  if (tokenState && tokenState.expiresAt > Date.now()) {
    return tokenState.accessToken;
  }

  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing Prokerala credentials.');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Prokerala auth failed (${response.status}): ${bodyText}`);
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error('Prokerala token response missing access_token.');
  }

  const expiresIn = data.expires_in ? data.expires_in * 1000 : 3600 * 1000;
  tokenState = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn - 30_000,
  };

  return tokenState.accessToken;
}

export async function fetchProkerala(endpoint: string, params: Record<string, string | number>) {
  const cacheKey = buildCacheKey(endpoint, params);
  const cached = await db.apiCache.findUnique({ where: { key: cacheKey } });

  if (cached && cached.expiresAt.getTime() > Date.now()) {
    return cached.response;
  }

  const accessToken = await getAccessToken();
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Prokerala request failed (${response.status}): ${bodyText}`);
  }

  const data = (await response.json()) as any;
  const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60_000);

  await db.apiCache.upsert({
    where: { key: cacheKey },
    create: { key: cacheKey, response: data, expiresAt },
    update: { response: data, expiresAt },
  });

  return data;
}

export async function fetchProkeralaWithFallback(
  endpoints: string[],
  params: Record<string, string | number>,
) {
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      return await fetchProkerala(endpoint, params);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastError = error instanceof Error ? error : new Error(message);
      if (message.includes('404') || message.includes('No route found')) {
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error('Prokerala request failed.');
}
