'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

export type Intention = 'healing' | 'gratitude' | 'seeking' | 'devotion' | null;
export type SceneKey = 'default' | 'dawn' | 'gold' | 'deep' | 'fire';

interface MeeraContextType {
  intention: Intention;
  setIntention: (i: Intention) => void;
  scene: SceneKey;
  setScene: (s: SceneKey) => void;
  sankalpComplete: boolean;
  setSankalpComplete: (v: boolean) => void;
}

const MeeraContext = createContext<MeeraContextType | null>(null);

export function MeeraProvider({ children }: { children: ReactNode }) {
  const [intention, setIntention] = useState<Intention>(null);
  const [scene, setScene] = useState<SceneKey>('default');
  const [sankalpComplete, setSankalpComplete] = useState(false);

  return (
    <MeeraContext.Provider value={{
      intention, setIntention,
      scene, setScene,
      sankalpComplete, setSankalpComplete,
    }}>
      {children}
    </MeeraContext.Provider>
  );
}

export function useMeera() {
  const ctx = useContext(MeeraContext);
  if (!ctx) throw new Error('useMeera must be used within MeeraProvider');
  return ctx;
}
