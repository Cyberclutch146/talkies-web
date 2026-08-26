"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Highlight {
  title: string;
  blurb: string;
}

interface YearData {
  year: number;
  highlights: Highlight[];
}

interface EventCardProps {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  years: YearData[];
}

export function EventCard({
  name,
  shortName,
  tagline,
  description,
  years,
}: EventCardProps) {
  const [activeYear, setActiveYear] = useState(years[0]?.year ?? 2025);
  const activeData = years.find((y) => y.year === activeYear);

  return (
    <div className="border border-rule">
      {/* Event Header */}
      <div className="p-6 sm:p-8 border-b border-rule">
        <span className="inline-block bg-red text-cream text-[10px] font-body font-bold uppercase tracking-widest px-2 py-0.5 mb-3">
          {tagline}
        </span>
        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink mb-2">
          {name}
        </h3>
        <p className="text-sm text-muted leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {/* Year Selector */}
      <div className="flex border-b border-rule">
        {years.map((y) => (
          <button
            key={y.year}
            onClick={() => setActiveYear(y.year)}
            className={`flex-1 py-3 text-sm font-body font-medium uppercase tracking-wider transition-colors border-r border-rule last:border-r-0 ${
              activeYear === y.year
                ? "bg-ink text-cream"
                : "bg-cream text-muted hover:text-ink"
            }`}
          >
            {y.year}
          </button>
        ))}
      </div>

      {/* Highlights */}
      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-rule"
          >
            {activeData.highlights.map((h, i) => (
              <div key={i} className="p-5 sm:p-6">
                <h4 className="font-display text-lg text-ink mb-2">
                  {h.title}
                </h4>
                <p className="text-sm text-muted leading-relaxed">{h.blurb}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
