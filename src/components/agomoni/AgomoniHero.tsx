"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShiuliFall } from "./ShiuliFall";
import { DhakPulse } from "./DhakPulse";

/* ─── Agomoni Hero ─────────────────────────────────────────────── */

export function AgomoniHero() {
  const prefersReduced = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-[#14120e] flex flex-col items-center justify-center border-b-2 border-[#d4a24e]/30">
      {/* Background gradient — deep autumn night sky */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #2a1a0e 0%, #14120e 50%, #0a0908 100%)",
        }}
      />

      {/* Animated motifs */}
      <ShiuliFall count={24} />
      <DhakPulse />

      {/* Subtle decorative alpona pattern — CSS only */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-[3] opacity-[0.06] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 96" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 48 Q 60 0, 120 48 T 240 48 T 360 48 T 480 48 T 600 48 T 720 48 T 840 48 T 960 48 T 1080 48 T 1200 48 T 1320 48 T 1440 48"
            stroke="#d4a24e"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 64 Q 60 32, 120 64 T 240 64 T 360 64 T 480 64 T 600 64 T 720 64 T 840 64 T 960 64 T 1080 64 T 1200 64 T 1320 64 T 1440 64"
            stroke="#d4a24e"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 py-20 max-w-4xl mx-auto">
        {/* Top tag */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={0}
        >
          <span className="w-8 h-px bg-[#d4a24e]/40" />
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
            RCC Talkies × Art &amp; Cultural Club, RCCIIT
          </span>
          <span className="w-8 h-px bg-[#d4a24e]/40" />
        </motion.div>

        {/* Main title — Agomoni in display serif */}
        <motion.h1
          className="font-display-serif text-6xl sm:text-8xl lg:text-[140px] leading-[0.85] tracking-tight text-[#faf6ee] mb-4"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={1}
        >
          Agomoni
        </motion.h1>

        {/* Year */}
        <motion.p
          className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tighter text-[#d4a24e] mb-6"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={2}
        >
          2026
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="font-serif italic text-lg sm:text-2xl text-[#faf6ee]/70 max-w-2xl mx-auto mb-3 leading-relaxed"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={3}
        >
          A pre-Durga Puja celebration of art, music, culture &amp; the spirit that brings us home.
        </motion.p>

        {/* Date */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={4}
        >
          <span className="w-6 h-px bg-[#c83a1a]/60" />
          <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#c83a1a] font-bold">
            9 October 2026
          </span>
          <span className="w-6 h-px bg-[#c83a1a]/60" />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={5}
        >
          <a
            href="#participate"
            className="inline-block bg-[#d4a24e] text-[#14120e] font-display text-sm sm:text-base uppercase tracking-tight px-8 py-3.5 hover:bg-[#c83a1a] hover:text-[#faf6ee] transition-colors duration-300"
          >
            Participate →
          </a>
          <a
            href="#the-event"
            className="inline-block border border-[#faf6ee]/30 text-[#faf6ee] font-sans text-xs sm:text-sm uppercase tracking-[0.15em] px-8 py-3.5 hover:border-[#d4a24e] hover:text-[#d4a24e] transition-colors duration-300"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <motion.span
          className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.25em] text-[#faf6ee]/50 font-bold"
          animate={prefersReduced ? {} : { opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Begin the journey
        </motion.span>
        <motion.div
          className="w-[1px] h-6 bg-[#d4a24e]/40"
          animate={prefersReduced ? {} : { scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
