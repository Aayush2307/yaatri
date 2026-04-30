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


export type SacredCircuit = {
  id: string;
  title: string;
  tradition: string;
  count?: string;
  primaryDeity?: string;
  regions: string[];
  recommendedFor: string[];
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  bestSeason?: string;
  routeStyle: 'Single city' | 'Regional circuit' | 'Multi-state' | 'Himalayan route';
  significance: string;
  routeSummary?: string;
  planningNotes: string[];
  meeraCanHelpWith: string[];
  tags: string[];
  image?: string;
  imagePrompt?: string;
  href: string;
};

export const sacredCircuits: SacredCircuit[] = [
  {
    id: 'char-dham',
    title: 'Char Dham Yatra',
    tradition: 'Himalayan Moksha Path',
    count: '4 dhams',
    primaryDeity: 'Yamuna Devi, Ganga Devi, Shiva, Vishnu',
    regions: ['Uttarakhand', 'Himalayas'],
    recommendedFor: ['Moksha', 'Family Yatra', 'Vishnu Darshan', 'Once-in-a-lifetime pilgrimage'],
    duration: '10–12 days',
    difficulty: 'Challenging',
    bestSeason: 'May–Oct',
    routeStyle: 'Himalayan route',
    routeSummary: 'Yamunotri → Gangotri → Kedarnath → Badrinath',
    significance: 'A sacred Himalayan progression through river origins, Shiva darshan, and Vishnu darshan.',
    planningNotes: ['Traditionally completed in clockwise order.', 'Weather, road conditions, and altitude need careful planning.', 'Senior citizens and families should plan rest days.', 'Darshan timing and hotel locations matter.'],
    meeraCanHelpWith: ['Route sequencing', 'Senior-friendly pacing', 'Stays and vehicle planning', 'Darshan timing'],
    tags: ['Moksha', 'Himalayas', 'Family', '10–12 days'],
    image: '/images/yatras/char-dham.jpg',
    imagePrompt: 'A Himalayan temple yatra scene with snow peaks, prayer flags, stone path, soft sunrise, pilgrims walking peacefully, premium devotional photography, no text',
    href: '/explore/char-dham',
  },
  {
    id: 'jyotirlinga',
    title: 'Jyotirlinga',
    tradition: 'Shiva Path',
    count: '12 jyotirlingas',
    primaryDeity: 'Shiva',
    regions: ['Across Bharat'],
    recommendedFor: ['Shiva Darshan', 'Moksha', 'Spiritual discipline', 'Regional temple circuits'],
    duration: '2–12 days',
    difficulty: 'Moderate',
    bestSeason: 'Year-round, varies by region',
    routeStyle: 'Multi-state',
    routeSummary: 'Plan one region at a time or complete all 12 over multiple journeys.',
    significance: 'Walk the path of Shiva through twelve sacred jyotirlinga traditions across Bharat.',
    planningNotes: ['Can be planned region-wise.', 'Good for shorter or phased yatras.', 'Some temples can be combined into multi-day circuits.', 'Best route depends on starting city.'],
    meeraCanHelpWith: ['Choosing the right jyotirlinga circuit', 'Route grouping', 'Darshan timing', 'Family-friendly pacing'],
    tags: ['Shiva', '12 temples', 'Moksha', 'Flexible'],
    image: '/images/yatras/jyotirlinga.jpg',
    imagePrompt: 'A cinematic devotional photograph of an ancient Shiva temple at dawn, soft mist, warm lamps, stone architecture, calm pilgrims, premium spiritual travel mood, no text',
    href: '/explore/jyotirlinga',
  },
  {
    id: 'shakti-peethas',
    title: '51 Shakti Peethas',
    tradition: 'Devi / Shakti Path',
    count: '51 sacred seats',
    primaryDeity: 'Devi',
    regions: ['Across Bharat'],
    recommendedFor: ['Shakti', 'Protection', 'Grace', 'Family blessings', 'Devi upasana'],
    duration: '2–10 days',
    difficulty: 'Moderate',
    bestSeason: 'Year-round, varies by region',
    routeStyle: 'Regional circuit',
    routeSummary: 'Best planned region-wise based on starting city and sankalp.',
    significance: 'A living map of Devi traditions rooted in sacred geography, devotion, and Shakti.',
    planningNotes: ['Region-wise planning is recommended.', 'Some peethas are easier for families and elders.', 'Temple timing and local rituals vary.', 'Good for protection, healing, and Devi sankalp.'],
    meeraCanHelpWith: ['Region-based Shakti Peetha planning', 'Temple selection', 'Local ritual guidance', 'Family-friendly travel support'],
    tags: ['Devi', 'Shakti', '51 sites', 'Energy centers'],
    image: '/images/yatras/shakti-peetha.jpg',
    imagePrompt: 'A serene sacred Devi temple courtyard with red flowers, brass lamps, soft golden light, Indian spiritual atmosphere, elegant devotional travel photography, no text',
    href: '/explore/shakti-peethas',
  },
  {
    id: 'pitru-tarpan',
    title: 'Pitru Tarpan',
    tradition: 'Sacred Waters',
    count: 'Ritual-focused yatra',
    primaryDeity: 'Ancestors / Sacred rivers',
    regions: ['Gaya', 'Haridwar', 'Prayagraj', 'Varanasi', 'Rameswaram'],
    recommendedFor: ['Ancestor peace', 'Family gratitude', 'Pitru shanti', 'Sacred water rituals'],
    duration: '1–3 days',
    difficulty: 'Easy',
    bestSeason: 'Pitru Paksha or family-chosen dates',
    routeStyle: 'Single city',
    routeSummary: 'Choose a sacred river or kshetra for ancestor remembrance and tarpan rituals.',
    significance: 'Offer gratitude and peace to ancestors through sacred water rituals guided by tradition.',
    planningNotes: ['Ritual date and location matter.', 'Usually shorter than major circuit yatras.', 'Priest coordination and timing are important.', 'Good for families seeking peace and remembrance.'],
    meeraCanHelpWith: ['Choosing the right location', 'Ritual timing', 'Priest coordination guidance', 'Family travel support'],
    tags: ['Pitru Shanti', 'Sacred waters', '1–3 days', 'Family'],
    image: '/images/yatras/pitru-tarpan.jpg',
    imagePrompt: 'A peaceful sacred river ghat at sunrise with diya lamps floating on water, priests performing rituals in the distance, calm golden atmosphere, no text',
    href: '/explore/pitru-tarpan',
  },
  {
    id: 'family-yatra',
    title: 'Family Yatra',
    tradition: 'Grihastha Blessings',
    count: 'Custom family journey',
    primaryDeity: 'Based on family sankalp',
    regions: ['Near your city', 'Regional circuits', 'Across Bharat'],
    recommendedFor: ['Parents', 'Children', 'Senior citizens', 'First-time pilgrims', 'Family blessings'],
    duration: '2–5 days',
    difficulty: 'Easy',
    bestSeason: 'Flexible',
    routeStyle: 'Regional circuit',
    routeSummary: 'A gentle temple journey planned around comfort, darshan, food, rest, and family needs.',
    significance: 'A peaceful yatra designed for family comfort, blessings, and low-stress darshan.',
    planningNotes: ['Best for families who want simple planning.', 'Prioritize shorter routes and fewer hotel changes.', 'Useful when travelling with elders or children.', 'Can be customized by city, time, and comfort level.'],
    meeraCanHelpWith: ['Choosing nearby temples', 'Senior-friendly planning', 'Food and stay preferences', 'Low-stress darshan schedule'],
    tags: ['Family', 'Senior-friendly', '2–5 days', 'Comfort'],
    image: '/images/yatras/family-yatra.jpg',
    imagePrompt: 'An Indian family walking together toward a temple entrance at sunrise, warm devotional mood, premium spiritual travel photography, no text',
    href: '/explore/family-yatra',
  },
];
