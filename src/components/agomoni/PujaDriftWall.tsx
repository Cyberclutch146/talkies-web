"use client";

import dynamic from "next/dynamic";

/* Lazy-load DriftWall since it's heavy and below the fold */
const DriftWall = dynamic(() => import("./DriftWall"), { ssr: false });

/* ─── Durga Puja imagery from Unsplash ─────────────────────────
   These are all free-to-use Unsplash photos of Durga Puja,
   Kolkata festivals, Indian cultural celebrations.              */
const PUJA_IMAGES = [
  { image: "https://images.unsplash.com/photo-1633012764038-f8eab989f2aa?auto=format&fit=crop&w=600&q=80", title: "Durga Idol" },
  { image: "https://images.unsplash.com/photo-1601001815894-4bb6c81416d7?auto=format&fit=crop&w=600&q=80", title: "Pandal Lights" },
  { image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=600&q=80", title: "Festival Crowd" },
  { image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80", title: "Dhak Player" },
  { image: "https://images.unsplash.com/photo-1604423860892-ce4e8a0a8e66?auto=format&fit=crop&w=600&q=80", title: "Sindoor Khela" },
  { image: "https://images.unsplash.com/photo-1625898911513-58d88e8ad52a?auto=format&fit=crop&w=600&q=80", title: "Immersion" },
  { image: "https://images.unsplash.com/photo-1567591370504-81e735656982?auto=format&fit=crop&w=600&q=80", title: "Diyas and Light" },
  { image: "https://images.unsplash.com/photo-1584553421349-3557471bed79?auto=format&fit=crop&w=600&q=80", title: "Idol Making" },
  { image: "https://images.unsplash.com/photo-1600188769099-dc23cf0e13ab?auto=format&fit=crop&w=600&q=80", title: "Marigolds" },
  { image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80", title: "Cultural Stage" },
  { image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80", title: "Festival Night" },
  { image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80", title: "Night Celebrations" },
  { image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80", title: "Street Festival" },
  { image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80", title: "Festive Crowd" },
  { image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80", title: "Music and Dance" },
];

export function PujaDriftWall() {
  return (
    <section className="relative w-full bg-[#0a0908] overflow-hidden border-b border-[#d4a24e]/10">
      {/* Section label */}
      <div className="absolute top-6 left-0 right-0 z-10 text-center pointer-events-none">
        <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]/60">
          Glimpses of Pujo
        </span>
      </div>

      <div className="h-[420px] sm:h-[520px] lg:h-[600px]">
        <DriftWall
          items={PUJA_IMAGES}
          columns={5}
          tileWidth={180}
          tileHeight={120}
          gap={14}
          radius={8}
          tilt={14}
          turn={-12}
          perspective={1200}
          depth={100}
          speed={30}
          direction="up"
          variance={0.4}
          parallax={0.5}
          lift={50}
          fade={0.65}
          dim={0.45}
          overlayColor="#0a0908"
        />
      </div>
    </section>
  );
}
