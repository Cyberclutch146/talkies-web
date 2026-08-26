"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MemberCard } from "@/components/MemberCard";
import teamData from "@/data/team.json";

const sections = [
  { key: "core" as const, title: "Core Members", tag: "Team" },
  { key: "website" as const, title: "Website Builders", tag: "Web Team" },
  { key: "faculty" as const, title: "Faculty Advisors", tag: "Faculty" },
];

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {sections.map((section, sectionIdx) => (
        <div key={section.key} className={sectionIdx > 0 ? "mt-20" : ""}>
          <ScrollReveal>
            <SectionHeading title={section.title} tag={section.tag} />
          </ScrollReveal>

          <div
            className={`grid gap-4 ${
              section.key === "core"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                : section.key === "website"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {teamData[section.key].map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.04}>
                <MemberCard name={member.name} role={member.role} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
