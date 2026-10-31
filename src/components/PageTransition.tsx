"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import "./PageTransition.css";

/* Lazy-load Shuffle so it doesn't bloat the initial bundle */
const Shuffle = dynamic(() => import("./Shuffle"), { ssr: false });

/**
 * Quick page-transition overlay.
 * On every client-side navigation the screen shows "RCC Talkies"
 * shuffling in, holds for a beat, then fades out. Total ≈ 650 ms.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const firstRender = useRef(true);

  /* phase: "idle" → "in" (overlay visible, shuffle playing) → "out" (fading) → "idle" */
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  /* Detect route change */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    clearTimers();
    setPhase("in");
  }, [pathname, clearTimers]);

  /* After shuffle finishes, start the fade-out */
  const handleShuffleComplete = useCallback(() => {
    clearTimers();
    timerRef.current = setTimeout(() => {
      setPhase("out");
      /* Remove overlay after fade-out transition finishes */
      timerRef.current = setTimeout(() => setPhase("idle"), 300);
    }, 80);
  }, [clearTimers]);

  /* Safety fallback: ensure transition never blocks UI indefinitely */
  useEffect(() => {
    if (phase === "in") {
      const safety = setTimeout(() => {
        handleShuffleComplete();
      }, 950);
      return () => clearTimeout(safety);
    }
  }, [phase, handleShuffleComplete]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className={`page-transition-overlay ${phase === "out" ? "fade-out" : ""}`}
    >
      {/* Grain texture, same as the site body */}
      <div className="page-transition-grain" />

      {/* Center content */}
      <div className="page-transition-content">
        <Shuffle
          text="RCC Talkies"
          tag="span"
          effect="slide"
          shuffleDirection="right"
          duration={0.5}
          animationMode="sequence"
          shuffleTimes={2}
          ease="power3.out"
          stagger={0.04}
          threshold={0}
          rootMargin="0px"
          triggerOnce={true}
          triggerOnHover={false}
          motionBlur={true}
          respectReducedMotion={true}
          onShuffleComplete={handleShuffleComplete}
          className="page-transition-text"
          style={{
            fontFamily: "var(--font-gothic), serif",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            color: "#c83a1a",
            letterSpacing: "0.04em",
            textTransform: "none",
          }}
        />

        {/* Subtle tagline underneath */}
        <span className="page-transition-tagline">The Voice of RCCIIT</span>
      </div>
    </div>
  );
}
