"use client";

import { useState, useTransition, useCallback } from "react";
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

/* ─── Step Definitions ─────────────────────────────────────────
   Group form fields into logical steps for the multi-step flow.
   Each step has a title, subtitle, and which field names it covers. */

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

/* ─── Multi-Step Participation Form ──────────────────────────── */

export function ParticipationForm() {
  const prefersReduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formState, setFormState] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [resultMessage, setResultMessage] = useState("");

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];

  /* ── Field value management ──────────────────────────────────── */
  const updateField = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  /* ── Step validation ─────────────────────────────────────────── */
  const validateCurrentStep = useCallback((): boolean => {
    const stepFields = STEPS[currentStep].fields;
    if (stepFields.length === 0) return true; // review step

    // Build partial object for validation
    const partial: Record<string, string> = {};
    for (const name of stepFields) {
      partial[name] = formData[name] ?? "";
    }

    // Validate only the current step's fields
    const errors: Record<string, string[]> = {};
    const fieldConfigs = AGOMONI_FIELDS.filter((f) =>
      stepFields.includes(f.name)
    );

    for (const field of fieldConfigs) {
      const value = partial[field.name] ?? "";
      if (field.required && !value.trim()) {
        errors[field.name] = [`${field.label} is required`];
      }
    }

    // Also run Zod on full data to catch format errors
    const fullData = { ...formData };
    const result = agomoniSchema.safeParse(fullData);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0]?.toString() ?? "_form";
        if (stepFields.includes(fieldName)) {
          if (!errors[fieldName]) errors[fieldName] = [];
          // Don't duplicate "required" errors
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

  /* ── Final submit via HoldButton ─────────────────────────────── */
  const handleFinalSubmit = useCallback(() => {
    // Full validation
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
      } else {
        setFormState("error");
        setResultMessage(serverResult.error);
        if (serverResult.fieldErrors) {
          setFieldErrors(serverResult.fieldErrors);
        }
      }
    });
  }, [formData, startTransition]);

  /* ── Input styles ────────────────────────────────────────────── */
  const inputBase =
    "w-full bg-[#e5e0d3] border border-[#14120e]/20 px-4 py-3.5 font-serif text-base text-[#14120e] placeholder:text-[#14120e]/35 focus:border-[#d4a24e] focus:ring-1 focus:ring-[#d4a24e]/40 outline-none transition-colors";

  /* ── Render a single field ───────────────────────────────────── */
  const renderField = (fieldName: string) => {
    const field = AGOMONI_FIELDS.find((f) => f.name === fieldName);
    if (!field) return null;

    const errors = fieldErrors[field.name];
    const hasError = errors && errors.length > 0;
    const value = formData[field.name] ?? "";

    return (
      <div key={field.name} className="space-y-1.5">
        <label
          htmlFor={`agomoni-${field.name}`}
          className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#e5e0d3]/70"
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
            className={`${inputBase} ${hasError ? "border-[#c83a1a]" : ""}`}
          >
            <option value="" disabled>
              {field.placeholder}
            </option>
            {"options" in field &&
              field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`${inputBase} resize-y ${hasError ? "border-[#c83a1a]" : ""}`}
          />
        ) : (
          <input
            type={field.type}
            id={`agomoni-${field.name}`}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputBase} ${hasError ? "border-[#c83a1a]" : ""}`}
          />
        )}

        {hasError && (
          <p className="text-[#c83a1a] text-xs font-sans">{errors[0]}</p>
        )}
      </div>
    );
  };

  /* ── Review step content ─────────────────────────────────────── */
  const renderReview = () => {
    const filledFields = AGOMONI_FIELDS.filter(
      (f) => formData[f.name]?.trim()
    );
    return (
      <div className="space-y-4">
        {filledFields.map((field) => (
          <div
            key={field.name}
            className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 border-b border-[#e5e0d3]/10"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#d4a24e] sm:w-36 flex-shrink-0">
              {field.label}
            </span>
            <span className="font-serif text-base text-[#faf6ee]">
              {formData[field.name]}
            </span>
          </div>
        ))}

        {/* Warning to recheck */}
        <div className="flex items-center gap-3 py-4 px-5 border border-[#d4a24e]/30 bg-[#d4a24e]/5 mt-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4a24e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="font-serif text-sm text-[#d4a24e]">
            Please recheck your info before confirming. Hold the button below to
            submit your registration.
          </p>
        </div>

        {/* Global error */}
        {formState === "error" && (
          <p className="text-[#c83a1a] text-sm font-serif text-center pt-2">
            {resultMessage}
          </p>
        )}

        {/* HoldButton for final confirm */}
        <div className="flex justify-center pt-6">
          <HoldButton
            doneLabel="Registered!"
            backgroundColor="#1e1c18"
            fillColor="#d4a24e"
            textColor="#faf6ee"
            fillTextColor="#14120e"
            size="lg"
            radius={0}
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
    );
  };

  return (
    <section
      id="participate"
      className="relative w-full bg-[#14120e] text-[#e5e0d3] overflow-hidden"
    >
      {/* Decorative watermark */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden flex flex-wrap content-start"
        aria-hidden="true"
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <span
            key={i}
            className="font-display-serif text-5xl leading-[0.85] text-[#d4a24e]"
          >
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

        {/* Honeypot — hidden from real users */}
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d4a24e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display-serif text-2xl sm:text-3xl text-[#faf6ee]">
                You&apos;re In!
              </h3>
              <p className="font-serif text-base text-[#e5e0d3]/70 max-w-md mx-auto">
                {resultMessage}
              </p>
              <div className="flex items-center justify-center gap-3 text-[#d4a24e]">
                <span className="w-8 h-px bg-[#d4a24e]/40" />
                <span className="font-serif italic text-sm">
                  Ashche bochor abar hobe
                </span>
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
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#d4a24e] font-bold">
                    {step.id}
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[#e5e0d3]/10 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#d4a24e]"
                    initial={false}
                    animate={{
                      width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

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
                  className="min-h-[280px]"
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
                    renderReview()
                  ) : (
                    <div className="space-y-6">
                      {step.fields.map((fieldName) => renderField(fieldName))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {step.id !== "review" && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e5e0d3]/10">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={currentStep === 0}
                    className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#e5e0d3]/50 hover:text-[#faf6ee] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2"
                  >
                    Back
                  </button>

                  {/* Step dots */}
                  <div className="flex items-center gap-2">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 transition-all duration-300 ${
                          i === currentStep
                            ? "w-6 bg-[#d4a24e]"
                            : i < currentStep
                              ? "w-1.5 bg-[#d4a24e]/60"
                              : "w-1.5 bg-[#e5e0d3]/20"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#14120e] bg-[#d4a24e] hover:bg-[#c83a1a] hover:text-[#faf6ee] transition-colors px-6 py-2.5"
                  >
                    {currentStep === totalSteps - 2 ? "Review" : "Next"}
                  </button>
                </div>
              )}

              {/* Back button on review step */}
              {step.id === "review" && (
                <div className="flex justify-start mt-8 pt-6 border-t border-[#e5e0d3]/10">
                  <button
                    type="button"
                    onClick={goBack}
                    className="font-sans text-xs uppercase tracking-[0.15em] font-bold text-[#e5e0d3]/50 hover:text-[#faf6ee] transition-colors px-4 py-2"
                  >
                    Go Back &amp; Edit
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center font-serif italic text-xs text-[#e5e0d3]/30 mt-8">
          By registering, you agree to be contacted by the organising team
          regarding the event.
        </p>
      </div>
    </section>
  );
}
