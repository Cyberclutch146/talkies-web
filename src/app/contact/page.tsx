"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import siteData from "@/data/site.json";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeading title="Contact" tag="Get In Touch" />
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact info */}
        <ScrollReveal>
          <div className="space-y-8">
            {/* Email */}
            <div>
              <h3 className="text-xs text-muted uppercase tracking-widest font-body mb-2">
                Email
              </h3>
              <a
                href={`mailto:${siteData.contact.email}`}
                className="text-lg font-body text-ink hover:text-red transition-colors"
              >
                {siteData.contact.email}
              </a>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xs text-muted uppercase tracking-widest font-body mb-2">
                Address
              </h3>
              <p className="text-sm text-ink leading-relaxed max-w-sm">
                {siteData.contact.address}
              </p>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-xs text-muted uppercase tracking-widest font-body mb-3">
                Social
              </h3>
              <div className="flex gap-4">
                {Object.entries(siteData.contact.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-rule px-4 py-2 text-xs font-body font-medium uppercase tracking-widest text-muted hover:text-red hover:border-red transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Sister clubs */}
            <div>
              <h3 className="text-xs text-muted uppercase tracking-widest font-body mb-3">
                Campus Clubs
              </h3>
              <div className="flex flex-wrap gap-2">
                {siteData.sisterClubs.map((club) => (
                  <span
                    key={club.name}
                    className="border border-rule px-3 py-1.5 text-xs font-body text-muted"
                  >
                    {club.name}
                    <span className="text-rule ml-1">· {club.focus}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Right: Contact form */}
        <ScrollReveal delay={0.15}>
          <form onSubmit={handleSubmit} className="border border-rule p-6 sm:p-8 space-y-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs text-muted uppercase tracking-widest font-body mb-2"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                className="w-full bg-transparent border-b border-rule pb-2 text-sm font-body text-ink placeholder:text-rule focus:border-red focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs text-muted uppercase tracking-widest font-body mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                className="w-full bg-transparent border-b border-rule pb-2 text-sm font-body text-ink placeholder:text-rule focus:border-red focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs text-muted uppercase tracking-widest font-body mb-2"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                className="w-full bg-transparent border-b border-rule pb-2 text-sm font-body text-ink placeholder:text-rule focus:border-red focus:outline-none transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs text-muted uppercase tracking-widest font-body mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                className="w-full bg-transparent border border-rule p-3 text-sm font-body text-ink placeholder:text-rule focus:border-red focus:outline-none transition-colors resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ink text-cream font-body font-bold text-sm uppercase tracking-widest py-4 hover:bg-red transition-colors"
            >
              {submitted ? "Message Sent ✓" : "Send Message"}
            </button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red text-center font-body"
              >
                Thanks! We&apos;ll get back to you soon.
              </motion.p>
            )}
          </form>
        </ScrollReveal>
      </div>
    </div>
  );
}
