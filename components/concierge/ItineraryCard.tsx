'use client';

import { useState, type ReactNode } from 'react';
import { M } from './tokens';
import type { GeneratedItinerary, ItineraryDay } from '@/types/yatra';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  itinerary: GeneratedItinerary;
  compact?: boolean;
  fromCity?: string;
  travelMonth?: string;
  groupSize?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractFirstCost(range: string): string {
  const match = range.match(/₹[\d,]+/);
  return match ? match[0] : range;
}

function makeTteaser(desc: string): string {
  const words = desc.split(' ');
  return words.length <= 15 ? desc : words.slice(0, 15).join(' ') + '…';
}

function getDayIcon(title: string): string {
  const t = title.toLowerCase();
  if (/arrival|arrive|reach|check.in/.test(t)) return '🛬';
  if (/depart|return|fly\s*back|homeward|departure/.test(t)) return '🛫';
  if (/trek|mountain|himalay|kedarnath|badrinath|glacier/.test(t)) return '🏔️';
  if (/darshan|puja|aarti|abhishek|sandhya|prayer/.test(t)) return '🙏';
  if (/temple|mandir|shrine|jyotirlinga|dham|tirtha/.test(t)) return '🛕';
  if (/travel|journey|drive|bus|transfer|route|enroute/.test(t)) return '🚌';
  if (/river|ghat|ganga|lake|kund|sea/.test(t)) return '🌊';
  if (/rest|relax|overnight|leisure/.test(t)) return '🌙';
  return '✨';
}

// ─── Smooth expand/collapse (CSS grid trick — no JS measurement needed) ──────

function ExpandSection({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s ease-in-out',
        overflow: 'hidden',
      }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Single Day Card ──────────────────────────────────────────────────────────

function DayCard({
  day,
  index,
  isLast,
  activeFilter,
  onTagClick,
}: {
  day: ItineraryDay;
  index: number;
  isLast: boolean;
  activeFilter: string | null;
  onTagClick: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const icon = getDayIcon(day.title);
  const teaserText = makeTteaser(day.description);
  const isTruncated = teaserText !== day.description;

  return (
    <div style={{ display: 'flex', minWidth: 0 }}>

      {/* ── Left timeline column ───────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 44,
        flexShrink: 0,
      }}>
        {/* Connector line above icon */}
        <div style={{
          width: 1,
          height: 14,
          background: index === 0 ? 'transparent' : `${M.gold}35`,
          flexShrink: 0,
        }} />

        {/* Icon anchor with pulse/glow when expanded */}
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: open ? `${M.gold}1E` : `${M.gold}0A`,
          border: `1.5px solid ${open ? M.gold + '66' : M.gold + '28'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          flexShrink: 0,
          transition: 'box-shadow 0.3s ease-in-out, background 0.3s ease-in-out, border-color 0.3s ease-in-out',
          boxShadow: open ? `0 0 0 4px ${M.gold}14, 0 0 16px ${M.gold}22` : 'none',
        }}>
          {icon}
        </div>

        {/* Connector line below icon */}
        {!isLast && (
          <div style={{
            width: 1,
            flex: 1,
            minHeight: 24,
            background: `${M.gold}30`,
            flexShrink: 0,
          }} />
        )}
      </div>

      {/* ── Right content column ───────────────────────────────────── */}
      <div style={{
        flex: 1,
        minWidth: 0,
        padding: `4px 4px ${isLast ? 10 : 20}px 14px`,
      }}>

        {/* Day label */}
        <p style={{
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: `${M.gold}88`,
          margin: '3px 0 3px',
          fontWeight: 500,
        }}>
          {day.day}
        </p>

        {/* Title */}
        <p style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 15,
          fontWeight: 700,
          color: M.parchment,
          margin: '0 0 5px',
          lineHeight: 1.25,
        }}>
          {day.title}
        </p>

        {/* Description — teaser when collapsed, full text when expanded */}
        <p style={{
          fontSize: 12,
          color: `${M.terracottaMuted}BB`,
          margin: '0 0 8px',
          lineHeight: 1.5,
          fontFamily: isTruncated && open ? 'var(--font-cormorant), Georgia, serif' : 'inherit',
          fontStyle: isTruncated && open ? 'italic' : 'normal',
        }}>
          {isTruncated && open ? day.description : teaserText}
        </p>

        {/* ── Expandable section (tags + notes only, no description repeat) ── */}
        <ExpandSection open={open}>
          <div style={{ paddingBottom: 4 }}>

            {/* Activity tags — tappable, filterable */}
            {day.highlights.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                {day.highlights.map((h, j) => {
                  const isActive = activeFilter === h;
                  return (
                    <button
                      key={j}
                      onClick={() => onTagClick(h)}
                      style={{
                        fontSize: 11,
                        padding: '3px 9px',
                        borderRadius: 6,
                        border: `1px solid ${isActive ? M.gold + 'CC' : M.gold + '30'}`,
                        background: isActive ? `${M.gold}2A` : `${M.gold}0D`,
                        color: isActive ? M.goldLight : `${M.goldLight}88`,
                        fontWeight: isActive ? 700 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        lineHeight: 1.5,
                        fontFamily: 'inherit',
                      }}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Logistical note — soft accessibility callout, always inside expanded */}
            {day.logisticalNote && (
              <p style={{
                fontSize: 11,
                color: `${M.mutedText}99`,
                fontStyle: 'italic',
                margin: '2px 0 0',
                lineHeight: 1.45,
              }}>
                ℹ️ {day.logisticalNote}
              </p>
            )}
          </div>
        </ExpandSection>

        {/* Auspicious tag pill — ALWAYS visible, anchored below the toggle */}
        {day.auspiciousTag && (
          <div style={{ marginTop: 8 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: '#D4A853',
              background: 'rgba(212,168,83,0.13)',
              border: '1px solid rgba(212,168,83,0.38)',
              borderRadius: 20,
              padding: '3px 10px',
              lineHeight: 1.5,
            }}>
              🪔 {day.auspiciousTag}
            </span>
          </div>
        )}

        {/* Read more / Read less toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            background: 'none',
            border: 'none',
            color: `${M.gold}99`,
            fontSize: 11,
            cursor: 'pointer',
            padding: '4px 0',
            marginTop: 1,
            letterSpacing: '0.03em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontFamily: 'inherit',
          }}
        >
          {open ? 'Read less ▲' : 'Read more ▼'}
        </button>
      </div>
    </div>
  );
}

// ─── Full Sacred Card ─────────────────────────────────────────────────────────

function FullCard({ itinerary }: Omit<Props, 'compact'>) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setActiveFilter((prev) => (prev === tag ? null : tag));
  };

  const filteredDays = activeFilter
    ? itinerary.days.filter((d) => d.highlights.includes(activeFilter))
    : itinerary.days;

  return (
    <div
      style={{
        background: M.cardGradient,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(44,24,16,0.40)',
        width: '100%',
        maxWidth: 520,
      }}
    >
      {/* OM Header strip — unchanged */}
      <div
        style={{
          borderBottom: `1px solid ${M.gold}30`,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            fontSize: 22,
            color: M.goldLight,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ॐ
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 17,
              fontWeight: 600,
              color: M.goldLight,
              margin: 0,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {itinerary.title}
          </p>
          <p
            style={{
              fontSize: 11,
              color: M.gold,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '3px 0 0',
            }}
          >
            {itinerary.duration} · {extractFirstCost(itinerary.estimatedCostRange)}/person
          </p>
        </div>
      </div>

      {/* Active filter indicator */}
      {activeFilter && (
        <div
          style={{
            padding: '8px 20px',
            borderBottom: `1px solid ${M.gold}18`,
            background: `${M.gold}0A`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 11, color: `${M.gold}99` }}>Showing days with:</span>
          <span
            style={{
              fontSize: 11,
              color: M.goldLight,
              background: `${M.gold}22`,
              border: `1px solid ${M.gold}55`,
              borderRadius: 12,
              padding: '1px 8px',
              fontWeight: 600,
            }}
          >
            {activeFilter}
          </span>
          <button
            onClick={() => setActiveFilter(null)}
            style={{
              background: 'none',
              border: 'none',
              color: `${M.gold}99`,
              fontSize: 15,
              cursor: 'pointer',
              padding: '0 2px',
              lineHeight: 1,
              fontFamily: 'inherit',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Timeline day rows */}
      <div style={{ padding: '8px 16px 4px 10px' }}>
        {filteredDays.length === 0 ? (
          <p style={{
            fontSize: 12,
            color: `${M.mutedText}88`,
            padding: '14px 8px',
            fontStyle: 'italic',
            margin: 0,
          }}>
            No days match this filter.
          </p>
        ) : (
          filteredDays.map((day, i) => (
            <DayCard
              key={`${day.day}-${i}`}
              day={day}
              index={i}
              isLast={i === filteredDays.length - 1}
              activeFilter={activeFilter}
              onTagClick={handleTagClick}
            />
          ))
        )}
      </div>

      {/* Auspicious dates strip */}
      {itinerary.auspiciousDates.length > 0 && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: `1px solid ${M.gold}20`,
            background: 'rgba(44,24,16,0.4)',
          }}
        >
          <p style={{
            fontSize: 10,
            letterSpacing: '0.12em',
            color: M.gold,
            textTransform: 'uppercase',
            margin: '0 0 6px',
          }}>
            Auspicious Dates
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {itinerary.auspiciousDates.map((d, i) => (
              <p key={i} style={{ fontSize: 11, color: M.terracottaMuted, margin: 0 }}>
                ☽ {d}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Insider secret strip */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: `1px solid ${M.terracotta}40`,
          background: `${M.terracotta}12`,
        }}
      >
        <p style={{
          fontSize: 10,
          letterSpacing: '0.12em',
          color: M.terracotta,
          textTransform: 'uppercase',
          margin: '0 0 5px',
        }}>
          🗝 Insider Secret
        </p>
        <p style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 13,
          fontStyle: 'italic',
          color: M.terracottaMuted,
          margin: 0,
          lineHeight: 1.55,
        }}>
          {itinerary.insiderSecret}
        </p>
      </div>

      {/* Includes footer */}
      {itinerary.includes.length > 0 && (
        <div
          style={{
            padding: '10px 20px',
            borderTop: `1px solid ${M.gold}15`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
          }}
        >
          {itinerary.includes.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                color: M.mutedText,
                background: `${M.gold}10`,
                border: `1px solid ${M.gold}20`,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Compact variant (unchanged) ─────────────────────────────────────────────

function CompactCard({ itinerary }: Omit<Props, 'compact'>) {
  return (
    <div
      style={{
        background: M.cardGradient,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(44,24,16,0.35)',
        width: '100%',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${M.gold}25`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 16, color: M.goldLight, flexShrink: 0 }}>
          ॐ
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 14,
              fontWeight: 600,
              color: M.goldLight,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {itinerary.destination} · {itinerary.duration}
          </p>
          <p style={{ fontSize: 10, color: M.gold, margin: '2px 0 0' }}>
            {extractFirstCost(itinerary.estimatedCostRange)} /person
          </p>
        </div>
      </div>

      <div style={{ padding: '8px 0' }}>
        {itinerary.days.slice(0, 4).map((day, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr',
              gap: 8,
              padding: '6px 16px',
              borderTop: i > 0 ? `1px solid ${M.gold}12` : undefined,
            }}
          >
            <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 11, fontWeight: 600, color: M.gold }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 11, color: M.parchment }}>{day.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ItineraryCard({ compact = false, ...rest }: Props) {
  return compact ? <CompactCard {...rest} /> : <FullCard {...rest} />;
}
