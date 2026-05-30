# Yaatri — Sacred Travel Concierge

Yaatri is a mobile-first spiritual travel app for Hindu pilgrimages (yatras). The core product is **Meera**, an AI concierge that guides pilgrims through a structured chat flow, generates personalised sacred itineraries via Groq LLM, and captures booking intent.

**Production:** https://yaatri-beta.vercel.app

## Run locally

```bash
git clone https://github.com/Aayush2307/yaatri.git
cd yaatri
npm install
cp .env.example .env.local   # fill in real values (see below)
npx prisma generate
npm run dev
```

Open http://localhost:3000 — the app redirects to `/home`.  
The Meera concierge lives at `/concierge`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key — powers Meera itinerary generation |
| `GROQ_MODEL` | ✅ | e.g. `llama-3.3-70b-versatile` |
| `GROQ_FAST_MODEL` | ✅ | e.g. `llama-3.1-8b-instant` |
| `RAPIDAPI_KEY` | ✅ | Single key for flights, hotels, trains (RapidAPI) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `DATABASE_URL` | ⚠️ | PostgreSQL URL — required for saving yatra leads; app works without it |
| `NEXT_PUBLIC_MEERA_WHATSAPP_NUMBER` | optional | WhatsApp CTA number in concierge |
| `JWT_SECRET` | optional | For auth token signing |

See [DEPLOY.md](./DEPLOY.md) for the full Vercel deployment guide.

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Groq** (llama-3.3-70b) — itinerary generation
- **Zustand** — Meera chat state machine
- **Prisma + PostgreSQL** (Supabase) — data persistence
- **Framer Motion** — animations
- **Vercel** — hosting
