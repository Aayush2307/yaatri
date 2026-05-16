'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/plannerStore';
import { CategoryPicker } from './CategoryPicker';
import { TravelModeChips } from './TravelModeChips';
import { FlightOptions } from './FlightOptions';
import { TrainOptions } from './TrainOptions';
import { StayTierPicker } from './StayTierPicker';
import { HotelOptions } from './HotelOptions';
import type { PlanCategory } from './CategoryPicker';
import type { FlightOption } from '@/services/flights';
import type { TrainOption } from '@/services/trains';
import type { HotelOption } from '@/services/hotels';

interface PlanningRouterProps {
  onMessage: (text: string) => void;
}

function getDateFromMonth(month: string | null, year: number): string {
  const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const idx = MONTHS.findIndex((m) => m.startsWith((month ?? '').toLowerCase().slice(0, 3)));
  const monthIdx = idx >= 0 ? idx : 0;
  return new Date(year, monthIdx, 1).toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getActivities(destination: string | null): string[] {
  const MAP: Record<string, string[]> = {
    Varanasi: ['🛶 Ganga Aarti boat ride at Dashashwamedh Ghat', '🛕 Kashi Vishwanath Temple darshan', '🌅 Sunrise boat ride on the Ganga', '🧘 Sarnath Buddhist heritage site'],
    Tirupati: ['🛕 Tirumala Venkateswara darshan', '🌄 Sunrise at Tirumala Hills', '🛕 Padmavati Temple at Tiruchanur', '🙏 Kalyanakatta hair offering ritual'],
    Kedarnath: ['🛕 Kedarnath Temple darshan', '🏔️ Bhairav Nath Temple trek', '🚁 Helicopter ride to Kedarnath', '🧘 Meditation at Shankaracharya Samadhi'],
    Haridwar: ['🌊 Har Ki Pauri Ganga Aarti', '🛕 Mansa Devi Temple by ropeway', '🛕 Chandi Devi Temple', '🌿 Rajaji National Park safari'],
    Puri: ['🛕 Jagannath Temple darshan', '🏖️ Puri beach sunrise', '🌊 Konark Sun Temple day trip', '🎭 Odissi dance performance'],
    Vrindavan: ['🛕 Banke Bihari Temple darshan', '🛕 ISKCON Temple kirtan', '🛕 Prem Mandir light show', '🌸 Holi celebration (seasonal)'],
    Shirdi: ['🛕 Sai Baba Temple darshan', '🙏 Chavadi procession', '🛕 Shani Shingnapur day trip', '🕌 Dwarkamai mosque visit'],
    Amritsar: ['🛕 Golden Temple darshan & langar', '🕯️ Jallianwala Bagh memorial', '🚩 Wagah Border ceremony', '🍽️ Amritsari kulcha & lassi'],
  };
  return MAP[destination ?? ''] ?? ['🛕 Main temple darshan', '🌅 Local sunrise spot', '🎒 Heritage walking tour', '🍽️ Local cuisine experience'];
}

const WHATSAPP_NUMBER =
  (typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_MEERA_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP || '')
    : ''
  ).replace(/\D/g, '') || '910000000000';

export function PlanningRouter({ onMessage }: PlanningRouterProps) {
  const {
    concierge,
    setCurrentView,
    setFlightOptions,
    setTrainOptions,
    setHotelOptions,
    selectFlight,
    selectTrain,
    selectHotel,
    markCategoryComplete,
    setConcierge,
  } = usePlannerStore();

  const {
    currentView,
    destination,
    fromCity,
    travelMonth,
    travelYear,
    peopleCount,
    flightOptions,
    trainOptions,
    hotelOptions,
    selectedFlight,
    selectedTrain,
    selectedHotel,
    completedCategories,
  } = concierge;

  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingTrains, setLoadingTrains] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const completedSet = new Set(completedCategories);

  function handleSendPlan() {
    const lines = [
      `🙏 *New Yatra Plan — Yaatri App*`,
      ``,
      `🛕 *Destination:* ${destination}`,
      `🏠 *From:* ${fromCity}`,
      `📅 *Month:* ${travelMonth} ${travelYear}`,
      `👥 *Party:* ${peopleCount} ${peopleCount === 1 ? 'person' : 'people'}`,
    ];
    if (selectedFlight) lines.push(`✈️ *Flight:* ${selectedFlight.airline} ${selectedFlight.flightNumber} · ₹${selectedFlight.priceINR.toLocaleString('en-IN')}`);
    if (selectedTrain) lines.push(`🚂 *Train:* ${selectedTrain.trainName} · ${selectedTrain.departure}`);
    if (selectedHotel) lines.push(`🏨 *Stay:* ${selectedHotel.name} · ₹${selectedHotel.pricePerNightINR.toLocaleString('en-IN')}/night`);
    lines.push(``, `— sent via Yaatri app`);
    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  function handleCategorySelect(cat: PlanCategory) {
    if (cat === 'travel') setCurrentView('travel-mode');
    else if (cat === 'stay') setCurrentView('stay-tier');
    else if (cat === 'activities') setCurrentView('activities');
    else setCurrentView('puja');
  }

  async function handleModeSelect(mode: 'flights' | 'trains' | 'road') {
    setConcierge({ travelMode: mode });
    if (mode === 'flights') {
      setLoadingFlights(true);
      setCurrentView('flights');
      const date = getDateFromMonth(travelMonth, travelYear);
      try {
        const res = await fetch('/api/travel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'flights', params: { fromCity, toCity: destination, date, adults: peopleCount } }),
        });
        const data = (await res.json()) as { ok: boolean; data?: FlightOption[] };
        setFlightOptions(data.data ?? []);
      } catch { setFlightOptions([]); }
      setLoadingFlights(false);
    } else if (mode === 'trains') {
      setLoadingTrains(true);
      setCurrentView('trains');
      const date = getDateFromMonth(travelMonth, travelYear).replace(/-/g, '');
      try {
        const res = await fetch('/api/travel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'trains', params: { fromCity, toCity: destination, date } }),
        });
        const data = (await res.json()) as { ok: boolean; data?: TrainOption[] };
        setTrainOptions(data.data ?? []);
      } catch { setTrainOptions([]); }
      setLoadingTrains(false);
    } else {
      setCurrentView('road');
    }
  }

  async function handleTierSelect(tier: 'basic' | 'better' | 'premium') {
    setConcierge({ stayTier: tier });
    setLoadingHotels(true);
    setCurrentView('hotels');
    const checkIn = getDateFromMonth(travelMonth, travelYear);
    const checkOut = addDays(checkIn, 3);
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hotels', params: { city: destination, checkIn, checkOut, adults: peopleCount, tier } }),
      });
      const data = (await res.json()) as { ok: boolean; data?: HotelOption[] };
      setHotelOptions(data.data ?? []);
    } catch { setHotelOptions([]); }
    setLoadingHotels(false);
  }

  function handleFlightSelect(flight: FlightOption) {
    selectFlight(flight);
    markCategoryComplete('travel');
    onMessage(`✈️ ${flight.airline}${flight.flightNumber ? ` ${flight.flightNumber}` : ''} added to your plan.`);
  }

  function handleTrainSelect(train: TrainOption, cls: string) {
    selectTrain(train);
    markCategoryComplete('travel');
    const fare = train.approxFares[cls];
    const fareStr = fare ? ` · ₹${fare.toLocaleString('en-IN')} approx` : '';
    onMessage(`🚂 ${train.trainName} (${cls}${fareStr}) added to your plan.`);
  }

  function handleHotelSelect(hotel: HotelOption) {
    selectHotel(hotel);
    markCategoryComplete('stay');
    onMessage(`🏨 ${hotel.name} added to your plan.`);
  }

  switch (currentView) {
    case 'categories':
      return (
        <CategoryPicker
          completedCategories={completedSet}
          destination={destination}
          fromCity={fromCity}
          travelMonth={travelMonth}
          peopleCount={peopleCount}
          onSelect={handleCategorySelect}
          onSendPlan={handleSendPlan}
        />
      );

    case 'travel-mode':
      return (
        <TravelModeChips
          onSelect={handleModeSelect}
          onBack={() => setCurrentView('categories')}
        />
      );

    case 'flights':
      return (
        <FlightOptions
          options={flightOptions}
          loading={loadingFlights}
          onSelect={handleFlightSelect}
          onBack={() => setCurrentView('travel-mode')}
        />
      );

    case 'trains':
      return (
        <TrainOptions
          options={trainOptions}
          loading={loadingTrains}
          onSelect={handleTrainSelect}
          onBack={() => setCurrentView('travel-mode')}
        />
      );

    case 'road': {
      const redBusUrl = `https://www.redbus.in/bus-tickets/${(fromCity || 'delhi').toLowerCase()}-to-${(destination || 'varanasi').toLowerCase()}`;
      return (
        <div className="px-4 py-4 space-y-3">
          <p className="font-serif italic text-[#2C1A0E] text-base">Road / Bus options</p>
          <div className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4 space-y-3">
            <p className="text-sm text-[#7A5C42]">Search buses and cabs for your route.</p>
            <a
              href={redBusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 h-9 rounded-full bg-[#C85A1E] text-[#FBF5E8] text-xs font-semibold"
            >
              Search on redBus ↗
            </a>
          </div>
          <button type="button" onClick={() => setCurrentView('travel-mode')} className="text-xs text-[#7A5C42] underline">
            ← Different mode
          </button>
        </div>
      );
    }

    case 'stay-tier':
      return (
        <StayTierPicker
          onSelect={handleTierSelect}
          onBack={() => setCurrentView('categories')}
        />
      );

    case 'hotels':
      return (
        <HotelOptions
          options={hotelOptions}
          loading={loadingHotels}
          onSelect={handleHotelSelect}
          onBack={() => setCurrentView('stay-tier')}
        />
      );

    case 'activities':
      return (
        <div className="px-4 py-4 space-y-3">
          <p className="font-serif italic text-[#2C1A0E] text-base">
            Activities in {destination ?? 'your destination'}
          </p>
          <div className="space-y-2">
            {getActivities(destination).map((act) => (
              <div key={act} className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white px-4 py-3">
                <p className="text-sm text-[#2C1A0E]">{act}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              markCategoryComplete('activities');
              onMessage(`🎯 Activities for ${destination ?? 'your destination'} added to your plan.`);
            }}
            className="w-full h-11 rounded-full bg-[#C85A1E] text-[#FBF5E8] text-sm font-semibold"
          >
            Add activities to plan ✓
          </button>
          <button type="button" onClick={() => setCurrentView('categories')} className="block mx-auto text-xs text-[#7A5C42] underline">
            ← Back
          </button>
        </div>
      );

    case 'puja':
      return (
        <div className="px-4 py-4 space-y-3">
          <p className="font-serif italic text-[#2C1A0E] text-base">Puja & muhurat</p>
          <div className="rounded-[14px] border border-[rgba(242,201,126,0.5)] bg-white p-4">
            <p className="text-sm text-[#7A5C42]">
              Ask Meera in the chat for auspicious dates and puja booking guidance
              {destination ? ` for ${destination}` : ''}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              markCategoryComplete('puja');
              onMessage('🙏 Puja guidance added to your plan. Ask me for auspicious dates anytime.');
            }}
            className="w-full h-11 rounded-full bg-[#C85A1E] text-[#FBF5E8] text-sm font-semibold"
          >
            Add puja to plan ✓
          </button>
          <button type="button" onClick={() => setCurrentView('categories')} className="block mx-auto text-xs text-[#7A5C42] underline">
            ← Back
          </button>
        </div>
      );

    default:
      return null;
  }
}
