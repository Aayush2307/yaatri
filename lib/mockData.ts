export const circuits = [
  { id: 'kashi-prayag', name: 'Kashi–Prayagraj', stops: 'Varanasi · Prayagraj', nights: '4N', price: '₹22,500', gradient: 'var(--gradient-kashi)' },
  { id: 'vaishno-devi', name: 'Vaishno Devi', stops: 'Katra · Ardhkuwari', nights: '3N', price: '₹18,900', gradient: 'var(--gradient-vaishno)' },
  { id: 'ujjain-omkareshwar', name: 'Ujjain–Omkareshwar', stops: 'Mahakal · Omkareshwar', nights: '4N', price: '₹24,000', gradient: 'var(--gradient-ujjain)' },
  { id: 'shirdi-nashik', name: 'Shirdi–Nashik', stops: 'Sai Mandir · Trimbak', nights: '3N', price: '₹19,500', gradient: 'var(--gradient-shirdi)' },
];

export type ShaktiPeetha = {
  id: string;
  name: string;
  devi: string;
  bhairava: string;
  bodyPart: string;
  location: string;
  state: string;
  region: string;
  significance: string;
  travel: {
    nearestAirport?: string;
    nearestRailway?: string;
    distanceFromCity?: string;
  };
  darshan?: {
    timings?: string;
  };
};

export const shaktiPeethas: ShaktiPeetha[] = [
  {
    id: 'kamakhya',
    name: 'Kamakhya',
    devi: 'Kamakhya Devi',
    bhairava: 'Umananda',
    bodyPart: 'Yoni',
    location: 'Guwahati',
    state: 'Assam',
    region: 'North-East',
    significance: 'One of the most powerful Shakti Peethas, associated with creation and fertility.',
    travel: {
      nearestAirport: 'Guwahati Airport',
      nearestRailway: 'Guwahati Junction',
    },
    darshan: {
      timings: 'Varies (closed during Ambubachi)',
    },
  },
  {
    id: 'kalighat',
    name: 'Kalighat',
    devi: 'Kali',
    bhairava: 'Nakuleshwar',
    bodyPart: 'Toe',
    location: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    significance: 'Major Shakti Peetha linked to intense tantric traditions.',
    travel: {},
  },
  {
    id: 'jwala-ji',
    name: 'Jwala Ji',
    devi: 'Jwala Devi',
    bhairava: 'Unmatta Bhairava',
    bodyPart: 'Tongue',
    location: 'Kangra',
    state: 'Himachal Pradesh',
    region: 'North',
    significance: 'Known for eternal flame manifestation of Devi.',
    travel: {},
  },
  {
    id: 'naina-devi',
    name: 'Naina Devi',
    devi: 'Naina Devi',
    bhairava: 'Krodha Bhairava',
    bodyPart: 'Eyes',
    location: 'Bilaspur',
    state: 'Himachal Pradesh',
    region: 'North',
    significance: 'Mountain Shakti circuit with strong accessibility.',
    travel: {
      nearestAirport: 'Chandigarh',
      nearestRailway: 'Anandpur Sahib',
      distanceFromCity: '110 km from Chandigarh',
    },
    darshan: {
      timings: '05:00 – 22:00',
    },
  },
];


export type CharDhamTemple = {
  id: string;
  name: string;
  deity: string;
  location: string;
  state: string;
  altitude?: string;
  significance: string;
  travel: {
    access: string;
    trek?: string;
  };
  darshan?: {
    season: string;
    timings?: string;
  };
};

export const charDham: CharDhamTemple[] = [
  {
    id: 'yamunotri',
    name: 'Yamunotri',
    deity: 'Goddess Yamuna',
    location: 'Uttarkashi',
    state: 'Uttarakhand',
    altitude: '3293m',
    significance: 'Source of River Yamuna; associated with protection and purity.',
    travel: {
      access: 'Road till Janki Chatti',
      trek: '6 km trek',
    },
    darshan: {
      season: 'May – October',
    },
  },
  {
    id: 'gangotri',
    name: 'Gangotri',
    deity: 'Goddess Ganga',
    location: 'Uttarkashi',
    state: 'Uttarakhand',
    altitude: '3100m',
    significance: 'Origin of the sacred Ganga; symbol of purification.',
    travel: {
      access: 'Direct road access',
    },
    darshan: {
      season: 'May – October',
    },
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath',
    deity: 'Lord Shiva',
    location: 'Rudraprayag',
    state: 'Uttarakhand',
    altitude: '3583m',
    significance: 'One of the 12 Jyotirlingas; associated with moksha and liberation.',
    travel: {
      access: 'Road till Gaurikund',
      trek: '16 km trek',
    },
    darshan: {
      season: 'May – October',
    },
  },
  {
    id: 'badrinath',
    name: 'Badrinath',
    deity: 'Lord Vishnu',
    location: 'Chamoli',
    state: 'Uttarakhand',
    altitude: '3133m',
    significance: 'Major Vishnu temple; represents spiritual enlightenment.',
    travel: {
      access: 'Direct road access',
    },
    darshan: {
      season: 'May – October',
    },
  },
];

export const meera = {
  name: 'Meera',
  role: 'Spiritual concierge',
  online: true,
  lastMessage: 'I have held your darshan window for Friday morning.',
};

export const panchangCard = {
  tithi: 'Shukla Ekadashi',
  sanskrit: 'शुक्ल एकादशी',
  muhurat: 'Brahma Muhurta · 4:18–5:02 AM',
};

export const sampleTrip = {
  name: 'Kashi Darshan Yatra',
  dates: '12 Jun – 16 Jun',
  progress: 64,
};
