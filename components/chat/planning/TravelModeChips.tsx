'use client';

export type TravelMode = 'flights' | 'trains' | 'road';

const MODES: Array<{
  key: TravelMode;
  icon: string;
  label: string;
  time: string;
  desc: string;
}> = [
  { key: 'flights', icon: '✈️', label: 'Fly', time: '~1.5–2h', desc: 'Fastest option' },
  { key: 'trains', icon: '🚂', label: 'Train', time: '~11–18h', desc: 'Budget-friendly' },
  { key: 'road', icon: '🚌', label: 'Road', time: 'Varies', desc: 'Bus & cab options' },
];

interface TravelModeChipsProps {
  onSelect: (mode: TravelMode) => void;
  onBack?: () => void;
}

export function TravelModeChips({ onSelect, onBack }: TravelModeChipsProps) {
  return (
    <div className="px-4 py-4 space-y-3">
      <p className="font-serif italic text-[#2C1A0E] text-base">How would you like to go?</p>

      <div className="flex gap-3">
        {MODES.map(({ key, icon, label, time, desc }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className="flex-1 rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-3 text-center hover:border-[#C85A1E] transition-all"
          >
            <span className="text-2xl">{icon}</span>
            <p className="font-serif italic text-sm text-[#2C1A0E] mt-1">{label}</p>
            <p className="text-xs font-semibold text-[#C85A1E] mt-0.5">{time}</p>
            <p className="text-[11px] text-[#7A5C42] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      {onBack && (
        <button type="button" onClick={onBack} className="text-xs text-[#7A5C42] underline">
          ← Back to categories
        </button>
      )}
    </div>
  );
}
