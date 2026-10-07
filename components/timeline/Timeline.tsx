"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { useHydrated } from "@/hooks/useHydrated";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { cx } from "@/lib/cx";
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

// Matches max-w-240 (60rem) on the stack.
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

type Look = { status?: PhaseStatus; lit: boolean; dim: boolean };

/**
 * Opacity and filter for a span or connector. Upcoming spans are a faint,
 * desaturated outline; the lit path brightens and glows; the rest dims.
 */
function lookStyle({ status, lit, dim }: Look): CSSProperties {
  let saturate = 1;
  let brightness = 1;
  let glow = 0;
  let opacity = 1;
  if (status === "upcoming") [saturate, brightness, opacity] = [0.35, 0.85, 0.35];
  if (lit) {
    [brightness, glow] = [1.35, 0.55];
    if (status === "upcoming") [saturate, opacity] = [0.8, 0.75];
  }
  if (dim) opacity *= 0.45;
  return {
    opacity,
    filter: `saturate(${saturate}) brightness(${brightness}) drop-shadow(0 0 1.1cqi rgb(140 245 189 / ${glow}))`,
  };
}

// Additive blending: the pieces are light on transparent, and adding them
// reproduces the render. It also lets a connector and the end caps it
// replaces cross-fade without a dark seam.
const BRIDGE_PIECE =
  "absolute max-w-none select-none mix-blend-plus-lighter transition-[opacity,filter,clip-path,translate] ease-[var(--ease-standard),var(--ease-standard),var(--ease-draw),var(--ease-draw)]";
const CAP = "absolute max-w-none mix-blend-plus-lighter transition-opacity duration-500 ease-standard";

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
  // Waiting to build: hidden only once JS is running to reveal it.
  const waiting = (k: number) => ready && revealed <= k;
  // Connector k joins span k to span k + 1 once phase k is complete. It draws
  // in as soon as span k builds, reaching ahead to where the next span will be.
  const joined = (k: number) => k < LAST && statusOf(k) === "complete" && revealed > k;
  const lit = (k: number) => active !== null && k <= active;
  const dim = (k: number) => active !== null && k > active;

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
      className="px-[clamp(0.25rem,3vw,1.5rem)] py-[clamp(4.5rem,10vw,8rem)]"
    >
      <SectionHeader
        id="timeline-title"
        eyebrow="The journey"
        title="Event timeline"
        subtitle="Each completed stage locks the next span into place."
        className="mb-[clamp(1.25rem,3vw,2rem)]"
      />

      {/* Everything inside is placed in percentages of this box, and type
          scales with its width (cqi) so the copy keeps its place by each span. */}
      <div
        className="@container relative mx-auto w-full max-w-240"
        style={{ aspectRatio: `${FRAME.w} / ${FRAME.h}` }}
      >
        <div className="pointer-events-none absolute inset-0 isolate" aria-hidden="true">
          {PHASES.map((phase, k) => (
            <div
              key={phase.title}
              className={cx(
                BRIDGE_PIECE,
                "duration-[600ms,300ms,1200ms,1200ms]",
                k % 2 === 1 && "-scale-x-100",
              )}
              style={{
                ...boxStyle(place(SPAN_BOX, k), FRAME),
                ...lookStyle({ status: statusOf(k), lit: lit(k), dim: dim(k) }),
                // Builds along its direction of travel; the mirror flips the wipe too.
                ...(waiting(k) && { opacity: 0, clipPath: "inset(0 100% 0 0)", translate: "0 2cqi" }),
              }}
            >
              <Image
                src={SPAN.src}
                width={SPAN.width}
                height={SPAN.height}
                sizes={sizes(SPAN.w)}
                alt=""
                draggable={false}
                className={CAP}
                style={boxStyle(SPAN, SPAN_BOX)}
              />
              {/* The connector wipes in from the upper span, so the lower span's cap goes last. */}
              <Image
                src={SPAN_START.src}
                width={SPAN_START.width}
                height={SPAN_START.height}
                sizes={sizes(SPAN_START.w)}
                alt=""
                draggable={false}
                className={cx(CAP, "delay-600", k > 0 && joined(k - 1) && "opacity-0")}
                style={boxStyle(SPAN_START, SPAN_BOX)}
              />
              <Image
                src={SPAN_END.src}
                width={SPAN_END.width}
                height={SPAN_END.height}
                sizes={sizes(SPAN_END.w)}
                alt=""
                draggable={false}
                className={cx(CAP, "delay-300", joined(k) && "opacity-0")}
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
              // Wipes down from the end of one span to the start of the next.
              className={cx(
                BRIDGE_PIECE,
                "delay-[0ms,0ms,300ms,0ms] duration-[600ms,300ms,900ms,1200ms]",
                k % 2 === 1 && "-scale-x-100",
              )}
              style={{
                ...boxStyle(place(CONNECTOR, k), FRAME),
                ...lookStyle({ lit: lit(k + 1), dim: dim(k + 1) }),
                clipPath: joined(k) ? "inset(0)" : "inset(0 0 100% 0)",
              }}
            />
          ))}
        </div>

        <svg
          ref={hits}
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox={`${FRAME.x} ${FRAME.y} ${FRAME.w} ${FRAME.h}`}
          aria-hidden="true"
        >
          {PHASES.map((phase, k) => (
            <polygon
              key={phase.title}
              className="fill-transparent [pointer-events:fill]"
              points={OUTLINE_POINTS}
              transform={spanTransform(k)}
              onPointerUp={(e) => {
                if (e.pointerType === "touch") setPointed((p) => (p === k ? null : k));
              }}
              {...hover(k)}
            />
          ))}
        </svg>

        <ol className="pointer-events-none absolute inset-0 m-0 list-none p-0">
          {PHASES.map((phase, k) => {
            const status = statusOf(k);
            const left = k % 2 === 1;
            return (
              <li
                key={phase.title}
                className={cx(
                  "pointer-events-auto absolute flex flex-col rounded-sm outline-offset-[0.6rem] transition-[opacity,translate] duration-900 ease-[var(--ease-standard),var(--ease-draw)]",
                  left ? "items-start text-left" : "items-end text-right",
                  waiting(k) ? "translate-y-4 opacity-0" : dim(k) && "opacity-55",
                )}
                aria-current={status === "active" ? "step" : undefined}
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
                {/* On narrow screens the status drops below the number rather than breaking either. */}
                <p
                  className={cx(
                    "m-0 flex flex-wrap items-center gap-x-[0.75em] gap-y-[0.2em] font-sans text-[clamp(0.625rem,1.15cqi,0.75rem)] leading-snug font-semibold tracking-[0.14em] uppercase",
                    left ? "justify-start" : "justify-end",
                  )}
                >
                  <span className="whitespace-nowrap text-mint">
                    Phase {String(k + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cx(
                      "inline-flex items-center gap-[0.6em] whitespace-nowrap",
                      status === "active"
                        ? "text-mint before:size-[0.5em] before:animate-pulse before:rounded-full before:bg-mint before:shadow-[0_0_8px_rgb(140_245_189/0.8)]"
                        : "text-muted before:h-px before:w-[1.25em] before:bg-current before:opacity-60",
                    )}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                </p>
                <h3
                  className={cx(
                    "mt-[0.4em] mb-0 font-display text-[clamp(1.2rem,3.6cqi,2.4rem)] leading-[0.95] font-semibold tracking-[0.02em] uppercase transition-[color,text-shadow] duration-300 ease-standard",
                    lit(k) ? "text-glow text-mint" : status === "upcoming" ? "text-body" : "text-white",
                  )}
                >
                  {phase.title}
                </h3>
                <time
                  className="mt-[0.35em] font-display text-[clamp(0.85rem,1.8cqi,1.2rem)] leading-[1.2] font-medium tracking-[0.08em] text-mint"
                  dateTime={phase.start}
                >
                  {formatDates(phase)}
                </time>
                <p className="mt-[0.5em] mb-0 max-w-[30ch] font-sans text-[clamp(0.75rem,1.5cqi,0.95rem)] leading-normal text-pretty text-muted">
                  {phase.summary}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
