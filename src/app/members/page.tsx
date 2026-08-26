"use client";

import { useState } from "react";
import teamData from "@/data/team.json";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MembersPage() {
  const [activeDesk, setActiveDesk] = useState<string>("ALL");

  const desks = ["ALL", "CORE", "WEB TEAM", "FACULTY"];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] py-6 sm:py-10 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              THE NEWSROOM & EDITORIAL BOARD
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              OUR TEAM
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/70 max-w-sm">
            Writers, photojournalists, graphic designers, web developers, and mentors powering the Voice of RCCIIT.
          </p>
        </div>
      </section>

      {/* Manifesto Statement (Image 2 style) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 border-b border-[#14120e]/20">
        <div className="flex items-start gap-4">
          <span className="font-serif text-2xl sm:text-3xl text-[#14120e] select-none">
            ✖ ✖ ✖
          </span>
          <p className="font-serif text-xl sm:text-2xl text-[#14120e] leading-snug">
            Meet the active students and faculty coordinators dedicated to fearless campus reporting, creative arts, and archival journalism at RCCIIT.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
        {/* 1. Core Leadership & Members */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-[#14120e]/20 pb-3">
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#14120e]">
              01 // CORE MEMBERS
            </h2>
            <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold">
              {teamData.core.length} MEMBERS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#14120e]/20 border border-[#14120e]/20">
            {teamData.core.map((member, i) => (
              <div
                key={member.name}
                className="bg-[#e5e0d3] p-5 flex flex-col justify-between group hover:bg-[#eae5d9] transition-colors min-h-[170px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 bg-[#14120e] text-[#e5e0d3] flex items-center justify-center font-display text-base group-hover:bg-[#c83a1a] transition-colors">
                      {getInitials(member.name)}
                    </div>
                    <span className="text-[10px] font-mono text-[#14120e]/40">
                      #{i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg uppercase tracking-tight text-[#14120e] leading-tight mb-1">
                    {member.name}
                  </h3>
                </div>
                <p className="text-xs font-sans uppercase tracking-wider text-[#14120e]/70 font-semibold">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Website Builders */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-[#14120e]/20 pb-3">
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#14120e]">
              02 // WEBSITE BUILDERS
            </h2>
            <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold">
              DIGITAL ARCHITECTS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#14120e]/20 border border-[#14120e]/20">
            {teamData.website.map((builder, i) => (
              <div
                key={builder.name}
                className="bg-[#e5e0d3] p-5 flex flex-col justify-between group hover:bg-[#eae5d9] transition-colors min-h-[170px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 bg-[#2e2a23] text-[#e5e0d3] flex items-center justify-center font-display text-base group-hover:bg-[#c83a1a] transition-colors">
                      {getInitials(builder.name)}
                    </div>
                    <span className="text-[10px] font-mono text-[#14120e]/40">
                      DEV
                    </span>
                  </div>
                  <h3 className="font-display text-lg uppercase tracking-tight text-[#14120e] leading-tight mb-1">
                    {builder.name}
                  </h3>
                </div>
                <p className="text-xs font-sans uppercase tracking-wider text-[#14120e]/70 font-semibold">
                  {builder.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Faculty Advisors */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-[#14120e]/20 pb-3">
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#14120e]">
              03 // FACULTY ADVISORS & COORDINATORS
            </h2>
            <span className="font-sans text-xs uppercase tracking-widest text-[#c83a1a] font-bold">
              RCCIIT MENTORS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamData.faculty.map((fac) => (
              <div
                key={fac.name}
                className="border border-[#14120e]/30 p-6 bg-[#eae5d9] space-y-3"
              >
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#c83a1a] block">
                  ADVISORY BOARD
                </span>
                <h3 className="font-display text-2xl uppercase tracking-tight text-[#14120e]">
                  {fac.name}
                </h3>
                <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/75 font-semibold">
                  {fac.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
