import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazine",
  description:
    "Read the RCC Talkies magazine — RCCIIT's quarterly student publication covering campus life, technology, culture, and student voices.",
};

export default function MagazineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
