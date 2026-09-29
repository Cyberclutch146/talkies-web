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

/* ─── Constants ────────────────────────────────────────────────── */

const DRAFT_KEY = "agomoni-2026-draft";

const STEPS: { id: string; title: string; subtitle: string; fields: string[] }[] = [
  {
    id: "identity",
    title: "Who are you?",
    subtitle: "Let us know your name and department.",
    fields: ["name", "department"],
  },
  {
    id: "academic",
    title: "Where are you?",
    subtitle: "Your year and contact details.",
    fields: ["year", "contact"],
  },
  {
    id: "participation",
    title: "How will you participate?",
    subtitle: "Choose your category and add any notes.",
    fields: ["email", "category", "message"],
  },
  {
    id: "review",
    title: "Review your details",
    subtitle: "Please recheck your info before confirming.",
    fields: [],
  },
];

/* ─── Animation Variants ─────────────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

/* ─── Scissors Icon ────────────────────────────────────────────── */
function ScissorsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4a24e]/40">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" x2="8.12" y1="4" y2="15.88" />
      <line x1="14.47" x2="20" y1="14.48" y2="20" />
      <line x1="8.12" x2="12" y1="8.12" y2="12" />
    </svg>
  );
}

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
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [discardAnnouncement, setDiscardAnnouncement] = useState("");

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

  /* ── Check if form has any content ──────────────────────────── */
  const hasContent = useCallback(() => {
    return AGOMONI_FIELDS.some((f) => (formData[f.name] ?? "").trim().length > 0);
  }, [formData]);

  /* ── Discard handler ─────────────────────────────────────────── */
  const handleDiscard = useCallback(() => {
    if (hasContent()) {
      setShowDiscardConfirm(true);
    } else {
      performDiscard();
    }
  }, [hasContent]);

  const performDiscard = useCallback(() => {
    setFormData({});
    setFieldErrors({});
    setFormState("idle");
    setResultMessage("");
    setShowDiscardConfirm(false);
    setDirection(-1);
    setCurrentStep(0);
    clearDraft();
    setDiscardAnnouncement("Application discarded");
    setTimeout(() => setDiscardAnnouncement(""), 3000);
    setTimeout(() => firstFieldRef.current?.focus(), 100);
  }, [clearDraft]);

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
  const goNext = useCallback(() => {
    if (currentStep >= totalSteps - 1) return;
    if (!validateCurrentStep()) return;
    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, [currentStep, totalSteps, validateCurrentStep]);

  const goBack = useCallback(() => {
    if (currentStep <= 0) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
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

  /* ── Input styles — dark translucent, dashed gold border ───── */
  const inputBase =
    "w-full bg-[#faf6ee]/[0.05] border border-dashed border-[#d4a24e]/30 px-5 py-3.5 rounded-2xl font-serif text-base text-[#faf6ee] placeholder:text-[#faf6ee]/25 focus:border-solid focus:border-[#d4a24e] focus:shadow-[0_0_12px_rgba(212,162,78,0.15)] outline-none transition-all duration-150 caret-[#d4a24e]";

  /* ── Render a single field ───────────────────────────────────── */
  const renderField = (fieldName: string, index: number) => {
    const field = AGOMONI_FIELDS.find((f) => f.name === fieldName);
    if (!field) return null;

    const errors = fieldErrors[field.name];
    const hasError = errors && errors.length > 0;
    const value = formData[field.name] ?? "";

    return (
      <div key={field.name} className="space-y-2">
        <label
          htmlFor={`agomoni-${field.name}`}
          className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#e5e0d3]/60"
        >
          {field.label}
          {field.required && (
            <span className="text-[#c83a1a] text-[10px]">*</span>
          )}
        </label>

        {field.type === "select" ? (
          <select
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            className={`${inputBase} ${hasError ? "border-[#c83a1a] border-solid" : ""}`}
          >
            <option value="" disabled>{field.placeholder}</option>
            {"options" in field && field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${inputBase} resize-y ${hasError ? "border-[#c83a1a] border-solid" : ""}`}
          />
        ) : (
          <input
            ref={index === 0 && currentStep === 0 ? firstFieldRef : undefined}
            type={field.type}
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputBase} ${hasError ? "border-[#c83a1a] border-solid" : ""}`}
          />
        )}

        {hasError && (
          <span className="inline-block bg-[#c83a1a]/20 text-[#ff6b4a] text-xs font-sans px-3 py-1 rounded-full">
            {errors[0]}
          </span>
        )}
      </div>
    );
  };

  /* ── Review step ─────────────────────────────────────────────── */
  const renderReview = () => {
    const filledFields = AGOMONI_FIELDS.filter((f) => formData[f.name]?.trim());
    return (
      <div className="space-y-0 rounded-2xl border border-dashed border-[#e5e0d3]/10 overflow-hidden">
        {filledFields.map((field, i) => (
          <div
            key={field.name}
            className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-3.5 ${
              i < filledFields.length - 1 ? "border-b border-dashed border-[#e5e0d3]/10" : ""
            }`}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#d4a24e] sm:w-36 flex-shrink-0">
              {field.label}
            </span>
            {/* Dashed leader line on desktop */}
            <span className="hidden sm:block flex-1 border-b border-dotted border-[#e5e0d3]/15 mb-1" />
            <span className="font-serif text-base text-[#faf6ee]">
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
      className="relative w-full min-h-[100svh] bg-[#14120e] text-[#e5e0d3] overflow-hidden flex flex-col justify-center"
      style={{ colorScheme: "dark" }}
    >
      {/* Aria live region for discard announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {discardAnnouncement}
      </div>

      {/* Decorative watermark */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none select-none overflow-hidden flex flex-wrap content-start"
        aria-hidden="true"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <span key={i} className="font-display-serif text-5xl leading-[0.85] text-[#d4a24e]">
            আগমনী{" "}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        {/* Section header */}
        <motion.div
          className="text-center mb-10"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e] block mb-3">
            Registration
          </span>
          <h2 className="font-display-serif text-3xl sm:text-5xl lg:text-6xl text-[#faf6ee] tracking-tight mb-4">
            Participate in Agomoni 2026
          </h2>
          <p className="font-serif italic text-sm sm:text-base text-[#e5e0d3]/60 max-w-lg mx-auto">
            Fill in your details and tell us how you&apos;d like to be part of
            the celebration. We&apos;ll get back to you soon.
          </p>
        </motion.div>

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

        {/* ── Form Card ─────────────────────────────────────────── */}
        <div className="agomoni-form relative">
          {/* Dashed outer "cut line" with scissors */}
          <div className="absolute -inset-3 sm:-inset-4 border border-dashed border-[#d4a24e]/15 rounded-[2rem] pointer-events-none" aria-hidden="true" />
          <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10" aria-hidden="true">
            <ScissorsIcon />
          </div>

          <div className="bg-[#faf6ee]/[0.03] border border-[#e5e0d3]/8 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  className="text-center py-12 space-y-6"
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
                </motion.div>
              ) : (
                <motion.div
                  key="form-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Progress bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#e5e0d3]/40 font-bold">
                        Step {currentStep + 1} of {totalSteps}
                      </span>
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#d4a24e]/70 font-bold">
                        {step.id}
                      </span>
                    </div>

                    {/* Step dots with dashed connector */}
                    <div className="flex items-center gap-0 w-full">
                      {STEPS.map((_, i) => (
                        <div key={i} className="flex items-center flex-1 last:flex-none">
                          {/* Dot */}
                          <div
                            className={`h-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                              i === currentStep
                                ? "w-8 bg-[#d4a24e]"
                                : i < currentStep
                                  ? "w-2.5 bg-[#d4a24e]/60"
                                  : "w-2.5 bg-[#e5e0d3]/15"
                            }`}
                          />
                          {/* Connector line */}
                          {i < STEPS.length - 1 && (
                            <div className="flex-1 h-px mx-1.5">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  i < currentStep
                                    ? "bg-[#d4a24e]/50 border-none"
                                    : "border-t border-dashed border-[#e5e0d3]/15"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inline discard confirmation */}
                  <AnimatePresence>
                    {showDiscardConfirm && (
                      <motion.div
                        className="mb-6 p-5 rounded-2xl border border-[#c83a1a]/30 bg-[#c83a1a]/5"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-serif text-sm text-[#faf6ee]/80 mb-4">
                          Discard this application? Everything you&apos;ve entered will be cleared.
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setShowDiscardConfirm(false)}
                            className="font-sans text-xs uppercase tracking-[0.1em] font-bold text-[#faf6ee]/60 hover:text-[#faf6ee] px-4 py-2 rounded-full border border-[#e5e0d3]/20 hover:border-[#e5e0d3]/40 transition-colors"
                          >
                            Keep editing
                          </button>
                          <button
                            type="button"
                            onClick={performDiscard}
                            className="font-sans text-xs uppercase tracking-[0.1em] font-bold text-[#c83a1a] hover:text-[#ff6b4a] px-4 py-2 rounded-full border border-[#c83a1a]/40 hover:border-[#c83a1a] transition-colors"
                          >
                            Discard
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step content with slide animation */}
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step.id}
                      custom={direction}
                      variants={prefersReduced ? undefined : slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: prefersReduced ? 0 : 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="min-h-[260px]"
                    >
                      {/* Step title */}
                      <div className="mb-8">
                        <h3 className="font-display-serif text-xl sm:text-2xl text-[#faf6ee] mb-1">
                          {step.title}
                        </h3>
                        <p className="font-serif italic text-sm text-[#e5e0d3]/50">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Fields or review */}
                      {step.id === "review" ? (
                        <div className="space-y-4">
                          {renderReview()}

                          {/* Warning */}
                          <div className="flex items-start gap-3 py-4 px-5 rounded-2xl border border-dashed border-[#d4a24e]/30 bg-[#d4a24e]/[0.03] mt-6">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a24e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <p className="font-serif text-sm text-[#d4a24e]">
                              Please recheck your info before confirming. Hold the button below to submit your registration.
                            </p>
                          </div>

                          {/* Error */}
                          {formState === "error" && (
                            <span className="inline-block bg-[#c83a1a]/20 text-[#ff6b4a] text-sm font-serif px-4 py-2 rounded-full">
                              {resultMessage}
                            </span>
                          )}

                          {/* HoldButton */}
                          <div className="flex justify-center pt-6">
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
                        <div className="space-y-6">
                          {step.fields.map((fieldName, i) => renderField(fieldName, i))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-dashed border-[#e5e0d3]/10">
                    {/* Left: Back or Discard */}
                    <div className="flex items-center gap-3">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#e5e0d3]/50 hover:text-[#faf6ee] transition-colors px-4 py-2 rounded-full border border-[#e5e0d3]/10 hover:border-[#e5e0d3]/30"
                        >
                          Back
                        </button>
                      )}
                    </div>

                    {/* Right: Next or Review */}
                    <div className="flex items-center gap-3">
                      {/* Discard button — away from Next */}
                      {!isPending && (
                        <button
                          type="button"
                          onClick={handleDiscard}
                          className="group font-sans text-[10px] uppercase tracking-[0.1em] font-bold text-[#e5e0d3]/30 hover:text-[#c83a1a] transition-colors px-3 py-2 rounded-full border border-transparent hover:border-[#c83a1a]/30"
                        >
                          Discard
                        </button>
                      )}

                      {step.id !== "review" && (
                        <button
                          type="button"
                          onClick={goNext}
                          className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#14120e] bg-[#d4a24e] hover:bg-[#c83a1a] hover:text-[#faf6ee] transition-colors px-6 py-2.5 rounded-full"
                        >
                          {currentStep === totalSteps - 2 ? "Review" : "Next"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center font-serif italic text-xs text-[#e5e0d3]/25 mt-8">
          By registering, you agree to be contacted by the organising team regarding the event.
        </p>
      </div>
    </section>
  );
}
