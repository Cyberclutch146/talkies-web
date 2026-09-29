"use client";

import { useMemo } from "react";

/* ─── Seeded PRNG (Mulberry32) ─────────────────────────────────
   Deterministic so SSR and client output match.                 */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─── Generate a jagged torn-paper path ────────────────────────
   Returns an SVG path data string for either horizontal or
   vertical tears. `steps` controls how many jagged points.      */
function generateTornPath(
  side: "left" | "right" | "top" | "bottom",
  seed: number,
  steps: number = 40,
  amplitude: number = 12
): string {
  const rng = mulberry32(seed);
  const points: string[] = [];

  if (side === "top" || side === "bottom") {
    // Horizontal tear
    const isTop = side === "top";
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const jag = (rng() - 0.5) * amplitude;
      const y = isTop ? jag + amplitude : 100 - amplitude + jag;
      points.push(`${x}% ${y}%`);
    }
    if (isTop) {
      // Close: go to top-right, top-left
      return `polygon(0% 0%, ${points.join(", ")}, 100% 0%)`;
    } else {
      // Close: go to bottom-right, bottom-left
      return `polygon(0% 100%, ${points.join(", ")}, 100% 100%)`;
    }
  } else {
    // Vertical tear
    const isLeft = side === "left";
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * 100;
      const jag = (rng() - 0.5) * amplitude;
      const x = isLeft ? jag + amplitude : 100 - amplitude + jag;
      points.push(`${x}% ${y}%`);
    }
    if (isLeft) {
      return `polygon(0% 0%, ${points.join(", ")}, 0% 100%)`;
    } else {
      return `polygon(100% 0%, ${points.join(", ")}, 100% 100%)`;
    }
  }
}

/* ─── TornEdge ─────────────────────────────────────────────────
   Renders a decorative torn-paper edge overlay on a given side.
   Uses CSS clip-path with a deterministic seeded path.

   Props:
   - side: which edge gets the tear
   - seed: deterministic random seed
   - className: additional classes
   - paperColor: colour of the "paper" peeking through
   - fibreColor: thin lighter strip along the tear edge
   - shadow: whether to add a soft shadow                        */

interface TornEdgeProps {
  side: "left" | "right" | "top" | "bottom";
  seed: number;
  className?: string;
  paperColor?: string;
  fibreColor?: string;
  shadow?: boolean;
  steps?: number;
  amplitude?: number;
}

export function TornEdge({
  side,
  seed,
  className = "",
  paperColor = "#e5e0d3",
  fibreColor = "#ece7da",
  shadow = true,
  steps = 40,
  amplitude = 12,
}: TornEdgeProps) {
  const clipPath = useMemo(
    () => generateTornPath(side, seed, steps, amplitude),
    [side, seed, steps, amplitude]
  );

  const fibreClipPath = useMemo(
    () => generateTornPath(side, seed + 1, steps, amplitude * 0.3),
    [side, seed, steps, amplitude]
  );

  const isHorizontal = side === "top" || side === "bottom";
  const sizeClass = isHorizontal
    ? "w-full h-[28px] sm:h-[36px]"
    : "h-full w-[28px] sm:w-[36px]";

  const positionClass = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    left: "top-0 left-0 bottom-0",
    right: "top-0 right-0 bottom-0",
  }[side];

  const shadowStyle = shadow
    ? {
        filter:
          side === "bottom"
            ? "drop-shadow(0 -4px 6px rgba(20,18,14,0.12))"
            : side === "top"
              ? "drop-shadow(0 4px 6px rgba(20,18,14,0.12))"
              : side === "left"
                ? "drop-shadow(4px 0 6px rgba(20,18,14,0.12))"
                : "drop-shadow(-4px 0 6px rgba(20,18,14,0.12))",
      }
    : {};

  return (
    <div
      className={`absolute ${positionClass} ${sizeClass} z-20 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Main torn paper shape */}
      <div
        className="absolute inset-0"
        style={{
          clipPath,
          backgroundColor: paperColor,
          ...shadowStyle,
        }}
      />
      {/* Thin fibre strip along the tear */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          clipPath: fibreClipPath,
          backgroundColor: fibreColor,
        }}
      />
    </div>
  );
}
