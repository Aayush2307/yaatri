export interface CityProfile {
  airportCode: string;
  stationCode: string;
  stationName: string;
  region: 'north' | 'south' | 'west' | 'east' | 'central';
}

const CITY_MAP: Record<string, CityProfile> = {
  pune:        { airportCode: 'BOM', stationCode: 'PUNE', stationName: 'Pune Junction',       region: 'west'    },
  mumbai:      { airportCode: 'BOM', stationCode: 'CSTM', stationName: 'Mumbai CST',           region: 'west'    },
  delhi:       { airportCode: 'DEL', stationCode: 'NDLS', stationName: 'New Delhi',            region: 'north'   },
  'new delhi': { airportCode: 'DEL', stationCode: 'NDLS', stationName: 'New Delhi',            region: 'north'   },
  bangalore:   { airportCode: 'BLR', stationCode: 'SBC',  stationName: 'KSR Bengaluru',        region: 'south'   },
  bengaluru:   { airportCode: 'BLR', stationCode: 'SBC',  stationName: 'KSR Bengaluru',        region: 'south'   },
  chennai:     { airportCode: 'MAA', stationCode: 'MAS',  stationName: 'Chennai Central',      region: 'south'   },
  hyderabad:   { airportCode: 'HYD', stationCode: 'HYB',  stationName: 'Hyderabad Deccan',     region: 'south'   },
  kolkata:     { airportCode: 'CCU', stationCode: 'HWH',  stationName: 'Howrah Junction',      region: 'east'    },
  ahmedabad:   { airportCode: 'AMD', stationCode: 'ADI',  stationName: 'Ahmedabad Junction',   region: 'west'    },
  jaipur:      { airportCode: 'JAI', stationCode: 'JP',   stationName: 'Jaipur Junction',      region: 'north'   },
  lucknow:     { airportCode: 'LKO', stationCode: 'LKO',  stationName: 'Lucknow Charbagh',     region: 'north'   },
  patna:       { airportCode: 'PAT', stationCode: 'PNBE', stationName: 'Patna Junction',       region: 'east'    },
  bhopal:      { airportCode: 'BHO', stationCode: 'BPL',  stationName: 'Bhopal Junction',      region: 'central' },
  indore:      { airportCode: 'IDR', stationCode: 'INDB', stationName: 'Indore Junction',      region: 'central' },
  nagpur:      { airportCode: 'NAG', stationCode: 'NGP',  stationName: 'Nagpur Junction',      region: 'central' },
  surat:       { airportCode: 'STV', stationCode: 'ST',   stationName: 'Surat',                region: 'west'    },
  chandigarh:  { airportCode: 'IXC', stationCode: 'CDG',  stationName: 'Chandigarh',           region: 'north'   },
  guwahati:    { airportCode: 'GAU', stationCode: 'GHY',  stationName: 'Guwahati',             region: 'east'    },
  kochi:       { airportCode: 'COK', stationCode: 'ERS',  stationName: 'Ernakulam Junction',   region: 'south'   },
  cochin:      { airportCode: 'COK', stationCode: 'ERS',  stationName: 'Ernakulam Junction',   region: 'south'   },
  ernakulam:   { airportCode: 'COK', stationCode: 'ERS',  stationName: 'Ernakulam Junction',   region: 'south'   },
  jammu:       { airportCode: 'IXJ', stationCode: 'JAT',  stationName: 'Jammu Tawi',           region: 'north'   },
  katra:       { airportCode: 'IXJ', stationCode: 'SVDK', stationName: 'Shri Mata Vaishno Devi Katra', region: 'north' },
  madurai:     { airportCode: 'IXM', stationCode: 'MDU',  stationName: 'Madurai Junction',             region: 'south'   },
};

function normalise(city: string): string {
  return city.toLowerCase().trim().replace(/\s+(city|junction|jn)$/i, '');
}

export function getCityProfile(city: string): CityProfile | null {
  return CITY_MAP[normalise(city)] ?? null;
}

export function buildFlightUrlFromCity(
  originCity: string,
  destinationAirportCode: string,
): string {
  const profile = getCityProfile(originCity);
  const from = profile?.airportCode ?? 'DEL';
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `https://www.makemytrip.com/flights/search?origin=${from}&destination=${destinationAirportCode}&departDate=${mm}${dd}${d.getFullYear()}&trip=ONE&pax=A-1_C-0_I-0`;
}

export function getTrainRouteLabel(originCity: string, destinationRailhead: string): string {
  const profile = getCityProfile(originCity);
  const from = profile?.stationName ?? originCity;
  return `${from} → ${destinationRailhead}`;
}
