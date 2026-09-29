"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

/* ─── Shiuli Petal (Night Jasmine) ─────────────────────────────────
   Tiny white-orange flowers that drift down in pre-Puja mornings.
   Each petal is a simple CSS shape — no raster images needed.       */

interface Petal {
  id: number;
  x: number;        // start % from left
  delay: number;     // animation delay
  duration: number;  // fall duration
  size: number;      // px
  drift: number;     // horizontal sway px
  rotation: number;  // starting rotation
  opacity: number;
}

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 10,
    size: 6 + Math.random() * 8,
    drift: -30 + Math.random() * 60,
    rotation: Math.random() * 360,
    opacity: 0.3 + Math.random() * 0.5,
  }));
}

export function ShiuliFall({ count = 20 }: { count?: number }) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const petals = useMemo(() => generatePetals(count), [count]);

  if (prefersReduced || !mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]" aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
          }}
          initial={{ y: -20, x: 0, rotate: p.rotation, opacity: 0 }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, p.drift, -p.drift / 2, p.drift / 3],
            rotate: [p.rotation, p.rotation + 360],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
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
        </motion.div>
      ))}
    </div>
  );
}
