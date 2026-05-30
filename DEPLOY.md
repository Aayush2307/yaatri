# Yaatri — Deployment Guide

## Production URL
TBD after first deploy.

## How to run locally
```bash
npm install
cp .env.example .env.local   # fill in real values
npx prisma generate
npm run dev
```

## Required Environment Variables (set in Vercel Dashboard)

### Core — always required
| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key — powers Meera itinerary generation |
| `GROQ_MODEL` | Model name, e.g. `llama-3.3-70b-versatile` |
| `GROQ_FAST_MODEL` | Fast model, e.g. `llama-3.1-8b-instant` |
| `RAPIDAPI_KEY` | Single RapidAPI key for flights, hotels, trains |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |

### Database
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase / Neon / PlanetScale) — required for `/api/yatra/brief` to save leads. App works without it but brief-saving will 500. |

### Optional / secondary features
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Production URL, e.g. `https://yaatri.vercel.app` |
| `NEXT_PUBLIC_MEERA_WHATSAPP_NUMBER` | WhatsApp number shown in concierge CTA |
| `JWT_SECRET` | For auth token signing |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | SMS OTP (fallback auth) |
| `SUPABASE_SECRET_KEY` | Server-side Supabase operations |

## Notes
- `DATABASE_URL` must point to a **live** PostgreSQL database with the Prisma schema applied:
  ```bash
  npx prisma db push
  ```
- All `NEXT_PUBLIC_*` vars are baked into the client bundle at build time — set them before deploying.
- `.env.local` is gitignored — never commit real secrets.
