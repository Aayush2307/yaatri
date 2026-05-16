import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlightOption } from '@/services/flights';
import type { TrainOption } from '@/services/trains';
import type { HotelOption } from '@/services/hotels';
import type { PlanCategory } from '@/components/chat/planning/CategoryPicker';

export type { PlanCategory };

export type ConciergeView =
  | 'intake' | 'categories' | 'travel-mode' | 'flights'
  | 'trains' | 'road' | 'stay-tier' | 'hotels' | 'activities' | 'puja';

type PlannerState = {
  // ─── Existing trip planner fields ───────────────────────────────────────────
  sankalp: {
    intentionKey?: string;
    intentionLabel?: string;
    contextNote?: string;
    duration?: string;
    budget?: string;
  };
  circuit: {
    id?: string;
    name?: string;
    stops?: string;
    price?: string;
  };
  muhurat: {
    tithi?: string;
    quality?: string;
    dateRange?: string;
  };
  travellers: {
    pilgrims?: number;
    hasSenior?: boolean;
    mobilityNeeds?: string[];
    dietaryPrefs?: string[];
    specialNote?: string;
  };
  setTrip: (
    partial: Partial<Pick<PlannerState, 'sankalp' | 'circuit' | 'muhurat' | 'travellers'>>,
  ) => void;
  clearTrip: () => void;

  // ─── Meera Concierge state ───────────────────────────────────────────────────
  concierge: {
    // Intake
    destination: string | null;
    fromCity: string | null;
    travelMonth: string | null;
    travelYear: number;
    peopleCount: number;
    intakeComplete: boolean;
    // Mode
    planningMode: boolean;
    // Category tracking
    completedCategories: PlanCategory[];
    // API results
    flightOptions: FlightOption[];
    trainOptions: TrainOption[];
    hotelOptions: HotelOption[];
    // Selections
    selectedFlight: FlightOption | null;
    selectedTrain: TrainOption | null;
    selectedHotel: HotelOption | null;
    // Navigation
    currentView: ConciergeView;
    travelMode: 'flights' | 'trains' | 'road' | null;
    stayTier: 'basic' | 'better' | 'premium' | null;
    // Prefill from homepage
    prefillYatra: string | null;
    prefillFrom: string | null;
  };

  // Concierge actions
  setConcierge: (partial: Partial<PlannerState['concierge']>) => void;
  setPlanningMode: (on: boolean) => void;
  setIntake: (destination: string, fromCity: string, month: string, people: number) => void;
  setCurrentView: (view: ConciergeView) => void;
  setFlightOptions: (options: FlightOption[]) => void;
  setTrainOptions: (options: TrainOption[]) => void;
  setHotelOptions: (options: HotelOption[]) => void;
  selectFlight: (flight: FlightOption) => void;
  selectTrain: (train: TrainOption) => void;
  selectHotel: (hotel: HotelOption) => void;
  markCategoryComplete: (cat: PlanCategory) => void;
  resetConcierge: () => void;
  initiatePlanningSession: (yatra?: string, from?: string) => void;
  clearSession: () => void;
};

const DEFAULT_CONCIERGE: PlannerState['concierge'] = {
  destination: null,
  fromCity: null,
  travelMonth: null,
  travelYear: new Date().getFullYear() + 1,
  peopleCount: 1,
  intakeComplete: false,
  planningMode: false,
  completedCategories: [],
  flightOptions: [],
  trainOptions: [],
  hotelOptions: [],
  selectedFlight: null,
  selectedTrain: null,
  selectedHotel: null,
  currentView: 'intake',
  travelMode: null,
  stayTier: null,
  prefillYatra: null,
  prefillFrom: null,
};

const initialState = {
  sankalp: {},
  circuit: {},
  muhurat: {},
  travellers: {},
};

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      ...initialState,

      setTrip: (partial) =>
        set((state) => ({
          sankalp: { ...state.sankalp, ...partial.sankalp },
          circuit: { ...state.circuit, ...partial.circuit },
          muhurat: { ...state.muhurat, ...partial.muhurat },
          travellers: { ...state.travellers, ...partial.travellers },
        })),
      clearTrip: () => set(initialState),

      // Concierge — not persisted (session state only)
      concierge: DEFAULT_CONCIERGE,

      setConcierge: (partial) =>
        set((state) => ({ concierge: { ...state.concierge, ...partial } })),

      setPlanningMode: (on) =>
        set((state) => ({
          concierge: {
            ...state.concierge,
            planningMode: on,
            currentView: on ? 'intake' : state.concierge.currentView,
          },
        })),

      setIntake: (destination, fromCity, travelMonth, peopleCount) =>
        set((state) => ({
          concierge: {
            ...state.concierge,
            destination,
            fromCity,
            travelMonth,
            peopleCount,
            intakeComplete: true,
            currentView: 'categories',
          },
        })),

      setCurrentView: (view) =>
        set((state) => ({ concierge: { ...state.concierge, currentView: view } })),

      setFlightOptions: (flightOptions) =>
        set((state) => ({ concierge: { ...state.concierge, flightOptions } })),

      setTrainOptions: (trainOptions) =>
        set((state) => ({ concierge: { ...state.concierge, trainOptions } })),

      setHotelOptions: (hotelOptions) =>
        set((state) => ({ concierge: { ...state.concierge, hotelOptions } })),

      selectFlight: (selectedFlight) =>
        set((state) => ({ concierge: { ...state.concierge, selectedFlight } })),

      selectTrain: (selectedTrain) =>
        set((state) => ({ concierge: { ...state.concierge, selectedTrain } })),

      selectHotel: (selectedHotel) =>
        set((state) => ({ concierge: { ...state.concierge, selectedHotel } })),

      markCategoryComplete: (cat) =>
        set((state) => ({
          concierge: {
            ...state.concierge,
            completedCategories: state.concierge.completedCategories.includes(cat)
              ? state.concierge.completedCategories
              : [...state.concierge.completedCategories, cat],
            currentView: 'categories',
          },
        })),

      resetConcierge: () =>
        set((state) => ({ concierge: { ...DEFAULT_CONCIERGE, planningMode: state.concierge.planningMode } })),

      initiatePlanningSession: (yatra?: string, from?: string) =>
        set(() => ({
          concierge: {
            ...DEFAULT_CONCIERGE,
            prefillYatra: yatra ?? null,
            prefillFrom: from ?? null,
          },
        })),

      clearSession: () =>
        set(() => ({ concierge: { ...DEFAULT_CONCIERGE } })),
    }),
    {
      name: 'yaatri-planner',
      // Only persist the trip planner fields, not the concierge session state
      partialize: (state) => ({
        sankalp: state.sankalp,
        circuit: state.circuit,
        muhurat: state.muhurat,
        travellers: state.travellers,
      }),
    },
  ),
);
