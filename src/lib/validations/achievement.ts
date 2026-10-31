import { z } from "zod";

export const achievementCategories = [
  "Academics & Research",
  "Hackathons & Tech Competitions",
  "Sports & Athletics",
  "Cultural, Music & Arts",
  "Internships & Placements",
  "Open Source & Projects",
  "Leadership & Community",
  "Other",
] as const;

export const departmentOptions = [
  "CSE (Computer Science & Engineering)",
  "IT (Information Technology)",
  "ECE (Electronics & Communication Engineering)",
  "EE (Electrical Engineering)",
  "AIML (Artificial Intelligence & Machine Learning)",
  "AEIE (Applied Electronics & Instrumentation)",
  "MCA (Master of Computer Applications)",
  "Other Department",
] as const;

export const achievementSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  department: z
    .string()
    .min(2, "Department is required (e.g. CSE, IT, ECE)")
    .max(80, "Department is too long"),
  rollNumber: z
    .string()
    .min(3, "Roll number is required (e.g. DEPT20XXXXX)")
    .max(30, "Roll number is too long"),
  achievements: z
    .string()
    .min(10, "Please describe your achievement (at least 10 characters)")
    .max(3000, "Description is too long"),
  picture: z
    .string()
    .min(1, "Achievement picture is required"),
  dateYear: z
    .string()
    .min(3, "Date / Year is required (e.g. 2024 / 2025)")
    .max(40, "Date / Year string is too long"),
  category: z
    .string()
    .min(1, "Please select an achievement category"),
  additionalNotes: z
    .string()
    .max(1000, "Notes are too long")
    .optional()
    .or(z.literal("")),
  _honey: z.string().optional(),
});

export type AchievementFormData = z.infer<typeof achievementSchema>;

export interface AchievementItem {
  id: string;
  studentId?: string;
  fullName: string;
  department: string;
  rollNumber: string;
  achievements: string;
  picture: string;
  dateYear: string;
  category: string;
  additionalNotes?: string;
  status?: string;
  featured?: boolean;
  createdAt: string;
}
