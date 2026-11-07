'use client';

import { useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Spark {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

/* CSS keyframes run on the compositor, unlike per-frame JS animations,
   so 20+ particles no longer compete with scrolling on the main thread. */
const keyframes = `
@keyframes fire-spark-rise {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  12%  { opacity: var(--spark-op); }
  100% { transform: translate3d(var(--spark-dx), -120vh, 0); opacity: 0; }
}
`;

export function FireSparks({ count = 20 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: '200px' });

  useEffect(() => setMounted(true), []);

  // Generate once so re-renders never restart or reposition the particles.
  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 5,
        drift: (Math.random() - 0.5) * 15,
        opacity: Math.random() * 0.8 + 0.2,
      })),
    [count]
  );

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      {mounted && inView && sparks.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#ffaa00] mix-blend-screen will-change-transform"
          style={{
            left: `${s.left}%`,
            bottom: '-5%',
            width: s.size,
            height: s.size,
            boxShadow: '0 0 10px 2px rgba(255, 170, 0, 0.8)',
            ['--spark-dx' as string]: `${s.drift}vw`,
            ['--spark-op' as string]: s.opacity,
            animation: `fire-spark-rise ${s.duration}s ease-out ${s.delay}s infinite`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
