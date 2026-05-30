// ─── Yatra Booking Types ────────────────────────────────────────────────────

export type MeeraStep =
  | 'GREETING'
  | 'FROM_CITY'
  | 'TRAVEL_MONTH'
  | 'GROUP_SIZE'
  | 'BUDGET_TIER'
  | 'SPECIAL_NEEDS'
  | 'GENERATING'
  | 'ITINERARY_READY'
  | 'PHONE'
  | 'DONE';

export interface ItineraryDay {
  day: string;            // e.g. "Day 1" or "Day 1–2"
  title: string;          // e.g. "Arrival in Haridwar"
  description: string;    // 1–2 sentences
  highlights: string[];   // key stops / rituals
  stay?: string;          // accommodation type
  logisticalNote?: string; // pilgrim-specific logistics (palki, helicopter, etc.)
  auspiciousTag?: string;  // moon phase, brahma muhurta, festival name
}

export interface GeneratedItinerary {
  title: string;              // e.g. "Kedarnath Yatra — Sawan 2026"
  destination: string;
  duration: string;           // e.g. "5 Days / 4 Nights"
  blessing: string;           // personalised opening blessing
  summary: string;            // 1-sentence summary (compat alias for blessing)
  days: ItineraryDay[];
  auspiciousDates: string[];  // e.g. ["July 21 – Sawan Somvar (most powerful)"]
  estimatedCostRange: string; // e.g. "₹18,000 – ₹28,000 per person"
  includes: string[];         // what's covered
  insiderSecret: string;      // hyper-specific destination tip
  notes?: string;             // practical / spiritual notes
}

export type BudgetTier = 'basic' | 'standard' | 'premium';

export interface YatraBrief {
  destination: string;
  fromCity: string;
  travelMonth: string;
  groupSize: number;
  budgetTier: BudgetTier;
  specialNeeds: string[];
  phone?: string;
  itinerary?: GeneratedItinerary;
}
