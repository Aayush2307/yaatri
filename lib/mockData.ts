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


export type ExploreCircuit = {
  id: string;
  title: string;
  subtitle: string;
  tradition: string;
  count: string;
  primaryDeity: string;
  regions: string;
  recommendedFor: string;
  duration: string;
  bestSeason: string;
  significance: string;
  tags: string[];
  image: string;
  imagePrompt: string;
  href: string;
};

export const exploreCircuits: ExploreCircuit[] = [
  {
    id: 'jyotirlinga',
    title: 'Jyotirlinga',
    subtitle: 'The twelve sacred lights of Shiva',
    tradition: 'Shaiva',
    count: '12 temples',
    primaryDeity: 'Lord Shiva',
    regions: 'West, Central & South Bharat',
    recommendedFor: 'Shiva sadhana and moksha seekers',
    duration: '12–18 days',
    bestSeason: 'Oct–Mar',
    significance: 'A pan-Bharat path through the twelve jyotirlinga kshetras of Shiva.',
    tags: ['Moksha', 'Shiva', 'Temple Circuit'],
    image: '/images/yatras/jyotirlinga.jpg',
    imagePrompt: 'A cinematic devotional photograph of an ancient Shiva temple at dawn, soft mist, warm lamps, stone architecture, calm pilgrims, premium spiritual travel mood, no text',
    href: '/explore',
  },
  {
    id: 'shakti-peethas',
    title: '51 Shakti Peethas',
    subtitle: 'Sacred Devi energy centers across Bharat',
    tradition: 'Shakta',
    count: '51 sites',
    primaryDeity: 'Devi Shakti',
    regions: 'North, East, West & South Bharat',
    recommendedFor: 'Shakti upasana and healing journeys',
    duration: 'Phased multi-trip',
    bestSeason: 'Varies by region',
    significance: 'A sacred geography rooted in the Devi-Shakti parampara and peetha lore.',
    tags: ['Devi', 'Shakti', 'Energy Centers'],
    image: '/images/yatras/shakti-peetha.jpg',
    imagePrompt: 'A serene sacred Devi temple courtyard with red flowers, brass lamps, soft golden light, Indian spiritual atmosphere, elegant devotional travel photography, no text',
    href: '/explore/shakti-peethas',
  },
  {
    id: 'char-dham',
    title: 'Char Dham',
    subtitle: 'Four Himalayan abodes of purification and liberation',
    tradition: 'Himalayan Dharma',
    count: '4 dhams',
    primaryDeity: 'Yamuna, Ganga, Shiva, Vishnu',
    regions: 'Uttarakhand Himalaya',
    recommendedFor: 'Foundational pilgrimage seekers',
    duration: '10–12 days',
    bestSeason: 'May–Oct',
    significance: 'The classic high-altitude yatra through Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    tags: ['Himalaya', 'Purification', 'Moksha'],
    image: '/images/yatras/char-dham.jpg',
    imagePrompt: 'A Himalayan temple yatra scene with snow peaks, prayer flags, stone path, soft sunrise, pilgrims walking peacefully, premium devotional photography, no text',
    href: '/explore/char-dham',
  },
  {
    id: 'pitru-tarpan',
    title: 'Pitru Tarpan · Sacred Waters',
    subtitle: 'Ritual offerings by rivers and moksha ghats',
    tradition: 'Shraddha Parampara',
    count: 'Multi-ghat route',
    primaryDeity: 'Ancestors & sacred waters',
    regions: 'Ganga belt & key river ghats',
    recommendedFor: 'Pitru shanti and remembrance rites',
    duration: '4–7 days',
    bestSeason: 'Pitru Paksha & winter',
    significance: 'A guided path for ancestral offerings in sacred river traditions.',
    tags: ['Pitru', 'Ritual', 'River'],
    image: '/images/yatras/pitru-tarpan.jpg',
    imagePrompt: 'A peaceful sacred river ghat at sunrise with diya lamps floating on water, priests performing rituals in the distance, calm golden atmosphere, no text',
    href: '/plan',
  },
  {
    id: 'family-yatra',
    title: 'Family Yatra',
    subtitle: 'Balanced darshan journeys for all age groups',
    tradition: 'Grihastha Dharma',
    count: 'Flexible circuit',
    primaryDeity: 'Varies by family sankalp',
    regions: 'Pan-Bharat',
    recommendedFor: 'Families with elders and children',
    duration: '3–8 days',
    bestSeason: 'School breaks & mild weather',
    significance: 'Comfort-first devotional routes with paced travel, darshan slots, and family support.',
    tags: ['Family', 'Comfort', 'Guided'],
    image: '/images/yatras/family-yatra.jpg',
    imagePrompt: 'An Indian family walking together toward a temple entrance at sunrise, warm devotional mood, premium spiritual travel photography, no text',
    href: '/plan',
  },
];
