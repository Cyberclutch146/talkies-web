"use client";

import React, { useState } from "react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { LEAD_POSITIONS as POSITIONS } from "@/data/positions";

export default function LeadsJoinPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      type: "LEAD",
      name: formData.get("name"),
      collegeEmail: formData.get("collegeEmail"),
      rollNumber: formData.get("rollNumber"),
      yearOfStudy: formData.get("yearOfStudy"),
      phoneNumber: formData.get("phoneNumber"),
      positionAppliedFor: formData.get("positionAppliedFor"),
      portfolioLink: formData.get("portfolioLink"),
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

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ── Inverted Banner ── */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              RECRUITMENT // LEADERSHIP
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="LEAD APPLICATION"
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
            Apply to lead one of our editorial desks and shape the voice of campus journalism.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 border-b border-[#14120e]/20">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#14120e]/60">
          <Link href="/join" className="hover:text-[#c83a1a] transition-colors">← Back to Recruitment</Link>
          <span>·</span>
          <span className="text-[#c83a1a] font-bold">LEADS FORM</span>
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
              Your leadership application has been received by the editorial board. We&apos;ll reach out to your college email within 48 hours.
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

            {/* LEFT: Position Info */}
            <div className="order-2 lg:order-1 lg:col-span-4 p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                  AVAILABLE POSITIONS
                </span>
                <div className="space-y-0">
                  {POSITIONS.map((pos, idx) => (
                    <div key={pos} className="flex items-center gap-3 py-2 border-b border-[#14120e]/10 last:border-0">
                      <span className="font-sans text-[10px] text-[#c83a1a] font-bold w-5 flex-shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-sans uppercase tracking-wider font-bold text-[#14120e]">
                        {pos}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#14120e]/20">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                  REQUIREMENTS
                </span>
                <ul className="space-y-1.5 text-sm font-serif text-[#14120e]/75 leading-relaxed">
                  <li>• Active RCCIIT student (3rd year only)</li>
                  <li>• Commitment to weekly editorial meetings</li>
                  <li>• Prior experience preferred but not required</li>
                  <li>• Portfolio or past work samples encouraged</li>
                </ul>
              </div>
            </div>

            {/* RIGHT: The Form */}
            <div className="order-1 lg:order-2 lg:col-span-8 p-6 sm:p-10 bg-[#e5e0d3]">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                APPLICATION FORM // LEADS
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
                    <label htmlFor="lead-name" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      FULL NAME *
                    </label>
                    <input
                      required id="lead-name" name="name" type="text"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="e.g. Aritra Banerjee"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-email" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      COLLEGE EMAIL *
                    </label>
                    <input
                      required id="lead-email" name="collegeEmail" type="email"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="your@rcciit.org"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-roll" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      COLLEGE ROLL NUMBER *
                    </label>
                    <input
                      required id="lead-roll" name="rollNumber" type="text"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="e.g. 30001223051"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-year" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      YEAR OF STUDY *
                    </label>
                    <select
                      required id="lead-year" name="yearOfStudy"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-sans uppercase tracking-wider text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="">Select Year</option>
                      <option value="3">3rd Year</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="lead-phone" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      PHONE NUMBER *
                    </label>
                    <input
                      required id="lead-phone" name="phoneNumber" type="tel"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                      placeholder="+91 98XXX XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-position" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                      POSITION APPLYING FOR *
                    </label>
                    <select
                      required id="lead-position" name="positionAppliedFor"
                      className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-sans uppercase tracking-wider text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="">Select Position</option>
                      {POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="lead-portfolio" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                    PORTFOLIO / RESUME LINK
                  </label>
                  <input
                    id="lead-portfolio" name="portfolioLink" type="url"
                    className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div>
                  <label htmlFor="lead-why" className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2">
                    WHY DO YOU WANT THIS POSITION?
                  </label>
                  <textarea
                    id="lead-why" name="whyJoin" rows={4}
                    className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none resize-none transition-colors"
                    placeholder="Tell us about your vision for this role..."
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
