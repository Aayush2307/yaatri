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
  data?: Array<{ dest_id?: string | number; dest_type?: string }>;
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
      };
    }>;
  };
};

// Resolve city name to Booking.com dest_id
async function resolveCity(city: string): Promise<{ dest_id: string; dest_type: string } | null> {
  const url = `https://${BOOKING_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}&languagecode=en-us`;
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const data = (await res.json()) as DestResult;
  const first = data?.data?.[0];
  return first ? { dest_id: String(first.dest_id), dest_type: first.dest_type || 'city' } : null;
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
    search_type: dest.dest_type.toUpperCase(),
    arrival_date: checkIn,
    departure_date: checkOut,
    adults: String(adults),
    room_qty: '1',
    page_number: '1',
    languagecode: 'en-us',
    currency_code: 'INR',
  });

  const url = `https://${BOOKING_HOST}/api/v1/hotels/searchHotels?${params}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];

  const data = (await res.json()) as HotelResult;
  const hotels = data?.data?.hotels || [];

  const mapped: HotelOption[] = hotels.map((h): HotelOption => {
    const price = Math.round(h.property?.priceBreakdown?.grossPrice?.value || 0);
    return {
      hotelId: h.hotel_id || 0,
      name: h.property?.name || 'Hotel',
      stars: h.property?.propertyClass || 0,
      reviewScore: h.property?.reviewScore || 0,
      reviewCount: h.property?.reviewCount || 0,
      pricePerNightINR: price,
      photoUrl: h.property?.photoUrls?.[0] || null,
      tier: priceTier(price),
      bookingUrl: `https://www.booking.com/hotel/in/${h.hotel_id}.html`,
      highlights: h.property?.wishlistName || '',
    };
  });

  const filtered = tier ? mapped.filter((h) => h.tier === tier) : mapped;
  return filtered.slice(0, 3);
}
