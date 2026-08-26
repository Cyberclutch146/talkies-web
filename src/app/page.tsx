"use client";

import Link from "next/link";
import siteData from "@/data/site.json";
import HalftoneReveal from "@/components/HalftoneReveal";
import DecryptedText from "@/components/DecryptedText";

export default function HomePage() {
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
    },
    {
      id: "regalia",
      tag: "REGALIA | CULTURE",
      isNew: true,
      title: "Regalia 3-Day Fest",
      headline: "High-octane dance battles and live musical night",
      blurb: "Performances from all departments, award-winning dramatic skits, and live music under the stars.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
      alt: "Cultural fest music and dance stage",
    },
  ];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ═══════════════════════════════════════════════════════════════
          HERO: Full-bleed Halftone + Overlaid Giant Title
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] min-h-[500px] max-h-[1000px] overflow-hidden bg-[#14120e] border-b-2 border-[#14120e]">
        {/* Full-bleed Halftone Canvas */}
        <div className="absolute inset-0 z-0">
          <HalftoneReveal
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80"
            inkColor="#14120e"
            paperColor="#e5e0d3"
            mode="mono"
            dotDensity={80}
            angle={32}
            revealRadius={0.3}
            idleReveal={0.04}
            follow={0.25}
            trigger="hover"
            borderRadius="0px"
          />
        </div>

        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#14120e]/30 via-transparent to-[#14120e]/60 pointer-events-none" />

        {/* Top dateline */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-sans uppercase tracking-[0.18em] text-[#e5e0d3]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#c83a1a]">✦</span>
            <span className="font-bold">EST. 1999</span>
            <span className="text-[#e5e0d3]/40 hidden sm:inline">·</span>
            <span className="hidden sm:inline">RCCIIT, KOLKATA</span>
          </div>
          <span className="hidden md:inline font-serif italic text-[#e5e0d3]/50 normal-case tracking-normal text-sm">
            &ldquo;The Voice of RCCIIT&rdquo;
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] px-2 py-0.5 font-bold">
              LIVE
            </span>
            <span className="hidden sm:inline">VOL. II · 2025</span>
          </div>
        </div>

        {/* Center: Giant overlaid title with mix-blend */}
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center pointer-events-none select-none px-4">
          <h1 className="font-display text-[18vw] sm:text-[16vw] lg:text-[14vw] leading-[0.82] tracking-tighter uppercase text-[#e5e0d3] mix-blend-difference text-center drop-shadow-2xl">
            RCC
            <br />
            TALKIES
          </h1>
          <p className="mt-4 sm:mt-6 font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#e5e0d3]/70 mix-blend-difference text-center">
            THE OFFICIAL JOURNALISM CLUB OF RCCIIT
          </p>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#14120e]/70 backdrop-blur-sm text-[10px] sm:text-xs font-sans uppercase tracking-widest text-[#e5e0d3]/90">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#c83a1a] animate-pulse flex-shrink-0" />
            <span className="font-bold">LATEST //</span>
            <span className="text-[#e5e0d3]/70">GOT 2025 & TechTrix registrations live</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 font-bold pointer-events-auto">
            <Link href="/events" className="hover:text-[#c83a1a] transition-colors">
              EVENTS ↓
            </Link>
            <span className="text-[#e5e0d3]/30">•</span>
            <Link href="/contact" className="hover:text-[#c83a1a] transition-colors">
              JOIN US ↗
            </Link>
          </div>
        </div>

        {/* Loupe hint */}
        <div className="absolute bottom-14 sm:bottom-16 right-4 sm:right-8 z-10 bg-[#c83a1a] text-[#e5e0d3] px-3 py-1.5 text-[9px] sm:text-[10px] font-sans uppercase tracking-widest font-bold pointer-events-none">
          ✦ HOVER TO REVEAL
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EDITORIAL STORIES: 3-col feature grid
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#14120e]/20">
          {featuredStories.map((story) => (
            <div key={story.id} className="p-5 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#14120e]/30 bg-[#dad4c3] mb-4">
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase text-[#14120e]">
                    {story.tag}
                  </span>
                  {story.isNew && (
                    <span className="bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5">
                      NEW
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-[#14120e] leading-tight mb-2">
                  {story.headline}
                </h3>
                <p className="text-sm font-serif text-[#14120e]/75 leading-relaxed">
                  {story.blurb}
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 mt-5 text-[11px] font-sans uppercase tracking-[0.15em] font-bold text-[#14120e] hover:text-[#c83a1a] transition-colors"
              >
                <span>Read More</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT US: Manifesto + Desks
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        <div className="w-full bg-[#14120e] text-[#e5e0d3] py-5 sm:py-8 px-4 sm:px-8 border-b border-[#14120e]">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#e5e0d3] text-center">
            <DecryptedText
              text="ABOUT US"
              animateOn="view"
              speed={40}
              maxIterations={8}
              sequential={true}
              revealDirection="center"
              className="text-[#e5e0d3]"
              encryptedClassName="text-[#c83a1a]"
            />
          </h2>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-10 py-12 sm:py-20">
          <div className="flex items-start gap-3 sm:gap-6 mb-10">
            <span className="font-serif text-2xl sm:text-4xl text-[#14120e] select-none tracking-tight flex-shrink-0">
              ✖ ✖ ✖
            </span>
            <p className="font-serif text-xl sm:text-3xl lg:text-5xl text-[#14120e] leading-[1.12] tracking-tight">
              Kolkata-based independent student journalism & media society with focus on{" "}
              <em className="italic">Campus News</em>,{" "}
              <em className="italic">Fest Coverage</em>,{" "}
              <em className="italic">Photography</em> and{" "}
              <em className="italic">Visual Storytelling</em>.
            </p>
          </div>

          <div className="w-full h-px bg-[#14120e]/20 my-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {siteData.focusAreas.map((area, idx) => (
              <div key={area.title} className="border-l-2 border-[#14120e] pl-4 sm:pl-5 space-y-2">
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block">
                  0{idx + 1} // DESK
                </span>
                <h3 className="font-display text-lg sm:text-xl text-[#14120e] uppercase">
                  {area.title}
                </h3>
                <p className="text-sm font-serif text-[#14120e]/75 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SPLIT: THE VOICE + Fest Photography
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20 bg-[#eae5d9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#e5e0d3]">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#c83a1a] mb-4 sm:mb-6 block">
                  CAMPUS SPOTLIGHT // 2025
                </span>
                <h2 className="font-display text-6xl sm:text-7xl lg:text-[100px] leading-[0.82] uppercase text-[#14120e] tracking-tighter mb-6 sm:mb-8">
                  THE
                  <br />
                  VOICE
                </h2>
              </div>
              <div className="hidden sm:flex flex-col items-center justify-center p-3 border-2 border-[#14120e] bg-[#eae5d9] shadow-[3px_3px_0px_#14120e]">
                <img
                  src="/logo.png"
                  alt="RCC Talkies Official Emblem"
                  className="w-14 h-auto object-contain"
                />
                <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#14120e] mt-1.5">
                  OFFICIAL SEAL
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-5 border-t border-[#14120e]/20">
              <p className="font-serif text-base sm:text-lg text-[#14120e]/80 leading-snug">
                From the roar of the football stadium in Game of Trophies to the 24-hour glow of Hackathons — we capture every milestone of RCCIIT.
              </p>
              <div className="flex items-center gap-3 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-[#14120e]">
                <span>25+ Years</span>
                <span>•</span>
                <span>5000+ Alumni</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-4 sm:p-8 flex items-center justify-center bg-[#8f7560]/20">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden border-2 border-[#14120e] shadow-2xl bg-[#14120e]">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
                alt="RCCIIT Fest Stage Celebration"
                className="w-full h-full object-cover contrast-[1.15] sepia-[0.15]"
              />
              <div className="absolute top-3 left-3 bg-[#14120e] text-[#e5e0d3] px-2.5 py-1 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-bold">
                REGALIA '25
              </div>
              <div className="absolute bottom-3 right-3 bg-[#c83a1a] text-[#e5e0d3] px-2.5 py-1 text-[10px] sm:text-xs font-sans uppercase tracking-widest font-bold">
                ✦ LIVE COVERAGE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PUBLICATIONS: 3 cards
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-[#14120e]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-1">
              ARCHIVES & EDITIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#14120e]">
              FEATURED PUBLICATIONS
            </h2>
          </div>
          <p className="font-serif text-sm text-[#14120e]/60 max-w-sm">
            Handpicked issues & official event reports from the last few sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#14120e]/20">
          {[
            {
              badge: "VOL. II",
              badgeColor: "bg-[#c83a1a]",
              title: "MAGAZINE VOL. II",
              subtitle: "Tech & Culture — student startups, artistic expression, and innovation.",
              img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
              link: "/magazine",
              cta: "Read Issue",
            },
            {
              badge: "2024",
              badgeColor: "bg-[#14120e]",
              title: "MAGAZINE VOL. I",
              subtitle: "The Beginning — inaugural edition documenting student journalism and campus voices.",
              img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
              link: "/magazine",
              cta: "Read Issue",
            },
            {
              badge: "PDF",
              badgeColor: "bg-[#c83a1a]",
              title: "EVENT REPORTS",
              subtitle: "GOT, TechTrix, and Regalia 2024 comprehensive reports by the research wing.",
              img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
              link: "/reports",
              cta: "View Reports",
            },
          ].map((pub) => (
            <div key={pub.title} className="p-5 sm:p-8 flex flex-col justify-between group hover:bg-[#e0dbcd]/50 transition-colors">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#14120e]/30 bg-[#2b3a4a] mb-4">
                  <img
                    src={pub.img}
                    alt={pub.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase text-[#14120e]">
                    {pub.title}
                  </span>
                  <span className={`${pub.badgeColor} text-[#e5e0d3] text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5`}>
                    {pub.badge}
                  </span>
                </div>
                <p className="text-sm font-serif text-[#14120e]/75 leading-relaxed">
                  {pub.subtitle}
                </p>
              </div>
              <Link
                href={pub.link}
                className="mt-5 inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e] group-hover:text-[#c83a1a]"
              >
                <span>{pub.cta}</span>
                <span>↗</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20 py-6 sm:py-10 overflow-hidden bg-[#ded8c7]/50 select-none">
        <div className="animate-marquee flex items-center gap-6 sm:gap-8 whitespace-nowrap">
          {[0, 1].map((seg) => (
            <div key={seg} className="flex items-center gap-6 sm:gap-8 text-3xl sm:text-5xl lg:text-6xl font-serif text-[#14120e]">
              <span>Let&apos;s document campus history together</span>
              <Link
                href="/contact"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-2xl sm:text-3xl lg:text-4xl px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
              >
                EMAIL US
              </Link>
              <span>The Voice of RCCIIT</span>
              <Link
                href="/contact"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-2xl sm:text-3xl lg:text-4xl px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
              >
                JOIN DESK
              </Link>
              <span>Let&apos;s create something together</span>
              <Link
                href="/magazine"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-2xl sm:text-3xl lg:text-4xl px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
              >
                READ ISSUE
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
