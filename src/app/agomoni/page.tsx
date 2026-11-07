import type { Metadata } from "next";
import { AgomoniDomeSection } from "@/components/agomoni/AgomoniDomeSection";
import { AgomoniHero } from "@/components/agomoni/AgomoniHero";
import { AgomoniDriftSection } from "@/components/agomoni/AgomoniDriftSection";
import { AgomoniClosing } from "@/components/agomoni/AgomoniClosing";
import { ChapterProgress } from "@/components/agomoni/ChapterProgress";
import { SmoothScroll } from "@/components/agomoni/SmoothScroll";

/* ─── SEO & Open Graph ────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Agomoni 2026 | আগমনী — Pre-Durga Puja Celebration",
  description:
    "Agomoni 2026: A pre-Durga Puja celebration of art, music, dance & culture, hosted by RCC Talkies and the Art & Cultural Club of RCCIIT on 9 October 2026.",
  keywords: [
    "Agomoni 2026",
    "Durga Puja",
    "RCCIIT",
    "RCC Talkies",
    "Art Cultural Club",
    "Kolkata",
    "college fest",
    "cultural programme",
    "pre-puja celebration",
  ],
  openGraph: {
    title: "Agomoni 2026 | আগমনী",
    description:
      "A pre-Durga Puja cultural celebration at RCCIIT. Music, dance, art & the spirit of Pujo. 9 Oct 2026.",
    type: "website",
    url: "/agomoni",
    /* TODO: Replace with actual OG image once designed */
    // images: [{ url: "/og/agomoni-2026.jpg", width: 1200, height: 630, alt: "Agomoni 2026" }],
  },
};

/* ─── Page Component (Server Component) ──────────────────────── */

export default function AgomoniPage() {
  return (
    <SmoothScroll>
      <div className="w-full">
        <ChapterProgress />
        <AgomoniDomeSection />
        <AgomoniHero />
        <AgomoniDriftSection />
        <AgomoniClosing />
      </div>
    </SmoothScroll>
  );
}
