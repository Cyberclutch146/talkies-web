"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { NewsCard } from "@/components/NewsCard";
import { MemberCard } from "@/components/MemberCard";
import { DeskStrip } from "@/components/DeskStrip";
import siteData from "@/data/site.json";
import teamData from "@/data/team.json";
import pubsData from "@/data/publications.json";
import eventsData from "@/data/events.json";

/* ─── Icon map for Focus Areas ─── */
const iconMap: Record<string, React.ReactNode> = {
  newspaper: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>
  ),
  mic: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  ),
  camera: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
  ),
  book: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  share: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </svg>
  ),
  trophy: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.27.308 6.023 6.023 0 0 1-2.27-.308" />
    </svg>
  ),
};

/* ─── Animated Counter ─── */
function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <span className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream block">
        {value}
      </span>
      <span className="text-xs text-cream/60 uppercase tracking-[0.2em] font-body mt-2 block">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  /* Featured news from latest event highlights */
  const latestEvent = eventsData.flagship[0];
  const featuredNews = latestEvent.years[0].highlights.map((h) => ({
    tag: latestEvent.shortName,
    title: h.title,
    blurb: h.blurb,
    date: `${latestEvent.years[0].year}`,
  }));

  /* Preview team — first 6 core members */
  const previewTeam = teamData.core.slice(0, 6);

  return (
    <>
      <DeskStrip />

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16"
        >
          {/* Dateline */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-red" />
            <span className="text-xs text-muted uppercase tracking-[0.3em] font-body">
              Est. {siteData.established} · {siteData.college.shortName}
            </span>
          </div>

          {/* Masthead */}
          <h1 className="font-display text-[15vw] sm:text-[12vw] lg:text-[10vw] xl:text-[9vw] leading-[0.85] text-ink mb-4">
            RCC
            <br />
            TALKIES
          </h1>

          <div className="h-px bg-rule w-full my-6" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <p className="text-lg sm:text-xl text-muted font-body italic max-w-md">
              &ldquo;{siteData.tagline}&rdquo;
            </p>
            <p className="text-xs text-muted uppercase tracking-widest font-body">
              The Official Journalism Club
            </p>
          </div>
        </motion.div>

        {/* Decorative red bar */}
        <div className="h-1 bg-red" />
      </section>

      {/* ═══════════ FEATURED NEWS ═══════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:pl-16">
        <ScrollReveal>
          <SectionHeading title="Latest Headlines" tag="Breaking" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule">
          {featuredNews.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <NewsCard {...item} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════ ABOUT / FOCUS AREAS ═══════════ */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:pl-16">
          <ScrollReveal>
            <SectionHeading title="What We Do" tag="About" />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.focusAreas.map((area, i) => (
              <ScrollReveal key={area.title} delay={i * 0.08}>
                <div className="border border-rule p-6 group hover:border-red transition-colors">
                  <div className="text-muted group-hover:text-red transition-colors mb-4">
                    {iconMap[area.icon] || null}
                  </div>
                  <h3 className="font-display text-xl text-ink mb-2">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COLLEGE STATS ═══════════ */}
      <section className="border-t border-rule bg-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">
              {siteData.college.stats.map((stat) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </div>
            <p className="text-center text-cream/40 text-xs uppercase tracking-widest mt-8 font-body">
              {siteData.college.name} — Affiliated with {siteData.college.affiliation}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════ LATEST EDITIONS ═══════════ */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:pl-16">
          <ScrollReveal>
            <SectionHeading title="Editions" tag="Publications" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pubsData.magazines.map((mag, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <a
                  href={mag.link}
                  className="block border border-rule p-6 sm:p-8 group hover:border-red transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block bg-red text-cream text-[10px] font-body font-bold uppercase tracking-widest px-2 py-0.5 mb-3">
                        {mag.volume}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl text-ink group-hover:text-red transition-colors">
                        {mag.title}
                      </h3>
                    </div>
                    <span className="text-3xl sm:text-4xl font-display text-rule group-hover:text-red/30 transition-colors shrink-0">
                      {mag.year}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mt-3">
                    {mag.description}
                  </p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TEAM PREVIEW ═══════════ */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:pl-16">
          <ScrollReveal>
            <SectionHeading title="Core Team" tag="People" />
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {previewTeam.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.06}>
                <MemberCard name={member.name} role={member.role} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-8 text-center">
              <Link
                href="/members"
                className="inline-flex items-center gap-2 text-sm font-body font-medium uppercase tracking-widest text-muted hover:text-red transition-colors border-b border-rule hover:border-red pb-1"
              >
                View All Members
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="bg-red">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream mb-4">
              Join RCC Talkies
            </h2>
            <p className="text-cream/80 text-base sm:text-lg max-w-xl mx-auto mb-8 font-body">
              Be part of the voice that shapes campus culture. Write, report,
              photograph, design — find your desk.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-cream text-red font-body font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-ink hover:text-cream transition-colors"
            >
              Get In Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
