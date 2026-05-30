'use client';

import { useEffect, useState } from 'react';
import { getTravelOptions } from '@/data/travelOptions';
import type { DestinationTravelInfo } from '@/data/travelOptions';
import { GettingThereSection } from './GettingThereSection';
import { BudgetSummary } from './BudgetSummary';

interface Props {
  destinationSlug: string;
  packageCostINR?: number;
  travelStyle?: 'Budget' | 'Comfort' | 'Premium';
  numNights?: number;
}

export function ItineraryEnhancement({
  destinationSlug,
  packageCostINR,
  travelStyle = 'Budget',
  numNights = 3,
}: Props) {
  const [originCity, setOriginCity] = useState<string | undefined>();

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

  const travelInfo = getTravelOptions(destinationSlug);
  if (!travelInfo) {
    return (
      <div style={{ padding: '12px 0', borderTop: '0.5px solid rgba(196,134,42,0.2)' }}>
        <p style={{ fontSize: 12, color: '#C4862A', margin: 0 }}>
          Travel info coming soon for this destination.{' '}
          <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" style={{ color: '#F5A623' }}>
            Search IRCTC →
          </a>
        </p>
      </div>
    );
  }

  const budgetItems = buildBudgetItems(travelInfo, travelStyle, numNights);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '10px', color: '#A07030', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Getting there
        </p>
      </div>
      <GettingThereSection travelInfo={travelInfo} originCity={originCity} />
      <BudgetSummary
        items={budgetItems}
        packageCostINR={packageCostINR}
        travelStyle={travelStyle}
      />
    </div>
  );
}

function buildBudgetItems(
  travelInfo: DestinationTravelInfo,
  travelStyle: 'Budget' | 'Comfort' | 'Premium',
  numNights: number,
) {
  const tierIndex = travelStyle === 'Budget' ? 0 : travelStyle === 'Comfort' ? 1 : 2;
  const trainCost = travelInfo.trainOptions[0]?.priceFromINR ?? 0;
  const stayOption = travelInfo.stayOptionsPerNight[Math.min(tierIndex, travelInfo.stayOptionsPerNight.length - 1)];
  const stayPricePerNight = parseFirstPrice(stayOption?.priceRange ?? '0');
  const totalStayCost = stayPricePerNight * numNights;

  const items = [
    { label: 'Train (return estimate)', amountINR: trainCost * 2, note: `Based on ${travelInfo.trainOptions[0]?.name ?? 'cheapest train'}` },
    { label: `Stay (${numNights} nights)`, amountINR: totalStayCost, note: `${stayOption?.tier ?? ''} tier` },
    { label: 'Puja & offerings', amountINR: 2000 },
    { label: 'Food & local transport', amountINR: 1500 * numNights },
  ];

  if (['kedarnath', 'char_dham'].includes(travelInfo.destinationSlug)) {
    items.push({ label: 'Helicopter (Kedarnath)', amountINR: 7000, note: 'Return · optional' });
  }

  return items;
}

function parseFirstPrice(priceRange: string): number {
  const match = priceRange.replace(/[₹,]/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
