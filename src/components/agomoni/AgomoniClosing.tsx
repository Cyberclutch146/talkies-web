"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─── Closing Credits ─────────────────────────────────────────── */

export function AgomoniClosing() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative w-full bg-[#14120e] text-[#e5e0d3] overflow-hidden">

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
        {/* Ornamental divider */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={prefersReduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-12 h-px bg-[#d4a24e]/40" />
          <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
            <ellipse cx="20" cy="10" rx="4" ry="7" fill="#d4a24e" opacity="0.8" />
            <ellipse cx="20" cy="11" rx="2" ry="4" fill="#faf6ee" opacity="0.6" />
            <path d="M12 22 Q14 18, 20 18 Q26 18, 28 22 L30 30 Q20 34, 10 30 Z" fill="#c83a1a" opacity="0.7" />
          </svg>
          <span className="w-12 h-px bg-[#d4a24e]/40" />
        </motion.div>

        {/* Bengali greeting */}
        <motion.p
          className="font-bengali-serif text-2xl sm:text-3xl text-[#d4a24e] mb-2"
          lang="bn"
          aria-hidden="true"
          style={{ letterSpacing: 0, lineHeight: 1.5 }}
          initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          শুভ শারদীয়া
        </motion.p>

        {/* Title */}
        <motion.h2
          className="font-display-serif text-2xl sm:text-4xl text-[#faf6ee] tracking-tight mb-6"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Organised With Love
        </motion.h2>

        {/* Organisers */}
        <motion.div
          className="space-y-6 mb-12"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-[#e5e0d3]/15 p-6 sm:p-8 space-y-2 hover:border-[#d4a24e]/40 transition-colors rounded-2xl">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#d4a24e] block">
                Media &amp; Publicity
              </span>
              <span className="font-gothic text-xl sm:text-2xl text-[#faf6ee] block">
                The RCC Talkies
              </span>
              <p className="font-serif italic text-xs text-[#e5e0d3]/50">
                The official journalism &amp; media society of RCCIIT
              </p>
            </div>
            <div className="border border-[#e5e0d3]/15 p-6 sm:p-8 space-y-2 hover:border-[#d4a24e]/40 transition-colors rounded-2xl">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#c83a1a] block">
                Cultural Programming
              </span>
              <span className="font-display-serif text-xl sm:text-2xl text-[#faf6ee] block">
                Art &amp; Cultural Club
              </span>
              <p className="font-serif italic text-xs text-[#e5e0d3]/50">
                RCC Institute of Information Technology, Kolkata
              </p>
            </div>
          </div>
        </motion.div>

        {/* Photo Credits */}
        <motion.div
          className="mb-10"
          initial={prefersReduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#e5e0d3]/30 block mb-3">
            Photo Credits
          </span>
          <p className="font-serif italic text-xs text-[#e5e0d3]/40 max-w-lg mx-auto leading-relaxed">
            All photographs used on this page are sourced from Unsplash under
            the Unsplash License (free for commercial and non-commercial use).
            We thank the photographers for sharing their work.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="space-y-4 mb-10"
          initial={prefersReduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#e5e0d3]/50 block">
            Get In Touch
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-serif">
            <a
              href="mailto:rcctalkies@gmail.com"
              className="text-[#d4a24e] underline underline-offset-4 hover:text-[#c83a1a] transition-colors"
            >
              rcctalkies@gmail.com
            </a>
            <span className="hidden sm:inline text-[#e5e0d3]/30">&bull;</span>
            <a
              href="https://www.instagram.com/rcc_talkies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4a24e] underline underline-offset-4 hover:text-[#c83a1a] transition-colors"
            >
              @rcc_talkies
            </a>
          </div>
        </motion.div>

        {/* Closing line — Bengali */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={prefersReduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#d4a24e]/30" />
            <p className="font-bengali-serif italic text-lg sm:text-xl text-[#d4a24e]/70" lang="bn" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
              আসছে বছর আবার হবে
            </p>
            <span className="w-8 h-px bg-[#d4a24e]/30" />
          </div>
          <p className="font-serif italic text-sm text-[#e5e0d3]/30">
            She will return next year. She always does.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
