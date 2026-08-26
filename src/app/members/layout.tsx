import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Meet the RCC Talkies team — core members, website builders, and faculty advisors powering RCCIIT's journalism club.",
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
