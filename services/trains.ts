// Uses IRCTC API (sahilgour3291) on RapidAPI for Indian Railways data.
// Endpoints: getTrainBetweenStations, checkSeatAvailability

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const IRCTC_HOST = process.env.IRCTC_HOST || 'irctc-api1.p.rapidapi.com';

const headers = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': IRCTC_HOST,
  'x-rapidapi-key': RAPIDAPI_KEY,
};

export interface TrainOption {
  trainNumber: string;
  trainName: string;
  departure: string;           // "19:35"
  arrival: string;             // "09:25+1"
  durationHours: string;       // "10h 50m"
  distanceKm: number;
  availableClasses: string[];  // ["SL", "3A", "2A"]
  approxFares: Record<string, number>; // { "SL": 460, "3A": 1200 }
  runsOn: string[];            // ["Mon", "Tue", ...]
  irctcBookingLink: string;
}

// Station codes for yatra destinations
export const STATION_CODES: Record<string, string> = {
  Delhi: 'NDLS', Mumbai: 'CSTM', Bengaluru: 'SBC', Hyderabad: 'HYB',
  Chennai: 'MAS', Kolkata: 'KOAA', Ahmedabad: 'ADI', Jaipur: 'JP',
  Lucknow: 'LKO', Pune: 'PUNE', Varanasi: 'BSB', Tirupati: 'TPTY',
  Haridwar: 'HW', Rishikesh: 'RKSH', Puri: 'PURI', Amritsar: 'ASR',
  Shirdi: 'KPG', // nearest station: Kopargaon
};

// Approx fares per km by class (for display guidance)
const FARE_RATES: Record<string, number> = { SL: 0.45, '3A': 1.20, '2A': 1.90, '1A': 3.80 };

function calcFare(cls: string, km: number): number {
  return Math.round(350 + (FARE_RATES[cls] || 0.45) * km);
}

type RawTrain = {
  trainNo?: string | number;
  train_number?: string | number;
  trainName?: string;
  train_name?: string;
  departureTime?: string;
  fromTime?: string;
  arrivalTime?: string;
  toTime?: string;
  duration?: string;
  distance?: number;
  distanceKm?: number;
  // FIXED: classType is the correct key on this API
  classType?: string[];
  classes?: string[];
  runsOn?: Record<string, boolean | string>;
};

// FIXED: normalise date — IRCTC requires YYYYMMDD
function toIrctcDate(date: string) { return date.includes('-') ? date.replace(/-/g, '') : date; }

export async function getTrainsBetweenStations(
  fromCity: string,
  toCity: string,
  date: string, // accepts YYYY-MM-DD or YYYYMMDD
): Promise<TrainOption[]> {
  const from = STATION_CODES[fromCity] ?? fromCity.toUpperCase();
  const to = STATION_CODES[toCity] ?? toCity.toUpperCase();
  const d = toIrctcDate(date); // FIXED: always send YYYYMMDD

  try {
    const res = await fetch(
      `https://${IRCTC_HOST}/getTrainBetweenStations?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${d}`,
      { headers, cache: 'no-store' },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as Record<string, unknown>;
    // FIXED: actual response shape is { success: true, body: [...] }
    const trains: RawTrain[] = Array.isArray(data?.body) ? (data.body as RawTrain[])
      : Array.isArray(data?.data) ? (data.data as RawTrain[])
      : Array.isArray(data) ? (data as RawTrain[])
      : [];

    const DAY_MAP: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

    return trains.slice(0, 5).map((t): TrainOption => {
      const classes: string[] = t.classType ?? t.classes ?? ['SL', '3A'];
      const km: number = t.distance ?? t.distanceKm ?? 700;
      return {
        trainNumber: String(t.trainNo ?? t.train_number ?? ''),
        trainName: t.trainName ?? t.train_name ?? 'Express',
        departure: t.departureTime ?? t.fromTime ?? '',
        arrival: t.arrivalTime ?? t.toTime ?? '',
        durationHours: t.duration ?? '',
        distanceKm: km,
        availableClasses: classes,
        approxFares: Object.fromEntries(classes.map((c) => [c, calcFare(c, km)])),
        runsOn: t.runsOn
          ? Object.entries(t.runsOn).filter(([, v]) => v === true || v === 'Y').map(([k]) => DAY_MAP[k.toLowerCase()] ?? k)
          : [],
        irctcBookingLink: `https://www.irctc.co.in/nget/train-search?fromStation=${from}&toStation=${to}&jdate=${d}&class=3A`,
      };
    });
  } catch { return []; }
}

export async function checkSeatAvailability(
  trainNo: string,
  from: string,
  to: string,
  cls: string,
  date: string,
): Promise<string> {
  const d = toIrctcDate(date);
  const f = STATION_CODES[from] ?? from.toUpperCase();
  const t = STATION_CODES[to] ?? to.toUpperCase();
  try {
    const res = await fetch(
      `https://${IRCTC_HOST}/checkSeatAvailability?trainNo=${trainNo}&fromStationCode=${f}&toStationCode=${t}&classType=${cls}&quota=GN&date=${d}`,
      { headers, cache: 'no-store' },
    );
    if (!res.ok) return 'Check on IRCTC';
    const data = (await res.json()) as Record<string, unknown>;
    return String(
      (data?.body as Record<string, unknown>)?.availability
      ?? (data?.data as Record<string, unknown>)?.availability
      ?? 'Check on IRCTC'
    );
  } catch { return 'Check on IRCTC'; }
}
