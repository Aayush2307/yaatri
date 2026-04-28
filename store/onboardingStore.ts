import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Intention = {
  key: string;
  label: string;
};

type Profile = {
  name: string;
  phone: string;
  groupSize: number;
  hasSenior: boolean;
  mobilityNeeds: string[];
  dietaryPrefs: string[];
};

type OnboardingState = {
  intention: Intention | null;
  profile: Profile | null;
  language: 'en' | 'hi' | 'bilingual' | null;
  setIntention: (intention: Intention) => void;
  setProfile: (profile: Profile) => void;
  setLanguage: (language: 'en' | 'hi' | 'bilingual') => void;
  reset: () => void;
};

const initialState = {
  intention: null,
  profile: null,
  language: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setIntention: (intention) => set({ intention }),
      setProfile: (profile) => set({ profile }),
      setLanguage: (language) => set({ language }),
      reset: () => set(initialState),
    }),
    {
      name: 'yaatri-onboarding',
    },
  ),
);
