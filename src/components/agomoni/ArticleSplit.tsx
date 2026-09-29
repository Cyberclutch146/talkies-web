"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { TornEdge } from "./TornEdge";

/* ─── ArticleSplit ─────────────────────────────────────────────
   Two-column newspaper-style layout. Photo bleeds to viewport
   edge on its side, text on the other. Torn-paper edge between.

   Desktop: side-by-side grid.
   Mobile: stacked, alternating image-first / text-first.        */

interface ArticleSplitProps {
  imageUrl: string;
  imageAlt: string;
  imageCredit?: string;
  imagePosition: "left" | "right";
  children: React.ReactNode;
  darkBg?: boolean;
  tornSeed?: number;
}

export function ArticleSplit({
  imageUrl,
  imageAlt,
  imageCredit,
  imagePosition,
  children,
  darkBg = false,
  tornSeed = 42,
}: ArticleSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Photo moves slightly slower than text (parallax)
  const photoY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const textColor = darkBg ? "text-[#e5e0d3]" : "text-[#14120e]";
  const tornPaperColor = darkBg ? "#14120e" : "#e5e0d3";
  const tornFibreColor = darkBg ? "#1e1c18" : "#ece7da";

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-2 w-full"
    >
      {/* Photo column */}
      <motion.div
        className={`relative overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] ${
          imagePosition === "right" ? "lg:order-2" : "lg:order-1"
        }`}
        style={prefersReduced ? {} : { y: photoY }}
      >
        {/* Print-style photo treatment */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{
              filter: "sepia(0.12) saturate(0.75) contrast(1.08)",
            }}
          />
        </div>

        {/* Halftone grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle, #14120e 0.5px, transparent 0.5px)",
            backgroundSize: "3px 3px",
          }}
          aria-hidden="true"
        />

        {/* Torn edge between photo and text */}
        <TornEdge
          side={imagePosition === "right" ? "left" : "right"}
          seed={tornSeed}
          paperColor={tornPaperColor}
          fibreColor={tornFibreColor}
          amplitude={14}
          steps={50}
          className="hidden lg:block"
        />

        {/* Photo credit */}
        {imageCredit && (
          <div className="absolute bottom-3 left-4 right-4 z-30">
            <span className="font-serif italic text-[10px] text-white/50 bg-black/30 px-2 py-0.5 rounded-sm backdrop-blur-sm">
              {imageCredit}
            </span>
          </div>
        )}
      </motion.div>

      {/* Text column */}
      <div
        className={`relative ${textColor} ${
          imagePosition === "right" ? "lg:order-1" : "lg:order-2"
        } px-4 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-20 flex flex-col justify-center`}
      >
        {children}
      </div>
    </div>
  );
}
