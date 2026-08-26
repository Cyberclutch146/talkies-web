import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore RCC Talkies' coverage of RCCIIT events: Game of Trophies, TechTrix, Regalia, and external hackathons and competitions.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
