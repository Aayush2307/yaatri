'use client';

import { useState } from 'react';

const DESTINATIONS = [
  'Varanasi', 'Tirupati', 'Kedarnath', 'Vrindavan',
  'Haridwar', 'Puri', 'Shirdi', 'Amritsar',
];

const CITIES = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad',
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow',
];

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

interface Prefill {
  destination?: string | null;
  fromCity?: string | null;
  travelMonth?: string | null;
}

interface QuickIntakeProps {
  prefill?: Prefill;
  onComplete: (destination: string, fromCity: string, month: string, people: number) => void;
}

export function QuickIntake({ prefill, onComplete }: QuickIntakeProps) {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState(prefill?.destination ?? '');
  const [fromCity, setFromCity] = useState(prefill?.fromCity ?? '');
  const [month, setMonth] = useState(prefill?.travelMonth ?? '');
  const [people, setPeople] = useState(2);

  const chipClass =
    'px-4 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer select-none';
  const activeChip = 'bg-[#C85A1E] border-[#C85A1E] text-[#FBF5E8]';
  const idleChip = 'bg-white border-[rgba(242,201,126,0.5)] text-[#2C1A0E] hover:border-[#C85A1E]';

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Step 0 — Destination */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="font-serif italic text-[#2C1A0E] text-base">Where are you headed?</p>
          <div className="flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => (
              <button
                key={d}
                type="button"
                className={`${chipClass} ${destination === d ? activeChip : idleChip}`}
                onClick={() => {
                  setDestination(d);
                  setStep(1);
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — From city */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="font-serif italic text-[#2C1A0E] text-base">Travelling from?</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`${chipClass} ${fromCity === c ? activeChip : idleChip}`}
                onClick={() => {
                  setFromCity(c);
                  setStep(2);
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(0)} className="text-xs text-[#7A5C42] underline">
            ← Back
          </button>
        </div>
      )}

      {/* Step 2 — Month */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="font-serif italic text-[#2C1A0E] text-base">When?</p>
          <div className="grid grid-cols-4 gap-2">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                className={`${chipClass} text-center ${month === m ? activeChip : idleChip}`}
                onClick={() => {
                  setMonth(m);
                  setStep(3);
                }}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(1)} className="text-xs text-[#7A5C42] underline">
            ← Back
          </button>
        </div>
      )}

      {/* Step 3 — People count */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="font-serif italic text-[#2C1A0E] text-base">How many people?</p>
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full border border-[rgba(242,201,126,0.5)] bg-white text-[#C85A1E] text-xl font-bold flex items-center justify-center hover:bg-[#FBF5E8]"
            >
              −
            </button>
            <span className="text-2xl font-semibold text-[#2C1A0E] w-8 text-center">{people}</span>
            <button
              type="button"
              onClick={() => setPeople((p) => p + 1)}
              className="w-10 h-10 rounded-full border border-[rgba(242,201,126,0.5)] bg-white text-[#C85A1E] text-xl font-bold flex items-center justify-center hover:bg-[#FBF5E8]"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => onComplete(destination, fromCity, month, people)}
            className="w-full h-11 rounded-full bg-[#C85A1E] text-[#FBF5E8] font-semibold text-sm"
            style={{ boxShadow: '0 2px 8px rgba(200, 90, 30, 0.4)' }}
          >
            Continue →
          </button>
          <button type="button" onClick={() => setStep(2)} className="block mx-auto text-xs text-[#7A5C42] underline">
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
