"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from "react";
import { useMotionPreference } from "../hero/useMotionPreference";
import {
  CONNECTOR,
  FRAME_WIDTH,
  MIRROR_DX,
  MIRROR_DY,
  SPAN,
  SPAN_END,
  SPAN_OUTLINE,
  SPAN_START,
} from "./bridgeGeometry";
import {
  PHASES,
  formatDates,
  statusOf,
  type PhaseStatus,
} from "./phases";
import styles from "./Timeline.module.css";

type Box = { x: number; y: number; w: number; h: number };

const LAST = PHASES.length - 1;

/**
 * Span k is span 0 mirrored and moved k times, so odd spans run right to left
 * and their connectors sit on the left. Anything laid out in span 0's frame
 * goes through here.
 */
function place(box: Box, k: number) {
  const flip = k % 2 === 1;
  return {
    x: flip ? FRAME_WIDTH + MIRROR_DX - box.x - box.w : box.x,
    y: box.y + k * MIRROR_DY,
    w: box.w,
    h: box.h,
    flip,
  };
}

function union(...boxes: Box[]): Box {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return {
    x,
    y,
    w: Math.max(...boxes.map((b) => b.x + b.w)) - x,
    h: Math.max(...boxes.map((b) => b.y + b.h)) - y,
  };
}

const SPAN_BOX = union(SPAN, SPAN_START, SPAN_END);

// Phase copy sits in the open sky above its span, past the far tower, and
// grows upward from just above the tower top.
const COPY = { x: 1330, w: 1270, bottom: 660 };
// Extra sky above the first span so its copy fits on narrow screens.
const HEADROOM = 360;

const FRAME = (() => {
  const all = union(
    ...PHASES.map((_, k) => place(SPAN_BOX, k)),
    ...PHASES.slice(0, LAST).map((_, k) => place(CONNECTOR, k)),
  );
  return { ...all, y: all.y - HEADROOM, h: all.h + HEADROOM };
})();

// Matches the max width of .stack.
const STACK_MAX_PX = 960;

const pct = (v: number) => `${+(v * 100).toFixed(4)}%`;

function boxStyle(box: Box, parent: Box): CSSProperties {
  return {
    left: pct((box.x - parent.x) / parent.w),
    top: pct((box.y - parent.y) / parent.h),
    width: pct(box.w / parent.w),
    height: pct(box.h / parent.h),
  };
}

// Anchored at the outer edge so the block shrinks to its text, toward the span.
function copyStyle(k: number): CSSProperties {
  const { x, y, flip } = place({ x: COPY.x, y: COPY.bottom, w: COPY.w, h: 0 }, k);
  const edge = flip
    ? { left: pct((x - FRAME.x) / FRAME.w) }
    : { right: pct((FRAME.x + FRAME.w - x - COPY.w) / FRAME.w) };
  return {
    ...edge,
    bottom: pct(1 - (y - FRAME.y) / FRAME.h),
    maxWidth: pct(COPY.w / FRAME.w),
  };
}

function sizes(w: number) {
  const share = w / FRAME.w;
  return `(max-width: ${STACK_MAX_PX}px) ${Math.ceil(share * 100)}vw, ${Math.ceil(share * STACK_MAX_PX)}px`;
}

const OUTLINE_POINTS = SPAN_OUTLINE.map(([x, y]) => `${x},${y}`).join(" ");

const spanTransform = (k: number) =>
  k % 2 === 1
    ? `translate(${FRAME_WIDTH + MIRROR_DX} ${k * MIRROR_DY}) scale(-1 1)`
    : `translate(0 ${k * MIRROR_DY})`;

const STATUS_LABEL: Record<PhaseStatus, string> = {
  complete: "Complete",
  active: "In progress",
  upcoming: "Upcoming",
};

// False on the server and during hydration, true after. Spans only hide for
// the scroll reveal once JS is running to reveal them.
const subscribeNever = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

/**
 * How many of the container's children, counted from the first, have
 * scrolled into view.
 */
function useRevealCount(container: RefObject<Element | null>) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const targets = [...(container.current?.children ?? [])];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = targets.indexOf(entry.target);
          setCount((c) => Math.max(c, index + 1));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.25 },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [container]);

  return count;
}

export function Timeline() {
  const ready = useHydrated();
  const reduced = useMotionPreference() === "reduced";
  // Watch the hit areas, not the spans: Chrome counts a target's own
  // clip-path, and a span waiting to build is clipped to nothing.
  const hits = useRef<SVGSVGElement>(null);
  const inView = useRevealCount(hits);
  // Kept apart so that scrolling a span out from under a resting mouse doesn't
  // clear the path of the phase that has keyboard focus.
  const [pointed, setPointed] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = pointed ?? focused;

  const revealed = reduced ? PHASES.length : inView;
  // Connector k joins span k to span k + 1 once phase k is complete.
  const joined = (k: number) => k < LAST && statusOf(k) === "complete" && revealed > k + 1;
  const lit = (k: number) => active !== null && k <= active;
  const dim = (k: number) => active !== null && k > active;
  const flag = (on: boolean) => (on ? "" : undefined);

  // Leaving one phase must not clear another that took over in the meantime.
  const release = (k: number) => (current: number | null) => (current === k ? null : current);

  // Touch has no hover: tapping a span toggles it, and tapping a phase
  // focuses it, which lights it the same way.
  const hover = (k: number) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== "touch") setPointed(k);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType !== "touch") setPointed(release(k));
    },
  });

  return (
    <section
      id="timeline"
      aria-labelledby="timeline-title"
      className={styles.section}
      data-ready={flag(ready)}
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>The journey</p>
        <h2 className={styles.title} id="timeline-title">
          Event timeline
        </h2>
        <p className={styles.subtitle}>
          Each completed stage locks the next span into place.
        </p>
        <div aria-hidden="true" className={styles.divider} />
      </header>

      <div className={styles.stack} style={{ aspectRatio: `${FRAME.w} / ${FRAME.h}` }}>
        <div className={styles.bridges} aria-hidden="true">
          {PHASES.map((phase, k) => (
            <div
              key={phase.title}
              className={styles.span}
              data-flip={flag(k % 2 === 1)}
              data-status={statusOf(k)}
              data-shown={flag(revealed > k)}
              data-lit={flag(lit(k))}
              data-dim={flag(dim(k))}
              style={boxStyle(place(SPAN_BOX, k), FRAME)}
            >
              <Image
                src={SPAN.src}
                width={SPAN.width}
                height={SPAN.height}
                sizes={sizes(SPAN.w)}
                alt=""
                draggable={false}
                className={styles.piece}
                style={boxStyle(SPAN, SPAN_BOX)}
              />
              <Image
                src={SPAN_START.src}
                width={SPAN_START.width}
                height={SPAN_START.height}
                sizes={sizes(SPAN_START.w)}
                alt=""
                draggable={false}
                className={`${styles.piece} ${styles.startCap}`}
                data-hidden={flag(k > 0 && joined(k - 1))}
                style={boxStyle(SPAN_START, SPAN_BOX)}
              />
              <Image
                src={SPAN_END.src}
                width={SPAN_END.width}
                height={SPAN_END.height}
                sizes={sizes(SPAN_END.w)}
                alt=""
                draggable={false}
                className={`${styles.piece} ${styles.endCap}`}
                data-hidden={flag(joined(k))}
                style={boxStyle(SPAN_END, SPAN_BOX)}
              />
            </div>
          ))}

          {PHASES.slice(0, LAST).map((phase, k) => (
            <Image
              key={phase.title}
              src={CONNECTOR.src}
              width={CONNECTOR.width}
              height={CONNECTOR.height}
              sizes={sizes(CONNECTOR.w)}
              alt=""
              draggable={false}
              className={styles.connector}
              data-flip={flag(k % 2 === 1)}
              data-shown={flag(joined(k))}
              data-lit={flag(lit(k + 1))}
              data-dim={flag(dim(k + 1))}
              style={boxStyle(place(CONNECTOR, k), FRAME)}
            />
          ))}
        </div>

        <svg
          ref={hits}
          className={styles.hits}
          viewBox={`${FRAME.x} ${FRAME.y} ${FRAME.w} ${FRAME.h}`}
          aria-hidden="true"
        >
          {PHASES.map((phase, k) => (
            <polygon
              key={phase.title}
              points={OUTLINE_POINTS}
              transform={spanTransform(k)}
              onPointerUp={(e) => {
                if (e.pointerType === "touch") setPointed((p) => (p === k ? null : k));
              }}
              {...hover(k)}
            />
          ))}
        </svg>

        <ol className={styles.phases}>
          {PHASES.map((phase, k) => {
            const s = statusOf(k);
            return (
              <li
                key={phase.title}
                className={styles.phase}
                data-side={k % 2 === 1 ? "left" : "right"}
                data-status={s}
                data-shown={flag(revealed > k)}
                data-lit={flag(lit(k))}
                data-dim={flag(dim(k))}
                aria-current={s === "active" ? "step" : undefined}
                style={copyStyle(k)}
                tabIndex={0}
                onFocus={() => {
                  setFocused(k);
                  // A span tapped earlier would otherwise outrank this phase.
                  setPointed(null);
                }}
                onBlur={() => setFocused(release(k))}
                {...hover(k)}
              >
                <p className={styles.meta}>
                  <span className={styles.number}>
                    Phase {String(k + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.status}>{STATUS_LABEL[s]}</span>
                </p>
                <h3 className={styles.phaseTitle}>{phase.title}</h3>
                <time className={styles.date} dateTime={phase.start}>
                  {formatDates(phase)}
                </time>
                <p className={styles.summary}>{phase.summary}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
