"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import siteData from "@/data/site.json";
import teamData from "@/data/team.json";
import pubsData from "@/data/publications.json";
import eventsData from "@/data/events.json";

export default function HomePage() {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const featuredStories = [
    {
      id: "got",
      tag: "GOT | SPORTS",
      isNew: true,
      title: "Game Of Trophies 2025",
      headline: "CSE clinches football final in thrilling penalty shootout",
      blurb: "CSE department wins in a thrilling final that went to penalties. Annual sports festival records broken at track & field.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
      alt: "Sports and football fest at RCCIIT",
      year: "2025",
    },
    {
      id: "techtrix",
      tag: "TECHTRIX | TECH",
      isNew: true,
      title: "TechTrix Hackathon",
      headline: "180 coders, 30 teams, 1 champion in 24-hour sprint",
      blurb: "The ultimate 24-hour coding marathon and robotics championship showcased to industry judges and recruiters.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
      alt: "Hackathon coding competition",
      year: "2025",
    },
    {
      id: "regalia",
      tag: "REGALIA | CULTURE",
      isNew: true,
      title: "Regalia 3-Day Fest",
      headline: "High-octane dance battles and live musical night",
      blurb: "Performances from all departments, award-winning dramatic skits, and live music performances under the stars.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
      alt: "Cultural fest music and dance stage",
      year: "2025",
    },
    {
      id: "magazine",
      tag: "PUBLICATION | VOL. II",
      isNew: true,
      title: "Tech & Culture Issue",
      headline: "The intersection of student startups and creative writing",
      blurb: "Exploring the evolution of campus journalism, feature interviews with alumni, and deep dives into technology.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80",
      alt: "Magazine publication and editorial print",
      year: "2025",
    },
  ];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: THE 3-COLUMN EDITORIAL HERO (Exact Image 1 & 3 layout)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">
          {/* Left Column (Feature Card 1) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              {/* 16:9 Image Box */}
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#14120e]/30 bg-[#dad4c3] mb-4">
                <img
                  src={featuredStories[0].image}
                  alt={featuredStories[0].alt}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider uppercase text-[#14120e]">
                  {featuredStories[0].tag}
                </span>
                <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[2px]">
                  NEW
                </span>
              </div>

              {/* Serif Blurb */}
              <p className="text-sm font-serif text-[#14120e]/85 leading-relaxed">
                {featuredStories[0].blurb}
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 mt-6 text-xs font-sans uppercase tracking-[0.18em] font-semibold text-[#14120e] hover:text-[#c83a1a] transition-colors"
            >
              <span>Explore GOT Archives</span>
              <span>→</span>
            </Link>
          </div>

          {/* Center Column: Big Typographic Statement (Image 1 & 3 Centerpiece) */}
          <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between text-center bg-[#eae5d9]/60">
            <div className="my-auto py-6">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[52px] tracking-tight uppercase text-[#14120e] leading-[0.95] mb-4">
                ALL WORK!
              </h2>
              <p className="font-serif text-2xl sm:text-3xl text-[#14120e] leading-snug max-w-xs mx-auto mb-2">
                A Featured selection
                <br />
                the latest work —
                <br />
                of the last years.
              </p>
            </div>

            {/* Micro Tip Label */}
            <div className="pt-4 border-t border-[#14120e]/15">
              <span className="font-sans text-[11px] uppercase tracking-[0.18em] font-medium text-[#14120e]/70">
                <strong className="font-bold text-[#14120e]">TIP!</strong> Drag sideways or scroll below to explore
              </span>
            </div>
          </div>

          {/* Right Column (Feature Card 2) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              {/* 16:9 Image Box */}
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#14120e]/30 bg-[#dad4c3] mb-4">
                <img
                  src={featuredStories[1].image}
                  alt={featuredStories[1].alt}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider uppercase text-[#14120e]">
                  {featuredStories[1].tag}
                </span>
                <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[2px]">
                  NEW
                </span>
              </div>

              {/* Serif Blurb */}
              <p className="text-sm font-serif text-[#14120e]/85 leading-relaxed">
                {featuredStories[1].blurb}
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 mt-6 text-xs font-sans uppercase tracking-[0.18em] font-semibold text-[#14120e] hover:text-[#c83a1a] transition-colors"
            >
              <span>Explore TechTrix</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: GIANT INVERTED BLACK BANNER ("MIRANDA" - Image 1)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] overflow-hidden border-b border-[#14120e] select-none py-6 sm:py-10 md:py-14 px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between overflow-hidden">
          <h1 className="w-full font-display text-[14vw] sm:text-[13.5vw] lg:text-[13vw] leading-[0.82] tracking-tighter uppercase text-center text-[#e5e0d3] m-0 p-0 block">
            RCC TALKIES
          </h1>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: EDITORIAL MANIFESTO & ABOUT (Exact Image 2 layout)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        {/* Inverted Black "ABOUT US" Bar (Image 2 Top) */}
        <div className="w-full bg-[#14120e] text-[#e5e0d3] py-4 sm:py-6 px-4 sm:px-8 border-b border-[#14120e]">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#e5e0d3] text-center">
            ABOUT US
          </h2>
        </div>

        {/* Manifesto Statement with Three Crosses (Image 2 Body) */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
          <div className="flex items-start gap-4 sm:gap-6 mb-10">
            <span className="font-serif text-3xl sm:text-5xl text-[#14120e] select-none tracking-tight">
              ✖ ✖ ✖
            </span>
            <p className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#14120e] leading-[1.08] tracking-tight font-normal">
              Kolkata-based independent student journalism & media society with focus on <em className="italic font-normal">Campus News</em>, <em className="italic font-normal">Fest Coverage</em>, <em className="italic font-normal">Photography</em> and <em className="italic font-normal">Visual Storytelling</em>.
            </p>
          </div>

          <div className="w-full h-px bg-[#14120e]/20 my-12" />

          {/* 6 Pillars / Desks in Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {siteData.focusAreas.map((area, idx) => (
              <div key={area.title} className="border-l-2 border-[#14120e] pl-5 space-y-2">
                <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block">
                  0{idx + 1} // DESK
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#14120e] uppercase">
                  {area.title}
                </h3>
                <p className="text-sm font-serif text-[#14120e]/80 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: SPLIT EDITORIAL ART POSTER (Image 4 "THE PIXEL" layout)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20 bg-[#eae5d9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">
          {/* Left: Giant Condensed Vertical Typography */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-[#e5e0d3]">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.25em] font-bold text-[#c83a1a] mb-6 block">
                  CAMPUS SPOTLIGHT // 2025
                </span>
                <h2 className="font-display text-7xl sm:text-8xl lg:text-[110px] leading-[0.82] uppercase text-[#14120e] tracking-tighter mb-8">
                  THE
                  <br />
                  VOICE
                </h2>
              </div>
              {/* Official Logo Insignia Inset (Image 4 picture-in-picture style) */}
              <div className="hidden sm:flex flex-col items-center justify-center p-4 border-2 border-[#14120e] bg-[#eae5d9] shadow-[4px_4px_0px_#14120e]">
                <img
                  src="/logo.png"
                  alt="RCC Talkies Official Emblem"
                  className="w-16 h-auto object-contain"
                />
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#14120e] mt-2">
                  OFFICIAL SEAL
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#14120e]/20">
              <p className="font-serif text-lg text-[#14120e]/85 leading-snug">
                From the roar of the football stadium in Game of Trophies to the 24-hour glow of Hackathons — we capture every milestone of RCCIIT.
              </p>
              <div className="flex items-center gap-4 text-xs font-sans uppercase tracking-widest text-[#14120e]">
                <span>25+ Years of Legacy</span>
                <span>•</span>
                <span>5000+ Alumni</span>
              </div>
            </div>
          </div>

          {/* Right: Rich Editorial Art / Fest Photography Frame */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex items-center justify-center bg-[#8f7560]/20">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden border-2 border-[#14120e] shadow-2xl bg-[#14120e]">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
                alt="RCCIIT Fest Stage Celebration"
                className="w-full h-full object-cover contrast-115 filter sepia-[0.15]"
              />

              {/* Graphic Overlay Badges (Stars / Badges from Image 4) */}
              <div className="absolute top-4 left-4 bg-[#14120e] text-[#e5e0d3] px-3 py-1 text-xs font-sans uppercase tracking-[0.2em] font-bold">
                REGALIA '25
              </div>
              <div className="absolute bottom-4 right-4 bg-[#c83a1a] text-[#e5e0d3] px-3 py-1 text-xs font-sans uppercase tracking-widest font-bold">
                ✦ LIVE COVERAGE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: CAROUSEL ARCHIVES / PUBLICATIONS (Image 3 "WOW CONCEPT")
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        {/* Section Header */}
        <div className="px-6 sm:px-10 py-8 border-b border-[#14120e]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-1">
              ARCHIVES & EDITIONS
            </span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-[#14120e]">
              FEATURED PUBLICATIONS
            </h2>
          </div>
          <p className="font-serif text-sm text-[#14120e]/70 max-w-sm">
            Handpicked issues & official event reports — spanning the last few academic sessions.
          </p>
        </div>

        {/* 3 Publication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#14120e]/20">
          {/* Card 1: Vol. II */}
          <div className="p-6 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e]/30 bg-[#2b3a4a] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                  alt="Magazine Volume 2"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider uppercase text-[#14120e]">
                  MAGAZINE VOL. II
                </span>
                <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[2px]">
                  NEW
                </span>
              </div>
              <p className="text-sm font-serif text-[#14120e]/85 leading-relaxed">
                Issue #2 — Tech & Culture. Exploring student startups, artistic expression, and college innovation.
              </p>
            </div>
            <Link
              href="/magazine"
              className="mt-6 inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-bold text-[#14120e] group-hover:text-[#c83a1a]"
            >
              <span>Read Issue</span>
              <span>↗</span>
            </Link>
          </div>

          {/* Card 2: Vol. I */}
          <div className="p-6 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e]/30 bg-[#4a3b2b] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                  alt="Magazine Volume 1"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider uppercase text-[#14120e]">
                  MAGAZINE VOL. I
                </span>
                <span className="bg-[#14120e] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[2px]">
                  2024
                </span>
              </div>
              <p className="text-sm font-serif text-[#14120e]/85 leading-relaxed">
                Issue #1 — The Beginning. Inaugural edition documenting student journalism, history, and campus voices.
              </p>
            </div>
            <Link
              href="/magazine"
              className="mt-6 inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-bold text-[#14120e] group-hover:text-[#c83a1a]"
            >
              <span>Read Issue</span>
              <span>↗</span>
            </Link>
          </div>

          {/* Card 3: Event Reports */}
          <div className="p-6 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e]/30 bg-[#2b4a3a] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
                  alt="Reports PDF"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider uppercase text-[#14120e]">
                  ANNUAL EVENT REPORTS
                </span>
                <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-[2px]">
                  PDF
                </span>
              </div>
              <p className="text-sm font-serif text-[#14120e]/85 leading-relaxed">
                GOT 2024, TechTrix 2024, and Regalia 2024 comprehensive event reports compiled by the research wing.
              </p>
            </div>
            <Link
              href="/reports"
              className="mt-6 inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-bold text-[#14120e] group-hover:text-[#c83a1a]"
            >
              <span>View All Reports</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6: INFINITE RUNNING MARQUEE WITH INVERTED BLACK BUTTON
          (Exact Image 3 "t's create something together [EMAIL ME]" replica)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20 py-8 sm:py-12 overflow-hidden bg-[#ded8c7]/50 select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {/* Loop Segment 1 */}
          <div className="flex items-center gap-8 text-4xl sm:text-6xl lg:text-7xl font-serif text-[#14120e]">
            <span>Let's document campus history together</span>
            <Link
              href="/contact"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-3xl sm:text-4xl lg:text-5xl px-6 py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
            >
              EMAIL US
            </Link>
            <span>The Voice of RCCIIT</span>
            <Link
              href="/contact"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-3xl sm:text-4xl lg:text-5xl px-6 py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
            >
              JOIN DESK
            </Link>
            <span>Let's create something together</span>
            <Link
              href="/magazine"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-3xl sm:text-4xl lg:text-5xl px-6 py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
            >
              READ ISSUE
            </Link>
          </div>

          {/* Loop Segment 2 (Duplicate for continuous marquee) */}
          <div className="flex items-center gap-8 text-4xl sm:text-6xl lg:text-7xl font-serif text-[#14120e]">
            <span>Let's document campus history together</span>
            <Link
              href="/contact"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-3xl sm:text-4xl lg:text-5xl px-6 py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
            >
              EMAIL US
            </Link>
            <span>The Voice of RCCIIT</span>
            <Link
              href="/contact"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-3xl sm:text-4xl lg:text-5xl px-6 py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
            >
              JOIN DESK
            </Link>
            <span>Let's create something together</span>
            <Link
              href="/magazine"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-3xl sm:text-4xl lg:text-5xl px-6 py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
            >
              READ ISSUE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
