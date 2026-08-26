import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Event coverage reports by RCC Talkies — detailed analyses of GOT, TechTrix, Regalia, and more at RCCIIT.",
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
