"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AchievementPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Trigger popup exactly 0.3s after the RCC Talkies hero title animation completes (1.0s + 0.3s = 1.3s)
  useEffect(() => {
    if (pathname !== "/") return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle ESC key to dismiss the popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cross button simply closes / dismisses the popup
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. MINIMAL VINTAGE FLOATING PILL (When closed on homepage)
      ───────────────────────────────────────────────────────────── */}
      {pathname === "/" && !isOpen && (
        <motion.button
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 bg-[#f4ece1] border-2 border-[#1c1611] px-4 py-2.5 shadow-[4px_4px_0px_#1c1611] hover:shadow-[2px_2px_0px_#1c1611] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#8b2512] hover:text-[#f8f3ea] transition-all cursor-pointer font-serif"
          title="Submission Portal is Live — Click to open announcement"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#8b2512] group-hover:bg-[#f8f3ea] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#1c1611] group-hover:text-[#f8f3ea]">
            ✦ Portal is Live
          </span>
        </motion.button>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. VINTAGE "SUBMISSION PORTAL IS LIVE" DIALOG BOX
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Dark sepia backdrop with soft blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 bg-[#0c0906]/85 backdrop-blur-xs cursor-pointer"
            />

            {/* Vintage Broadside Newspaper Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[450px] my-auto bg-[#f6f1e5] text-[#1a140e] border-[4px] border-[#1a140e] shadow-[0_30px_70px_rgba(0,0,0,0.6),8px_8px_0px_#8b2512] p-2.5 sm:p-3 z-10 select-none sm:select-auto"
            >
              {/* Inner Double Pinstripe Ticket Frame */}
              <div className="relative border-2 border-[#1a140e] p-6 sm:p-8 bg-[#f8f3ea] overflow-hidden text-center">
                
                {/* 4 Victorian Ornate Corner Accents */}
                <span className="absolute top-1.5 left-2 text-xs text-[#1a140e]/40 select-none">❖</span>
                <span className="absolute top-1.5 right-2 text-xs text-[#1a140e]/40 select-none">❖</span>
                <span className="absolute bottom-1.5 left-2 text-xs text-[#1a140e]/40 select-none">❖</span>
                <span className="absolute bottom-1.5 right-2 text-xs text-[#1a140e]/40 select-none">❖</span>

                {/* ── CROSS BUTTON (✕) ──
                    Dismisses / closes the dialog directly */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 border-2 border-[#1a140e] bg-[#ede3d1] hover:bg-[#8b2512] hover:text-[#f7f2e7] text-sm font-serif font-black flex items-center justify-center transition-all cursor-pointer shadow-[2px_2px_0px_#1a140e] hover:shadow-[1px_1px_0px_#1a140e] hover:translate-x-[1px] hover:translate-y-[1px] z-20 group"
                  aria-label="Close dialog"
                  title="Close (Esc)"
                >
                  <span className="transition-transform group-hover:scale-110">✕</span>
                </button>

                {/* Top Live Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#8b2512]/40 bg-[#8b2512]/10 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b2512] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b2512]" />
                  </span>
                  <span className="font-serif text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#8b2512]">
                    OFFICIAL DISPATCH · LIVE NOW
                  </span>
                </div>

                {/* Emblem & Masthead */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Image
                    src="/logo.png"
                    alt="The RCC Talkies Emblem"
                    width={22}
                    height={22}
                    className="h-5 w-auto object-contain opacity-90"
                  />
                  <span className="font-gothic text-xl sm:text-2xl text-[#1a140e] tracking-wide">
                    The RCC Talkies
                  </span>
                </div>

                {/* Ornate Divider */}
                <div className="flex items-center justify-center gap-2 my-2.5 opacity-60">
                  <span className="h-[1px] bg-[#1a140e] flex-1" />
                  <span className="text-[10px] text-[#8b2512]">❦</span>
                  <span className="h-[1px] bg-[#1a140e] flex-1" />
                </div>

                {/* Main Focused Headline */}
                <h2 className="font-serif font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#1a140e] leading-[1.05] mt-1 mb-2">
                  SUBMISSION<br />
                  PORTAL<br />
                  <span className="text-[#8b2512] font-display-serif italic font-normal normal-case text-2xl sm:text-3xl">
                    is Officially Live!
                  </span>
                </h2>

                {/* Clean, high-impact description */}
                <p className="font-serif text-sm sm:text-[14px] text-[#1a140e]/85 leading-relaxed max-w-sm mx-auto my-3.5">
                  Have you landed a placement, won a hackathon,
                  <br className="hidden sm:inline" />
                  published research, or triumphed in sports & arts?
                  <br />
                  <span className="font-semibold text-[#8b2512]">
                    The student achievements portal is now open
                  </span>{" "}
                  for
                  <br className="hidden sm:inline" />
                  documentation in the official Hall of Fame archives.
                </p>

                {/* Ornate Divider */}
                <div className="w-16 h-[2px] bg-[#8b2512] mx-auto my-3 opacity-50" />

                {/* CTA — Navigate to Achievements */}
                <Link
                  href="/achievements"
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 mt-2 mb-3 px-5 py-2 border border-[#8b2512] text-[#8b2512] font-serif font-semibold text-sm uppercase tracking-[0.12em] hover:bg-[#8b2512] hover:text-[#f8f3ea] transition-all duration-200 cursor-pointer"
                >
                  View Acheivements
                  <span className="text-xs leading-none">→</span>
                </Link>

                {/* Subtle footnote */}
                <p className="font-serif italic text-xs text-[#1a140e]/60 tracking-wide mt-3">
                  Access the portal anytime via the navigation menu.
                </p>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

