"use client";

import { useReducedMotion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import type { CSSProperties } from "react";

/* ─── Shiuli Petal (Night Jasmine) ─────────────────────────────────
   Tiny white-orange flowers that drift down in pre-Puja mornings.
   Each petal is a simple CSS shape — no raster images needed.       */

interface Petal {
  x: number;        // start % from left
  delay: number;     // animation delay
  duration: number;  // fall duration
  size: number;      // px
  drift: number;     // horizontal sway px
  rotation: number;  // starting rotation
  opacity: number;
}

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 10,
    size: 6 + Math.random() * 8,
    drift: -30 + Math.random() * 60,
    rotation: Math.random() * 360,
    opacity: 0.3 + Math.random() * 0.5,
  }));
}

// Compositor-friendly keyframes (transform + opacity only).
const keyframes = `
@keyframes shiuli-fall {
  0%   { transform: translate3d(0, 0, 0) rotate(var(--petal-rot)); opacity: 0; }
  8%   { opacity: var(--petal-op); }
  50%  { transform: translate3d(var(--petal-drift), 50vh, 0) rotate(calc(var(--petal-rot) + 180deg)); opacity: var(--petal-op); }
  100% { transform: translate3d(calc(var(--petal-drift) * -0.5), 105vh, 0) rotate(calc(var(--petal-rot) + 360deg)); opacity: 0; }
}
`;

export function ShiuliFall({ count = 20 }: { count?: number }) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "200px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const petals = useMemo(() => generatePetals(count), [count]);

  if (prefersReduced) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[2]" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      {mounted && inView && petals.map((p, i) => (
        <div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            ["--petal-rot" as string]: `${p.rotation}deg`,
            ["--petal-drift" as string]: `${p.drift}px`,
            ["--petal-op" as string]: p.opacity,
            animation: `shiuli-fall ${p.duration}s linear ${p.delay}s infinite`,
          } as CSSProperties}
        >
          {/* Shiuli flower: white petals + orange stem */}
          <svg
            viewBox="0 0 20 20"
            width={p.size}
            height={p.size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Petals */}
            <ellipse cx="10" cy="5" rx="3" ry="5" fill="#faf6ee" opacity="0.9" />
            <ellipse cx="10" cy="5" rx="3" ry="5" fill="#faf6ee" opacity="0.9" transform="rotate(72 10 10)" />
            <ellipse cx="10" cy="5" rx="3" ry="5" fill="#faf6ee" opacity="0.9" transform="rotate(144 10 10)" />
            <ellipse cx="10" cy="5" rx="3" ry="5" fill="#faf6ee" opacity="0.9" transform="rotate(216 10 10)" />
            <ellipse cx="10" cy="5" rx="3" ry="5" fill="#faf6ee" opacity="0.9" transform="rotate(288 10 10)" />
            {/* Center (orange stem dot) */}
            <circle cx="10" cy="10" r="2.5" fill="#e07028" />
          </svg>
        </div>
      ))}
    </div>
  );
}
