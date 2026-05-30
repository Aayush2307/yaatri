'use client';

import type { TrainOption } from '@/services/trains';

interface TrainOptionsProps {
  options: TrainOption[];
  onSelect: (train: TrainOption, cls: string) => void;
  onBack?: () => void;
  loading?: boolean;
}

const PRIORITY_CLASSES = ['SL', '3A', '2A', '1A'];

export function TrainOptions({ options, onSelect, onBack, loading }: TrainOptionsProps) {
  if (loading) {
    return (
      <div className="px-4 py-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 rounded-full bg-[#C85A1E] animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-[#7A5C42]">Fetching train schedules…</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="font-serif italic text-[#2C1A0E] text-base">Available trains</p>

      {options.length === 0 && (
        <div className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 text-center">
          <p className="text-sm text-[#7A5C42]">No trains found for this route.</p>
          <a
            href="https://www.irctc.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#C85A1E] underline font-medium mt-1 inline-block"
          >
            Search on IRCTC ↗
          </a>
        </div>
      )}

      <div className="space-y-3">
        {options.map((t, idx) => {
          const displayClasses = PRIORITY_CLASSES.filter((c) => t.availableClasses.includes(c));

          return (
            <div
              key={t.trainNumber || idx}
              className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 space-y-3"
            >
              {/* Train name + number */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-serif italic text-[#2C1A0E] text-sm font-semibold">{t.trainName}</p>
                  {t.trainNumber && (
                    <p className="text-xs text-[#7A5C42]">#{t.trainNumber}</p>
                  )}
                </div>
                {idx === 0 && (
                  <span className="text-[10px] font-semibold bg-[rgba(200,90,30,0.1)] text-[#C85A1E] px-2 py-0.5 rounded-full shrink-0">
                    Fastest
                  </span>
                )}
              </div>

              {/* Time bar */}
              {t.departure && t.arrival && (
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[#2C1A0E]">{t.departure}</span>
                  <div className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full h-px bg-[rgba(242,201,126,0.6)]" />
                    {t.durationHours && (
                      <p className="text-[10px] text-[#7A5C42]">{t.durationHours}</p>
                    )}
                  </div>
                  <span className="text-base font-semibold text-[#2C1A0E]">{t.arrival}</span>
                </div>
              )}

              {/* Class fare buttons */}
              <div className="flex flex-wrap gap-2">
                {displayClasses.length > 0
                  ? displayClasses.slice(0, 3).map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => onSelect(t, cls)}
                        className="px-3 h-9 rounded-full border border-[#C85A1E] text-[#C85A1E] text-xs font-semibold hover:bg-[#C85A1E] hover:text-[#FBF5E8] transition-colors"
                      >
                        {cls}{' '}
                        {t.approxFares[cls]
                          ? `₹${t.approxFares[cls].toLocaleString('en-IN')}`
                          : ''}
                      </button>
                    ))
                  : (
                    <button
                      type="button"
                      onClick={() => onSelect(t, 'SL')}
                      className="px-3 h-9 rounded-full border border-[#C85A1E] text-[#C85A1E] text-xs font-semibold"
                    >
                      Select
                    </button>
                  )}
                <a
                  href={t.irctcBookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 h-9 rounded-full border border-[rgba(242,201,126,0.5)] text-[#7A5C42] text-xs font-medium hover:border-[#C85A1E] transition-colors flex items-center"
                >
                  IRCTC ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {onBack && (
        <button type="button" onClick={onBack} className="text-xs text-[#7A5C42] underline">
          ← Different mode
        </button>
      )}
    </div>
  );
}
