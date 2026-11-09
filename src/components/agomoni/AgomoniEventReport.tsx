"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { DappledLight } from "./DappledLight";
import { Device } from "./Device";
import { Noise } from "./Noise";
import { AGOMONI_REPORT } from "../../data/agomoniReport";

function SectionLabel({ index, title }: { index?: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[#d4a24e]">
      {index && (
        <span className="font-sans text-[10px] font-bold uppercase tracking-[.28em]">
          {index}
        </span>
      )}
      <span className="h-px flex-1 bg-[#d4a24e]/20" />
      <h3 className="font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#faf6ee]">
        {title}
      </h3>
    </div>
  );
}

/**
 * Event Description Section — placed after Glimpses of Agomoni (see src/app/agomoni/page.tsx).
 * Background layers, bottom to top:
 *   1. The darkened misty-forest photo, tinted into the Agomoni palette.
 *   2. A #14120e scrim + vignette so the description text stays readable.
 *   3. DappledLight (sunlight through swaying leaves), screen-blended.
 *   4. React Bits Noise film grain for print texture.
 * Content provides a celebratory narrative description of Agomoni 2026 alongside the reel.
 */
export function AgomoniEventReport() {
  const prefersReduced = useReducedMotion();
  const [reelMuted, setReelMuted] = useState(true);
  const [reelPaused, setReelPaused] = useState(false);
  const reelVideoRef = useRef<HTMLVideoElement>(null);
  const report = AGOMONI_REPORT;

  // Sync mute state and try initial autoplay on mount
  useEffect(() => {
    const v = reelVideoRef.current;
    if (!v) return;
    v.muted = reelMuted;
    if (prefersReduced) {
      v.pause();
      setReelPaused(true);
      return;
    }
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setReelPaused(false))
        .catch(() => {
          // Autoplay blocked by browser policy; show play button
          setReelPaused(true);
        });
    }
  }, [prefersReduced, reelMuted]);

  const togglePlay = () => {
    const v = reelVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setReelPaused(false))
        .catch(() => setReelPaused(true));
    } else {
      v.pause();
      setReelPaused(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = reelVideoRef.current;
    if (!v) return;
    const next = !reelMuted;
    v.muted = next;
    setReelMuted(next);
  };

  const fadeUp = (delay: number) => ({
    initial: prefersReduced ? {} : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="event-report"
      className="relative overflow-hidden bg-[#14120e] text-[#faf6ee]"
      aria-labelledby="event-report-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* 1 · Misty amber forest photo, darkened for the Agomoni theme */}
        <div className="absolute inset-0">
          <Image
            src="/agomoni/event-report-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-95 [filter:brightness(0.78)_saturate(1.08)_contrast(1.05)]"
          />
        </div>
        {/* 2 · Theme scrim + vignette for text contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,18,14,0.82),rgba(20,18,14,0.48)_35%,rgba(20,18,14,0.56)_65%,rgba(20,18,14,0.88))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(20,18,14,0.48)_100%)]" />
        {/* 3 · Dappled sunlight */}
        <DappledLight />
        {/* 4 · Film grain */}
        <Noise
          opacity={0.16}
          size={1}
          fps={12}
          blendMode="overlay"
          contrast={0.55}
          colored={false}
          dust={0.18}
          scratches={0}
          scanlines={0}
          flicker={0.1}
        />
        {/* shade from the previous section's colour, and into the next */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#14120e]/95 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#14120e]/95 to-transparent" />
      </div>
      <div className="relative z-10">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="relative mx-auto max-w-[88rem] px-6 pt-14 sm:px-10 lg:px-16 sm:pt-20">
          <motion.div {...fadeUp(0)} className="mb-4 flex items-center justify-center gap-3 text-[#d4a24e]">
            <span className="h-px w-8 bg-current" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[.28em]">{report.eyebrow}</span>
            <span className="h-px w-8 bg-current" />
          </motion.div>

          <motion.h2
            id="event-report-heading"
            {...fadeUp(0.05)}
            className="mx-auto mb-3 max-w-6xl text-center font-display-serif text-4xl leading-tight sm:text-6xl"
          >
            {report.title}
          </motion.h2>

          <motion.p
            {...fadeUp(0.1)}
            className="mx-auto mb-2 max-w-4xl text-center font-serif text-sm italic leading-relaxed text-[#faf6ee]/70 sm:text-base"
          >
            {report.standfirst}
          </motion.p>
          <motion.p
            {...fadeUp(0.12)}
            className="mx-auto mb-8 max-w-4xl text-center font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#d4a24e]"
          >
            {report.edition}
          </motion.p>

          <motion.dl
            {...fadeUp(0.15)}
            className="mx-auto mb-10 grid max-w-7xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#d4a24e]/20 bg-[#d4a24e]/20 sm:grid-cols-3"
          >
            {report.meta.map((item, i) => (
              <motion.div
                key={item.label}
                whileHover={prefersReduced ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group bg-[#14120e]/85 px-4 py-4 text-center backdrop-blur-sm transition-colors hover:bg-[#d4a24e]/10"
              >
                <dt className="mb-1 font-sans text-[9px] font-bold uppercase tracking-[.22em] text-[#d4a24e]">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#d4a24e]/60 align-middle transition-transform group-hover:scale-150" aria-hidden="true" />
                  {item.label}
                </dt>
                <dd className="font-serif text-sm text-[#faf6ee] sm:text-base">{item.value}</dd>
                <span className="sr-only"> ({i + 1} of {report.meta.length})</span>
              </motion.div>
            ))}
          </motion.dl>

          {/* ── Main Content: Description alongside the Phone Reel ── */}
          <motion.div {...fadeUp(0.18)} className="mx-auto mb-14 max-w-[80rem]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:items-start">
              {/* Left — event description at the side of the phone */}
              <div className="space-y-8">
                <div>
                  <SectionLabel index="01" title="The Gathering" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    {report.introduction.map((para, index) => (
                      <motion.article
                        key={index}
                        {...fadeUp(index * 0.07)}
                        whileHover={prefersReduced ? undefined : { y: -4 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="group relative overflow-hidden rounded-2xl border border-[#faf6ee]/12 bg-[#faf6ee]/[0.04] p-5 backdrop-blur-sm sm:p-6"
                      >
                        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#d4a24e] to-[#c83a1a] opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                        <p className="font-serif text-sm leading-relaxed text-[#faf6ee]/80 sm:text-[15px]">{para.body}</p>
                      </motion.article>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel index="02" title="Reflections" />
                  <motion.blockquote
                    {...fadeUp(0.12)}
                    whileHover={prefersReduced ? undefined : { y: -3 }}
                    className="relative overflow-hidden rounded-2xl border border-[#d4a24e]/30 bg-[#d4a24e]/[0.07] p-5 backdrop-blur-sm sm:p-7"
                  >
                    <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[140px] leading-none text-[#d4a24e]/10" aria-hidden="true">”</span>
                    <p className="relative font-serif text-sm leading-relaxed text-[#faf6ee]/85 sm:text-base">{report.conclusion}</p>
                    <p className="relative mt-4 font-sans text-[10px] font-bold uppercase tracking-[.22em] text-[#d4a24e]">
                      ✦ A memorable celebration — creativity, culture &amp; togetherness
                    </p>
                  </motion.blockquote>
                </div>

                <div className="pt-2">
                  <a
                    href="#glimpses"
                    className="inline-flex items-center rounded-full border border-[#faf6ee]/25 px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#faf6ee]/70 transition-colors hover:border-[#faf6ee]/60 hover:text-[#faf6ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
                  >
                    ↩ Back to Glimpses
                  </a>
                </div>
              </div>

              {/* Right — reel in a phone frame */}
              <aside className="flex flex-col items-center lg:sticky lg:top-24">
                <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#d4a24e]">
                  Watch the reel ✦
                </p>
                <div className="relative w-full">
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,162,78,0.20),transparent_70%)] blur-2xl"
                    aria-hidden="true"
                  />
                  <Device label="Agomoni 2026 highlights reel — playing in the page" className="relative">
                    <div
                      className="relative h-full w-full cursor-pointer overflow-hidden bg-black"
                      onClick={togglePlay}
                    >
                      <video
                        ref={reelVideoRef}
                        className="absolute inset-0 h-full w-full object-contain"
                        src="/agomoni/agomoni-reel.mp4"
                        poster="/agomoni/glimpses/performances/NIL_0219.webp"
                        autoPlay
                        loop
                        muted={reelMuted}
                        playsInline
                        preload="auto"
                        onPlay={() => setReelPaused(false)}
                        onPause={() => setReelPaused(true)}
                        aria-label="Agomoni 2026 reel — tap to pause or play"
                      />

                      {/* shade for the reel chrome */}
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" aria-hidden="true" />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 to-transparent" aria-hidden="true" />

                      {/* top — channel handle */}
                      <span className="pointer-events-none absolute inset-x-3 top-10 flex items-center gap-2" aria-hidden="true">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#d4a24e] via-[#c83a1a] to-[#e07856] font-sans text-[9px] font-bold text-white ring-1 ring-white/40">
                          R
                        </span>
                        <span className="font-sans text-[11px] font-semibold text-white drop-shadow">rcc_talkies</span>
                        <span className="font-sans text-[10px] text-white/70">· Agomoni 2026</span>
                        <span className="ml-auto font-sans text-sm text-white/80">⋯</span>
                      </span>

                      {/* paused indicator */}
                      {reelPaused && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a24e] text-[#14120e] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform hover:scale-110"
                            aria-hidden="true"
                          >
                            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current" aria-hidden="true">
                              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                            </svg>
                          </span>
                        </div>
                      )}

                      {/* mute / unmute */}
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={reelMuted ? "Unmute the reel" : "Mute the reel"}
                        className="absolute bottom-32 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
                      >
                        {reelMuted ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                            <path d="M4 9v6h4l5 4V5L8 9H4Zm13.6 3 2.5-2.5-1.4-1.4-2.5 2.5-2.5-2.5-1.4 1.4L14.8 12l-2.5 2.5 1.4 1.4 2.5-2.5 2.5 2.5 1.4-1.4L17.6 12Z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                            <path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2Zm-2-7.4v2.1a5.5 5.5 0 0 1 0 10.6v2.1a7.5 7.5 0 0 0 0-14.8Z" />
                          </svg>
                        )}
                      </button>

                      {/* bottom — caption + actions */}
                      <span className="pointer-events-none absolute inset-x-3 bottom-3 right-14" aria-hidden="true">
                        <span className="block font-sans text-[11px] font-semibold text-white drop-shadow">
                          Relive the evening ✨
                        </span>
                        <span className="mt-0.5 block font-sans text-[10px] text-white/75 drop-shadow">
                          9 Oct 2026 · Dr. Jaya Deb Roy Auditorium
                        </span>
                      </span>
                      <span className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-center gap-3 text-white" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current drop-shadow" aria-hidden="true">
                          <path d="M12 21s-7.5-4.6-10-9.3C.4 8.6 2.3 5 5.8 5 8 5 9.6 6.2 12 7.7 14.4 6.2 16 5 18.2 5c3.5 0 5.4 3.6 3.8 6.7C19.5 16.4 12 21 12 21Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current drop-shadow" aria-hidden="true">
                          <path d="M12 4a8 8 0 0 0-7.7 10.2L3 20l5.9-1.3A8 8 0 1 0 12 4Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current drop-shadow" aria-hidden="true">
                          <path d="M21 3 10 14 3 10.5 21 3Zm0 0-6.5 18L10 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Device>
                </div>
                <a
                  href="https://www.instagram.com/reel/DfPTUSupUBZ/?exln=NzRvZmo1c2FlNjF0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 rounded-full border border-[#d4a24e]/60 px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e] transition-colors hover:bg-[#d4a24e] hover:text-[#14120e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
                >
                  Open on Instagram ↗
                </a>
                <p className="mt-2 text-center font-serif text-xs italic text-[#faf6ee]/50">
                  Relive the evening on our feed.
                </p>
              </aside>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
