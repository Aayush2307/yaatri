import { useMemo, useState } from 'react';
import { ROUTES } from '@/data/routes';
import type { Plan, Tirth } from '@/types/plan';
import type { SuggestedCircuit } from '@/types/yaatra';

export function usePlan(circuit: SuggestedCircuit) {
  const route = ROUTES[circuit];
  const [tirths, setTirths] = useState<Tirth[]>(() => {
    const stored = localStorage.getItem('yaatra_plan');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.circuit === circuit && Array.isArray(parsed.tirths)) return parsed.tirths;
    }
    return route.tirths;
  });
  const [departureDate, setDepartureDate] = useState<string | null>(null);

  const toggleTirth = (id: string) => {
    setTirths((prev) => {
      const next = prev.map((t) => {
        if (t.id !== id) return t;
        const status: Tirth['status'] = t.status === 'planned' ? 'unvisited' : 'planned';
        return { ...t, status };
      });
      localStorage.setItem('yaatra_plan', JSON.stringify({ circuit, tirths: next }));
      return next;
    });
  };

  const plannedTirths = useMemo(() => tirths.filter((t) => t.status === 'planned'), [tirths]);
  const plannedDays = useMemo(() => plannedTirths.reduce((sum, t) => sum + t.recommendedDays, 0), [plannedTirths]);

  const confirmPlan = () => {
    const plan: Plan = {
      routeId: circuit,
      selectedTirthIds: plannedTirths.map((t) => t.id),
      departureDate,
      totalDays: plannedDays,
      phase: 'plan',
    };
    localStorage.setItem('yaatra_plan_confirmed', JSON.stringify(plan));
  };

  return { route, tirths, toggleTirth, plannedDays, departureDate, setDepartureDate, confirmPlan, plannedTirths };
}
