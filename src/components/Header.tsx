"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import siteData from "@/data/site.json";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(pathname !== "/");

  const isHome = pathname === "/";
  const showFullHeader = isHome;

  useEffect(() => {
    // Only apply hide-on-hero behavior on the homepage
    if (pathname !== "/") {
      setTimeout(() => setVisible(true), 0);
      return;
    }

    const handleScroll = () => {
      // Show header after scrolling past ~90vh (the hero section)
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };

    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        showFullHeader ? "bg-[#e5e0d3]/95 backdrop-blur-md border-b border-[#14120e]/15" : "pointer-events-none"
      } ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className={`w-full px-4 sm:px-8 py-3.5 flex items-center ${showFullHeader ? "justify-between" : "justify-end"} pointer-events-none`}>
        {/* Left: Location / Dateline */}
        {showFullHeader && (
          <div className="w-[30%] sm:w-1/4 flex items-center gap-2 text-[10px] sm:text-xs font-serif tracking-wider text-[#14120e]/80 pointer-events-auto">
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#c83a1a] animate-pulse" />
            <span className="whitespace-nowrap">Kolkata, WB</span>
            <span className="hidden md:inline text-[#14120e]/40">· Est. 2022</span>
          </div>
        )}

        {/* Center: Gothic Masthead Brand Logo with Official Insignia */}
        {showFullHeader && (
          <div className="flex-1 text-center pointer-events-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 group"
            >
              <Image
                src="/logo.png"
                alt="RCC Talkies Emblem"
                width={28}
                height={28}
                className="h-5 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105 hidden sm:block"
              />
              <span className="font-gothic text-xl sm:text-3xl lg:text-[32px] tracking-wide text-[#14120e] group-hover:opacity-75 transition-opacity whitespace-nowrap">
                The RCC Talkies
              </span>
            </Link>
          </div>
        )}

        {/* Right: Minimalist Hamburger Menu Trigger */}
        <div className={`${showFullHeader ? "w-[30%] sm:w-1/4" : ""} flex justify-end items-center gap-6 pointer-events-auto`}>
          {/* Desktop Quick Nav Links */}
          {showFullHeader && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-sans uppercase tracking-[0.18em] font-medium" aria-label="Quick navigation">
            {siteData.navLinks.slice(1, 6).map((link) => {
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
          )}

          {/* Minimalist 2-line Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex flex-col justify-center items-center w-11 h-11 gap-1 cursor-pointer group pointer-events-auto transition-all relative z-50 ${!showFullHeader ? "bg-[#e5e0d3]/80 backdrop-blur-md rounded-full shadow-sm border border-[#14120e]/15" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-[#14120e] transition-transform origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[2px] bg-[#14120e] transition-opacity"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-[#14120e] transition-transform origin-center"
            />
          </button>
        </div>
      </div>

      {/* Full-Screen Newspaper Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 pt-[72px] sm:pt-[84px] z-40 bg-[#e5e0d3] overflow-y-auto h-[100dvh] pointer-events-auto"
            onClick={() => setMenuOpen(false)}
          >
            <div 
              className="max-w-6xl mx-auto px-6 py-12 flex flex-col justify-between min-h-[calc(100vh-80px)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Banner inside Menu */}
              <div className="border-b border-[#14120e]/20 pb-4 mb-8 flex justify-between items-center text-xs font-sans uppercase tracking-[0.2em] text-[#14120e]/60">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="RCC Talkies" width={20} height={20} className="h-5 w-auto" />
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
