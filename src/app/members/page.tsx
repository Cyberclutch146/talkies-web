"use client";

import { useState } from "react";
import Image from "next/image";
import teamData from "@/data/team.json";
import SpotlightCard from "@/components/SpotlightCard";
import DecryptedText from "@/components/DecryptedText";

interface TeamMember {
  name: string;
  role: string;
  photo: string | null;
}

interface TeamYear {
  year: string;
  label: string;
  core: TeamMember[];
  website: TeamMember[];
  faculty: TeamMember[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const photoSrc = member.photo || "/team/placeholder.jpg";

  return (
    <SpotlightCard
      className="group p-0 flex flex-col h-full transition-all duration-500 hover:shadow-[6px_6px_0px_#14120e] hover:-translate-y-1 hover:border-[#c83a1a]"
      spotlightColor="rgba(200, 58, 26, 0.15)"
    >
      {/* Photo Area */}
      <div className="relative w-full aspect-[4/5] bg-[#dad4c3] overflow-hidden border-b border-[#14120e]/15">
        <Image
          src={photoSrc}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Number badge */}
        <div className="absolute top-2 right-2 bg-[#14120e] text-[#e5e0d3] text-[10px] font-sans font-bold px-1.5 py-0.5 tracking-wider">
          #{String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-base sm:text-lg uppercase tracking-tight text-[#14120e] leading-tight mb-1">
            {member.name}
          </h3>
          <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-[#14120e]/60 font-semibold">
            {member.role}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );
}

function FacultyCard({ member }: { member: TeamMember }) {
  const photoSrc = member.photo || "/team/placeholder.jpg";

  return (
    <SpotlightCard
      className="group p-0 flex flex-row items-center gap-0 transition-all duration-500 hover:shadow-[6px_6px_0px_#14120e] hover:-translate-y-1 hover:border-[#c83a1a]"
      spotlightColor="rgba(200, 58, 26, 0.1)"
    >
      {/* Photo */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-[#dad4c3] overflow-hidden border-r border-[#14120e]/15">
        <Image
          src={photoSrc}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="96px"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex-1">
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#c83a1a] block mb-1">
          ADVISORY BOARD
        </span>
        <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-[#14120e] leading-tight mb-0.5">
          {member.name}
        </h3>
        <p className="text-[11px] font-sans uppercase tracking-widest text-[#14120e]/60 font-semibold">
          {member.role}
        </p>
      </div>
    </SpotlightCard>
  );
}

export default function MembersPage() {
  const years = teamData.years as TeamYear[];
  const [activeYearIdx, setActiveYearIdx] = useState(0);
  const activeYear = years[activeYearIdx];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] py-8 sm:py-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-2">
            THE NEWSROOM & EDITORIAL BOARD
          </span>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3] mb-4">
            <DecryptedText
              text="OUR TEAM"
              animateOn="view"
              speed={40}
              maxIterations={8}
              sequential={true}
              revealDirection="center"
              className="text-[#e5e0d3]"
              encryptedClassName="text-[#c83a1a]"
            />
          </h1>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/60 max-w-lg">
            Writers, photojournalists, graphic designers, web developers, and mentors powering the Voice of RCCIIT.
          </p>
        </div>
      </section>

      {/* Academic Year Tabs */}
      <div className="w-full border-b border-[#14120e]/20 bg-[#eae5d9]/50 sticky top-[53px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-0">
          {years.map((yr, idx) => (
            <button
              key={yr.year}
              onClick={() => setActiveYearIdx(idx)}
              className={`py-4 px-5 sm:px-8 font-sans text-xs sm:text-sm uppercase tracking-[0.15em] font-bold border-b-2 transition-colors ${
                activeYearIdx === idx
                  ? "border-[#c83a1a] text-[#14120e]"
                  : "border-transparent text-[#14120e]/50 hover:text-[#14120e]/80"
              }`}
            >
              {yr.label}
            </button>
          ))}
          <div className="ml-auto hidden sm:flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-[#14120e]/50">
            <span className="w-2 h-2 bg-[#c83a1a] rounded-full" />
            {activeYear.core.length + activeYear.website.length + activeYear.faculty.length} MEMBERS
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-14 sm:space-y-20">
        {/* 1. Core Members */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 border-b border-[#14120e]/20 pb-3">
            <h2 className="font-pirata text-4xl sm:text-5xl lg:text-6xl text-[#14120e]">
              <DecryptedText
                text="01 // Core Members"
                animateOn="view"
                speed={30}
                maxIterations={6}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-2xl"
              />
            </h2>
            <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
              {activeYear.core.length} MEMBERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {activeYear.core.map((member, i) => (
              <MemberCard key={`${activeYear.year}-${member.name}`} member={member} index={i} />
            ))}
          </div>
        </section>

        {/* 2. Website Builders */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 border-b border-[#14120e]/20 pb-3">
            <h2 className="font-pirata text-4xl sm:text-5xl lg:text-6xl text-[#14120e]">
              <DecryptedText
                text="02 // Website Builders"
                animateOn="view"
                speed={30}
                maxIterations={6}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-2xl"
              />
            </h2>
            <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
              DIGITAL ARCHITECTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {activeYear.website.map((builder, i) => (
              <MemberCard key={`${activeYear.year}-web-${builder.name}`} member={builder} index={i} />
            ))}
          </div>
        </section>

        {/* 3. Faculty Advisors */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 border-b border-[#14120e]/20 pb-3">
            <h2 className="font-pirata text-4xl sm:text-5xl lg:text-6xl text-[#14120e]">
              <DecryptedText
                text="03 // Faculty Advisors"
                animateOn="view"
                speed={30}
                maxIterations={6}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-2xl"
              />
            </h2>
            <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
              RCCIIT MENTORS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {activeYear.faculty.map((fac) => (
              <FacultyCard key={`${activeYear.year}-fac-${fac.name}`} member={fac} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
