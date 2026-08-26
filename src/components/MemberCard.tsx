"use client";

import { motion } from "framer-motion";

interface MemberCardProps {
  name: string;
  role: string;
  image?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-red",
    "bg-ink",
    "bg-muted",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function MemberCard({ name, role }: MemberCardProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="border border-rule p-5 flex flex-col items-center text-center gap-4 group"
    >
      {/* Avatar */}
      <div
        className={`w-16 h-16 ${bgColor} text-cream flex items-center justify-center font-display text-xl`}
      >
        {initials}
      </div>

      <div>
        <h3 className="font-display text-lg leading-tight group-hover:text-red transition-colors">
          {name}
        </h3>
        <p className="text-xs text-muted uppercase tracking-wider mt-1">
          {role}
        </p>
      </div>
    </motion.div>
  );
}
