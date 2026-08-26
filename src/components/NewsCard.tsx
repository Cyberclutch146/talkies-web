"use client";

import { motion } from "framer-motion";

interface NewsCardProps {
  tag: string;
  title: string;
  blurb: string;
  date?: string;
}

export function NewsCard({ tag, title, blurb, date }: NewsCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="border border-rule bg-cream-light p-5 flex flex-col gap-3 group cursor-default"
    >
      <span className="inline-block self-start bg-red text-cream text-[10px] font-body font-bold uppercase tracking-widest px-2 py-0.5">
        {tag}
      </span>
      <h3 className="font-display text-xl sm:text-2xl leading-tight group-hover:text-red transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed line-clamp-3">
        {blurb}
      </p>
      {date && (
        <time className="text-xs text-muted uppercase tracking-wider mt-auto pt-2 border-t border-rule">
          {date}
        </time>
      )}
    </motion.article>
  );
}
