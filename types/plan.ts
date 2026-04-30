import type { SuggestedCircuit } from '@/types/yaatra';

export type TirthStatus = 'unvisited' | 'planned' | 'darshan_done';

export interface Tirth {
  id: string;
  name: string;
  state: string;
  deity: string;
  significance: string;
  distanceFromPrev: number;
  recommendedDays: number;
  status: TirthStatus;
}

export interface YatraRoute {
  circuit: SuggestedCircuit;
  tirths: Tirth[];
  totalKm: number;
  estimatedDays: number;
}

export interface Plan {
  routeId: string;
  selectedTirthIds: string[];
  departureDate: string | null;
  totalDays: number;
  phase: 'plan';
}
