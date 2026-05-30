'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GettingThereSection } from '@/components/itinerary/GettingThereSection';
import { StayOptions } from '@/components/itinerary/StayOptions';
import { getTravelOptions } from '@/data/travelOptions';
import type { DestinationTravelInfo, StayOption } from '@/data/travelOptions';

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  highlights: string[];
  location?: string;
}

interface ItineraryData {
  title: string;
  destinationSlug: string;
  totalDays: number;
  totalNights: number;
  packageCostINR?: number;
  travelStyle?: 'Budget' | 'Comfort' | 'Premium';
  days: ItineraryDay[];
  auspiciousOccasion?: string;
}

const FALLBACK_ITINERARY: ItineraryData = {
  title: 'Char Dham Yatra — Sawan 2026',
  destinationSlug: 'char_dham',
  totalDays: 9,
  totalNights: 8,
  packageCostINR: 35000,
  travelStyle: 'Comfort',
  auspiciousOccasion: 'Sawan',
  days: [
    {
      dayNumber: 1,
      title: 'Arrival & First Blessings',
      description: 'Arrive in Dehradun and make your way to Haridwar. Check in to your accommodation and attend the magnificent Ganga Aarti at Har ki Pauri.',
      highlights: ['Brahma Muhurta darshan at Badrinath', 'Har ki Pauri Ganga Aarti'],
      location: 'Haridwar',
    },
    {
      dayNumber: 2,
      title: 'Badrinath Darshan',
      description: 'Scenic drive to Badrinath through the Chamoli district. Seek blessings at the ancient Vishnu temple and attend evening aarti.',
      highlights: ['Sawan Somvar', 'Tapt Kund holy dip'],
      location: 'Badrinath',
    },
    {
      dayNumber: 3,
      title: 'Rudraprayag & Devprayag',
      description: 'Visit the confluence of the Alaknanda and Mandakini rivers at Rudraprayag, then proceed to the sacred Devprayag sangam.',
      highlights: ['Guru Purnima', 'Panch Prayag confluence'],
      location: 'Rudraprayag',
    },
    {
      dayNumber: 4,
      title: 'Kedarnath Darshan',
      description: 'Trek or take the helicopter to Kedarnath. Seek blessings at the ancient Jyotirlinga temple and witness the sacred evening aarti.',
      highlights: ['Kedarnath Jyotirlinga darshan', 'Evening aarti'],
      location: 'Kedarnath',
    },
    {
      dayNumber: 5,
      title: 'Yamunotri Pilgrimage',
      description: 'Travel to the source of the sacred Yamuna river at Yamunotri. A 6 km trek through pristine Himalayan forests leads to the temple.',
      highlights: ['Yamuna source darshan', 'Divya Shila puja'],
      location: 'Yamunotri',
    },
  ],
};

function getRegionalFallback(slug: string): string {
  if (['tirupati', 'sabarimala', 'rameshwaram'].includes(slug)) return 'Chennai';
  if (['puri'].includes(slug)) return 'Kolkata';
  if (['shirdi'].includes(slug)) return 'Mumbai';
  return 'Delhi';
}

function parseFirstPrice(priceRange: string): number {
  const match = priceRange.replace(/[₹,]/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function computeBudget(
  travelInfo: DestinationTravelInfo,
  style: string,
  nights: number,
  packageCost?: number,
) {
  const tierIndex = style === 'Budget' ? 0 : style === 'Comfort' ? 1 : 2;
  const trainCost = travelInfo.trainOptions[0]?.priceFromINR ?? 0;
  const stayOption = travelInfo.stayOptionsPerNight[Math.min(tierIndex, travelInfo.stayOptionsPerNight.length - 1)];
  const totalStay = parseFirstPrice(stayOption?.priceRange ?? '0') * nights;

  const items = [
    { label: 'Train (return estimate)', amount: trainCost * 2, note: travelInfo.trainOptions[0]?.name },
    { label: `Stay (${nights} nights)`, amount: totalStay, note: `${stayOption?.tier ?? ''} tier` },
    { label: 'Puja & offerings', amount: 2000 },
    { label: 'Food & local transport', amount: 1500 * nights },
  ] as { label: string; amount: number; note?: string }[];

  if (['kedarnath', 'char_dham'].includes(travelInfo.destinationSlug)) {
    items.push({ label: 'Helicopter (Kedarnath)', amount: 7000, note: 'Return · optional' });
  }

  const total = items.reduce((s, i) => s + i.amount, 0) + (packageCost ?? 0);
  return { items, total };
}

export default function ItineraryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<ItineraryData>(FALLBACK_ITINERARY);
  const [originCity, setOriginCity] = useState<string | undefined>();
  const [showAllDays, setShowAllDays] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`yaatri_itinerary_${params.id}`);
      if (raw) {
        const parsed = JSON.parse(raw) as ItineraryData;
        setItinerary(parsed);
      }
    } catch {
      // use fallback
    }
  }, [params.id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yaatri_plan_draft');
      if (raw) {
        const draft = JSON.parse(raw) as { startingCity?: string };
        if (draft.startingCity) setOriginCity(draft.startingCity);
      }
    } catch {
      // ignore
    }
  }, []);

  const slug = (itinerary.destinationSlug || '').toLowerCase().trim();
  const travelInfo = getTravelOptions(slug);
  const budget = travelInfo
    ? computeBudget(travelInfo, itinerary.travelStyle ?? 'Budget', itinerary.totalNights, itinerary.packageCostINR)
    : null;

  const visibleDays = showAllDays ? itinerary.days : itinerary.days.slice(0, 3);
  const hasMoreDays = itinerary.days.length > 3;

  const whatsappLink = `https://wa.me/918153026157?text=${encodeURIComponent(`Namaste, I want to book the ${itinerary.title} trip.`)}`;

  return (
    <main style={{ backgroundColor: '#1E0D04', minHeight: '100dvh', paddingBottom: 48 }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 0' }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#C4862A', fontSize: 12, cursor: 'pointer', marginBottom: 20, padding: 0 }}
        >
          <ChevronLeftIcon /> Concierge
        </button>
        <p style={{ fontSize: 15, color: '#C4862A', margin: '0 0 4px' }}>ॐ</p>
        <h1 style={{ fontFamily: "Georgia,'Times New Roman',serif", fontSize: 24, fontWeight: 400, color: '#F5C842', margin: '0 0 4px', lineHeight: 1.2 }}>
          {itinerary.title}
        </h1>
        <p style={{ fontSize: 11, color: '#7A4A1E', letterSpacing: '0.06em', margin: '0 0 4px' }}>
          {itinerary.totalDays} DAYS · {itinerary.totalNights} NIGHTS
        </p>
        {originCity && (
          <p style={{ fontSize: 11, color: '#C4862A', margin: '0 0 16px' }}>
            Travelling from <span style={{ color: '#F5A623' }}>{originCity}</span>
          </p>
        )}
        <div style={{ height: '0.5px', background: 'rgba(196,134,42,0.25)', marginTop: originCity ? 0 : 16 }} />
      </div>

      {/* ── Getting There ──────────────────────────────────────────────── */}
      <>
        <div style={{ padding: '16px 16px 0' }}>
          <SectionLabel>Getting There</SectionLabel>
          {travelInfo ? (
            <GettingThereSection travelInfo={travelInfo} originCity={originCity ?? getRegionalFallback(slug)} />
          ) : (
            <div style={{ paddingBottom: 8 }}>
              <p style={{ fontSize: 12, color: '#C4862A', margin: '0 0 10px', lineHeight: 1.5 }}>
                Find trains, flights and stays for your journey.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href="https://www.irctc.co.in/nget/train-search"
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#F5A623', border: '0.5px solid rgba(196,134,42,0.4)', borderRadius: 8, padding: '6px 12px', textDecoration: 'none' }}
                >
                  🚂 Search Trains (IRCTC)
                </a>
                <a
                  href="https://www.makemytrip.com/flights/"
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#F5A623', border: '0.5px solid rgba(196,134,42,0.4)', borderRadius: 8, padding: '6px 12px', textDecoration: 'none' }}
                >
                  ✈️ Search Flights
                </a>
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(itinerary.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#F5A623', border: '0.5px solid rgba(196,134,42,0.4)', borderRadius: 8, padding: '6px 12px', textDecoration: 'none' }}
                >
                  🏨 Find Stays
                </a>
              </div>
            </div>
          )}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(196,134,42,0.25)', margin: '16px 0 0' }} />
      </>

      {/* ── Budget ─────────────────────────────────────────────────────── */}
      {budget && (
        <>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <p style={{ fontSize: 10, color: '#7A4A1E', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                Estimated Budget
              </p>
              <p style={{ fontFamily: "Georgia,serif", fontSize: 18, color: '#F5A623', margin: 0 }}>
                ₹{budget.total.toLocaleString('en-IN')}
              </p>
            </div>
            {itinerary.packageCostINR && (
              <BudgetRow label="Package cost" amount={itinerary.packageCostINR} />
            )}
            {budget.items.map((item, i) => (
              <BudgetRow key={i} label={item.label} amount={item.amount} note={item.note} />
            ))}
            <p style={{ fontSize: 10, color: '#7A4A1E', marginTop: 8, lineHeight: 1.4 }}>
              * Estimates only. Actual costs vary by date, group size and availability.
            </p>
          </div>
          <div style={{ height: '0.5px', background: 'rgba(196,134,42,0.25)' }} />
        </>
      )}

      {/* ── Day by day ─────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 0' }}>
        <SectionLabel>Day by Day</SectionLabel>
        {visibleDays.map((day) => (
          <DayRow
            key={day.dayNumber}
            day={day}
            stayOptions={travelInfo?.stayOptionsPerNight ?? []}
          />
        ))}
        {hasMoreDays && !showAllDays && (
          <button
            type="button"
            onClick={() => setShowAllDays(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#C4862A',
              fontSize: 12,
              cursor: 'pointer',
              padding: '12px 0',
              display: 'block',
            }}
          >
            Show all {itinerary.days.length} days ↓
          </button>
        )}
      </div>

      <div style={{ height: '0.5px', background: 'rgba(196,134,42,0.25)', margin: '16px 0 0' }} />

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px 0' }}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: 13,
            background: '#C85A1E',
            borderRadius: 12,
            fontSize: 13,
            color: '#FFF5E4',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Book via WhatsApp →
        </a>
      </div>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, color: '#7A4A1E', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
      {children}
    </p>
  );
}

function BudgetRow({ label, amount, note }: { label: string; amount: number; note?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(196,134,42,0.1)' }}>
      <div>
        <p style={{ fontSize: 12, color: '#A07030', margin: 0 }}>{label}</p>
        {note && <p style={{ fontSize: 10, color: '#6B4820', margin: '1px 0 0' }}>{note}</p>}
      </div>
      <p style={{ fontSize: 12, color: '#F5C842', fontWeight: 500, margin: 0 }}>₹{amount.toLocaleString('en-IN')}</p>
    </div>
  );
}

function DayRow({ day, stayOptions }: { day: ItineraryDay; stayOptions: StayOption[] }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '0.5px solid rgba(196,134,42,0.12)', display: 'flex', gap: 12 }}>
      <span style={{ fontSize: 10, color: '#7A4A1E', minWidth: 28, paddingTop: 3, flexShrink: 0 }}>
        Day {day.dayNumber}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 14, fontWeight: 500, color: '#F5C842', margin: '0 0 4px' }}>
          {day.title}
        </p>
        <p style={{ fontSize: 12, color: '#C4862A', lineHeight: 1.55, margin: '0 0 8px' }}>
          {day.description}
        </p>
        {day.highlights.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: stayOptions.length > 0 ? 8 : 0 }}>
            {day.highlights.map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  color: '#F5A623',
                  background: 'rgba(196,134,42,0.12)',
                  borderRadius: 20,
                  padding: '3px 8px',
                }}
              >
                🪔 {h}
              </span>
            ))}
          </div>
        )}
        {stayOptions.length > 0 && (
          <StayOptions stayOptions={stayOptions} dayLocation={day.location} />
        )}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18L9 12L15 6" />
    </svg>
  );
}
