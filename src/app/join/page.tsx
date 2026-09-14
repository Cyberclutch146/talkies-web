"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DecryptedText from "@/components/DecryptedText";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function JoinPage() {
  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ── Inverted Black Header Banner ── */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              RECRUITMENT // STATUS
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="RECRUITMENT"
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                revealDirection="center"
                className="text-[#e5e0d3]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/70 max-w-sm italic">
            The editorial board thanks all applicants for their interest in RCC Talkies.
          </p>
        </div>
      </section>

      {/* ── Central "Closed" Notice ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 lg:py-32">
        <motion.div
          className="relative border-2 border-[#14120e] bg-[#eae5d9] overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
        >
          {/* Decorative repeating background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex flex-wrap content-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <span key={i} className="font-gothic text-5xl leading-[0.85] text-[#14120e]">CLOSED </span>
            ))}
          </div>

          {/* Top decorative border bar */}
          <div className="w-full h-2 bg-[#c83a1a]" />

          <div className="relative z-10 px-6 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-24 text-center">
            {/* Seal / Emblem */}
            <motion.div
              className="mx-auto mb-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#14120e] flex items-center justify-center relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <div className="absolute inset-2 rounded-full border-2 border-[#14120e]/30" />
              <div className="text-center">
                <span className="font-gothic text-3xl sm:text-4xl text-[#c83a1a] block leading-none">✦</span>
                <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#14120e]/70 font-bold mt-1 block">
                  SEALED
                </span>
              </div>
            </motion.div>

            {/* Main Gothic Title */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#c83a1a] font-bold block mb-4">
                OFFICIAL NOTICE FROM THE EDITORIAL BOARD
              </span>
              <h2 className="font-gothic text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-[#14120e] leading-[0.9] mb-6">
                Applications are Closed
              </h2>
            </motion.div>

            {/* Decorative divider */}
            <motion.div
              className="flex items-center justify-center gap-4 my-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
            >
              <div className="w-16 sm:w-24 h-[1px] bg-[#14120e]/30" />
              <span className="font-serif italic text-sm sm:text-base text-[#14120e]/50">Anno Domini 2025</span>
              <div className="w-16 sm:w-24 h-[1px] bg-[#14120e]/30" />
            </motion.div>

            {/* Message */}
            <motion.div
              className="max-w-2xl mx-auto space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
            >
              <p className="font-serif text-lg sm:text-xl lg:text-2xl text-[#14120e]/80 leading-relaxed">
                The recruitment window for the current academic session hath concluded. 
                All positions — both leadership and team member roles — are no longer accepting applications.
              </p>
              <p className="font-serif text-base sm:text-lg text-[#14120e]/65 leading-relaxed">
                We extend our sincerest gratitude to all who expressed interest in joining our editorial fellowship. 
                Pray return when the next recruitment cycle commences.
              </p>
            </motion.div>

            {/* "Apply Next Year" highlight */}
            <motion.div
              className="mt-12 inline-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={4}
            >
              <div className="bg-[#14120e] px-8 sm:px-12 py-6 sm:py-8 border-2 border-[#14120e]">
                <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#c83a1a] font-bold block mb-2">
                  MARK YOUR CALENDARS
                </span>
                <span className="font-gothic text-3xl sm:text-4xl lg:text-5xl text-[#e5e0d3] block leading-tight">
                  Please Apply Next Year
                </span>
                <span className="font-serif italic text-sm text-[#e5e0d3]/60 block mt-2">
                  Recruitment reopens with the new academic session
                </span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={5}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#14120e] text-[#e5e0d3] font-display text-base sm:text-lg uppercase tracking-tight px-8 py-3 hover:bg-[#c83a1a] transition-colors"
              >
                ← RETURN HOME
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-[#14120e] text-[#14120e] font-display text-base sm:text-lg uppercase tracking-tight px-8 py-3 hover:bg-[#14120e] hover:text-[#e5e0d3] transition-colors"
              >
                CONTACT US →
              </Link>
            </motion.div>
          </div>

          {/* Bottom decorative border bar */}
          <div className="w-full h-2 bg-[#c83a1a]" />
        </motion.div>
      </div>

      {/* ── Bottom Info Strip ── */}
      <section className="w-full border-t border-[#14120e]/20 bg-[#ded8c7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="font-display text-3xl text-[#14120e]">25+</span>
            <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 mt-1">Years of Legacy</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <span className="font-display text-3xl text-[#14120e]">11</span>
            <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 mt-1">Editorial Desks</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <span className="font-display text-3xl text-[#c83a1a]">CLOSED</span>
            <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 mt-1">Recruitment Status</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
