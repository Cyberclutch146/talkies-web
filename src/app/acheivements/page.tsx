"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AchievementForm from "@/components/AchievementForm";
import { AchievementItem } from "@/lib/validations/achievement";

export default function AchievementsPage() {
  const [mySubmissions, setMySubmissions] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch only the currently logged-in student's submissions from the backend.
  // Privacy & ownership are strictly enforced at the database level.
  const fetchMySubmissions = async () => {
    try {
      const studentToken =
        typeof window !== "undefined"
          ? localStorage.getItem("talkies_student_token") || ""
          : "";
      const studentRoll =
        typeof window !== "undefined"
          ? localStorage.getItem("talkies_student_roll") || ""
          : "";

      // If no student token or roll exists yet on this client, there are no submissions
      if (!studentToken && !studentRoll) {
        setMySubmissions([]);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/acheivements", {
        headers: {
          ...(studentToken ? { "x-student-token": studentToken } : {}),
          ...(studentRoll ? { "x-student-roll": studentRoll } : {}),
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.achievements) {
          setMySubmissions(data.achievements);
        }
      }
    } catch (err) {
      console.warn("Could not load submissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  // When a student successfully files a new achievement via the form
  const handleNewSubmission = (newItem: AchievementItem) => {
    setMySubmissions((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);

    // Smooth scroll down to "Your Submissions" section
    setTimeout(() => {
      const el = document.getElementById("your-submissions");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  return (
    <div className="w-full min-h-screen bg-[#161310] text-[#f5efe2] pt-28 sm:pt-36 pb-20 px-3 sm:px-6 relative overflow-hidden">
      {/* Vintage Background Grain & Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: "url('/mask.png')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(15,12,10,0.95)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-12 sm:space-y-16">
        {/* ─────────────────────────────────────────────────────────────
            1. EXISTING SUBMISSION FORM (PRESERVED EXACTLY AS IS)
        ───────────────────────────────────────────────────────────── */}
        <section id="submit-form" className="w-full">
          <AchievementForm onSuccess={handleNewSubmission} />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            2. YOUR SUBMISSIONS SECTION (IMMEDIATELY BELOW THE FORM)
        ───────────────────────────────────────────────────────────── */}
        <section id="your-submissions" className="w-full pt-4">
          {/* Section Masthead */}
          <div className="border-b-2 border-[#ded2bc]/30 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#8c2817]">✦</span>
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#dfcca5]">
                  STUDENT PORTAL ARCHIVE // PRIVATE RECORDS
                </span>
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#f7f2e7]">
                Your Submissions
              </h2>
              <p className="font-mono text-xs sm:text-sm text-[#cfc8bd] mt-1">
                Confidential record of your filed achievements. Visible only to you.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase px-3 py-1 bg-[#251f19] border border-[#ded2bc]/40 text-[#dfcca5]">
                {mySubmissions.length} {mySubmissions.length === 1 ? "RECORD" : "RECORDS"}
              </span>
              <button
                type="button"
                onClick={fetchMySubmissions}
                className="px-3 py-1 bg-[#8c2817] hover:bg-[#721f11] text-[#f7f2e7] font-mono text-xs uppercase tracking-wider font-bold border border-[#161310] transition-colors cursor-pointer"
                title="Refresh your submissions"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* Submissions Container */}
          {isLoading ? (
            <div className="p-12 text-center border-2 border-dashed border-[#ded2bc]/30 bg-[#1c1712]/90">
              <span className="font-mono text-xs uppercase tracking-widest text-[#dfcca5] animate-pulse">
                Fetching your private archive...
              </span>
            </div>
          ) : mySubmissions.length === 0 ? (
            /* Suitable Empty State */
            <div className="p-8 sm:p-14 text-center border-2 border-dashed border-[#ded2bc]/35 bg-[#1e1914] shadow-[4px_4px_0px_#000000] space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full border border-[#ded2bc]/40 flex items-center justify-center text-[#dfcca5]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#f7f2e7]">
                  No Submissions Recorded Yet
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-[#cfc8bd] leading-relaxed">
                  You haven&apos;t submitted any achievements in this session yet. Complete the official form above to record your milestone.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#submit-form"
                  className="inline-block px-5 py-2.5 bg-[#8c2817] hover:bg-[#721f11] text-[#f7f2e7] font-mono text-xs uppercase tracking-widest font-bold border border-[#161310] shadow-[2px_2px_0px_#000000] transition-colors"
                >
                  ↑ Inscribe Your Achievement
                </a>
              </div>
            </div>
          ) : (
            /* Clean List / Card Layout of Logged-in Student's Submissions */
            <div className="space-y-6">
              {mySubmissions.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#ded2bc] text-[#1c1712] border-3 border-[#2b2219] p-4 sm:p-6 shadow-[6px_6px_0px_#0f0c0a] relative overflow-hidden"
                >
                  {/* Subtle paper grain */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-cover bg-center"
                    style={{ backgroundImage: "url('/mask.png')" }}
                  />

                  {/* Top Status & Timestamp Header Strip */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2b2219] pb-3 mb-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1c1712] text-[#f7f2e7] font-bold text-[10px] uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                        STATUS: {item.status || "SUBMITTED"}
                      </span>
                      <span className="font-bold text-[#8c2817] text-[11px] uppercase tracking-wider">
                        [{item.category}]
                      </span>
                    </div>

                    <div className="text-[11px] text-[#1c1712]/70">
                      FILED ON:{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Card Content Grid */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Picture Thumbnail Preview */}
                    {item.picture && (
                      <div className="md:col-span-4">
                        <div className="relative aspect-[4/3] w-full border-2 border-[#2b2219] bg-[#14120e] overflow-hidden shadow-[3px_3px_0px_#2b2219]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.picture}
                            alt={item.fullName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-[#14120e]/90 text-[#f5efe2] text-[9px] font-mono px-1.5 py-0.5">
                            {item.dateYear}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Student Details & Narrative */}
                    <div className={item.picture ? "md:col-span-8 space-y-3" : "md:col-span-12 space-y-3"}>
                      <div>
                        <h3 className="font-serif font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#1c1712]">
                          {item.fullName}
                        </h3>
                        <p className="font-mono text-xs font-bold text-[#8c2817] uppercase tracking-wide mt-0.5">
                          DEPT: {item.department} · ROLL NUMBER: {item.rollNumber}
                        </p>
                      </div>

                      {/* Achievement Narrative Box */}
                      <div className="bg-[#d5c7ad]/80 border-l-4 border-[#8c2817] p-3 text-xs sm:text-sm font-serif leading-relaxed text-[#1c1712] whitespace-pre-wrap">
                        {item.achievements}
                      </div>

                      {/* Additional Notes (if any) */}
                      {item.additionalNotes && (
                        <p className="font-serif italic text-xs text-[#1c1712]/80 pt-1">
                          <span className="font-bold font-mono not-italic uppercase text-[10px] text-[#8c2817]">
                            Notes:{" "}
                          </span>
                          {item.additionalNotes}
                        </p>
                      )}

                      {/* Record ID Footer Tag */}
                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#1c1712]/60 border-t border-[#2b2219]/20">
                        <span>RECORD ID: {item.id}</span>
                        <span>OFFICIAL TALKIES DATABASE ENTRY</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
