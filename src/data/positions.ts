/**
 * Shared position/desk constants for the recruitment system.
 * Used by: validation schemas, join landing page, lead & team form pages.
 *
 * ⚠️  If you add/remove a position here, the Zod validation schema
 *     in src/lib/validations/application.ts picks it up automatically.
 */

export const LEAD_POSITIONS = [
  "Editor-in-Chief",
  "Tech Lead",
  "Graphics Lead cum Editorial Associate",
  "Social Media Lead",
  "Content Lead",
  "Artwork Lead",
  "Lead Journalist",
  "Media Journalist Lead",
  "Research Wing Lead",
  "Alumni POC",
  "Event Management Lead",
] as const;

export type LeadPosition = (typeof LEAD_POSITIONS)[number];

export const TEAM_DESKS = [
  {
    name: "Editorial Member" as const,
    desc: "Writing, editing, and proofreading for the quarterly magazine and campus reports.",
  },
  {
    name: "Tech Member" as const,
    desc: "Development, website maintenance, and digital innovation.",
  },
  {
    name: "Graphics & Editorial Member" as const,
    desc: "Visual storytelling — photography, poster design, and creative artwork.",
  },
  {
    name: "Social Media Member" as const,
    desc: "Social media management, outreach, and community engagement.",
  },
  {
    name: "Content Member" as const,
    desc: "Crafting engaging content, scripts, and promotional copy.",
  },
  {
    name: "Artwork Member" as const,
    desc: "Creating illustrations, digital art, and visual assets.",
  },
  {
    name: "Journalist" as const,
    desc: "On-ground fest coverage, interviews, and breaking campus stories.",
  },
  {
    name: "Media Journalist" as const,
    desc: "Multimedia reporting, video coverage, and broadcasting.",
  },
  {
    name: "Research Wing Member" as const,
    desc: "Data-driven event reports, surveys, and in-depth investigative features.",
  },
  {
    name: "Alumni Team Member" as const,
    desc: "Building and maintaining connections with the RCCIIT alumni network.",
  },
  {
    name: "Event Management Member" as const,
    desc: "Organizing, coordinating, and managing club events and logistics.",
  },
] as const;

export const TEAM_DESK_NAMES = TEAM_DESKS.map((d) => d.name);
export type TeamDeskName = (typeof TEAM_DESKS)[number]["name"];
