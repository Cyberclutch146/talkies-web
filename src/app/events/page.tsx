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
            Comprehensive annual records of RCCIIT&apos;s flagship sports meets, technical hackathons, and cultural fests.
          </p>
        </div>
      </section>

      {/* Editorial Statement */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 border-b border-[#14120e]/20">
        <div className="flex items-baseline gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>Official festival dossiers · Verified by RCC Talkies Reporting & Media Wings</span>
        </div>
      </div>

      {/* 4-Tab Bar */}
      <div className="w-full border-b border-[#14120e]/20 bg-[#eae5d9]/80 overflow-x-auto">
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
                  {activeEvent.shortName} // {activeYearData?.year} HIGHLIGHTS
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
  );
}
