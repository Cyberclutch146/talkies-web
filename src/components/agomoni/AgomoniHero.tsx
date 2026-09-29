"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShiuliFall } from "./ShiuliFall";
import { DhakPulse } from "./DhakPulse";
import { FireSparks } from "./FireSparks";
import { AnimatedText } from "./AnimatedText";
import Image from "next/image";
import { useState, MouseEvent } from "react";

/* ─── Agomoni Hero ─────────────────────────────────────────────── */

const FONTS = [
  // Google Fonts (from layout.tsx variables)
  { name: "Galada", var: "var(--font-bengali-display)" },
  { name: "Noto Serif", var: "var(--font-bengali-noto)" },
  { name: "Tiro Bangla", var: "var(--font-bengali-serif)" },
  { name: "Mina", var: "var(--font-bengali-mina)" },
  { name: "Baloo Da 2", var: "var(--font-bengali-baloo)" },
  { name: "Anek Bangla", var: "var(--font-bengali-anek)" },
  { name: "Hind Siliguri", var: "var(--font-bengali-hind)" },
  { name: "Atma", var: "var(--font-bengali-accent)" },
  
  // Custom Local Fonts (loaded via @font-face below)
  { name: "BenSen (Puja Classic)", var: "'BenSen', sans-serif" },
  { name: "BenSen Handwriting", var: "'BenSenHandwriting', sans-serif" },
  { name: "Kalpurush (Print)", var: "'Kalpurush', sans-serif" },
  { name: "Siyam Rupali", var: "'SiyamRupali', sans-serif" },
  { name: "Bangla", var: "'Bangla', sans-serif" },
  { name: "Nikosh", var: "'Nikosh', sans-serif" },
  { name: "Mukti", var: "'Mukti', sans-serif" },
];

export function AgomoniHero() {
  const prefersReduced = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [titleFont, setTitleFont] = useState(FONTS[0].var);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @font-face { font-family: 'BenSen'; src: url('/fonts/BenSen.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'BenSenHandwriting'; src: url('/fonts/BenSenHandwriting.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'Kalpurush'; src: url('/fonts/kalpurush.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'SiyamRupali'; src: url('/fonts/Siyamrupali.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'Bangla'; src: url('/fonts/Bangla.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'Nikosh'; src: url('/fonts/Nikosh.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'Mukti'; src: url('/fonts/Mukti.ttf') format('truetype'); font-display: swap; }
      `}} />
      <section 
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[100svh] overflow-hidden bg-[#14120e] flex flex-col items-center justify-center border-b-2 border-[#d4a24e]/30"
      >
      
      {/* 1. Maa Durga Background Image (Faded) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none bg-cover bg-center bg-no-repeat grayscale mix-blend-luminosity"
        style={{ backgroundImage: 'url("/durga-bg.jpg")' }}
      >
        {/* Dark gradient to ensure text readability and blend into the next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#14120e]/40 via-[#14120e]/20 to-[#14120e]" />
      </div>

      {/* 2. Dotted Halftone Overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(#d4a24e 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      {/* Interactive Spotlight Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-[4] mix-blend-color-dodge transition-opacity duration-500 hidden sm:block opacity-60"
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(212,162,78,0.2), transparent 100%)`
        }}
        aria-hidden="true"
      />

      {/* Animated motifs */}
      <FireSparks count={40} />
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


      {/* Font Switcher UI (Dev tool) */}
      <div className="absolute top-24 right-4 sm:right-8 z-50 flex flex-col gap-2 p-4 rounded-xl bg-[#14120e]/80 border border-[#d4a24e]/20 backdrop-blur-md shadow-2xl">
        <p className="text-[10px] uppercase tracking-widest text-[#d4a24e] mb-1 font-bold">Try Fonts</p>
        <div className="flex flex-col gap-1.5">
          {FONTS.map(f => (
            <button
              key={f.name}
              onClick={() => setTitleFont(f.var)}
              className={`text-xs text-left px-3 py-1.5 rounded-md transition-colors ${
                titleFont === f.var ? 'bg-[#d4a24e] text-[#14120e] font-bold' : 'text-[#faf6ee]/70 hover:bg-[#d4a24e]/20'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 py-20 max-w-4xl mx-auto mt-16 sm:mt-0">
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

        {/* Main title — আগমনী in Bengali display font */}
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
            className="text-7xl sm:text-9xl lg:text-[160px] leading-[1.1] tracking-normal pb-2"
            lang="bn"
            aria-hidden="true"
            style={{
              fontFamily: titleFont,
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
        <motion.div
          className="font-display text-xl sm:text-3xl lg:text-4xl tracking-tighter text-[#d4a24e]/70 mb-3"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          animate="visible"
          custom={2}
        >
          <AnimatedText text="Agomoni 2026" delay={0.6} />
        </motion.div>

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
    </>
  );
}
