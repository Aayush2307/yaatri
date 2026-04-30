import type { SuggestedCircuit } from '@/types/yaatra';
import type { YatraRoute } from '@/types/plan';

export const CHAR_DHAM_ROUTE: YatraRoute = {
  circuit: 'char_dham',
  totalKm: 1600,
  estimatedDays: 24,
  tirths: [
    { id: 'yamunotri', name: 'Yamunotri', state: 'Uttarakhand', deity: 'Yamuna Devi', significance: 'Source of Yamuna — first gate of Char Dham.', distanceFromPrev: 0, recommendedDays: 2, status: 'unvisited' },
    { id: 'gangotri', name: 'Gangotri', state: 'Uttarakhand', deity: 'Ganga Devi', significance: 'Origin of the Ganges — seat of purity and liberation.', distanceFromPrev: 220, recommendedDays: 2, status: 'unvisited' },
    { id: 'kedarnath', name: 'Kedarnath', state: 'Uttarakhand', deity: 'Shiva', significance: 'Highest Jyotirlinga — above 3,500m, accessible only by foot.', distanceFromPrev: 240, recommendedDays: 3, status: 'unvisited' },
    { id: 'badrinath', name: 'Badrinath', state: 'Uttarakhand', deity: 'Vishnu', significance: 'Where Vishnu meditated — moksha for the devout pilgrim.', distanceFromPrev: 240, recommendedDays: 2, status: 'unvisited' },
  ],
};

export const JYOTIRLINGA_ROUTE: YatraRoute = {
  circuit: 'jyotirlinga',
  totalKm: 2800,
  estimatedDays: 18,
  tirths: [
    { id: 'somnath', name: 'Somnath', state: 'Gujarat', deity: 'Shiva', significance: 'Ancient western jyotirlinga on the Arabian coast.', distanceFromPrev: 0, recommendedDays: 2, status: 'unvisited' },
    { id: 'mahakaleshwar', name: 'Mahakaleshwar', state: 'Madhya Pradesh', deity: 'Shiva', significance: 'Seat of Mahakal, aligned with time and dissolution.', distanceFromPrev: 780, recommendedDays: 2, status: 'unvisited' },
    { id: 'trimbakeshwar', name: 'Trimbakeshwar', state: 'Maharashtra', deity: 'Shiva', significance: 'Jyotirlinga linked to origin streams of Godavari.', distanceFromPrev: 420, recommendedDays: 2, status: 'unvisited' },
  ],
};

export const SHAKTI_PEETHA_ROUTE: YatraRoute = {
  circuit: 'shakti_peethas',
  totalKm: 3200,
  estimatedDays: 20,
  tirths: [
    { id: 'kamakhya', name: 'Kamakhya', state: 'Assam', deity: 'Kamakhya Devi', significance: 'Core Shakti center associated with creation and fertility.', distanceFromPrev: 0, recommendedDays: 2, status: 'unvisited' },
    { id: 'kalighat', name: 'Kalighat', state: 'West Bengal', deity: 'Kali', significance: 'Tantric Devi peetha in the heart of Kolkata.', distanceFromPrev: 1030, recommendedDays: 2, status: 'unvisited' },
    { id: 'jwala-ji', name: 'Jwala Ji', state: 'Himachal Pradesh', deity: 'Jwala Devi', significance: 'Eternal flame manifestation of Devi Shakti.', distanceFromPrev: 1850, recommendedDays: 2, status: 'unvisited' },
  ],
};

export const ROUTES: Record<SuggestedCircuit, YatraRoute> = {
  char_dham: CHAR_DHAM_ROUTE,
  jyotirlinga: JYOTIRLINGA_ROUTE,
  shakti_peethas: SHAKTI_PEETHA_ROUTE,
};
