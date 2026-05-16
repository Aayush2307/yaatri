'use client';

export type StayTier = 'basic' | 'better' | 'premium';

const TIERS: Array<{
  key: StayTier;
  label: string;
  price: string;
  desc: string;
  recommended?: boolean;
}> = [
  {
    key: 'basic',
    label: 'Basic',
    price: 'Under ₹1,500/night',
    desc: 'Dharamshalas & budget hotels',
  },
  {
    key: 'better',
    label: 'Better',
    price: '₹1,500–₹5,000/night',
    desc: 'Comfortable, near ghats',
    recommended: true,
  },
  {
    key: 'premium',
    label: 'Premium',
    price: '₹5,000+/night',
    desc: 'Heritage & luxury hotels',
  },
];

interface StayTierPickerProps {
  onSelect: (tier: StayTier) => void;
  onBack?: () => void;
}

export function StayTierPicker({ onSelect, onBack }: StayTierPickerProps) {
  return (
    <div className="px-4 py-4 space-y-3">
      <p className="font-serif italic text-[#2C1A0E] text-base">Which comfort level?</p>

      <div className="space-y-2">
        {TIERS.map(({ key, label, price, desc, recommended }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className="w-full rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 text-left hover:border-[#C85A1E] transition-all flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-serif italic text-[#2C1A0E] text-sm font-semibold">{label}</p>
                {recommended && (
                  <span className="text-[10px] font-semibold bg-[rgba(200,90,30,0.1)] text-[#C85A1E] px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[#C85A1E] mt-0.5">{price}</p>
              <p className="text-xs text-[#7A5C42] mt-0.5">{desc}</p>
            </div>
            <span className="text-[#C85A1E] text-lg shrink-0">›</span>
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
