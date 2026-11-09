"use client";

import { motion, useReducedMotion } from "framer-motion";
import DomeGallery, { type DomeGalleryImage } from "./DomeGallery";

export const PERFORMANCE_IMAGES: DomeGalleryImage[] = [
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0203.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0204.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0208.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0219.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0284.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0286.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0318.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0589.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0641.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0643.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/NIL_0646.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/SOURA_00218.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/SOURA_00256.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851758.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851813.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851833.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851837.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851840.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851842.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851843.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851846.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851867.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851868.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851889.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851942.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851946.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851947.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851952.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851970.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D851977.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852031.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852033.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852040.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852065.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852066.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852071.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852094.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852137%20(1).webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852195.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852200.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852202.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852240.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852311.webp", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/thumbs/_D852314.webp", alt: "Agomoni Cultural Performance" },
];

export function AgomoniDomeSection() {
  const prefersReduced = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.25 + i * 0.12,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] max-w-[100%] overflow-hidden bg-[#14120e] border-b-2 border-[#d4a24e]/30"
      aria-label="Agomoni 2026"
    >
      {/* 3D Dome Sphere — scaled past the viewport so the curve bleeds off both edges */}
      <div className="absolute inset-0 z-0">
        <DomeGallery
          images={PERFORMANCE_IMAGES}
          immersive
          autoplay
          autoRotateSpeed={4}
          interactive={false}
          segments={28}
          overlayBlurColor="#14120e"
          grayscale={false}
          fit={0.9}
          fitBasis="width"
          minRadius={580}
          heightGuardFactor={3.5}
          openedImageWidth="min(88vw, 480px)"
          openedImageHeight="min(75vh, 480px)"
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
        />
      </div>

      {/* Event title — same faces as the previous hero. Clicks pass through except the button. */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 pointer-events-none">
        <div className="relative w-full max-w-5xl text-center">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[min(96vw,840px)] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(20,18,14,0.5) 0%, rgba(20,18,14,0.22) 50%, transparent 74%)",
            }}
          />

          <motion.div
            className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
            variants={fadeUp}
            initial={prefersReduced ? "visible" : "hidden"}
            animate="visible"
            custom={0}
          >
            <span className="hidden sm:block w-10 h-px shrink-0 bg-[#d4a24e]/70" />
            <span
              className="max-w-[18rem] sm:max-w-none font-sans text-xs sm:text-sm uppercase tracking-[0.22em] sm:tracking-[0.3em] font-bold text-[#d4a24e] leading-relaxed text-balance"
              style={{ textShadow: "0 2px 12px rgba(20,18,14,0.9)" }}
            >
              RCC Talkies &times; Art &amp; Cultural Club, RCCIIT
            </span>
            <span className="hidden sm:block w-10 h-px shrink-0 bg-[#d4a24e]/70" />
          </motion.div>

          <motion.p
            className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-tight text-[#faf6ee] leading-none mb-3 sm:mb-4"
            style={{ textShadow: "0 2px 18px rgba(20,18,14,0.85)" }}
            variants={fadeUp}
            initial={prefersReduced ? "visible" : "hidden"}
            animate="visible"
            custom={1}
          >
            Agomoni 2026
          </motion.p>

          <motion.h1
            className="text-7xl sm:text-9xl lg:text-[168px] xl:text-[192px] 2xl:text-[220px] leading-[1.1] tracking-normal pb-2 pr-4 pt-2"
            lang="bn"
            style={{
              fontFamily: "'BenSenHandwriting', sans-serif",
              letterSpacing: 0,
              lineHeight: 1.2,
              background: "linear-gradient(90deg, #d4a24e 0%, #faf6ee 40%, #d4a24e 80%, #faf6ee 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              paddingBottom: "0.15em",
              paddingRight: "0.2em",
              paddingTop: "0.1em",
              filter: "drop-shadow(0 6px 18px rgba(20,18,14,0.8))",
            }}
            animate={prefersReduced ? {} : { backgroundPosition: ["200% 0%", "0% 0%"] }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            আগমনী
          </motion.h1>

          <motion.p
            className="text-[#d4a24e] text-2xl sm:text-3xl lg:text-4xl -mt-4 sm:-mt-8 mb-6 sm:mb-8 tracking-widest"
            style={{
              fontFamily: "'BenSenHandwriting', sans-serif",
              textShadow: "0 2px 14px rgba(20,18,14,0.9)",
            }}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            ২০২৬
          </motion.p>

          <motion.div
            className="mx-auto mb-7 sm:mb-9 h-[3px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #d4a24e, #c83a1a, #d4a24e, transparent)",
              maxWidth: "min(70%, 360px)",
            }}
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="flex items-center justify-center gap-3 mb-7 sm:mb-10"
            variants={fadeUp}
            initial={prefersReduced ? "visible" : "hidden"}
            animate="visible"
            custom={3}
          >
            <span className="w-8 h-px bg-[#c83a1a]/80" />
            <span
              className="font-sans text-sm sm:text-base lg:text-lg uppercase tracking-[0.2em] text-[#c83a1a] font-bold"
              style={{ textShadow: "0 2px 10px rgba(20,18,14,0.95)" }}
            >
              9 October 2026
            </span>
            <span className="w-8 h-px bg-[#c83a1a]/80" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial={prefersReduced ? "visible" : "hidden"}
            animate="visible"
            custom={4}
          >
            <a
              href="#glimpses"
              className="pointer-events-auto inline-block bg-[#d4a24e] text-[#14120e] font-display text-base sm:text-lg lg:text-xl uppercase tracking-tight px-10 py-4 lg:px-12 lg:py-5 hover:bg-[#c83a1a] hover:text-[#faf6ee] transition-colors duration-300 shadow-[0_8px_24px_rgba(20,18,14,0.45)]"
            >
              Explore Memories
            </a>
          </motion.div>
        </div>
      </div>

      {/* shade into the next section's colour */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-b from-transparent to-[#14120e]/90" aria-hidden="true" />
    </section>
  );
}

