export type SuggestedCircuit = 'shakti_peethas' | 'char_dham' | 'jyotirlinga';

export interface Sankalp {
  id: string;
  label: string;
  description: string;
  suggestedCircuit: SuggestedCircuit;
  svgConcept: string;
}

export interface Yatra {
  sankalpId: string | null;
  circuit: SuggestedCircuit | null;
  startedAt: string | null;
  phase: 'sankalp' | 'plan' | 'darshan';
}
