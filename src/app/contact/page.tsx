"use client";

import { useState } from "react";
import siteData from "@/data/site.json";
import DecryptedText from "@/components/DecryptedText";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      desk: formData.get("desk"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        e.currentTarget.reset();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to submit message");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* Inverted Black Header Banner */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-8 sm:pb-12 px-4 sm:px-8 border-b border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold block mb-1">
              EDITORIAL DESK & TIPLINE
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3]">
              <DecryptedText
                text="GET IN TOUCH"
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
            Have a story tip, campus event report, or want to contribute to the next quarterly magazine issue?
          </p>
        </div>
      </section>

      {/* Editorial Statement */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-b border-[#14120e]/20">
        <div className="flex items-baseline gap-3 text-sm font-sans uppercase tracking-[0.2em] text-[#14120e]/70">
          <span className="text-[#c83a1a]">✦</span>
          <span>We respond to all campus inquiries and editorial submissions within 48 hours</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#14120e]/20 border border-[#14120e]/30 bg-[#eae5d9]">
          {/* Left: Contact Info & Channels */}
          <div className="lg:col-span-5 p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                01 // DIRECT EMAIL
              </span>
              <a
                href={`mailto:${siteData.contact.email}`}
                className="font-serif text-2xl text-[#14120e] hover:text-[#c83a1a] transition-colors underline underline-offset-4"
              >
                {siteData.contact.email}
              </a>
            </div>

            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
                02 // CAMPUS ADDRESS
              </span>
              <p className="font-serif text-base text-[#14120e]/85 leading-relaxed">
                {siteData.contact.address}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
                03 // OFFICIAL CHANNELS
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(siteData.contact.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#14120e]/30 bg-[#e5e0d3] px-4 py-2 text-xs font-sans uppercase tracking-widest font-bold text-[#14120e] hover:bg-[#14120e] hover:text-[#e5e0d3] transition-colors"
                  >
                    {platform} ↗
                  </a>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-3">
                04 // SISTER SOCIETIES
              </span>
              <div className="space-y-2">
                {siteData.sisterClubs.map((club) => (
                  <div
                    key={club.name}
                    className="flex justify-between items-center text-xs font-sans border-b border-[#14120e]/15 pb-1.5"
                  >
                    <span className="font-bold text-[#14120e]">{club.name}</span>
                    <span className="text-[#14120e]/60">{club.focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Newspaper Message / Story Tip Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-[#e5e0d3]">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-bold text-[#c83a1a] block mb-2">
              DISPATCH FORM // SUBMIT TIP
            </span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#14120e] mb-6">
              SEND A MESSAGE TO THE DESK
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2"
                  >
                    YOUR NAME *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                    placeholder="e.g. Kaushiki Sen"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2"
                  >
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors"
                    placeholder="your@rcciit.org"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-desk"
                  className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2"
                >
                  TARGET DESK / TOPIC
                </label>
                <select
                  id="contact-desk"
                  name="desk"
                  className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-sans uppercase tracking-wider text-[#14120e] focus:border-[#c83a1a] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Campus News & Tipline">Campus News & Tipline</option>
                  <option value="Fest Coverage Request">Fest Coverage Request</option>
                  <option value="Magazine Submission">Magazine Submission (Poetry / Article)</option>
                  <option value="Join The Newsroom">Join The Newsroom</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[11px] font-sans uppercase tracking-widest font-bold text-[#14120e]/70 mb-2"
                >
                  MESSAGE / STORY DETAILS *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  className="w-full bg-[#eae5d9] border-2 border-[#14120e]/20 p-3 text-sm font-serif text-[#14120e] focus:border-[#c83a1a] focus:outline-none resize-none transition-colors"
                  placeholder="Provide story details, dates, relevant departments, or your query..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#14120e] text-[#e5e0d3] font-display text-xl sm:text-2xl uppercase tracking-tight py-4 hover:bg-[#c83a1a] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "DISPATCHING..." : submitted ? "MESSAGE DISPATCHED ✓" : "SUBMIT TO EDITORIAL DESK →"}
              </button>

              {error && (
                <p className="text-sm font-sans uppercase text-[#c83a1a] text-center font-bold">
                  {error}
                </p>
              )}

              {submitted && (
                <p className="text-sm font-serif text-[#c83a1a] text-center font-bold">
                  Thank you! Your dispatch has been received by the editorial board.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
