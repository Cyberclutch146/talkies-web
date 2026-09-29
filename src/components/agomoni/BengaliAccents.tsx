"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─── Bengali Watermark ────────────────────────────────────────
   Oversized, faded Bengali text behind chapter content.
   Purely decorative. Uses Galada (display brush).               */

interface BengaliWatermarkProps {
  text: string;
  className?: string;
  /** Position relative to parent. Default "center" */
  position?: "left" | "right" | "center";
}

export function BengaliWatermark({
  text,
  className = "",
  position = "center",
}: BengaliWatermarkProps) {
  const prefersReduced = useReducedMotion();

  const posClass = {
    left: "left-0 -translate-x-1/4",
    right: "right-0 translate-x-1/4",
    center: "left-1/2 -translate-x-1/2",
  }[position];

  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 ${posClass} pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
      lang="bn"
      initial={prefersReduced ? { opacity: 0.04 } : { opacity: 0 }}
      whileInView={{ opacity: 0.04 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <span
        className="font-bengali-display text-[120px] sm:text-[180px] lg:text-[240px] leading-none whitespace-nowrap"
        style={{ letterSpacing: 0, lineHeight: 1.5 }}
      >
        {text}
      </span>
    </motion.div>
  );
}

/* ─── Bengali Rubber Stamp ─────────────────────────────────────
   Tilted, bordered text like a postal rubber stamp.
   Uses Atma bold. Rotated -3deg.                                */

interface BengaliStampProps {
  text: string;
  color?: string;
  className?: string;
}

export function BengaliStamp({
  text,
  color = "#c83a1a",
  className = "",
}: BengaliStampProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={`inline-block ${className}`}
      aria-hidden="true"
      lang="bn"
      initial={prefersReduced ? { opacity: 0.7 } : { opacity: 0, scale: 1.1 }}
      whileInView={{ opacity: 0.7, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className="font-bengali-accent font-bold text-xl sm:text-2xl px-4 py-1.5 border-2 rounded-sm inline-block"
        style={{
          color,
          borderColor: color,
          transform: "rotate(-3deg)",
          letterSpacing: 0,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

/* ─── Bengali Margin Note ──────────────────────────────────────
   Handwritten-feel note in the margin. Uses Atma (medium weight).
   Slightly tilted, smaller, positioned absolute.                */

interface BengaliMarginNoteProps {
  text: string;
  side?: "left" | "right";
  className?: string;
}

export function BengaliMarginNote({
  text,
  side = "right",
  className = "",
}: BengaliMarginNoteProps) {
  const prefersReduced = useReducedMotion();
  const pos = side === "right" ? "right-0 sm:-right-4" : "left-0 sm:-left-4";

  return (
    <motion.div
      className={`hidden lg:block absolute ${pos} top-1/2 -translate-y-1/2 pointer-events-none z-10 ${className}`}
      aria-hidden="true"
      lang="bn"
      initial={prefersReduced ? { opacity: 0.35 } : { opacity: 0 }}
      whileInView={{ opacity: 0.35 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <span
        className="font-bengali-accent font-medium text-base sm:text-lg text-[#d4a24e] whitespace-nowrap"
        style={{
          transform: "rotate(-5deg)",
          letterSpacing: 0,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

/* ─── Bengali Pull Quote ───────────────────────────────────────
   Gold-ruled pull quote block. Uses Tiro Bangla italic.
   Vertical gold lines on left side, oversized text.             */

interface BengaliPullQuoteProps {
  text: string;
  attribution?: string;
  className?: string;
}

export function BengaliPullQuote({
  text,
  attribution,
  className = "",
}: BengaliPullQuoteProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.blockquote
      className={`relative pl-6 sm:pl-8 py-4 my-8 ${className}`}
      lang="bn"
      initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Gold rules */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d4a24e]/70" />
      <div className="absolute left-[6px] top-0 bottom-0 w-[1px] bg-[#d4a24e]/30" />

      <p
        className="font-bengali-serif italic text-xl sm:text-2xl lg:text-3xl leading-relaxed"
        style={{ letterSpacing: 0, lineHeight: 1.6 }}
      >
        {text}
      </p>
      {attribution && (
        <cite className="block mt-2 font-serif text-sm not-italic opacity-50">
          — {attribution}
        </cite>
      )}
    </motion.blockquote>
  );
}
