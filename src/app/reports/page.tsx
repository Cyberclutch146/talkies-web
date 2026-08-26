"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import pubsData from "@/data/publications.json";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeading title="Reports" tag="Event Coverage" />
      </ScrollReveal>

      <p className="text-muted text-sm leading-relaxed max-w-2xl mb-10">
        Detailed coverage and analysis of major events at RCCIIT, compiled by
        the RCC Talkies reporting desk.
      </p>

      <div className="space-y-4">
        {pubsData.reports.map((report, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <motion.a
              href={report.link}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-rule p-5 sm:p-6 group hover:border-red transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-display text-xl sm:text-2xl text-ink group-hover:text-red transition-colors">
                  {report.title}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-body font-bold uppercase tracking-widest text-muted bg-cream-light border border-rule px-2 py-0.5">
                    {report.event}
                  </span>
                  <span className="text-xs text-muted">{report.year}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-widest font-body group-hover:text-red transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>View PDF</span>
              </div>
            </motion.a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
