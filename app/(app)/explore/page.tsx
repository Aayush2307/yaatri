'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

// ── Types ────────────────────────────────────────────────────────────────────

type Difficulty = 'Easy' | 'Easy–Moderate' | 'Moderate' | 'Challenging';
type Tradition = 'Shaiva' | 'Shakti' | 'Vaishnav' | 'Tirtha';
type DurationBand = 'short' | 'medium' | 'long';

interface Yatra {
  id: string;
  name: string;
  region: string;
  tradition: Tradition;
  duration: string;
  durationBand: DurationBand;
  difficulty: Difficulty;
  priceFrom: string;
  season: string;
  groupSize: string;
  illustrationId: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const YATRAS: Yatra[] = [
  {
    id: 'char-dham',
    name: 'Char Dham Yatra',
    region: 'Uttarakhand',
    tradition: 'Shaiva',
    duration: '10–12 days',
    durationBand: 'long',
    difficulty: 'Challenging',
    priceFrom: '₹45,000+',
    season: 'Apr–Jun · Sep–Oct',
    groupSize: '10–30 pilgrims',
    illustrationId: 'char-dham',
  },
  {
    id: 'jyotirlinga',
    name: 'Jyotirlinga Circuit',
    region: 'Pan-India',
    tradition: 'Shaiva',
    duration: '2–12 days',
    durationBand: 'medium',
    difficulty: 'Moderate',
    priceFrom: '₹8,000+',
    season: 'Oct–Mar',
    groupSize: '5–20 pilgrims',
    illustrationId: 'jyotirlinga',
  },
  {
    id: 'vaishno-devi',
    name: 'Vaishno Devi Sankalp',
    region: 'Jammu & Kashmir',
    tradition: 'Shakti',
    duration: '2–3 days',
    durationBand: 'short',
    difficulty: 'Easy–Moderate',
    priceFrom: '₹12,000+',
    season: 'Mar–Oct',
    groupSize: '2–25 pilgrims',
    illustrationId: 'vaishno-devi',
  },
  {
    id: 'kashi-gaya-prayag',
    name: 'Kashi-Gaya-Prayag',
    region: 'Uttar Pradesh · Bihar',
    tradition: 'Tirtha',
    duration: '7 days',
    durationBand: 'medium',
    difficulty: 'Easy',
    priceFrom: '₹18,000+',
    season: 'Oct–Mar',
    groupSize: '5–30 pilgrims',
    illustrationId: 'kashi',
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath Shiva Yatra',
    region: 'Uttarakhand',
    tradition: 'Shaiva',
    duration: '5–7 days',
    durationBand: 'medium',
    difficulty: 'Challenging',
    priceFrom: '₹28,000+',
    season: 'May–Jun · Sep–Oct',
    groupSize: '5–25 pilgrims',
    illustrationId: 'kedarnath',
  },
  {
    id: 'shirdi-nashik',
    name: 'Shirdi–Nashik–Trimbakeshwar',
    region: 'Maharashtra',
    tradition: 'Vaishnav',
    duration: '4–5 days',
    durationBand: 'medium',
    difficulty: 'Easy',
    priceFrom: '₹15,000+',
    season: 'Year-round',
    groupSize: '5–30 pilgrims',
    illustrationId: 'shirdi',
  },
];

// ── Illustrations (woodblock stamp style) ────────────────────────────────────

function YatraIllustration({ id }: { id: string }) {
  switch (id) {
    case 'char-dham':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <line x1="10" y1="95" x2="150" y2="95" stroke="#C85A1E" strokeWidth="1.5" />
          <rect x="15" y="88" width="130" height="7" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <rect x="18" y="68" width="20" height="20" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <polygon points="18,68 28,52 38,68" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="28" y1="52" x2="28" y2="46" stroke="#C85A1E" strokeWidth="1" />
          <rect x="45" y="62" width="24" height="26" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <polygon points="45,62 57,44 69,62" fill="none" stroke="#C85A1E" strokeWidth="1.3" />
          <line x1="57" y1="44" x2="57" y2="37" stroke="#C85A1E" strokeWidth="1" />
          <rect x="75" y="55" width="28" height="33" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="75,55 89,32 103,55" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <line x1="89" y1="32" x2="89" y2="22" stroke="#C85A1E" strokeWidth="1.2" />
          <circle cx="89" cy="20" r="3" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="89" y1="17" x2="89" y2="13" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="89" cy="11" r="2" fill="#C85A1E" />
          <rect x="112" y="62" width="24" height="26" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <polygon points="112,62 124,44 136,62" fill="none" stroke="#C85A1E" strokeWidth="1.3" />
          <line x1="124" y1="44" x2="124" y2="37" stroke="#C85A1E" strokeWidth="1" />
          <line x1="75" y1="65" x2="103" y2="65" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="75" y1="72" x2="103" y2="72" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="75" y1="79" x2="103" y2="79" stroke="#C85A1E" strokeWidth="0.5" />
        </svg>
      );

    case 'jyotirlinga':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <ellipse cx="80" cy="82" rx="30" ry="10" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <rect x="68" y="45" width="24" height="37" rx="12" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <ellipse cx="80" cy="45" rx="12" ry="5" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <path d="M62,40 Q50,28 56,18 Q66,26 62,40Z" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="62" y1="40" x2="65" y2="46" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M80,35 Q80,20 80,12 Q87,20 80,35Z" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="80" y1="35" x2="80" y2="45" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M98,40 Q110,28 104,18 Q94,26 98,40Z" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="98" y1="40" x2="95" y2="46" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M50,78 Q55,68 65,70 Q75,72 80,68 Q85,64 95,68 Q105,72 108,82" fill="none" stroke="#C85A1E" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="110" cy="80" rx="4" ry="3" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <path d="M114,79 L118,77 M114,81 L118,83" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M80,20 Q79,16 80,13 Q81,16 80,20Z" fill="#C85A1E" />
        </svg>
      );

    case 'vaishno-devi':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <polyline points="15,95 45,42 68,62 95,18 122,52 148,95" fill="none" stroke="#C85A1E" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="95" y1="18" x2="95" y2="6" stroke="#C85A1E" strokeWidth="1.2" />
          <polygon points="95,6 106,10 95,14" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="45" y1="42" x2="45" y2="30" stroke="#C85A1E" strokeWidth="1" />
          <line x1="41" y1="34" x2="45" y2="29" stroke="#C85A1E" strokeWidth="1" />
          <line x1="49" y1="34" x2="45" y2="29" stroke="#C85A1E" strokeWidth="1" />
          <path d="M78,95 Q95,72 112,95" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <line x1="95" y1="95" x2="95" y2="78" stroke="#C85A1E" strokeWidth="0.7" />
          <path d="M60,95 L65,89 L70,89 L75,83 L80,83 L85,78" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M105,78 L110,83 L115,83 L120,89 L125,89 L130,95" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="10" y1="95" x2="150" y2="95" stroke="#C85A1E" strokeWidth="1.5" />
          <path d="M10,102 Q50,98 95,103 Q130,107 150,102" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <circle cx="95" cy="5" r="2" fill="#C85A1E" />
        </svg>
      );

    case 'kashi':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <path d="M10,88 Q40,83 80,88 Q120,93 150,86" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <path d="M10,98 Q40,94 80,99 Q120,104 150,98" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <rect x="20" y="72" width="120" height="4" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <rect x="14" y="76" width="132" height="5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <rect x="8" y="81" width="144" height="7" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <rect x="62" y="46" width="36" height="26" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="62,46 80,20 98,46" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <line x1="80" y1="20" x2="80" y2="10" stroke="#C85A1E" strokeWidth="1.2" />
          <circle cx="80" cy="8" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="80" cy="7" r="1.2" fill="#C85A1E" />
          <line x1="64" y1="60" x2="96" y2="60" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="64" y1="66" x2="96" y2="66" stroke="#C85A1E" strokeWidth="0.5" />
          <rect x="27" y="56" width="22" height="16" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <polygon points="27,56 38,40 49,56" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="38" y1="40" x2="38" y2="33" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="38" cy="32" r="1.5" fill="#C85A1E" />
          <rect x="111" y="56" width="22" height="16" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <polygon points="111,56 122,41 133,56" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="122" y1="41" x2="122" y2="34" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="122" cy="33" r="1.5" fill="#C85A1E" />
          <circle cx="34" cy="80" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="34" y1="77" x2="34" y2="72" stroke="#C85A1E" strokeWidth="0.7" />
          <circle cx="80" cy="80" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="80" y1="77" x2="80" y2="72" stroke="#C85A1E" strokeWidth="0.7" />
          <circle cx="126" cy="80" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="126" y1="77" x2="126" y2="72" stroke="#C85A1E" strokeWidth="0.7" />
        </svg>
      );

    case 'kedarnath':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <line x1="10" y1="93" x2="150" y2="93" stroke="#C85A1E" strokeWidth="1.5" />
          <polyline points="10,93 32,38 55,62 80,18 105,50 128,32 150,93" fill="none" stroke="#C85A1E" strokeWidth="1.2" strokeLinejoin="round" />
          <polyline points="73,26 80,18 87,26" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <polyline points="122,39 128,32 134,40" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <polyline points="26,45 32,38 38,46" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <rect x="58" y="68" width="44" height="25" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="58,68 80,40 102,68" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="63,68 80,48 97,68" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <polygon points="68,68 80,55 92,68" fill="none" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="80" y1="40" x2="80" y2="30" stroke="#C85A1E" strokeWidth="1.2" />
          <ellipse cx="80" cy="29" rx="4" ry="2" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="80" y1="27" x2="80" y2="22" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="80" cy="21" r="2" fill="#C85A1E" />
          <path d="M71,93 L71,79 Q80,72 89,79 L89,93" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="60" y1="79" x2="100" y2="79" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="60" y1="84" x2="100" y2="84" stroke="#C85A1E" strokeWidth="0.5" />
          <rect x="53" y="93" width="54" height="4" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <rect x="47" y="97" width="66" height="4" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
        </svg>
      );

    case 'shirdi':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <line x1="10" y1="93" x2="150" y2="93" stroke="#C85A1E" strokeWidth="1.5" />
          <rect x="42" y="58" width="76" height="35" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <path d="M52,58 Q80,26 108,58" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <rect x="66" y="52" width="28" height="8" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="80" y1="26" x2="80" y2="16" stroke="#C85A1E" strokeWidth="1.2" />
          <ellipse cx="80" cy="15" rx="3.5" ry="2" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="80" cy="13" r="2" fill="#C85A1E" />
          <path d="M42,65 Q54,52 66,65" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <path d="M94,65 Q106,52 118,65" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <path d="M65,93 L65,75 Q80,63 95,75 L95,93" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <path d="M47,85 L47,73 Q54,66 61,73 L61,85" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M99,85 L99,73 Q106,66 113,73 L113,85" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="42" y1="73" x2="118" y2="73" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="42" y1="79" x2="118" y2="79" stroke="#C85A1E" strokeWidth="0.5" />
          <rect x="36" y="93" width="88" height="4" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <rect x="30" y="97" width="100" height="4" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <circle cx="80" cy="85" r="4" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="80" y1="81" x2="80" y2="79" stroke="#C85A1E" strokeWidth="0.7" />
          <line x1="80" y1="89" x2="80" y2="91" stroke="#C85A1E" strokeWidth="0.7" />
          <line x1="76" y1="85" x2="74" y2="85" stroke="#C85A1E" strokeWidth="0.7" />
          <line x1="84" y1="85" x2="86" y2="85" stroke="#C85A1E" strokeWidth="0.7" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <circle cx="80" cy="55" r="30" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <circle cx="80" cy="55" r="2" fill="#C85A1E" />
        </svg>
      );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const DIFFICULTY_LEVELS: Record<Difficulty, number> = {
  'Easy': 1,
  'Easy–Moderate': 2,
  'Moderate': 3,
  'Challenging': 4,
};

const TRADITION_COLORS: Record<Tradition, string> = {
  Shaiva: '#C85A1E',
  Shakti: '#9B3060',
  Vaishnav: '#2B5C8A',
  Tirtha: '#3B6E4A',
};

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="text-[11px] flex-shrink-0" style={{ color: '#A68965' }}>{label}</span>
      <span className="text-[11px] text-right leading-tight" style={{ color: '#2C1A0E' }}>{value}</span>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

function YatraCard({ yatra, onMeera, onCard }: {
  yatra: Yatra;
  onMeera: () => void;
  onCard: () => void;
}) {
  const filled = DIFFICULTY_LEVELS[yatra.difficulty];
  const traditionColor = TRADITION_COLORS[yatra.tradition];

  return (
    <div
      onClick={onCard}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: '#FBF5E8',
        border: '1.5px solid #F2C97E',
        boxShadow: 'inset 0 0 0 1px rgba(200,90,30,0.1), 0 2px 16px rgba(44,26,14,0.07)',
      }}
    >
      {/* Illustration */}
      <div
        className="w-full"
        style={{ height: 110, background: '#EDE4CC', padding: '6px 8px 4px' }}
      >
        <YatraIllustration id={yatra.illustrationId} />
      </div>

      {/* Tradition + duration band */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid rgba(242,201,126,0.5)' }}
      >
        <span
          className="text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 rounded-sm"
          style={{ background: traditionColor, color: '#FBF5E8' }}
        >
          {yatra.tradition}
        </span>
        <span className="text-[10px]" style={{ color: '#A68965' }}>{yatra.duration}</span>
      </div>

      {/* Name */}
      <div className="px-3 pt-3 pb-2">
        <h3 className="font-serif text-lg leading-tight" style={{ color: '#2C1A0E' }}>
          {yatra.name}
        </h3>
      </div>

      {/* Data table */}
      <div
        className="px-3 py-2 mx-3 rounded-lg"
        style={{
          background: 'rgba(237,228,204,0.5)',
          border: '1px solid rgba(242,201,126,0.4)',
        }}
      >
        <DataRow label="Region" value={yatra.region} />
        <DataRow label="Season" value={yatra.season} />
        <div className="flex items-center justify-between gap-2 py-0.5">
          <span className="text-[11px] flex-shrink-0" style={{ color: '#A68965' }}>Difficulty</span>
          <span className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: i <= filled ? '#C85A1E' : 'rgba(200,90,30,0.18)' }}
              />
            ))}
            <span className="text-[11px] ml-1" style={{ color: '#2C1A0E' }}>{yatra.difficulty}</span>
          </span>
        </div>
        <DataRow label="Group" value={yatra.groupSize} />
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between px-3 pt-3 pb-3 gap-2">
        <div>
          <span
            className="block text-[9px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: '#A68965' }}
          >
            from
          </span>
          <span className="font-serif text-lg leading-none" style={{ color: '#2C1A0E' }}>
            {yatra.priceFrom}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMeera();
          }}
          className="text-[12px] font-semibold px-4 py-2 rounded-full flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ background: '#C85A1E', color: '#FBF5E8' }}
        >
          Talk to Meera
        </button>
      </div>
    </div>
  );
}

// ── Filters ───────────────────────────────────────────────────────────────────

const TRADITION_FILTERS: Array<Tradition | 'all'> = ['all', 'Shaiva', 'Shakti', 'Vaishnav', 'Tirtha'];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');

  const displayed = filter === 'all'
    ? YATRAS
    : YATRAS.filter((y) => y.tradition === filter);

  return (
    <main className="min-h-[100dvh] flex flex-col" style={{ background: '#F5EDD9', color: '#2C1A0E' }}>
      <div className="mx-auto w-full px-4 md:px-8 lg:px-12 pt-6 md:pt-10 flex-1">
        <BackButton />

        {/* Header */}
        <section className="mt-4 md:mt-2">
          <p className="text-sm tracking-[0.12em]" style={{ color: '#A68965' }}>Explore Yatras</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Where does your sankalp call you?</h1>
          <p className="pt-3 text-sm leading-relaxed" style={{ color: '#7A5C42' }}>
            Choose a sacred path based on intention, tradition, season, and family needs.
          </p>
        </section>

        {/* Sacred Almanac heading + filter row */}
        <section className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-bold uppercase tracking-[3px]"
                style={{ color: '#A68965' }}
              >
                Sacred Almanac
              </span>
              <span style={{ color: '#F2C97E', fontSize: 10 }}>✦</span>
            </div>
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, #F2C97E 0%, transparent 100%)' }}
            />
          </div>

          {/* Tradition filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {TRADITION_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className="text-[11px] font-semibold whitespace-nowrap px-3 py-1.5 rounded-full border flex-shrink-0 transition-all"
                style={{
                  background: filter === t ? '#C85A1E' : '#FBF5E8',
                  color: filter === t ? '#FBF5E8' : '#7A5C42',
                  borderColor: filter === t ? '#C85A1E' : '#F2C97E',
                }}
              >
                {t === 'all' ? 'All Traditions' : t}
              </button>
            ))}
          </div>
        </section>

        {/* Cards grid */}
        <section className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((yatra) => (
            <YatraCard
              key={yatra.id}
              yatra={yatra}
              onCard={() => router.push('/plan')}
              onMeera={() =>
                router.push(
                  `/concierge?q=${encodeURIComponent('I want to know more about ' + yatra.name)}`,
                )
              }
            />
          ))}
        </section>

        {/* Not sure where to begin */}
        <section
          className="mt-6 rounded-2xl p-4"
          style={{ border: '1.5px solid #F2C97E', background: '#FBF5E8' }}
        >
          <h2 className="font-serif text-xl">Not sure where to begin?</h2>
          <p className="pt-2 text-sm leading-relaxed" style={{ color: '#7A5C42' }}>
            Meera can help you choose the right yatra based on your sankalp, family, dates, and starting city.
          </p>
          <button
            type="button"
            onClick={() =>
              router.push(
                '/concierge?q=' +
                  encodeURIComponent(
                    'Namaste Meera, help me choose the right yatra for my sankalp, family, dates, and starting city.',
                  ),
              )
            }
            className="mt-3 text-sm font-medium"
            style={{ color: '#C85A1E' }}
          >
            Talk to Meera →
          </button>
        </section>
      </div>

    </main>
  );
}
