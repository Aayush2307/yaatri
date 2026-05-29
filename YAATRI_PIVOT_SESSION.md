# Yaatri — Product Pivot Session
**Date:** May 28, 2026  
**Branch:** `new_Yaatri`  
**Repo:** `/Users/golu/yaatri/yaatri`

---

## What We Decided

Yaatri is pivoting from an open-ended AI chat (Meera as general Q&A bot) to a **structured yatra tour booking assistant**.

### The Core Flow
User tells Meera where they want to go → Meera asks 5 guided questions → **AI generates a personalised day-by-day itinerary** → User sees it in chat → "Ready to book? We'll call you back" → Phone number captured → YatraBrief saved to Supabase.

The itinerary is the differentiator — the user gets something beautiful and tangible before being asked for any commitment.

---

## Product Decisions Made

| Decision | Choice |
|---|---|
| Geography | India only |
| Tour types | Fixed departures + Private/custom (both) |
| Tour products | 10–20 most popular Indian pilgrimages |
| Question style | Tap-able chips (one question at a time) |
| Destination chips | Disappear after selection |
| Itinerary generation | AI-generated via Groq (unique per user, not static) |
| End of flow | Phone number → ops team calls back within 24h |
| Old planning flow | Removed from `/concierge` (ChatWidget on other pages untouched) |

### Top 15 Destinations (at launch)
Char Dham · Vaishno Devi · Tirupati · Shirdi · Kashi–Ayodhya · Dwarka–Somnath · Rameshwaram · Ashtavinayak · Vrindavan–Mathura · Kedarnath · Badrinath · Puri Jagannath · Amarnath · Sabarimala · Nashik–Trimbakeshwar

---

## Conversation State Machine

```
GREETING
  → user taps/types destination
FROM_CITY
  → "Which city will you be travelling from?" + city chips
DATE
  → "When are you planning your yatra?" + month chips
GROUP_SIZE
  → "How many people?" + group chips
BUDGET
  → "What kind of experience?" + budget tier chips
SPECIAL_NEEDS
  → "Any special requirements?" + needs chips
GENERATING
  → API call to /api/yatra/generate (Groq)
ITINERARY_READY
  → ItineraryCard rendered in chat + booking CTA chips
PHONE
  → Phone number input
DONE
  → YatraBrief saved to Supabase + confirmation message
```

---

## Files Built

### New Files Created

| File | Purpose |
|---|---|
| `types/yatra.ts` | `YatraBrief`, `GeneratedItinerary`, `ItineraryDay`, `BudgetTier` types |
| `store/meeraStore.ts` | Zustand state machine — all 10 steps, chip data, actions |
| `app/api/yatra/generate/route.ts` | POST — takes YatraBrief fields, calls Groq, returns structured JSON itinerary |
| `app/api/yatra/brief/route.ts` | POST — saves completed YatraBrief + itinerary to Supabase |
| `components/concierge/ItineraryCard.tsx` | Beautiful day-timeline card with highlights, auspicious dates, cost, includes |

### Files Modified

| File | What Changed |
|---|---|
| `app/(app)/concierge/ConciergeChat.tsx` | **Complete rebuild** — new Meera flow, destination grid, chips, ItineraryCard embed, phone input |
| `app/(app)/concierge/page.tsx` | Removed old prefill props (no longer needed) |
| `prisma/schema.prisma` | Added `YatraBrief` model at the bottom |

### Files NOT Touched
- `components/chatbot/ChatWidget.tsx` — floating bubble on other pages, unchanged
- `hooks/useChatbot.ts` — unchanged
- `store/plannerStore.ts` — unchanged
- All other API routes — unchanged
- Auth, onboarding, panchang — unchanged

---

## Data Model

### YatraBrief (Prisma / Supabase)
```prisma
model YatraBrief {
  id           String   @id @default(cuid())
  destination  String
  fromCity     String
  travelMonth  String
  groupSize    Int      @default(1)
  budgetTier   String   @default("standard")  // basic | standard | premium
  specialNeeds String[] @default([])
  phone        String?
  itinerary    Json?    // full GeneratedItinerary object
  status       String   @default("new")       // new | contacted | booked
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### GeneratedItinerary (TypeScript)
```typescript
interface GeneratedItinerary {
  title: string;
  destination: string;
  duration: string;           // e.g. "12 Days / 11 Nights"
  summary: string;
  days: ItineraryDay[];
  auspiciousDates: string[];  // from Hindu calendar
  estimatedCostRange: string; // e.g. "₹35,000 – ₹45,000 per person"
  includes: string[];
  notes?: string;
}
```

---

## How to Run Locally

### 1. Run Prisma migration
```bash
npx prisma generate
npx prisma db push
```

### 2. Verify .env.local has these keys
```
GROQ_API_KEY=                        # required — itinerary generation
DATABASE_URL=                        # required — Supabase / Postgres
NEXT_PUBLIC_CONCIERGE_WHATSAPP=      # optional — WhatsApp fallback number
```

### 3. Start the dev server
```bash
npm run dev
```

### 4. Test the new flow
Open **http://localhost:3000/concierge**

Expected behaviour:
- Greeting message + 15 destination tiles appear
- Tap a destination → chips disappear, city question appears
- Answer all 5 questions via chips or typed input
- Loading state → AI-generated itinerary card appears in chat
- "Yes, book this yatra! 🙏" → phone input → confirmation
- "🙏 Plan another yatra" button resets the flow

---

## Claude Code Prompt (for local setup)

Paste this into `claude` after `cd /Users/golu/yaatri/yaatri`:

```
I'm working on a Next.js 14 spiritual travel app called Yaatri. A product pivot has already been implemented in this repo — here's exactly what was built and what I need you to do to get it running on localhost.

## What was already built (do not rebuild these)

1. `types/yatra.ts` — YatraBrief, GeneratedItinerary, ItineraryDay types
2. `store/meeraStore.ts` — Zustand state machine for a structured booking chat flow
3. `app/api/yatra/generate/route.ts` — Groq-powered itinerary generation
4. `app/api/yatra/brief/route.ts` — Saves YatraBrief to Supabase via Prisma
5. `components/concierge/ItineraryCard.tsx` — Itinerary card UI component
6. `app/(app)/concierge/ConciergeChat.tsx` — Rebuilt Meera chat (full booking flow)
7. `prisma/schema.prisma` — YatraBrief model was added at the bottom

## Your job — get this running on localhost

Step 1: Run `npx prisma generate` then `npx prisma db push`
Step 2: Verify .env.local has GROQ_API_KEY and DATABASE_URL
Step 3: Run `npx tsc --noEmit` and fix any errors
Step 4: Run `npm run dev` and open http://localhost:3000/concierge
Step 5: Verify the full flow works — destination grid → guided questions → AI itinerary → phone capture
Step 6: Check http://localhost:3000/home — the floating Meera bubble should still work as before
```

---

## What's Next (Planned But Not Built)

- **Admin dashboard** — ops team view of incoming YatraBrief leads (status: new / contacted / booked)
- **Tour packages catalogue** — `/tours` page with browsable fixed-departure packages
- **Muhurat integration** — Prokerala API feeding auspicious date suggestions into the booking flow
- **WhatsApp notification** — alert ops team when a new brief is submitted (Twilio already in env)
- **Package matching** — Meera recommends a specific existing package based on the brief
