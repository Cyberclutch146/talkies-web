"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DecryptedText from "@/components/DecryptedText";
import AchievementForm from "@/components/AchievementForm";
import { AchievementItem, achievementCategories } from "@/lib/validations/achievement";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<AchievementItem | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Active index for the one-by-one animated showcase
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Real-time synchronization directly with Firebase Firestore:
  // Whenever any document is added OR deleted in Firestore (e.g. from Firebase Console),
  // this listener automatically updates the website in real time!
  useEffect(() => {
    // Purge any stale local cache from previous sessions
    try {
      localStorage.removeItem("rcc_user_achievements");
    } catch {
      // ignore
    }

    const colRef = collection(db, "achievements");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const liveItems: AchievementItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            fullName: data.fullName || "",
            department: data.department || "",
            rollNumber: data.rollNumber || "",
            achievements: data.achievements || "",
            picture: data.picture || "",
            dateYear: data.dateYear || "",
            category: data.category || "Other",
            additionalNotes: data.additionalNotes || undefined,
            featured: !!data.featured,
            createdAt: data.createdAt || new Date().toISOString(),
          } as AchievementItem;
        });

        // Sort newest first
        liveItems.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAchievements(liveItems);
      },
      async (err) => {
        console.warn("[Firestore] Real-time listener fallback:", err.message);
        try {
          const res = await fetch("/api/achievements", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.achievements) {
              setAchievements(data.achievements);
            }
          }
        } catch (fetchErr) {
          console.error("Fetch fallback error:", fetchErr);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered list based on category & search query
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.fullName.toLowerCase().includes(q) ||
        (item.department && item.department.toLowerCase().includes(q)) ||
        item.rollNumber.toLowerCase().includes(q) ||
        item.achievements.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.dateYear.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [achievements, selectedCategory, searchQuery]);

  // Keep activeIdx within range when filtered list changes
  useEffect(() => {
    if (activeIdx >= filteredAchievements.length) {
      setActiveIdx(0);
    }
  }, [filteredAchievements.length, activeIdx]);

  // Auto-advance timer: moves one-by-one from left to right
  useEffect(() => {
    if (!isAutoPlaying || filteredAchievements.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % filteredAchievements.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredAchievements.length]);

  const handleNext = () => {
    if (filteredAchievements.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % filteredAchievements.length);
  };

  const handlePrev = () => {
    if (filteredAchievements.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + filteredAchievements.length) % filteredAchievements.length);
  };

  // Handler when user submits a new achievement from the form
  const handleNewAchievement = (newItem: AchievementItem) => {
    setAchievements((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
    setHighlightedId(newItem.id);
    setActiveIdx(0);

    // Smooth scroll up to the database section so user immediately sees their card
    setTimeout(() => {
      const dbElement = document.getElementById("achievement-database");
      if (dbElement) {
        dbElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);

    // Remove highlight after 8 seconds
    setTimeout(() => {
      setHighlightedId(null);
    }, 8000);
  };

  const activeAchievement = filteredAchievements[activeIdx] || filteredAchievements[0];

  return (
    <div className="w-full bg-[#e5e0d3] text-[#14120e]">
      {/* ─────────────────────────────────────────────────────────────
          1. INVERTED BLACK HEADER BANNER (Matches user screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#14120e] text-[#e5e0d3] pt-32 sm:pt-40 pb-10 sm:pb-14 px-4 sm:px-8 border-b-2 border-[#14120e]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#c83a1a]">✦</span>
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c83a1a] font-bold">
                THE RCC TALKIES ARCHIVE // HALL OF FAME
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#e5e0d3] leading-none">
              <DecryptedText
                text="ACHIEVEMENTS"
                animateOn="view"
                speed={35}
                maxIterations={8}
                sequential={true}
                revealDirection="start"
                className="text-[#e5e0d3]"
                encryptedClassName="text-[#c83a1a]"
              />
            </h1>
          </div>

          <div className="max-w-md space-y-4">
            <p className="font-serif text-sm sm:text-base text-[#e5e0d3]/80 leading-relaxed">
              Every breakthrough, podium finish, research paper, and code sprint matters. Explore student triumphs below or submit your own achievement to the permanent archive.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#achievement-database"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c83a1a] text-[#e5e0d3] font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#a82e13] transition-colors shadow-[2px_2px_0px_#14120e]"
              >
                <span>VIEW HALL OF FAME ({achievements.length})</span>
                <span>↓</span>
              </a>
              <a
                href="#submit-section"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e5e0d3]/40 bg-[#1e1a15] text-[#e5e0d3] font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#e5e0d3] hover:text-[#14120e] transition-colors"
              >
                <span>SUBMIT ACHIEVEMENT</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL STATEMENT / STRIP
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-[#14120e]/20 bg-[#ded8c7]/50 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans uppercase tracking-[0.18em] text-[#14120e]/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c83a1a] animate-pulse" />
            <span className="font-bold">LIVE REGISTRY</span>
            <span className="text-[#14120e]/40">·</span>
            <span>RCCIIT STUDENT MILESTONES</span>
          </div>
          <div className="text-[11px] font-mono text-[#14120e]/60">
            UPDATED DAILY · REVIEWED BY EDITORIAL DESK
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. OUR DATABASE / THE HALL OF FAME (ANIMATED LTR & ONE BY ONE)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="achievement-database"
        className="w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#e5dfcf] border-b-2 border-[#14120e]"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header of Database */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#14120e] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#c83a1a]">✦</span>
                <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#c83a1a]">
                  ARCHIVE // OUR DATABASE
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#14120e]">
                Student Achievement Hall
              </h2>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#14120e]/50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, dept, roll no, keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5efe2] border-2 border-[#14120e] text-xs sm:text-sm font-mono text-[#14120e] placeholder:text-[#14120e]/50 focus:bg-white focus:outline-none shadow-[3px_3px_0px_#14120e]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono uppercase font-bold text-[#c83a1a]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-2 ${
                  selectedCategory === "All"
                    ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e] shadow-[2px_2px_0px_#c83a1a]"
                    : "bg-[#f5efe2] text-[#14120e] border-[#14120e]/40 hover:border-[#14120e]"
                }`}
              >
                All ({achievements.length})
              </button>
              {achievementCategories.map((cat) => {
                const count = achievements.filter((a) => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-2 ${
                      selectedCategory === cat
                        ? "bg-[#14120e] text-[#e5e0d3] border-[#14120e] shadow-[2px_2px_0px_#c83a1a]"
                        : "bg-[#f5efe2] text-[#14120e] border-[#14120e]/40 hover:border-[#14120e]"
                    }`}
                  >
                    {cat} {count > 0 ? `(${count})` : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              ANIMATED STAGE (ONE BY ONE MOVING LEFT TO RIGHT)
          ───────────────────────────────────────────────────────── */}
          {achievements.length === 0 ? (
            <div className="py-16 text-center border-3 border-dashed border-[#14120e]/30 bg-[#f5efe2] p-8 sm:p-12 space-y-4 shadow-[6px_6px_0px_#14120e]">
              <span className="text-3xl text-[#c83a1a]">❦</span>
              <h3 className="font-display-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#14120e]">
                No Dispatches Filed Yet
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#14120e]/80 max-w-md mx-auto">
                Be the first student of RCCIIT to inscribe your achievement into the Talkies official archives.
              </p>
              <div className="pt-2">
                <a
                  href="#submit-achievement"
                  className="inline-block px-6 py-3 bg-[#c83a1a] text-[#f5efe2] font-mono text-xs uppercase tracking-widest font-bold border-2 border-[#14120e] shadow-[3px_3px_0px_#14120e] hover:shadow-[1px_1px_0px_#14120e] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  ✦ Inscribe Your Achievement ↗
                </a>
              </div>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-[#14120e]/40 bg-[#f5efe2] p-8 space-y-4">
              <p className="font-serif italic text-lg text-[#14120e]/70">
                No achievements match your query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 bg-[#14120e] text-[#e5e0d3] font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#c83a1a] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Controls bar: Previous, Next, Auto-play toggle, Counter */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#14120e] text-[#e5e0d3] p-3 sm:p-4 border-2 border-[#14120e] shadow-[4px_4px_0px_#14120e]">
                <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest">
                  <span className="text-[#c83a1a] text-sm">✦</span>
                  <span>
                    ACHIEVEMENT {String(activeIdx + 1).padStart(2, "0")} / {String(filteredAchievements.length).padStart(2, "0")}
                  </span>
                  <span className="hidden sm:inline text-[#e5e0d3]/40">·</span>
                  <span className="hidden sm:inline text-xs text-[#e5e0d3]/70 font-normal">
                    ANIMATING RIGHT TO LEFT ONE BY ONE
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Pause / Play Button */}
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="px-3 py-1.5 border border-[#e5e0d3]/40 text-[#e5e0d3] hover:bg-[#e5e0d3] hover:text-[#14120e] text-xs font-mono uppercase tracking-wider transition-colors"
                    title={isAutoPlaying ? "Pause auto-animation" : "Play auto-animation"}
                  >
                    {isAutoPlaying ? "❚❚ Pause" : "▶ Play"}
                  </button>

                  {/* Previous Button (Glides from left) */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-3.5 py-1.5 bg-[#e5e0d3] text-[#14120e] hover:bg-[#c83a1a] hover:text-[#e5e0d3] font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    aria-label="Previous achievement"
                  >
                    ← Prev
                  </button>

                  {/* Next Button (Glides to right) */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3.5 py-1.5 bg-[#c83a1a] text-[#e5e0d3] hover:bg-[#a82e13] font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    aria-label="Next achievement"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* One-by-One Animated Spotlight Stage */}
              <div className="relative overflow-hidden border-4 border-[#14120e] bg-[#f5efe2] p-4 sm:p-8 shadow-[8px_8px_0px_#14120e]">
                {/* Vintage paper watermark */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                  style={{
                    backgroundImage: `radial-gradient(#14120e 0.65px, transparent 0.65px)`,
                    backgroundSize: "7px 7px",
                  }}
                />

                <AnimatePresence mode="wait">
                  {activeAchievement && (
                    <motion.div
                      key={activeAchievement.id}
                      /* GLIDES IN FROM RIGHT TO LEFT */
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
                    >
                      {/* Left: Picture ON TOP of card */}
                      <div className="lg:col-span-6 space-y-3">
                        <div className="relative aspect-[16/10] w-full border-3 border-[#14120e] bg-[#14120e] overflow-hidden shadow-[4px_4px_0px_#14120e]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeAchievement.picture}
                            alt={activeAchievement.fullName}
                            className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                          />
                          {/* Category Tag pill */}
                          <div className="absolute top-3 left-3 bg-[#14120e] text-[#e5e0d3] text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border border-[#e5e0d3]/40 shadow-sm">
                            {activeAchievement.category}
                          </div>
                          {/* Year Badge */}
                          <div className="absolute bottom-3 right-3 bg-[#f5efe2] text-[#14120e] text-[10px] font-mono font-bold px-2 py-0.5 border border-[#14120e]">
                            {activeAchievement.dateYear}
                          </div>
                        </div>

                        {/* Department & Roll Number Strip */}
                        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#14120e] bg-[#eae3d2] p-2 border border-[#14120e]/30">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#c83a1a]" />
                            DEPT: {activeAchievement.department}
                          </span>
                          <span className="font-mono text-[#14120e]/80">
                            ROLL: {activeAchievement.rollNumber}
                          </span>
                        </div>
                      </div>

                      {/* Right: Narrative Details */}
                      <div className="lg:col-span-6 space-y-4">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#c83a1a] block">
                            ✦ OFFICIAL RCC TALKIES ARCHIVE FEATURE ✦
                          </span>
                          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#14120e] leading-tight">
                            {activeAchievement.fullName}
                          </h3>
                        </div>

                        <div className="border-l-3 border-[#c83a1a] pl-4 py-1 bg-[#eae3d2]/60">
                          <p className="font-serif text-base sm:text-lg text-[#14120e] leading-relaxed">
                            {activeAchievement.achievements}
                          </p>
                        </div>

                        {activeAchievement.additionalNotes && (
                          <p className="font-serif italic text-xs sm:text-sm text-[#14120e]/75">
                            Note: {activeAchievement.additionalNotes}
                          </p>
                        )}

                        <div className="pt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(activeAchievement)}
                            className="px-5 py-2.5 bg-[#14120e] text-[#e5e0d3] hover:bg-[#c83a1a] font-mono text-xs uppercase tracking-widest font-bold transition-colors shadow-[3px_3px_0px_#14120e] cursor-pointer"
                          >
                            Full Dispatch Report →
                          </button>
                          <span className="text-[10px] font-mono text-[#14120e]/60">
                            RECORDED: {new Date(activeAchievement.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ─────────────────────────────────────────────────────
                  CONTINUOUS LEFT-TO-RIGHT ANIMATED MARQUEE FILMSTRIP
              ───────────────────────────────────────────────────── */}
              <div className="border-2 border-[#14120e] bg-[#ded8c7]/80 p-3 overflow-hidden shadow-[4px_4px_0px_#14120e]">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest text-[#14120e] mb-2 border-b border-[#14120e]/30 pb-1">
                  <span>✦ CONTINUOUS FILMSTRIP (HOVER TO PAUSE)</span>
                  <span className="text-[#c83a1a]">← CONTINUOUS TICKER</span>
                </div>

                <div className="relative overflow-hidden w-full py-2">
                  {/* Right-to-Left Moving Track */}
                  <div className="animate-marquee flex items-center gap-4 select-none">
                    {[...filteredAchievements, ...filteredAchievements].map((item, idx) => (
                      <div
                        key={`${item.id}-ticker-${idx}`}
                        onClick={() => {
                          const realIdx = idx % filteredAchievements.length;
                          setActiveIdx(realIdx);
                        }}
                        className={`cursor-pointer flex-shrink-0 w-64 sm:w-72 border-2 ${
                          activeAchievement?.id === item.id
                            ? "border-[#c83a1a] bg-[#faf6ee] shadow-[3px_3px_0px_#c83a1a]"
                            : "border-[#14120e] bg-[#f5efe2] hover:border-[#c83a1a]"
                        } p-3 transition-all flex items-center gap-3`}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 border border-[#14120e] bg-[#14120e] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.picture} alt={item.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-bold text-xs uppercase text-[#14120e] truncate">
                            {item.fullName}
                          </p>
                          <p className="font-mono text-[9px] text-[#c83a1a] truncate">
                            {item.department} · {item.rollNumber}
                          </p>
                          <p className="font-serif text-[10px] text-[#14120e]/75 truncate">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SUBMIT SECTION: VINTAGE SCRAPBOOK POSTER FORM
      ───────────────────────────────────────────────────────────── */}
      <section
        id="submit-achievement"
        className="relative w-full py-16 sm:py-24 px-3 sm:px-6 border-b-2 border-[#14120e] overflow-hidden bg-[#161310]"
      >
        {/* Ambient Dark Vintage Texture Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: "url('/mask.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(15,12,10,0.95)_100%)] pointer-events-none" />

        {/* The Vintage Newspaper Poster Component */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <AchievementForm onSuccess={handleNewAchievement} />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FULL DISPATCH MODAL (ARTICLE / CERTIFICATE POPUP)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14120e]/80 backdrop-blur-xs"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#f5efe2] border-4 border-[#14120e] shadow-[10px_10px_0px_#c83a1a] p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[#14120e]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 border-2 border-[#14120e] bg-[#e5e0d3] hover:bg-[#c83a1a] hover:text-[#e5e0d3] text-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Modal Masthead */}
              <div className="border-b-2 border-[#14120e] pb-3 mb-6">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-[#c83a1a]">
                  <span>✦ RCC TALKIES SPECIAL DISPATCH ✦</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xs text-[#14120e]/60">
                    RECORD ID: {selectedItem.id}
                  </span>
                  <span className="font-mono text-xs text-[#14120e]/60">
                    {selectedItem.dateYear}
                  </span>
                </div>
              </div>

              {/* Student Name, Dept & Roll */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-[#14120e] text-[#e5e0d3] text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5">
                    {selectedItem.category}
                  </span>
                  <span className="inline-block bg-[#c83a1a] text-[#e5e0d3] text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5">
                    {selectedItem.department}
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#14120e]">
                  {selectedItem.fullName}
                </h3>
                <p className="font-mono text-sm text-[#14120e]/75 mt-0.5 font-bold">
                  ROLL NUMBER: {selectedItem.rollNumber}
                </p>
              </div>

              {/* Picture in Modal */}
              <div className="relative aspect-[16/10] w-full border-2 border-[#14120e] bg-[#14120e] mb-6 overflow-hidden shadow-[3px_3px_0px_#14120e]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedItem.picture}
                  alt={selectedItem.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Achievement Narrative */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-[#c83a1a] mb-1">
                    The Achievement
                  </h4>
                  <p className="font-serif text-base sm:text-lg text-[#14120e] leading-relaxed whitespace-pre-wrap">
                    {selectedItem.achievements}
                  </p>
                </div>

                {selectedItem.additionalNotes && (
                  <div className="border-t border-[#14120e]/20 pt-3">
                    <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-[#14120e]/60 mb-1">
                      Additional Notes
                    </h4>
                    <p className="font-serif italic text-sm text-[#14120e]/80 leading-relaxed whitespace-pre-wrap">
                      {selectedItem.additionalNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t-2 border-[#14120e] flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#14120e]/70">
                <span>RCC TALKIES EDITORIAL DESK</span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 bg-[#14120e] text-[#e5e0d3] font-bold hover:bg-[#c83a1a] transition-colors shadow-[2px_2px_0px_#14120e]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
