"use client";

import { useCallback, useState } from "react";
import FlexCarousel from "./FlexCarousel";
import { AgomoniCategoryOverlay } from "./AgomoniCategoryOverlay";
import type { DriftWallCategory } from "../../data/driftWallCategories";

export type Glimpse = {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  category: DriftWallCategory;
};

/*
 * Five scenes from the evening. The row auto-advances on its own (autoOnly:
 * no manual drag). Pressing any card opens the gallery overlay for its
 * category immediately — no need to centre the card first.
 */
const moments: Glimpse[] = [
  {
    src: "/agomoni/glimpses/performances/NIL_0602.webp",
    alt: "The host anchoring the Agomoni evening",
    title: "Anchor",
    subtitle: "The voices that held the evening together.",
    category: "anchor",
  },
  {
    src: "/agomoni/glimpses/performances/NIL_0284.webp",
    alt: "A cultural performance on the Agomoni stage",
    title: "Performances",
    subtitle: "A stage alive with music, movement and colour.",
    category: "performances",
  },
  {
    src: "/agomoni/glimpses/performances/NIL_0316.webp",
    alt: "The opening moments of Agomoni",
    title: "Inauguration",
    subtitle: "The first moments of a celebration unfolding.",
    category: "inauguration",
  },
  {
    src: "/agomoni/glimpses/performances/NIL_0514.webp",
    alt: "The audience watching the Agomoni programme",
    title: "Audience",
    subtitle: "Every cheer, smile and shared moment in the crowd.",
    category: "audience",
  },
  {
    src: "/agomoni/glimpses/performances/NIL_0603.webp",
    alt: "Prize distribution at Agomoni",
    title: "Prize Distribution",
    subtitle: "A little recognition for a lot of heart.",
    category: "prize-distribution",
  },
];

export function AgomoniGlimpses() {
  const [category, setCategory] = useState<DriftWallCategory | null>(null);
  const closeOverlay = useCallback(() => setCategory(null), []);

  return (
    <section
      id="glimpses"
      className="relative overflow-hidden bg-[#14120e] text-[#faf6ee]"
      aria-labelledby="glimpses-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#d4a24e 0.7px, transparent 0.7px)",
          backgroundSize: "5px 5px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pt-9 sm:px-8 sm:pt-12">
        <div className="mb-1.5 flex items-center justify-center gap-3 text-[#d4a24e]">
          <span className="h-px w-8 bg-current" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[.28em]">
            Five scenes · Agomoni 2026
          </span>
          <span className="h-px w-8 bg-current" />
        </div>
        <h2 id="glimpses-heading" className="mx-auto mb-1 max-w-4xl text-center font-display-serif text-[56px] sm:text-[88px] leading-none italic text-[#faf6ee]">
          Glimpses of Agomoni
        </h2>
        <p className="mx-auto max-w-lg text-center font-serif text-xs italic leading-snug text-[#faf6ee]/60 sm:text-sm">
          Five moments. One unforgettable evening.
        </p>
      </div>

      {/*
        Full-bleed stage: the five-card row runs past both viewport edges for the
        "liquid" lens effect, with a modest left/right inset so the labels never
        clip past the viewport edge.
      */}
      <div
        className="relative mt-1 w-full sm:mt-1.5"
        style={{ height: "max(236px, calc((100vw - 48px) / 2.925))" }}
      >
        <FlexCarousel
          items={moments}
          preset="liquid"
          intro="rise"
          fit="portrait"
          cardHeight={0.78}
          gap={12}
          radius={6}
          squeeze={0.18}
          focusOnClick={false}
          onSelect={(_index, item) => setCategory((item as Glimpse).category)}
          captions={false}
          labels
          initialIndex={2}
          captureWheel={false}
          ariaLabel="Five moments from Agomoni 2026"
          autoplay
          autoOnly
          interval={4}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-1.5 sm:px-8 sm:pb-10 sm:pt-2">
        <p className="text-center font-sans text-[9px] uppercase tracking-[.22em] text-[#faf6ee]/35">
          Auto-moving <span className="mx-2 text-[#d4a24e]">✦</span> Click any card to see its photos
        </p>
      </div>

      {/* shade into the next section's colour */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#14120e]/90" aria-hidden="true" />

      <AgomoniCategoryOverlay category={category} onClose={closeOverlay} />
    </section>
  );
}
