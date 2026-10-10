"use client";

import { getImageProps } from "next/image";
import { motion } from "motion/react";
import type { Ref } from "react";

// Tall screens get the 3:4 centre crop of every layer. The crops are cut from
// the same centre, so all layers stay aligned whichever set the browser picks.
const PORTRAIT = "(max-aspect-ratio: 3/4)";

// Rendered width of a 16:9 or 3:4 layer under object-fit: cover.
const LANDSCAPE_SIZES = "(max-aspect-ratio: 16/9) 178vh, 100vw";
const PORTRAIT_SIZES = "75vh";

type Frame = {
  landscape: { src: string; width: number; height: number };
  portrait: { src: string; width: number; height: number };
};

const POSTER: Frame = {
  landscape: { src: "/hero/poster.webp", width: 1920, height: 1080 },
  portrait: { src: "/hero/poster-portrait.jpg", width: 810, height: 1080 },
};

// BG_5 cropped to the video's framing; it matches the final frame.
const END: Frame = {
  landscape: { src: "/hero/end.webp", width: 2674, height: 1504 },
  portrait: { src: "/hero/end-portrait.webp", width: 1128, height: 1504 },
};

function CoverPicture({ frame, priority }: { frame: Frame; priority?: boolean }) {
  const shared = {
    alt: "",
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "auto",
  } as const;
  const { props: portrait } = getImageProps({
    ...shared,
    ...frame.portrait,
    sizes: PORTRAIT_SIZES,
  });
  const { props: landscape } = getImageProps({
    ...shared,
    ...frame.landscape,
    sizes: LANDSCAPE_SIZES,
  });

  return (
    <picture>
      <source media={PORTRAIT} srcSet={portrait.srcSet} sizes={portrait.sizes} />
      <img {...landscape} alt="" className="absolute inset-0 size-full object-cover" />
    </picture>
  );
}

type HeroMediaProps = {
  ref: Ref<HTMLVideoElement>;
  /** True once the video has ended or been skipped; shows the end still. */
  settled: boolean;
};

export function HeroMedia({ ref, settled }: HeroMediaProps) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <CoverPicture frame={POSTER} priority />

      {/* muted and play() are handled in Hero, since React doesn't render the muted attribute */}
      <video
        ref={ref}
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 size-full object-cover"
      >
        <source src="/hero/landing-portrait.mp4" type="video/mp4" media={PORTRAIT} />
        <source src="/hero/landing-1080.mp4" type="video/mp4" />
      </video>

      <motion.div
        initial={false}
        animate={{ opacity: settled ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Very slow drift keeps the held frame alive. Scale starts at 1 so the handoff stays aligned. */}
        <motion.div
          initial={false}
          animate={{ scale: settled ? 1.04 : 1 }}
          transition={{ duration: 40, ease: "easeInOut" }}
          className="absolute inset-0 origin-[50%_60%]"
        >
          <CoverPicture frame={END} />
        </motion.div>
      </motion.div>

      {/* Top scrim for nav and headline legibility, bottom fade into the page, soft vignette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(3 8 10 / 0.72) 0%, rgb(3 8 10 / 0.36) 22%, rgb(3 8 10 / 0) 46%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, #03080a 0%, rgb(3 8 10 / 0.55) 9%, rgb(3 8 10 / 0) 28%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 55%, rgb(3 8 10 / 0) 60%, rgb(3 8 10 / 0.5) 100%)",
        }}
      />
    </div>
  );
}
