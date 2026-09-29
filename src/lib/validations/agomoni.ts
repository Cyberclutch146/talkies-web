import * as z from "zod";

// ─── Participation Categories ───────────────────────────────────────
// TODO: Replace with final list once confirmed
export const PARTICIPATION_CATEGORIES = [
  "Dance",
  "Music (Vocal)",
  "Music (Instrumental)",
  "Drama / Skit",
  "Recitation",
  "Art / Painting",
  "Photography",
  "Quiz",
  "Other",
] as const;

// ─── Year Options ───────────────────────────────────────────────────
export const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;

// ─── Field Definitions (single config for dynamic rendering) ────────
export const AGOMONI_FIELDS = [
  {
    name: "name" as const,
    label: "Full Name",
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
    label: "Participation Category",
    type: "select" as const,
    options: PARTICIPATION_CATEGORIES,
    placeholder: "What would you like to perform / participate in?",
    required: true,
  },
  {
    name: "message" as const,
    label: "Anything else?",
    type: "textarea" as const,
    placeholder: "Team members, song choice, special requirements…",
    required: false,
  },
] as const;

// ─── Zod Schema ─────────────────────────────────────────────────────
export const agomoniSchema = z.object({
  name: z
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
    error: "Please select a participation category",
  }),
  message: z
    .string()
    .max(1000, "Message must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  // Honeypot — must remain empty
  _honey: z.literal("").optional(),
});

export type AgomoniFormData = z.infer<typeof agomoniSchema>;
