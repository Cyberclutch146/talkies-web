"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

/* ─── Floating Shiuli Petals (decorative background particles) ── */
function FloatingPetals() {
  const prefersReduced = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 12,
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
        drift: -30 + Math.random() * 60,
        opacity: 0.06 + Math.random() * 0.08,
      })),
    []
  );

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 1.6,
            background: `radial-gradient(ellipse at center, #d4a24e ${30}%, #c83a1a ${100}%)`,
            opacity: p.opacity,
            rotate: p.rotation,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift, -p.drift / 2, p.drift / 3],
            rotate: [p.rotation, p.rotation + 360],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" },
            x: { duration: p.duration * 0.7, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
            rotate: { duration: p.duration * 1.5, repeat: Infinity, delay: p.delay, ease: "linear" },
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated rotating seal ring ───────────────────────────── */
function SealRing({ size = 180 }: { size?: number }) {
  const prefersReduced = useReducedMotion();
  const r = size / 2 - 8;
  const circumference = 2 * Math.PI * r;
  const dashArray = `${circumference / 40} ${circumference / 60}`;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0"
      animate={prefersReduced ? {} : { rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#d4a24e"
        strokeWidth="1"
        strokeDasharray={dashArray}
        opacity={0.3}
      />
    </motion.svg>
  );
}

/* ─── Organiser Contacts ─────────────────────────────────────── */
const CONTACTS = [
  { name: "Meghna Santra", role: "President, Art & Cultural Club", phone: "+91 93307 34507" },
  { name: "Soumyajit Samanta", role: "President, RCC Talkies", phone: "+91 70031 40676" },
  { name: "Swagata Ganguly", role: "Secretary, RCC Talkies", phone: "+91 96744 15363" },
  { name: "Kasturi Bhattacharya", role: "Secretary, Art & Cultural Club", phone: "+91 91431 91144" },
];

/* ─── Fade-up variant ────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

/* ─── Registration Closed UI ─────────────────────────────────── */
export function ParticipationForm() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="participate"
      className="relative w-full bg-[#14120e] text-[#e5e0d3] overflow-hidden"
      style={{ colorScheme: "dark" }}
    >
      {/* Full-section আগমনী watermark */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden font-bengali-serif text-6xl sm:text-7xl lg:text-8xl text-[#d4a24e]"
        aria-hidden="true"
        style={{ lineHeight: 1.15, letterSpacing: "0.05em", wordBreak: "break-all" }}
      >
        {"আগমনী ".repeat(500)}
      </div>

      {/* Floating petals */}
      {mounted && <FloatingPetals />}

      {/* Radial glow behind seal */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,162,78,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-20 sm:py-32 lg:py-40">
        {/* ── Central Seal & Closed Notice ────────────────────── */}
        <div className="flex flex-col items-center text-center">
          {/* Animated Seal */}
          <motion.div
            className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <SealRing size={208} />
            <div className="absolute inset-3 sm:inset-4 rounded-full border border-[#d4a24e]/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[#d4a24e]/60 text-lg mb-1" aria-hidden="true">❋</span>
              <span
                className="font-bengali-serif text-xl sm:text-2xl text-[#d4a24e] leading-none"
                lang="bn"
                aria-hidden="true"
                style={{ letterSpacing: 0, lineHeight: 1.5 }}
              >
                সমাপ্ত
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#e5e0d3]/40 font-bold mt-1.5">
                Sealed
              </span>
              <span className="text-[#d4a24e]/60 text-lg mt-1" aria-hidden="true">❋</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="font-display-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#faf6ee] tracking-tight leading-[0.9] mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            Registrations{" "}
            <span className="text-[#d4a24e]">Closed</span>
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            className="flex items-center justify-center gap-4 my-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#d4a24e]/40" />
            <span
              className="font-bengali-serif text-base sm:text-lg text-[#d4a24e]/50"
              lang="bn"
              aria-hidden="true"
              style={{ letterSpacing: 0 }}
            >
              শুভ আগমনী
            </span>
            <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#d4a24e]/40" />
          </motion.div>

          {/* Short message */}
          <motion.p
            className="font-serif text-base sm:text-lg text-[#e5e0d3]/50 max-w-md mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
          >
            All performance slots are filled. See you on stage.
          </motion.p>

          {/* ── Event Day Card ─────────────────────────────────── */}
          <motion.div
            className="inline-block mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
          >
            <div className="relative bg-[#1e1c18] border border-[#d4a24e]/15 rounded-2xl px-8 sm:px-14 py-8 sm:py-10 overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(212,162,78,0.06) 0%, transparent 60%)",
                }}
              />
              <div className="relative z-10 text-center">
                <span className="font-display-serif text-3xl sm:text-4xl lg:text-5xl text-[#faf6ee] block leading-tight">
                  9th October, 2026
                </span>
                <span className="font-serif italic text-sm text-[#e5e0d3]/40 block mt-2">
                  RCCIIT Auditorium
                </span>
                <motion.div
                  className="mx-auto mt-5 h-[2px] bg-gradient-to-r from-transparent via-[#d4a24e] to-transparent rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "80%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Contacts ─────────────────────────────────────────── */}
        <motion.div
          className="max-w-md mx-auto"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#d4a24e] mb-5 text-center">
            Contact the Organisers
          </h3>
          <div className="space-y-1">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={i}
                href={`tel:${c.phone.replace(/\s/g, "")}`}
                className="flex items-baseline justify-between gap-4 group py-3 border-b border-[#e5e0d3]/6 last:border-0"
                initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div>
                  <span className="font-display-serif text-base text-[#faf6ee] group-hover:text-[#d4a24e] transition-colors duration-300">
                    {c.name}
                  </span>
                  <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#e5e0d3]/25 mt-1">
                    {c.role}
                  </span>
                </div>
                <span className="font-serif text-sm text-[#d4a24e]/40 group-hover:text-[#d4a24e] transition-colors duration-300 whitespace-nowrap tabular-nums">
                  {c.phone}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
