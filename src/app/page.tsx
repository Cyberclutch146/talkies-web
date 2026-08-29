"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import siteData from "@/data/site.json";
import HalftoneReveal from "@/components/HalftoneReveal";
import DecryptedText from "@/components/DecryptedText";
import AboutCollege from "@/components/AboutCollege";
import CircularText from "@/components/CircularText";
import InstagramFeed from "@/components/InstagramFeed";

const missionPillars = [
  {
    tag: "01",
    title: "Document & Report",
    description: "Cover and document key campus events, fests, academic activities, and student achievements accurately and dynamically.",
  },
  {
    tag: "02",
    title: "Creative Expression",
    description: "Provide a collaborative platform for students to explore their talents in content creation, photography, videography, anchoring, writing, and editing.",
  },
  {
    tag: "03",
    title: "Community Engagement",
    description: "Connect the student body, faculty, and alumni through engaging digital media, creative showcases, and insightful campus journalism.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function HomePage() {
  const featuredStories = [
    {
      id: "got",
      tag: "GOT | SPORTS",
      isNew: true,
      title: "Game Of Thrones 2025",
      headline: "RCC clinches silver in thrilling penalty shootout",
      blurb: "RCCIIT settles for second place in the highly competitive 11 A SIDE Football tournament.",
      image: "/events/footballl.webp",
      alt: "Sports and football fest at RCCIIT",
    },
    {
      id: "techtrix",
      tag: "TECHTRIX | TECH",
      isNew: true,
      title: "TechTrix Hackathon",
      headline: "180 coders, 30 teams, 1 champion in 24-hour sprint",
      blurb: "The ultimate gaming tournament and robotics championship showcased to industry judges and recruiters.",
      image: "/events/valorant.webp",
      alt: "Gaming tournament at RCCIIT",
    },
    {
      id: "regalia",
      tag: "REGALIA | CULTURE",
      isNew: true,
      title: "Regalia 3-Day Fest",
      headline: "High-octane dance battles and live musical night",
      blurb: "Performances from all departments, award-winning dramatic skits, and live music under the stars.",
      image: "/events/regaliaband.webp",
      alt: "Cultural fest music and dance stage",
    },
  ];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">

      {/* ═══════════════════════════════════════════════════════════════
          HERO: Full-bleed Halftone + Overlaid Giant Title
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-[#14120e] border-b-2 border-[#14120e]">
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
        <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 text-[9px] sm:text-xs font-sans uppercase tracking-[0.18em] text-[#e5e0d3]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#c83a1a]">✦</span>
            <span className="font-bold">EST. 2023</span>
            <span className="text-[#e5e0d3]/40">·</span>
            <span>RCCIIT, KOLKATA</span>
          </div>
          <span className="font-serif italic text-[#e5e0d3]/50 normal-case tracking-normal text-xs sm:text-sm text-center">
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
          <h1 className="font-display text-[22vw] sm:text-[16vw] lg:text-[14vw] leading-[0.85] tracking-tighter uppercase text-[#e5e0d3] mix-blend-difference text-center drop-shadow-2xl">
            RCC
            <br />
            TALKIES
          </h1>
          <p className="mt-4 sm:mt-6 font-sans text-[9px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#e5e0d3]/70 mix-blend-difference text-center max-w-[90%] mx-auto leading-relaxed">
            THE OFFICIAL JOURNALISM CLUB OF RCCIIT
          </p>
        </div>



        {/* Scroll indicator */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none animate-bounce">
          <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.25em] text-[#e5e0d3]/70 font-bold">
            SCROLL DOWN
          </span>
          <div className="w-[1px] h-6 sm:h-8 bg-[#e5e0d3]/40" />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#e5e0d3]/70">
            <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
          ABOUT THE COLLEGE
      ═══════════════════════════════════════════════════════════════ */}
      <AboutCollege />

      {/* ═══════════════════════════════════════════════════════════════
          MAGAZINE REDIRECT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20 bg-[#14120e] text-[#e5e0d3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#e5e0d3]/20">
          <div className="lg:col-span-8 p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#c83a1a] mb-6 block">
              OFFICIAL PUBLICATIONS
            </span>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-[110px] leading-none uppercase tracking-tighter mb-8 text-[#e5e0d3]">
              THE<br/>MAGAZINE
            </h2>
            <p className="font-serif text-lg sm:text-xl text-[#e5e0d3]/80 leading-relaxed max-w-2xl mb-10">
              Dive into our archives. Explore the stories, features, and reports curated by the RCC Talkies editorial board. Tech, culture, campus life, and everything in between.
            </p>
            <Link
              href="/magazine"
              className="inline-flex items-center gap-3 w-fit border border-[#e5e0d3]/30 px-6 py-4 hover:bg-[#c83a1a] hover:border-[#c83a1a] transition-all group"
            >
              <span className="font-sans text-xs sm:text-sm uppercase tracking-widest font-bold text-[#e5e0d3]">
                Browse All Issues
              </span>
              <span className="group-hover:translate-x-1 transition-transform text-[#e5e0d3]">→</span>
            </Link>
          </div>
          <div className="lg:col-span-4 p-8 sm:p-12 bg-[#c83a1a] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 flex flex-wrap content-start overflow-hidden pointer-events-none select-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span key={i} className="font-display text-6xl leading-[0.8] text-[#14120e] mix-blend-multiply">READ </span>
                ))}
             </div>
             <div className="relative z-10 text-center">
                <span className="font-display text-8xl lg:text-[140px] leading-none block text-[#14120e]">VOL</span>
                <span className="font-serif italic text-4xl lg:text-6xl block mt-2 text-[#e5e0d3]">I & II</span>
             </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          VISION & MISSION — Paper theme, proper spacing
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        {/* Section header bar */}
        <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-[#14120e]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-1">
              WHAT WE STAND FOR
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#14120e]">
              <DecryptedText
                text="VISION & MISSION"
                animateOn="view"
                speed={30}
                maxIterations={6}
                sequential={true}
                revealDirection="start"
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h2>
          </div>
          <p className="font-serif text-sm text-[#14120e]/60 max-w-sm italic">
            The principles that guide RCC Talkies as the creative voice of RCCIIT.
          </p>
        </div>

        {/* Content: Logo + Vision left, Mission pillars right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">

          {/* Left: Vision + CircularText Logo */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col items-center justify-center gap-10">
            {/* CircularText with logo */}
            <motion.div
              className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]"
              initial={{ opacity: 0, rotate: -20 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <CircularText
                  text="RCC TALKIES • THE VOICE OF RCCIIT • EST. 2022 • "
                  spinDuration={25}
                  onHover="speedUp"
                  className="!w-[220px] !h-[220px] sm:!w-[260px] sm:!h-[260px] !text-[#14120e]/60 !font-sans !text-[10px] sm:!text-[12px] !tracking-[0.15em] !uppercase"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image
                  src="/logo.png"
                  alt="RCC Talkies Logo"
                  width={200}
                  height={200}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain opacity-80"
                />
              </div>
            </motion.div>

            {/* Vision statement */}
            <motion.div
              className="text-center max-w-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={0}
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
                ✦ OUR VISION
              </span>
              <p className="font-serif text-base sm:text-lg text-[#14120e]/80 leading-relaxed">
                To serve as the creative voice and official media pulse of the college community, fostering a vibrant culture of digital storytelling, journalistic integrity, filmmaking, and visual communication.
              </p>
            </motion.div>
          </div>

          {/* Right: Mission Pillars */}
          <div className="lg:col-span-7 p-8 sm:p-12 bg-[#eae5d9]/40 space-y-6">
            <div className="border-b border-[#14120e]/20 pb-4">
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-1">
                OUR MISSION
              </span>
              <p className="font-serif text-sm text-[#14120e]/60">
                Three pillars that drive everything we create, document, and share.
              </p>
            </div>

            {missionPillars.map((pillar, idx) => (
              <motion.div
                key={pillar.tag}
                className="group p-6 sm:p-8 border border-[#14120e]/15 bg-[#e5e0d3] hover:border-[#14120e] hover:shadow-[4px_4px_0px_#14120e] hover:-translate-y-0.5 transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={idx + 1}
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="font-display text-3xl sm:text-4xl text-[#c83a1a] flex-shrink-0 leading-none">
                    {pillar.tag}
                  </span>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-[#14120e] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="font-serif text-sm sm:text-base text-[#14120e]/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA — Get In Touch
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">

          {/* Left: Headline + Contact Links */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#c83a1a] mb-4 block">
              GET IN TOUCH
            </span>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#14120e] leading-[0.9] mb-6">
              <DecryptedText
                text="WANT TO COLLABORATE?"
                animateOn="view"
                speed={35}
                maxIterations={7}
                sequential={true}
                revealDirection="start"
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#14120e]/75 leading-relaxed max-w-xl mb-10">
              Whether you&apos;re a student looking to join our editorial team, a club wanting cross-coverage, or anyone with a story worth telling — reach out. We&apos;re always listening.
            </p>

            {/* Contact Links */}
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:rcctalkies@gmail.com"
                className="group flex items-center gap-4 p-5 border border-[#14120e]/20 hover:border-[#14120e] hover:shadow-[4px_4px_0px_#14120e] hover:-translate-y-0.5 transition-all duration-300 bg-[#e5e0d3]"
              >
                <div className="w-12 h-12 bg-[#14120e] text-[#e5e0d3] flex items-center justify-center flex-shrink-0 group-hover:bg-[#c83a1a] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-0.5">
                    EMAIL US
                  </span>
                  <span className="font-display text-lg sm:text-xl uppercase tracking-tight text-[#14120e] group-hover:text-[#c83a1a] transition-colors">
                    rcctalkies@gmail.com
                  </span>
                </div>
                <span className="text-[#14120e]/30 group-hover:text-[#c83a1a] group-hover:translate-x-1 transition-all text-xl">
                  →
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/rcc_talkies/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 border border-[#14120e]/20 hover:border-[#14120e] hover:shadow-[4px_4px_0px_#14120e] hover:-translate-y-0.5 transition-all duration-300 bg-[#e5e0d3]"
              >
                <div className="w-12 h-12 bg-[#14120e] text-[#e5e0d3] flex items-center justify-center flex-shrink-0 group-hover:bg-[#c83a1a] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold block mb-0.5">
                    FOLLOW US
                  </span>
                  <span className="font-display text-lg sm:text-xl uppercase tracking-tight text-[#14120e] group-hover:text-[#c83a1a] transition-colors">
                    @rcc_talkies
                  </span>
                </div>
                <span className="text-[#14120e]/30 group-hover:text-[#c83a1a] group-hover:translate-x-1 transition-all text-xl">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Right: Bold Accent Block */}
          <div className="lg:col-span-5 bg-[#c83a1a] p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
            {/* Repeating background text */}
            <div className="absolute inset-0 opacity-10 flex flex-wrap content-start overflow-hidden pointer-events-none select-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <span key={i} className="font-display text-5xl sm:text-6xl leading-[0.85] text-[#14120e] mix-blend-multiply">WRITE </span>
              ))}
            </div>
            <div className="relative z-10 text-center space-y-4">
              <span className="font-display text-7xl sm:text-8xl lg:text-[120px] leading-none block text-[#14120e]">
                JOIN
              </span>
              <span className="font-serif italic text-3xl sm:text-4xl lg:text-5xl block text-[#e5e0d3]">
                the desk
              </span>
              <div className="w-16 h-[2px] bg-[#e5e0d3]/40 mx-auto" />
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#e5e0d3]/60 max-w-xs mx-auto">
                Writers · Photographers · Designers · Video Editors · Anchors
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          INSTAGRAM FEED
      ═══════════════════════════════════════════════════════════════ */}
      <InstagramFeed />

      {/* ═══════════════════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full border-b border-[#14120e]/20 py-6 sm:py-10 overflow-hidden bg-[#ded8c7]/50 select-none">
        <div className="animate-marquee flex items-center gap-6 sm:gap-8 whitespace-nowrap">
          {[0, 1].map((seg) => (
            <div key={seg} className="flex items-center gap-6 sm:gap-8 text-xl sm:text-5xl lg:text-6xl font-serif text-[#14120e]">
              <span>Let&apos;s document campus history together</span>
              <Link
                href="/contact"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-lg sm:text-3xl lg:text-4xl px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
              >
                EMAIL US
              </Link>
              <span>The Voice of RCCIIT</span>
              <Link
                href="/contact"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-lg sm:text-3xl lg:text-4xl px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
              >
                JOIN DESK
              </Link>
              <span>Let&apos;s create something together</span>
              <Link
                href="/magazine"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-lg sm:text-3xl lg:text-4xl px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-tight hover:bg-[#c83a1a] transition-colors"
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
