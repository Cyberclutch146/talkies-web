import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Achievements // Hall of Fame",
  description:
    "Submit and explore student milestones, hackathon wins, academic research, placements, and creative achievements at RCCIIT.",
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

