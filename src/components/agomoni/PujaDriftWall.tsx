"use client";

import { useState } from "react";
import Image from "next/image";
import InfiniteSpiral, { type InfiniteSpiralItem } from "./InfiniteSpiral";
import "./InfiniteSpiral.css";

/* ─── 22 College Community Pujo Glimpses ────────────────────────
   Photographs captured by RCCIIT students during Durga Puja,
   stored in public/agomoni/gallery/
   ───────────────────────────────────────────────────────────── */
const GALLERY_IMAGES: InfiniteSpiralItem[] = [
  {
    src: "/agomoni/gallery/Aharna Hazra  CSE2026140.jpeg",
    photographer: "Aharna Hazra",
    dept: "CSE · Roll 2026140",
    alt: "Durga Puja capture by Aharna Hazra",
  },
  {
    src: "/agomoni/gallery/Ananya Giri  IT2026057.jpeg",
    photographer: "Ananya Giri",
    dept: "IT · Roll 2026057",
    alt: "Durga Puja capture by Ananya Giri",
  },
  {
    src: "/agomoni/gallery/Angikar Bose  CSEAI2026054.jpeg",
    photographer: "Angikar Bose",
    dept: "CSE-AI · Roll 2026054",
    alt: "Durga Puja capture by Angikar Bose",
  },
  {
    src: "/agomoni/gallery/Anirban Shaw CSE2026088.jpeg",
    photographer: "Anirban Shaw",
    dept: "CSE · Roll 2026088",
    alt: "Durga Puja capture by Anirban Shaw",
  },
  {
    src: "/agomoni/gallery/Ankit Karmakar.jpeg",
    photographer: "Ankit Karmakar",
    dept: "RCCIIT",
    alt: "Durga Puja capture by Ankit Karmakar",
  },
  {
    src: "/agomoni/gallery/deepjyoti.jpg",
    photographer: "Deepjyoti",
    dept: "RCCIIT",
    alt: "Durga Puja capture by Deepjyoti",
  },
  {
    src: "/agomoni/gallery/deepjyoti1.jpg",
    photographer: "Deepjyoti",
    dept: "RCCIIT",
    alt: "Durga Puja capture by Deepjyoti",
  },
  {
    src: "/agomoni/gallery/Monjuri Paul  ECE2024074.jpeg",
    photographer: "Monjuri Paul",
    dept: "ECE · Roll 2024074",
    alt: "Durga Puja capture by Monjuri Paul",
  },
  {
    src: "/agomoni/gallery/Mouparna Gupta  CSEAI2026005.jpeg",
    photographer: "Mouparna Gupta",
    dept: "CSE-AI · Roll 2026005",
    alt: "Durga Puja capture by Mouparna Gupta",
  },
  {
    src: "/agomoni/gallery/Name - Arkonil Sarkar (1st year).jpeg",
    photographer: "Arkonil Sarkar",
    dept: "1st Year",
    alt: "Durga Puja capture by Arkonil Sarkar",
  },
  {
    src: "/agomoni/gallery/Name-Dibyendu Maiti  Roll -cse2025028.jpeg",
    photographer: "Dibyendu Maiti",
    dept: "CSE · Roll 2025028",
    alt: "Durga Puja capture by Dibyendu Maiti",
  },
  {
    src: "/agomoni/gallery/OESHIK MAZUMDER  BCA2024028.jpeg",
    photographer: "Oeshik Mazumder",
    dept: "BCA · Roll 2024028",
    alt: "Durga Puja capture by Oeshik Mazumder",
  },
  {
    src: "/agomoni/gallery/Orly Roy CSE2025110.jpeg",
    photographer: "Orly Roy",
    dept: "CSE · Roll 2025110",
    alt: "Durga Puja capture by Orly Roy",
  },
  {
    src: "/agomoni/gallery/Rajroop Mukhopadhyay  IT IT2026007.jpeg",
    photographer: "Rajroop Mukhopadhyay",
    dept: "IT · Roll 2026007",
    alt: "Durga Puja capture by Rajroop Mukhopadhyay",
  },
  {
    src: "/agomoni/gallery/RUPKATHA DATTA  BCA2026033.jpeg",
    photographer: "Rupkatha Datta",
    dept: "BCA · Roll 2026033",
    alt: "Durga Puja capture by Rupkatha Datta",
  },
  {
    src: "/agomoni/gallery/Soumik Talukder  CSE2025025.jpeg",
    photographer: "Soumik Talukder",
    dept: "CSE · Roll 2025025",
    alt: "Durga Puja capture by Soumik Talukder",
  },
  {
    src: "/agomoni/gallery/Soumojit Das CSE2025001.jpeg",
    photographer: "Soumojit Das",
    dept: "CSE · Roll 2025001",
    alt: "Durga Puja capture by Soumojit Das",
  },
  {
    src: "/agomoni/gallery/Sourasish Samanta  ECE2025029.jpeg",
    photographer: "Sourasish Samanta",
    dept: "ECE · Roll 2025029",
    alt: "Durga Puja capture by Sourasish Samanta",
  },
  {
    src: "/agomoni/gallery/Sramanbrata Chatterjee ECE2025003.jpeg",
    photographer: "Sramanbrata Chatterjee",
    dept: "ECE · Roll 2025003",
    alt: "Durga Puja capture by Sramanbrata Chatterjee",
  },
  {
    src: "/agomoni/gallery/Suvranil Sinha Roy ece-2024084. (1).jpeg",
    photographer: "Suvranil Sinha Roy",
    dept: "ECE · Roll 2024084",
    alt: "Durga Puja capture by Suvranil Sinha Roy",
  },
  {
    src: "/agomoni/gallery/Suvranil Sinha Roy ece-2024084.jpeg",
    photographer: "Suvranil Sinha Roy",
    dept: "ECE · Roll 2024084",
    alt: "Durga Puja capture by Suvranil Sinha Roy",
  },
  {
    src: "/agomoni/gallery/Swagata Biswas CSEAI2026030.jpeg",
    photographer: "Swagata Biswas",
    dept: "CSE-AI · Roll 2026030",
    alt: "Durga Puja capture by Swagata Biswas",
  },
];

export function PujaDriftWall() {
  const [selectedPhoto, setSelectedPhoto] = useState<InfiniteSpiralItem | null>(null);

  return (
    <section className="relative w-full bg-[#0d0b08] text-[#e5e0d3] py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-[#d4a24e]/15">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/agomoni/background of gallery.png"
          alt="Glimpses of Pujo Atmosphere Background"
          fill
          quality={90}
          priority
          className="object-cover object-left-top md:object-left-top glimpses-bg-image"
        />
        {/* Subtle dark tint to keep text and 3D spiral cards perfectly legible */}
        <div className="absolute inset-0 bg-black/45 md:bg-black/55" />
      </div>

      {/* Main Section Heading: Centered at Top of entire section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-center mb-6 sm:mb-8 lg:mb-12 z-10 relative">
        <div className="inline-flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-[#d4a24e]/40" />
          <h3 className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
            Glimpses of Pujo
          </h3>
          <span className="w-8 h-px bg-[#d4a24e]/40" />
        </div>
      </div>

      {/* Responsive Two-Column Layout (Stacked on Mobile, 40/60 on Tablet & Desktop) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Bengali Heading & Description */}
          <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left translate-x-3 sm:translate-x-5 md:translate-x-8 lg:translate-x-12 pr-0 md:pr-4">
            <h2
              className="font-bensen-handwriting text-4xl sm:text-5xl lg:text-6xl text-[#f3eedf] leading-[1.25]"
              lang="bn"
              style={{ fontFamily: "'BenSenHandwriting', cursive, sans-serif", letterSpacing: 0 }}
            >
              উৎসবের স্মৃতি
            </h2>
            <p className="font-serif italic text-sm sm:text-base lg:text-lg text-[#e5e0d3]/70 mt-3 sm:mt-4 leading-relaxed max-w-lg mx-auto md:mx-0">
              Through the lenses of RCCIITians. Click any photo to see the photographer’s name.
            </p>
          </div>

          {/* RIGHT COLUMN: Infinite Spiral Gallery */}
          <div className="md:col-span-7 w-full h-[520px] sm:h-[580px] lg:h-[620px] relative overflow-hidden flex items-center justify-center">
            <InfiniteSpiral
              items={GALLERY_IMAGES}
              animationMode="all"
              speed={0.35}
              radius={210}
              cardWidth={200}
              cardHeight={160}
              verticalSpacing={72}
              perspective={675}
              cardRadius={10}
              centerScale={1.2}
              edgeBlur={6}
              cardsPerTurn={7}
              pauseOnHover
              onItemClick={(item) => setSelectedPhoto(item)}
            />
          </div>
        </div>
      </div>

      {/* Lightbox Modal on Card Click */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#181511] border border-[#d4a24e]/30 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-[#c83a1a] text-white flex items-center justify-center text-sm transition-colors border border-white/20"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Photo preview */}
            <div className="relative w-full max-h-[70vh] bg-black/40 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt || "Glimpse of Pujo"}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Photographer badge & details */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-t border-[#d4a24e]/20 bg-[#14120e]">
              <div>
                <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#d4a24e] font-semibold">
                  Captured by
                </p>
                <h3 className="font-display-serif text-lg sm:text-xl text-[#f3eedf]">
                  {selectedPhoto.photographer}
                </h3>
                {selectedPhoto.dept && (
                  <p className="font-sans text-xs text-[#e5e0d3]/60 mt-0.5">
                    {selectedPhoto.dept}
                  </p>
                )}
              </div>

              <div className="hidden sm:block text-right">
                <span className="font-serif italic text-xs text-[#d4a24e]/80">
                  Agomoni 2026 Archive
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
