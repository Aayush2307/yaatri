'use client';

import { GettingThereSection } from '@/components/itinerary/GettingThereSection';
import { getTravelOptions } from '@/data/travelOptions';
import type { GeneratedItinerary, BudgetTier } from '@/types/yatra';

// ─── Dark palette (matches itinerary page) ────────────────────────────────────

const P = {
  bg: '#1E0D04',
  gold: '#F5C842',
  amber: '#F5A623',
  brown: '#C4862A',
  muted: '#7A4A1E',
  surface: 'rgba(196,134,42,0.10)',
  divider: 'rgba(196,134,42,0.20)',
  rowDivider: 'rgba(196,134,42,0.10)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(dest: string): string {
  const d = dest.toLowerCase();
  if (d.includes('char dham') || d.includes('char-dham')) return 'char_dham';
  if (d.includes('kedarnath')) return 'kedarnath';
  if (d.includes('badrinath')) return 'badrinath';
  if (d.includes('varanasi') || d.includes('kashi')) return 'varanasi';
  if (d.includes('tirupati')) return 'tirupati';
  if (d.includes('shirdi')) return 'shirdi';
  if (d.includes('vrindavan')) return 'vrindavan';
  if (d.includes('mathura')) return 'mathura';
  if (d.includes('puri') || d.includes('jagannath')) return 'puri';
  if (d.includes('amritsar') || d.includes('golden temple')) return 'amritsar';
  if (d.includes('sabarimala') || d.includes('ayyappa')) return 'sabarimala';
  if (d.includes('amarnath')) return 'amarnath';
  if (d.includes('vaishno') || d.includes('vaishnodevi')) return 'vaishnodevi';
  if (d.includes('rameshwaram') || d.includes('rameswaram')) return 'rameshwaram';
  return d.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function getRegionalFallback(slug: string): string {
  if (['tirupati', 'sabarimala', 'rameshwaram'].includes(slug)) return 'Chennai';
  if (['puri'].includes(slug)) return 'Kolkata';
  if (['shirdi'].includes(slug)) return 'Mumbai';
  return 'Delhi';
}

function extractCount(duration: string, unit: 'Days?' | 'Nights?'): number {
  const m = duration.match(new RegExp(`(\\d+)\\s*${unit}`, 'i'));
  return m ? parseInt(m[1], 10) : 0;
}

function parseFirstAmount(range: string): number {
  const m = range.replace(/[₹,]/g, '').match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function truncate(text: string, words: number): string {
  const parts = text.split(' ');
  return parts.length <= words ? text : parts.slice(0, words).join(' ') + '…';
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  itinerary: GeneratedItinerary;
  fromCity?: string;
  travelMonth?: string;
  groupSize?: number;
  budgetTier?: BudgetTier;
}

export function MeeraItineraryCard({ itinerary, fromCity, travelMonth, groupSize, budgetTier }: Props) {
  const slug = toSlug(itinerary.destination);
  const travelInfo = getTravelOptions(slug);
  const nights = extractCount(itinerary.duration, 'Nights?') || Math.max(0, itinerary.days.length - 1);
  const days = extractCount(itinerary.duration, 'Days?') || itinerary.days.length;
  const resolvedCity = fromCity || getRegionalFallback(slug);

  // Budget line-items (only when static travel data available)
  const budgetItems: { label: string; amount: number }[] = [];
  let budgetTotal = 0;

  if (travelInfo) {
    const tierIdx = budgetTier === 'basic' ? 0 : budgetTier === 'premium' ? 2 : 1;
    const trainCost = travelInfo.trainOptions[0]?.priceFromINR ?? 0;
    const stayOpt = travelInfo.stayOptionsPerNight[Math.min(tierIdx, travelInfo.stayOptionsPerNight.length - 1)];
    const n = Math.max(nights, 1);
    const stayTotal = parseFirstAmount(stayOpt?.priceRange ?? '0') * n;

    budgetItems.push(
      { label: 'Train (return est.)', amount: trainCost * 2 },
      { label: `Stay · ${n}N (${stayOpt?.tier ?? 'standard'})`, amount: stayTotal },
      { label: 'Puja & offerings', amount: 2000 },
      { label: 'Food & local transport', amount: 1500 * n },
    );
    if (['kedarnath', 'char_dham'].includes(slug)) {
      budgetItems.push({ label: 'Helicopter (optional)', amount: 7000 });
    }
    budgetTotal = budgetItems.reduce((s, i) => s + i.amount, 0);
  }

  return (
    <div
      style={{
        background: P.bg,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${P.divider}`,
        width: '100%',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 16px', borderBottom: `0.5px solid ${P.divider}` }}>
        <p style={{ fontSize: 14, color: P.brown, margin: '0 0 3px' }}>ॐ</p>
        <h2
          style={{
            fontFamily: "Georgia,'Times New Roman',serif",
            fontSize: 17,
            fontWeight: 400,
            color: P.gold,
            margin: '0 0 4px',
            lineHeight: 1.2,
          }}
        >
          {itinerary.title}
        </h2>
        <p style={{ fontSize: 11, color: P.muted, letterSpacing: '0.06em', margin: '0 0 8px' }}>
          {days} DAYS · {nights} NIGHTS{travelMonth ? ` · ${travelMonth}` : ''}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 11, color: P.amber, background: P.surface, borderRadius: 20, padding: '2px 9px' }}>
            📍 {resolvedCity}
          </span>
          {groupSize != null && (
            <span style={{ fontSize: 11, color: P.amber, background: P.surface, borderRadius: 20, padding: '2px 9px' }}>
              👥 {groupSize === 1 ? 'Solo' : `${groupSize} people`}
            </span>
          )}
          {budgetTier && (
            <span style={{ fontSize: 11, color: P.amber, background: P.surface, borderRadius: 20, padding: '2px 9px' }}>
              {budgetTier === 'basic' ? '💰 Budget' : budgetTier === 'premium' ? '✨ Premium' : '🌿 Standard'}
            </span>
          )}
        </div>
      </div>

      {/* ── Getting There ────────────────────────────────────────────────────── */}
      {travelInfo && (
        <div style={{ padding: '12px 16px 0', borderBottom: `0.5px solid ${P.divider}` }}>
          <p
            style={{
              fontSize: 10,
              color: P.muted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: '0 0 10px',
            }}
          >
            Getting There
          </p>
          <GettingThereSection travelInfo={travelInfo} originCity={resolvedCity} />
        </div>
      )}

      {/* ── Day by Day ───────────────────────────────────────────────────────── */}
      <div style={{ padding: '12px 16px' }}>
        <p
          style={{
            fontSize: 10,
            color: P.muted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '0 0 8px',
          }}
        >
          Day by Day
        </p>
        {itinerary.days.map((day, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              padding: '8px 0',
              borderBottom: i < itinerary.days.length - 1 ? `0.5px solid ${P.rowDivider}` : 'none',
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: P.muted,
                minWidth: 32,
                paddingTop: 2,
                flexShrink: 0,
                lineHeight: 1.4,
              }}
            >
              {day.day}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: P.gold,
                  margin: '0 0 2px',
                  lineHeight: 1.25,
                }}
              >
                {day.title}
              </p>
              <p style={{ fontSize: 11, color: P.brown, lineHeight: 1.45, margin: 0 }}>
                {truncate(day.description, 14)}
              </p>
              {day.auspiciousTag && (
                <span
                  style={{
                    fontSize: 10,
                    color: '#D4A853',
                    background: 'rgba(212,168,83,0.13)',
                    border: '1px solid rgba(212,168,83,0.25)',
                    borderRadius: 10,
                    padding: '2px 7px',
                    display: 'inline-block',
                    marginTop: 4,
                  }}
                >
                  🪔 {day.auspiciousTag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Budget ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '12px 16px', borderTop: `0.5px solid ${P.divider}` }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: P.muted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Estimated Budget
          </p>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 16, color: P.amber, margin: 0 }}>
            {budgetTotal > 0
              ? `₹${budgetTotal.toLocaleString('en-IN')}`
              : itinerary.estimatedCostRange}
          </p>
        </div>
        {budgetItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              borderBottom: `0.5px solid ${P.rowDivider}`,
            }}
          >
            <span style={{ fontSize: 11, color: '#A07030' }}>{item.label}</span>
            <span style={{ fontSize: 11, color: P.gold, fontWeight: 500 }}>
              ₹{item.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
        {budgetItems.length === 0 && (
          <p style={{ fontSize: 12, color: P.brown, margin: 0 }}>{itinerary.estimatedCostRange}</p>
        )}
        <p style={{ fontSize: 10, color: P.muted, marginTop: 6, lineHeight: 1.4, marginBottom: 0 }}>
          * Estimates only. Actual costs vary by date, group size and availability.
        </p>
      </div>

      {/* ── Auspicious dates ─────────────────────────────────────────────────── */}
      {itinerary.auspiciousDates.length > 0 && (
        <div
          style={{
            padding: '10px 16px',
            borderTop: `0.5px solid ${P.divider}`,
            background: 'rgba(44,24,16,0.35)',
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: P.muted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: '0 0 5px',
            }}
          >
            Auspicious Dates
          </p>
          {itinerary.auspiciousDates.slice(0, 3).map((d, i) => (
            <p key={i} style={{ fontSize: 11, color: P.brown, margin: '0 0 2px', lineHeight: 1.4 }}>
              ☽ {d}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
