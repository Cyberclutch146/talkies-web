"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/* ─── Scroll Chapter Section ─────────────────────────────────────
   A reusable reveal section for each narrative chapter.
   Fades-up on scroll with optional parallax offset.               */

interface ChapterProps {
  chapterNumber: string;
  title: string;
  bengaliTitle?: string;
  emotion: string;
  children: React.ReactNode;
  accentColor?: string;
  invertedBg?: boolean;
}

export function ChapterSection({
  chapterNumber,
  title,
  bengaliTitle,
  emotion,
  children,
  accentColor = "#d4a24e",
  invertedBg = false,
}: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const bg = invertedBg ? "bg-[#14120e] text-[#e5e0d3]" : "bg-[#e5e0d3] text-[#14120e]";
  const mutedText = invertedBg ? "text-[#e5e0d3]/50" : "text-[#14120e]/50";
  const ruleColor = invertedBg ? "border-[#e5e0d3]/15" : "border-[#14120e]/15";

  return (
    <section
      ref={ref}
      className={`relative w-full ${bg} border-b ${ruleColor} overflow-hidden`}
    >
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-32"
        style={prefersReduced ? {} : { y, opacity }}
      >
        {/* Chapter header */}
        <div className={`flex items-center gap-3 mb-6 ${mutedText}`}>
          <span
            className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold"
            style={{ color: accentColor }}
          >
            {chapterNumber}
          </span>
          <span className={`w-8 h-px`} style={{ background: accentColor, opacity: 0.4 }} />
          <span className="font-serif italic text-xs sm:text-sm tracking-wide">
            {emotion}
          </span>
        </div>

        {/* Title */}
        <motion.h2
          className="font-display-serif text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-2"
          initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h2>

        {bengaliTitle && (
          <motion.p
            className="font-serif italic text-lg sm:text-2xl mb-8"
            style={{ color: accentColor }}
            initial={prefersReduced ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {bengaliTitle}
          </motion.p>
        )}

        {!bengaliTitle && <div className="mb-8" />}

        {/* Prose content */}
        <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed max-w-3xl">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
