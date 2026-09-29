"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChapterSection } from "./ChapterSection";
import { ArticleSplit } from "./ArticleSplit";
import { TornEdge } from "./TornEdge";
import {
  BengaliWatermark,
  BengaliStamp,
  BengaliMarginNote,
  BengaliPullQuote,
} from "./BengaliAccents";

/* ─── Image Sources (Unsplash — royalty-free) ─────────────────
   Assigned to chapters by subject relevance. All from
   images.unsplash.com (already in next.config remotePatterns).  */

const CHAPTER_IMAGES = {
  arrival: {
    url: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    alt: "A dhak player in traditional white dhuti and red-bordered gamcha beats the dhak drum during Durga Puja festivities",
    credit: "Photo: Unsplash",
  },
  making: {
    url: "https://images.unsplash.com/photo-1584553421349-3557471bed79?auto=format&fit=crop&w=1200&q=80",
    alt: "An artisan in Kumartuli sculpts a clay Durga idol, hands covered in wet grey clay under workshop light",
    credit: "Photo: Unsplash",
  },
  homecoming: {
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
    alt: "Families walking through pandal-lit streets during Durga Puja evening, warm golden lights overhead",
    credit: "Photo: Unsplash",
  },
  celebration: {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    alt: "Dancers performing on a brightly lit cultural stage during a festival celebration",
    credit: "Photo: Unsplash",
  },
  farewell: {
    url: "https://images.unsplash.com/photo-1604423860892-ce4e8a0a8e66?auto=format&fit=crop&w=1200&q=80",
    alt: "Women playing sindoor khela, smearing vermillion on each other during Bijoya Dashami",
    credit: "Photo: Unsplash",
  },
  event: {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    alt: "Night festival celebrations with vibrant stage lights and crowd",
    credit: "Photo: Unsplash",
  },
};

/* ─── Diya SVG Motif ─────────────────────────────────────────── */
function DiyaMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" className={className} aria-hidden="true">
      <ellipse cx="20" cy="10" rx="4" ry="7" fill="#d4a24e" opacity="0.8" />
      <ellipse cx="20" cy="11" rx="2" ry="4" fill="#faf6ee" opacity="0.6" />
      <path d="M12 22 Q14 18, 20 18 Q26 18, 28 22 L30 30 Q20 34, 10 30 Z" fill="#c83a1a" opacity="0.7" />
      <ellipse cx="20" cy="22" rx="8" ry="2" fill="#d4a24e" opacity="0.3" />
    </svg>
  );
}

/* ─── All Narrative Chapters ─────────────────────────────────── */
export function AgomoniChapters() {
  const prefersReduced = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <>
      {/* ── Chapter 1: The Arrival ─── Text LEFT, Image RIGHT ──── */}
      <section className="relative w-full bg-[#e5e0d3] border-b border-[#14120e]/15 overflow-hidden">
        <BengaliWatermark text="ঢাকের তালে" position="right" />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.arrival.url}
          imageAlt={CHAPTER_IMAGES.arrival.alt}
          imageCredit={CHAPTER_IMAGES.arrival.credit}
          imagePosition="right"
          tornSeed={101}
        >
          <div className="relative">
            <BengaliMarginNote text="শিউলি-ঝরা ভোর" side="right" />

            {/* Dateline + Chapter header */}
            <div className="text-[#14120e]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#14120e]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                Chapter I
              </span>
              <span className="w-8 h-px bg-[#d4a24e]/40" />
              <span className="font-serif italic text-xs">Anticipation</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Arrival
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e] mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              আগমনী — Agomoni
            </p>

            {/* Prose with drop cap */}
            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed prose-dropcap" style={{ '--dropcap-color': '#d4a24e' } as React.CSSProperties}>
              <p>
                There&apos;s a shift in the air sometime in late September — subtle, almost imperceptible.
                The monsoon loosens its grip, the sky turns a pale, luminous blue, and the afternoons grow
                gentle with a coolness that wasn&apos;t there before. On the banks of the Ganga, kaash-phool
                begins to sway in soft white waves, and in every lane, the first whispers begin:
                <em className="text-[#d4a24e]"> &ldquo;Pujo asche.&rdquo;</em>
              </p>
              <p>
                This is Agomoni — the arrival, the anticipation, the promise that something magnificent
                is approaching. Somewhere in the distance, a lone dhak begins its rhythm, tentative at
                first, then steady and insistent. It&apos;s the heartbeat of Bengal waking up, calling the
                Goddess home.
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 2: The Making ─── Image LEFT, Text RIGHT ──── */}
      <section className="relative w-full bg-[#14120e] text-[#e5e0d3] border-b border-[#e5e0d3]/15 overflow-hidden">
        <TornEdge side="top" seed={201} paperColor="#e5e0d3" fibreColor="#ece7da" amplitude={10} />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.making.url}
          imageAlt={CHAPTER_IMAGES.making.alt}
          imageCredit={CHAPTER_IMAGES.making.credit}
          imagePosition="left"
          darkBg
          tornSeed={202}
        >
          <div className="relative">
            <div className="text-[#e5e0d3]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#e5e0d3]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#c83a1a]">
                Chapter II
              </span>
              <span className="w-8 h-px bg-[#c83a1a]/40" />
              <span className="font-serif italic text-xs">Craft &amp; Patience</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Making
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#c83a1a] mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              কুমারটুলি — Kumartuli
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-[#e5e0d3]/85 prose-dropcap" style={{ '--dropcap-color': '#c83a1a' } as React.CSSProperties}>
              <p>
                Months before the first dhak beat, in the narrow lanes of Kumartuli, hands caked in
                Ganga clay begin to sculpt divinity. Straw frames sprout ribs and limbs; clay becomes
                flesh; hollow eye sockets are painted open with a single brushstroke that feels like
                an act of invocation.
              </p>

              <BengaliPullQuote
                text="হাতের ছোঁয়ায় প্রাণ"
                attribution="Life through the touch of hands"
                className="text-[#d4a24e]"
              />

              <p>
                Across the city, pandal committees race against time. Bamboo skeletons rise on street
                corners, draped in fabric and ambition. The sawing, hammering, and painting go on through sleepless
                nights, fuelled by cups of cha and the collective pride of a neighbourhood.
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 3: The Homecoming ─── Text LEFT, Image RIGHT ─ */}
      <section className="relative w-full bg-[#e5e0d3] border-b border-[#14120e]/15 overflow-hidden">
        <TornEdge side="top" seed={301} paperColor="#14120e" fibreColor="#1e1c18" amplitude={10} />
        <BengaliWatermark text="ঘরে ফেরা" position="left" />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.homecoming.url}
          imageAlt={CHAPTER_IMAGES.homecoming.alt}
          imageCredit={CHAPTER_IMAGES.homecoming.credit}
          imagePosition="right"
          tornSeed={302}
        >
          <div className="relative">
            <BengaliStamp text="ঘরে ফেরা" color="#c83a1a" className="absolute -top-2 right-0 hidden lg:block" />

            <div className="text-[#14120e]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#14120e]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                Chapter III
              </span>
              <span className="w-8 h-px bg-[#d4a24e]/40" />
              <span className="font-serif italic text-xs">Nostalgia &amp; Belonging</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Homecoming
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e] mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              ঘরে ফেরা — Ghore Phera
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed prose-dropcap" style={{ '--dropcap-color': '#d4a24e' } as React.CSSProperties}>
              <p>
                Trains fill up. Flights get booked out months in advance. The highways leading to
                Kolkata swell with a tide of people coming home — not just to a city, but to a feeling.
                <em> Pujo</em> is the great gravitational force of Bengal: it pulls you back no matter
                where you&apos;ve gone.
              </p>
              <p>
                Homes buzz with preparation. Wardrobes are flung open, new saris pressed and hung,
                kurtas laid out with quiet pride. There&apos;s luchi and aloor dom for breakfast,
                and the whole house smells of dhoop and Chanel No. 5 in equal measure.
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 4: The Celebration ─── Image LEFT, Text RIGHT ─ */}
      <section className="relative w-full bg-[#e5e0d3] border-b border-[#14120e]/15 overflow-hidden">
        <BengaliWatermark text="ধুনুচির ধোঁয়ায়" position="right" />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.celebration.url}
          imageAlt={CHAPTER_IMAGES.celebration.alt}
          imageCredit={CHAPTER_IMAGES.celebration.credit}
          imagePosition="left"
          tornSeed={401}
        >
          <div className="relative">
            <BengaliMarginNote text="আড্ডা" side="right" />

            <div className="text-[#14120e]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#14120e]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#c83a1a]">
                Chapter IV
              </span>
              <span className="w-8 h-px bg-[#c83a1a]/40" />
              <span className="font-serif italic text-xs">Joy</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Celebration
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#c83a1a] mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              উৎসব — Utsav
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed prose-dropcap" style={{ '--dropcap-color': '#c83a1a' } as React.CSSProperties}>
              <p>
                And then it begins. The five days that Bengalis live the other three hundred and sixty
                for. Shashti, Saptami, Ashtami, Navami, Dashami — each with its own rhythm, its own
                flavour, its own pitch of joy. The dhak is relentless now, filling the streets with a
                primal thunder.
              </p>
              <p>
                Dhunuchi naach at sandhya aarti — smoke swirling around dancers who move as if possessed.
                The bhog is served: khichuri, labra, begun bhaja, payesh — every spoonful a communion.
                Between pandal-hops you eat jhalmuri from paper cones and bump into old schoolmates
                you haven&apos;t seen in years.
              </p>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 5: The Farewell ─── Text LEFT, Image RIGHT ─── */}
      <section className="relative w-full bg-[#14120e] text-[#e5e0d3] border-b border-[#e5e0d3]/15 overflow-hidden">
        <TornEdge side="top" seed={501} paperColor="#e5e0d3" fibreColor="#ece7da" amplitude={10} />

        <ArticleSplit
          imageUrl={CHAPTER_IMAGES.farewell.url}
          imageAlt={CHAPTER_IMAGES.farewell.alt}
          imageCredit={CHAPTER_IMAGES.farewell.credit}
          imagePosition="right"
          darkBg
          tornSeed={502}
        >
          <div className="relative">
            <BengaliStamp text="শুভ বিজয়া" color="#d4a24e" className="absolute -top-2 right-0 hidden lg:block" />

            <div className="text-[#e5e0d3]/50 mb-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold">
                KOLKATA &middot; AGOMONI DESK
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[#e5e0d3]/50">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e]">
                Chapter V
              </span>
              <span className="w-8 h-px bg-[#d4a24e]/40" />
              <span className="font-serif italic text-xs">Bittersweet Longing</span>
            </div>

            <h2 className="font-display-serif text-3xl sm:text-5xl tracking-tight leading-[1.05] mb-2">
              The Farewell
            </h2>
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e] mb-8" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              বিজয়া দশমী — Bijoya Dashami
            </p>

            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-[#e5e0d3]/85 prose-dropcap" style={{ '--dropcap-color': '#d4a24e' } as React.CSSProperties}>
              <p>
                Dashami arrives too soon. It always does. The morning begins with sindoor khela —
                married women smearing each other&apos;s faces and hair with vermillion, their
                laughter edged with the sadness of goodbye.
              </p>

              <BengaliPullQuote
                text="সিঁদুর খেলা"
                attribution="Sindoor Khela"
                className="text-[#d4a24e]"
              />

              <p>
                The immersion procession begins in the afternoon. Idols sway on trucks garlanded
                with marigold, trailing drumbeats and dancers who refuse to let go. At the ghat,
                Ma is lowered into the river — slowly, tenderly — and for a moment, the whole world
                holds still.
              </p>

              <div className="flex items-center gap-3 pt-4">
                <DiyaMotif className="opacity-60 flex-shrink-0" />
                <p className="text-[#d4a24e] font-serif italic text-lg sm:text-xl leading-relaxed">
                  &ldquo;Ashche bochor abar hobe&rdquo; — she will return next year.
                  She always does.
                </p>
              </div>
            </div>
          </div>
        </ArticleSplit>
      </section>

      {/* ── Chapter 6: The Event ─────────────────────────────────── */}
      <section
        id="the-event"
        className="relative w-full bg-[#e5e0d3] text-[#14120e] border-b border-[#14120e]/15 overflow-hidden"
      >
        <TornEdge side="top" seed={601} paperColor="#14120e" fibreColor="#1e1c18" amplitude={10} />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-32">
          {/* Bengali accent */}
          <div className="text-center mb-2">
            <span className="font-bengali-serif text-lg sm:text-xl text-[#a82e13]" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              মঞ্চ তোমার অপেক্ষায়
            </span>
          </div>

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#a82e13] block mb-3">
              The Event
            </span>
            <h2 className="font-display-serif text-4xl sm:text-6xl lg:text-7xl text-[#14120e] tracking-tight mb-4">
              Agomoni 2026
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#14120e]/70 max-w-2xl mx-auto leading-relaxed">
              A pre-Durga Puja cultural programme celebrating art, music, dance, and the
              collective spirit of RCCIIT — organised by <strong>RCC Talkies</strong> and
              the <strong>Art &amp; Cultural Club of RCCIIT</strong>.
            </p>
          </motion.div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                label: "Date",
                value: "9 October 2026",
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4a24e]">
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                ),
              },
              {
                label: "Time",
                value: "1:00 PM \u2014 5:00 PM",
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4a24e]">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                label: "Venue",
                value: "RCCIIT Campus",
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4a24e]">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                placeholder: true,
              },
              {
                label: "Hosted By",
                value: "RCC Talkies \u00d7 Art & Cultural Club",
                iconSvg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4a24e]">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="border border-[#14120e]/15 p-6 bg-[#eae5d9]/50 text-center space-y-2 hover:border-[#14120e] hover:shadow-[3px_3px_0px_#14120e] hover:-translate-y-0.5 transition-all duration-300"
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block mb-1">{item.iconSvg}</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#a82e13] block">
                  {item.label}
                </span>
                <span className={`font-display-serif text-lg sm:text-xl text-[#14120e] block ${"placeholder" in item && item.placeholder ? "italic text-[#14120e]/50" : ""}`}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Cultural Programme Schedule */}
          <motion.div
            className="border-2 border-[#14120e] bg-[#eae5d9] p-6 sm:p-10 relative overflow-hidden"
            initial={prefersReduced ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full h-1 bg-[#d4a24e] absolute top-0 left-0 right-0" />

            <div className="flex items-center gap-3 mb-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#d4a24e]">
                Cultural Programme
              </span>
              <span className="w-12 h-px bg-[#14120e]/20" />
              <span className="font-serif italic text-xs text-[#14120e]/50">
                Schedule to be announced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Music Performances (Vocal & Instrumental)",
                "Dance — Classical, Folk & Contemporary",
                "Drama & Skit Performances",
                "Recitation & Spoken Word",
                "Art Exhibition & Live Painting",
                "Photography Showcase",
                "Quiz & Fun Activities",
                "Special Guest Performances",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-[#14120e]/10 last:border-0"
                >
                  <span className="w-2 h-2 bg-[#d4a24e] flex-shrink-0" />
                  <span className="font-serif text-sm sm:text-base text-[#14120e]/80">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-serif italic text-xs text-[#14120e]/40 mt-6 text-center">
              Detailed schedule with timings will be published closer to the event.
            </p>
          </motion.div>

          {/* CTA to form */}
          <motion.div
            className="text-center mt-12"
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="#participate"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-base sm:text-lg uppercase tracking-tight px-10 py-4 hover:bg-[#a82e13] transition-colors duration-300"
            >
              Register to Participate
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
