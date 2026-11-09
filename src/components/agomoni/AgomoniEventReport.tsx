"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { DappledLight } from "./DappledLight";
import { Device } from "./Device";
import { Noise } from "./Noise";
import { AGOMONI_REPORT } from "../../data/agomoniReport";

const PERFORMANCE_STYLES: Record<string, string> = {
  Dance: "border-[#d4a24e]/50 bg-[#d4a24e]/10 text-[#d4a24e]",
  Music: "border-[#faf6ee]/25 bg-[#faf6ee]/10 text-[#faf6ee]",
  Drama: "border-[#c83a1a]/60 bg-[#c83a1a]/15 text-[#e8b4a8]",
  Recitation: "border-[#e5e0d3]/30 bg-[#e5e0d3]/10 text-[#e5e0d3]",
  Beatbox: "border-[#c83a1a]/40 bg-transparent text-[#faf6ee]/70",
  Instrumental: "border-[#d4a24e]/30 bg-transparent text-[#faf6ee]/70",
  Ceremony: "border-[#d4a24e]/60 bg-[#d4a24e]/15 text-[#faf6ee]",
};

const DOT_STYLES: Record<string, string> = {
  Dance: "bg-[#d4a24e] shadow-[0_0_0_4px_rgba(212,162,78,0.18)]",
  Music: "bg-[#faf6ee] shadow-[0_0_0_4px_rgba(250,246,238,0.14)]",
  Drama: "bg-[#c83a1a] shadow-[0_0_0_4px_rgba(200,58,26,0.18)]",
  Recitation: "bg-[#e5e0d3] shadow-[0_0_0_4px_rgba(229,224,211,0.14)]",
  Beatbox: "bg-[#e07856] shadow-[0_0_0_4px_rgba(224,120,86,0.16)]",
  Instrumental: "bg-[#b8923f] shadow-[0_0_0_4px_rgba(184,146,63,0.16)]",
  Ceremony: "bg-[#d4a24e] shadow-[0_0_0_4px_rgba(212,162,78,0.2)]",
};

const FILTERS = ["All", "Dance", "Music", "Drama", "Recitation", "Beatbox", "Instrumental", "Ceremony"] as const;
type Filter = (typeof FILTERS)[number];
type ViewMode = "timeline" | "cards" | "table";

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[#d4a24e]">
      <span className="font-sans text-[10px] font-bold uppercase tracking-[.28em]">{index}</span>
      <span className="h-px flex-1 bg-[#d4a24e]/20" />
      <h3 className="font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#faf6ee]">{title}</h3>
    </div>
  );
}

function CountUp({ value, prefersReduced }: { value: number; prefersReduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, prefersReduced]);

  return <span ref={ref}>{display}</span>;
}

/**
 * Event Report — placed after Glimpses of Agomoni (see src/app/agomoni/page.tsx).
 * Background layers, bottom to top:
 *   1. The darkened misty-forest photo, tinted into the Agomoni palette.
 *   2. A #14120e scrim + vignette so the report text stays readable.
 *   3. DappledLight (sunlight through swaying leaves), screen-blended.
 *   4. React Bits Noise film grain for print texture.
 * Content is transcribed from the official Agomoni 2026 report in
 * src/data/agomoniReport.ts.
 * Interactive: animated stats, tappable objectives checklist, searchable
 * programme with Timeline / Cards / Table views, expandable rows + materials.
 */
export function AgomoniEventReport() {
  const prefersReduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("timeline");
  const [expanded, setExpanded] = useState<string | null>("1");
  const [readObjectives, setReadObjectives] = useState<Set<number>>(new Set());
  const [reelMuted, setReelMuted] = useState(true);
  const [reelPaused, setReelPaused] = useState(false);
  const reelVideoRef = useRef<HTMLVideoElement>(null);
  const report = AGOMONI_REPORT;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return report.proceedings.filter((row) => {
      if (filter !== "All" && row.type !== filter) return false;
      if (!q) return true;
      const haystack = [row.slot, row.performance, row.type, ...row.participants].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [filter, query, report.proceedings]);

  const countsByType = useMemo(() => {
    const map = new Map<string, number>();
    report.proceedings.forEach((r) => map.set(r.type, (map.get(r.type) ?? 0) + 1));
    return map;
  }, [report.proceedings]);

  const maxTypeCount = Math.max(...Array.from(countsByType.values()), 1);

  // Keep the reel element in sync with the play/pause state; reduced-motion
  // visitors get a paused reel with the play button.
  useEffect(() => {
    const v = reelVideoRef.current;
    if (!v) return;
    v.muted = reelMuted;
    if (reelPaused || prefersReduced) {
      v.pause();
      if (prefersReduced) setReelPaused(true);
    } else {
      v.play().catch(() => setReelPaused(true));
    }
  }, [reelPaused, reelMuted, prefersReduced]);

  const fadeUp = (delay: number) => ({
    initial: prefersReduced ? {} : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  });

  const toggleSet = (setter: (v: Set<number>) => void, current: Set<number>, key: number) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

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
        {/* 4 · Film grain (previous component) */}
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
            className="mx-auto mb-10 grid max-w-7xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#d4a24e]/20 bg-[#d4a24e]/20 sm:grid-cols-2 lg:grid-cols-4"
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

          {/* ── By the numbers + reel ───────────────────────── */}
          <motion.div {...fadeUp(0.18)} className="mx-auto mb-14 max-w-[80rem]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:items-start">
              {/* Left — by the numbers (shifted far left) */}
              <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#d4a24e]">By the numbers</p>
              <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#faf6ee]/50">Tap a bar to filter the programme</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {report.stats.map((stat, i) => {
                const num = parseInt(stat.value, 10);
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={prefersReduced ? undefined : { y: -4, rotate: -0.4 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="relative overflow-hidden rounded-2xl border border-[#d4a24e]/25 bg-[#14120e]/70 px-5 py-4 backdrop-blur-sm"
                  >
                    <span
                      className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-[88px] leading-none text-[#d4a24e]/[0.07]"
                      aria-hidden="true"
                    >
                      {stat.value}
                    </span>
                    <p className="font-display text-4xl leading-none text-[#d4a24e]">
                      <CountUp value={Number.isNaN(num) ? 0 : num} prefersReduced={!!prefersReduced} />
                    </p>
                    <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[.18em] text-[#faf6ee]/70">{stat.label}</p>
                    <span className="mt-2 block h-px w-8 bg-[#d4a24e]/40" aria-hidden="true" />
                    <span className="sr-only">stat {i + 1}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Mix of the evening — clickable bars */}
            <div className="mt-3 rounded-2xl border border-[#faf6ee]/12 bg-[#14120e]/60 p-4 backdrop-blur-sm sm:p-5">
              <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[.22em] text-[#faf6ee]/60">
                Mix of the evening
              </p>
              <div className="space-y-2">
                {FILTERS.filter((f) => f !== "All").map((t) => {
                  const count = countsByType.get(t) ?? 0;
                  const active = filter === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilter(active ? "All" : t)}
                      aria-pressed={active}
                      className={`group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] ${
                        active ? "bg-[#d4a24e]/15" : "hover:bg-[#faf6ee]/[0.04]"
                      }`}
                    >
                      <span className="w-24 shrink-0 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-[#faf6ee]/80">
                        {t}
                      </span>
                      <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#faf6ee]/10" aria-hidden="true">
                        <motion.span
                          className={`absolute inset-y-0 left-0 rounded-full ${active ? "bg-[#d4a24e]" : "bg-[#d4a24e]/50 group-hover:bg-[#d4a24e]"}`}
                          initial={prefersReduced ? false : { width: 0 }}
                          whileInView={{ width: `${(count / maxTypeCount) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </span>
                      <span className="w-6 text-right font-display text-sm text-[#d4a24e]">{count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-serif text-xs italic text-[#faf6ee]/50">
                20 slots from the opening to dhak &amp; dhunuchi — counts include ceremonies.
              </p>
            </div>
              </div>

              {/* Right — reel in a phone frame */}
              <aside className="flex flex-col items-center lg:sticky lg:top-24">
                <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#d4a24e]">
                  Watch the reel ✦
                </p>
                <div className="relative w-full">
                  {/* warm studio glow behind the phone, ties it to the section */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,162,78,0.20),transparent_70%)] blur-2xl"
                    aria-hidden="true"
                  />
                  <Device label="Agomoni 2026 highlights reel — playing in the page" className="relative">
                    {/*
                      The reel itself (public/agomoni/agomoni-reel.mp4) —
                      a web-sized re-encode of the Instagram reel so it
                      autoplays in the page. Instagram's embed iframe is
                      login-walled, so it can't play here.
                    */}
                    <div className="relative h-full w-full overflow-hidden bg-black">
                      <video
                        ref={reelVideoRef}
                        className="absolute inset-0 h-full w-full cursor-pointer object-contain"
                        src="/agomoni/agomoni-reel.mp4"
                        poster="/agomoni/glimpses/performances/NIL_0219.webp"
                        autoPlay
                        loop
                        muted={reelMuted}
                        playsInline
                        preload="auto"
                        onClick={() => setReelPaused((p) => !p)}
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
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a24e] text-[#14120e] shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current" aria-hidden="true">
                              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                            </svg>
                          </span>
                        </span>
                      )}

                      {/* mute / unmute */}
                      <button
                        type="button"
                        onClick={() => setReelMuted((m) => !m)}
                        aria-label={reelMuted ? "Unmute the reel" : "Mute the reel"}
                        className="absolute bottom-32 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
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

          {/* ── 01 Introduction + Objectives ─────────────────── */}
          <div className="mx-auto max-w-[80rem]">
            <SectionLabel index="01" title="Introduction" />
            <div className="mb-10 grid gap-6 lg:grid-cols-2">
              {report.introduction.map((para, index) => (
                <motion.article
                  key={para.heading}
                  {...fadeUp(index * 0.07)}
                  whileHover={prefersReduced ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl border border-[#faf6ee]/12 bg-[#faf6ee]/[0.04] p-5 backdrop-blur-sm sm:p-6"
                >
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#d4a24e] to-[#c83a1a] opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <h4 className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[.25em] text-[#c83a1a]">
                    {para.heading}
                  </h4>
                  <p className="font-serif text-sm leading-relaxed text-[#faf6ee]/75 sm:text-[15px]">{para.body}</p>
                </motion.article>
              ))}
            </div>

            <SectionLabel index="02" title="Objectives of the Event" />
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-serif text-sm italic text-[#faf6ee]/60">
                Tap an objective to mark it as read — your own reading checklist.
              </p>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[.18em] text-[#d4a24e]" aria-live="polite">
                {readObjectives.size} / {report.objectives.length} read
              </p>
            </div>
            <div
              className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#faf6ee]/10"
              role="progressbar"
              aria-valuenow={readObjectives.size}
              aria-valuemin={0}
              aria-valuemax={report.objectives.length}
              aria-label="Objectives read progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#d4a24e] to-[#c83a1a]"
                animate={{ width: `${(readObjectives.size / report.objectives.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <ol className="mb-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {report.objectives.map((objective, index) => {
                const read = readObjectives.has(index);
                return (
                  <motion.li
                    key={objective}
                    {...fadeUp(index * 0.05)}
                    whileHover={prefersReduced ? undefined : { y: -3 }}
                    whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSet(setReadObjectives, readObjectives, index)}
                      aria-pressed={read}
                      className={`flex h-full w-full gap-4 rounded-2xl border p-4 text-left backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] sm:p-5 ${
                        read
                          ? "border-[#d4a24e]/60 bg-[#d4a24e]/[0.12]"
                          : "border-[#faf6ee]/12 bg-[#14120e]/60 hover:border-[#d4a24e]/40"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-base transition-colors ${
                          read ? "border-[#d4a24e] bg-[#d4a24e] text-[#14120e]" : "border-[#d4a24e]/50 text-[#d4a24e]"
                        }`}
                        aria-hidden="true"
                      >
                        {read ? "✓" : String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-serif text-sm leading-relaxed ${read ? "text-[#faf6ee]" : "text-[#faf6ee]/80"}`}>
                        {objective}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
              <motion.li {...fadeUp(0.25)} className="relative overflow-hidden rounded-2xl border border-[#d4a24e]/30 bg-[#d4a24e]/[0.08] p-4 backdrop-blur-sm sm:p-5">
                <span className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[100px] leading-none text-[#d4a24e]/10" aria-hidden="true">✦</span>
                <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[.22em] text-[#d4a24e]">At a glance</p>
                {report.stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline justify-between gap-4 border-b border-[#faf6ee]/8 py-2 last:border-0">
                    <span className="font-display text-2xl text-[#d4a24e]">{stat.value}</span>
                    <span className="text-right font-sans text-[10px] uppercase tracking-[.18em] text-[#faf6ee]/60">{stat.label}</span>
                  </div>
                ))}
              </motion.li>
            </ol>

            {/* ── 03 Proceedings ─────────────────────────────── */}
            <SectionLabel index="03" title="Event Proceedings" />
            <motion.p {...fadeUp(0)} className="mb-6 max-w-5xl font-serif text-sm leading-relaxed text-[#faf6ee]/70 sm:text-base">
              {report.proceedingsIntro}
            </motion.p>

            {/* Controls: filter + search + view */}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter performances by type">
                {FILTERS.map((item) => {
                  const count = item === "All" ? report.proceedings.length : (countsByType.get(item) ?? 0);
                  const active = filter === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[.18em] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] ${
                        active
                          ? "border-[#d4a24e] bg-[#d4a24e] text-[#14120e] shadow-[0_4px_16px_rgba(212,162,78,0.35)]"
                          : "border-[#faf6ee]/20 bg-transparent text-[#faf6ee]/60 hover:-translate-y-px hover:border-[#d4a24e]/50 hover:text-[#faf6ee]"
                      }`}
                    >
                      {item}
                      <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] ${active ? "bg-[#14120e]/15" : "bg-[#faf6ee]/10"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <label htmlFor="report-search" className="sr-only">Search participants or performances</label>
                  <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#faf6ee]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    id="report-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a name or act…"
                    className="w-52 rounded-full border border-[#faf6ee]/20 bg-[#14120e]/70 py-2 pl-9 pr-8 text-sm text-[#faf6ee] placeholder:text-[#faf6ee]/40 backdrop-blur-sm focus:border-[#d4a24e]/60 focus:outline-none focus:ring-2 focus:ring-[#d4a24e]/40 sm:w-64"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#faf6ee]/50 hover:text-[#faf6ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] rounded-full"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex rounded-full border border-[#faf6ee]/20 bg-[#14120e]/70 p-1 backdrop-blur-sm" role="group" aria-label="Programme view">
                  {(["timeline", "cards", "table"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setView(mode)}
                      aria-pressed={view === mode}
                      className={`relative rounded-full px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[.16em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] ${
                        view === mode ? "text-[#14120e]" : "text-[#faf6ee]/60 hover:text-[#faf6ee]"
                      }`}
                    >
                      {view === mode && (
                        <motion.span
                          layoutId="report-view-pill"
                          className="absolute inset-0 rounded-full bg-[#d4a24e]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="mb-3 font-sans text-[10px] uppercase tracking-[.18em] text-[#faf6ee]/50" aria-live="polite">
              Showing {rows.length} of {report.proceedings.length} slots
              {filter !== "All" && <> · filtered by <span className="text-[#d4a24e]">{filter}</span></>}
              {query.trim() && <> · “{query.trim()}”</>}
            </p>

            {rows.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14 rounded-2xl border border-dashed border-[#faf6ee]/20 bg-[#14120e]/60 px-6 py-12 text-center backdrop-blur-sm"
              >
                <p className="mb-1 font-display text-2xl text-[#faf6ee]">No matches found</p>
                <p className="mx-auto mb-5 max-w-sm font-serif text-sm text-[#faf6ee]/60">
                  Try a different name, act or category — or clear the search to see the full programme.
                </p>
                <button
                  type="button"
                  onClick={() => { setQuery(""); setFilter("All"); }}
                  className="rounded-full border border-[#d4a24e] bg-[#d4a24e] px-5 py-2 font-sans text-[10px] font-bold uppercase tracking-[.18em] text-[#14120e] hover:bg-[#c83a1a] hover:text-[#faf6ee] hover:border-[#c83a1a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
                >
                  Reset filters
                </button>
              </motion.div>
            ) : view === "timeline" ? (
              <motion.div {...fadeUp(0)} className="mb-4">
                <ol className="relative ml-3 border-l-2 border-dashed border-[#d4a24e]/25 sm:ml-6">
                  {rows.map((row, index) => {
                    const isOpen = expanded === row.slot;
                    return (
                      <motion.li
                        key={row.slot}
                        initial={prefersReduced ? false : { opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
                        className="relative pb-4 pl-8 last:pb-0 sm:pl-10"
                      >
                        <span
                          className={`absolute -left-[9px] top-4 h-4 w-4 rounded-full border-2 border-[#14120e] ${DOT_STYLES[row.type] ?? DOT_STYLES.Ceremony}`}
                          aria-hidden="true"
                        />
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : row.slot)}
                          aria-expanded={isOpen}
                          className={`w-full rounded-2xl border p-4 text-left backdrop-blur-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e] sm:p-5 ${
                            isOpen
                              ? "border-[#d4a24e]/60 bg-[#d4a24e]/[0.08] shadow-[0_8px_24px_rgba(20,18,14,0.5)]"
                              : "border-[#faf6ee]/12 bg-[#14120e]/70 hover:-translate-y-px hover:border-[#d4a24e]/40"
                          }`}
                        >
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4a24e]/15 font-display text-sm text-[#d4a24e]">
                              {row.slot}
                            </span>
                            <span className={`inline-block rounded-full border px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[.14em] ${PERFORMANCE_STYLES[row.type] ?? PERFORMANCE_STYLES.Ceremony}`}>
                              {row.performance}
                            </span>
                            {row.time && <span className="font-mono text-xs text-[#faf6ee]/50">⏱ {row.time}</span>}
                            <span className="ml-auto font-sans text-[10px] uppercase tracking-[.18em] text-[#faf6ee]/40">
                              {isOpen ? "Tap to collapse ↑" : "Tap for details ↓"}
                            </span>
                          </span>
                          <span className="mt-2 block font-serif text-sm text-[#faf6ee]/75">{row.participants.join(", ")}</span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="detail"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 rounded-xl border border-[#faf6ee]/10 bg-[#14120e]/50 p-4">
                                <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">
                                  Who performed · {row.participants.length} {row.participants.length === 1 ? "artist" : "artists"}
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                  {row.participants.map((p) => (
                                    <li key={p} className="rounded-full border border-[#faf6ee]/15 bg-[#faf6ee]/[0.06] px-3 py-1 font-serif text-[13px] text-[#faf6ee]/85">
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                                <p className="mt-3 font-mono text-xs text-[#faf6ee]/50">
                                  Slot {row.slot} · {row.type}{row.time ? ` · ${row.time}` : " · timing not listed"}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ol>
                <p className="mt-3 ml-3 border-t border-[#faf6ee]/8 pt-3 font-serif text-xs italic leading-relaxed text-[#faf6ee]/50 sm:ml-6">
                  {report.proceedingsNote}
                </p>
              </motion.div>
            ) : view === "cards" ? (
              <motion.div {...fadeUp(0)} className="mb-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((row, index) => {
                    const isOpen = expanded === row.slot;
                    return (
                      <motion.article
                        key={row.slot}
                        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
                        whileHover={prefersReduced ? undefined : { y: -4 }}
                        className={`flex flex-col rounded-2xl border p-4 backdrop-blur-sm transition-colors sm:p-5 ${
                          isOpen ? "border-[#d4a24e]/60 bg-[#d4a24e]/[0.08]" : "border-[#faf6ee]/12 bg-[#14120e]/70 hover:border-[#d4a24e]/40"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${DOT_STYLES[row.type] ?? DOT_STYLES.Ceremony}`} aria-hidden="true" />
                          <span className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">Slot {row.slot}</span>
                          {row.time && <span className="ml-auto font-mono text-xs text-[#faf6ee]/50">{row.time}</span>}
                        </div>
                        <h4 className="mb-2 font-display-serif text-lg leading-snug text-[#faf6ee]">{row.performance}</h4>
                        <p className="mb-3 font-serif text-sm leading-relaxed text-[#faf6ee]/70">{row.participants.join(", ")}</p>
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : row.slot)}
                          aria-expanded={isOpen}
                          className="mt-auto w-full rounded-full border border-[#faf6ee]/20 py-2 font-sans text-[10px] font-bold uppercase tracking-[.18em] text-[#faf6ee]/70 transition-colors hover:border-[#d4a24e]/60 hover:text-[#faf6ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
                        >
                          {isOpen ? "Hide details ↑" : "View details ↓"}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="detail"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3">
                                <span className={`inline-block rounded-full border px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[.14em] ${PERFORMANCE_STYLES[row.type] ?? PERFORMANCE_STYLES.Ceremony}`}>
                                  {row.type}
                                </span>
                                <p className="mt-2 font-mono text-xs text-[#faf6ee]/50">
                                  {row.participants.length} {row.participants.length === 1 ? "artist" : "artists"} · {row.time ?? "timing not listed"}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}
                </div>
                <p className="mt-4 border-t border-[#faf6ee]/8 pt-3 font-serif text-xs italic leading-relaxed text-[#faf6ee]/50">
                  {report.proceedingsNote}
                </p>
              </motion.div>
            ) : (
              <motion.div {...fadeUp(0)} className="mb-3 overflow-hidden rounded-2xl border border-[#faf6ee]/12 bg-[#14120e]/70 backdrop-blur-sm">
                <div className="max-h-[480px] overflow-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left">
                    <caption className="sr-only">Agomoni 2026 programme — slot, participants, performance and time required</caption>
                    <thead className="sticky top-0 bg-[#1d1a14]">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">Slot</th>
                        <th scope="col" className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">Participants</th>
                        <th scope="col" className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">Performance</th>
                        <th scope="col" className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">Time</th>
                        <th scope="col" className="px-4 py-3"><span className="sr-only">Details</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const isOpen = expanded === row.slot;
                        return (
                          <Fragment key={row.slot}>
                            <tr
                              onClick={() => setExpanded(isOpen ? null : row.slot)}
                              className={`cursor-pointer border-t border-[#faf6ee]/8 transition-colors hover:bg-[#faf6ee]/[0.04] ${isOpen ? "bg-[#d4a24e]/[0.06]" : ""}`}
                              aria-expanded={isOpen}
                            >
                              <th scope="row" className="px-4 py-3 align-top font-display text-sm text-[#faf6ee]">{row.slot}</th>
                              <td className="px-4 py-3 font-serif text-sm leading-relaxed text-[#faf6ee]/75">{row.participants.join(", ")}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block rounded-full border px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[.14em] ${PERFORMANCE_STYLES[row.type] ?? PERFORMANCE_STYLES.Ceremony}`}>
                                  {row.performance}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#faf6ee]/60">{row.time ?? "—"}</td>
                              <td className="px-4 py-3 text-[#d4a24e]">{isOpen ? "−" : "+"}</td>
                            </tr>
                            {isOpen && (
                              <tr key={`${row.slot}-detail`} className="border-t border-[#faf6ee]/8 bg-[#d4a24e]/[0.04]">
                                <td colSpan={5} className="px-4 py-3">
                                  <p className="font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#d4a24e]">
                                    {row.participants.length} {row.participants.length === 1 ? "artist" : "artists"} · {row.type}
                                    {row.time ? ` · ${row.time}` : ""}
                                  </p>
                                  <ul className="mt-2 flex flex-wrap gap-2">
                                    {row.participants.map((p) => (
                                      <li key={p} className="rounded-full border border-[#faf6ee]/15 bg-[#faf6ee]/[0.06] px-3 py-1 font-serif text-[13px] text-[#faf6ee]/85">{p}</li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="border-t border-[#faf6ee]/8 px-4 py-3 font-serif text-xs italic leading-relaxed text-[#faf6ee]/50">
                  {report.proceedingsNote} Tap any row for artist details.
                </p>
              </motion.div>
            )}

            {/* ── 04 Role + Materials ────────────────────────── */}
            <SectionLabel index="04" title="Role of the Clubs · Materials & Resources" />
            <div className="mb-8 grid gap-6 lg:grid-cols-5">
              <motion.article
                {...fadeUp(0)}
                whileHover={prefersReduced ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-[#faf6ee]/12 bg-[#faf6ee]/[0.04] p-5 backdrop-blur-sm sm:p-6 lg:col-span-2"
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#d4a24e] to-[#c83a1a] opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                <h4 className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[.25em] text-[#c83a1a]">
                  {report.roleOfClubs.heading}
                </h4>
                {report.roleOfClubs.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mb-3 font-serif text-sm leading-relaxed text-[#faf6ee]/75 last:mb-0">
                    {paragraph}
                  </p>
                ))}
                <p className="mt-4 rounded-xl border border-[#d4a24e]/20 bg-[#d4a24e]/[0.08] px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[.18em] text-[#d4a24e]">
                  RCC Talkies ✦ Art &amp; Cultural Club — student-led, together.
                </p>
              </motion.article>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
                {report.materials.map((group, index) => (
                  <motion.article
                    key={group.heading}
                    {...fadeUp(index * 0.05)}
                    className="rounded-2xl border border-[#faf6ee]/12 bg-[#14120e]/60 backdrop-blur-sm"
                  >
                    <div className="flex w-full items-center gap-3 p-5 text-left rounded-2xl">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a24e]/15 font-display text-sm text-[#d4a24e]" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[.22em] text-[#d4a24e]">{group.heading}</span>
                    </div>
                    <ul className="space-y-1.5 px-5 pb-5 pl-9 font-serif text-[13px] leading-relaxed text-[#faf6ee]/70">
                      {group.items.map((item) => (
                        <li key={item} className="relative">
                          <span className="absolute -left-4 top-[0.55em] h-1 w-1 rounded-full bg-[#d4a24e]/60" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            </div>
            <motion.p {...fadeUp(0)} className="mb-14 font-serif text-xs italic leading-relaxed text-[#faf6ee]/50">
              {report.materialsNote}
            </motion.p>

            {/* ── 05 Conclusion + Submitted by ───────────────── */}
            <SectionLabel index="05" title="Conclusion" />
            <motion.blockquote
              {...fadeUp(0)}
              whileHover={prefersReduced ? undefined : { y: -3 }}
              className="relative mb-12 overflow-hidden rounded-2xl border border-[#d4a24e]/30 bg-[#d4a24e]/[0.07] p-5 backdrop-blur-sm sm:p-7"
            >
              <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[140px] leading-none text-[#d4a24e]/10" aria-hidden="true">”</span>
              <p className="relative font-serif text-sm leading-relaxed text-[#faf6ee]/85 sm:text-base">{report.conclusion}</p>
              <p className="relative mt-4 font-sans text-[10px] font-bold uppercase tracking-[.22em] text-[#d4a24e]">
                ✦ A memorable celebration — creativity, culture &amp; togetherness
              </p>
            </motion.blockquote>

              {/* ── Submitted by ───────────────── */}
              <div className="mt-12 border-t border-[#faf6ee]/10 pt-8 pb-14 sm:pb-20">
                <p className="mb-5 text-center font-sans text-[10px] font-bold uppercase tracking-[.28em] text-[#faf6ee]/50">
                  Submitted by · RCC Talkies and Art and Cultural Club
                </p>
                <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {report.submittedBy.map((person, index) => (
                    <motion.div
                      key={person.name}
                      {...fadeUp(index * 0.05)}
                      whileHover={prefersReduced ? undefined : { y: -5, rotate: index % 2 ? 0.4 : -0.4 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="group relative overflow-hidden rounded-2xl border border-[#faf6ee]/12 bg-[#14120e]/60 px-4 py-5 text-center backdrop-blur-sm"
                    >
                      <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4a24e]/40 bg-[#d4a24e]/10 font-display text-base text-[#d4a24e] transition-transform group-hover:scale-110" aria-hidden="true">
                        {person.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                      <p className="font-display-serif text-base text-[#faf6ee]">{person.name}</p>
                      <p className="mt-1 font-sans text-[10px] uppercase tracking-[.18em] text-[#d4a24e]/80">{person.role}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#glimpses"
                    className="rounded-full border border-[#faf6ee]/25 px-5 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[.2em] text-[#faf6ee]/70 transition-colors hover:border-[#faf6ee]/60 hover:text-[#faf6ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a24e]"
                  >
                    ↩ Back to Glimpses
                  </a>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
