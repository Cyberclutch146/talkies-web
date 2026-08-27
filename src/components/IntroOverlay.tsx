"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MaskedHeading from "./MaskedHeading";

export interface IntroOverlayProps {
  onComplete?: () => void;
  /** Milliseconds before auto-dismiss. Default 5500. */
  autoSlideDelay?: number;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({
  onComplete,
  autoSlideDelay = 5500,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRendered, setIsRendered] = useState(true);
  const dismissedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsDismissed(true);
    // Don't call onComplete here — wait for exit animation to finish
  }, []);

  useEffect(() => {
    const t = setTimeout(handleDismiss, autoSlideDelay);
    return () => clearTimeout(t);
  }, [autoSlideDelay, handleDismiss]);

  /* Lock body scroll while the overlay is up */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isRendered) return null;

  return (
    <AnimatePresence onExitComplete={() => {
      setIsRendered(false);
      onCompleteRef.current?.();
    }}>
      {!isDismissed && (
        <motion.div
          key="intro-overlay"
          initial={{ y: "0%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden"
          style={{ willChange: "transform" }}
        >
          {/* ── Base ── */}
          <div className="absolute inset-0 bg-[#14120e]" />

          {/* ── Grain ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(#e5e0d3 0.6px, transparent 0.6px), radial-gradient(#e5e0d3 0.6px, transparent 0.6px)",
              backgroundSize: "4px 4px",
              backgroundPosition: "0 0, 2px 2px",
            }}
          />

          {/* ── Content ── */}
          <div className="relative h-full flex flex-col justify-between px-5 sm:px-10 lg:px-16 py-5 sm:py-8 text-[#e5e0d3]">

            {/* ─── TOP DATELINE ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center justify-between text-[9px] sm:text-[11px] font-sans uppercase tracking-[0.22em] text-[#e5e0d3]/50"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c83a1a] animate-pulse" />
                <span>Kolkata, WB</span>
              </div>
              <span className="hidden sm:inline">Est. 1999 · RCCIIT</span>
              <div className="flex items-center gap-2">
                <span className="text-[#c83a1a]">✦</span>
                <span>Vol. II · 2025</span>
              </div>
            </motion.div>

            {/* ─── CENTRE: MASKED HEADING ─── */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 py-4">

              {/* Thin rule */}
              <div
                className="w-full max-w-3xl border-t border-[#e5e0d3]/15"
                style={{ transform: "translateZ(0)" }}
              />

              {/* Tagline above */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center gap-3 text-[9px] sm:text-[11px] font-sans uppercase tracking-[0.3em] text-[#c83a1a] font-bold"
              >
                <span className="w-6 sm:w-10 h-px bg-[#c83a1a]/50" />
                <span>The Paper Portfolio</span>
                <span className="w-6 sm:w-10 h-px bg-[#c83a1a]/50" />
              </motion.div>

              {/* ── THE STAR: Giant masked heading ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
                className="w-full max-w-5xl"
              >
                <MaskedHeading
                  text="RCC TALKIES"
                  tag="h1"
                  src="/mask.png"
                  mediaType="image"
                  fillScale={1.35}
                  parallax={30}
                  drift={14}
                  brightness={1.15}
                  saturation={1.3}
                  grayscale={false}
                  reveal="rise"
                  trigger="mount"
                  duration={1.2}
                  stagger={0.12}
                  align="center"
                  weight={900}
                  tracking={0.02}
                  lineHeight={1.0}
                  textScale={0.2}
                  style={{ fontFamily: "var(--font-display), Impact, sans-serif" }}
                />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="font-serif italic text-sm sm:text-lg text-[#e5e0d3]/45 tracking-wide text-center max-w-lg"
              >
                &ldquo;The Voice of RCCIIT&rdquo;
              </motion.p>

              {/* Thin rule */}
              <div
                className="w-full max-w-xl border-t border-[#e5e0d3]/15"
                style={{ transform: "translateZ(0)" }}
              />

              {/* Desk strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1 text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-[#e5e0d3]/25"
              >
                {["Editorial", "Reporting", "Research", "Photo & Art", "PR & Social"].map(
                  (desk) => (
                    <span key={desk} className="flex items-center gap-1.5">
                      <span className="text-[#c83a1a]/40">✦</span>
                      {desk}
                    </span>
                  )
                )}
              </motion.div>
            </div>

            {/* ─── BOTTOM BAR ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e5e0d3]/10 pt-4 text-[9px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-[#e5e0d3]/40"
            >
              <span className="hidden sm:inline">
                Independent Student Journalism
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="group flex items-center gap-2 px-5 py-2 border border-[#e5e0d3]/20 hover:border-[#c83a1a] text-[#e5e0d3]/70 hover:text-[#e5e0d3] font-bold tracking-[0.25em] transition-all duration-300"
              >
                <span>ENTER EDITION</span>
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  ↓
                </motion.span>
              </button>

              <span className="text-[#e5e0d3]/25 hidden sm:inline">
                Click anywhere to read
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
