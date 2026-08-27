"use client";

import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";

const LEAD_POSITIONS = [
  "Editor-in-Chief",
  "Tech Lead",
  "Graphics Lead cum Editorial Associate",
  "Social Media Lead",
  "Content Lead",
  "Artwork Lead",
  "Lead Journalist",
  "Media Journalist Lead",
  "Research Wing Lead",
  "Alumni POC",
  "Event Management Lead",
];

const TEAM_DESKS = [
  { name: "Editorial", desc: "Member of the Editorial wing" },
  { name: "Tech", desc: "Member of the Tech wing" },
  { name: "Graphics & Editorial", desc: "Member of the Graphics wing" },
  { name: "Social Media", desc: "Member of the Social Media wing" },
  { name: "Content", desc: "Member of the Content wing" },
  { name: "Artwork", desc: "Member of the Artwork wing" },
  { name: "Journalism", desc: "Member of the Journalism wing" },
  { name: "Media Journalism", desc: "Member of the Media Journalism wing" },
  { name: "Research Wing", desc: "Member of the Research Wing" },
  { name: "Alumni Team", desc: "Member of the Alumni Team" },
  { name: "Event Management", desc: "Member of the Event Management wing" },
];

export default function JoinPage() {
  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ── Inverted Black Header Banner ── */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] py-6 sm:py-10 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              RECRUITMENT // 2025
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="JOIN THE TEAM"
                animateOn="view"
                speed={40}
                maxIterations={8}
                sequential={true}
                revealDirection="center"
                className="text-[#e5e0d3]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/70 max-w-sm">
            Whether you want to lead a desk or contribute your skills, there&apos;s a byline waiting for you at RCC Talkies.
          </p>
        </div>
      </section>

      {/* ── Editorial Statement ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-b border-[#14120e]/20">
        <div className="flex items-baseline gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>Applications are reviewed by the editorial board on a rolling basis</span>
        </div>
      </div>

      {/* ── Two-Column Cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#14120e]/30 bg-[#eae5d9] divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20">

          {/* LEFT: Lead Applications */}
          <Link href="/join/leads" className="group p-6 sm:p-10 flex flex-col justify-between hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
                01 // LEADERSHIP POSITIONS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#14120e] mb-4">
                APPLY FOR LEADS
              </h2>
              <p className="font-serif text-base text-[#14120e]/75 leading-relaxed mb-6">
                Step up and take charge of a desk. We&apos;re looking for dedicated individuals to lead our editorial, tech, social media, and creative wings.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-6">
                {LEAD_POSITIONS.map((pos, idx) => (
                  <div key={pos} className="flex items-center gap-2 py-1.5 border-b border-[#14120e]/10">
                    <span className="font-sans text-[10px] text-[#c83a1a] font-bold w-4 flex-shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#14120e]/80 truncate">
                      {pos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-[#14120e]/20">
              <span className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e] group-hover:text-[#c83a1a] transition-colors">
                <span>APPLY NOW</span>
                <span>→</span>
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#14120e]/50">
                {LEAD_POSITIONS.length} POSITIONS
              </span>
            </div>
          </Link>

          {/* RIGHT: Team Applications */}
          <Link href="/join/team" className="group p-6 sm:p-10 flex flex-col justify-between hover:bg-[#e0dbcd]/50 transition-colors">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
                02 // TEAM MEMBER RECRUITMENT
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#14120e] mb-4">
                APPLY FOR TEAM
              </h2>
              <p className="font-serif text-base text-[#14120e]/75 leading-relaxed mb-6">
                Join one of our five editorial desks. Contribute to campus journalism through writing, reporting, photography, research, or social media.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {TEAM_DESKS.map((desk, idx) => (
                  <div key={desk.name} className="border-l-2 border-[#14120e] pl-3">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#c83a1a] block">
                      0{idx + 1}
                    </span>
                    <span className="font-sans text-xs uppercase tracking-wider font-bold text-[#14120e]">
                      {desk.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-[#14120e]/20">
              <span className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e] group-hover:text-[#c83a1a] transition-colors">
                <span>APPLY NOW</span>
                <span>→</span>
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#14120e]/50">
                {TEAM_DESKS.length} DESKS
              </span>
            </div>
          </Link>

        </div>
      </div>

      {/* ── Bottom Info Strip ── */}
      <section className="w-full border-t border-[#14120e]/20 bg-[#ded8c7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <span className="font-display text-3xl text-[#14120e]">25+</span>
            <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 mt-1">Years of Legacy</p>
          </div>
          <div>
            <span className="font-display text-3xl text-[#14120e]">5</span>
            <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 mt-1">Editorial Desks</p>
          </div>
          <div>
            <span className="font-display text-3xl text-[#c83a1a]">OPEN</span>
            <p className="text-xs font-sans uppercase tracking-widest text-[#14120e]/60 mt-1">Recruitment Status</p>
          </div>
        </div>
      </section>
    </div>
  );
}
