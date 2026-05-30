'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { M } from './tokens';

interface Props {
  chips: string[];
  onSelect: (chip: string) => void;
}

export default function OfferingChips({ chips, onSelect }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          paddingTop: 10,
        }}
      >
        {chips.map((chip, i) => (
          <motion.button
            key={chip}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.22 }}
            onClick={() => onSelect(chip)}
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 14,
              color: M.terracotta,
              background: 'transparent',
              border: `1.5px solid ${M.terracotta}`,
              borderRadius: 20,
              padding: '6px 14px',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              lineHeight: 1.4,
              transition: 'background 0.18s ease, color 0.18s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = M.terracotta;
              (e.currentTarget as HTMLButtonElement).style.color = M.parchment;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = M.terracotta;
            }}
          >
            {chip}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
