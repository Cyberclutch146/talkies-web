"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export interface TeamMember {
  name: string;
  role: string;
  photo: string | null;
  position?: string;
  bio?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

interface MemberProfileModalProps {
  member: TeamMember | null;
  category: string;
  yearLabel: string;
  onClose: () => void;
}

export default function MemberProfileModal({
  member,
  category,
  yearLabel,
  onClose,
}: MemberProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [member, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!member) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [member]);

  if (!member) return null;

  const photoSrc = member.photo || "/team/placeholder.webp";
  const hasSocials = member.socials && Object.values(member.socials).some(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-name"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#14120e]/75 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg md:max-w-xl bg-[#e5e0d3] border-t-2 sm:border-2 border-[#14120e] shadow-[0_-8px_30px_rgba(20,18,14,0.3)] sm:shadow-[8px_8px_0px_#14120e] max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-xl sm:rounded-none animate-in fade-in slide-in-from-bottom-4 duration-200"
      >
        {/* Top Newsroom Header Bar */}
        <div className="sticky top-0 z-20 bg-[#14120e] text-[#e5e0d3] px-4 py-2.5 flex items-center justify-between border-b border-[#14120e]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#c83a1a] rounded-full inline-block" />
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#e5e0d3]/80 font-bold">
              THE RCC TALKIES // EDITORIAL PROFILE
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close member profile"
            className="w-7 h-7 flex items-center justify-center bg-[#e5e0d3] text-[#14120e] hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors font-bold text-sm cursor-pointer shadow-[2px_2px_0px_#c83a1a]"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Top section: Photo + Identity */}
          <div className="flex flex-row gap-3.5 sm:gap-5 items-start">
            {/* Portrait Image */}
            <div className="relative w-28 min-[380px]:w-32 sm:w-44 aspect-[4/5] shrink-0 overflow-hidden bg-[#dad4c3] border-2 border-[#14120e] shadow-[3px_3px_0px_#14120e] sm:shadow-[4px_4px_0px_#14120e]">
              <Image
                src={photoSrc}
                alt={member.name}
                fill
                priority
                sizes="(max-width: 640px) 140px, 180px"
                style={{
                  objectFit: "cover",
                  objectPosition: member.position || "center",
                }}
              />
            </div>

            {/* Core Member Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5 sm:pt-1">
              <span className="inline-block self-start bg-[#14120e] text-[#c83a1a] text-[8.5px] sm:text-[9.5px] font-sans font-bold px-1.5 py-0.5 tracking-wider uppercase mb-1.5">
                {category}
              </span>
              <h2
                id="member-modal-name"
                className="font-display text-xl min-[380px]:text-2xl sm:text-3xl uppercase tracking-tight text-[#14120e] leading-[1.1] mb-1 break-words"
              >
                {member.name}
              </h2>
              <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#c83a1a] font-bold leading-tight mb-2">
                {member.role}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-wider text-[#14120e]/60">
                <span className="w-1.5 h-1.5 bg-[#14120e]/40 rounded-full" />
                <span>{yearLabel}</span>
              </div>
            </div>
          </div>

          {/* Editorial Divider */}
          <div className="border-t border-[#14120e]/20 pt-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold mb-1.5">
              // EDITORIAL BIO &amp; ROLE
            </h4>
            {member.bio ? (
              <p className="font-serif text-sm sm:text-base text-[#14120e] leading-relaxed italic">
                &ldquo;{member.bio}&rdquo;
              </p>
            ) : (
              <p className="font-serif text-xs sm:text-sm text-[#14120e]/80 leading-relaxed">
                Contributing member of the official journalism and media society
                of RCC Institute of Information Technology, dedicated to news
                coverage, visual storytelling, and student publications.
              </p>
            )}
          </div>

          {/* Micro Newsroom Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 bg-[#dad4c3]/50 border border-[#14120e]/20 text-[10px] sm:text-[11px] font-sans">
            <div>
              <span className="text-[#14120e]/50 uppercase tracking-widest block font-bold text-[9px]">
                SOCIETY
              </span>
              <span className="text-[#14120e] font-semibold">The RCC Talkies</span>
            </div>
            <div>
              <span className="text-[#14120e]/50 uppercase tracking-widest block font-bold text-[9px]">
                INSTITUTION
              </span>
              <span className="text-[#14120e] font-semibold">RCCIIT, Kolkata</span>
            </div>
            <div>
              <span className="text-[#14120e]/50 uppercase tracking-widest block font-bold text-[9px]">
                DIVISION
              </span>
              <span className="text-[#14120e] font-semibold">{category}</span>
            </div>
            <div>
              <span className="text-[#14120e]/50 uppercase tracking-widest block font-bold text-[9px]">
                TENURE
              </span>
              <span className="text-[#14120e] font-semibold">{yearLabel}</span>
            </div>
          </div>

          {/* Social Media Links (if available) */}
          {hasSocials && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#14120e]/50 font-bold">
                // CONNECT
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.socials?.instagram && (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14120e] text-[#e5e0d3] text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#c83a1a] transition-colors"
                  >
                    Instagram ↗
                  </a>
                )}
                {member.socials?.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14120e] text-[#e5e0d3] text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#c83a1a] transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                )}
                {member.socials?.github && (
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14120e] text-[#e5e0d3] text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#c83a1a] transition-colors"
                  >
                    GitHub ↗
                  </a>
                )}
                {member.socials?.email && (
                  <a
                    href={`mailto:${member.socials.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#14120e] text-[#e5e0d3] text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#c83a1a] transition-colors"
                  >
                    Email ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 bg-[#14120e] text-[#e5e0d3] font-sans text-xs font-bold uppercase tracking-[0.2em] border border-[#14120e] shadow-[3px_3px_0px_#c83a1a] hover:bg-[#c83a1a] hover:shadow-[3px_3px_0px_#14120e] transition-all cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

