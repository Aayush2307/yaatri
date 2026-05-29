'use client';

import { create } from 'zustand';
import type { YatraBrief, GeneratedItinerary, BudgetTier, MeeraStep } from '@/types/yatra';

export type { MeeraStep };

export type ChatMsg = {
  id: string;
  role: 'meera' | 'user';
  text: string;
  itinerary?: GeneratedItinerary;
  isGreeting?: boolean;
  offeringChips?: string[];   // quick-reply chips shown below this message
};

// ─── State ───────────────────────────────────────────────────────────────────

type MeeraState = {
  step: MeeraStep;
  brief: Partial<YatraBrief>;
  messages: ChatMsg[];
  currentChips: string[];
  itinerary: GeneratedItinerary | null;
  isGenerating: boolean;
  generationError: string | null;
  activeChipMessageId: string | null; // id of the message whose chips are currently live

  init: () => void;
  selectDestination: (dest: string) => void;
  submitFromCity: (city: string) => void;
  submitTravelMonth: (month: string) => void;
  submitGroupSize: (label: string, count: number) => void;
  submitBudgetTier: (label: string, tier: BudgetTier) => void;
  submitSpecialNeeds: (label: string, needs: string[]) => void;
  setItinerary: (itinerary: GeneratedItinerary) => void;
  setGenerating: (v: boolean) => void;
  setGenerationError: (msg: string | null) => void;
  selectOfferingChip: (chip: string) => void;
  submitPhone: (phone: string) => void;
  reset: () => void;
};

// ─── Chip Data ────────────────────────────────────────────────────────────────

export const TOP_DESTINATIONS = [
  'Char Dham', 'Vaishno Devi', 'Tirupati', 'Shirdi', 'Kashi–Ayodhya',
  'Dwarka–Somnath', 'Rameshwaram', 'Ashtavinayak', 'Vrindavan–Mathura',
  'Kedarnath', 'Badrinath', 'Puri Jagannath', 'Amarnath', 'Sabarimala',
  'Nashik–Trimbakeshwar',
];

export const CITY_CHIPS = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata',
  'Hyderabad', 'Ahmedabad', 'Pune', 'Other',
];

export function getMonthChips(): string[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  });
}

export const GROUP_CHIPS = ['Just me', '2', '3–4', '5–8', '9+'];
export const BUDGET_CHIPS = ['Basic', 'Standard', 'Premium'];
export const NEEDS_CHIPS = [
  'Seniors in group', 'Helicopter assist', 'Vegetarian only',
  'No stairs', 'Wheelchair needs', 'First-time pilgrim', 'None of these',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function meera(text: string, extra?: Partial<ChatMsg>): ChatMsg {
  return { id: makeId(), role: 'meera', text, ...extra };
}

function user(text: string): ChatMsg {
  return { id: makeId(), role: 'user', text };
}

function buildOfferingChips(destination: string, specialNeeds: string[]): string[] {
  const chips = [
    `🪔 Tell me about ${destination}`,
    '🙏 I\'m ready to book',
  ];
  const hasSpecialNeed = specialNeeds.length > 0 && !specialNeeds.includes('None of these');
  if (hasSpecialNeed) {
    chips.push(`✨ What makes this special for ${specialNeeds[0].toLowerCase()}`);
  } else {
    chips.push('✨ What makes this special for first-timers');
  }
  return chips;
}

const GREETING_BODY =
  "I'm Meera, your personal yatra concierge.\n\nWhere is your heart calling you? Choose a destination below, or type it.";

function initialState(): Omit<MeeraState,
  | 'init' | 'selectDestination' | 'submitFromCity' | 'submitTravelMonth'
  | 'submitGroupSize' | 'submitBudgetTier' | 'submitSpecialNeeds'
  | 'setItinerary' | 'setGenerating' | 'setGenerationError'
  | 'selectOfferingChip' | 'submitPhone' | 'reset'
> {
  return {
    step: 'GREETING',
    brief: {},
    messages: [meera(GREETING_BODY, { isGreeting: true })],
    currentChips: [],
    itinerary: null,
    isGenerating: false,
    generationError: null,
    activeChipMessageId: null,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMeeraStore = create<MeeraState>()((set) => ({
  ...initialState(),

  init: () => set(initialState()),

  selectDestination: (dest) =>
    set((s) => ({
      step: 'FROM_CITY',
      brief: { ...s.brief, destination: dest },
      messages: [
        ...s.messages,
        user(dest),
        meera('Which city are you travelling from?'),
      ],
      currentChips: CITY_CHIPS,
    })),

  submitFromCity: (city) =>
    set((s) => ({
      step: 'TRAVEL_MONTH',
      brief: { ...s.brief, fromCity: city },
      messages: [
        ...s.messages,
        user(city),
        meera('When are you planning your yatra?'),
      ],
      currentChips: getMonthChips(),
    })),

  submitTravelMonth: (month) =>
    set((s) => ({
      step: 'GROUP_SIZE',
      brief: { ...s.brief, travelMonth: month },
      messages: [
        ...s.messages,
        user(month),
        meera('How many in your group?'),
      ],
      currentChips: GROUP_CHIPS,
    })),

  submitGroupSize: (label, count) =>
    set((s) => ({
      step: 'BUDGET_TIER',
      brief: { ...s.brief, groupSize: count },
      messages: [
        ...s.messages,
        user(label),
        meera('What kind of experience?'),
      ],
      currentChips: BUDGET_CHIPS,
    })),

  submitBudgetTier: (label, tier) =>
    set((s) => ({
      step: 'SPECIAL_NEEDS',
      brief: { ...s.brief, budgetTier: tier },
      messages: [
        ...s.messages,
        user(label),
        meera('Any special requirements?'),
      ],
      currentChips: NEEDS_CHIPS,
    })),

  submitSpecialNeeds: (label, needs) =>
    set((s) => ({
      step: 'GENERATING',
      brief: { ...s.brief, specialNeeds: needs },
      messages: [...s.messages, user(label)],
      currentChips: [],
      isGenerating: true,
      generationError: null,
    })),

  setItinerary: (itinerary) =>
    set((s) => {
      const dest = s.brief.destination ?? itinerary.destination;
      const needs = s.brief.specialNeeds ?? [];
      const chips = buildOfferingChips(dest, needs);
      const itineraryMsg = meera('', { itinerary, offeringChips: chips });
      return {
        step: 'ITINERARY_READY',
        itinerary,
        isGenerating: false,
        generationError: null,
        messages: [...s.messages, itineraryMsg],
        currentChips: [],
        activeChipMessageId: itineraryMsg.id,
      };
    }),

  setGenerating: (v) => set({ isGenerating: v }),

  setGenerationError: (msg) =>
    set((s) => ({
      isGenerating: false,
      generationError: msg,
      step: 'SPECIAL_NEEDS',
      messages: [
        ...s.messages,
        meera('I had trouble crafting your plan. Please try again.'),
      ],
      currentChips: NEEDS_CHIPS,
    })),

  selectOfferingChip: (chip) =>
    set((s) => {
      const userMsg = user(chip);

      if (chip.includes("I'm ready to book")) {
        return {
          step: 'PHONE',
          messages: [...s.messages, userMsg],
          currentChips: [],
          activeChipMessageId: null,
        };
      }

      if (chip.includes('Adjust')) {
        const followUp = meera('Any special requirements?');
        return {
          step: 'SPECIAL_NEEDS',
          messages: [...s.messages, userMsg, followUp],
          currentChips: NEEDS_CHIPS,
          activeChipMessageId: null,
        };
      }

      // "Tell me more" / "What makes this special" — static follow-up + new chips
      const dest = s.brief.destination ?? s.itinerary?.destination ?? 'this pilgrimage';
      const followUpChips = ['🙏 I\'m ready to book', '🪔 Tell me more'];
      const followUp = meera(
        chip.includes('Tell me')
          ? `${dest} holds a unique place among India's sacred sites. ${s.itinerary?.blessing ?? s.itinerary?.summary ?? ''} What specific aspect would you like to explore further?`
          : `This journey is especially meaningful for you — ${s.itinerary?.blessing ?? 'the path you have chosen aligns with deep spiritual grace.'} Would you like to proceed with booking?`,
        { offeringChips: followUpChips },
      );

      return {
        messages: [...s.messages, userMsg, followUp],
        activeChipMessageId: followUp.id,
      };
    }),

  submitPhone: (phone) =>
    set((s) => ({
      step: 'DONE',
      brief: { ...s.brief, phone },
      messages: [...s.messages, user(phone)],
      currentChips: [],
      activeChipMessageId: null,
    })),

  reset: () => set(initialState()),
}));
