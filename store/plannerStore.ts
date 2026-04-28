import { create } from 'zustand';

type PlannerState = {
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
};

const initialState = {
  sankalp: {},
  circuit: {},
  muhurat: {},
  travellers: {},
};

export const usePlannerStore = create<PlannerState>((set) => ({
  ...initialState,
  setTrip: (partial) =>
    set((state) => ({
      sankalp: { ...state.sankalp, ...partial.sankalp },
      circuit: { ...state.circuit, ...partial.circuit },
      muhurat: { ...state.muhurat, ...partial.muhurat },
      travellers: { ...state.travellers, ...partial.travellers },
    })),
  clearTrip: () => set(initialState),
}));
