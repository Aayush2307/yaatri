'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import BackButton from '@/components/BackButton';
import { BottomNav } from '@/components/layout/BottomNav';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { openMeeraWhatsApp } from '@/lib/whatsapp';

type TravelStyle = 'Budget' | 'Comfort' | 'Premium';

type YatraPlanDraft = {
  selectedCircuit?: string;
  selectedCircuitTitle?: string;
  sankalp: string[];
  sankalpNote?: string;
  startingCity?: string;
  travelDates?: string;
  travellers?: string;
  travellingWith: string[];
  comfortNeeds: string[];
  travelStyle?: TravelStyle;
  updatedAt: string;
};

const DRAFT_KEY = 'yaatri_plan_draft';
const LEGACY_YATRA_KEY = 'yaatra_yatra';

const sankalpOptions = ['Moksha', 'Shiva Darshan', 'Shakti', 'Pitru Shanti', 'Healing', 'Family Blessings', 'Peace', 'First Yatra'];
const travellingWithOptions = ['Parents', 'Children', 'Senior citizens', 'Couple', 'Solo', 'Group'];
const comfortNeedsOptions = ['Senior-friendly', 'Less walking', 'Wheelchair support', 'Satvik food', 'Premium stays', 'Budget-conscious', 'Flexible dates'];

const travelStyles: Array<{ title: TravelStyle; subtitle: string }> = [
  { title: 'Budget', subtitle: 'Simple, clean, practical' },
  { title: 'Comfort', subtitle: 'Good stays, smoother route' },
  { title: 'Premium', subtitle: 'Best available support and convenience' },
];

const defaultDraft: YatraPlanDraft = {
  sankalp: [],
  travellingWith: [],
  comfortNeeds: [],
  updatedAt: '',
};

export default function PlanPage() {
  const [draft, setDraft] = useState<YatraPlanDraft>(defaultDraft);

  useEffect(() => {
    const withYatraFromSelection = (base: YatraPlanDraft): YatraPlanDraft => {
      const yatraSource = localStorage.getItem(LEGACY_YATRA_KEY);
      if (!yatraSource) return base;
      try {
        const parsed = JSON.parse(yatraSource) as { selectedCircuit?: string; selectedCircuitTitle?: string };
        return {
          ...base,
          selectedCircuit: base.selectedCircuit || parsed.selectedCircuit,
          selectedCircuitTitle: base.selectedCircuitTitle || parsed.selectedCircuitTitle,
        };
      } catch {
        return base;
      }
    };

    const storedDraftRaw = localStorage.getItem(DRAFT_KEY);
    if (!storedDraftRaw) {
      setDraft(withYatraFromSelection(defaultDraft));
      return;
    }

    try {
      const storedDraft = JSON.parse(storedDraftRaw) as Partial<YatraPlanDraft>;
      const nextDraft: YatraPlanDraft = withYatraFromSelection({
        ...defaultDraft,
        ...storedDraft,
        sankalp: Array.isArray(storedDraft.sankalp) ? storedDraft.sankalp : [],
        travellingWith: Array.isArray(storedDraft.travellingWith) ? storedDraft.travellingWith : [],
        comfortNeeds: Array.isArray(storedDraft.comfortNeeds) ? storedDraft.comfortNeeds : [],
      });
      setDraft(nextDraft);
    } catch {
      setDraft(withYatraFromSelection(defaultDraft));
    }
  }, []);

  useEffect(() => {
    if (!draft.updatedAt) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const updateDraft = (updates: Partial<YatraPlanDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  const toggleMulti = (field: 'sankalp' | 'travellingWith' | 'comfortNeeds', value: string) => {
    const currentValues = draft[field];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    updateDraft({ [field]: nextValues } as Partial<YatraPlanDraft>);
  };

  const selectedYatraTitle = useMemo(() => draft.selectedCircuitTitle?.trim(), [draft.selectedCircuitTitle]);

  const handleContinue = async () => {
    const latestDraft = { ...draft, updatedAt: new Date().toISOString() };
    setDraft(latestDraft);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(latestDraft));

    const message = [
      'Namaste Meera, I want help planning my yatra.',
      '',
      `Selected Yatra: ${latestDraft.selectedCircuitTitle || 'Not selected yet'}`,
      `Sankalp: ${latestDraft.sankalp.join(', ') || 'Not shared yet'}`,
      `Sankalp note: ${latestDraft.sankalpNote?.trim() || 'Not shared yet'}`,
      `Starting city: ${latestDraft.startingCity?.trim() || 'Not shared yet'}`,
      `Preferred dates: ${latestDraft.travelDates?.trim() || 'Not shared yet'}`,
      `Travellers: ${latestDraft.travellers?.trim() || 'Not shared yet'}`,
      `Travelling with: ${latestDraft.travellingWith.join(', ') || 'Not shared yet'}`,
      `Comfort needs: ${latestDraft.comfortNeeds.join(', ') || 'Not shared yet'}`,
      `Travel style: ${latestDraft.travelStyle || 'Not shared yet'}`,
      '',
      'Please guide me with route, darshan timing, stays, vehicle planning, and family-friendly pacing.',
    ].join('\n');


    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('yatra_plan_requests').insert({
          selected_circuit: latestDraft.selectedCircuit || null,
          selected_circuit_title: latestDraft.selectedCircuitTitle || null,
          sankalp: latestDraft.sankalp,
          sankalp_note: latestDraft.sankalpNote || null,
          starting_city: latestDraft.startingCity || null,
          travel_dates: latestDraft.travelDates || null,
          travellers: latestDraft.travellers || null,
          travelling_with: latestDraft.travellingWith,
          comfort_needs: latestDraft.comfortNeeds,
          travel_style: latestDraft.travelStyle || null,
          created_at: new Date().toISOString(),
        });
      } catch {
        // keep WhatsApp handoff resilient even if sync fails
      }
    }

    openMeeraWhatsApp(message);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#F5F0E8] pb-44 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <BackButton />

        <section>
          <p className="text-xs uppercase tracking-[0.12em] text-[#8A7665]">Sankalp to Plan</p>
          <h1 className="pt-2 font-serif text-3xl leading-tight">Plan Your Yatra</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Share a few details so Meera can guide your route, darshan timing, stays, and family comfort.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-[#8A7665]">Selected Yatra Summary</p>
          {selectedYatraTitle ? (
            <>
              <p className="pt-2 text-sm text-[#8A7665]">Your selected path</p>
              <p className="pt-1 font-serif text-2xl leading-tight text-[#2B2119]">{selectedYatraTitle}</p>
              <p className="pt-2 text-sm text-[#8A7665]">Meera will use this as the starting point for your plan.</p>
            </>
          ) : (
            <>
              <p className="pt-2 text-lg font-medium text-[#2B2119]">No yatra selected yet</p>
              <p className="pt-1 text-sm text-[#8A7665]">You can still continue. Meera will help you choose the right sacred path.</p>
            </>
          )}
          <Link href="/explore" className="mt-3 inline-flex rounded-full border border-[rgba(43,33,25,0.15)] bg-[#FFF7E9] px-3 py-1.5 text-xs text-[#A45C22]">
            Choose a Yatra
          </Link>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">What is your sankalp?</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {sankalpOptions.map((option) => {
              const selected = draft.sankalp.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMulti('sankalp', option)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${selected ? 'border-[#C66A2B] bg-[#F8E3C8] text-[#8A4F1E]' : 'border-[rgba(43,33,25,0.12)] bg-white text-[#6F5946]'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <label className="mt-4 block text-sm text-[#6F5946]">
            Write your sankalp in your own words
            <textarea
              value={draft.sankalpNote || ''}
              onChange={(event) => updateDraft({ sankalpNote: event.target.value })}
              placeholder="E.g. I want to take my parents for peaceful darshan..."
              className="mt-2 min-h-24 w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF8] px-3 py-2 text-sm text-[#2B2119] outline-none focus:border-[#C66A2B]"
            />
          </label>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Travel Basics</h2>

          <label className="mt-3 block text-sm text-[#6F5946]">
            Where will you begin from?
            <input
              value={draft.startingCity || ''}
              onChange={(event) => updateDraft({ startingCity: event.target.value })}
              placeholder="E.g. Ahmedabad, Mumbai, Delhi"
              className="mt-2 h-11 w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF8] px-3 text-sm text-[#2B2119] outline-none focus:border-[#C66A2B]"
            />
          </label>

          <label className="mt-3 block text-sm text-[#6F5946]">
            When are you thinking of travelling?
            <input
              value={draft.travelDates || ''}
              onChange={(event) => updateDraft({ travelDates: event.target.value })}
              placeholder="E.g. May 2026 or flexible"
              className="mt-2 h-11 w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF8] px-3 text-sm text-[#2B2119] outline-none focus:border-[#C66A2B]"
            />
          </label>

          <label className="mt-3 block text-sm text-[#6F5946]">
            How many people are travelling?
            <input
              value={draft.travellers || ''}
              onChange={(event) => updateDraft({ travellers: event.target.value })}
              placeholder="E.g. 4"
              className="mt-2 h-11 w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF8] px-3 text-sm text-[#2B2119] outline-none focus:border-[#C66A2B]"
            />
          </label>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Family & Comfort</h2>
          <p className="mt-3 text-sm text-[#6F5946]">Travelling with</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {travellingWithOptions.map((option) => {
              const selected = draft.travellingWith.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMulti('travellingWith', option)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${selected ? 'border-[#C66A2B] bg-[#F8E3C8] text-[#8A4F1E]' : 'border-[rgba(43,33,25,0.12)] bg-white text-[#6F5946]'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-[#6F5946]">Comfort needs</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {comfortNeedsOptions.map((option) => {
              const selected = draft.comfortNeeds.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMulti('comfortNeeds', option)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${selected ? 'border-[#C66A2B] bg-[#F8E3C8] text-[#8A4F1E]' : 'border-[rgba(43,33,25,0.12)] bg-white text-[#6F5946]'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Travel Style</h2>
          <div className="mt-3 space-y-2">
            {travelStyles.map((style) => {
              const selected = draft.travelStyle === style.title;
              return (
                <button
                  key={style.title}
                  type="button"
                  onClick={() => updateDraft({ travelStyle: style.title })}
                  className={`w-full rounded-xl border p-3 text-left transition ${selected ? 'border-[#C66A2B] bg-[#F8E3C8]' : 'border-[rgba(43,33,25,0.12)] bg-white'}`}
                >
                  <p className="text-sm font-medium text-[#2B2119]">{style.title}</p>
                  <p className="pt-1 text-xs text-[#8A7665]">{style.subtitle}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFF7E9] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Meera can help with</h2>
          <ul className="mt-3 space-y-1 text-sm text-[#6F5946]">
            <li>• Route sequencing</li>
            <li>• Darshan timing</li>
            <li>• Stay options</li>
            <li>• Vehicle planning</li>
            <li>• Senior-friendly pacing</li>
            <li>• Food preferences</li>
          </ul>
        </section>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-[rgba(43,33,25,0.15)] bg-[#FFFCF7] p-3 shadow-md">
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE]"
          >
            Continue with Meera
          </button>
          <p className="pt-2 text-center text-xs leading-relaxed text-[#8A7665]">Your details will be shared as a WhatsApp message.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="plan" /></div>
    </main>
  );
}
