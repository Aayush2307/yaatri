'use client';

import type { HotelOption } from '@/services/hotels';

interface HotelOptionsProps {
  options: HotelOption[];
  onSelect: (hotel: HotelOption) => void;
  onBack?: () => void;
  loading?: boolean;
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-[#C85A1E] text-xs">
      {'★'.repeat(Math.min(count, 5))}{'☆'.repeat(Math.max(0, 5 - count))}
    </span>
  );
}

export function HotelOptions({ options, onSelect, onBack, loading }: HotelOptionsProps) {
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
        <p className="text-sm text-[#7A5C42]">Finding hotels…</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="font-serif italic text-[#2C1A0E] text-base">Hotels for your stay</p>

      {options.length === 0 && (
        <div className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 text-center">
          <p className="text-sm text-[#7A5C42]">No hotels found for this filter.</p>
          <a
            href="https://www.booking.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#C85A1E] underline font-medium mt-1 inline-block"
          >
            Search on Booking.com ↗
          </a>
        </div>
      )}

      <div className="space-y-3">
        {options.map((h, idx) => (
          <div
            key={h.hotelId || idx}
            className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 space-y-2"
          >
            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-serif italic text-[#2C1A0E] text-sm font-semibold leading-snug">
                {h.name}
              </p>
              {idx === 0 && (
                <span className="text-[10px] font-semibold bg-[rgba(200,90,30,0.1)] text-[#C85A1E] px-2 py-0.5 rounded-full shrink-0">
                  Top pick
                </span>
              )}
            </div>

            {/* Stars + review */}
            <div className="flex items-center gap-3">
              {h.stars > 0 && <StarRating count={h.stars} />}
              {h.reviewScore > 0 && (
                <span className="text-xs text-[#7A5C42]">
                  {h.reviewScore.toFixed(1)}/10
                  {h.reviewCount > 0 && ` (${h.reviewCount.toLocaleString('en-IN')} reviews)`}
                </span>
              )}
            </div>

            {/* Highlights */}
            {h.highlights && (
              <p className="text-xs text-[#7A5C42] italic">{h.highlights}</p>
            )}

            {/* Price + actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {h.pricePerNightINR > 0 && (
                <p className="text-base font-bold text-[#2C1A0E]">
                  ₹{h.pricePerNightINR.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-[#7A5C42] ml-1">/night</span>
                </p>
              )}
              <div className="flex gap-2 ml-auto">
                <a
                  href={h.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C85A1E] underline font-medium"
                >
                  Booking.com ↗
                </a>
                <button
                  type="button"
                  onClick={() => onSelect(h)}
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
          ← Different tier
        </button>
      )}
    </div>
  );
}
