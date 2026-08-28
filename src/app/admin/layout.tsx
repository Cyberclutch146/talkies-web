import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Administrative dashboard for RCC Talkies editorial board.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
