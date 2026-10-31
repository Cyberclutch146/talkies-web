"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
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

          {/* ── 3-COLUMN SCRAPBOOK BODY (LEFT MARGIN + CENTER FORM + RIGHT MARGIN) ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-start">

            {/* ── LEFT MARGIN COLLAGE ── */}
            <div className="hidden md:flex md:col-span-3 flex-col justify-between self-stretch space-y-5 border-r-2 border-[#2b2219]/35 pr-3 select-none">
              {/* Paperclip graphic & Talent Builds Tomorrow card */}
              <div className="relative pt-3">
                <svg
                  width="26"
                  height="40"
                  viewBox="0 0 28 44"
                  fill="none"
                  className="text-[#4a4035] absolute -top-3 left-3 z-20 drop-shadow"
                >
                  <path
                    d="M10 8V32C10 36 13 39 17 39C21 39 24 36 24 32V6C24 3.5 21.5 1 18.5 1C15.5 1 13 3.5 13 6V29C13 31 14.5 32 16.5 32C18.5 32 20 31 20 29V10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="bg-[#ded3bd] border-2 border-[#2b2219] p-2 text-center pt-5 shadow-[2px_2px_0px_#2b2219]">
                  <h4 className="font-display text-xs sm:text-sm uppercase leading-tight tracking-tight text-[#1c1712]">
                    Talent<br />Builds<br />Tomorrow
                  </h4>
                </div>
              </div>

              {/* Quote note */}
              <div className="border-l-2 border-[#8c2817] pl-2.5 py-1 bg-[#dcd0b9]/60">
                <p className="font-serif italic text-[11px] text-[#1c1712]/90 leading-snug">
                  &ldquo;Great achievements aren&apos;t born in comfort zones.&rdquo;
                </p>
              </div>

              {/* Sepia Victory Crowd Photo */}
              <div className="relative aspect-[3/4] w-full border-2 border-[#2b2219] bg-[#14120e] overflow-hidden shadow-[2px_2px_0px_#2b2219]">
                <Image
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
                  alt="Crowd cheering at fest"
                  fill
                  className="object-cover grayscale contrast-125 opacity-85"
                />
                <div className="absolute inset-0 bg-[#8c2817]/10 mix-blend-multiply" />
                <div className="absolute bottom-1 left-1 right-1 bg-[#14120e]/90 text-[#f5efe2] text-[8px] font-mono text-center px-1 py-0.5 uppercase tracking-widest">
                  CAMPUS MERIT
                </div>
              </div>

              {/* Dream Plan Achieve sticker */}
              <div className="transform -rotate-2 bg-[#8c2817] text-[#f7f2e7] px-2 py-1 text-center border border-[#14120e] shadow-[2px_2px_0px_#14120e]">
                <span className="font-display text-[10px] sm:text-xs uppercase tracking-wider block">
                  Dream • Plan • Achieve
                </span>
              </div>
            </div>

            {/* ── CENTER FORM CONTAINER ── */}
            <div className="md:col-span-6 bg-[#ded2bc] border-2 border-[#2b2219] p-3 sm:p-5 shadow-[3px_3px_0px_#2b2219] relative">
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

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 bg-[#8c2817] text-[#f7f2e7] font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#721f11] transition-colors shadow-[2px_2px_0px_#14120e]"
                    >
                      Submit Another
                    </button>
                    <a
                      href="#your-submissions"
                      className="px-5 py-2.5 border-2 border-[#1c1712] bg-[#ded2bc] text-[#1c1712] font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#c9bda5] transition-colors"
                    >
                      View Your Submissions ↓
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* The Retro Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">
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
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className={`w-full px-3 py-2 bg-[#d4c7b0]/80 border ${errors.fullName ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Roll Number */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className={`w-full px-3 py-2 bg-[#d4c7b0]/80 border ${errors.rollNumber ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono uppercase text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none`}
                    />
                    {errors.rollNumber && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.rollNumber}
                      </p>
                    )}
                  </div>

                  {/* 3. Department */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className={`w-full px-3 py-2 bg-[#d4c7b0]/80 border ${errors.department ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono uppercase text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none`}
                    />
                    {errors.department && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* 4. Achievements */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className={`w-full px-3 py-2 bg-[#d4c7b0]/80 border ${errors.achievements ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none resize-y`}
                    />
                    {errors.achievements && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.achievements}
                      </p>
                    )}
                  </div>

                  {/* 5. Achievement Picture Upload */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                        className={`border-2 border-dashed ${isDragging
                            ? "border-[#8c2817] bg-[#dfcca9]"
                            : errors.picture
                              ? "border-[#8c2817] bg-[#d7c9b0]/60"
                              : "border-[#5c4f40]/80 bg-[#d4c7b0]/60 hover:bg-[#dcd0b9]"
                          } p-4 sm:p-5 text-center transition-colors cursor-pointer`}
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          {/* Upload Cloud Icon */}
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#1c1712]/80"
                          >
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                            <path d="M12 12v9" />
                            <path d="m16 16-4-4-4 4" />
                          </svg>

                          <p className="font-mono text-xs font-bold text-[#1c1712]">
                            Click to upload or drag and drop
                          </p>
                          <p className="font-mono text-[10px] text-[#1c1712]/60">
                            (JPG, PNG, WebP — Max 8MB)
                          </p>
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

                  {/* 6. Date / Year */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className={`w-full px-3 py-2 bg-[#d4c7b0]/80 border ${errors.dateYear ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none`}
                    />
                    {errors.dateYear && (
                      <p className="text-[10px] font-mono font-bold text-[#8c2817]">
                        {errors.dateYear}
                      </p>
                    )}
                  </div>

                  {/* 7. Category */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className={`w-full px-3 py-2 bg-[#d4c7b0]/80 border ${errors.category ? "border-[#8c2817]" : "border-[#5c4f40]/80"
                        } focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono text-[#1c1712] transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none`}
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
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-[#1c1712]">
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
                      className="w-full px-3 py-2 bg-[#d4c7b0]/80 border border-[#5c4f40]/80 focus:bg-[#ede3d1] focus:border-[#1c1712] text-xs sm:text-sm font-mono text-[#1c1712] placeholder:text-[#1c1712]/45 transition-colors shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] outline-none resize-y"
                    />
                  </div>

                  {/* ── RETRO SUBMIT BUTTON ── */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-4 bg-[#8c2817] hover:bg-[#721f11] active:translate-x-[1px] active:translate-y-[1px] text-[#f7f2e7] font-mono font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 border-2 border-[#1c1712] shadow-[3px_3px_0px_#14120e] disabled:opacity-50 cursor-pointer transition-all"
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

            {/* ── RIGHT MARGIN COLLAGE ── */}
            <div className="hidden md:flex md:col-span-3 flex-col justify-between self-stretch space-y-5 border-l-2 border-[#2b2219]/35 pl-3 select-none">
              {/* Real People. Real Stories. headline */}
              <div>
                <h4 className="font-serif font-black text-base sm:text-lg uppercase leading-tight text-[#1c1712]">
                  Real<br />People.<br />Real<br />Stories.
                </h4>
                <div className="w-12 h-1 bg-[#8c2817] mt-1" />
              </div>

              {/* Student Graduation Photo Thumbnail */}
              <div className="relative aspect-[4/3] w-full border-2 border-[#2b2219] bg-[#14120e] overflow-hidden shadow-[2px_2px_0px_#2b2219]">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                  alt="Students group"
                  fill
                  className="object-cover grayscale contrast-125 opacity-85"
                />
              </div>

              {/* Vertical Directory list */}
              <div className="text-center font-mono text-[10px] uppercase tracking-widest text-[#1c1712]/80 space-y-1 border-y border-[#2b2219]/30 py-2.5">
                <p>Events</p>
                <p className="text-[#8c2817]">✦</p>
                <p>Clubs</p>
                <p className="text-[#8c2817]">✦</p>
                <p>Culture</p>
                <p className="text-[#8c2817]">✦</p>
                <p>Community</p>
              </div>

              {/* Stamped hand-drawn label */}
              <div className="text-center p-2 border border-dashed border-[#2b2219]/60 bg-[#dcd0b9]/50">
                <p className="font-serif italic text-sm font-bold text-[#1c1712]">
                  RCC Talkies <span className="text-[#8c2817]">★</span>
                </p>
                <p className="font-mono text-[8px] uppercase tracking-widest text-[#1c1712]/60 mt-0.5">
                  THE VOICE OF RCCIIT
                </p>
              </div>
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
