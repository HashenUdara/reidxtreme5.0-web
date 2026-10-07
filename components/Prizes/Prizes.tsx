"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, RefObject } from "react";
import styles from "./Prizes.module.css";

type Prize = { place: 1 | 2 | 3; label: string; amount: number };

const PRIZES: Prize[] = [
  { place: 2, label: "2ND PLACE", amount: 40000 },
  { place: 1, label: "1ST PLACE", amount: 60000 },
  { place: 3, label: "3RD PLACE", amount: 20000 },
];

const STAGGER_INDEX: Record<Prize["place"], number> = {
  1: 0,
  2: 1,
  3: 2,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

type InViewOptions = { threshold: number; once: boolean };

// Design system sections 10, 19, and 20: reveal the built structure once.
function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold, once }: InViewOptions,
  reducedMotion: boolean,
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        if (once) observer.unobserve(entry.target);
      },
      { threshold },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [once, reducedMotion, ref, threshold]);

  return isInView;
}

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

function Medal({ place }: { place: Prize["place"] }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.medal}
      focusable="false"
      viewBox="0 0 64 80"
    >
      <path
        className={styles.medalLine}
        d="M22 43 18 69l14-8 14 8-4-26"
        pathLength="1"
      />
      <path
        className={styles.medalLine}
        d="M32 5c3 0 4 4 7 5 3 1 6-1 8 1s0 6 2 9 6 2 7 5-3 5-3 8 3 5 2 8-6 3-8 5-1 6-4 8-6-1-9 0-4 4-7 3-3-5-6-7-6-1-8-4 1-6 0-9-5-4-5-7 4-4 5-7-1-6 1-9 6-2 8-4 2-6 5-7 5 2 8 1z"
        pathLength="1"
      />
      <circle
        className={styles.medalLine}
        cx="32"
        cy="31"
        r="14"
        pathLength="1"
      />
      <text className={styles.medalNumber} x="32" y="36" textAnchor="middle">
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

function PrizeCard({
  prize,
  isVisible,
  hasMounted,
  reducedMotion,
}: PrizeCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const staggerIndex = STAGGER_INDEX[prize.place];
  const count = useCountUp(
    prize.amount,
    isVisible,
    hasMounted,
    reducedMotion,
    staggerIndex,
  );
  const placeClass = {
    1: styles.firstPlace,
    2: styles.secondPlace,
    3: styles.thirdPlace,
  }[prize.place];

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
      className={`${styles.card} ${placeClass}`}
      ref={cardRef}
      style={{ "--i": `${staggerIndex * 180}ms` } as CSSProperties}
      tabIndex={0}
      onPointerMove={updateCursorLight}
    >
      <span aria-hidden="true" className={`${styles.corner} ${styles.topLeft}`} />
      <span aria-hidden="true" className={`${styles.corner} ${styles.topRight}`} />
      <span aria-hidden="true" className={`${styles.corner} ${styles.bottomLeft}`} />
      <span aria-hidden="true" className={`${styles.corner} ${styles.bottomRight}`} />

      <Medal place={prize.place} />
      <p className={styles.label}>{prize.label}</p>
      <p className={styles.amount}>{count.toLocaleString("en-US")}</p>
      <p className={styles.currency}>LKR</p>
    </article>
  );
}

export default function Prizes() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    () => false,
  );
  const isVisible = useInView(
    sectionRef,
    { threshold: 0.25, once: true },
    reducedMotion,
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={styles.page}>
      <section
        id="prizes"
        aria-labelledby="prizes-title"
        className={`${styles.section}${hasMounted ? ` ${styles.js}` : ""}${isVisible ? ` ${styles.visible}` : ""}`}
        ref={sectionRef}
      >
        <header className={styles.header}>
          <p className={styles.eyebrow}>PRIZE POOL</p>
          <h2 className={styles.title} id="prizes-title">
            WHAT WAITS ON THE OTHER SIDE
          </h2>
          <p className={styles.subtitle}>
            Cross the gap. Build what&apos;s next. Claim your share.
          </p>
          <div aria-hidden="true" className={styles.divider} />
        </header>

        <div className={styles.podium}>
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
