"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

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

/* ─── Generate a realistic torn-paper SVG path ────────────────
   Fewer, bigger rips (10-12 major edges) connected by smooth
   curves. Mimics how real paper tears — a few large directional
   changes with organic curves between them.                     */

function generateTornSvgPath(
  side: "left" | "right" | "top" | "bottom",
  seed: number,
  extent: number = 1000,
  depth: number = 150,
  edges: number = 11,
): string {
  const rng = mulberry32(seed);
  const isHorizontal = side === "top" || side === "bottom";
  const isInverted = side === "bottom" || side === "right";

  // Generate the major tear vertices (10-12 big points)
  const vertices: [number, number][] = [];

  for (let i = 0; i <= edges; i++) {
    const t = i / edges;
    const pos = t * extent;

    // Each edge is a big sweep — alternating deep/shallow with randomness
    const swing = (rng() - 0.5) * depth * 1.6;
    // Slight wave to prevent it from being too uniform
    const wave = Math.sin(t * Math.PI * 2 + rng() * 3) * depth * 0.2;
    const jag = swing + wave;

    // Clamp to keep within the strip
    const clamped = Math.max(-depth * 0.8, Math.min(depth * 0.8, jag));
    const jagOffset = depth / 2 + clamped;

    if (isHorizontal) {
      vertices.push([pos, isInverted ? extent - jagOffset : jagOffset]);
    } else {
      vertices.push([isInverted ? extent - jagOffset : jagOffset, pos]);
    }
  }

  // Build path with cubic bezier curves for smooth, organic connections
  let d = `M ${vertices[0][0]},${vertices[0][1]}`;

  for (let i = 1; i < vertices.length; i++) {
    const [x, y] = vertices[i];
    const [px, py] = vertices[i - 1];

    // Control points: offset perpendicular to the line for organic feel
    const midX = (px + x) / 2;
    const midY = (py + y) / 2;
    const cpOff1 = (rng() - 0.5) * depth * 0.4;
    const cpOff2 = (rng() - 0.5) * depth * 0.4;

    if (isHorizontal) {
      d += ` C ${px + (x - px) * 0.3},${py + cpOff1} ${px + (x - px) * 0.7},${y + cpOff2} ${x},${y}`;
    } else {
      d += ` C ${px + cpOff1},${py + (y - py) * 0.3} ${x + cpOff2},${py + (y - py) * 0.7} ${x},${y}`;
    }
  }

  return d;
}

/* ─── Generate a straight line path (the "un-torn" state) ────── */
function generateStraightPath(
  side: "left" | "right" | "top" | "bottom",
  extent: number = 1000,
): string {
  if (side === "top") return `M 0,0 L ${extent},0`;
  if (side === "bottom") return `M 0,${extent} L ${extent},${extent}`;
  if (side === "left") return `M 0,0 L 0,${extent}`;
  return `M ${extent},0 L ${extent},${extent}`;
}

/* ─── Close a path to fill the paper area ──────────────────────── */
function closePath(d: string, side: "top" | "bottom" | "left" | "right", extent: number = 1000) {
  if (side === "top") return `${d} L ${extent},0 L 0,0 Z`;
  if (side === "bottom") return `${d} L ${extent},${extent} L 0,${extent} Z`;
  if (side === "left") return `${d} L 0,${extent} L 0,0 Z`;
  return `${d} L ${extent},${extent} L ${extent},0 Z`;
}

/* ─── TornEdge ─────────────────────────────────────────────────
   Realistic torn-paper edge with GSAP MorphSVG rip-in animation.

   On viewport entry: morphs from a straight line to the jagged
   torn path using GSAP's MorphSVGPlugin (free since 2025).

   Layers: shadow → fibre thickness → main paper.                */

interface TornEdgeProps {
  side: "left" | "right" | "top" | "bottom";
  seed: number;
  className?: string;
  paperColor?: string;
  fibreColor?: string;
  shadow?: boolean;
  stripHeight?: number;
  /** Enable the GSAP MorphSVG rip-in animation */
  animate?: boolean;
}

export function TornEdge({
  side,
  seed,
  className = "",
  paperColor = "#e5e0d3",
  fibreColor = "#f0ebe0",
  shadow = true,
  stripHeight = 40,
  animate = true,
}: TornEdgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const fibrePathRef = useRef<SVGPathElement>(null);
  const shadowPathRef = useRef<SVGPathElement>(null);

  const isHorizontal = side === "top" || side === "bottom";
  const viewExtent = 1000;
  const depth = 150; // Dramatic tear depth for clearly visible jagged edges

  // Generate paths deterministically
  const paths = useMemo(() => {
    const mainD = generateTornSvgPath(side, seed, viewExtent, depth, 40);
    const fibreD = generateTornSvgPath(side, seed + 7, viewExtent, depth * 0.7, 38);
    const shadowD = generateTornSvgPath(side, seed + 3, viewExtent, depth * 0.5, 36);
    const straightD = generateStraightPath(side, viewExtent);

    return {
      mainTorn: closePath(mainD, side, viewExtent),
      fibreTorn: closePath(fibreD, side, viewExtent),
      shadowTorn: closePath(shadowD, side, viewExtent),
      mainStraight: closePath(straightD, side, viewExtent),
      fibreStraight: closePath(straightD, side, viewExtent),
      shadowStraight: closePath(straightD, side, viewExtent),
    };
  }, [side, seed]);

  // GSAP MorphSVG animation
  useGSAP(() => {
    if (!animate) return;
    if (!mainPathRef.current || !fibrePathRef.current) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Set to final state immediately
      mainPathRef.current.setAttribute("d", paths.mainTorn);
      fibrePathRef.current.setAttribute("d", paths.fibreTorn);
      if (shadowPathRef.current) {
        shadowPathRef.current.setAttribute("d", paths.shadowTorn);
      }
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "top 50%",
        scrub: false,
        once: true,
      },
    });

    // Morph all three layers from straight to torn
    tl.to(mainPathRef.current, {
      morphSVG: paths.mainTorn,
      duration: 0.8,
      ease: "power2.out",
    } as gsap.TweenVars, 0);

    tl.to(fibrePathRef.current, {
      morphSVG: paths.fibreTorn,
      duration: 0.7,
      ease: "power2.out",
    } as gsap.TweenVars, 0.05);

    if (shadowPathRef.current) {
      tl.to(shadowPathRef.current, {
        morphSVG: paths.shadowTorn,
        duration: 0.6,
        ease: "power2.out",
      } as gsap.TweenVars, 0.02);
    }
  }, {
    scope: containerRef,
    dependencies: [animate, paths],
  });

  const positionClass = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    left: "top-0 left-0 bottom-0",
    right: "top-0 right-0 bottom-0",
  }[side];

  const sizeStyle = isHorizontal
    ? { height: stripHeight }
    : { width: stripHeight };

  return (
    <div
      ref={containerRef}
      className={`absolute ${positionClass} ${isHorizontal ? "w-full" : "h-full"} z-20 pointer-events-none ${className}`}
      style={sizeStyle}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${viewExtent} ${viewExtent}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {shadow && (
            <filter id={`torn-shadow-${seed}`} x="-5%" y="-5%" width="110%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
              <feOffset dx="0" dy={side === "top" ? -3 : 3} />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.25" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Shadow layer */}
        {shadow && (
          <path
            ref={shadowPathRef}
            d={animate ? paths.shadowStraight : paths.shadowTorn}
            fill="rgba(20,18,14,0.15)"
            filter={`url(#torn-shadow-${seed})`}
          />
        )}

        {/* Fibre thickness strip */}
        <path
          ref={fibrePathRef}
          d={animate ? paths.fibreStraight : paths.fibreTorn}
          fill={fibreColor}
        />

        {/* Main paper surface */}
        <path
          ref={mainPathRef}
          d={animate ? paths.mainStraight : paths.mainTorn}
          fill={paperColor}
        />
      </svg>
    </div>
  );
}
