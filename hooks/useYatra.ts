import { useEffect, useState } from 'react';
import type { Sankalp, Yatra } from '@/types/yaatra';

const DEFAULT_YATRA: Yatra = {
  sankalpId: null,
  circuit: null,
  startedAt: null,
  phase: 'sankalp',
};

export function useYatra() {
  const [yatra, setYatra] = useState<Yatra>(DEFAULT_YATRA);

  useEffect(() => {
    const stored = localStorage.getItem('yaatra_yatra');
    if (stored) {
      setYatra(JSON.parse(stored));
    }
  }, []);

  const selectSankalp = (sankalp: Sankalp) => {
    const updated: Yatra = {
      sankalpId: sankalp.id,
      circuit: sankalp.suggestedCircuit,
      startedAt: new Date().toISOString(),
      phase: 'sankalp',
    };
    setYatra(updated);
    localStorage.setItem('yaatra_yatra', JSON.stringify(updated));
  };

  const advanceToPlan = () => {
    const updated = { ...yatra, phase: 'plan' as const };
    setYatra(updated);
    localStorage.setItem('yaatra_yatra', JSON.stringify(updated));
  };

  return { yatra, selectSankalp, advanceToPlan };
}
