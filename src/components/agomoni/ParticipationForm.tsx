"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  agomoniSchema,
  AGOMONI_FIELDS,
  type AgomoniFormData,
} from "@/lib/validations/agomoni";
import {
  submitAgomoniForm,
  type AgomoniSubmitResult,
} from "@/app/agomoni/actions";
import HoldButton from "./HoldButton";

/* ─── Custom Dropdown ──────────────────────────────────────────── */
function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  hasError = false,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedLabel = value || placeholder;
  const isEmpty = !value;

  return (
    <div ref={ref} className="relative" id={id}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full text-left bg-[#d4a24e]/[0.02] hover:bg-[#d4a24e]/[0.04] border px-5 py-3.5 rounded-xl font-serif text-base outline-none transition-all duration-300 flex items-center justify-between gap-2 ${
          hasError
            ? "border-[#c83a1a]/60 shadow-[0_0_12px_rgba(200,58,26,0.1)]"
            : open
              ? "border-[#d4a24e]/50 shadow-[0_0_12px_rgba(212,162,78,0.1)]"
              : "border-[#d4a24e]/15"
        } ${isEmpty ? "text-[#faf6ee]/30" : "text-[#faf6ee]"}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4a24e]/50 flex-shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute z-50 left-0 right-0 mt-2 bg-[#1e1c18] border border-[#d4a24e]/15 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
          >
            {options.map((opt, i) => (
              <motion.li
                key={opt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 font-serif text-sm transition-colors duration-150 ${
                    value === opt
                      ? "bg-[#d4a24e]/15 text-[#d4a24e]"
                      : "text-[#e5e0d3]/70 hover:bg-[#d4a24e]/8 hover:text-[#faf6ee]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                      value === opt ? "bg-[#d4a24e]" : "bg-[#e5e0d3]/10"
                    }`} />
                    {opt}
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Constants ────────────────────────────────────────────────── */

const DRAFT_KEY = "agomoni-2026-draft";

const STEPS: { id: string; title: string; subtitle: string; fields: string[] }[] = [
  {
    id: "identity",
    title: "Team Leader Details",
    subtitle: "The team leader fills in their info here.",
    fields: ["teamLeaderName", "department", "year", "contact", "email"],
  },
  {
    id: "performance",
    title: "Performance Details",
    subtitle: "Tell us about your group performance.",
    fields: ["category", "duration", "teamMembers", "message"],
  },
  {
    id: "review",
    title: "Review & Submit",
    subtitle: "Please recheck everything before confirming.",
    fields: [],
  },
];

/* ─── Organiser Contacts ─────────────────────────────────────── */
const CONTACTS = [
  { name: "Meghna Santra", role: "President, Art & Cultural Club", phone: "+91 93307 34507" },
  { name: "Soumyajit Samanta", role: "President, RCC Talkies", phone: "+91 70031 40676" },
  { name: "Swagata Ganguly", role: "Secretary, RCC Talkies", phone: "+91 96744 15363" },
  { name: "Kasturi Bhattacharya", role: "Secretary, Art & Cultural Club", phone: "+91 91431 91144" },
];

/* ─── Animation Variants ─────────────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ─── Multi-Step Participation Form ──────────────────────────── */

export function ParticipationForm() {
  const prefersReduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];

  /* ── SessionStorage draft ────────────────────────────────────── */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) setFormData(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveDraft = useCallback((data: Record<string, string>) => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }, []);

  const clearDraft = useCallback(() => {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }, []);

  /* ── Field value management ──────────────────────────────────── */
  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      saveDraft(next);
      return next;
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, [saveDraft]);

  /* ── Step validation ─────────────────────────────────────────── */
  const validateCurrentStep = useCallback((): boolean => {
    const stepFields = STEPS[currentStep].fields;
    if (stepFields.length === 0) return true;

    const errors: Record<string, string[]> = {};
    const fieldConfigs = AGOMONI_FIELDS.filter((f) => stepFields.includes(f.name));

    for (const field of fieldConfigs) {
      const value = formData[field.name] ?? "";
      if (field.required && !value.trim()) {
        errors[field.name] = [`${field.label} is required`];
      }
    }

    const fullData = { ...formData };
    const result = agomoniSchema.safeParse(fullData);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0]?.toString() ?? "_form";
        if (stepFields.includes(fieldName)) {
          if (!errors[fieldName]) errors[fieldName] = [];
          const msg = issue.message;
          if (!errors[fieldName].includes(msg)) {
            errors[fieldName].push(msg);
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  }, [currentStep, formData]);

  /* ── Navigation ──────────────────────────────────────────────── */
  const formTopRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (formTopRef.current) {
      const y = formTopRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const goNext = useCallback(() => {
    if (currentStep >= totalSteps - 1) return;
    if (!validateCurrentStep()) return;
    setDirection(1);
    setCurrentStep((s) => s + 1);
    setTimeout(scrollToTop, 100);
  }, [currentStep, totalSteps, validateCurrentStep]);

  const goBack = useCallback(() => {
    if (currentStep <= 0) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
    setTimeout(scrollToTop, 100);
  }, [currentStep]);

  /* ── Final submit ────────────────────────────────────────────── */
  const handleFinalSubmit = useCallback(() => {
    const result = agomoniSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0]?.toString() ?? "_form";
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      }
      setFieldErrors(errors);
      setFormState("error");
      setResultMessage("Some fields need correction. Go back to fix them.");
      return;
    }

    setFieldErrors({});
    setFormState("idle");

    startTransition(async () => {
      const serverResult: AgomoniSubmitResult = await submitAgomoniForm(
        result.data as AgomoniFormData
      );
      if (serverResult.success) {
        setFormState("success");
        setResultMessage(serverResult.message);
        clearDraft();
      } else {
        setFormState("error");
        setResultMessage(serverResult.error);
        if (serverResult.fieldErrors) setFieldErrors(serverResult.fieldErrors);
      }
    });
  }, [formData, startTransition, clearDraft]);

  /* ── Input styles ──────────────────────────────────────────── */
  const inputBase =
    "w-full bg-[#d4a24e]/[0.02] hover:bg-[#d4a24e]/[0.04] border border-[#d4a24e]/15 px-5 py-3.5 rounded-xl font-serif text-base text-[#faf6ee] placeholder:text-[#faf6ee]/30 focus:border-[#d4a24e]/50 focus:shadow-[0_0_12px_rgba(212,162,78,0.1)] outline-none transition-all duration-300 caret-[#d4a24e]";

  const errorClasses = "border-[#c83a1a]/60 focus:border-[#c83a1a]/80 shadow-[0_0_12px_rgba(200,58,26,0.1)]";

  /* ── Render a single field ───────────────────────────────────── */
  const renderField = (fieldName: string, index: number) => {
    const field = AGOMONI_FIELDS.find((f) => f.name === fieldName);
    if (!field) return null;

    const errors = fieldErrors[field.name];
    const hasError = errors && errors.length > 0;
    const value = formData[field.name] ?? "";

    return (
      <motion.div
        key={field.name}
        className="space-y-1 relative"
        style={{ zIndex: 50 - index }}
        initial={prefersReduced ? {} : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <label
          htmlFor={`agomoni-${field.name}`}
          className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#d4a24e]/70"
        >
          {field.label}
          {field.required && (
            <span className="text-[#c83a1a] text-[10px]">*</span>
          )}
        </label>

        {field.type === "select" && "options" in field ? (
          <CustomSelect
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(v) => updateField(field.name, v)}
            options={field.options}
            placeholder={field.placeholder}
            hasError={!!hasError}
          />
        ) : field.type === "textarea" ? (
          <textarea
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.name === "teamMembers" ? 5 : 3}
            className={`${inputBase} resize-y ${hasError ? errorClasses : ""}`}
          />
        ) : (
          <input
            ref={index === 0 && currentStep === 0 ? firstFieldRef : undefined}
            type={field.type}
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputBase} ${hasError ? errorClasses : ""}`}
          />
        )}

        {hasError && (
          <span className="inline-block text-[#ff6b4a] text-xs font-sans mt-1">
            {errors[0]}
          </span>
        )}
      </motion.div>
    );
  };

  /* ── Review step ─────────────────────────────────────────────── */
  const renderReview = () => {
    const filledFields = AGOMONI_FIELDS.filter((f) => formData[f.name]?.trim());
    return (
      <div className="space-y-0">
        {filledFields.map((field, i) => (
          <div
            key={field.name}
            className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 ${
              i < filledFields.length - 1 ? "border-b border-[#e5e0d3]/8" : ""
            }`}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#d4a24e] sm:w-40 flex-shrink-0">
              {field.label}
            </span>
            <span className="hidden sm:block flex-1 border-b border-dotted border-[#e5e0d3]/10 mb-1" />
            <span className={`font-serif text-base text-[#faf6ee] ${field.type === "textarea" ? "whitespace-pre-wrap" : ""}`}>
              {formData[field.name]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="participate"
      className="relative w-full bg-[#14120e] text-[#e5e0d3]"
      style={{ colorScheme: "dark" }}
    >
      {/* Full-section আগমনী watermark */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none select-none overflow-hidden font-bengali-serif text-6xl sm:text-7xl lg:text-8xl text-[#d4a24e]"
        aria-hidden="true"
        style={{ lineHeight: 1.15, letterSpacing: "0.05em", wordBreak: "break-all" }}
      >
        {"আগমনী ".repeat(500)}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          ref={formTopRef}
          className="text-center mb-16"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e] block mb-3">
            Registration
          </span>
          <h2 className="font-display-serif text-3xl sm:text-5xl lg:text-6xl text-[#faf6ee] tracking-tight mb-4">
            Register Your Group
          </h2>
          <p className="font-serif italic text-sm sm:text-base text-[#e5e0d3]/50 max-w-lg mx-auto">
            Only group performances are accepted. The team leader fills this form
            on behalf of the entire group.
          </p>
        </motion.div>

        {/* ── Two-column layout: Guidelines + Form ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">

          {/* LEFT COLUMN: Guidelines & Contacts */}
          <motion.div
            className="lg:col-span-2 space-y-10 order-2 lg:order-1"
            initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Guidelines — shows above on mobile via separate render, hidden here on mobile */}
            <div className="hidden lg:block">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#d4a24e] mb-6">
                Guidelines
              </h3>
              <ol className="space-y-5 list-none counter-reset-none">
                {[
                  "Only group performances are allowed. Solo acts will not be entertained.",
                  "Performances must be traditional or classical. Bollywood numbers and film music are not permitted.",
                  "Obscene or inappropriate content is strictly prohibited and will lead to disqualification.",
                  "Acts rooted in Durga Puja, Agomoni, or Bengali cultural heritage will receive priority in scheduling.",
                  "Each group must declare their required stage time. The organisers reserve the right to adjust the final schedule.",
                ].map((text, i) => (
                  <motion.li
                    key={i}
                    className="flex items-baseline gap-4"
                    initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <span className="font-display-serif text-2xl text-[#d4a24e]/30 flex-shrink-0 leading-none" style={{ fontFeatureSettings: '"lnum"' }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[13px] sm:text-sm text-[#e5e0d3]/60 leading-[1.7]">{text}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Divider — only on desktop */}
            <div className="hidden lg:block w-full h-px bg-gradient-to-r from-[#d4a24e]/30 via-[#d4a24e]/10 to-transparent" />

            {/* Contact Numbers */}
            <div>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#d4a24e] mb-6">
                Contact the Organisers
              </h3>
              <div className="space-y-5">
                {CONTACTS.map((c, i) => (
                  <motion.a
                    key={i}
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="flex items-baseline justify-between gap-4 group py-2 border-b border-[#e5e0d3]/6 last:border-0"
                    initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <div>
                      <span className="font-display-serif text-base text-[#faf6ee] group-hover:text-[#d4a24e] transition-colors">
                        {c.name}
                      </span>
                      <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#e5e0d3]/30 mt-1">
                        {c.role}
                      </span>
                    </div>
                    <span className="font-serif text-sm text-[#d4a24e]/50 group-hover:text-[#d4a24e] transition-colors whitespace-nowrap tabular-nums">
                      {c.phone}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Guidelines — mobile only, shown above the form */}
            <div className="block lg:hidden mb-8">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#d4a24e] mb-5">
                Guidelines
              </h3>
              <ol className="space-y-3 list-none counter-reset-none">
                {[
                  "Only group performances are allowed. Solo acts will not be entertained.",
                  "Performances must be traditional or classical. Bollywood numbers and film music are not permitted.",
                  "Obscene or inappropriate content is strictly prohibited and will lead to disqualification.",
                  "Acts rooted in Durga Puja, Agomoni, or Bengali cultural heritage will receive priority.",
                  "Each group must declare their required stage time.",
                ].map((text, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <span className="font-display-serif text-lg text-[#d4a24e]/30 flex-shrink-0 leading-none" style={{ fontFeatureSettings: '"lnum"' }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[12px] text-[#e5e0d3]/60 leading-[1.6]">{text}</span>
                  </li>
                ))}
              </ol>
              <div className="w-full h-px bg-gradient-to-r from-[#d4a24e]/30 via-[#d4a24e]/10 to-transparent mt-6" />
            </div>
            {/* Honeypot */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="agomoni-honey">Do not fill this</label>
              <input
                type="text"
                id="agomoni-honey"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                value={formData._honey ?? ""}
                onChange={(e) => updateField("_honey", e.target.value)}
              />
            </div>

            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  className="text-center py-16 space-y-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mx-auto w-20 h-20 rounded-full border-2 border-[#d4a24e] flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a24e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bengali-serif text-2xl text-[#d4a24e] mb-1" lang="bn" aria-hidden="true" style={{ letterSpacing: 0, lineHeight: 1.5 }}>
                      স্বাগতম
                    </p>
                    <h3 className="font-display-serif text-2xl sm:text-3xl text-[#faf6ee]">
                      You&apos;re In!
                    </h3>
                  </div>
                  <p className="font-serif text-base text-[#e5e0d3]/70 max-w-md mx-auto">
                    {resultMessage}
                  </p>
                  <div className="flex items-center justify-center gap-3 text-[#d4a24e]">
                    <span className="w-8 h-px bg-[#d4a24e]/40" />
                    <span className="font-serif italic text-sm">Ashche bochor abar hobe</span>
                    <span className="w-8 h-px bg-[#d4a24e]/40" />
                  </div>

                  {/* Submit another application */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({});
                      setFieldErrors({});
                      setCurrentStep(0);
                      setDirection(1);
                      setFormState("idle");
                      setResultMessage("");
                      clearDraft();
                    }}
                    className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#14120e] bg-[#d4a24e] hover:bg-[#c83a1a] hover:text-[#faf6ee] transition-all duration-300 px-8 py-3 rounded-full cursor-pointer mx-auto"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
                    Register Another Group
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Progress */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#e5e0d3]/40 font-bold">
                        Step {currentStep + 1} of {totalSteps}
                      </span>
                      <span className="font-serif italic text-xs text-[#d4a24e]/60">
                        {step.title}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-[2px] bg-[#e5e0d3]/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#d4a24e]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  {/* Step content with slide animation */}
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: prefersReduced ? 0 : 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="min-h-[300px] w-full"
                    >
                      {/* Step header */}
                      <div className="mb-8">
                        <h3 className="font-display-serif text-xl sm:text-2xl text-[#faf6ee] mb-1">
                          {step.title}
                        </h3>
                        <p className="font-serif italic text-sm text-[#e5e0d3]/40">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Fields or review */}
                      {step.id === "review" ? (
                        <div className="space-y-6">
                          {renderReview()}

                          {/* Warning */}
                          <div className="flex items-start gap-3 py-4 text-[#d4a24e]/80">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <p className="font-serif text-sm leading-relaxed">
                              Please recheck all details. Hold the button below to confirm your group&apos;s registration.
                            </p>
                          </div>

                          {/* Error */}
                          {formState === "error" && (
                            <span className="inline-block text-[#ff6b4a] text-sm font-serif">
                              {resultMessage}
                            </span>
                          )}

                          {/* HoldButton */}
                          <div className="flex justify-center pt-4">
                            <HoldButton
                              doneLabel="Registered!"
                              backgroundColor="#1e1c18"
                              fillColor="#d4a24e"
                              textColor="#faf6ee"
                              fillTextColor="#14120e"
                              size="lg"
                              radius={9999}
                              fillDirection="right"
                              holdTime={2000}
                              releaseTime={200}
                              pressScale={0.97}
                              wave
                              waveAmplitude={6}
                              glow
                              resetAfter={0}
                              disabled={isPending}
                              onHold={handleFinalSubmit}
                              className="w-full max-w-sm font-display uppercase tracking-tight"
                            >
                              Hold to Confirm Registration
                            </HoldButton>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {step.fields.map((fieldName, i) => renderField(fieldName, i))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#e5e0d3]/8 relative z-50">
                    <div>
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#e5e0d3]/50 hover:text-[#faf6ee] transition-colors flex items-center gap-2 cursor-pointer touch-manipulation"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
                          Back
                        </button>
                      )}
                    </div>

                    <div>
                      {step.id !== "review" && (
                        <button
                          type="button"
                          onClick={goNext}
                          className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#14120e] bg-[#d4a24e] hover:bg-[#c83a1a] hover:text-[#faf6ee] transition-all duration-300 px-8 py-3 rounded-full flex items-center gap-2 cursor-pointer touch-manipulation"
                        >
                          {currentStep === totalSteps - 2 ? "Review" : "Next"}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m0 0l-7-7m7 7l-7 7"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center font-serif italic text-xs text-[#e5e0d3]/20 mt-16">
          By registering, you agree to be contacted by the organising team regarding the event.
        </p>
      </div>
    </section>
  );
}
