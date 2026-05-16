'use client';

export type PlanCategory = 'travel' | 'stay' | 'activities' | 'puja';

const CATEGORIES: Array<{
  key: PlanCategory;
  icon: string;
  title: string;
  subtitle: string;
}> = [
  { key: 'travel', icon: '✈️', title: 'Travel', subtitle: 'Flights & trains' },
  { key: 'stay', icon: '🏨', title: 'Stay', subtitle: 'Hotels & dharamshalas' },
  { key: 'activities', icon: '🎯', title: 'Activities', subtitle: 'Sightseeing & rituals' },
  { key: 'puja', icon: '🙏', title: 'Puja', subtitle: 'Bookings & muhurat' },
];

interface CategoryPickerProps {
  completedCategories?: Set<PlanCategory>;
  onSelect: (category: PlanCategory) => void;
  onSendPlan?: () => void;
  destination?: string | null;
  fromCity?: string | null;
  travelMonth?: string | null;
  peopleCount?: number;
}

export function CategoryPicker({
  completedCategories = new Set(),
  onSelect,
  onSendPlan,
  destination,
  fromCity,
  travelMonth,
  peopleCount,
}: CategoryPickerProps) {
  const hasAny = completedCategories.size > 0;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Meera confirmation summary */}
      {destination && fromCity && travelMonth && (
        <div
          className="rounded-[14px] px-4 py-3 border-l-[3px] border-[#C85A1E]"
          style={{ background: 'rgba(251, 245, 232, 0.82)' }}
        >
          <p className="font-sans text-sm text-[#2C1A0E] leading-relaxed">
            <span className="font-semibold">
              {fromCity} → {destination}
            </span>
            , {travelMonth}
            {peopleCount ? `, ${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}` : ''}.
            What shall we sort first?
          </p>
        </div>
      )}

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(({ key, icon, title, subtitle }) => {
          const done = completedCategories.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => !done && onSelect(key)}
              className={`rounded-[14px] border p-4 text-left transition-all ${
                done
                  ? 'border-[#C85A1E] bg-[rgba(200,90,30,0.06)] cursor-default'
                  : 'border-[rgba(242,201,126,0.5)] bg-white hover:border-[#C85A1E]'
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <p className={`font-serif italic text-sm mt-1 ${done ? 'text-[#C85A1E]' : 'text-[#2C1A0E]'}`}>
                {title}
              </p>
              <p className="text-xs text-[#7A5C42] mt-0.5">
                {done ? '✓ Added to plan' : subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* WhatsApp send button — appears once at least one category is done */}
      {hasAny && onSendPlan && (
        <button
          type="button"
          onClick={onSendPlan}
          className="w-full h-11 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'rgba(37, 211, 102, 0.9)', boxShadow: '0 2px 8px rgba(37,211,102,0.35)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Send plan to Meera on WhatsApp
        </button>
      )}
    </div>
  );
}
