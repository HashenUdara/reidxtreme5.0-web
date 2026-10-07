"use client";

import { motion } from "motion/react";

export function ScrollCue({ visible }: { visible: boolean }) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-start gap-3"
    >
      <span className="text-[11px] font-medium tracking-[0.28em] text-muted uppercase">
        Scroll
      </span>
      <span className="relative ml-px h-12 w-px overflow-hidden bg-mint/20">
        <span className="soft-glow absolute inset-x-0 top-0 h-3 animate-scroll-cue bg-mint" />
      </span>
    </motion.div>
  );
}
