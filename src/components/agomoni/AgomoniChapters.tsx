"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChapterSection } from "./ChapterSection";

/* ─── Diya SVG Motif ─────────────────────────────────────────── */
function DiyaMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" className={className} aria-hidden="true">
      {/* Flame */}
      <ellipse cx="20" cy="10" rx="4" ry="7" fill="#d4a24e" opacity="0.8" />
      <ellipse cx="20" cy="11" rx="2" ry="4" fill="#faf6ee" opacity="0.6" />
      {/* Lamp body */}
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
      {/* ── Chapter 1: The Arrival (Agomoni) ─────────────────────── */}
      <ChapterSection
        chapterNumber="Chapter I"
        title="The Arrival"
        bengaliTitle="আগমনী — Agomoni"
        emotion="Anticipation"
        accentColor="#d4a24e"
      >
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          There&apos;s a shift in the air sometime in late September — subtle, almost imperceptible. 
          The monsoon loosens its grip, the sky turns a pale, luminous blue, and the afternoons grow 
          gentle with a coolness that wasn&apos;t there before. On the banks of the Ganga, kaash-phool 
          begins to sway in soft white waves, and in every lane, the first whispers begin: 
          <em className="text-[#d4a24e]"> &ldquo;Pujo asche.&rdquo;</em>
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          This is Agomoni — the arrival, the anticipation, the promise that something magnificent 
          is approaching. Somewhere in the distance, a lone dhak begins its rhythm, tentative at 
          first, then steady and insistent. It&apos;s the heartbeat of Bengal waking up, calling the 
          Goddess home. Shiuli flowers carpet the morning earth in white and orange, and the whole 
          city seems to hold its breath.
        </motion.p>
        <motion.p
          className="text-[#14120e]/60 italic"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Every generation feels it — that tingle of something sacred and joyful about to unfold. 
          And so we wait, with hearts wide open, for the drums to grow louder.
        </motion.p>
      </ChapterSection>

      {/* ── Chapter 2: The Making ────────────────────────────────── */}
      <ChapterSection
        chapterNumber="Chapter II"
        title="The Making"
        bengaliTitle="কুমারটুলি — Kumartuli"
        emotion="Craft & Patience"
        accentColor="#c83a1a"
        invertedBg
      >
        <motion.p
          className="text-[#e5e0d3]/85"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Months before the first dhak beat, in the narrow lanes of Kumartuli, hands caked in 
          Ganga clay begin to sculpt divinity. Straw frames sprout ribs and limbs; clay becomes 
          flesh; hollow eye sockets are painted open with a single brushstroke that feels like 
          an act of invocation. These artisans — some carrying the craft through five, six 
          generations — breathe life into Ma Durga, Lakshmi, Saraswati, Kartik, Ganesh.
        </motion.p>
        <motion.p
          className="text-[#e5e0d3]/85"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Across the city, pandal committees race against time. Bamboo skeletons rise on street 
          corners, draped in fabric and ambition. Theme pandals push boundaries year after year — 
          an Egyptian temple one block, a spaceship the next, all held together by wires, devotion, 
          and last-minute miracles. The sawing, hammering, and painting go on through sleepless 
          nights, fuelled by cups of cha and the collective pride of a neighbourhood.
        </motion.p>
        <motion.p
          className="text-[#e5e0d3]/55 italic"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Every pandal is a love letter written in bamboo and light. Every idol, a prayer 
          in clay. The making is as sacred as the worship — perhaps more.
        </motion.p>
      </ChapterSection>

      {/* ── Chapter 3: The Homecoming ────────────────────────────── */}
      <ChapterSection
        chapterNumber="Chapter III"
        title="The Homecoming"
        bengaliTitle="ঘরে ফেরা — Ghore Phera"
        emotion="Nostalgia & Belonging"
        accentColor="#d4a24e"
      >
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Trains fill up. Flights get booked out months in advance. The highways leading to 
          Kolkata swell with a tide of people coming home — not just to a city, but to a feeling. 
          <em> Pujo</em> is the great gravitational force of Bengal: it pulls you back no matter 
          where you&apos;ve gone, no matter how far life has taken you.
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Homes buzz with preparation. Wardrobes are flung open, new saris pressed and hung, 
          kurtas laid out with quiet pride. Children try on new shoes and practise their best 
          poses for the family photograph. Mothers stock up on sweets; grandmothers supervise the 
          kitchen with an authority that admits no argument. There&apos;s luchi and aloor dom for 
          breakfast, and the whole house smells of dhoop and Chanel No. 5 in equal measure.
        </motion.p>
        <motion.p
          className="text-[#14120e]/60 italic"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          The neighbourhood uncle starts testing his sound system at 6 AM. The colony kids 
          form gangs that will roam the pandals till midnight. In every doorway, someone is 
          waiting for someone to arrive. Pujo doesn&apos;t just bring a goddess home — it 
          brings all of us home to each other.
        </motion.p>
      </ChapterSection>

      {/* ── Chapter 4: The Celebration ───────────────────────────── */}
      <ChapterSection
        chapterNumber="Chapter IV"
        title="The Celebration"
        bengaliTitle="উৎসব — Utsav"
        emotion="Joy"
        accentColor="#c83a1a"
      >
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          And then it begins. The five days that Bengalis live the other three hundred and sixty 
          for. Shashti, Saptami, Ashtami, Navami, Dashami — each with its own rhythm, its own 
          flavour, its own pitch of joy. The dhak is relentless now, filling the streets with a 
          primal thunder that makes your ribs vibrate.
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Dhunuchi naach at sandhya aarti — smoke swirling around dancers who move as if possessed, 
          coconut-husk incense burners held aloft, sparks rising into the evening sky. The priest&apos;s 
          chant mingles with the clash of <em>kaansar ghanta</em> and the collective 
          ululation of a hundred voices. The bhog is served — khichuri, labra, begun bhaja, payesh — 
          every spoonful a communion.
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Between pandal-hops you eat jhalmuri from paper cones, get your face painted, 
          and bump into old schoolmates you haven&apos;t seen in years. The adda at the 
          pandal corner stretches past midnight — politics, poetry, football, the new 
          Satyajit Ray restoration, that incredible lighting installation three blocks away. 
          Pujo dissolves every boundary: age, class, routine. For five days, Kolkata becomes 
          the most democratic party on Earth.
        </motion.p>
      </ChapterSection>

      {/* ── Chapter 5: The Farewell (Bijoya) ─────────────────────── */}
      <ChapterSection
        chapterNumber="Chapter V"
        title="The Farewell"
        bengaliTitle="বিজয়া দশমী — Bijoya Dashami"
        emotion="Bittersweet Longing"
        accentColor="#d4a24e"
        invertedBg
      >
        <motion.p
          className="text-[#e5e0d3]/85"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          Dashami arrives too soon. It always does. The morning begins with sindoor khela — 
          married women smearing each other&apos;s faces and hair with vermillion, their 
          laughter edged with the sadness of goodbye. Red clouds the air. Red stains white 
          saris. Red on cheeks, red on foreheads, red on the tips of fingers that reach toward 
          Ma&apos;s face one last time.
        </motion.p>
        <motion.p
          className="text-[#e5e0d3]/85"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          The immersion procession begins in the afternoon. Idols sway on trucks garlanded 
          with marigold, trailing drumbeats and dancers who refuse to let go. At the ghat, 
          Ma is lowered into the river — slowly, tenderly — and for a moment, the whole world 
          holds still. The water accepts her. The drums stop. A silence heavier than any sound 
          settles over the crowd.
        </motion.p>
        <motion.div
          className="flex items-center gap-3 pt-4"
          variants={fadeUp}
          initial={prefersReduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
        >
          <DiyaMotif className="opacity-60 flex-shrink-0" />
          <p className="text-[#d4a24e] font-serif italic text-lg sm:text-xl leading-relaxed">
            &ldquo;Ashche bochor abar hobe&rdquo; — she will return next year. 
            She always does. And so, we wait again.
          </p>
        </motion.div>
      </ChapterSection>

      {/* ── Chapter 6: The Event ─────────────────────────────────── */}
      <section
        id="the-event"
        className="relative w-full bg-[#e5e0d3] text-[#14120e] border-b border-[#14120e]/15"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-32">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#c83a1a] block mb-3">
              ✦ The Event
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
                icon: "📅",
              },
              {
                label: "Time",
                /* TODO: Replace with confirmed timing */
                value: "TBA",
                icon: "🕐",
                placeholder: true,
              },
              {
                label: "Venue",
                /* TODO: Replace with confirmed venue */
                value: "RCCIIT Campus",
                icon: "📍",
                placeholder: true,
              },
              {
                label: "Hosted By",
                value: "RCC Talkies × Art & Cultural Club",
                icon: "🎭",
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
                <span className="text-2xl block">{item.icon}</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block">
                  {item.label}
                </span>
                <span className={`font-display-serif text-lg sm:text-xl text-[#14120e] block ${item.placeholder ? "italic text-[#14120e]/50" : ""}`}>
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
              {/* TODO: Replace with final schedule */}
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
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-base sm:text-lg uppercase tracking-tight px-10 py-4 hover:bg-[#c83a1a] transition-colors duration-300"
            >
              Register to Participate →
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
