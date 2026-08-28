import * as z from "zod";
import { LEAD_POSITIONS, TEAM_DESK_NAMES } from "@/data/positions";

const baseApplicationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  collegeEmail: z
    .string()
    .email("Invalid email address")
    .max(200, "Email must be under 200 characters"),
  rollNumber: z
    .string()
    .min(1, "Roll number is required")
    .max(30, "Roll number must be under 30 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be under 15 characters")
    .regex(/^[\d\s+\-()]+$/, "Phone number can only contain digits, spaces, +, -, (, )"),
  portfolioLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  whyJoin: z
    .string()
    .max(2000, "Response must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export const leadApplicationSchema = baseApplicationSchema.extend({
  type: z.literal("LEAD"),
  yearOfStudy: z.literal("3", {
    error: "Leads must be in their 3rd year of study.",
  }),
  positionAppliedFor: z.enum(
    LEAD_POSITIONS,
    {
      error: "Please select a valid lead position.",
    }
  ),
});

export const teamApplicationSchema = baseApplicationSchema.extend({
  type: z.literal("TEAM"),
  yearOfStudy: z.enum(["1", "2", "3"], {
    error: "Team members must be in 1st, 2nd, or 3rd year.",
  }),
  positionAppliedFor: z.enum(
    TEAM_DESK_NAMES as unknown as [string, ...string[]],
    {
      error: "Please select a valid team desk.",
    }
  ),
});

export type LeadApplication = z.infer<typeof leadApplicationSchema>;
export type TeamApplication = z.infer<typeof teamApplicationSchema>;
