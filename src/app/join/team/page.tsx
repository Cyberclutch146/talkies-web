"use client";

import React, { useState } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { TEAM_DESKS as DESKS } from "@/data/positions";

export default function TeamJoinPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedDesk, setSelectedDesk] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      type: "TEAM",
      name: formData.get("name"),
      collegeEmail: formData.get("collegeEmail"),
      rollNumber: formData.get("rollNumber"),
      yearOfStudy: formData.get("yearOfStudy"),
      phoneNumber: formData.get("phoneNumber"),
      positionAppliedFor: formData.get("positionAppliedFor"),
      whyRCCTalkies: formData.get("whyRCCTalkies"),
      whyJoin: formData.get("whyJoin"),
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getPersonalisedQuestion = (desk: string) => {
    switch (desk) {
      case "Reporting Team":
        return { label: "WHY DO YOU WANT TO JOIN THE REPORTING TEAM? *", placeholder: "Tell us about a campus story you'd like to cover or your experience with interviewing..." };
      case "PR & Social Media Team":
        return { label: "WHY DO YOU WANT TO JOIN PR & SOCIAL MEDIA? *", placeholder: "What ideas do you have for engaging our audience on social media?" };
      case "Alumni Team":
        return { label: "WHY DO YOU WANT TO JOIN THE ALUMNI TEAM? *", placeholder: "How would you foster connections with our alumni network?" };
      case "Content Team":
        return { label: "WHY DO YOU WANT TO JOIN THE CONTENT TEAM? *", placeholder: "Share a writing sample link or tell us what topics you love writing about..." };
      case "Research Wing Team":
        return { label: "WHY DO YOU WANT TO JOIN THE RESEARCH WING? *", placeholder: "Tell us about your analytical skills, surveying, or research experience..." };
      case "Videography Team":
        return { label: "WHY DO YOU WANT TO JOIN VIDEOGRAPHY? *", placeholder: "Share a link to your previous video work or tell us what you'd like to shoot..." };
      case "Video Editing Team":
        return { label: "WHY DO YOU WANT TO JOIN VIDEO EDITING? *", placeholder: "Tell us about the software you use or share a link to some of your edits..." };
      case "Artwork Team":
        return { label: "WHY DO YOU WANT TO JOIN THE ARTWORK TEAM? *", placeholder: "Share your portfolio link or tell us about your artistic style and tools..." };
      case "Graphics Team":
        return { label: "WHY DO YOU WANT TO JOIN THE GRAPHICS TEAM? *", placeholder: "Share a link to your designs or tell us what visual aesthetics inspire you..." };
      case "Event Management Team":
        return { label: "WHY DO YOU WANT TO JOIN EVENT MANAGEMENT? *", placeholder: "Tell us about an event you helped organize or how you handle logistical pressure..." };
      case "Tech Team":
        return { label: "WHY DO YOU WANT TO JOIN THE TECH TEAM? *", placeholder: "Share your GitHub/portfolio link or tell us what tech stacks you're familiar with..." };
      default:
        return { label: "WHY DO YOU WANT TO JOIN? *", placeholder: "Tell us what excites you about this role..." };
    }
  };

  const { label: whyJoinLabel, placeholder: whyJoinPlaceholder } = getPersonalisedQuestion(selectedDesk);

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ── Inverted Banner ── */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              RECRUITMENT // TEAM MEMBERS
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="TEAM APPLICATION"
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
            Join one of our five editorial desks and contribute to campus journalism at RCCIIT.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 border-b border-[#14120e]/20">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#14120e]/60">
          <Link href="/join" className="hover:text-[#c83a1a] transition-colors">← Back to Recruitment</Link>
          <span>·</span>
          <span className="text-[#c83a1a] font-bold">TEAM FORM</span>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {success ? (
          <div className="max-w-2xl mx-auto border-2 border-[#14120e] bg-[#eae5d9] p-8 sm:p-12 text-center">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
              APPLICATION DISPATCHED
            </span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#14120e] mb-4">
              THANK YOU ✓
            </h2>
            <p className="font-serif text-base text-[#14120e]/75 leading-relaxed mb-6">
              Your team application has been received by the editorial board. We&apos;ll reach out to your college email within 48 hours.
            </p>
            <Link
              href="/join"
              className="inline-block bg-[#14120e] text-[#e5e0d3] font-display text-lg uppercase tracking-tight px-8 py-3 hover:bg-[#c83a1a] transition-colors"
            >
              BACK TO RECRUITMENT →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20 border border-[#14120e]/30 bg-[#eae5d9]">

            {/* LEFT: Desk Info */}
            <div className="order-2 lg:order-1 lg:col-span-4 p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
                  EDITORIAL DESKS
                </span>
                <div className="space-y-4">
                  {DESKS.map((desk, idx) => (
                    <div key={desk.name} className="border-l-2 border-[#14120e] pl-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[10px] text-[#c83a1a] font-bold">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-sans uppercase tracking-wider font-bold text-[#14120e]">
                          {desk.name}
                        </span>
                      </div>
                      <p className="text-xs font-serif text-[#14120e]/65 leading-relaxed">
                        {desk.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#14120e]/20">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                  WHAT WE LOOK FOR
                </span>
                <ul className="space-y-1.5 text-sm font-serif text-[#14120e]/75 leading-relaxed">
                  <li>• Curiosity and passion for storytelling</li>
                  <li>• Willingness to learn on the job</li>
                  <li>• Consistent availability for events</li>
                  <li>• No prior experience necessary</li>
                </ul>
              </div>
            </div>

            {/* RIGHT: The Form */}
            <div className="order-1 lg:order-2 lg:col-span-8 p-6 sm:p-10 bg-[#e5e0d3]">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                APPLICATION FORM // TEAM
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#14120e] mb-6">
                FILL YOUR APPLICATION
              </h2>

              {error && (
                <div className="mb-6 p-4 border-2 border-[#c83a1a] bg-[#c83a1a]/10 text-sm font-sans text-[#c83a1a] font-bold">
                  ✖ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="team-name" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      FULL NAME *
                    </label>
                    <input
                      required id="team-name" name="name" type="text"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="e.g. Sneha Mukherjee"
                    />
                  </div>
                  <div>
                    <label htmlFor="team-email" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      COLLEGE EMAIL *
                    </label>
                    <input
                      required id="team-email" name="collegeEmail" type="email"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="ece2024xxx@rcciit.org.in"
                    />
                  </div>
                  <div>
                    <label htmlFor="team-roll" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      COLLEGE ROLL NUMBER *
                    </label>
                    <input
                      required id="team-roll" name="rollNumber" type="text"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="ECE2024XXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="team-year" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      YEAR OF STUDY *
                    </label>
                    <select
                      required id="team-year" name="yearOfStudy"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-sans uppercase tracking-wider text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="team-phone" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      PHONE NUMBER *
                    </label>
                    <input
                      required id="team-phone" name="phoneNumber" type="tel"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="+91 98XXX XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="team-desk" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      PREFERRED DESK *
                    </label>
                    <select
                      required id="team-desk" name="positionAppliedFor"
                      value={selectedDesk}
                      onChange={(e) => setSelectedDesk(e.target.value)}
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-sans uppercase tracking-wider text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="">Select Desk</option>
                      {DESKS.map(desk => (
                        <option key={desk.name} value={desk.name}>{desk.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="team-why-rcc" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                    WHY DO YOU WANT TO JOIN RCC TALKIES?
                  </label>
                  <textarea
                    id="team-why-rcc" name="whyRCCTalkies" rows={3}
                    className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none resize-none transition-colors"
                    placeholder="Tell us what draws you to this club..."
                  />
                </div>

                <div>
                  <label htmlFor="team-why" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                    {whyJoinLabel}
                  </label>
                  <textarea
                    id="team-why" name="whyJoin" rows={4}
                    className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none resize-none transition-colors"
                    placeholder={whyJoinPlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#14120e] text-[#e5e0d3] font-display text-xl sm:text-2xl uppercase tracking-tight py-4 hover:bg-[#c83a1a] transition-colors disabled:opacity-50"
                >
                  {loading ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
