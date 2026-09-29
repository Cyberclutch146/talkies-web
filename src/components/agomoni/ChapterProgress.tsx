"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/* ─── Chapter Progress Line ──────────────────────────────────────
   A thin vertical/horizontal progress bar that fills as the user
   scrolls through the narrative chapters. Fixed on viewport edge. */

export function ChapterProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progressColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.85, 1],
    ["#d4a24e", "#c83a1a", "#d4a24e", "#c83a1a", "#d4a24e"]
  );

  if (prefersReduced) return null;

  return (
    <div
      className="fixed top-0 left-0 w-[3px] h-full z-40 hidden lg:block"
      aria-hidden="true"
    >
      <motion.div
        className="w-full origin-top"
        style={{
          scaleY,
          height: "100%",
          background: progressColor,
        }}
      />
    </div>
  );
}
