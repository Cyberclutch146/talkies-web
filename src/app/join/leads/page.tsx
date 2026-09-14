"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DecryptedText from "@/components/DecryptedText";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function LeadsJoinPage() {
  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ── Inverted Banner ── */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              RECRUITMENT // LEADERSHIP
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="LEAD APPLICATION"
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
            The leadership recruitment window has concluded for this academic year.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 border-b border-[#14120e]/20">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#14120e]/60">
          <Link href="/join" className="hover:text-[#c83a1a] transition-colors">← Back to Recruitment</Link>
          <span>·</span>
          <span className="text-[#c83a1a] font-bold">LEADS — CLOSED</span>
        </div>
      </div>

      {/* ── Closed Notice ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <motion.div
          className="max-w-3xl mx-auto border-2 border-[#14120e] bg-[#eae5d9] relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {/* Decorative top bar */}
          <div className="w-full h-1.5 bg-[#c83a1a]" />

          {/* Repeating watermark */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none select-none overflow-hidden flex flex-wrap content-start">
            {Array.from({ length: 120 }).map((_, i) => (
              <span key={i} className="font-gothic text-4xl leading-[0.85] text-[#14120e]">CLOSED </span>
            ))}
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center">
            {/* Seal */}
            <motion.div
              className="mx-auto mb-6 w-20 h-20 rounded-full border-[3px] border-[#14120e] flex items-center justify-center"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            >
              <span className="font-gothic text-2xl text-[#c83a1a]">✦</span>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#c83a1a] font-bold block mb-3">
                LEADERSHIP RECRUITMENT — CONCLUDED
              </span>
              <h2 className="font-gothic text-4xl sm:text-5xl lg:text-6xl text-[#14120e] leading-[0.95] mb-4">
                Applications are Closed
              </h2>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-3 my-6"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            >
              <div className="w-12 h-[1px] bg-[#14120e]/25" />
              <span className="font-serif italic text-xs text-[#14120e]/50">Session 2025</span>
              <div className="w-12 h-[1px] bg-[#14120e]/25" />
            </motion.div>

            <motion.p
              className="font-serif text-base sm:text-lg text-[#14120e]/75 leading-relaxed max-w-lg mx-auto mb-6"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            >
              The editorial board hath concluded its search for desk leaders this session. 
              We thank thee for thine interest and encourage thee to apply when the gates reopen next year.
            </motion.p>

            <motion.div
              className="bg-[#14120e] inline-block px-8 py-5 mb-8"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            >
              <span className="font-gothic text-2xl sm:text-3xl text-[#e5e0d3] block">
                Please Apply Next Year
              </span>
              <span className="font-serif italic text-xs text-[#e5e0d3]/50 block mt-1">
                Recruitment reopens with the new academic session
              </span>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
            >
              <Link
                href="/join"
                className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-base uppercase tracking-tight px-8 py-3 hover:bg-[#c83a1a] transition-colors"
              >
                ← BACK TO RECRUITMENT
              </Link>
              <Link
                href="/"
                className="inline-block border-2 border-[#14120e] text-[#14120e] font-display text-base uppercase tracking-tight px-8 py-3 hover:bg-[#14120e] hover:text-[#e5e0d3] transition-colors"
              >
                RETURN HOME →
              </Link>
            </motion.div>
          </div>

          <div className="w-full h-1.5 bg-[#c83a1a]" />
        </motion.div>
      </div>
    </div>
  );
}
