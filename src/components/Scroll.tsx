"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

/* ─── Scroll-driven Durga Face Reveal (Perfect Alignment) ─────────
   - Golden baseline, center Agomoni text, and scrolling Durga 
     medallion are all locked to the exact vertical centerline 
     (top: 50% / -translate-y-1/2).
   - Horizontal travel is computed with 100% compliant CSS calc:
     left: calc(${p * 100}% + ${(1 - 2 * p) * 16}px)
     transform: translate(-${p * 100}%, -50%)
     meaning at p=0 it sits neatly 16px from left edge, at p=0.5 
     it is dead-center, and at p=1 it sits neatly 16px from right edge.
   - Maa Durga's face inside the medallion is centered on the eyes/third eye.
   - Buffer zone holds the logo at the other end for one extra scroll 
     before the hero unpins.
   ──────────────────────────────────────────────────────────────── */

export default function DurgaScrollReveal() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const container = document.getElementById("hero-scroll-container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalPinnedScroll = rect.height - window.innerHeight;

      if (totalPinnedScroll <= 0) {
        setScrollProgress(1);
        return;
      }

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalPinnedScroll));
      setScrollProgress(progress);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  // Phase 1 (0 to 0.67): Smooth horizontal travel from complete left to complete right
  // Phase 2 (0.67 to 1.0): Buffer zone ("one extra scroll") resting at the end
  const TRAVEL_RATIO = 0.67;
  const travelProgress = Math.min(1, Math.max(0, scrollProgress / TRAVEL_RATIO));

  // Precise left position in pixels & percent:
  // p = 0   => 0% + 16px (16px from left screen edge)
  // p = 0.5 => 50% + 0px (dead center)
  // p = 1   => 100% - 16px (16px from right screen edge)
  const leftPercent = travelProgress * 100;
  const leftOffsetPx = (1 - 2 * travelProgress) * 16;
  const durgaTranslateX = travelProgress * 100;

  // Reveal progress: text unmasks as Durga passes across it
  const revealPercent = Math.min(100, Math.max(0, travelProgress * 120));
  const textOpacity = Math.min(1, 0.2 + travelProgress * 0.8);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'BenSenHandwriting';
              src: url('/fonts/BenSenHandwriting.ttf') format('truetype');
              font-display: swap;
            }
          `,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto select-none overflow-hidden h-20 sm:h-24 md:h-28 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/85 to-transparent">
        {/* Center Revealed Agomoni Link — Vertically Centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <Link
            href="/agomoni"
            className="pointer-events-auto group flex items-center gap-3 sm:gap-6 py-2 px-4 rounded-full transition-transform duration-300 hover:scale-105"
            style={{ opacity: textOpacity }}
          >
            {/* Bengali "আগমনী" text with clip-path wipe reveal from left to right */}
            <div
              className="relative flex items-center gap-2 sm:gap-4 transition-all duration-150"
              style={{
                clipPath: `inset(0 ${Math.max(0, 100 - revealPercent)}% 0 0)`,
              }}
            >
              <span className="hidden sm:inline-block text-[#d4a24e]/70 text-xs tracking-widest uppercase font-sans font-bold">
                ✦ শারদীয়া
              </span>

              <h2
                lang="bn"
                className="text-3xl sm:text-5xl md:text-6xl tracking-wide transition-all group-hover:brightness-125"
                style={{
                  fontFamily: "'BenSenHandwriting', sans-serif",
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(90deg, #d4a24e 0%, #faf6ee 40%, #d4a24e 80%, #faf6ee 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter:
                    "drop-shadow(0 0 16px rgba(212,162,78,0.5)) drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
                }}
              >
                আগমনী
              </h2>

              <div className="flex items-center gap-1.5 bg-[#d4a24e]/15 border border-[#d4a24e]/40 px-2.5 py-1 rounded-full group-hover:bg-[#d4a24e]/25 group-hover:border-[#d4a24e] transition-all">
                <span className="text-[9px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#d4a24e]">
                  Explore 2026
                </span>
                <span className="text-[#d4a24e] text-xs transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div
          className="absolute top-1/2 z-30 pointer-events-auto transition-transform duration-75 ease-out cursor-pointer"
          style={{
            left: `calc(${leftPercent}% + ${leftOffsetPx}px)`,
            transform: `translate(-${durgaTranslateX}%, -50%)`,
            willChange: "left, transform",
          }}
        >
          <Link
            href="/agomoni"
            aria-label="Visit Agomoni 2026"
            className="group relative flex items-center justify-center"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-[#d4a24e] shadow-[0_0_20px_rgba(212,162,78,0.7)] overflow-hidden bg-[#14120e] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(212,162,78,0.95)] flex items-center justify-center">
              <img
                src="/durga-hero.jpg"
                alt="Maa Durga"
                className="w-full h-full object-cover object-[50%_42%] scale-[1.45] transition-transform duration-500 group-hover:scale-[1.6]"
                draggable={false}
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#d4a24e]/40 pointer-events-none" />
            </div>
            <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[8px] sm:text-[9px] font-sans uppercase font-bold tracking-widest text-[#d4a24e] bg-[#14120e]/90 px-2 py-0.5 rounded border border-[#d4a24e]/50 whitespace-nowrap shadow-lg">
              আগমনী ✦
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
