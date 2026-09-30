"use server";

import { agomoniSchema, type AgomoniFormData } from "@/lib/validations/agomoni";
import { appendRow } from "@/lib/google-sheets";

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

  // ── 3. Persist to Google Sheets ────────────────────────────────
  const validated = result.data;

  try {
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Row order: Timestamp | Team Leader | Dept | Year | Phone | Email | Category | Duration | Team Members | Notes
    await appendRow([
      timestamp,
      validated.teamLeaderName,
      validated.department,
      validated.year,
      validated.contact,
      validated.email ?? "",
      validated.category,
      validated.duration,
      validated.teamMembers,
      validated.message ?? "",
    ]);
  } catch (err) {
    console.error("[Agomoni 2026] Google Sheets error:", err);
    console.log("[Agomoni 2026] Registration data (fallback log):", validated);
  }

  return {
    success: true,
    message: "Your group is registered for Agomoni 2026! We'll reach out to the team leader soon.",
  };
}
