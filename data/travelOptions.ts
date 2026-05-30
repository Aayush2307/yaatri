export type TravelClass = 'SL' | '3A' | '2A' | '1A';

export interface TrainOption {
  name: string;
  fromStation: string;
  toStation: string;
  durationHours: string;
  priceFromINR: number;
  irctcSearchQuery: string;
}

export interface FlightOption {
  airline: string;
  fromCode: string;
  toCode: string;
  toCity: string;
  durationStr: string;
  priceFromINR: number;
}

export interface SpecialTransport {
  name: string;
  description: string;
  priceRange: string;
  bookingUrl?: string;
  icon: 'helicopter' | 'pony' | 'jeep' | 'bus' | 'ferry';
}

export interface StayOption {
  tier: 'Dharamshala' | 'Budget' | 'Comfort';
  name: string;
  priceRange: string;
  bookingSearchQuery?: string;
}

export interface DestinationTravelInfo {
  destinationSlug: string;
  nearestRailhead: string;
  nearestAirport: string;
  trainOptions: TrainOption[];
  flightOptions: FlightOption[];
  specialTransport: SpecialTransport[];
  stayOptionsPerNight: StayOption[];
  packagePriceEstimate?: number;
}

const TRAVEL_OPTIONS: Record<string, DestinationTravelInfo> = {
  kedarnath: {
    destinationSlug: 'kedarnath',
    nearestRailhead: 'Rishikesh',
    nearestAirport: 'Jolly Grant (DED)',
    trainOptions: [
      { name: 'Shatabdi Express', fromStation: 'New Delhi', toStation: 'Haridwar', durationHours: '4h 45m', priceFromINR: 610, irctcSearchQuery: 'NDLS-HW' },
      { name: 'Dehradun Express', fromStation: 'New Delhi', toStation: 'Dehradun', durationHours: '6h 20m', priceFromINR: 430, irctcSearchQuery: 'NDLS-DDN' },
      { name: 'Jan Shatabdi', fromStation: 'New Delhi', toStation: 'Rishikesh', durationHours: '5h 30m', priceFromINR: 280, irctcSearchQuery: 'NDLS-RKSH' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'DED', toCity: 'Dehradun', durationStr: '1h 10m', priceFromINR: 3200 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'DED', toCity: 'Dehradun', durationStr: '1h 50m', priceFromINR: 4800 },
    ],
    specialTransport: [
      { name: 'Helicopter to Kedarnath', description: 'Phata / Sitapur → Kedarnath · 8 min flight', priceRange: '₹3,500–₹4,200/person one-way', bookingUrl: 'https://heliservices.uk.gov.in', icon: 'helicopter' },
      { name: 'Pony / Palki', description: 'Gaurikund → Kedarnath · 22 km trek', priceRange: '₹1,800–₹4,000', icon: 'pony' },
      { name: 'Shared Jeep', description: 'Rishikesh → Gaurikund · 223 km', priceRange: '₹400–600/seat', icon: 'jeep' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'GMVN Guest House', priceRange: 'Free–₹500', bookingSearchQuery: 'GMVN Kedarnath' },
      { tier: 'Budget', name: 'Hotel near Gaurikund', priceRange: '₹800–₹1,400', bookingSearchQuery: 'hotels near Kedarnath budget' },
      { tier: 'Comfort', name: 'Camp Kedarnath / Garhwal Mandal', priceRange: '₹2,500–₹4,500', bookingSearchQuery: 'Kedarnath comfort stay' },
    ],
  },
  badrinath: {
    destinationSlug: 'badrinath',
    nearestRailhead: 'Haridwar',
    nearestAirport: 'Jolly Grant (DED)',
    trainOptions: [
      { name: 'Shatabdi Express', fromStation: 'New Delhi', toStation: 'Haridwar', durationHours: '4h 45m', priceFromINR: 610, irctcSearchQuery: 'NDLS-HW' },
      { name: 'Nanda Devi Express', fromStation: 'New Delhi', toStation: 'Haridwar', durationHours: '5h 10m', priceFromINR: 320, irctcSearchQuery: 'NDLS-HW' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'DED', toCity: 'Dehradun', durationStr: '1h 10m', priceFromINR: 3200 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'DED', toCity: 'Dehradun', durationStr: '1h 50m', priceFromINR: 4800 },
    ],
    specialTransport: [
      { name: 'Shared Jeep / Cab', description: 'Haridwar → Badrinath · 315 km', priceRange: '₹500–₹800/seat', icon: 'jeep' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'Badri Ashram / Birla Dharamshala', priceRange: 'Free–₹300', bookingSearchQuery: 'Badrinath dharamshala' },
      { tier: 'Budget', name: 'Hotel Snow Crest', priceRange: '₹900–₹1,800', bookingSearchQuery: 'budget hotel Badrinath' },
      { tier: 'Comfort', name: 'Garhwal Mandal Vikas Nigam', priceRange: '₹2,500–₹4,000', bookingSearchQuery: 'GMVN Badrinath' },
    ],
  },
  varanasi: {
    destinationSlug: 'varanasi',
    nearestRailhead: 'Varanasi Junction (BSB)',
    nearestAirport: 'Lal Bahadur Shastri (VNS)',
    trainOptions: [
      { name: 'Kashi Express', fromStation: 'New Delhi', toStation: 'Varanasi', durationHours: '12h', priceFromINR: 480, irctcSearchQuery: 'NDLS-BSB' },
      { name: 'Vande Bharat Express', fromStation: 'New Delhi', toStation: 'Varanasi', durationHours: '8h', priceFromINR: 1755, irctcSearchQuery: 'NDLS-BSB' },
      { name: 'Poorva Express', fromStation: 'Mumbai', toStation: 'Varanasi', durationHours: '22h', priceFromINR: 640, irctcSearchQuery: 'CSTM-BSB' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'VNS', toCity: 'Varanasi', durationStr: '1h 30m', priceFromINR: 2800 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'VNS', toCity: 'Varanasi', durationStr: '1h 45m', priceFromINR: 3600 },
    ],
    specialTransport: [
      { name: 'Ganga Boat Ride', description: 'Dashashwamedh → Assi Ghat at sunrise', priceRange: '₹100–₹500/person', icon: 'ferry' },
      { name: 'Auto-rickshaw / E-rickshaw', description: 'City transport to all major ghats', priceRange: '₹30–₹150', icon: 'bus' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'Sankat Mochan Ashram Area', priceRange: '₹200–₹500', bookingSearchQuery: 'dharamshala Varanasi near ghats' },
      { tier: 'Budget', name: 'Zostel / Hotel Ganges View', priceRange: '₹800–₹1,500', bookingSearchQuery: 'budget hotel Varanasi ghats' },
      { tier: 'Comfort', name: 'BrijRama Palace / Radisson', priceRange: '₹4,000–₹12,000', bookingSearchQuery: 'Varanasi heritage hotel ghats' },
    ],
  },
  tirupati: {
    destinationSlug: 'tirupati',
    nearestRailhead: 'Tirupati (TPTY)',
    nearestAirport: 'Tirupati Airport (TIR)',
    trainOptions: [
      { name: 'Venkatadri Express', fromStation: 'Chennai', toStation: 'Tirupati', durationHours: '2h 30m', priceFromINR: 200, irctcSearchQuery: 'MAS-TPTY' },
      { name: 'Saptagiri Express', fromStation: 'Hyderabad', toStation: 'Tirupati', durationHours: '8h', priceFromINR: 310, irctcSearchQuery: 'HYB-TPTY' },
      { name: 'Rayalaseema Express', fromStation: 'New Delhi', toStation: 'Tirupati', durationHours: '26h', priceFromINR: 920, irctcSearchQuery: 'NDLS-TPTY' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'BOM', toCode: 'TIR', toCity: 'Tirupati', durationStr: '1h 40m', priceFromINR: 3500 },
      { airline: 'Air India', fromCode: 'DEL', toCode: 'TIR', toCity: 'Tirupati', durationStr: '2h 10m', priceFromINR: 4200 },
    ],
    specialTransport: [
      { name: 'TTD Bus (Alipiri → Temple)', description: 'Free TTD bus from Alipiri to Tirumala', priceRange: 'Free', icon: 'bus' },
      { name: 'Ropeway (Alipiri Mada)', description: 'Cable car up to Tirumala hill', priceRange: '₹95/person', icon: 'helicopter' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'TTD Cottages / Guest Houses', priceRange: '₹150–₹600 (TTD rates)', bookingSearchQuery: 'TTD accommodation Tirupati' },
      { tier: 'Budget', name: 'Hotel near Bus Stand', priceRange: '₹1,000–₹2,000', bookingSearchQuery: 'budget hotel Tirupati' },
      { tier: 'Comfort', name: 'Marasa Sarovar / Fortune', priceRange: '₹4,500–₹9,000', bookingSearchQuery: 'luxury hotel Tirupati' },
    ],
  },
  shirdi: {
    destinationSlug: 'shirdi',
    nearestRailhead: 'Sainagar Shirdi (SNSI)',
    nearestAirport: 'Shirdi Airport (SAG)',
    trainOptions: [
      { name: 'Mumbai–Shirdi Express', fromStation: 'Mumbai CST', toStation: 'Sainagar Shirdi', durationHours: '5h', priceFromINR: 290, irctcSearchQuery: 'CSTM-SNSI' },
      { name: 'Sai Nagari Express', fromStation: 'Hyderabad', toStation: 'Sainagar Shirdi', durationHours: '9h', priceFromINR: 380, irctcSearchQuery: 'HYB-SNSI' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'SAG', toCity: 'Shirdi', durationStr: '2h', priceFromINR: 3800 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'SAG', toCity: 'Shirdi', durationStr: '45m', priceFromINR: 2200 },
    ],
    specialTransport: [
      { name: 'Auto-rickshaw', description: 'Station → Sai Baba Samadhi Mandir', priceRange: '₹50–₹150', icon: 'bus' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'Shri Sai Baba Sansthan Trust Guest House', priceRange: '₹200–₹800', bookingSearchQuery: 'Sai Baba Sansthan trust accommodation' },
      { tier: 'Budget', name: 'Hotel Sai Residency', priceRange: '₹1,200–₹2,000', bookingSearchQuery: 'budget hotel Shirdi' },
      { tier: 'Comfort', name: 'Igatpuri Resort / Sai Palace', priceRange: '₹3,500–₹7,000', bookingSearchQuery: 'comfort hotel near Shirdi' },
    ],
  },
  vrindavan: {
    destinationSlug: 'vrindavan',
    nearestRailhead: 'Mathura Junction (MTJ)',
    nearestAirport: 'Agra Airport (AGR) / Hindon (HDO)',
    trainOptions: [
      { name: 'Bhopal Shatabdi', fromStation: 'New Delhi', toStation: 'Mathura', durationHours: '2h', priceFromINR: 495, irctcSearchQuery: 'NDLS-MTJ' },
      { name: 'Mumbai–Mathura Express', fromStation: 'Mumbai', toStation: 'Mathura', durationHours: '20h', priceFromINR: 560, irctcSearchQuery: 'CSTM-MTJ' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'BOM', toCode: 'AGR', toCity: 'Agra', durationStr: '1h 40m', priceFromINR: 3200 },
    ],
    specialTransport: [
      { name: 'E-rickshaw', description: 'Mathura station → Vrindavan Dham', priceRange: '₹50–₹100', icon: 'bus' },
      { name: 'Parikrama tempo', description: '5 km Vrindavan Parikrama route', priceRange: '₹30–₹60/person', icon: 'bus' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'ISKCON Guest House / Krishna Dhama', priceRange: '₹400–₹900', bookingSearchQuery: 'dharamshala Vrindavan' },
      { tier: 'Budget', name: 'Hotel near Banke Bihari', priceRange: '₹900–₹1,800', bookingSearchQuery: 'budget hotel Vrindavan' },
      { tier: 'Comfort', name: 'Radha Ashok Hotel / Club Mahindra', priceRange: '₹3,500–₹7,000', bookingSearchQuery: 'comfort hotel Vrindavan' },
    ],
  },
  mathura: {
    destinationSlug: 'mathura',
    nearestRailhead: 'Mathura Junction (MTJ)',
    nearestAirport: 'Agra Airport (AGR)',
    trainOptions: [
      { name: 'Bhopal Shatabdi', fromStation: 'New Delhi', toStation: 'Mathura', durationHours: '2h', priceFromINR: 495, irctcSearchQuery: 'NDLS-MTJ' },
      { name: 'Golden Temple Mail', fromStation: 'Mumbai', toStation: 'Mathura', durationHours: '19h', priceFromINR: 540, irctcSearchQuery: 'CSTM-MTJ' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'BOM', toCode: 'AGR', toCity: 'Agra', durationStr: '1h 40m', priceFromINR: 3200 },
    ],
    specialTransport: [
      { name: 'E-rickshaw / Auto', description: 'Between Mathura & Vrindavan (12 km)', priceRange: '₹50–₹150', icon: 'bus' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'Birla Dharamshala Mathura', priceRange: '₹150–₹500', bookingSearchQuery: 'dharamshala Mathura' },
      { tier: 'Budget', name: 'Hotel Brijwasi Royal', priceRange: '₹900–₹1,600', bookingSearchQuery: 'budget hotel Mathura' },
      { tier: 'Comfort', name: 'Radisson Mathura', priceRange: '₹3,800–₹6,500', bookingSearchQuery: 'Radisson Mathura' },
    ],
  },
  puri: {
    destinationSlug: 'puri',
    nearestRailhead: 'Puri (PURI)',
    nearestAirport: 'Biju Patnaik International (BBI) · 65 km',
    trainOptions: [
      { name: 'Puri Express', fromStation: 'New Delhi', toStation: 'Puri', durationHours: '26h', priceFromINR: 720, irctcSearchQuery: 'NDLS-PURI' },
      { name: 'Jagannath Express', fromStation: 'Kolkata', toStation: 'Puri', durationHours: '9h', priceFromINR: 290, irctcSearchQuery: 'HWH-PURI' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'BBI', toCity: 'Bhubaneswar', durationStr: '2h', priceFromINR: 3400 },
      { airline: 'IndiGo', fromCode: 'BOM', toCode: 'BBI', toCity: 'Bhubaneswar', durationStr: '2h', priceFromINR: 4100 },
    ],
    specialTransport: [
      { name: 'Auto-rickshaw to temple', description: 'Puri station → Jagannath Temple', priceRange: '₹50–₹100', icon: 'bus' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'Odia Seva Sadan / Jagannath Temple Trust', priceRange: '₹200–₹500', bookingSearchQuery: 'dharamshala Puri near Jagannath Temple' },
      { tier: 'Budget', name: 'Hotel Hans Coco Palms', priceRange: '₹1,200–₹2,000', bookingSearchQuery: 'budget hotel Puri sea view' },
      { tier: 'Comfort', name: 'Mayfair Heritage / Toshali Sands', priceRange: '₹5,000–₹12,000', bookingSearchQuery: 'luxury resort Puri' },
    ],
  },
  amritsar: {
    destinationSlug: 'amritsar',
    nearestRailhead: 'Amritsar Junction (ASR)',
    nearestAirport: 'Sri Guru Ram Dass Jee International (ATQ)',
    trainOptions: [
      { name: 'Shatabdi Express', fromStation: 'New Delhi', toStation: 'Amritsar', durationHours: '5h 45m', priceFromINR: 890, irctcSearchQuery: 'NDLS-ASR' },
      { name: 'Golden Temple Mail', fromStation: 'Mumbai', toStation: 'Amritsar', durationHours: '27h', priceFromINR: 680, irctcSearchQuery: 'CSTM-ASR' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'BOM', toCode: 'ATQ', toCity: 'Amritsar', durationStr: '2h', priceFromINR: 3600 },
      { airline: 'Air India', fromCode: 'DEL', toCode: 'ATQ', toCity: 'Amritsar', durationStr: '1h', priceFromINR: 2800 },
    ],
    specialTransport: [
      { name: 'E-rickshaw / Auto', description: 'Amritsar station → Golden Temple (3 km)', priceRange: '₹30–₹80', icon: 'bus' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'SGPC Sarai (Golden Temple Complex)', priceRange: 'Free–₹400', bookingSearchQuery: 'SGPC Sarai Golden Temple Amritsar' },
      { tier: 'Budget', name: 'Hotel near Golden Temple', priceRange: '₹1,000–₹2,000', bookingSearchQuery: 'budget hotel Amritsar near Golden Temple' },
      { tier: 'Comfort', name: 'Hyatt Amritsar / Ramada', priceRange: '₹5,000–₹10,000', bookingSearchQuery: 'luxury hotel Amritsar' },
    ],
  },
  char_dham: {
    destinationSlug: 'char_dham',
    nearestRailhead: 'Haridwar / Rishikesh',
    nearestAirport: 'Jolly Grant (DED)',
    trainOptions: [
      { name: 'Shatabdi Express', fromStation: 'New Delhi', toStation: 'Haridwar', durationHours: '4h 45m', priceFromINR: 610, irctcSearchQuery: 'NDLS-HW' },
      { name: 'Dehradun Express', fromStation: 'New Delhi', toStation: 'Dehradun', durationHours: '6h 20m', priceFromINR: 430, irctcSearchQuery: 'NDLS-DDN' },
      { name: 'Jan Shatabdi', fromStation: 'New Delhi', toStation: 'Rishikesh', durationHours: '5h 30m', priceFromINR: 280, irctcSearchQuery: 'NDLS-RKSH' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'DED', toCity: 'Dehradun', durationStr: '1h 10m', priceFromINR: 3200 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'DED', toCity: 'Dehradun', durationStr: '1h 50m', priceFromINR: 4800 },
    ],
    specialTransport: [
      { name: 'Helicopter to Kedarnath', description: 'Phata/Sitapur → Kedarnath · 8 min', priceRange: '₹3,500–₹4,200/person', bookingUrl: 'https://heliservices.uk.gov.in', icon: 'helicopter' },
      { name: 'Pony / Palki', description: 'Gaurikund → Kedarnath · 22 km', priceRange: '₹1,800–₹4,000', icon: 'pony' },
      { name: 'Shared Jeep', description: 'Rishikesh → circuit stops', priceRange: '₹400–₹800/seat', icon: 'jeep' },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala', name: 'GMVN Guest Houses (at each stop)', priceRange: 'Free–₹500', bookingSearchQuery: 'GMVN Char Dham accommodation' },
      { tier: 'Budget', name: 'Local circuit hotels', priceRange: '₹800–₹1,600', bookingSearchQuery: 'budget hotels Char Dham yatra' },
      { tier: 'Comfort', name: 'Garhwal Mandal / Eco-camps', priceRange: '₹2,500–₹5,000', bookingSearchQuery: 'Char Dham yatra comfort stay' },
    ],
  },
  sabarimala: {
    destinationSlug: 'sabarimala',
    nearestRailhead: 'Kottayam (KTYM) / Ernakulam (ERS)',
    nearestAirport: 'Cochin International (COK)',
    trainOptions: [
      { name: 'Sabari Express', fromStation: 'Chennai', toStation: 'Ernakulam', durationHours: '11h', priceFromINR: 420, irctcSearchQuery: 'MAS-ERS' },
      { name: 'Kochuveli Express', fromStation: 'New Delhi', toStation: 'Ernakulam', durationHours: '42h', priceFromINR: 1100, irctcSearchQuery: 'NDLS-ERS' },
      { name: 'Mumbai–Ernakulam SF', fromStation: 'Mumbai', toStation: 'Ernakulam', durationHours: '30h', priceFromINR: 780, irctcSearchQuery: 'CSTM-ERS' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'COK', toCity: 'Kochi', durationStr: '2h 40m', priceFromINR: 4200 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'COK', toCity: 'Kochi', durationStr: '1h 50m', priceFromINR: 3600 },
    ],
    specialTransport: [
      { name: 'KSRTC Bus Kottayam → Pamba', description: 'State bus to Pamba base camp (125 km)', priceRange: '₹120–₹200', icon: 'bus' as const },
      { name: 'Trek Pamba → Sannidhanam', description: '5 km sacred forest climb to the temple', priceRange: 'Free (porter ₹500–800)', icon: 'pony' as const },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala' as const, name: 'TDB Guest Houses (Pamba / Sannidhanam)', priceRange: '₹200–₹600', bookingSearchQuery: 'Sabarimala TDB accommodation' },
      { tier: 'Budget' as const, name: 'Hotels in Kottayam / Ernakulam', priceRange: '₹800–₹1,600', bookingSearchQuery: 'budget hotel Kottayam' },
      { tier: 'Comfort' as const, name: 'CGH Earth / Fragrant Nature Kochi', priceRange: '₹4,500–₹9,000', bookingSearchQuery: 'comfort hotel Kochi near Sabarimala' },
    ],
  },
  amarnath: {
    destinationSlug: 'amarnath',
    nearestRailhead: 'Jammu Tawi (JAT)',
    nearestAirport: 'Jammu Airport (IXJ)',
    trainOptions: [
      { name: 'Jammu Mail', fromStation: 'New Delhi', toStation: 'Jammu Tawi', durationHours: '8h', priceFromINR: 490, irctcSearchQuery: 'NDLS-JAT' },
      { name: 'Uttar Sampark Kranti', fromStation: 'Mumbai', toStation: 'Jammu Tawi', durationHours: '36h', priceFromINR: 810, irctcSearchQuery: 'CSTM-JAT' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'IXJ', toCity: 'Jammu', durationStr: '1h 15m', priceFromINR: 3500 },
      { airline: 'Air India', fromCode: 'BOM', toCode: 'IXJ', toCity: 'Jammu', durationStr: '2h', priceFromINR: 5200 },
    ],
    specialTransport: [
      { name: 'Helicopter to Holy Cave', description: 'Baltal / Pahalgam → Panjtarni → Cave · 7 min', priceRange: '₹4,500–₹5,500/person (return)', bookingUrl: 'https://www.shriamarnathjishrine.com', icon: 'helicopter' as const },
      { name: 'Trek Baltal route', description: 'Baltal → Holy Cave · 14 km (steep)', priceRange: 'Pony ₹300–₹600', icon: 'pony' as const },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala' as const, name: 'SASB Camps (Baltal / Pahalgam base)', priceRange: '₹200–₹500', bookingSearchQuery: 'Amarnath Yatra SASB camp' },
      { tier: 'Budget' as const, name: 'Pahalgam / Sonmarg guesthouses', priceRange: '₹1,200–₹2,500', bookingSearchQuery: 'budget hotel Pahalgam' },
      { tier: 'Comfort' as const, name: 'The Lalit / Vivanta Srinagar', priceRange: '₹6,000–₹15,000', bookingSearchQuery: 'luxury hotel Srinagar' },
    ],
  },
  vaishnodevi: {
    destinationSlug: 'vaishnodevi',
    nearestRailhead: 'Katra (SVDK)',
    nearestAirport: 'Jammu Airport (IXJ)',
    trainOptions: [
      { name: 'Vande Bharat Express', fromStation: 'New Delhi', toStation: 'Katra', durationHours: '8h', priceFromINR: 1800, irctcSearchQuery: 'NDLS-SVDK' },
      { name: 'Shri Shakti Express', fromStation: 'Mumbai', toStation: 'Jammu Tawi', durationHours: '36h', priceFromINR: 820, irctcSearchQuery: 'CSTM-JAT' },
    ],
    flightOptions: [
      { airline: 'IndiGo', fromCode: 'DEL', toCode: 'IXJ', toCity: 'Jammu', durationStr: '1h 15m', priceFromINR: 3500 },
      { airline: 'SpiceJet', fromCode: 'BOM', toCode: 'IXJ', toCity: 'Jammu', durationStr: '2h', priceFromINR: 4800 },
    ],
    specialTransport: [
      { name: 'Helicopter to Sanjichhat', description: 'Katra helipad → Sanjichhat · 5 min', priceRange: '₹1,300–₹2,000/person (one-way)', bookingUrl: 'https://www.maavaishnodevi.org', icon: 'helicopter' as const },
      { name: 'Pony / Palki to Bhavan', description: 'Katra → Bhavan · 14 km trek', priceRange: '₹600–₹1,200', icon: 'pony' as const },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala' as const, name: 'SMVDSB Guest Houses (Katra)', priceRange: '₹300–₹800', bookingSearchQuery: 'Vaishno Devi Shrine Board accommodation' },
      { tier: 'Budget' as const, name: 'Hotels in Katra', priceRange: '₹1,000–₹2,000', bookingSearchQuery: 'budget hotel Katra Vaishnodevi' },
      { tier: 'Comfort' as const, name: 'Welcomhotel Katra', priceRange: '₹5,000–₹10,000', bookingSearchQuery: 'luxury hotel Katra' },
    ],
  },
  rameshwaram: {
    destinationSlug: 'rameshwaram',
    nearestRailhead: 'Rameswaram (RMM)',
    nearestAirport: 'Madurai International (IXM) · 175 km',
    trainOptions: [
      { name: 'Rameswaram Express', fromStation: 'Chennai Egmore', toStation: 'Rameswaram', durationHours: '13h', priceFromINR: 380, irctcSearchQuery: 'MS-RMM' },
      { name: 'Sethu Express', fromStation: 'Chennai Egmore', toStation: 'Rameswaram', durationHours: '14h', priceFromINR: 310, irctcSearchQuery: 'MS-RMM' },
    ],
    flightOptions: [
      { airline: 'IndiGo / Air India', fromCode: 'DEL', toCode: 'IXM', toCity: 'Madurai', durationStr: '2h 30m', priceFromINR: 4500 },
      { airline: 'IndiGo / SpiceJet', fromCode: 'BOM', toCode: 'IXM', toCity: 'Madurai', durationStr: '1h 50m', priceFromINR: 3800 },
    ],
    specialTransport: [
      { name: 'Bus Madurai → Rameswaram', description: 'TNSTC AC bus · 175 km · 3.5 hr', priceRange: '₹150–₹250', icon: 'bus' as const },
    ],
    stayOptionsPerNight: [
      { tier: 'Dharamshala' as const, name: 'Temple Trust Choultry', priceRange: '₹200–₹600', bookingSearchQuery: 'Rameswaram temple choultry dharamshala' },
      { tier: 'Budget' as const, name: 'Hotel near Agni Tirtham', priceRange: '₹800–₹1,500', bookingSearchQuery: 'budget hotel Rameswaram' },
      { tier: 'Comfort' as const, name: 'Daiwik Hotels / Hotel Sea Wave', priceRange: '₹3,000–₹7,000', bookingSearchQuery: 'hotel Rameswaram comfort' },
    ],
  },
};

const SLUG_ALIASES: Record<string, string> = {
  // Kedarnath
  'kedarnath': 'kedarnath', 'kedarnath yatra': 'kedarnath', 'kedar': 'kedarnath',
  // Badrinath
  'badrinath': 'badrinath', 'badri': 'badrinath',
  // Char Dham
  'char_dham': 'char_dham', 'char dham': 'char_dham', 'chardham': 'char_dham',
  'char dham yatra': 'char_dham', 'chardhamyatra': 'char_dham',
  // Varanasi
  'varanasi': 'varanasi', 'kashi': 'varanasi', 'banaras': 'varanasi', 'benares': 'varanasi',
  'kashi ayodhya': 'varanasi', 'kashi–ayodhya': 'varanasi',
  // Tirupati
  'tirupati': 'tirupati', 'tirumala': 'tirupati',
  // Shirdi
  'shirdi': 'shirdi', 'sai baba': 'shirdi', 'saibaba': 'shirdi',
  'shirdi nashik': 'shirdi', 'shirdi–nashik': 'shirdi',
  // Vrindavan
  'vrindavan': 'vrindavan', 'vrindaban': 'vrindavan', 'brindavan': 'vrindavan',
  'vrindavan mathura': 'vrindavan', 'vrindavan–mathura': 'vrindavan',
  // Mathura
  'mathura': 'mathura', 'mathura yatra': 'mathura',
  // Puri
  'puri': 'puri', 'jagannath': 'puri', 'jagannadh': 'puri', 'puri jagannath': 'puri',
  // Amritsar
  'amritsar': 'amritsar', 'golden temple': 'amritsar',
  // Sabarimala
  'sabarimala': 'sabarimala', 'sabarimala yatra': 'sabarimala', 'sabarimala pilgrimage': 'sabarimala',
  'ayyappa': 'sabarimala', 'lord ayyappa': 'sabarimala',
  // Amarnath
  'amarnath': 'amarnath', 'amarnath yatra': 'amarnath', 'amarnath cave': 'amarnath',
  'amarnath pilgrimage': 'amarnath',
  // Vaishnodevi
  'vaishnodevi': 'vaishnodevi', 'vaishno devi': 'vaishnodevi', 'vaishno_devi': 'vaishnodevi',
  'mata vaishnodevi': 'vaishnodevi', 'katra': 'vaishnodevi',
  // Rameshwaram
  'rameshwaram': 'rameshwaram', 'rameswaram': 'rameshwaram', 'rameshwaram yatra': 'rameshwaram',
  'ramanathaswamy': 'rameshwaram', 'ramnad': 'rameshwaram',
};

export function getTravelOptions(rawSlug: string): DestinationTravelInfo | null {
  const normalised = rawSlug.toLowerCase().trim().replace(/_/g, ' ');
  const canonical =
    SLUG_ALIASES[normalised] ??
    SLUG_ALIASES[normalised.replace(/\s/g, '_')] ??
    rawSlug.toLowerCase().replace(/\s+/g, '_');
  return TRAVEL_OPTIONS[canonical] ?? null;
}

export function getAllDestinationSlugs(): string[] {
  return Object.keys(TRAVEL_OPTIONS);
}

export default TRAVEL_OPTIONS;
