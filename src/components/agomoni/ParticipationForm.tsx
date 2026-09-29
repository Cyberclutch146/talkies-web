"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { agomoniSchema, AGOMONI_FIELDS, type AgomoniFormData } from "@/lib/validations/agomoni";
import { submitAgomoniForm, type AgomoniSubmitResult } from "@/app/agomoni/actions";

/* ─── Participation Form ─────────────────────────────────────────
   Renders fields from AGOMONI_FIELDS config. Validates client-side
   with Zod, submits via Server Action, shows loading/success/error. */

export function ParticipationForm() {
  const prefersReduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      raw[key] = value as string;
    }

    // Client-side validation
    const result = agomoniSchema.safeParse(raw);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0]?.toString() ?? "_form";
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      }
      setFieldErrors(errors);
      setFormState("error");
      setResultMessage("Please fix the errors below.");
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
  }

  const inputBase =
    "w-full bg-[#e5e0d3] border border-[#14120e]/20 px-4 py-3 font-serif text-base text-[#14120e] placeholder:text-[#14120e]/35 focus:border-[#d4a24e] focus:ring-1 focus:ring-[#d4a24e]/40 outline-none transition-colors";

  return (
    <section
      id="participate"
      className="relative w-full bg-[#14120e] text-[#e5e0d3] border-b border-[#d4a24e]/20 overflow-hidden"
    >
      {/* Decorative watermark */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden flex flex-wrap content-start" aria-hidden="true">
        {Array.from({ length: 100 }).map((_, i) => (
          <span key={i} className="font-display-serif text-5xl leading-[0.85] text-[#d4a24e]">
            আগমনী{" "}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#d4a24e] block mb-3">
            ✦ Registration
          </span>
          <h2 className="font-display-serif text-3xl sm:text-5xl lg:text-6xl text-[#faf6ee] tracking-tight mb-4">
            Participate in Agomoni 2026
          </h2>
          <p className="font-serif italic text-sm sm:text-base text-[#e5e0d3]/60 max-w-lg mx-auto">
            Fill in your details and tell us how you&apos;d like to be part of the celebration.
            We&apos;ll get back to you soon.
          </p>
        </motion.div>

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
              <h3 className="font-display-serif text-2xl sm:text-3xl text-[#faf6ee]">
                You&apos;re In!
              </h3>
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
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              noValidate
            >
              {/* Honeypot — hidden from real users */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="agomoni-honey">Do not fill this</label>
                <input
                  type="text"
                  id="agomoni-honey"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {AGOMONI_FIELDS.map((field) => {
                const errors = fieldErrors[field.name];
                const hasError = errors && errors.length > 0;

                return (
                  <motion.div
                    key={field.name}
                    className="space-y-1.5"
                    initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
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
                        name={field.name}
                        required={field.required}
                        defaultValue=""
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
                        name={field.name}
                        placeholder={field.placeholder}
                        rows={3}
                        className={`${inputBase} resize-y ${hasError ? "border-[#c83a1a]" : ""}`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={`agomoni-${field.name}`}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={`${inputBase} ${hasError ? "border-[#c83a1a]" : ""}`}
                      />
                    )}

                    {hasError && (
                      <p className="text-[#c83a1a] text-xs font-sans">
                        {errors[0]}
                      </p>
                    )}
                  </motion.div>
                );
              })}

              {/* Global error */}
              {formState === "error" && !Object.keys(fieldErrors).length && (
                <p className="text-[#c83a1a] text-sm font-serif text-center">
                  {resultMessage}
                </p>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#d4a24e] text-[#14120e] font-display text-base sm:text-lg uppercase tracking-tight px-8 py-4 hover:bg-[#c83a1a] hover:text-[#faf6ee] disabled:opacity-50 disabled:cursor-wait transition-colors duration-300 relative"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.span
                        className="inline-block w-4 h-4 border-2 border-[#14120e]/30 border-t-[#14120e] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Submitting…
                    </span>
                  ) : (
                    "Register for Agomoni 2026"
                  )}
                </button>
              </div>

              <p className="text-center font-serif italic text-xs text-[#e5e0d3]/40 mt-4">
                By registering, you agree to be contacted by the organising team regarding the event.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
