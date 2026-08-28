import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Apply to join RCC Talkies — leadership positions and team member recruitment for RCCIIT's journalism and media society.",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
