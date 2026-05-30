'use client';

import type { FlightOption } from '@/services/flights';

interface FlightOptionsProps {
  options: FlightOption[];
  onSelect: (flight: FlightOption) => void;
  onBack?: () => void;
  loading?: boolean;
}

function fmtDuration(minutes: number) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function FlightOptions({ options, onSelect, onBack, loading }: FlightOptionsProps) {
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
        <p className="text-sm text-[#7A5C42]">Searching flights…</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="font-serif italic text-[#2C1A0E] text-base">Available flights</p>

      {options.length === 0 && (
        <p className="text-sm text-[#7A5C42] text-center py-4">No flights found. Try MakeMyTrip.</p>
      )}

      <div className="space-y-3">
        {options.map((f) => (
          <div
            key={f.id}
            className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 space-y-3"
          >
            {/* Airline + flight number */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif italic text-[#2C1A0E] text-sm font-semibold">{f.airline}</p>
                {f.flightNumber && (
                  <p className="text-xs text-[#7A5C42]">#{f.flightNumber}</p>
                )}
              </div>
              {f.stops === 0 && (
                <span className="text-[10px] font-semibold bg-[rgba(200,90,30,0.1)] text-[#C85A1E] px-2 py-0.5 rounded-full">
                  Non-stop
                </span>
              )}
            </div>

            {/* Time bar */}
            {f.departure && f.arrival && (
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-[#2C1A0E]">{f.departure}</span>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full h-px bg-[rgba(242,201,126,0.6)]" />
                  <p className="text-[10px] text-[#7A5C42]">{fmtDuration(f.durationMinutes)}</p>
                </div>
                <span className="text-base font-semibold text-[#2C1A0E]">{f.arrival}</span>
              </div>
            )}

            {/* Price + actions */}
            <div className="flex items-center justify-between gap-2">
              {f.priceINR > 0 ? (
                <p className="text-lg font-bold text-[#2C1A0E]">
                  ₹{f.priceINR.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-[#7A5C42] ml-1">/ person</span>
                </p>
              ) : null}
              <div className="flex gap-2 ml-auto">
                <a
                  href={f.bookingDeeplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C85A1E] underline font-medium"
                >
                  MakeMyTrip ↗
                </a>
                <button
                  type="button"
                  onClick={() => onSelect(f)}
                  className="px-4 h-8 rounded-full bg-[#C85A1E] text-[#FBF5E8] text-xs font-semibold"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {onBack && (
        <button type="button" onClick={onBack} className="text-xs text-[#7A5C42] underline">
          ← Different mode
        </button>
      )}
    </div>
  );
}
