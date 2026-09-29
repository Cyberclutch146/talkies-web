"use server";

import { agomoniSchema, type AgomoniFormData } from "@/lib/validations/agomoni";

export type AgomoniSubmitResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitAgomoniForm(
  data: AgomoniFormData
): Promise<AgomoniSubmitResult> {
  // ── 1. Honeypot check ──────────────────────────────────────────
  if (data._honey) {
    // Silently reject bots — appear successful
    return { success: true, message: "Registered successfully!" };
  }

  // ── 2. Server-side validation ──────────────────────────────────
  const result = agomoniSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString() ?? "_form";
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message);
    }
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  // ── 3. TODO: Persist to database / Google Sheets / Firebase ────
  // For now, just log to console. Replace with actual storage later.
  console.log("[Agomoni 2026] New registration:", result.data);

  // Simulate slight network delay for UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "You're registered for Agomoni 2026! We'll reach out soon. 🪷",
  };
}
