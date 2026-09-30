"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import eventsData from "@/data/events.json";
import DecryptedText from "@/components/DecryptedText";

type TabKey = "got" | "techtrix" | "regalia" | "bihaan";

const tabs: { key: TabKey; label: string; code: string }[] = [
  { key: "got", label: "Game Of Thrones", code: "01 // GOT" },
  { key: "techtrix", label: "TechTrix", code: "02 // TECHTRIX" },
  { key: "regalia", label: "Regalia", code: "03 // REGALIA" },
  { key: "bihaan", label: "Bihaan", code: "04 // BIHAAN" },
];

/* Unsplash fallback images keyed by slug-index (used when /events/*.jpg doesn't exist yet) */
const placeholderImages: Record<string, string> = {
  "got-0": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  "got-1": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
  "got-2": "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?auto=format&fit=crop&w=1200&q=80",
  "techtrix-0": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
  "techtrix-1": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  "techtrix-2": "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=80",
  "regalia-0": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  "regalia-1": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  "regalia-2": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
  "bihaan-0": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
  "bihaan-1": "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=1200&q=80",
  "bihaan-2": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
};



export default function EventsPage() {
  const [activeSection, setActiveSection] = useState<"swc" | "talkies" | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("got");
  const [activeHighlightIdx, setActiveHighlightIdx] = useState(0);
  const [imageError, setImageError] = useState(false);

  const activeEvent = eventsData.flagship.find((e) => e.slug === activeTab);
  const activeYearData = activeEvent?.years[0];
  const highlights = activeYearData?.highlights || [];
  const activeHighlight = highlights[activeHighlightIdx];

  const currentImageSrc = activeHighlight && !imageError
    ? activeHighlight.image
    : placeholderImages[`${activeTab}-${activeHighlightIdx}`] || placeholderImages["got-0"];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              CHRONICLES & FESTIVALS
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="EVENT ARCHIVE"
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                revealDirection="start"
                className="text-[#e5e0d3]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/70 max-w-sm">
            Annual records of SWC festivals and the competitions and showcases covered by RCC Talkies.
          </p>
        </div>
      </section>

      {/* Editorial Statement */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 border-b border-[#14120e]/20">
        <div className="flex items-baseline gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>SWC archive · RCC Talkies event coverage</span>
        </div>
      </div>

      {!activeSection && (
        <section aria-label="Event categories" className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setActiveSection("swc")}
              className="group min-h-64 sm:min-h-80 p-6 sm:p-9 bg-[#14120e] text-[#e5e0d3] text-left flex flex-col justify-between border border-[#14120e] hover:bg-[#211d18] transition-colors"
            >
              <div>
                <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c83a1a] mb-4">
                  01 // STUDENT WELFARE COMMITTEE
                </span>
                <h2 className="font-display text-4xl sm:text-5xl uppercase">SWC Events</h2>
                <p className="font-serif text-base text-[#e5e0d3]/70 mt-3 max-w-md">
                  Sports, technology, and cultural festivals at RCCIIT.
                </p>
              </div>
              <span className="font-sans text-xs uppercase tracking-[0.15em] text-[#c83a1a] group-hover:translate-x-1 transition-transform">
                Explore events <span aria-hidden="true">→</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("talkies")}
              className="group min-h-64 sm:min-h-80 p-6 sm:p-9 bg-[#ded8c7] text-[#14120e] text-left flex flex-col justify-between border border-[#14120e]/20 hover:border-[#c83a1a] transition-colors"
            >
              <div>
                <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c83a1a] mb-4">
                  02 // THE RCC TALKIES DESK
                </span>
                <h2 className="font-display text-4xl sm:text-5xl uppercase">RCC Talkies Events</h2>
                <p className="font-serif text-base text-[#14120e]/75 mt-3 max-w-md">
                  Competitions, festivals, and showcases covered by RCC Talkies.
                </p>
              </div>
              <span className="font-sans text-xs uppercase tracking-[0.15em] text-[#c83a1a] group-hover:translate-x-1 transition-transform">
                Explore events <span aria-hidden="true">→</span>
              </span>
            </button>
          </div>
        </section>
      )}

      {activeSection && (
        <div>
          <div className="border-b border-[#14120e]/20 bg-[#eae5d9]/80">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveSection(null)}
                className="font-sans text-xs uppercase tracking-widest text-[#14120e]/70 hover:text-[#c83a1a] transition-colors"
              >
                <span aria-hidden="true">← </span>All event categories
              </button>
              <span className="font-display text-sm sm:text-lg uppercase text-right">
                {activeSection === "swc" ? "SWC Events" : "RCC Talkies Events"}
              </span>
            </div>
          </div>

      {activeSection === "swc" && (
        <div id="swc-events-panel" role="region" aria-label="SWC Events">
      {/* 4-Tab Bar */}
      <div className="w-full border-b border-[#14120e]/20 bg-[#eae5d9]/80 overflow-x-auto relative scrollbar-none">
        {/* Scroll fade indicators removed to prevent UI glitch over active tabs */}
        <div className="max-w-7xl mx-auto flex divide-x divide-[#14120e]/20">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setActiveHighlightIdx(0);
                  setImageError(false);
                }}
                className={`px-6 py-4 text-xs font-sans uppercase tracking-widest font-bold text-left transition-all min-w-[180px] sm:min-w-0 flex-1 ${
                  isActive
                    ? "bg-[#14120e] text-[#e5e0d3]"
                    : "hover:bg-[#ded8c7] text-[#14120e]"
                }`}
              >
                <span className={`block text-[10px] tracking-wider mb-1 ${isActive ? "text-[#c83a1a]" : "text-[#14120e]/50"}`}>
                  {tab.code}
                </span>
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Details — Slideshow + Highlights */}
      {activeEvent && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">

            {/* Left: Slideshow Image */}
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
              {/* Image slideshow */}
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e]/30 bg-[#14120e]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${activeTab}-${activeHighlightIdx}-${currentImageSrc}`}
                    src={currentImageSrc}
                    alt={activeHighlight?.title || activeEvent.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onError={() => setImageError(true)}
                  />
                </AnimatePresence>

                {/* Tagline badge */}
                <div className="absolute top-3 left-3 bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                  {activeEvent.tagline}
                </div>

                {/* Image counter */}
                <div className="absolute bottom-3 right-3 bg-[#14120e]/80 text-[#e5e0d3] text-[10px] font-sans font-bold px-2 py-0.5 tracking-wider">
                  {String(activeHighlightIdx + 1).padStart(2, "0")} / {String(highlights.length).padStart(2, "0")}
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-2 justify-center">
                {highlights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveHighlightIdx(idx);
                      setImageError(false);
                    }}
                    className={`transition-all duration-300 ${
                      idx === activeHighlightIdx
                        ? "w-6 h-2 bg-[#c83a1a]"
                        : "w-2 h-2 bg-[#14120e]/30 hover:bg-[#14120e]/50"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>

              <div>
                <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-[#14120e] mb-3">
                  {activeEvent.name}
                </h2>
                <p className="font-serif text-base text-[#14120e]/80 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>
            </div>

            {/* Right: Clickable Highlights */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-8 bg-[#eae5d9]/40">
              <div className="border-b border-[#14120e]/20 pb-4 flex justify-between items-end">
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#14120e]">
                  {activeEvent.shortName} {"//"} {activeYearData?.year} HIGHLIGHTS
                </h3>
                <span className="text-xs font-sans uppercase tracking-widest text-[#c83a1a] font-bold">
                  ✦ {highlights.length} STORIES
                </span>
              </div>

              <div className="space-y-4">
                {highlights.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveHighlightIdx(i);
                      setImageError(false);
                    }}
                    className={`w-full text-left p-6 border transition-all duration-300 space-y-2 ${
                      i === activeHighlightIdx
                        ? "border-[#c83a1a] bg-[#14120e] shadow-[4px_4px_0px_#c83a1a] -translate-y-0.5"
                        : "border-[#14120e]/20 bg-[#e5e0d3] hover:border-[#14120e]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-display text-2xl transition-colors ${
                        i === activeHighlightIdx ? "text-[#c83a1a]" : "text-[#c83a1a]"
                      }`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className={`font-display text-xl sm:text-2xl uppercase tracking-tight transition-colors ${
                        i === activeHighlightIdx ? "text-[#e5e0d3]" : "text-[#14120e]"
                      }`}>
                        {h.title}
                      </h4>
                      {i === activeHighlightIdx && (
                        <span className="ml-auto text-[9px] font-sans uppercase tracking-widest text-[#c83a1a] font-bold border border-[#c83a1a]/50 px-2 py-0.5">
                          VIEWING
                        </span>
                      )}
                    </div>
                    <p className={`font-serif text-base leading-relaxed pl-8 transition-colors ${
                      i === activeHighlightIdx ? "text-[#e5e0d3]/80" : "text-[#14120e]/85"
                    }`}>
                      {h.blurb}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {activeSection === "talkies" && (
        <section id="talkies-events-panel" role="region" aria-label="RCC Talkies Events" className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
          <div className="max-w-3xl border-b border-[#14120e]/20 pb-5 mb-8">
            <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#c83a1a] mb-2">
              RCC TALKIES DESK
            </span>
            <h2 className="font-display text-3xl sm:text-5xl uppercase text-[#14120e]">
              RCC Talkies Events
            </h2>
            <p className="font-serif text-base text-[#14120e]/75 mt-3">
              Competitions, festivals, and showcases followed by the RCC Talkies desk.
            </p>
          </div>

          {/* Agomoni Card */}
          <a
            href="/agomoni"
            className="group relative block overflow-hidden rounded-sm border border-[#14120e]/20 bg-[#14120e] text-[#e5e0d3] transition-all duration-500 hover:border-[#c83a1a] hover:shadow-[8px_8px_0px_#c83a1a]"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c83a1a]/20 via-transparent to-[#5227ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c83a1a]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                {/* Left: Text content */}
                <div className="flex-1 space-y-4">
                  <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#c83a1a]">
                    02 // FEATURED EVENT
                  </span>
                  <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#e5e0d3]">
                    Agomoni
                  </h3>
                  <p className="font-serif text-base sm:text-lg text-[#e5e0d3]/70 max-w-lg leading-relaxed">
                    A pre-Durga Puja celebration of art, music, dance & culture — hosted by RCC Talkies and the Art & Cultural Club of RCCIIT.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold">
                      9 OCT 2026
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#c83a1a]" />
                    <span className="font-sans text-xs uppercase tracking-widest text-[#e5e0d3]/50">
                      RCCIIT Campus
                    </span>
                  </div>
                </div>

                {/* Right: Animated visual element */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex-shrink-0">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-full border border-[#c83a1a]/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-[#c83a1a]/20 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border border-[#c83a1a]/10" />

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl lg:text-6xl">🪔</span>
                  </div>

                  {/* Rotating text ring */}
                  <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <defs>
                      <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text className="fill-[#c83a1a] text-[8px] font-sans font-bold uppercase tracking-widest">
                      <textPath href="#circlePath">
                        Agomoni 2026 • Agomoni 2026 •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              {/* Bottom arrow */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8">
                <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold group-hover:gap-3 transition-all duration-300">
                  Explore
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </section>
      )}
        </div>
      )}
    </div>
  );
}
