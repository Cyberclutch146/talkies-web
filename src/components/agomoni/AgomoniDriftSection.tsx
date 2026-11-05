"use client";

import DriftWall, { type DriftWallItem } from "./DriftWall";

/* ─── Dummy Drift Wall Items ───────────────────────────────────────────
   Replace these with actual Durga Puja celebration photographs later.  */
export const DUMMY_DRIFT_ITEMS: DriftWallItem[] = [
  { image: "https://picsum.photos/id/1015/600/400", title: "Peaks", href: "https://example.com/one" },
  { image: "https://picsum.photos/id/1025/600/400", title: "Pup", href: "https://example.com/two" },
  { image: "https://picsum.photos/id/1039/600/400", title: "Falls", href: "https://example.com/three" },
  { image: "https://picsum.photos/id/1043/600/400", title: "Forest" },
  { image: "https://picsum.photos/id/1044/600/400", title: "Bridge" },
  { image: "https://picsum.photos/id/1050/600/400", title: "Horizon" },
  { image: "https://picsum.photos/id/1062/600/400", title: "Coast" },
  { image: "https://picsum.photos/id/1069/600/400", title: "Canyon" },
  { image: "https://picsum.photos/id/1074/600/400", title: "Lions" },
  { image: "https://picsum.photos/id/1080/600/400", title: "Fruit" },
  { image: "https://picsum.photos/id/1084/600/400", title: "Walrus" },
  { image: "https://picsum.photos/id/106/600/400", title: "Flow" },
  { image: "https://picsum.photos/id/110/600/400", title: "Meadow" },
  { image: "https://picsum.photos/id/133/600/400", title: "Vintage" },
  { image: "https://picsum.photos/id/164/600/400", title: "Boat" },
];

export function AgomoniDriftSection() {
  return (
    <section
      id="drift-wall"
      className="relative w-full bg-[#14120e] text-[#faf6ee] py-12 sm:py-16 overflow-hidden border-b border-[#d4a24e]/20"
      aria-label="Agomoni Drift Gallery"
    >
      <div style={{ height: 600 }} className="w-full relative">
        <DriftWall
          items={DUMMY_DRIFT_ITEMS}
          columns={5}
          tileWidth={200}
          tileHeight={132}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.6}
          dim={0.55}
          overlayColor="#060010"
        />
      </div>
    </section>
  );
}

