'use client';

import { motion } from 'framer-motion';

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="Loading" role="status">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-[5px] w-[5px] rounded-full bg-[#EAE8FF]"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, delay: dot * 0.2 }}
        />
      ))}
    </div>
  );
}
