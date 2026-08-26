"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import pubsData from "@/data/publications.json";

export default function MagazinePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeading title="Magazine" tag="Publications" />
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pubsData.magazines.map((mag, i) => (
          <ScrollReveal key={i} delay={i * 0.12}>
            <motion.a
              href={mag.link}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="block border border-rule group hover:border-red transition-colors"
            >
              {/* Cover placeholder */}
              <div className="aspect-[3/4] bg-cream-dark border-b border-rule flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-red text-cream text-[10px] font-body font-bold uppercase tracking-widest px-2 py-0.5">
                    {mag.volume}
                  </span>
                </div>
                <span className="font-display text-7xl sm:text-8xl text-rule/50 group-hover:text-red/20 transition-colors">
                  {mag.year}
                </span>
                <span className="font-display text-3xl sm:text-4xl text-ink mt-4 text-center">
                  {mag.title}
                </span>
                <span className="text-xs text-muted uppercase tracking-widest mt-3 font-body">
                  RCC Talkies Magazine
                </span>
              </div>

              {/* Info bar */}
              <div className="p-5 sm:p-6">
                <p className="text-sm text-muted leading-relaxed">
                  {mag.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted uppercase tracking-widest font-body group-hover:text-red transition-colors">
                  <span>Read Issue</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </motion.a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
