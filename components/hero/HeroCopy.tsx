"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { STAGE } from "./stages";
import Link from "next/link";

const EASE_DRAW = [0.16, 1, 0.3, 1] as const;

// Words surface out of the mist. Reduced motion keeps only the fade.
const word = (reduced: boolean): Variants => ({
  hidden: reduced
    ? { opacity: 0 }
    : { opacity: 0, y: "0.32em", filter: "blur(12px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: EASE_DRAW },
  },
});

const line: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
};

type Word = { text: string; accent?: boolean };

const LINE_ONE: Word[] = [
  { text: "Cross" },
  { text: "the" },
  { text: "chasm.", accent: true },
];
const LINE_TWO: Word[] = [
  { text: "Bridge" },
  { text: "the" },
  { text: "horizons.", accent: true },
];

// The copy fills the sky between the nav and the bridge tower, so it never
// covers the bridge. The tower top sits 35.6% down the 16:9 frame. On screens
// wider than 16:9 the cover crop trims top and bottom, which raises it to
// 50% - 8.1% of the width. Units resolve against the hero (a size container).
const GEOMETRY = {
  "--tower": "min(35.6cqh, calc(50cqh - 8.1cqw))",
  "--copy-space": "calc(var(--tower) - var(--nav-h) - 1rem)",
} as CSSProperties;

// Two headline lines at 0.9 line-height, after ~5.25rem of eyebrow, subline and gaps.
const HEADLINE_SIZE =
  "clamp(2rem, min(10.5cqw, calc((var(--copy-space) - 5.25rem) / 1.8)), 7rem)";

type HeroCopyProps = {
  stage: number;
  /** Video finished or skipped: brings the accent glow to full strength. */
  settled: boolean;
  reduced: boolean;
};

export function HeroCopy({ stage, settled, reduced }: HeroCopyProps) {
  const at = (s: number) => (stage >= s ? "shown" : "hidden");

  return (
    <div
      style={GEOMETRY}
      className="absolute inset-x-0 top-(--nav-h) flex h-(--copy-space) flex-col items-center justify-center px-[4%] text-center"
    >
      <h1 className="flex flex-col items-center pt-10 md:pt-16">
        <Eyebrow state={at(STAGE.eyebrow)}>REID XTREME 5.0</Eyebrow>

        <span
          className="mt-3.5 font-display leading-[0.9] font-bold text-white uppercase md:mt-4"
          style={{ fontSize: HEADLINE_SIZE, "--glow": settled ? 1 : 0.35 } as CSSProperties}
        >
          <HeadlineLine words={LINE_ONE} state={at(STAGE.lineOne)} reduced={reduced} />
          <HeadlineLine words={LINE_TWO} state={at(STAGE.lineTwo)} reduced={reduced} />
        </span>
      </h1>
    </div>
  );
}

function HeadlineLine({
  words,
  state,
  reduced,
}: {
  words: Word[];
  state: "hidden" | "shown";
  reduced: boolean;
}) {
  return (
    <motion.span initial="hidden" animate={state} variants={line} className="block">
      {words.map((w, i) => (
        <span key={w.text}>
          {i > 0 && " "}
          <motion.span
            variants={word(reduced)}
            className={w.accent ? "inline-block text-mint text-glow" : "inline-block"}
            style={w.accent ? { transition: "--glow 1.6s var(--ease-standard)" } : undefined}
          >
            {w.text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Hairlines draw outward from the label, like the first structural lines of the bridge.
function Eyebrow({ state, children }: { state: "hidden" | "shown"; children: ReactNode }) {
  const draw: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    shown: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: EASE_DRAW } },
  };
  const fade: Variants = {
    hidden: { opacity: 0 },
    shown: { opacity: 1, transition: { delay: 0.25, duration: 0.9, ease: EASE_DRAW } },
  };

  return (
    <motion.span
      initial="hidden"
      animate={state}
      className="flex items-center gap-4 text-xs font-medium tracking-[0.32em] text-mint md:gap-5 md:text-[13px]"
    >
      <motion.span
        variants={draw}
        className="h-px w-10 origin-right bg-linear-to-l from-mint/70 to-transparent md:w-16"
      />
      {/* Negative margin cancels the trailing letter-spacing so the label stays centred. */}
      <motion.span variants={fade} className="-mr-[0.32em]">
        {children}
      </motion.span>
      <motion.span
        variants={draw}
        className="h-px w-10 origin-left bg-linear-to-r from-mint/70 to-transparent md:w-16"
      />
    </motion.span>
  );
}
