"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { achievementCategories, AchievementItem } from "@/lib/validations/achievement";

interface AchievementFormProps {
  onSuccess?: (item: AchievementItem) => void;
  className?: string;
}

export default function AchievementForm({ onSuccess, className = "" }: AchievementFormProps) {
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [achievements, setAchievements] = useState("");
  const [pictureDataUrl, setPictureDataUrl] = useState<string>("");
  const [pictureName, setPictureName] = useState<string>("");
  const [pictureSize, setPictureSize] = useState<string>("");
  const [dateYear, setDateYear] = useState("");
  const [category, setCategory] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<AchievementItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection & convert to optimized Data URL
  const handleFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        picture: "Only JPG, PNG or WebP images are allowed.",
      }));
      return;
    }

    const maxSize = 8 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        picture: "Image size must be under 8MB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL("image/webp", 0.82);
            setPictureDataUrl(optimizedDataUrl);
            setPictureName(file.name);
            const approxKB = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);
            setPictureSize(`${approxKB} KB (Optimized)`);
          } else {
            setPictureDataUrl(rawDataUrl);
            setPictureName(file.name);
            setPictureSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
          }
        } catch {
          setPictureDataUrl(rawDataUrl);
          setPictureName(file.name);
          setPictureSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        }

        setErrors((prev) => {
          const next = { ...prev };
          delete next.picture;
          return next;
        });
      };
      img.onerror = () => {
        setPictureDataUrl(rawDataUrl);
        setPictureName(file.name);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removePicture = () => {
    setPictureDataUrl("");
    setPictureName("");
    setPictureSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form Validation
  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!department.trim() || department.trim().length < 2) {
      errs.department = "Please enter your department (e.g. CSE, IT, ECE).";
    }

    if (!rollNumber.trim() || rollNumber.trim().length < 3) {
      errs.rollNumber = "Please enter your roll number (e.g. 23BCS001).";
    }

    if (!achievements.trim() || achievements.trim().length < 10) {
      errs.achievements = "Please describe your achievement (at least 10 characters).";
    }

    if (!pictureDataUrl) {
      errs.picture = "Please upload an achievement picture.";
    }

    if (!dateYear.trim() || dateYear.trim().length < 3) {
      errs.dateYear = "Please specify the date or year (e.g. 2024 / 2025).";
    }

    if (!category || category === "Select category") {
      errs.category = "Please select a category.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: fullName.trim(),
      department: department.trim().toUpperCase(),
      rollNumber: rollNumber.trim().toUpperCase(),
      achievements: achievements.trim(),
      picture: pictureDataUrl,
      dateYear: dateYear.trim(),
      category,
      additionalNotes: additionalNotes.trim(),
      _honey: honeypot,
    };

    try {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("talkies_student_token") || ""
          : "";

      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { "x-student-token": storedToken } : {}),
          "x-student-roll": rollNumber.trim().toUpperCase(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const newItem: AchievementItem = data.achievement;

        try {
          if (data.studentToken) {
            localStorage.setItem("talkies_student_token", data.studentToken);
          }
          if (newItem.rollNumber) {
            localStorage.setItem("talkies_student_roll", newItem.rollNumber);
          }
        } catch {
          // ignore
        }

        setSubmittedItem(newItem);
        setSubmitSuccess(true);
        if (onSuccess) {
          onSuccess(newItem);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          _form: data.error || "Failed to submit achievement. Please try again.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        _form: "Network error. Please try again later.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setDepartment("");
    setRollNumber("");
    setAchievements("");
    setPictureDataUrl("");
    setPictureName("");
    setPictureSize("");
    setDateYear("");
    setCategory("");
    setAdditionalNotes("");
    setErrors({});
    setSubmitSuccess(false);
    setSubmittedItem(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ═══════════════════════════════════════════════════════════════
          AUTHENTIC VINTAGE SCRAPBOOK POSTER CONTAINER
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full max-w-4xl mx-auto bg-[#cbbda3] text-[#1c1712] border-4 border-[#2b2219] shadow-[0_25px_60px_rgba(0,0,0,0.7),10px_10px_0px_#14120e] p-3 sm:p-5 overflow-hidden select-none sm:select-auto">

        {/* Vintage Paper Texture & Subtle Grain Overlay */}

        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply bg-cover bg-center"
          style={{ backgroundImage: "url('/mask.png')" }}
        />

        {/* Outer Frame Pinstripe */}
        <div className="relative border-2 border-[#2b2219]/60 p-2 sm:p-3 bg-[#cfc1a7]/90">

          {/* ── SCRAPBOOK CORNER DOODLES (desktop only) ── */}
          <span className="hidden md:block absolute top-2 left-3 text-[#8c2817]/25 text-lg select-none pointer-events-none">❖</span>
          <span className="hidden md:block absolute top-2 right-3 text-[#8c2817]/25 text-lg select-none pointer-events-none">❖</span>
          <span className="hidden md:block absolute bottom-2 left-3 text-[#8c2817]/25 text-lg select-none pointer-events-none">❖</span>
          <span className="hidden md:block absolute bottom-2 right-3 text-[#8c2817]/25 text-lg select-none pointer-events-none">❖</span>

          {/* ── TOP HEADER BAR: ✦ RCC TALKIES / YOUR JOURNEY / OUR DATABASE ✦ ── */}
          <div className="flex items-center justify-between border-b-2 border-[#2b2219] pb-2 mb-3 text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] font-bold text-[#1c1712]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[#8c2817] text-sm">✦</span>
              <span className="font-display tracking-tight text-sm sm:text-base text-[#1c1712]">
                RCC TALKIES
              </span>
            </div>
            <div className="hidden sm:block flex-1 mx-4 border-b border-[#2b2219]/40" />
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-[#1c1712]/90">
              <span>YOUR JOURNEY</span>
              <span className="text-[#8c2817]">/</span>
              <span>OUR DATABASE</span>
              <span className="text-[#8c2817] text-sm">✦</span>
            </div>
          </div>

          {/* ── RIPPED BLACK PAPER HERO BANNER ── */}
          <div className="relative bg-[#161310] text-[#f7f2e7] p-4 sm:p-6 mb-5 border-2 border-[#1c1712] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] overflow-hidden">

            {/* Subtle mask texture inside torn header */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: "url('/mask.png')" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left Side: Stencil Label + Giant Title + Subtitle */}
              <div className="space-y-2 max-w-xl">
                {/* SUBMIT YOUR Stencil Sticker */}
                <div className="inline-block transform -rotate-3 bg-[#f5efe2] text-[#161310] border border-[#161310] px-3 py-0.5 shadow-[2px_2px_0px_#8c2817]">
                  <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.22em]">
                    SUBMIT YOUR
                  </span>
                </div>

                {/* Big Vintage Title: Achievement Form RCC Talkies ★ */}
                <div className="pt-0.5">
                  <h2 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#f7f2e7] tracking-tight leading-none drop-shadow-md">
                    Achievement
                  </h2>
                  <div className="flex items-baseline gap-2 flex-wrap mt-1">
                    <span className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#f7f2e7] tracking-tight leading-none drop-shadow-md">
                      Form
                    </span>
                    <span className="font-serif italic text-2xl sm:text-4xl text-[#dfcca5] font-normal tracking-wide ml-1">
                      RCC Talkies
                    </span>
                    <span className="text-[#8c2817] text-xl sm:text-2xl">★</span>
                  </div>
                </div>

                {/* Monospace Subtitle */}
                <div className="pt-1.5 font-mono text-xs sm:text-[13px] text-[#cfc8bd] leading-relaxed max-w-md">
                  <p className="font-medium text-[#f5efe2]">Your hard work deserves to be seen.</p>
                  <p className="text-[#cfc8bd]/80">Share your achievements with RCC Talkies.</p>
                </div>
              </div>

              {/* Right Side Scrapbook Graphics: Small Steps Big Dreams + Movie Camera + Newspaper */}
              <div className="hidden sm:flex flex-col items-end gap-1.5 text-right select-none">
                <div className="font-serif italic text-xs sm:text-sm text-[#e0cfab] tracking-wide">
                  Small Steps<br />Big Dreams
                </div>

                <div className="flex items-center gap-3">
                  {/* Retro Movie Projector Camera SVG */}
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#f7f2e7] opacity-90 drop-shadow-md"
                  >
                    <circle cx="20" cy="16" r="10" stroke="currentColor" strokeWidth="2.2" />
                    <circle cx="20" cy="16" r="3" fill="currentColor" />
                    <line x1="20" y1="6" x2="20" y2="26" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="10" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="44" cy="16" r="10" stroke="currentColor" strokeWidth="2.2" />
                    <circle cx="44" cy="16" r="3" fill="currentColor" />
                    <line x1="44" y1="6" x2="44" y2="26" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="34" y1="16" x2="54" y2="16" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="26" width="36" height="22" rx="2" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2.2" />
                    <polygon points="50,32 62,26 62,42 50,38" fill="currentColor" opacity="0.85" />
                    <line x1="32" y1="48" x2="32" y2="58" stroke="currentColor" strokeWidth="2.2" />
                    <line x1="32" y1="58" x2="18" y2="64" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="58" x2="46" y2="64" stroke="currentColor" strokeWidth="2" />
                  </svg>

                  {/* Folded Newspaper Clipping Graphic */}
                  <div className="bg-[#f0e8d8] text-[#14120e] p-2 border-2 border-[#14120e] shadow-[3px_3px_0px_#8c2817] transform rotate-3 w-24">
                    <div className="border-b border-[#14120e] pb-0.5 mb-1 text-center font-display text-[9px] uppercase tracking-wider text-[#14120e]">
                      RCC Talkies
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-[#14120e]/70 rounded-xs" />
                      <div className="h-1 bg-[#14120e]/50 rounded-xs w-4/5" />
                      <div className="h-1 bg-[#14120e]/50 rounded-xs w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── FORM BODY ── */}
          <div className="w-full">
            <div className="bg-[#ded2bc] border-2 border-[#2b2219] p-4 sm:p-6 lg:p-8 shadow-[3px_3px_0px_#2b2219] relative overflow-visible">

              {/* ── PAPERCLIP (top-left, desktop) ── */}
              <div className="hidden md:block absolute -top-6 left-10 z-20 select-none pointer-events-none">
                <svg width="32" height="56" viewBox="0 0 28 48" fill="none" className="text-[#8a8070] drop-shadow-md">
                  <path d="M10 8V34C10 38.5 13.5 42 18 42C22.5 42 26 38.5 26 34V6C26 3 23 0.5 19.5 0.5C16 0.5 13 3 13 6V30C13 32.5 15 34 17 34C19 34 21 32.5 21 30V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* ── RED PUSH PIN (top-left corner, desktop) ── */}
              <div className="hidden md:block absolute -top-3 left-28 z-20 select-none pointer-events-none">
                <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                  <circle cx="11" cy="8" r="7" fill="#8c2817" stroke="#5a1a0f" strokeWidth="1.5" />
                  <circle cx="11" cy="8" r="3" fill="#b8432e" opacity="0.7" />
                  <line x1="11" y1="15" x2="11" y2="27" stroke="#6b6054" strokeWidth="1.8" />
                </svg>
              </div>

              {/* ── RED PUSH PIN (top-right, desktop) ── */}
              <div className="hidden md:block absolute -top-3 right-12 z-20 select-none pointer-events-none">
                <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                  <circle cx="11" cy="8" r="7" fill="#8c2817" stroke="#5a1a0f" strokeWidth="1.5" />
                  <circle cx="11" cy="8" r="3" fill="#b8432e" opacity="0.7" />
                  <line x1="11" y1="15" x2="11" y2="27" stroke="#6b6054" strokeWidth="1.8" />
                </svg>
              </div>

              {/* ── STICKY NOTE (top-right, desktop) — bigger with fold ── */}
              <div className="hidden lg:block absolute -top-8 -right-5 z-20 select-none pointer-events-none">
                <div className="transform rotate-4 w-44 shadow-[3px_4px_8px_rgba(0,0,0,0.2)]" style={{ background: 'linear-gradient(135deg, #fef3c7 85%, #e8d5a0 85%)' }}>
                  <div className="border border-[#d4a017]/30 px-3.5 py-3">
                    <p className="font-serif italic text-[11px] text-[#5c4a1e] leading-snug">
                      &ldquo;Great achievements aren&apos;t born in comfort zones.&rdquo;
                    </p>
                    <div className="mt-2 w-full h-px bg-[#d4a017]/25" />
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[#8c2817] text-sm">★</span>
                      <span className="font-mono text-[7px] uppercase tracking-widest text-[#8b7530]">— RCC Talkies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── WIDE WASHI TAPE (top-center, desktop) ── */}
              <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 z-20 select-none pointer-events-none">
                <div className="w-32 h-7 bg-[#8c2817]/65 transform -rotate-1" style={{ clipPath: 'polygon(1% 0%, 99% 2%, 100% 100%, 0% 98%)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[7px] text-[#f7f2e7]/60 uppercase tracking-[0.3em]">RCC ✦ TALKIES</span>
                  </div>
                </div>
              </div>

              {/* ── CIRCULAR RUBBER STAMP SEAL (right side, desktop) ── */}
              <div className="hidden lg:block absolute top-28 -right-10 z-10 select-none pointer-events-none transform rotate-12 opacity-[0.18]">
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                  <circle cx="70" cy="70" r="62" stroke="#8c2817" strokeWidth="4" />
                  <circle cx="70" cy="70" r="55" stroke="#8c2817" strokeWidth="1.5" />
                  <circle cx="70" cy="70" r="50" stroke="#8c2817" strokeWidth="0.5" strokeDasharray="3 3" />
                  <text x="70" y="62" textAnchor="middle" fill="#8c2817" fontSize="11" fontFamily="serif" fontWeight="bold" letterSpacing="3">OFFICIAL</text>
                  <text x="70" y="78" textAnchor="middle" fill="#8c2817" fontSize="7" fontFamily="monospace" letterSpacing="2">RCC TALKIES</text>
                  <line x1="30" y1="67" x2="55" y2="67" stroke="#8c2817" strokeWidth="0.8" />
                  <line x1="85" y1="67" x2="110" y2="67" stroke="#8c2817" strokeWidth="0.8" />
                  <text x="70" y="92" textAnchor="middle" fill="#8c2817" fontSize="18">★</text>
                </svg>
              </div>

              {/* ── CINEMA FILM STRIP (left edge, desktop) ── */}
              <div className="hidden lg:flex absolute left-0 top-0 bottom-0 w-5 z-[2] select-none pointer-events-none flex-col overflow-hidden opacity-20">
                <div className="w-full h-full bg-[#1c1712]/40 flex flex-col items-center py-2 gap-3">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2 rounded-[1px] bg-[#ded2bc]/80 flex-shrink-0" />
                  ))}
                </div>
              </div>

              {/* ── ADMIT ONE TICKET (floating right, desktop) ── */}
              <div className="hidden lg:block absolute bottom-32 -right-6 z-20 select-none pointer-events-none">
                <div className="transform -rotate-6 bg-[#f5efe2] border-2 border-[#2b2219]/60 w-16 shadow-[2px_3px_6px_rgba(0,0,0,0.15)]" style={{ borderLeft: '3px dashed #8c2817' }}>
                  <div className="px-2 py-3 text-center">
                    <span className="font-display text-[7px] uppercase tracking-wider text-[#8c2817] block">ADMIT</span>
                    <span className="font-serif font-bold text-lg text-[#1c1712] block leading-none">ONE</span>
                    <div className="w-8 h-px bg-[#2b2219]/30 mx-auto my-1" />
                    <span className="font-mono text-[6px] text-[#1c1712]/50 block">No. 2025</span>
                  </div>
                </div>
              </div>

              {/* ── INK SPLATTER (bottom-left, desktop) ── */}
              <div className="hidden lg:block absolute bottom-8 -left-4 z-10 select-none pointer-events-none opacity-[0.06]">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="#1c1712">
                  <circle cx="50" cy="50" r="22" />
                  <circle cx="35" cy="35" r="8" />
                  <circle cx="68" cy="38" r="6" />
                  <circle cx="42" cy="70" r="10" />
                  <circle cx="62" cy="65" r="5" />
                  <circle cx="28" cy="55" r="4" />
                  <circle cx="72" cy="55" r="7" />
                  <circle cx="55" cy="30" r="3" />
                  <circle cx="38" cy="48" r="12" />
                  <circle cx="60" cy="50" r="9" />
                </svg>
              </div>

              {submitSuccess && submittedItem ? (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 px-2 text-center space-y-5"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#1c1712] text-[#f7f2e7] flex items-center justify-center border-2 border-[#8c2817] shadow-[3px_3px_0px_#8c2817]">
                    <span className="text-2xl font-bold">✓</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#8c2817] block">
                      ✦ ARCHIVED IN RCC TALKIES DATABASE ✦
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1c1712]">
                      Achievement Recorded!
                    </h3>
                    <p className="font-serif text-xs sm:text-sm text-[#1c1712]/85 max-w-sm mx-auto">
                      Thank you, <strong className="text-[#1c1712]">{submittedItem.fullName}</strong>. Your story has been successfully filed in the Talkies archives and is recorded in your personal submissions list below.
                    </p>
                  </div>

                  <div className="border border-dashed border-[#2b2219]/40 p-3 bg-[#d5c7ad] text-left text-xs font-mono space-y-1">
                    <div className="flex justify-between border-b border-[#2b2219]/20 pb-1 font-bold text-[#1c1712]">
                      <span>DEPT: {submittedItem.department} · {submittedItem.rollNumber}</span>
                      <span className="text-[#8c2817]">{submittedItem.category}</span>
                    </div>
                    <p className="font-serif italic text-xs text-[#1c1712] pt-1 line-clamp-3">
                      &ldquo;{submittedItem.achievements}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#8c2817] text-[#f7f2e7] font-mono text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-[#721f11] active:scale-[0.98] transition-all shadow-[2px_2px_0px_#14120e] rounded-sm cursor-pointer touch-manipulation"
                    >
                      Submit Another
                    </button>
                    <a
                      href="#your-submissions"
                      className="w-full sm:w-auto min-h-[44px] px-6 py-3 border-2 border-[#1c1712] bg-[#ded2bc] text-[#1c1712] font-mono text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-[#c9bda5] active:scale-[0.98] transition-all text-center rounded-sm touch-manipulation"
                    >
                      View Your Submissions ↓
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* The Retro Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot field for bot suppression */}
                  <input
                    type="text"
                    name="_honey"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {errors._form && (
                    <div className="p-2.5 bg-[#8c2817]/10 border-2 border-[#8c2817] text-[#8c2817] text-xs font-mono font-bold">
                      {errors._form}
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Full Name</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                      }}
                      placeholder="Enter your full name"
                      className={`w-full px-3 py-2 bg-[#f5efe2] border ${errors.fullName ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans placeholder:text-[#1c1712]/45 transition-colors shadow-none outline-none rounded`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Roll Number */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <rect x="2" y="3" width="20" height="18" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                        <path d="M10 9a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                        <line x1="8" y1="14" x2="16" y2="14" />
                      </svg>
                      <span>Roll Number</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => {
                        setRollNumber(e.target.value);
                        if (errors.rollNumber) setErrors((prev) => ({ ...prev, rollNumber: "" }));
                      }}
                      placeholder="e.g. 23BCS001"
                      className={`w-full px-3 py-2 bg-[#f5efe2] border ${errors.rollNumber ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans uppercase text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-none outline-none rounded`}
                    />
                    {errors.rollNumber && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.rollNumber}
                      </p>
                    )}
                  </div>

                  {/* 3. Department */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      <span>Department</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        if (errors.department) setErrors((prev) => ({ ...prev, department: "" }));
                      }}
                      placeholder="e.g. CSE, IT, ECE, EE, AIML..."
                      className={`w-full px-3 py-2 bg-[#f5efe2] border ${errors.department ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans uppercase text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-none outline-none rounded`}
                    />
                    {errors.department && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* 4. Achievements */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M6 4h12v7a6 6 0 0 1-12 0V4Z" />
                      </svg>
                      <span>Achievements</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={achievements}
                      onChange={(e) => {
                        setAchievements(e.target.value);
                        if (errors.achievements) setErrors((prev) => ({ ...prev, achievements: "" }));
                      }}
                      placeholder="Tell us about your achievement(s)..."
                      className={`w-full px-3 py-2 bg-[#f5efe2] border ${errors.achievements ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans placeholder:text-[#1c1712]/45 transition-colors shadow-none outline-none rounded resize-y`}
                    />
                    {errors.achievements && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.achievements}
                      </p>
                    )}
                  </div>

                  {/* ── TORN TICKET STUB DIVIDER with decorative flourish (desktop) ── */}
                  <div className="hidden md:flex items-center gap-3 my-3 select-none pointer-events-none">
                    <div className="flex-1 border-t-2 border-dashed border-[#2b2219]/25" />
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#d5c7ad] border border-[#2b2219]/30 transform -rotate-1 shadow-sm">
                      <span className="text-[#8c2817] text-xs">✂</span>
                      <span className="font-serif italic text-[10px] text-[#1c1712]/60 tracking-wide">tear here</span>
                      <span className="text-[#8c2817] text-xs">✂</span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-[#2b2219]/25" />
                  </div>

                  {/* ── HAND-DRAWN ARROW pointing to upload (desktop) ── */}
                  <div className="hidden lg:block absolute right-4 select-none pointer-events-none" style={{ marginTop: '-8px' }}>
                    <div className="transform rotate-12">
                      <svg width="50" height="35" viewBox="0 0 50 35" fill="none" className="text-[#8c2817]/30">
                        <path d="M2 28 C10 30, 20 25, 28 18 C32 14, 38 8, 45 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
                        <path d="M40 2 L46 5 L40 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                      <span className="font-serif italic text-[8px] text-[#8c2817]/30 block -mt-1 ml-1">upload!</span>
                    </div>
                  </div>

                  {/* 5. Achievement Picture Upload */}
                  <div className="space-y-1 relative">
                    {/* ── TINY TAPE STRIP on upload section (desktop) ── */}
                    <div className="hidden md:block absolute -left-3 top-3 z-10 select-none pointer-events-none">
                      <div className="w-6 h-10 bg-[#8c2817]/50 transform rotate-3 opacity-60" style={{ clipPath: 'polygon(5% 0%, 95% 2%, 100% 100%, 0% 98%)' }} />
                    </div>
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <span>Achievement Picture</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={onFileChange}
                      className="hidden"
                    />

                    {!pictureDataUrl ? (
                      <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg ${isDragging
                            ? "border-[#8c2817] bg-[#8c2817]/10 scale-[1.02]"
                            : errors.picture
                              ? "border-[#8c2817] bg-[#f5efe2]/60"
                              : "border-[#8c2817]/30 bg-[#f5efe2]/70 hover:bg-[#f5efe2] hover:border-[#8c2817]/60"
                          } p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer group`}
                      >
                        <div className="flex flex-col items-center justify-center gap-2.5">
                          <div className="w-12 h-12 rounded-full bg-[#8c2817]/10 flex items-center justify-center group-hover:bg-[#8c2817]/20 group-hover:scale-110 transition-all duration-200">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-[#8c2817]"
                            >
                              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                              <path d="M12 12v9" />
                              <path d="m16 16-4-4-4 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-mono text-xs font-bold text-[#1c1712]">
                              Drop your photo here, or <span className="text-[#8c2817] underline underline-offset-2">browse</span>
                            </p>
                            <p className="font-mono text-[10px] text-[#1c1712]/50 mt-1">
                              JPG, PNG or WebP · Max 8 MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Image Preview */
                      <div className="relative border-2 border-[#2b2219] p-2 bg-[#d7c9b0] flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pictureDataUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover border border-[#2b2219]"
                        />
                        <div className="min-w-0 flex-1 font-mono text-xs">
                          <p className="font-bold text-[#1c1712] truncate">{pictureName}</p>
                          <p className="text-[10px] text-[#1c1712]/70">{pictureSize}</p>
                        </div>
                        <button
                          type="button"
                          onClick={removePicture}
                          className="px-2.5 py-1 bg-[#8c2817] text-[#f7f2e7] text-xs font-mono font-bold hover:bg-[#6c1d0f] transition-colors"
                        >
                          ✕ Remove
                        </button>
                      </div>

                    )}

                    {errors.picture && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.picture}
                      </p>
                    )}
                  </div>

                  {/* ── ORNAMENTAL FLOURISH DIVIDER (desktop) ── */}
                  <div className="hidden md:flex items-center justify-center gap-2 my-1 select-none pointer-events-none">
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" className="text-[#2b2219]/20">
                      <path d="M0 6 C5 2, 10 2, 15 6 C20 10, 25 10, 30 6 C35 2, 38 4, 40 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                    <span className="text-[#8c2817]/30 text-xs">✦</span>
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" className="text-[#2b2219]/20 scale-x-[-1]">
                      <path d="M0 6 C5 2, 10 2, 15 6 C20 10, 25 10, 30 6 C35 2, 38 4, 40 6" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                  </div>

                  {/* 6. Date / Year */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Date / Year</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>
                    <input
                      type="text"
                      value={dateYear}
                      onChange={(e) => {
                        setDateYear(e.target.value);
                        if (errors.dateYear) setErrors((prev) => ({ ...prev, dateYear: "" }));
                      }}
                      placeholder="e.g. 2024 / 2025"
                      className={`w-full px-3 py-2 bg-[#f5efe2] border ${errors.dateYear ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans placeholder:text-[#1c1712]/45 transition-colors shadow-none outline-none rounded`}
                    />
                    {errors.dateYear && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.dateYear}
                      </p>
                    )}
                  </div>

                  {/* 7. Category */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      <span>Category</span>
                      <span className="text-[#8c2817]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                      }}
                      className={`w-full px-3 py-2 bg-[#f5efe2] border ${errors.category ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans transition-colors shadow-none outline-none rounded`}
                    >
                      <option value="">Select category</option>
                      {achievementCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* 8. Additional Notes */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1c1712]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1c1712]">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>Additional Notes (Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any extra details..."
                      className="w-full px-3 py-2 bg-[#f5efe2] border border-[#5c4f40]/80 focus:bg-white focus:border-[#8c2817] focus:ring-2 focus:ring-[#8c2817]/20 text-xs sm:text-sm font-sans text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-none outline-none rounded resize-y"
                    />
                  </div>

                  {/* ── VINTAGE STAMP SEAL (desktop, beside submit) ── */}
                  <div className="hidden md:flex items-center gap-4 mt-4 mb-1 select-none pointer-events-none">
                    <div className="flex-1 h-px bg-[#2b2219]/25" />
                    <div className="flex items-center gap-2 text-[#8c2817]/50">
                      <span className="text-xs">✦</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">Official RCC Talkies Dispatch</span>
                      <span className="text-xs">✦</span>
                    </div>
                    <div className="flex-1 h-px bg-[#2b2219]/25" />
                  </div>

                  {/* ── RETRO SUBMIT BUTTON ── */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] mt-2 py-4 px-4 bg-[#8c2817] hover:bg-[#721f11] hover:scale-[1.01] active:scale-[0.98] text-[#f7f2e7] font-mono font-bold text-sm sm:text-base tracking-widest uppercase flex items-center justify-center gap-2.5 border-2 border-[#1c1712] rounded-sm shadow-[3px_3px_0px_#14120e] hover:shadow-[5px_5px_0px_#14120e] disabled:opacity-50 cursor-pointer transition-all duration-200 touch-manipulation"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#f7f2e7] border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f7f2e7]">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        <span>Submit Achievement</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── DREAM·PLAN·ACHIEVE sticker (bottom-right, desktop) ── */}
            <div className="hidden md:block absolute -bottom-4 right-6 z-20 select-none pointer-events-none">
              <div className="transform rotate-2 bg-[#8c2817] text-[#f7f2e7] px-4 py-2 text-center border border-[#14120e] shadow-[3px_3px_0px_#14120e]">
                <span className="font-display text-xs uppercase tracking-wider">Dream • Plan • Achieve</span>
              </div>
            </div>

            {/* ── BOTTOM-LEFT WASHI TAPE (desktop) ── */}
            <div className="hidden md:block absolute -bottom-2 left-16 z-20 select-none pointer-events-none">
              <div className="w-20 h-6 bg-[#2b6e4f]/50 transform rotate-3" style={{ clipPath: 'polygon(2% 0%, 98% 3%, 100% 100%, 0% 97%)' }} />
            </div>

            {/* ── CLASSIFIED DIAGONAL STAMP (desktop) ── */}
            <div className="hidden lg:flex absolute inset-0 items-center justify-center z-[1] select-none pointer-events-none overflow-hidden">
              <div className="transform -rotate-[18deg] border-[5px] border-[#8c2817]/[0.08] rounded-sm px-12 py-4">
                <span className="font-display text-6xl tracking-[0.35em] text-[#8c2817]/[0.06] uppercase">Classified</span>
              </div>
            </div>

            {/* ── SECOND PAPERCLIP (bottom-left, desktop) ── */}
            <div className="hidden md:block absolute -bottom-5 left-40 z-20 select-none pointer-events-none transform rotate-180">
              <svg width="24" height="42" viewBox="0 0 28 48" fill="none" className="text-[#8a8070] drop-shadow-sm">
                <path d="M10 8V34C10 38.5 13.5 42 18 42C22.5 42 26 38.5 26 34V6C26 3 23 0.5 19.5 0.5C16 0.5 13 3 13 6V30C13 32.5 15 34 17 34C19 34 21 32.5 21 30V10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>

          </div>

          {/* ── BOTTOM BANNER: BUILD ✦ GROW ✦ SHINE ── */}
          <div className="mt-4 pt-2.5 border-t-2 border-[#2b2219] flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold text-[#1c1712]/85">
            <span className="h-px bg-[#2b2219]/40 flex-1" />
            <span>BUILD</span>
            <span className="text-[#8c2817]">✦</span>
            <span>GROW</span>
            <span className="text-[#8c2817]">✦</span>
            <span>SHINE</span>
            <span className="h-px bg-[#2b2219]/40 flex-1" />
          </div>

        </div>
      </div>
    </div>
  );
}
