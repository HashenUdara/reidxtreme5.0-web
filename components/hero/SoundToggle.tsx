"use client";

import { AnimatePresence, motion } from "motion/react";

type SoundToggleProps = {
  visible: boolean;
  muted: boolean;
  onToggle: () => void;
};

const BAR_DELAYS = ["0s", "-0.45s", "-0.2s", "-0.65s"];

export function SoundToggle({ visible, muted, onToggle }: SoundToggleProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-pressed={!muted}
          onClick={onToggle}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-9 items-center gap-2.5 rounded-md border bg-bg/50 px-3 text-[11px] font-medium tracking-[0.2em] uppercase backdrop-blur-md transition-[border-color,color,box-shadow] duration-300 hover:border-mint hover:text-white hover:shadow-[0_0_14px_rgb(140_245_189/0.25)] ${
            muted ? "border-line text-muted" : "border-mint/60 text-mint"
          }`}
        >
          <span aria-hidden className="flex h-3 items-end gap-[2px]">
            {BAR_DELAYS.map((delay) => (
              <span
                key={delay}
                style={{ animationDelay: delay }}
                className={`h-full w-[2px] origin-bottom rounded-[1px] bg-current ${
                  muted ? "scale-y-[0.35]" : "animate-sound-bar"
                }`}
              />
            ))}
          </span>
          Sound
        </motion.button>
      )}
    </AnimatePresence>
  );
}
