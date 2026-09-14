import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruitment Closed",
  description:
    "Applications for RCC Talkies are currently closed. Please apply next year when recruitment reopens for RCCIIT's journalism and media society.",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
