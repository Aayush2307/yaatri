type OverpassElement = {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

type TempleCandidate = {
  name: string;
  location: string;
  state: string;
  latitude?: number;
  longitude?: number;
};

const OVERPASS_URL = process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';

function parseTags(tags: Record<string, string> | undefined) {
  if (!tags) return null;
  const name = tags.name || tags['name:en'];
  if (!name) return null;

  const location = tags['addr:city'] || tags['addr:place'] || tags['addr:district'] || tags['addr:suburb'] || tags['addr:village'] || 'Unknown';
  const state = tags['addr:state'] || tags['is_in:state'] || tags['addr:region'] || 'Unknown';

  return { name, location, state };
}

export async function fetchTemplesByBbox(bbox: string): Promise<TempleCandidate[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="hindu"](${bbox});
      way["amenity"="place_of_worship"]["religion"="hindu"](${bbox});
    );
    out center tags;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ data: query }).toString(),
  });

  if (!response.ok) {
    throw new Error('Overpass API request failed.');
  }

  const data = (await response.json()) as OverpassResponse;
  const elements = data.elements || [];

  const results: TempleCandidate[] = [];
  for (const element of elements) {
    const tags = parseTags(element.tags);
    if (!tags) continue;

    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;

    results.push({
      name: tags.name,
      location: tags.location,
      state: tags.state,
      latitude,
      longitude,
    });
  }

  return results;
}
