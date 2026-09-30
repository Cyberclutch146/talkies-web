'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function FireSparks({ count = 40 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 4 + 4;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#ffaa00] mix-blend-screen"
            style={{
              left: `${left}%`,
              bottom: '-5%',
              width: size,
              height: size,
              boxShadow: '0 0 10px 2px rgba(255, 170, 0, 0.8)'
            }}
            initial={{ y: '0vh', opacity: 0 }}
            animate={{
              y: ['0vh', '-120vh'],
              x: ['0vw', `${(Math.random() - 0.5) * 15}vw`],
              opacity: [0, Math.random() * 0.8 + 0.2, 0]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        );
      })}
    </div>
  );
}
