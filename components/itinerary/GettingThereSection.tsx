'use client';

import { useState } from 'react';
import type { DestinationTravelInfo, SpecialTransport, StayOption } from '@/data/travelOptions';
import { buildIRCTCSearchUrl, buildBookingComUrl } from '@/utils/deepLinks';
import { getCityProfile, buildFlightUrlFromCity, getTrainRouteLabel } from '@/utils/cityToTravel';

type Tab = 'train' | 'flight' | 'stay';

function getIRCTCUrl(irctcSearchQuery: string, originCity: string): string {
  const dash = irctcSearchQuery.indexOf('-');
  const defaultFrom = dash >= 0 ? irctcSearchQuery.slice(0, dash) : 'NDLS';
  const toStation = dash >= 0 ? irctcSearchQuery.slice(dash + 1) : irctcSearchQuery;
  const profile = getCityProfile(originCity);
  const fromStation = profile?.stationCode ?? defaultFrom;
  return buildIRCTCSearchUrl(fromStation, toStation);
}

interface Props {
  travelInfo: DestinationTravelInfo;
  originCity?: string;
}

export function GettingThereSection({ travelInfo, originCity }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('train');

  const resolvedCity = originCity ?? 'Delhi';
  const cityProfile = getCityProfile(resolvedCity);

  const checkinDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  const tabs: Tab[] = ['train', 'flight', 'stay'];
  const tabLabels: Record<Tab, string> = {
    train: '🚂 Train',
    flight: '✈️ Flight',
    stay: '🏨 Stay',
  };

  return (
    <section aria-label="Getting there">
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '0.5px solid rgba(196,134,42,0.2)', marginBottom: 12 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 12,
              cursor: 'pointer',
              paddingBottom: 8,
              color: activeTab === tab ? '#F5A623' : '#7A4A1E',
              borderBottom: activeTab === tab ? '1.5px solid #F5A623' : '1.5px solid transparent',
            }}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Train tab */}
      {activeTab === 'train' && (
        <div>
          {travelInfo.trainOptions.map((train, i) => (
            <div
              key={i}
              style={{
                padding: '12px 0',
                borderBottom: i < travelInfo.trainOptions.length - 1 ? '0.5px solid rgba(196,134,42,0.1)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#F5C842', margin: 0 }}>{train.name}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#F5A623', margin: 0 }}>
                  ₹{train.priceFromINR.toLocaleString('en-IN')}
                </p>
              </div>
              <p style={{ fontSize: 11, color: '#7A4A1E', margin: '0 0 8px' }}>
                {getTrainRouteLabel(resolvedCity, travelInfo.nearestRailhead)} · {train.durationHours}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['SL', '3A', '2A'] as const).map((cls) => (
                    <span
                      key={cls}
                      style={{ fontSize: 10, color: '#A07030', background: 'rgba(196,134,42,0.1)', borderRadius: 4, padding: '2px 6px' }}
                    >
                      {cls}
                    </span>
                  ))}
                </div>
                <a
                  href={getIRCTCUrl(train.irctcSearchQuery, resolvedCity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#F5A623', textDecoration: 'none', background: 'rgba(196,134,42,0.12)', borderRadius: 6, padding: '4px 10px' }}
                >
                  Book on IRCTC →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flight tab */}
      {activeTab === 'flight' && (
        <div>
          {travelInfo.flightOptions.map((flight, i) => (
            <div
              key={i}
              style={{
                padding: '12px 0',
                borderBottom: i < travelInfo.flightOptions.length - 1 ? '0.5px solid rgba(196,134,42,0.1)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#F5C842', margin: 0 }}>
                  {cityProfile?.airportCode ?? 'DEL'} → {flight.toCode} ({flight.toCity})
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#F5A623', margin: 0 }}>
                  ₹{flight.priceFromINR.toLocaleString('en-IN')}
                </p>
              </div>
              <p style={{ fontSize: 11, color: '#7A4A1E', margin: '0 0 8px' }}>
                {flight.airline} · {flight.durationStr}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={buildFlightUrlFromCity(resolvedCity, flight.toCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#F5A623', textDecoration: 'none', background: 'rgba(196,134,42,0.12)', borderRadius: 6, padding: '4px 10px' }}
                >
                  Search on MakeMyTrip →
                </a>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 10, color: '#7A4A1E', margin: '8px 0 0' }}>
            Nearest airport: {travelInfo.nearestAirport}
          </p>
        </div>
      )}

      {/* Stay tab */}
      {activeTab === 'stay' && (
        <div>
          {travelInfo.stayOptionsPerNight.map((option: StayOption, i: number) => (
            <div
              key={i}
              style={{
                padding: '12px 0',
                borderBottom: i < travelInfo.stayOptionsPerNight.length - 1 ? '0.5px solid rgba(196,134,42,0.1)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                  <span style={{ fontSize: 10, color: '#A07030', background: 'rgba(196,134,42,0.1)', borderRadius: 4, padding: '2px 6px', marginRight: 6, display: 'inline-block', marginBottom: 4 }}>
                    {option.tier}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#F5C842' }}>{option.name}</span>
                </div>
                <p style={{ fontSize: 12, color: '#F5A623', margin: 0, fontWeight: 500, flexShrink: 0 }}>{option.priceRange}</p>
              </div>
              {option.bookingSearchQuery && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <a
                    href={buildBookingComUrl(option.bookingSearchQuery, checkinDate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#F5A623', textDecoration: 'none', background: 'rgba(196,134,42,0.12)', borderRadius: 6, padding: '4px 10px' }}
                  >
                    Find on Booking.com →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Special transport strip */}
      {travelInfo.specialTransport.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '0.5px solid rgba(196,134,42,0.15)' }}>
          <p style={{ fontSize: 10, color: '#7A4A1E', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Special Transport
          </p>
          {travelInfo.specialTransport.map((item: SpecialTransport, i: number) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: i < travelInfo.specialTransport.length - 1 ? '0.5px solid rgba(196,134,42,0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>
                  {item.icon === 'helicopter' ? '🚁' : item.icon === 'pony' ? '🐴' : item.icon === 'ferry' ? '⛵' : '🚐'}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: '#C4862A', margin: '0 0 1px' }}>{item.name}</p>
                  <p style={{ fontSize: 10, color: '#7A4A1E', margin: 0, lineHeight: 1.4 }}>
                    {item.description} · {item.priceRange}
                  </p>
                </div>
              </div>
              {item.bookingUrl && (
                <a
                  href={item.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#F5A623', textDecoration: 'none', background: 'rgba(196,134,42,0.12)', borderRadius: 6, padding: '4px 8px', flexShrink: 0, marginLeft: 8 }}
                >
                  Book Official →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
