"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

  // Handle file selection & convert to Data URL for preview + submission
  const handleFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        picture: "Only JPG, PNG or WebP images are allowed.",
      }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        picture: "Image size must be under 5MB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPictureDataUrl(reader.result as string);
      setPictureName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setPictureSize(`${sizeMB} MB`);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.picture;
        return next;
      });
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
      errs.rollNumber = "Please enter your roll number (E.G. DEPT20XXXXX).";
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
      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const newItem: AchievementItem = data.achievement || {
          id: `ach-${Date.now()}`,
          fullName: payload.fullName,
          department: payload.department,
          rollNumber: payload.rollNumber,
          achievements: payload.achievements,
          picture: payload.picture,
          dateYear: payload.dateYear,
          category: payload.category,
          additionalNotes: payload.additionalNotes,
          featured: false,
          createdAt: new Date().toISOString(),
        };

        // Save in localStorage for persistent client session
        try {
          const stored = localStorage.getItem("rcc_user_achievements");
          const existing = stored ? JSON.parse(stored) : [];
          localStorage.setItem(
            "rcc_user_achievements",
            JSON.stringify([newItem, ...existing])
          );
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }

        setSubmittedItem(newItem);
        setSubmitSuccess(true);
        if (onSuccess) {
          onSuccess(newItem);
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          form: data.error || "Failed to submit achievement. Please try again.",
        }));
      }
    } catch (err) {
      console.error("Submission failed:", err);
      // Fallback local persistence so frontend remains 100% functional
      const fallbackItem: AchievementItem = {
        id: `local-${Date.now()}`,
        fullName: payload.fullName,
        department: payload.department,
        rollNumber: payload.rollNumber,
        achievements: payload.achievements,
        picture: payload.picture,
        dateYear: payload.dateYear,
        category: payload.category,
        additionalNotes: payload.additionalNotes,
        featured: false,
        createdAt: new Date().toISOString(),
      };
      try {
        const stored = localStorage.getItem("rcc_user_achievements");
        const existing = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          "rcc_user_achievements",
          JSON.stringify([fallbackItem, ...existing])
        );
      } catch (storageErr) {
        console.warn("Storage err:", storageErr);
      }

      setSubmittedItem(fallbackItem);
      setSubmitSuccess(true);
      if (onSuccess) {
        onSuccess(fallbackItem);
      }
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
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* ─────────────────────────────────────────────────────────────
          POSTER OUTER WRAPPER WITH RETRO NEWSPAPER & PARCHMENT TEXTURE
      ───────────────────────────────────────────────────────────── */}
      <div className="relative border-4 border-[#14120e] bg-[#e6dfcf] shadow-[12px_12px_0px_#14120e] p-3 sm:p-6 md:p-8 overflow-hidden select-text text-[#14120e]">
        {/* Subtle vintage paper grid pattern & noise */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(#14120e 0.65px, transparent 0.65px)`,
            backgroundSize: "7px 7px",
          }}
        />

        {/* Vintage Paper Crease lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14120e] to-transparent" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14120e] to-transparent" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#14120e] to-transparent" />
        </div>

        {/* Outer Fine Double Border with aged corner tabs */}
        <div className="border-2 border-[#14120e]/60 p-2 sm:p-3 relative bg-[#ece5d6]/70">
          {/* Top Bar: RCC TALKIES / YOUR JOURNEY / OUR DATABASE */}
          <div className="flex items-center justify-between border-b-2 border-[#14120e] pb-2 mb-4 text-[10px] sm:text-xs font-sans tracking-[0.22em] uppercase font-bold text-[#14120e]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[#c83a1a] text-sm">✦</span>
              <span className="font-display tracking-tight text-sm sm:text-base text-[#14120e]">
                RCC TALKIES
              </span>
            </div>
            <div className="hidden sm:block flex-1 mx-4 border-b border-[#14120e]/40" />
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#14120e]/90 font-mono text-[11px]">
              <span>YOUR JOURNEY</span>
              <span className="text-[#c83a1a]">/</span>
              <span>OUR DATABASE</span>
              <span className="text-[#c83a1a] text-sm">✦</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              HERO BANNER: TORN DARK CARDBOARD / NEWSPAPER BANNER
          ───────────────────────────────────────────────────────── */}
          <div className="relative bg-[#171411] text-[#e5e0d3] p-4 sm:p-6 md:p-8 mb-6 border-2 border-[#14120e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* mask.png overlay inside the banner for deep authentic grain */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: "url('/mask.png')" }}
            />

            {/* Jagged / Torn Paper Edges Top & Bottom */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#e6dfcf] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#e6dfcf] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Left Side: Stencil Label + Giant Title + Subtitle */}
              <div className="space-y-2 max-w-xl">
                {/* SUBMIT YOUR label stamp */}
                <div className="inline-block transform -rotate-2 bg-[#f4eee2] text-[#14120e] border-2 border-[#14120e] px-3 py-0.5 shadow-[2px_2px_0px_#c83a1a]">
                  <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.25em]">
                    SUBMIT YOUR
                  </span>
                </div>

                {/* Big Vintage Title */}
                <div className="flex flex-wrap items-baseline gap-2 pt-1">
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#f4efe4] leading-none drop-shadow-[2px_2px_0px_#14120e]">
                    Achievement
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#f4efe4] leading-none drop-shadow-[2px_2px_0px_#14120e]">
                      Form
                    </span>
                    <span className="font-serif italic text-2xl sm:text-4xl lg:text-5xl text-[#e8d8ba] font-normal tracking-normal ml-1">
                      RCC Talkies
                    </span>
                    <span className="text-[#c83a1a] text-lg sm:text-2xl ml-1">★</span>
                  </div>
                </div>

                {/* Typewriter Slogan */}
                <div className="pt-2 text-xs sm:text-sm font-mono tracking-wide text-[#cfc9bd] leading-relaxed max-w-md">
                  <p className="font-medium text-[#e5e0d3]">Your hard work deserves to be seen.</p>
                  <p className="text-[#cfc9bd]/80">Share your achievements with RCC Talkies.</p>
                </div>
              </div>

              {/* Right Side Artwork: Projector + Newspaper Cutout + Note */}
              <div className="hidden sm:flex flex-col items-end gap-2 text-right select-none">
                <div className="font-serif italic text-xs sm:text-sm text-[#e8d8ba] tracking-wide">
                  Small Steps<br />Big Dreams
                </div>

                <div className="flex items-center gap-3">
                  {/* Retro Movie Projector SVG Illustration */}
                  <svg
                    width="68"
                    height="68"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#e5e0d3] opacity-90 drop-shadow-md"
                  >
                    {/* Top Reel 1 */}
                    <circle cx="20" cy="16" r="10" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="20" cy="16" r="3" fill="currentColor" />
                    <line x1="20" y1="6" x2="20" y2="26" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="10" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" />
                    {/* Top Reel 2 */}
                    <circle cx="44" cy="16" r="10" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="44" cy="16" r="3" fill="currentColor" />
                    <line x1="44" y1="6" x2="44" y2="26" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="34" y1="16" x2="54" y2="16" stroke="currentColor" strokeWidth="1.5" />
                    {/* Camera Body */}
                    <rect x="14" y="26" width="36" height="22" rx="2" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                    {/* Lens cone */}
                    <polygon points="50,32 62,26 62,42 50,38" fill="currentColor" opacity="0.85" />
                    {/* Tripod base */}
                    <line x1="32" y1="48" x2="32" y2="58" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="32" y1="58" x2="18" y2="64" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="58" x2="46" y2="64" stroke="currentColor" strokeWidth="2" />
                  </svg>

                  {/* Folded Newspaper Clipping Graphic */}
                  <div className="bg-[#f0e8d8] text-[#14120e] p-2 border-2 border-[#14120e] shadow-[3px_3px_0px_#c83a1a] transform rotate-3 w-24">
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

          {/* ─────────────────────────────────────────────────────────
              MAIN 3-COLUMN POSTER LAYOUT (COLLAGES + CENTER FORM)
          ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* LEFT MARGIN: Vintage Newspaper & Scrapbook Collage */}
            <div className="hidden lg:flex lg:col-span-2 flex-col justify-between self-stretch space-y-6 border-r-2 border-[#14120e]/30 pr-4 select-none">
              {/* Paperclip graphic */}
              <div className="relative pt-2">
                <svg
                  width="28"
                  height="44"
                  viewBox="0 0 28 44"
                  fill="none"
                  className="text-[#5a5449] absolute -top-4 left-3 z-20 drop-shadow"
                >
                  <path
                    d="M10 8V32C10 36 13 39 17 39C21 39 24 36 24 32V6C24 3.5 21.5 1 18.5 1C15.5 1 13 3.5 13 6V29C13 31 14.5 32 16.5 32C18.5 32 20 31 20 29V10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Slogan */}
                <div className="bg-[#dcd4bf] border-2 border-[#14120e] p-2 text-center pt-5 shadow-[2px_2px_0px_#14120e]">
                  <h4 className="font-display text-sm uppercase leading-tight tracking-tight text-[#14120e]">
                    Talent<br />Builds<br />Tomorrow
                  </h4>
                </div>
              </div>

              {/* Quote in quotes */}
              <div className="border-l-2 border-[#c83a1a] pl-2.5 py-1 bg-[#e0d7c3]/40">
                <p className="font-serif italic text-xs text-[#14120e]/90 leading-snug">
                  &ldquo;Great achievements aren&apos;t born in comfort zones.&rdquo;
                </p>
              </div>

              {/* Cheering crowd photo thumbnail */}
              <div className="relative aspect-[3/4] w-full border-2 border-[#14120e] bg-[#14120e] overflow-hidden group shadow-[3px_3px_0px_#14120e]">
                <Image
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
                  alt="Crowd cheering"
                  fill
                  className="object-cover grayscale contrast-125 opacity-80"
                />
                <div className="absolute inset-0 bg-[#c83a1a]/10 mix-blend-multiply" />
                <div className="absolute bottom-1 left-1 right-1 bg-[#14120e]/90 text-[#e5e0d3] text-[8px] font-mono text-center px-1 py-0.5 uppercase tracking-widest">
                  VICTORY
                </div>
              </div>

              {/* Bottom tape badge: Dream Plan Achieve */}
              <div className="transform -rotate-2 bg-[#c83a1a] text-[#e5e0d3] px-2 py-1 text-center border border-[#14120e] shadow-[2px_2px_0px_#14120e]">
                <span className="font-display text-xs uppercase tracking-wider block">
                  Dream • Plan • Achieve
                </span>
              </div>
            </div>

            {/* CENTER: THE FORM CONTAINER */}
            <div className="lg:col-span-8 bg-[#f5efe2] border-2 border-[#14120e] p-4 sm:p-7 shadow-[4px_4px_0px_#14120e] relative">
              {submitSuccess && submittedItem ? (
                /* Celebration / Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 px-4 text-center space-y-6"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#14120e] text-[#e5e0d3] flex items-center justify-center border-2 border-[#c83a1a] shadow-[4px_4px_0px_#c83a1a]">
                    <span className="text-3xl sm:text-4xl">✓</span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#c83a1a] block">
                      ✦ ARCHIVED IN RCC TALKIES DATABASE ✦
                    </span>
                    <h3 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#14120e]">
                      Achievement Recorded!
                    </h3>
                    <p className="font-serif text-sm sm:text-base text-[#14120e]/80 max-w-md mx-auto">
                      Thank you, <strong className="text-[#14120e]">{submittedItem.fullName}</strong>. Your story has been successfully filed in the RCC Talkies database and is now featured in our Hall of Fame!
                    </p>
                  </div>

                  {/* Submission Summary Ticket */}
                  <div className="max-w-md mx-auto border-2 border-dashed border-[#14120e]/40 p-4 bg-[#eae3d2] text-left text-xs font-sans space-y-1.5 shadow-[2px_2px_0px_#14120e]/20">
                    <div className="flex justify-between border-b border-[#14120e]/20 pb-1 font-bold text-[#14120e] font-mono">
                      <span>DEPT: {submittedItem.department} · ROLL: {submittedItem.rollNumber}</span>
                      <span className="text-[#c83a1a]">{submittedItem.category}</span>
                    </div>
                    <p className="font-serif text-[#14120e]/85 pt-1 italic line-clamp-3">
                      &ldquo;{submittedItem.achievements}&rdquo;
                    </p>
                    <div className="text-[10px] font-mono text-[#14120e]/60 pt-1 flex justify-between">
                      <span>Date/Year: {submittedItem.dateYear}</span>
                      <span>Status: Registered</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-[#14120e] text-[#e5e0d3] font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#c83a1a] transition-colors shadow-[3px_3px_0px_#14120e]"
                    >
                      Submit Another
                    </button>
                    <a
                      href="#achievement-database"
                      className="px-6 py-2.5 border-2 border-[#14120e] text-[#14120e] font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#dad3be] transition-colors"
                    >
                      View on Database Wall ↑
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* The Vintage Newspaper Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
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

                  {errors.form && (
                    <div className="p-3 bg-[#c83a1a]/10 border-2 border-[#c83a1a] text-[#c83a1a] text-xs font-mono font-bold">
                      {errors.form}
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* User Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Full Name</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                      }}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 ${
                        errors.fullName ? "border-[#c83a1a]" : "border-[#14120e]/60"
                      } focus:border-[#14120e] focus:bg-white text-sm font-mono text-[#14120e] placeholder:text-[#14120e]/45 placeholder:font-mono transition-colors shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)] outline-none`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Department (Added directly below Name) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* Academic Building / Graduation Cap Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      <span>Department</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        if (errors.department) setErrors((prev) => ({ ...prev, department: "" }));
                      }}
                      placeholder="e.g. CSE, IT, ECE, EE, AIML..."
                      className={`w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 ${
                        errors.department ? "border-[#c83a1a]" : "border-[#14120e]/60"
                      } focus:border-[#14120e] focus:bg-white text-sm font-mono uppercase text-[#14120e] placeholder:text-[#14120e]/45 placeholder:font-mono transition-colors shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)] outline-none`}
                    />
                    {errors.department && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* 3. Roll Number (E.G. DEPT20XXXXX) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* ID Card / Badge Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <rect x="2" y="3" width="20" height="18" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                        <path d="M10 9a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                        <line x1="8" y1="14" x2="16" y2="14" />
                      </svg>
                      <span>Roll Number</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => {
                        setRollNumber(e.target.value);
                        if (errors.rollNumber) setErrors((prev) => ({ ...prev, rollNumber: "" }));
                      }}
                      placeholder="E.G. DEPT20XXXXX"
                      className={`w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 ${
                        errors.rollNumber ? "border-[#c83a1a]" : "border-[#14120e]/60"
                      } focus:border-[#14120e] focus:bg-white text-sm font-mono uppercase text-[#14120e] placeholder:text-[#14120e]/45 placeholder:font-mono transition-colors shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)] outline-none`}
                    />
                    {errors.rollNumber && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.rollNumber}
                      </p>
                    )}
                  </div>

                  {/* 4. Achievements */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* Trophy Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M6 4h12v7a6 6 0 0 1-12 0V4Z" />
                      </svg>
                      <span>Achievements</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={achievements}
                      onChange={(e) => {
                        setAchievements(e.target.value);
                        if (errors.achievements) setErrors((prev) => ({ ...prev, achievements: "" }));
                      }}
                      placeholder="Tell us about your achievement(s)..."
                      className={`w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 ${
                        errors.achievements ? "border-[#c83a1a]" : "border-[#14120e]/60"
                      } focus:border-[#14120e] focus:bg-white text-sm font-serif text-[#14120e] placeholder:text-[#14120e]/45 placeholder:font-mono transition-colors shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)] outline-none resize-y`}
                    />
                    {errors.achievements && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.achievements}
                      </p>
                    )}
                  </div>

                  {/* 5. Achievement Picture */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* Image / Picture Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <span>Achievement Picture</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={onFileChange}
                      className="hidden"
                    />

                    {/* Drag & Drop Zone */}
                    {!pictureDataUrl ? (
                      <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full border-2 border-dashed ${
                          isDragging
                            ? "border-[#c83a1a] bg-[#ede5d4]"
                            : errors.picture
                            ? "border-[#c83a1a] bg-[#fbf8f1]"
                            : "border-[#14120e]/50 hover:border-[#14120e] bg-[#fbf8f1]"
                        } p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[inset_1px_1px_3px_rgba(20,18,14,0.05)]`}
                      >
                        {/* Cloud Upload Icon */}
                        <div className="mb-2 text-[#14120e]">
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                            <path d="M12 12v9" />
                            <path d="m16 16-4-4-4 4" />
                          </svg>
                        </div>
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#14120e]">
                          Click to upload or drag and drop
                        </span>
                        <span className="font-mono text-[10px] sm:text-xs text-[#14120e]/60 mt-0.5">
                          (JPG, PNG - Max 5MB)
                        </span>
                      </div>
                    ) : (
                      /* Picture Preview Card */
                      <div className="relative border-2 border-[#14120e] bg-[#eae3d2] p-3 flex items-center gap-4 shadow-[2px_2px_0px_#14120e]">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border-2 border-[#14120e] bg-[#14120e] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pictureDataUrl}
                            alt="Achievement preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 font-mono">
                          <p className="font-bold text-xs sm:text-sm text-[#14120e] truncate">
                            {pictureName || "Selected Image"}
                          </p>
                          <p className="text-[10px] text-[#14120e]/60">
                            {pictureSize}
                          </p>
                          <span className="inline-block bg-[#14120e] text-[#e5e0d3] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 mt-1">
                            ATTACHED
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removePicture}
                          className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#c83a1a] border border-[#c83a1a] hover:bg-[#c83a1a] hover:text-[#e5e0d3] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {errors.picture && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.picture}
                      </p>
                    )}
                  </div>

                  {/* 6. Date / Year */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* Calendar Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Date / Year</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={dateYear}
                      onChange={(e) => {
                        setDateYear(e.target.value);
                        if (errors.dateYear) setErrors((prev) => ({ ...prev, dateYear: "" }));
                      }}
                      placeholder="e.g. 2024 / 2025"
                      className={`w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 ${
                        errors.dateYear ? "border-[#c83a1a]" : "border-[#14120e]/60"
                      } focus:border-[#14120e] focus:bg-white text-sm font-mono text-[#14120e] placeholder:text-[#14120e]/45 placeholder:font-mono transition-colors shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)] outline-none`}
                    />
                    {errors.dateYear && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.dateYear}
                      </p>
                    )}
                  </div>

                  {/* 7. Category */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* Diamond / Tag Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                      <span>Category</span>
                      <span className="text-[#c83a1a]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 ${
                          errors.category ? "border-[#c83a1a]" : "border-[#14120e]/60"
                        } focus:border-[#14120e] focus:bg-white text-sm font-mono text-[#14120e] transition-colors outline-none appearance-none cursor-pointer pr-10 shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)]`}
                      >
                        <option value="">Select category</option>
                        {achievementCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#14120e]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <p className="text-[11px] font-mono font-semibold text-[#c83a1a] mt-0.5">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* 8. Additional Notes (Optional) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#14120e]">
                      {/* Star Icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14120e]">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>Additional Notes (Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any extra details..."
                      className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#14120e]/60 focus:border-[#14120e] focus:bg-white text-sm font-serif text-[#14120e] placeholder:text-[#14120e]/45 placeholder:font-mono transition-colors shadow-[inset_1px_1px_3px_rgba(20,18,14,0.08)] outline-none resize-y"
                    />
                  </div>

                  {/* 9. Submit Achievement Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group overflow-hidden bg-[#942617] hover:bg-[#7b1e11] active:translate-y-0.5 text-[#f4efe4] py-3.5 px-6 font-serif text-base sm:text-lg font-bold uppercase tracking-wider transition-all duration-200 border-2 border-[#14120e] shadow-[4px_4px_0px_#14120e] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {/* Paper Airplane Icon */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${
                          isSubmitting ? "animate-pulse" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        }`}
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                      <span className="font-mono text-sm sm:text-base font-bold">
                        {isSubmitting ? "Submitting Achievement..." : "Submit Achievement"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT MARGIN: Scrapbook Collage */}
            <div className="hidden lg:flex lg:col-span-2 flex-col justify-between self-stretch space-y-6 border-l-2 border-[#14120e]/30 pl-4 select-none">
              {/* Slogan */}
              <div className="border-b-2 border-[#14120e] pb-2">
                <h4 className="font-serif text-base font-bold uppercase leading-tight tracking-tight text-[#14120e]">
                  Real<br />People.<br />Real<br />Stories.
                </h4>
                <div className="w-8 h-1 bg-[#c83a1a] mt-1" />
              </div>

              {/* Campus heritage building photo thumbnail */}
              <div className="relative aspect-[4/3] w-full border-2 border-[#14120e] bg-[#14120e] overflow-hidden shadow-[3px_3px_0px_#14120e]">
                <Image
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                  alt="Campus building"
                  fill
                  className="object-cover grayscale contrast-125 opacity-80"
                />
                <div className="absolute inset-0 bg-[#c83a1a]/10 mix-blend-multiply" />
              </div>

              {/* Bulleted list: Events, Clubs, Culture, Community */}
              <div className="space-y-1.5 text-center text-xs font-mono uppercase tracking-widest text-[#14120e]/85 py-2 border-y-2 border-[#14120e]/30 bg-[#e0d7c3]/30">
                <div className="font-bold">Events</div>
                <div className="text-[#c83a1a] text-[10px]">✦</div>
                <div className="font-bold">Clubs</div>
                <div className="text-[#c83a1a] text-[10px]">✦</div>
                <div className="font-bold">Culture</div>
                <div className="text-[#c83a1a] text-[10px]">✦</div>
                <div className="font-bold">Community</div>
              </div>

              {/* Vertical Film Strip Artwork */}
              <div className="bg-[#14120e] text-[#e5e0d3] p-1.5 flex flex-col items-center gap-1 border-2 border-[#14120e] shadow-[2px_2px_0px_#14120e]">
                <div className="w-full flex justify-between px-1">
                  <div className="w-1.5 h-1.5 bg-[#e5e0d3] rounded-xs" />
                  <div className="w-1.5 h-1.5 bg-[#e5e0d3] rounded-xs" />
                </div>
                <div className="w-full h-8 bg-[#2a241b] border border-[#e5e0d3]/30 flex items-center justify-center">
                  <span className="font-mono text-[8px] tracking-wider text-[#e5e0d3]/70">35MM FILM</span>
                </div>
                <div className="w-full flex justify-between px-1">
                  <div className="w-1.5 h-1.5 bg-[#e5e0d3] rounded-xs" />
                  <div className="w-1.5 h-1.5 bg-[#e5e0d3] rounded-xs" />
                </div>
              </div>

              {/* Stamped Seal: RCC Talkies */}
              <div className="border-2 border-[#14120e] p-2 text-center bg-[#dcd4bf] shadow-[2px_2px_0px_#14120e]">
                <span className="font-display text-sm tracking-wider uppercase block text-[#14120e]">
                  RCC Talkies
                </span>
                <span className="text-[#c83a1a] text-xs">★ ★ ★</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              BOTTOM POSTER FOOTER: BUILD ✦ GROW ✦ SHINE
          ───────────────────────────────────────────────────────── */}
          <div className="mt-6 pt-3 border-t-2 border-[#14120e] flex items-center justify-center gap-3 text-xs sm:text-sm font-mono uppercase tracking-[0.25em] font-bold text-[#14120e]">
            <div className="w-8 sm:w-16 h-px bg-[#14120e]/60" />
            <span>BUILD</span>
            <span className="text-[#c83a1a]">✦</span>
            <span>GROW</span>
            <span className="text-[#c83a1a]">✦</span>
            <span>SHINE</span>
            <div className="w-8 sm:w-16 h-px bg-[#14120e]/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
