"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { TornEdge } from "./TornEdge";

/* ─── ArticleSplit ─────────────────────────────────────────────
   Two-column newspaper-style layout. Photo bleeds to viewport
   edge on its side, text on the other. A dramatic vertical
   torn-paper edge separates them (GSAP MorphSVG animated).

   Desktop: side-by-side grid with torn overlap.
   Mobile: stacked, no torn edge (clean stack).                  */

interface ArticleSplitProps {
  imageUrl: string;
  imageAlt: string;
  imageCredit?: string;
  imagePosition: "left" | "right";
  children: React.ReactNode;
  darkBg?: boolean;
  tornSeed?: number;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  unoptimized?: boolean;
  priority?: boolean;
  disableGrain?: boolean;
}

export function ArticleSplit({
  imageUrl,
  imageAlt,
  imageCredit,
  imagePosition,
  children,
  darkBg = false,
  tornSeed = 42,
  objectFit = "cover",
  objectPosition = "center",
  unoptimized = false,
  priority = false,
  disableGrain = false,
}: ArticleSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const bg = darkBg ? "bg-[#14120e]" : "bg-[#e5e0d3]";
  const textColor = darkBg ? "text-[#e5e0d3]" : "text-[#14120e]";
  const tornPaperColor = darkBg ? "#14120e" : "#e5e0d3";
  const tornFibreColor = darkBg ? "#1e1c18" : "#ece7da";

  // Which side of the photo gets the torn edge
  const tornSide = imagePosition === "right" ? "left" : "right";

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[100svh] ${bg}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-[100svh]">
        {/* ── Photo column ──────────────────────────────────────── */}
        <motion.div
          className={`relative overflow-visible min-h-[40vh] lg:min-h-0 h-full ${imagePosition === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          style={prefersReduced ? {} : { y: photoY }}
        >
          {/* Image wrapper — extends slightly beyond its column to create overlap if cover */}
          <div
            className={`absolute inset-0 ${objectFit === "contain" ? "flex items-center justify-center p-4 sm:p-8 lg:p-12" : "lg:-inset-y-4"}`}
            style={{
              // On desktop, let the photo bleed slightly into the text column if cover
              ...(objectFit !== "contain"
                ? (imagePosition === "right"
                  ? { left: 0, right: "-3%" }
                  : { right: 0, left: "-3%" })
                : {}),
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              quality={100}
              unoptimized={unoptimized}
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={objectFit === "contain" ? "object-contain drop-shadow-2xl" : "object-cover"}
              style={{
                objectPosition,
                filter: "contrast(1.02)",
              }}
            />
          </div>

          {/* Halftone grain overlay (only for cover images, keeping contained photos or disabled grain 100% pristine) */}
          {objectFit !== "contain" && !disableGrain && (
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #14120e 0.5px, transparent 0.5px)",
                backgroundSize: "3px 3px",
              }}
              aria-hidden="true"
            />
          )}

          {/* ── Vertical torn edge — the centerpiece effect ───── */}
          <TornEdge
            side={tornSide}
            seed={tornSeed}
            paperColor={tornPaperColor}
            fibreColor={tornFibreColor}
            stripHeight={80}
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

        {/* ── Text column ───────────────────────────────────────── */}
        <div
          className={`relative z-10 ${textColor} ${imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            } px-6 sm:px-10 lg:px-14 py-12 sm:py-20 lg:py-24 flex flex-col justify-center`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
