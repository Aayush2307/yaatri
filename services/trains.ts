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
  from_time?: string;
  arrivalTime?: string;
  to_time?: string;
  duration?: string;
  distance?: number;
  classes?: string[];
  available_classes?: string[];
  runsOn?: Record<string, boolean | string | number>;
};

export async function getTrainsBetweenStations(
  fromCity: string,
  toCity: string,
  date: string, // YYYYMMDD format e.g. "20260315"
): Promise<TrainOption[]> {
  const from = STATION_CODES[fromCity] || fromCity.toUpperCase();
  const to = STATION_CODES[toCity] || toCity.toUpperCase();

  const url = `https://${IRCTC_HOST}/getTrainBetweenStations?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${date}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];

  const data = (await res.json()) as { data?: RawTrain[] } | RawTrain[];
  const trains: RawTrain[] = Array.isArray(data)
    ? data
    : (Array.isArray((data as { data?: RawTrain[] }).data) ? (data as { data: RawTrain[] }).data : []);

  return trains.slice(0, 5).map((t): TrainOption => {
    const classes: string[] = t.classes || t.available_classes || ['SL', '3A'];
    const km: number = t.distance || 700;
    return {
      trainNumber: String(t.trainNo || t.train_number || ''),
      trainName: t.trainName || t.train_name || 'Express',
      departure: t.departureTime || t.from_time || '',
      arrival: t.arrivalTime || t.to_time || '',
      durationHours: t.duration || '',
      distanceKm: km,
      availableClasses: classes,
      approxFares: Object.fromEntries(classes.map((c) => [c, calcFare(c, km)])),
      runsOn: t.runsOn
        ? Object.entries(t.runsOn)
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k)
        : [],
      irctcBookingLink: `https://www.irctc.co.in/nget/train-search?fromStation=${from}&toStation=${to}&jdate=${date}&class=3A`,
    };
  });
}

export async function checkSeatAvailability(
  trainNo: string,
  from: string,
  to: string,
  cls: string,
  date: string,
): Promise<string> {
  const url = `https://${IRCTC_HOST}/checkSeatAvailability?trainNo=${trainNo}&fromStationCode=${from}&toStationCode=${to}&classType=${cls}&quota=GN&date=${date}`;
  const res = await fetch(url, { headers });
  if (!res.ok) return 'Check on IRCTC';
  const data = (await res.json()) as { data?: { availability?: string }; availability?: string };
  return data?.data?.availability || data?.availability || 'Check on IRCTC';
}
