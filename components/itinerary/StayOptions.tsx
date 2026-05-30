'use client';

import type { StayOption } from '@/data/travelOptions';
import { buildBookingComUrl } from '@/utils/deepLinks';

interface Props {
  stayOptions: StayOption[];
  dayLocation?: string;
  checkInDate?: string;
}

export function StayOptions({ stayOptions, dayLocation, checkInDate }: Props) {
  return (
    <div
      style={{
        borderTop: '0.5px solid rgba(196, 134, 42, 0.2)',
        padding: '10px 14px',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          color: '#A07030',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: '0 0 8px',
        }}
      >
        Stay tonight{dayLocation ? ` · ${dayLocation}` : ''}
      </p>
      <div style={{ display: 'flex', gap: '7px' }}>
        {stayOptions.map((option) => (
          <a
            key={option.tier}
            href={option.bookingSearchQuery ? buildBookingComUrl(option.bookingSearchQuery, checkInDate) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              background: '#2B1408',
              border: '0.5px solid rgba(196, 134, 42, 0.25)',
              borderRadius: '8px',
              padding: '8px',
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            <p style={{ fontSize: '10px', color: '#A07030', margin: '0 0 3px' }}>{option.tier}</p>
            <p style={{ fontSize: '11px', fontWeight: 500, color: '#F5C842', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {option.name}
            </p>
            <p style={{ fontSize: '12px', color: '#F5A623', fontWeight: 500, margin: 0 }}>{option.priceRange}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
