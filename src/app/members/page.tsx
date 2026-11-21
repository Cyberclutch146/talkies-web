"use client";

import { useState } from "react";
import Image from "next/image";
import coreData from "@/data/coreteam.json";
import subcoreData from "@/data/subcore.json";
import SpotlightCard from "@/components/SpotlightCard";
import DecryptedText from "@/components/DecryptedText";
import MemberProfileModal, { TeamMember } from "@/components/MemberProfileModal";

interface TeamYear {
  year: string;
  label: string;
  leads: TeamMember[];
  coreTeam: TeamMember[];
  faculty: TeamMember[];
}

interface SubcoreMember {
  name: string;
  photo: string;
  position?: string;
}

interface SubcoreCategory {
  role: string;
  members: SubcoreMember[];
}

interface AcademicYearSubcore {
  year: string;
  label: string;
  subcoreTeam: Record<string, SubcoreCategory>;
}

// 3-column compact gallery on mobile, 4 columns on tablet, 3-4 columns on desktop
const GALLERY_GRID_CLASS =
  "grid grid-cols-3 max-[339px]:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5";

function MemberCard({
  member,
  category,
  onSelect,
  isFaculty = false,
}: {
  member: TeamMember;
  category: string;
  onSelect: (member: TeamMember, category: string) => void;
  isFaculty?: boolean;
}) {
  const photoSrc = member.photo || "/team/placeholder.webp";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(member, category)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(member, category);
        }
      }}
      aria-label={`View profile of ${member.name}, ${member.role}`}
      className="group w-full h-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c83a1a]"
    >
      <SpotlightCard
        className="p-0 flex flex-col h-full bg-transparent lg:bg-[#e5e0d3] border-0 lg:border lg:border-[#14120e]/20 transition-all duration-500 lg:hover:shadow-[6px_6px_0px_#14120e] lg:hover:-translate-y-1 lg:hover:border-[#c83a1a]"
        spotlightColor="rgba(200, 58, 26, 0.15)"
      >
        {/* Photo Container: strict 4:5 aspect ratio */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#dad4c3] border border-[#14120e]/25 lg:border-0 lg:border-b lg:border-[#14120e]/20 transition-all duration-300 group-hover:border-[#c83a1a] group-hover:shadow-[2px_2px_0px_#14120e] lg:group-hover:shadow-none">
          <Image
            src={photoSrc}
            alt={member.name}
            fill
            loading="lazy"
            style={{
              objectFit: "cover",
              objectPosition: member.position || "center",
            }}
            className="transition-transform duration-700 ease-out group-hover:scale-105 lg:group-hover:scale-110"
            sizes="(max-width: 480px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 33vw, 25vw"
          />
          {isFaculty && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#14120e] text-[#c83a1a] text-[7.5px] min-[380px]:text-[8px] sm:text-[9px] font-sans font-bold px-1 sm:px-1.5 py-0.5 tracking-widest uppercase">
              Advisory
            </div>
          )}
          {/* Subtle touch / hover overlay */}
          <div className="absolute inset-0 bg-[#14120e]/0 group-hover:bg-[#14120e]/5 group-active:bg-[#14120e]/10 transition-colors" />
        </div>

        {/* Text Details below photo */}
        <div className="pt-1.5 min-[380px]:pt-2 pb-0.5 px-0.5 lg:p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-[11px] min-[380px]:text-xs sm:text-sm lg:text-lg uppercase tracking-tight text-[#14120e] leading-tight mb-0.5 lg:mb-1 group-hover:text-[#c83a1a] transition-colors line-clamp-2">
              {member.name}
            </h3>
            <p className="text-[8.5px] min-[380px]:text-[9px] sm:text-[10px] lg:text-[11px] font-sans uppercase tracking-[0.1em] lg:tracking-[0.15em] text-[#14120e]/60 font-semibold leading-tight line-clamp-1">
              {member.role}
            </p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

export default function MembersPage() {
  const years = (coreData.years as TeamYear[]) || [];
  const subcoreYears = (subcoreData as AcademicYearSubcore[]) || [];

  const [activeYearIdx, setActiveYearIdx] = useState(0);
  const [showSubcore, setShowSubcore] = useState(false);
  const [selectedModalMember, setSelectedModalMember] = useState<{
    member: TeamMember;
    category: string;
  } | null>(null);

  const activeYear = years[activeYearIdx];
  const activeSubcore = activeYear ? subcoreYears.find((s) => s.year === activeYear.year) : null;

  const totalMembers = activeYear
    ? (activeYear.leads?.length || 0) + (activeYear.coreTeam?.length || 0) + (activeYear.faculty?.length || 0)
    : 0;

  const handleSelectMember = (member: TeamMember, category: string) => {
    setSelectedModalMember({ member, category });
  };

  if (!activeYear) return null;

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Header Banner - Tightened padding for mobile */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-24 sm:pt-36 lg:pt-40 pb-6 sm:pb-10 lg:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto">
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1.5 sm:mb-2">
            THE NEWSROOM &amp; EDITORIAL BOARD
          </span>
          <h1 className="font-display text-4xl min-[380px]:text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3] mb-3 sm:mb-4">
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
          <p className="font-serif text-xs sm:text-base text-[#e5e0d3]/70 max-w-lg leading-relaxed">
            Writers, photojournalists, graphic designers, web developers, and mentors powering the Voice of RCCIIT.
          </p>
        </div>
      </section>

      {/* Academic Year Tabs */}
      <div className="w-full border-b border-[#14120e]/20 bg-[#eae5d9]/60 py-2.5 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {years.map((yr, idx) => (
              <button
                key={yr.year}
                type="button"
                onClick={() => {
                  setActiveYearIdx(idx);
                  setShowSubcore(false);
                }}
                className={`py-2 sm:py-3 px-3.5 sm:px-8 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] transition-all border cursor-pointer ${
                  activeYearIdx === idx
                    ? "border-[#14120e] bg-[#14120e] text-[#e5e0d3] shadow-[3px_3px_0px_#c83a1a] sm:shadow-[4px_4px_0px_#c83a1a] -translate-y-0.5 sm:-translate-y-1"
                    : "border-[#14120e]/20 bg-transparent text-[#14120e]/50 hover:text-[#14120e] hover:border-[#14120e]/50 font-medium"
                }`}
              >
                {yr.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-sans uppercase tracking-widest text-[#14120e]/60">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c83a1a] rounded-full inline-block" />
            <span>{totalMembers} MEMBERS</span>
          </div>
        </div>
      </div>

      {/* Main Content Gallery */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 space-y-8 sm:space-y-14 lg:space-y-20">
        {/* 1. Leads */}
        <section className="space-y-3 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-2 border-b border-[#14120e]/20 pb-2 sm:pb-3">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-6xl text-[#14120e] uppercase tracking-tight">
              <DecryptedText
                text="01 // Leads"
                animateOn="view"
                speed={30}
                maxIterations={6}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-lg sm:text-2xl"
              />
            </h2>
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
              {activeYear.leads?.length || 0} MEMBERS
            </span>
          </div>

          <div className={GALLERY_GRID_CLASS}>
            {activeYear.leads?.map((member, idx) => (
              <MemberCard
                key={`${activeYear.year}-lead-${member.name}-${idx}`}
                member={member}
                category="01 // Leads"
                onSelect={handleSelectMember}
              />
            ))}
          </div>
        </section>

        {/* 2. Core Team */}
        <section className="space-y-3 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-2 border-b border-[#14120e]/20 pb-2 sm:pb-3">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-6xl text-[#14120e] uppercase tracking-tight">
              <DecryptedText
                text="02 // Core Team"
                animateOn="view"
                speed={30}
                maxIterations={6}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-lg sm:text-2xl"
              />
            </h2>
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
              {activeYear.coreTeam?.length || 0} MEMBERS
            </span>
          </div>

          <div className={GALLERY_GRID_CLASS}>
            {activeYear.coreTeam?.map((member, idx) => (
              <MemberCard
                key={`${activeYear.year}-core-${member.name}-${idx}`}
                member={member}
                category="02 // Core Team"
                onSelect={handleSelectMember}
              />
            ))}
          </div>
        </section>

        {/* 3. Faculty Advisors */}
        <section className="space-y-3 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-2 border-b border-[#14120e]/20 pb-2 sm:pb-3">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-6xl text-[#14120e] uppercase tracking-tight">
              <DecryptedText
                text="03 // Faculty Advisors"
                animateOn="view"
                speed={30}
                maxIterations={6}
                className="text-[#14120e]"
                encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-lg sm:text-2xl"
              />
            </h2>
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
              RCCIIT MENTORS
            </span>
          </div>

          <div className={GALLERY_GRID_CLASS}>
            {activeYear.faculty?.map((fac, idx) => (
              <MemberCard
                key={`${activeYear.year}-fac-${fac.name}-${idx}`}
                member={fac}
                category="03 // Faculty Advisors"
                isFaculty={true}
                onSelect={handleSelectMember}
              />
            ))}
          </div>
        </section>

        {/* View / Hide Subcore Button */}
        {activeSubcore && (
          <div className="flex justify-center pt-2 sm:pt-6">
            <button
              type="button"
              onClick={() => setShowSubcore(!showSubcore)}
              className="py-2.5 sm:py-3 px-6 sm:px-8 border-2 border-[#14120e] bg-[#14120e] text-[#e5e0d3] font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.18em] transition-all shadow-[4px_4px_0px_#c83a1a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#c83a1a] cursor-pointer"
            >
              {showSubcore ? "Hide Subcore Team ↑" : "View Subcore Team →"}
            </button>
          </div>
        )}

        {/* 4. Subcore Team */}
        {showSubcore && activeSubcore?.subcoreTeam && (
          <section className="space-y-8 sm:space-y-12 border-t-2 border-[#14120e]/20 pt-8 sm:pt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-1 sm:gap-2 border-b border-[#14120e]/20 pb-2 sm:pb-3">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-6xl text-[#14120e] uppercase tracking-tight">
                <DecryptedText
                  text="04 // Subcore Team"
                  animateOn="view"
                  speed={30}
                  maxIterations={6}
                  className="text-[#14120e]"
                  encryptedClassName="text-[#c83a1a]/60 font-sans uppercase text-lg sm:text-2xl"
                />
              </h2>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#c83a1a] font-bold whitespace-nowrap">
                DEPARTMENTS
              </span>
            </div>

            {Object.entries(activeSubcore.subcoreTeam).map(([deptKey, category]) => (
              <div key={deptKey} className="space-y-3 sm:space-y-4">
                <h3 className="font-sans text-xs sm:text-lg uppercase tracking-widest text-[#c83a1a] font-bold border-b border-[#14120e]/10 pb-1">
                  // {deptKey}
                </h3>
                <div className={GALLERY_GRID_CLASS}>
                  {category.members?.map((member, idx) => (
                    <MemberCard
                      key={`${activeYear.year}-${deptKey}-${member.name}-${idx}`}
                      member={{
                        name: member.name,
                        role: category.role,
                        photo: member.photo,
                        position: member.position,
                      }}
                      category={`Subcore // ${deptKey}`}
                      onSelect={handleSelectMember}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Interactive Member Profile Popup */}
      <MemberProfileModal
        member={selectedModalMember?.member || null}
        category={selectedModalMember?.category || ""}
        yearLabel={activeYear.label}
        onClose={() => setSelectedModalMember(null)}
      />
    </div>
  );
}
