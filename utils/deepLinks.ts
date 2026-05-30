export function buildIRCTCSearchUrl(
  fromStation: string,
  toStation: string,
  travelClass: 'SL' | '3A' | '2A' | '1A' = 'SL',
): string {
  const params = new URLSearchParams({
    from: fromStation,
    to: toStation,
    class: travelClass,
    journey_type: 'ONE_WAY',
  });
  return `https://www.irctc.co.in/nget/train-search?${params.toString()}`;
}

export function buildMakeMyTripFlightUrl(
  fromCode: string,
  toCode: string,
  departDate?: string,
): string {
  const date = departDate ?? getTomorrowDateMMDDYYYY();
  return `https://www.makemytrip.com/flights/search?origin=${fromCode}&destination=${toCode}&departDate=${date}&trip=ONE&pax=A-1_C-0_I-0&lang=eng`;
}

export function buildGoogleFlightsUrl(fromCode: string, toCode: string): string {
  return `https://www.google.com/travel/flights?q=flights+from+${fromCode}+to+${toCode}`;
}

export function buildBookingComUrl(searchQuery: string, checkInDate?: string): string {
  const checkin = checkInDate ?? new Date().toISOString().split('T')[0];
  const checkoutDate = new Date(checkin);
  checkoutDate.setDate(checkoutDate.getDate() + 1);
  const checkout = checkoutDate.toISOString().split('T')[0];
  const params = new URLSearchParams({ ss: searchQuery, checkin, checkout, adults: '1' });
  return `https://www.booking.com/search.html?${params.toString()}`;
}

export function buildOYORoomsUrl(city: string): string {
  const encoded = encodeURIComponent(city);
  return `https://www.oyorooms.com/search/?location=${encoded}`;
}

export function buildKedarnathHelicopterUrl(): string {
  return 'https://heliservices.uk.gov.in';
}

export function buildIRCTCTourismUrl(destination: string): string {
  const encoded = encodeURIComponent(destination);
  return `https://www.irctctourism.com/packageDetails?packageId=${encoded}`;
}

function getTomorrowDateMMDDYYYY(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}${dd}${yyyy}`;
}
