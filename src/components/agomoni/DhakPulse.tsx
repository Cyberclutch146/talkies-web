"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─── Dhak Pulse ─────────────────────────────────────────────────
   Concentric rings that pulse outward like a dhak beat.
   Used in the hero to give a rhythmic heartbeat to the page.     */

export function DhakPulse() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#d4a24e]/20"
          style={{
            width: 200 + i * 120,
            height: 200 + i * 120,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.4, 1.8],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 1,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
