"use client";

import DomeGallery, { type DomeGalleryImage } from "./DomeGallery";

export const PERFORMANCE_IMAGES: DomeGalleryImage[] = [
  { src: "/agomoni/glimpses/performances/NIL_0203.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0204.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0208.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0219.jpg", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0284.jpg", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0286.jpg", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0318.jpg", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0589.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0641.jpg", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0643.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/NIL_0646.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/SOURA_00218.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/SOURA_00256.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851758.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851813.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851833.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851837.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851840.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851842.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851843.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851846.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851867.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851868.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851889.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851942.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851946.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851947.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851952.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851970.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D851977.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852031.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852033.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852040.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852065.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852066.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852071.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852094.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852137%20(1).JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852195.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852200.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852202.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852240.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852311.JPG", alt: "Agomoni Cultural Performance" },
  { src: "/agomoni/glimpses/performances/_D852314.JPG", alt: "Agomoni Cultural Performance" },
];

export function AgomoniDomeSection() {
  return (
    <section
      id="dome-performances"
      className="relative w-full h-[100svh] overflow-hidden bg-[#14120e] border-b-2 border-[#d4a24e]/30"
      aria-label="Agomoni Performances Dome Gallery"
    >
      {/* 3D Dome Sphere */}
      <div className="absolute inset-0 z-0">
        <DomeGallery
          images={PERFORMANCE_IMAGES}
          overlayBlurColor="#14120e"
          grayscale={false}
          fit={0.52}
          minRadius={580}
          openedImageWidth="min(88vw, 480px)"
          openedImageHeight="min(75vh, 480px)"
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
        />
      </div>

      {/* Floating Header Banner */}
      <div className="absolute top-6 sm:top-8 left-0 right-0 z-10 flex flex-col items-center pointer-events-none px-4 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          <span className="w-8 h-px bg-[#d4a24e]/60" />
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
            Performances &amp; Moments
          </span>
          <span className="w-8 h-px bg-[#d4a24e]/60" />
        </div>
        <p className="font-serif italic text-xs sm:text-sm text-[#faf6ee]/70 drop-shadow">
          Drag to explore &middot; Tap any picture to enlarge
        </p>
      </div>

      {/* Downward Navigation to Hero Section */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-auto">
        <a
          href="#hero"
          className="group flex flex-col items-center gap-1.5 text-[#faf6ee]/60 hover:text-[#d4a24e] transition-colors duration-300"
          aria-label="Scroll down to Agomoni celebration"
        >
          <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.25em] font-bold">
            Enter Agomoni
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-y-1 transition-transform duration-300 text-[#d4a24e]"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>
    </section>
  );
}

