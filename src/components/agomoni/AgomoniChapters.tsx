"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChapterSection } from "./ChapterSection";
import { ArticleSplit } from "./ArticleSplit";
import {
  BengaliWatermark,
  BengaliStamp,
  BengaliMarginNote,
  BengaliPullQuote,
} from "./BengaliAccents";
import PaperCrumple from "./PaperCrumple";

/* ─── Image Sources (Local Agomoni Archive) ───────────────────
   Assigned to chapters by subject relevance.                    */

const CHAPTER_IMAGES = {
  arrival: {
    url: "/agomoni/arrival.jpg",
    alt: "Boat on the river Hooghly at sunset with Howrah Bridge in the background during autumn",
    credit: "Agomoni Archive",
  },
  making: {
    url: "/agomoni/making.jpeg",
    alt: "Artisan tending to Durga clay idols with smoke in Kumartuli workshop",
    credit: "Agomoni Archive",
  },
  homecoming: {
    url: "/agomoni/durga-aarti.jpg",
    alt: "Aarti being performed with dhunuchi before the grand Durga idol",
    credit: "Agomoni Archive",
  },
  celebration: {
    url: "/agomoni/dhunuchi-dance.jpg",
    alt: "Two traditional dancers performing Dhunuchi naach before Goddess Durga",
    credit: "Agomoni Archive",
  },
  farewell: {
    url: "/agomoni/sindur khela.png",
    alt: "Women playing sindur khela, smearing vermillion on each other during Bijoya Dashami",
    credit: "Agomoni Archive",
  },
  event: {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    alt: "Night festival celebrations with vibrant stage lights and crowd",
    credit: "Photo: Unsplash",
  },
};



/* ─── All Narrative Chapters ─────────────────────────────────── */
export function AgomoniChapters() {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <>
      {/* ── Chapter 1: The Arrival ─── Text LEFT, Image RIGHT ──── */}
      <section className="relative w-full bg-[#e5e0d3] overflow-hidden">
        <BengaliWatermark text="ঢাকের তালে" position="right" />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.arrival.url}
          imageAlt={CHAPTER_IMAGES.arrival.alt}
          imageCredit={CHAPTER_IMAGES.arrival.credit}
          imagePosition="right"
          tornSeed={101}
        >
          <div className="relative">
            <BengaliMarginNote text="শিউলি-ঝরা ভোর" side="right" />

            {/* Dateline + Chapter header */}
            <div className="text-[#14120e]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#14120e]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                Chapter I
              </span>
              <span className="w-8 h-px bg-[#d4a24e]/40" />
              <span className="font-serif italic text-xs">Anticipation</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Arrival
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e] mb-5 sm:mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              আগমনী — Agomoni
            </p>

            {/* Prose with drop cap */}
            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed prose-dropcap" style={{ '--dropcap-color': '#d4a24e' } as React.CSSProperties}>
              <p>
                There&apos;s a shift in the air sometime in late September — subtle, almost imperceptible.
                The monsoon loosens its grip, the sky turns a pale, luminous blue, and the afternoons grow
                gentle with a coolness that wasn&apos;t there before. On the banks of the Ganga, kaash-phool
                begins to sway in soft white waves, and in every lane, the first whispers begin:
                <em className="text-[#d4a24e]"> &ldquo;Pujo asche.&rdquo;</em>
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 2: The Making ─── Image LEFT, Text RIGHT ──── */}
      <section className="relative w-full bg-[#14120e] text-[#e5e0d3] overflow-hidden">

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.making.url}
          imageAlt={CHAPTER_IMAGES.making.alt}
          imageCredit={CHAPTER_IMAGES.making.credit}
          imagePosition="left"
          darkBg
          tornSeed={202}
        >
          <div className="relative">
            <div className="text-[#e5e0d3]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#e5e0d3]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#c83a1a]">
                Chapter II
              </span>
              <span className="w-8 h-px bg-[#c83a1a]/40" />
              <span className="font-serif italic text-xs">Craft &amp; Patience</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Making
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#c83a1a] mb-5 sm:mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              কুমারটুলি — Kumartuli
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-[#e5e0d3]/85 prose-dropcap" style={{ '--dropcap-color': '#c83a1a' } as React.CSSProperties}>
              <p>
                Months before the first dhak beat, in the narrow lanes of Kumartuli, hands caked in
                Ganga clay begin to sculpt divinity. Straw frames sprout ribs and limbs; clay becomes
                flesh; hollow eye sockets are painted open with a single brushstroke that feels like
                an act of invocation.
              </p>

              <BengaliPullQuote
                text="হাতের ছোঁয়ায় প্রাণ"
                attribution="Life through the touch of hands"
                className="text-[#d4a24e]"
              />
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 3: The Homecoming ─── Text LEFT, Image RIGHT ─ */}
      <section className="relative w-full bg-[#e5e0d3] overflow-hidden">
        <BengaliWatermark text="ঘরে ফেরা" position="left" />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.homecoming.url}
          imageAlt={CHAPTER_IMAGES.homecoming.alt}
          imageCredit={CHAPTER_IMAGES.homecoming.credit}
          imagePosition="right"
          tornSeed={302}
        >
          <div className="relative">
            <BengaliStamp text="ঘরে ফেরা" color="#c83a1a" className="absolute -top-2 right-0 hidden lg:block" />

            <div className="text-[#14120e]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#14120e]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                Chapter III
              </span>
              <span className="w-8 h-px bg-[#d4a24e]/40" />
              <span className="font-serif italic text-xs">Nostalgia &amp; Belonging</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Homecoming
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e] mb-5 sm:mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              ঘরে ফেরা — Ghore Phera
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed prose-dropcap" style={{ '--dropcap-color': '#d4a24e' } as React.CSSProperties}>
              <p>
                Trains fill up. Flights get booked out months in advance. The highways leading to
                Kolkata swell with a tide of people coming home — not just to a city, but to a feeling.
                <em> Pujo</em> is the great gravitational force of Bengal: it pulls you back no matter
                where you&apos;ve gone.
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 4: The Celebration ─── Image LEFT, Text RIGHT ─ */}
      <section className="relative w-full bg-[#e5e0d3] overflow-hidden">
        <BengaliWatermark text="ধুনুচির ধোঁয়ায়" position="right" />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.celebration.url}
          imageAlt={CHAPTER_IMAGES.celebration.alt}
          imageCredit={CHAPTER_IMAGES.celebration.credit}
          imagePosition="left"
          tornSeed={401}
        >
          <div className="relative">
            <BengaliMarginNote text="আড্ডা" side="right" />

            <div className="text-[#14120e]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#14120e]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#c83a1a]">
                Chapter IV
              </span>
              <span className="w-8 h-px bg-[#c83a1a]/40" />
              <span className="font-serif italic text-xs">Joy</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Celebration
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#c83a1a] mb-5 sm:mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              উৎসব — Utsav
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed prose-dropcap" style={{ '--dropcap-color': '#c83a1a' } as React.CSSProperties}>
              <p>
                And then it begins. The five days that Bengalis live the other three hundred and sixty
                for. Shashti, Saptami, Ashtami, Navami, Dashami — each with its own rhythm, its own
                flavour, its own pitch of joy. The dhak is relentless now, filling the streets with a
                primal thunder.
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 5: The Farewell ─── Text LEFT, Image RIGHT ─── */}
      <section className="relative w-full bg-[#14120e] text-[#e5e0d3] overflow-hidden">

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.farewell.url}
          imageAlt={CHAPTER_IMAGES.farewell.alt}
          imageCredit={CHAPTER_IMAGES.farewell.credit}
          imagePosition="right"
          darkBg
          tornSeed={502}
          objectFit="cover"
          objectPosition="center 30%"
          unoptimized
          disableGrain
        >
          <div className="relative">
            <BengaliStamp text="শুভ বিজয়া" color="#d4a24e" className="absolute -top-2 right-0 hidden lg:block" />

            <div className="text-[#e5e0d3]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#e5e0d3]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                Chapter V
              </span>
              <span className="w-8 h-px bg-[#d4a24e]/40" />
              <span className="font-serif italic text-xs">Bittersweet Longing</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Farewell
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e] mb-5 sm:mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              বিজয়া দশমী — Bijoya Dashami
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-[#e5e0d3]/85 prose-dropcap" style={{ '--dropcap-color': '#d4a24e' } as React.CSSProperties}>
              <p>
                Dashami arrives too soon. It always does. The morning begins with sindoor khela —
                married women smearing each other&apos;s faces and hair with vermillion, their
                laughter edged with the sadness of goodbye.
              </p>

              <BengaliPullQuote
                text="সিঁদুর খেলা"
                attribution="Sindoor Khela"
                className="text-[#d4a24e]"
              />
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 6: The Event ─────────────────────────────────── */}
      <section
        id="the-event"
        className="relative w-full min-h-[100svh] bg-[#e5e0d3] text-[#14120e] overflow-hidden flex flex-col justify-center"
      >

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 lg:py-24">
          {/* Bengali accent */}
          <div className="text-center mb-2">
            <span className="font-bengali-serif text-lg sm:text-xl text-[#a82e13]" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              মঞ্চ তোমার অপেক্ষায়
            </span>
          </div>

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#a82e13] block mb-3">
              The Event
            </span>
            <h2 className="font-display-serif text-4xl sm:text-6xl lg:text-7xl text-[#14120e] tracking-tight mb-4">
              Agomoni 2026
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#14120e]/70 max-w-2xl mx-auto leading-relaxed">
              A pre-Durga Puja cultural programme celebrating art, music, dance, and the
              collective spirit of RCCIIT — organised by <strong>RCC Talkies</strong> and
              the <strong>Art &amp; Cultural Club of RCCIIT</strong>.
            </p>
          </motion.div>

          {/* Vintage Ticket Event Details */}
          <motion.div
            className="relative mx-auto w-full max-w-4xl mb-16 flex flex-col md:flex-row shadow-[0_15px_40px_-10px_rgba(20,18,14,0.1)] group cursor-default"
            initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
            whileInView={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, rotate: [-1, 1.5, -1] }}
            whileHover={{ rotate: 0, scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            viewport={{ once: true }}
            transition={{
              opacity: { duration: 0.8 },
              y: { duration: 0.8, type: "spring", bounce: 0.3 },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Left/Main Ticket Body */}
            <div className="flex-1 bg-[#faf6ee] p-8 sm:p-10 relative overflow-hidden border border-b-0 md:border-b md:border-r-0 border-[#14120e]/10 rounded-t-xl md:rounded-l-xl md:rounded-tr-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 z-10">

              {/* Background Texture/Stamp */}
              <div className="absolute -right-8 -bottom-10 opacity-[0.03] pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110">
                <svg width="250" height="250" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="50" y="55" fontSize="14" textAnchor="middle" fill="currentColor" fontWeight="bold">AGOMONI 2026</text>
                </svg>
              </div>

              <div className="flex-1 relative">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-[#a82e13] block mb-2">
                  General Admission
                </span>
                <h3 className="font-display-serif text-3xl sm:text-4xl text-[#14120e] mb-6">Agomoni 2026 </h3>

                <div className="flex flex-wrap gap-x-12 gap-y-6">
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#14120e]/40 mb-1 flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                      Date
                    </p>
                    <p className="font-display-serif text-xl text-[#14120e]">9 October 2026</p>
                  </div>
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#14120e]/40 mb-1 flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      Time
                    </p>
                    <p className="font-display-serif text-xl text-[#14120e]">1:00 PM &mdash; 5:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Hosts */}
              <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 sm:border-l border-[#14120e]/10 pt-6 sm:pt-0 sm:pl-8 relative flex flex-col items-start sm:items-end">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#14120e]/40 mb-2 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  Hosted By
                </p>
                <p className="font-display-serif text-lg text-[#14120e]">
                  RCC Talkies &times; <br className="hidden sm:block" />
                  Art &amp; Cultural Club
                </p>
              </div>
            </div>

            {/* Perforation Line */}
            <div className="w-full md:w-auto h-auto bg-[#faf6ee] relative flex flex-col items-center justify-center border-l border-r md:border-t md:border-b border-[#14120e]/10 md:border-l-0 md:border-r-0">
              {/* The dashed line */}
              <div className="absolute top-0 bottom-0 left-0 right-0 md:w-px h-px md:h-full border-t-2 md:border-t-0 md:border-l-2 border-dashed border-[#14120e]/15 mx-4 md:mx-0 md:my-4" />

              {/* Circle Cutouts - Desktop (Top/Bottom) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#e5e0d3] hidden md:block shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)] border-b border-[#14120e]/10 z-20" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#e5e0d3] hidden md:block shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border-t border-[#14120e]/10 z-20" />

              {/* Circle Cutouts - Mobile (Left/Right) */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#e5e0d3] block md:hidden shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)] border-r border-[#14120e]/10 z-20" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#e5e0d3] block md:hidden shadow-[inset_2px_0_4px_rgba(0,0,0,0.05)] border-l border-[#14120e]/10 z-20" />
            </div>

            {/* Right/Bottom Ticket Stub */}
            <div className="md:w-72 bg-[#f4ece1] p-8 border border-t-0 md:border-t md:border-l-0 border-[#14120e]/10 rounded-b-xl md:rounded-r-xl md:rounded-bl-none flex flex-col justify-center items-center text-center relative z-10 text-[#a82e13]">
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#a82e13]/70 mb-2 flex items-center justify-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                Venue
              </p>
              <h4 className="font-display-serif text-xl sm:text-2xl text-[#a82e13] italic mb-8 leading-snug">
                Dr. Jaya Deb Roy Auditorium <br />
                <span className="text-sm sm:text-base font-serif opacity-80 not-italic">in RCCIIT Campus</span>
              </h4>

              {/* Fake Barcode */}
              <div className="flex h-12 w-full max-w-[200px] items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                <div className="h-full w-1 bg-[#a82e13] ml-1" />
                <div className="h-full w-2 bg-[#a82e13] ml-1.5" />
                <div className="h-full w-1 bg-[#a82e13] ml-1" />
                <div className="h-full w-3 bg-[#a82e13] ml-2" />
                <div className="h-full w-1 bg-[#a82e13] ml-1" />
                <div className="h-full w-2 bg-[#a82e13] ml-1.5" />
                <div className="h-full w-1 bg-[#a82e13] ml-1" />
                <div className="h-full w-4 bg-[#a82e13] ml-2" />
                <div className="h-full w-1 bg-[#a82e13] ml-1" />
                <div className="h-full w-2 bg-[#a82e13] ml-1.5" />
                <div className="h-full w-1 bg-[#a82e13] ml-1" />
                <div className="h-full w-3 bg-[#a82e13] ml-2" />
              </div>
              <p className="font-mono text-[9px] tracking-[0.3em] text-[#a82e13]/70 mt-3 uppercase">Admit One</p>
            </div>
          </motion.div>

          {/* Cultural Programme Schedule — Interactive 3D Paper */}
          <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-center">
              <PaperCrumple
                key={isMobile ? "mobile-paper" : "desktop-paper"}
                src={isMobile ? "/agomoni/cultural-programme-poster-vertical.png" : "/agomoni/cultural-programme-poster.png"}
                alt="Agomoni 2026 Cultural Programme Schedule"
                width={isMobile ? 350 : 860}
                height={isMobile ? 495 : 440}
                sceneHeight={isMobile ? 550 : 520}
                releaseBehavior="restore"
                crumpleAmount={0.88}
                crumpleDuration={0.6}
                releaseDuration={1.3}
                foldCount={6}
                foldSharpness={0.6}
                wrinkleDepth={0.65}
                creaseStrength={0.18}
                paperColor="#eae5d9"
                paperTexture={0.08}
                draggable
                returnToOrigin
                unfoldOnTouch
              />
            </div>

            <p className="font-serif italic text-xs text-[#14120e]/50 mt-3 text-center select-none pointer-events-none">
              Touch or click the crumpled paper to open the schedule &middot; Drag to crumple
            </p>
          </div>

          {/* CTA to form */}
          <motion.div
            className="text-center mt-12"
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="#participate"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-base sm:text-lg uppercase tracking-tight px-10 py-4 hover:bg-[#a82e13] transition-colors duration-300"
            >
              Register to Participate
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
