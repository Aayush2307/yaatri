// Uses Sky Scrapper API (sky-scrapper.p.rapidapi.com) for flight search with live prices.
// Falls back to MakeMyTrip deeplink if the API fails or city cannot be resolved.

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const SS_HOST = process.env.SKYSCRAPPER_HOST || 'sky-scrapper.p.rapidapi.com';

const ssHeaders = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': SS_HOST,
  'x-rapidapi-key': RAPIDAPI_KEY,
};

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;       // "07:30"
  arrival: string;         // "09:00"
  durationMinutes: number;
  priceINR: number;
  cabinClass: string;
  stops: number;           // 0 = direct
  bookingDeeplink: string; // MakeMyTrip deeplink as fallback
  originCode: string;      // IATA e.g. "DEL"
  destCode: string;        // IATA e.g. "VNS"
}

// Step 1: Resolve city name to Sky Scrapper's skyId + entityId
// Response shape: { navigation: { relevantFlightParams: { skyId, entityId } } }
async function resolveAirport(cityName: string): Promise<{ skyId: string; entityId: string } | null> {
  try {
    const url = `https://${SS_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(cityName)}&locale=en-US`;
    const res = await fetch(url, { headers: ssHeaders, cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: Array<{
        skyId?: string;
        entityId?: string;
        navigation?: {
          entityId?: string;
          relevantFlightParams?: { skyId?: string; entityId?: string };
        };
      }>;
    };
    const first = data?.data?.[0];
    if (!first) return null;
    // skyId and entityId are nested under navigation.relevantFlightParams
    const fp = first.navigation?.relevantFlightParams;
    return {
      skyId: fp?.skyId ?? first.skyId ?? '',
      entityId: fp?.entityId ?? first.navigation?.entityId ?? first.entityId ?? '',
    };
  } catch { return null; }
}

// Step 2: Search flights between two cities on a date
export async function searchFlights(
  fromCity: string,
  toCity: string,
  date: string,      // YYYY-MM-DD
  adults: number = 1,
): Promise<FlightOption[]> {
  const [origin, dest] = await Promise.all([
    resolveAirport(fromCity),
    resolveAirport(toCity),
  ]);

  if (!origin || !dest) return makeDeeplinks(fromCity, toCity, date);

  const params = new URLSearchParams({
    originSkyId: origin.skyId,
    destinationSkyId: dest.skyId,
    originEntityId: origin.entityId,
    destinationEntityId: dest.entityId,
    date,
    adults: String(adults),
    cabinClass: 'economy',
    currency: 'INR',
    market: 'IN',
    countryCode: 'IN',
    sortBy: 'best',
    limit: '10',
  });

  // FIXED: was searchFlightsComplete (deprecated) — now searchFlights
  const url = `https://${SS_HOST}/api/v2/flights/searchFlights?${params}`;
  try {
    const res = await fetch(url, { headers: ssHeaders, cache: 'no-store' });
    if (!res.ok) return makeDeeplinks(fromCity, toCity, date);

    const data = (await res.json()) as {
      data?: {
        itineraries?: Array<{
          id?: string;
          legs?: Array<{
            departure?: string;
            arrival?: string;
            durationInMinutes?: number;
            stopCount?: number;
            origin?: { displayCode?: string };
            destination?: { displayCode?: string };
            carriers?: { marketing?: Array<{ name?: string }> };
            segments?: Array<{ flightNumber?: string }>;
          }>;
          price?: { raw?: number };
        }>;
      };
    };

    const itineraries = data?.data?.itineraries ?? [];
    if (!itineraries.length) return makeDeeplinks(fromCity, toCity, date);

    return itineraries.slice(0, 4).map((item, idx): FlightOption => {
      const leg = item.legs?.[0];
      const carrier = leg?.carriers?.marketing?.[0];
      const segment = leg?.segments?.[0];
      return {
        id: item.id ?? String(idx),
        airline: carrier?.name ?? 'Airline',
        flightNumber: segment?.flightNumber ?? '',
        departure: (leg?.departure ?? '').substring(11, 16),
        arrival: (leg?.arrival ?? '').substring(11, 16),
        durationMinutes: leg?.durationInMinutes ?? 0,
        priceINR: Number(item.price?.raw ?? 0),
        cabinClass: 'Economy',
        stops: leg?.stopCount ?? 0,
        bookingDeeplink: makeMmtLink(fromCity, toCity, date),
        originCode: leg?.origin?.displayCode ?? '',
        destCode: leg?.destination?.displayCode ?? '',
      };
    });
  } catch { return makeDeeplinks(fromCity, toCity, date); }
}

function makeMmtLink(from: string, to: string, date: string): string {
  const CODES: Record<string, string> = {
    Delhi: 'DEL', Mumbai: 'BOM', Bengaluru: 'BLR', Hyderabad: 'HYD',
    Chennai: 'MAA', Kolkata: 'CCU', Ahmedabad: 'AMD', Jaipur: 'JAI',
    Varanasi: 'VNS', Tirupati: 'TIR', Lucknow: 'LKO', Pune: 'PNQ',
    Shirdi: 'SAG', Amritsar: 'ATQ',
  };
  const o = CODES[from] || 'DEL';
  const d = CODES[to] || 'VNS';
  return `https://www.makemytrip.com/flight/search?itinerary=${o}-${d}-${date.replace(/-/g, '')}&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E`;
}

function makeDeeplinks(from: string, to: string, date: string): FlightOption[] {
  return [{
    id: 'deeplink',
    airline: 'Search on MakeMyTrip',
    flightNumber: '',
    departure: '',
    arrival: '',
    durationMinutes: 0,
    priceINR: 0,
    cabinClass: 'Economy',
    stops: 0,
    bookingDeeplink: makeMmtLink(from, to, date),
    originCode: '',
    destCode: '',
  }];
}
