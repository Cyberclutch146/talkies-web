"use client";

import { useState } from "react";
import eventsData from "@/data/events.json";
import AccordionGallery, { AccordionGalleryItem } from "@/components/AccordionGallery";
import DecryptedText from "@/components/DecryptedText";

type TabKey = "got" | "techtrix" | "regalia" | "external";

const tabs: { key: TabKey; label: string; code: string }[] = [
  { key: "got", label: "Game Of Trophies", code: "01 // GOT" },
  { key: "techtrix", label: "TechTrix Fest", code: "02 // TECH" },
  { key: "regalia", label: "Regalia Cultural", code: "03 // REGALIA" },
  { key: "external", label: "External Fests", code: "04 // EXTERNAL" },
];

const eventImages: Record<string, string> = {
  got: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
  techtrix: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
  regalia: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
};

const galleryItems: (AccordionGalleryItem & { tab: TabKey })[] = [
  {
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    label: "GOT // Football Finals",
    alt: "Game of Trophies Football match",
    tab: "got"
  },
  {
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    label: "TechTrix // 24h Hackathon",
    alt: "TechTrix coding marathon",
    tab: "techtrix"
  },
  {
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    label: "Regalia // Music Night",
    alt: "Regalia live band performance",
    tab: "regalia"
  },
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    label: "TechTrix // Robo-Wars",
    alt: "Robotics battle competition",
    tab: "techtrix"
  },
  {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    label: "Regalia // Dance Battle",
    alt: "Choreography dance performance",
    tab: "regalia"
  }
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("got");
  const [activeYear, setActiveYear] = useState<number>(2025);

  const activeEvent = eventsData.flagship.find((e) => e.slug === activeTab);
  const activeYearData = activeEvent?.years.find((y) => y.year === activeYear) || activeEvent?.years[0];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] py-6 sm:py-10 px-4 sm:px-8 border-b border-[#14120e]">
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
            Comprehensive annual records of RCCIIT's flagship sports meets, technical hackathons, and cultural fests.
          </p>
        </div>
      </section>

      {/* Interactive Accordion Gallery Showcase */}
      <section className="w-full border-b border-[#14120e]/20 bg-[#ded8c7]/50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#14120e]/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a]">
                INTERACTIVE GALLERY
              </span>
              <span className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60">
                // Hover or tap panels to expand highlights
              </span>
            </div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#14120e]/50">
              Coverage 2023–2025
            </span>
          </div>

          <AccordionGallery
            items={galleryItems}
            defaultIndex={2}
            accentColor="#c83a1a"
            overlayColor="#14120e"
            textColor="#e5e0d3"
            height={460}
            gap={8}
            radius={0}
            expandRatio={0.52}
            trigger="hover"
            grayscale={true}
          />
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
                  setActiveYear(2025);
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

      {/* Event Details Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab !== "external" && activeEvent && (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">
            {/* Left: Event Poster & Year Switcher */}
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e]/30 bg-[#14120e]">
                <img
                  src={eventImages[activeEvent.slug] || eventImages.got}
                  alt={activeEvent.name}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute top-3 left-3 bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-2 py-0.5">
                  {activeEvent.tagline}
                </div>
              </div>

              <div>
                <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-[#14120e] mb-3">
                  {activeEvent.name}
                </h2>
                <p className="font-serif text-base text-[#14120e]/80 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>

              {/* Year Selectors */}
              <div className="pt-4 border-t border-[#14120e]/20">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#14120e]/60 block mb-3">
                  Select Edition Year
                </span>
                <div className="flex gap-2">
                  {activeEvent.years.map((y) => (
                    <button
                      key={y.year}
                      onClick={() => setActiveYear(y.year)}
                      className={`px-4 py-2 text-xs font-sans uppercase tracking-widest font-bold border transition-colors ${
                        activeYear === y.year
                          ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e]"
                          : "border-[#14120e]/30 text-[#14120e] hover:border-[#14120e]"
                      }`}
                    >
                      {y.year}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Highlights Breakdown */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-8 bg-[#eae5d9]/40">
              <div className="border-b border-[#14120e]/20 pb-4 flex justify-between items-end">
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#14120e]">
                  {activeEvent.shortName} // {activeYear} HIGHLIGHTS
                </h3>
                <span className="text-xs font-sans uppercase tracking-widest text-[#c83a1a] font-bold">
                  ✦ 3 STORIES
                </span>
              </div>

              <div className="space-y-6">
                {activeYearData?.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-6 border border-[#14120e]/20 bg-[#e5e0d3] hover:border-[#14120e] transition-colors space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl text-[#c83a1a]">
                        0{i + 1}
                      </span>
                      <h4 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-[#14120e]">
                        {h.title}
                      </h4>
                    </div>
                    <p className="font-serif text-base text-[#14120e]/85 leading-relaxed pl-8">
                      {h.blurb}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* External Events Grid */}
        {activeTab === "external" && (
          <div className="p-6 sm:p-12 space-y-6">
            <div className="max-w-2xl mb-8">
              <h2 className="font-display text-4xl uppercase tracking-tight text-[#14120e] mb-2">
                INTER-COLLEGE & EXTERNAL PARTICIPATION
              </h2>
              <p className="font-serif text-base text-[#14120e]/80">
                Competitions, state-level hackathons, and university fests covered by RCC Talkies journalists outside our campus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventsData.external.map((ext, idx) => (
                <div
                  key={ext.name}
                  className="border border-[#14120e]/20 p-6 bg-[#e0dbcd]/40 hover:bg-[#e0dbcd] transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#c83a1a]">
                      EXTERNAL // 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-widest px-2 py-0.5 border border-[#14120e]/30 bg-[#e5e0d3]">
                      WEST BENGAL
                    </span>
                  </div>
                  <h3 className="font-display text-2xl uppercase text-[#14120e]">
                    {ext.name}
                  </h3>
                  <p className="font-serif text-sm text-[#14120e]/85 leading-relaxed">
                    {ext.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
