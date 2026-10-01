"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import PaperCrumple from "./PaperCrumple";

/* ─── Alpona Motif ───────────────────────────────────────────── */
function BengaliAlpona({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="8" />
      <circle cx="100" cy="100" r="16" strokeDasharray="3 4" />
      <circle cx="100" cy="100" r="28" />
      {/* 8 inner petals */}
      <path d="M100 72 C 110 50, 120 50, 100 30 C 80 50, 90 50, 100 72" />
      <path d="M100 128 C 110 150, 120 150, 100 170 C 80 150, 90 150, 100 128" />
      <path d="M72 100 C 50 110, 50 120, 30 100 C 50 80, 50 90, 72 100" />
      <path d="M128 100 C 150 110, 150 120, 170 100 C 150 80, 150 90, 128 100" />
      
      {/* diagonal petals */}
      <path d="M80 80 C 65 60, 70 50, 50 50 C 50 70, 60 65, 80 80" />
      <path d="M120 120 C 135 140, 130 150, 150 150 C 150 130, 140 135, 120 120" />
      <path d="M120 80 C 135 60, 130 50, 150 50 C 150 70, 140 65, 120 80" />
      <path d="M80 120 C 65 140, 70 150, 50 150 C 50 130, 60 135, 80 120" />
      
      {/* Outer border/scallops */}
      <circle cx="100" cy="100" r="80" strokeDasharray="5 5" opacity="0.5" />
      
      {/* Outer dots */}
      <circle cx="100" cy="10" r="2" fill="currentColor" />
      <circle cx="100" cy="190" r="2" fill="currentColor" />
      <circle cx="10" cy="100" r="2" fill="currentColor" />
      <circle cx="190" cy="100" r="2" fill="currentColor" />
    </svg>
  );
}

/* ─── Chapter Data ───────────────────────────────────────────── */
const CHAPTERS = [
  {
    id: "I",
    title: "The Arrival",
    bengali: "আগমনী — Agomoni",
    text: "There's a shift in the air sometime in late September — subtle, almost imperceptible. The monsoon loosens its grip, the sky turns a pale, luminous blue, and the afternoons grow gentle with a coolness that wasn't there before. On the banks of the Ganga, kaash-phool begins to sway in soft white waves, and in every lane, the first whispers begin: \"Pujo asche.\"",
    image: "/agomoni/arrival.jpg",
    alt: "Boat on the river Hooghly at sunset",
    theme: "Anticipation",
    frame: "01A",
  },
  {
    id: "II",
    title: "The Making",
    bengali: "কুমারটুলি — Kumartuli",
    text: "Months before the first dhak beat, in the narrow lanes of Kumartuli, hands caked in Ganga clay begin to sculpt divinity. Straw frames sprout ribs and limbs; clay becomes flesh; hollow eye sockets are painted open with a single brushstroke that feels like an act of invocation.",
    image: "/agomoni/makingnew.jpeg",
    alt: "Artisan tending to Durga clay idols",
    theme: "Craft & Patience",
    frame: "02A",
  },
  {
    id: "III",
    title: "The Homecoming",
    bengali: "ঘরে ফেরা — Ghore Phera",
    text: "Trains fill up. Flights get booked out months in advance. The highways leading to Kolkata swell with a tide of people coming home — not just to a city, but to a feeling. Pujo is the great gravitational force of Bengal: it pulls you back no matter where you've gone.",
    image: "/agomoni/durga-aarti.jpg",
    alt: "Aarti being performed with dhunuchi",
    theme: "Nostalgia & Belonging",
    frame: "03A",
  },
  {
    id: "IV",
    title: "The Celebration",
    bengali: "উৎসব — Utsav",
    text: "And then it begins. The five days that Bengalis live the other three hundred and sixty for. Shashti, Saptami, Ashtami, Navami, Dashami — each with its own rhythm, its own flavour, its own pitch of joy. The dhak is relentless now, filling the streets with a primal thunder.",
    image: "/agomoni/homecoming.jpeg",
    alt: "Vibrant pandal celebrations",
    theme: "Joy",
    frame: "04A",
  },
  {
    id: "V",
    title: "The Farewell",
    bengali: "বিজয়া দশমী — Bijoya Dashami",
    text: "Dashami arrives too soon. It always does. The morning begins with sindoor khela — married women smearing each other's faces and hair with vermillion, their laughter edged with the sadness of goodbye.",
    image: "/agomoni/sindur khela.png",
    alt: "Women playing sindur khela",
    theme: "Bittersweet Longing",
    frame: "05A",
  },
];

export function AgomoniChapters() {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Film Strip Scroll Logic */
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });
  
  // Measure the track width so we can translate exactly to the end
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        setScrollRange(trackWidth - viewportWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // CSS for authentic 35mm film perforations with SVG
  // The hole fill matches the page background (#14120e) to look like a physical cutout
  const perforationStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40'%3E%3Crect x='8' y='9' width='16' height='22' rx='2' fill='%2314120e' stroke='rgba(255,255,255,0.05)' stroke-width='1' /%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat-x",
    backgroundPosition: "center",
  };

  return (
    <>
      {/* ── Cinematic Film Strip Timeline ─────────────────────────────────── */}
      <section ref={targetRef} className="relative h-[400vh] bg-[#14120e] text-[#e5e0d3]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          
          {/* Moving Film Strip Track */}
          <motion.div 
            ref={trackRef}
            style={{ x }} 
            className="w-max h-[75vh] sm:h-[65vh] bg-black relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex items-center px-[7.5vw] md:px-[25vw] gap-1 md:gap-2"
          >
            {/* Top Perforations & Edge Markings */}
            <div className="absolute top-0 left-0 w-full h-[40px] z-20" style={perforationStyle}>
              {/* Fake film edge markings */}
              <div className="absolute bottom-[-16px] w-full flex items-center justify-around gap-[15vw] px-[10vw] font-mono text-[8px] sm:text-[9px] text-[#d4a24e]/50 uppercase tracking-[0.4em] whitespace-nowrap pointer-events-none select-none">
                <span>KODAK SAFETY FILM</span>
                <span>▶ 5222</span>
                <span>EASTMAN</span>
                <span>▶ 5222</span>
                <span>KODAK SAFETY FILM</span>
                <span>▶ 5222</span>
              </div>
            </div>

            {/* The Frames */}
            {CHAPTERS.map((chapter) => (
              <div 
                key={chapter.id} 
                className="relative w-[85vw] md:w-[50vw] aspect-[4/3] md:aspect-[3/2] shrink-0 bg-black overflow-hidden group"
              >
                <Image 
                  src={chapter.image} 
                  alt={chapter.alt} 
                  fill 
                  className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 ease-in-out scale-[1.02] group-hover:scale-105" 
                  sizes="(max-width: 768px) 85vw, 50vw"
                  priority={chapter.id === "I"}
                />
                
                {/* Subtle film grain on the image */}
                <div className="absolute inset-0 opacity-[0.3] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/noise.png')", backgroundSize: "100px" }} />
                
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 pointer-events-none" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                      Chapter {chapter.id}
                    </span>
                    <span className="w-8 md:w-16 h-px bg-[#d4a24e]/50" />
                    <span className="font-serif italic text-xs md:text-sm text-[#e5e0d3]/80">
                      {chapter.theme}
                    </span>
                  </div>
                  
                  <h2 className="font-display-serif text-3xl sm:text-5xl md:text-6xl text-[#faf6ee] mb-2 md:mb-3 leading-tight tracking-tight drop-shadow-lg">
                    {chapter.title}
                  </h2>
                  <p className="font-bengali-serif italic text-xl sm:text-2xl md:text-3xl text-[#d4a24e] mb-4 md:mb-6 drop-shadow-md" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
                    {chapter.bengali}
                  </p>
                  
                  <div className="max-w-2xl">
                    <p className="font-serif text-xs sm:text-sm md:text-lg text-[#e5e0d3]/90 leading-relaxed drop-shadow-md">
                      {chapter.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Perforations & Edge Markings */}
            <div className="absolute bottom-0 left-0 w-full h-[40px] z-20" style={perforationStyle}>
              <div className="absolute top-[-16px] w-full flex items-center justify-around gap-[15vw] px-[10vw] font-mono text-[8px] sm:text-[9px] text-[#d4a24e]/50 uppercase tracking-[0.4em] whitespace-nowrap pointer-events-none select-none">
                <span>▶ {CHAPTERS[0].frame}</span>
                <span>▶ {CHAPTERS[1].frame}</span>
                <span>▶ {CHAPTERS[2].frame}</span>
                <span>▶ {CHAPTERS[3].frame}</span>
                <span>▶ {CHAPTERS[4].frame}</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* ── Chapter 6: The Event ─────────────────────────────────── */}
      <section
        id="the-event"
        className="relative w-full min-h-[100svh] bg-[#d5cbb8] text-[#14120e] overflow-hidden flex flex-col justify-center"
      >
        {/* ── Background Depth Layers ── */}
        {/* 1. Vintage Paper Noise */}
        <div className="absolute inset-0 opacity-[0.45] mix-blend-color-burn pointer-events-none z-0" style={{ backgroundImage: "url('/noise.png')", backgroundSize: "120px" }} />
        
        {/* 2. Dotted Grid Pattern - Much more visible now */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#14120e 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
        
        {/* 3. Radial Spotlight (draws eye to center) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(250,246,238,0.95)_0%,transparent_80%)] pointer-events-none z-0" />
        
        {/* 4. Massive Bengali Typography Watermarks - Boosted opacity */}
        <div className="absolute top-[5%] -left-[5%] text-[15vw] font-bengali-serif text-[#14120e]/[0.08] -rotate-12 pointer-events-none select-none whitespace-nowrap z-0" lang="bn">
          আগমনী
        </div>
        <div className="absolute bottom-[10%] -right-[5%] text-[12vw] font-bengali-serif text-[#14120e]/[0.08] rotate-6 pointer-events-none select-none whitespace-nowrap z-0" lang="bn">
          উৎসব
        </div>
        
        {/* 5. Alpona / Floral Patterns */}
        <div className="absolute top-[15%] -right-[15%] w-[50vw] sm:w-[40vw] max-w-[600px] text-[#a82e13] opacity-[0.18] pointer-events-none z-0">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
            <BengaliAlpona className="w-full h-full drop-shadow-sm" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-[5%] -left-[10%] w-[55vw] sm:w-[45vw] max-w-[700px] text-[#a82e13] opacity-[0.15] pointer-events-none z-0">
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}>
            <BengaliAlpona className="w-full h-full drop-shadow-sm" />
          </motion.div>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 lg:py-24 relative z-10">
          {/* Bengali accent */}
          <div className="text-center mb-2">
            <span className="font-bengali-serif text-lg sm:text-xl text-[#a82e13]" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              অনুষ্ঠান
            </span>
          </div>

          <div className="text-center mb-12 sm:mb-20">
            <h2 className="font-display-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#14120e] mb-6">
              The Grand Event
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#14120e]/70 max-w-2xl mx-auto leading-relaxed">
              Join us for an evening of cultural brilliance as we celebrate the spirit of Agomoni. 
              Music, dance, and storytelling come together in a tribute to our heritage.
            </p>
          </div>

          {/* Ticket/Pass UI */}
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
