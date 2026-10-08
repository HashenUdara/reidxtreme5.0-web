"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { useHydrated } from "@/hooks/useHydrated";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { cx } from "@/lib/cx";

type Prize = { place: 1 | 2 | 3; label: string; amount: number | string };

const PRIZES: Prize[] = [
  { place: 2, label: "2ND PLACE", amount: "TBD" },
  { place: 1, label: "1ST PLACE", amount: "TBD" },
  { place: 3, label: "3RD PLACE", amount: "TBD" },
];

const STAGGER_INDEX: Record<Prize["place"], number> = {
  1: 0,
  2: 1,
  3: 2,
};

// Design system sections 10, 19, and 34: count once, or show the final value for reduced motion.
function useCountUp(
  target: number,
  isVisible: boolean,
  hasMounted: boolean,
  reducedMotion: boolean,
  staggerIndex: number,
) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (!hasMounted || !isVisible || reducedMotion) return;

    let frame = 0;
    const timeout = window.setTimeout(() => {
      const startTime = performance.now();
      setCount(0);

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / 1100, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.round(target * easedProgress));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };

      frame = window.requestAnimationFrame(tick);
    }, 1300 + staggerIndex * 180);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [hasMounted, isVisible, reducedMotion, staggerIndex, target]);

  return !hasMounted || !isVisible || reducedMotion ? target : count;
}

// Entrance timings, offset per card by --i (DESIGN.md §10 and §19).
const BUILD = {
  panel: "before:animate-[fade-in_500ms_var(--ease-standard)_calc(500ms_+_var(--i))_both]",
  corner: "animate-[fade-in_180ms_var(--ease-standard)_var(--i)_both]",
  medal: "animate-[draw-line_900ms_var(--ease-draw)_calc(900ms_+_var(--i))_both]",
  number: "animate-[fade-in_300ms_var(--ease-standard)_calc(1.1s_+_var(--i))_both]",
  label: "animate-[rise-in_450ms_var(--ease-standard)_calc(1.1s_+_var(--i))_both]",
  amount: "animate-[fade-in_450ms_var(--ease-standard)_calc(1.3s_+_var(--i))_both]",
  currency: "animate-[rise-in_450ms_var(--ease-standard)_calc(1.7s_+_var(--i))_both]",
};

const CORNERS = [
  "top-[0.6rem] left-[0.6rem] border-t border-l",
  "top-[0.6rem] right-[0.6rem] border-t border-r",
  "bottom-[0.6rem] left-[0.6rem] border-b border-l",
  "bottom-[0.6rem] right-[0.6rem] border-b border-r",
];

function Medal({ place, build }: { place: Prize["place"]; build: boolean }) {
  const line = cx(
    "fill-none stroke-current stroke-[1.5] [stroke-dasharray:1] [stroke-linecap:round] [stroke-linejoin:round]",
    build && BUILD.medal,
  );
  return (
    <svg
      aria-hidden="true"
      className="relative z-1 block h-20 w-16 overflow-visible text-mint"
      focusable="false"
      viewBox="0 0 64 80"
    >
      <path className={line} d="M22 43 18 69l14-8 14 8-4-26" pathLength="1" />
      <path
        className={line}
        d="M32 5c3 0 4 4 7 5 3 1 6-1 8 1s0 6 2 9 6 2 7 5-3 5-3 8 3 5 2 8-6 3-8 5-1 6-4 8-6-1-9 0-4 4-7 3-3-5-6-7-6-1-8-4 1-6 0-9-5-4-5-7 4-4 5-7-1-6 1-9 6-2 8-4 2-6 5-7 5 2 8 1z"
        pathLength="1"
      />
      <circle className={line} cx="32" cy="31" r="14" pathLength="1" />
      <text
        className={cx("fill-mint font-display text-base font-semibold", build && BUILD.number)}
        x="32"
        y="36"
        textAnchor="middle"
      >
        {place}
      </text>
    </svg>
  );
}

type PrizeCardProps = {
  prize: Prize;
  isVisible: boolean;
  hasMounted: boolean;
  reducedMotion: boolean;
};

function PrizeCard({ prize, isVisible, hasMounted, reducedMotion }: PrizeCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const staggerIndex = STAGGER_INDEX[prize.place];
  const count = useCountUp(
    typeof prize.amount === "number" ? prize.amount : 0,
    isVisible,
    hasMounted,
    reducedMotion,
    staggerIndex
  );
  const first = prize.place === 1;
  // Hidden until it scrolls in, but only once JS is running to reveal it.
  const waiting = hasMounted && !isVisible && !reducedMotion;
  const build = isVisible && !reducedMotion;

  function updateCursorLight(event: React.PointerEvent<HTMLElement>) {
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  }

  return (
    <article
      aria-label={`${prize.label}: ${prize.amount.toLocaleString("en-US")} LKR`}
      className={cx(
        "relative flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-transparent px-[0.85rem] py-[clamp(1.1rem,2vw,1.75rem)] text-center backdrop-blur-md",
        "transition-[box-shadow,transform] duration-300 ease-standard motion-reduce:transition-none",
        "hover:-translate-y-[3px] hover:shadow-[0_0_14px_rgb(140_245_189/0.25)] focus-visible:-translate-y-[3px] focus-visible:shadow-[0_0_14px_rgb(140_245_189/0.25)]",
        // Glass panel (§13), drawn behind the content so it can fade in on its own.
        "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:border before:bg-panel before:transition-colors before:duration-300 hover:before:border-mint focus-visible:before:border-mint",
        // Mint light that follows the cursor.
        "after:pointer-events-none after:absolute after:inset-0 after:z-0 after:bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),rgb(140_245_189/0.16),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100 focus-visible:after:opacity-100 motion-reduce:after:hidden",
        first
          ? "soft-glow min-h-64 before:border-mint/65 max-md:order-first md:min-h-76 md:-translate-y-5 md:rounded-xl md:hover:-translate-y-[calc(1.25rem+3px)] md:focus-visible:-translate-y-[calc(1.25rem+3px)]"
          : "min-h-56 before:border-line md:min-h-64",
        waiting && "invisible opacity-0",
        build && BUILD.panel,
      )}
      ref={cardRef}
      style={{ "--i": `${staggerIndex * 180}ms` } as CSSProperties}
      tabIndex={0}
      onPointerMove={updateCursorLight}
    >
      {CORNERS.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={cx("absolute z-2 size-3 border-mint opacity-90", position, build && BUILD.corner)}
        />
      ))}

      <Medal place={prize.place} build={build} />
      <p
        className={cx(
          "relative z-1 mt-[1.1rem] text-xs leading-snug font-semibold tracking-[0.12em] text-muted uppercase",
          build && BUILD.label,
        )}
      >
        {prize.label}
      </p>
      <p
        className={cx(
          "relative z-1 mt-[0.55rem] font-display leading-none font-bold tracking-[0.015em] whitespace-nowrap text-mint tabular-nums text-glow",
          first
            ? "text-[clamp(3rem,12vw,3.75rem)] md:text-[clamp(3.25rem,5.5vw,4.75rem)]"
            : "text-[clamp(2.5rem,5vw,3.75rem)]",
          build && BUILD.amount,
        )}
      >
        {typeof prize.amount === "number" ? count.toLocaleString("en-US") : prize.amount}
      </p>
      {typeof prize.amount === "number" && (
        <p
          className={cx(
            "relative z-1 mt-2 font-display text-base leading-tight font-semibold tracking-[0.2em] text-white",
            build && BUILD.currency,
          )}
        >
          LKR
        </p>
      )}
    </article>
  );
}

export default function Prizes() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasMounted = useHydrated();
  const reducedMotion = useMotionPreference() === "reduced";
  const isVisible = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16 md:px-6 md:py-[clamp(3rem,8vw,7rem)]">
      <section
        id="prizes"
        aria-labelledby="prizes-title"
        className="mx-auto w-full max-w-page"
        ref={sectionRef}
      >
        <SectionHeader
          id="prizes-title"
          eyebrow="Prize pool"
          title="What waits on the other side"
          subtitle="Cross the gap. Build what's next. Claim your share."
          className="mb-[clamp(2.5rem,6vw,5rem)]"
        />

        {/* Podium order: 2nd, 1st, 3rd. On phones 1st moves to the top. */}
        <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 md:max-w-none md:grid-cols-3 md:items-end md:gap-[clamp(1rem,2.4vw,2rem)]">
          {PRIZES.map((prize) => (
            <PrizeCard
              hasMounted={hasMounted}
              isVisible={isVisible}
              key={prize.place}
              prize={prize}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
