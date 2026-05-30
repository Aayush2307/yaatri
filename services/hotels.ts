// Uses Booking.com21 (DataCrawler) on RapidAPI for hotel search.
// 2-step flow: searchDestination to get dest_id → searchHotels for listings.

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const BOOKING_HOST = process.env.BOOKING_HOST || 'booking-com21.p.rapidapi.com';

const headers = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': BOOKING_HOST,
  'x-rapidapi-key': RAPIDAPI_KEY,
};

export interface HotelOption {
  hotelId: number;
  name: string;
  stars: number;
  reviewScore: number;      // 0-10
  reviewCount: number;
  pricePerNightINR: number;
  photoUrl: string | null;
  tier: 'basic' | 'better' | 'premium';
  bookingUrl: string;
  highlights: string;       // short line e.g. "Heritage hotel on Ganges ghat"
}

type DestResult = {
  data?: Array<{ dest_id?: string | number; search_type?: string; dest_type?: string }>;
};

type HotelResult = {
  data?: {
    hotels?: Array<{
      hotel_id?: number;
      property?: {
        name?: string;
        propertyClass?: number;
        reviewScore?: number;
        reviewCount?: number;
        priceBreakdown?: { grossPrice?: { value?: number } };
        photoUrls?: string[];
        wishlistName?: string;
        url?: string;
      };
    }>;
  };
};

// Resolve city name to Booking.com dest_id
async function resolveCity(city: string): Promise<{ dest_id: string; search_type: string } | null> {
  try {
    const res = await fetch(
      `https://${BOOKING_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}&languagecode=en-us`,
      { headers, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as DestResult;
    const first = data?.data?.[0];
    if (!first) return null;
    // FIXED: use first.search_type (already uppercase "CITY") not first.dest_type
    return { dest_id: String(first.dest_id), search_type: first.search_type ?? 'CITY' };
  } catch { return null; }
}

function priceTier(priceINR: number): 'basic' | 'better' | 'premium' {
  if (priceINR <= 1500) return 'basic';
  if (priceINR <= 5000) return 'better';
  return 'premium';
}

export async function searchHotels(
  city: string,
  checkIn: string,   // YYYY-MM-DD
  checkOut: string,  // YYYY-MM-DD
  adults: number = 2,
  tier?: 'basic' | 'better' | 'premium',
): Promise<HotelOption[]> {
  const dest = await resolveCity(city);
  if (!dest) return [];

  const params = new URLSearchParams({
    dest_id: dest.dest_id,
    search_type: dest.search_type, // FIXED: uppercase CITY from API
    arrival_date: checkIn,
    departure_date: checkOut,
    adults: String(adults),
    room_qty: '1',
    page_number: '1',
    languagecode: 'en-us',
    currency_code: 'INR',
    units: 'metric',
  });

  try {
    const res = await fetch(`https://${BOOKING_HOST}/api/v1/hotels/searchHotels?${params}`, { headers, cache: 'no-store' });
    if (!res.ok) return [];

    const data = (await res.json()) as HotelResult;
    const hotels = data?.data?.hotels ?? [];

    const mapped: HotelOption[] = hotels.map((h): HotelOption => {
      const price = Math.round(h.property?.priceBreakdown?.grossPrice?.value ?? 0);
      // FIXED: use property.url if available, else construct search deeplink
      const bookingUrl = h.property?.url
        ? `https://www.booking.com${h.property.url}`
        : `https://www.booking.com/searchresults/in/${encodeURIComponent(city.toLowerCase())}.html?dest_id=${dest.dest_id}&dest_type=city&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}`;
      return {
        hotelId: h.hotel_id ?? 0,
        name: h.property?.name ?? 'Hotel',
        stars: h.property?.propertyClass ?? 0,
        reviewScore: h.property?.reviewScore ?? 0,
        reviewCount: h.property?.reviewCount ?? 0,
        pricePerNightINR: price,
        photoUrl: h.property?.photoUrls?.[0] ?? null,
        tier: priceTier(price),
        bookingUrl,
        highlights: h.property?.wishlistName ?? '',
      };
    });

    const filtered = tier ? mapped.filter((h) => h.tier === tier) : mapped;
    return filtered.slice(0, 3);
  } catch { return []; }
}
