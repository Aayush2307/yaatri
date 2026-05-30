import { ItineraryCard } from '@/components/concierge/ItineraryCard';
import type { GeneratedItinerary } from '@/types/yatra';

// Hardcoded sample for design review — not wired to any API
const SAMPLE_ITINERARY: GeneratedItinerary = {
  title: 'Char Dham Yatra 2026',
  destination: 'Char Dham',
  duration: '12 Days / 11 Nights',
  blessing:
    'June blesses your Char Dham journey with the auspiciousness of Nirjala Ekadashi and Jyeshtha Purnima — a rare alignment that amplifies the merit of every step. Your group of four carries collective sankalp that opens divine doors at each of the four dhams.',
  summary:
    'Walk the four sacred abodes of the divine — Yamunotri, Gangotri, Kedarnath and Badrinath — in a journey that has purified pilgrims for centuries. Each step brings you closer to moksha.',
  insiderSecret:
    'At Kedarnath, request the Panchamrit Abhishek at the first darshan slot (4:30 AM brahma muhurta). The sanctum is quieter, the priest less rushed, and the prasad more generous. This slot books out by October for the following season — reserve it through the Kedarnath Temple Trust portal.',
  days: [
    {
      day: 'Day 1',
      title: 'Arrival in Haridwar',
      description: 'Begin your sacred journey at the gateway of the Himalayas. Evening Ganga Aarti at Har Ki Pauri fills the soul with divine light.',
      highlights: ['Har Ki Pauri aarti', 'Mansa Devi darshan', 'Chandni Ghat'],
      stay: 'Comfortable guesthouse near ghats',
    },
    {
      day: 'Day 2',
      title: 'Journey to Yamunotri',
      description: 'Travel to Hanuman Chatti and trek 6km to the sacred Yamunotri temple, source of the Yamuna river.',
      highlights: ['Yamunotri temple darshan', 'Surya Kund hot spring', 'Divya Shila puja'],
      stay: 'Dharamshala near Yamunotri',
    },
    {
      day: 'Day 3–4',
      title: 'Gangotri — Source of the Ganga',
      description: 'Visit the Gangotri temple where Goddess Ganga descended to earth. Bathe in the sacred Bhagirathi river.',
      highlights: ['Gangotri temple puja', 'Bhagirathi snan', 'Suryakund', 'Gauri Kund'],
      stay: 'Guesthouse in Gangotri',
    },
    {
      day: 'Day 5',
      title: 'Trek to Kedarnath',
      description: 'Embark on the iconic 16km trek to Lord Shiva\'s divine mountain abode, one of the twelve Jyotirlingas.',
      highlights: ['Kedarnath temple darshan', 'Rudra puja', 'Shankaracharya samadhi'],
      stay: 'Kedarnath guesthouse (deluxe)',
    },
    {
      day: 'Day 6',
      title: 'Abhishek at Kedarnath',
      description: 'Early morning abhishek puja and special VIP darshan at the Kedarnath jyotirlinga before descending.',
      highlights: ['Morning abhishek', 'Bhairav mandir', 'Gaurikund hot springs'],
      stay: 'Guptkashi hotel',
    },
    {
      day: 'Day 7–8',
      title: 'Badrinath — Abode of Vishnu',
      description: 'Journey to the final and most revered of the Char Dhams — Badrinath, where Lord Vishnu meditates eternally.',
      highlights: ['Badrinath temple darshan', 'Tapt Kund bath', 'Brahma Kapal puja', 'Mana village'],
      stay: 'Deluxe hotel in Badrinath',
    },
    {
      day: 'Day 9',
      title: 'Abhishek at Badrinath',
      description: 'Participate in the sacred Maha Abhishek ceremony and visit the last Indian village of Mana before the Tibet border.',
      highlights: ['Maha Abhishek', 'Vyas Gufa', 'Ganesh Gufa', 'Saraswati River'],
      stay: 'Deluxe hotel in Badrinath',
    },
    {
      day: 'Day 10',
      title: 'Return to Rishikesh',
      description: 'Begin the return journey via Joshimath with a visit to Shankaracharya\'s celebrated math and Narsingh temple.',
      highlights: ['Shankaracharya Math', 'Narsingh temple', 'Triveni Ghat'],
      stay: 'Heritage hotel in Rishikesh',
    },
    {
      day: 'Day 11',
      title: 'Rishikesh Blessings',
      description: 'Morning yoga and meditation on the banks of the Ganga, followed by darshan at Neelkanth Mahadev temple.',
      highlights: ['Neelkanth Mahadev', 'Parmarth Niketan aarti', 'Laxman Jhula'],
      stay: 'Heritage hotel in Rishikesh',
    },
    {
      day: 'Day 12',
      title: 'Departure from Haridwar',
      description: 'Final Ganga snan at Har Ki Pauri to seal the blessings of the complete Char Dham Yatra before departure.',
      highlights: ['Final Ganga snan', 'Har Ki Pauri', 'Prasad collection'],
    },
  ],
  auspiciousDates: [
    'June 3 – Shani Pradosh (highly auspicious for Shiva darshan)',
    'June 11 – Nirjala Ekadashi (most sacred Ekadashi of the year)',
    'June 21 – Jyeshtha Purnima (full moon darshan brings tenfold merit)',
  ],
  estimatedCostRange: '₹38,500 – ₹52,000 per person',
  includes: [
    'All accommodation (11 nights)',
    'Haridwar–Haridwar road transfers',
    'Kedarnath helicopter (optional upgrade)',
    'Temple puja arrangements & prasad',
    'Certified pilgrimage guide throughout',
    'Vegetarian meals at all stops',
    'Darshan assistance & queue management',
  ],
  notes:
    'Carry warm layers even in June — Kedarnath and Badrinath can be cold at night. Medical fitness is advisable for the Kedarnath trek.',
};

export default function ItineraryPreviewPage() {
  return (
    <div className="min-h-screen bg-bg-light px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="font-serif text-2xl text-text-dark">Itinerary Card Preview</h1>
          <p className="text-xs text-text-muted mt-1">Full variant — for design review only</p>
        </div>

        <ItineraryCard
          itinerary={SAMPLE_ITINERARY}
          fromCity="Mumbai"
          travelMonth="Jun 2026"
          groupSize={4}
        />

        <div className="mt-10 mb-4">
          <h2 className="font-serif text-lg text-text-dark">Compact variant</h2>
          <p className="text-xs text-text-muted mt-1">As rendered inline in chat</p>
        </div>

        <div className="max-w-sm">
          <ItineraryCard
            itinerary={SAMPLE_ITINERARY}
            compact
            fromCity="Mumbai"
            travelMonth="Jun 2026"
            groupSize={4}
          />
        </div>
      </div>
    </div>
  );
}
