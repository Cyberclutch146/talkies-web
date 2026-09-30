import * as z from "zod";

// ─── Participation Categories ───────────────────────────────────────
export const PARTICIPATION_CATEGORIES = [
  "Music (Vocal)",
  "Music (Instrumental)",
  "Dance",
  "Recitation",
] as const;

// ─── Year Options ───────────────────────────────────────────────────
export const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;

// ─── Performance Duration Options ───────────────────────────────────
export const DURATION_OPTIONS = [
  "3–5 minutes",
  "5–8 minutes",
  "8–10 minutes",
  "10–15 minutes",
] as const;

// ─── Field Definitions (single config for dynamic rendering) ────────
export const AGOMONI_FIELDS = [
  {
    name: "teamLeaderName" as const,
    label: "Team Leader Name",
    type: "text" as const,
    placeholder: "e.g. Arpita Mukherjee",
    required: true,
  },
  {
    name: "department" as const,
    label: "Department",
    type: "text" as const,
    placeholder: "e.g. CSE, ECE, IT…",
    required: true,
  },
  {
    name: "year" as const,
    label: "Year of Study",
    type: "select" as const,
    options: YEAR_OPTIONS,
    placeholder: "Select your year",
    required: true,
  },
  {
    name: "contact" as const,
    label: "Phone / WhatsApp",
    type: "tel" as const,
    placeholder: "10-digit mobile number",
    required: true,
  },
  {
    name: "email" as const,
    label: "Email Address",
    type: "email" as const,
    placeholder: "your.email@example.com",
    required: false,
  },
  {
    name: "category" as const,
    label: "Performance Category",
    type: "select" as const,
    options: PARTICIPATION_CATEGORIES,
    placeholder: "Select your performance type",
    required: true,
  },
  {
    name: "duration" as const,
    label: "Required Performance Time",
    type: "select" as const,
    options: DURATION_OPTIONS,
    placeholder: "How long is your performance?",
    required: true,
  },
  {
    name: "teamMembers" as const,
    label: "Team Members",
    type: "textarea" as const,
    placeholder: "List all team member names, one per line\ne.g.\nRahul Das — 2nd Year CSE\nProva Sen — 3rd Year ECE",
    required: true,
  },
  {
    name: "message" as const,
    label: "Additional Notes",
    type: "textarea" as const,
    placeholder: "Song / piece name, special requirements, instruments needed…",
    required: false,
  },
] as const;

// ─── Zod Schema ─────────────────────────────────────────────────────
export const agomoniSchema = z.object({
  teamLeaderName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  department: z
    .string()
    .min(1, "Department is required")
    .max(100, "Department must be under 100 characters"),
  year: z.enum(YEAR_OPTIONS, {
    error: "Please select your year of study",
  }),
  contact: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be under 15 characters")
    .regex(/^[\d\s+\-()]+$/, "Enter a valid phone number"),
  email: z
    .string()
    .email("Enter a valid email address")
    .max(200, "Email must be under 200 characters")
    .optional()
    .or(z.literal("")),
  category: z.enum(PARTICIPATION_CATEGORIES, {
    error: "Please select a performance category",
  }),
  duration: z.enum(DURATION_OPTIONS, {
    error: "Please select the required performance time",
  }),
  teamMembers: z
    .string()
    .min(2, "Please list your team members")
    .max(2000, "Team members list must be under 2000 characters"),
  message: z
    .string()
    .max(1000, "Message must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  // Honeypot — must remain empty
  _honey: z.literal("").optional(),
});

export type AgomoniFormData = z.infer<typeof agomoniSchema>;
