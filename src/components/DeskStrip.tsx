"use client";

import { motion } from "framer-motion";
import siteData from "@/data/site.json";

export function DeskStrip() {
  return (
    <div className="hidden lg:flex flex-col items-center gap-6 fixed left-0 top-1/2 -translate-y-1/2 z-30 pl-3">
      {siteData.desks.map((desk, i) => (
        <motion.span
          key={desk}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-muted hover:text-red transition-colors cursor-default"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {desk}
        </motion.span>
      ))}
      <div className="w-px h-12 bg-rule" />
    </div>
  );
}
