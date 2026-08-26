"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { EventCard } from "@/components/EventCard";
import eventsData from "@/data/events.json";

type TabKey = "got" | "techtrix" | "regalia" | "external";

const tabs: { key: TabKey; label: string }[] = [
  { key: "got", label: "GOT" },
  { key: "techtrix", label: "TechTrix" },
  { key: "regalia", label: "Regalia" },
  { key: "external", label: "External" },
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("got");
  const activeEvent = eventsData.flagship.find((e) => e.slug === activeTab);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeading title="Events" tag="Archive" />
      </ScrollReveal>

      {/* Tab bar */}
      <div className="flex border border-rule mb-10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex-1 min-w-[100px] py-3 px-4 text-sm font-body font-medium uppercase tracking-wider text-center transition-colors border-r border-rule last:border-r-0 ${
              activeTab === tab.key
                ? "bg-ink text-cream"
                : "bg-cream text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flagship event */}
      {activeTab !== "external" && activeEvent && (
        <ScrollReveal key={activeEvent.slug}>
          <EventCard
            name={activeEvent.name}
            shortName={activeEvent.shortName}
            tagline={activeEvent.tagline}
            description={activeEvent.description}
            years={activeEvent.years}
          />
        </ScrollReveal>
      )}

      {/* External events */}
      {activeTab === "external" && (
        <div className="space-y-4">
          {eventsData.external.map((event, i) => (
            <ScrollReveal key={event.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="border border-rule p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 group hover:border-red transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-display text-xl text-ink group-hover:text-red transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mt-1">
                    {event.description}
                  </p>
                </div>
                <span className="text-[10px] font-body font-bold uppercase tracking-widest text-muted bg-cream-light border border-rule px-3 py-1 shrink-0 self-start">
                  External
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
