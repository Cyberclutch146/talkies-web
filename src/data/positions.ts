/**
 * Shared position/desk constants for the recruitment system.
 * Used by: validation schemas, join landing page, lead & team form pages.
 *
 * ⚠️  If you add/remove a position here, the Zod validation schema
 *     in src/lib/validations/application.ts picks it up automatically.
 */

export const LEAD_POSITIONS = [
  "Reporting Lead",
  "PR & Social Media Lead",
  "Alumni POC",
  "Content Lead",
  "Research Wing Lead",
  "Videography Lead",
  "Artwork Lead",
  "Graphics Lead",
  "Event Management Lead",
  "Tech Lead",
  "Production Lead",
] as const;

export type LeadPosition = (typeof LEAD_POSITIONS)[number];

export const TEAM_DESKS = [
  {
    name: "Reporting Associate" as const,
    desc: "On-ground fest coverage, interviews, breaking campus stories, and multimedia reporting.",
  },
  {
    name: "PR & Social Media Associate" as const,
    desc: "Social media management, outreach, and community engagement.",
  },
  {
    name: "Alumni Associate" as const,
    desc: "Building and maintaining connections with the RCCIIT alumni network.",
  },
  {
    name: "Content Associate" as const,
    desc: "Crafting engaging content, scripts, and promotional copy.",
  },
  {
    name: "Research Wing Associate" as const,
    desc: "Data-driven event reports, surveys, and in-depth investigative features.",
  },
  {
    name: "Videography Associate" as const,
    desc: "Video production, shooting, and cinematic storytelling.",
  },
  {
    name: "Video Editing Associate" as const,
    desc: "Video editing, color grading, and post-production.",
  },
  {
    name: "Artwork Associate" as const,
    desc: "Creating illustrations, digital art, and visual assets.",
  },
  {
    name: "Graphics Associate" as const,
    desc: "Visual storytelling — photography, poster design, and visual branding.",
  },
  {
    name: "Event Management Associate" as const,
    desc: "Organizing, coordinating, and managing club events and logistics.",
  },
  {
    name: "Tech Associate" as const,
    desc: "Development, website maintenance, and digital innovation.",
  },
] as const;

export const TEAM_DESK_NAMES = TEAM_DESKS.map((d) => d.name);
export type TeamDeskName = (typeof TEAM_DESKS)[number]["name"];
