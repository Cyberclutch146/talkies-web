"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShiuliFall } from "./ShiuliFall";
import { DhakPulse } from "./DhakPulse";
import dynamic from "next/dynamic";

const Silk = dynamic(() => import("./Silk"), { ssr: false });

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
      {/* Silk WebGL background — golden flowing fabric */}
      <div className="absolute inset-0 z-[1] opacity-60">
        <Silk
          speed={3}
          scale={1.2}
          color="#6B4F1D"
          noiseIntensity={1.2}
          rotation={0.15}
        />
      </div>
      {/* Dark overlay to keep text readable */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(20,18,14,0.5) 50%, rgba(10,9,8,0.85) 100%)",
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
            RCC Talkies &times; Art &amp; Cultural Club, RCCIIT
          </span>
          <span className="w-8 h-px bg-[#d4a24e]/40" />
        </motion.div>

        {/* Main title — আগমনী in Bengali display font (Galada) */}
        <motion.div
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={1}
          className="relative mb-4"
        >
          {/* Accessible name for screen readers */}
          <span className="sr-only">Agomoni 2026</span>

          {/* Bengali display title */}
          <motion.h1
            className="font-bengali-display text-7xl sm:text-9xl lg:text-[160px] leading-[1.1] tracking-normal pb-2"
            lang="bn"
            aria-hidden="true"
            style={{
              letterSpacing: 0,
              lineHeight: 1.2,
              background: "linear-gradient(90deg, #d4a24e 0%, #faf6ee 40%, #d4a24e 80%, #faf6ee 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(212,162,78,0.2))",
              paddingBottom: "0.15em",
            }}
            animate={
              prefersReduced
                ? {}
                : {
                    backgroundPosition: ["200% 0%", "0% 0%"],
                  }
            }
            transition={{
              duration: 3,
              ease: "easeOut",
            }}
          >
            আগমনী
          </motion.h1>

          {/* Brush-stroke underline */}
          <motion.div
            className="mx-auto h-[3px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #d4a24e, #c83a1a, #d4a24e, transparent)",
              maxWidth: "60%",
            }}
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* Latin transliteration + year */}
        <motion.p
          className="font-display text-xl sm:text-3xl lg:text-4xl tracking-tighter text-[#d4a24e]/70 mb-3"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={2}
        >
          Agomoni 2026
        </motion.p>

        {/* Bengali tagline — মা আসছেন */}
        <motion.p
          className="font-bengali-serif italic text-xl sm:text-2xl text-[#faf6ee]/50 mb-2"
          lang="bn"
          style={{ letterSpacing: 0, lineHeight: 1.5 }}
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={2.5}
          aria-hidden="true"
        >
          মা আসছেন
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
            Participate
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
      <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
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
