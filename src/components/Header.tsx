"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import siteData from "@/data/site.json";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#e5e0d3]/95 backdrop-blur-md border-b border-[#14120e]/15">
      <div className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Location / Dateline */}
        <div className="w-1/4 flex items-center gap-2 text-[11px] sm:text-xs font-serif tracking-wider text-[#14120e]/80">
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#c83a1a] animate-pulse" />
          <span>Kolkata, WB</span>
          <span className="hidden md:inline text-[#14120e]/40">· Est. 1999</span>
        </div>

        {/* Center: Gothic Masthead Brand Logo with Official Insignia */}
        <div className="w-2/4 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 group"
          >
            <img
              src="/logo.png"
              alt="RCC Talkies Emblem"
              className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-gothic text-2xl sm:text-3xl lg:text-[32px] tracking-wide text-[#14120e] group-hover:opacity-75 transition-opacity">
              The RCC Talkies
            </span>
          </Link>
        </div>

        {/* Right: Minimalist Hamburger Menu Trigger */}
        <div className="w-1/4 flex justify-end items-center gap-6">
          {/* Desktop Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-sans uppercase tracking-[0.18em] font-medium" aria-label="Quick navigation">
            {siteData.navLinks.slice(1, 5).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors relative py-1 ${
                    isActive ? "text-[#c83a1a] font-bold" : "text-[#14120e]/75 hover:text-[#14120e]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c83a1a]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Minimalist 2-line Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer group"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-[#14120e] transition-transform origin-center"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-[#14120e] transition-transform origin-center"
            />
          </button>
        </div>
      </div>

      {/* Full-Screen Newspaper Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[53px] bottom-0 z-40 bg-[#e5e0d3] border-b border-[#14120e] overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col justify-between min-h-[calc(100vh-80px)]">
              {/* Top Banner inside Menu */}
              <div className="border-b border-[#14120e]/20 pb-4 mb-8 flex justify-between items-center text-xs font-sans uppercase tracking-[0.2em] text-[#14120e]/60">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="RCC Talkies" className="h-5 w-auto" />
                  <span>The Voice of RCCIIT</span>
                </div>
                <span className="hidden sm:inline">Select Section</span>
                <span>Issue Vol. II · 2025</span>
              </div>

              {/* Huge Stacked Menu Links */}
              <nav className="flex flex-col gap-3 sm:gap-4 my-auto" aria-label="Main menu">
                {siteData.navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-[#14120e]/15 pb-2 group"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-baseline justify-between"
                      >
                        <span
                          className={`font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight transition-colors ${
                            isActive
                              ? "text-[#c83a1a] italic font-semibold"
                              : "text-[#14120e] group-hover:text-[#c83a1a] group-hover:translate-x-3 transition-transform"
                          }`}
                        >
                          {link.label}
                        </span>
                        <span className="font-sans text-xs uppercase tracking-widest text-[#14120e]/40 group-hover:text-[#c83a1a]">
                          0{i + 1} ↗
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Desks bar */}
              <div className="pt-8 mt-8 border-t border-[#14120e]/20 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-sans uppercase tracking-widest text-[#14120e]/70">
                {siteData.desks.map((desk) => (
                  <div key={desk} className="flex items-center gap-2">
                    <span className="text-[#c83a1a]">✦</span>
                    <span>{desk}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
