"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { HeroMedia } from "./HeroMedia";
import { readMotionPreference, useMotionPreference } from "./useMotionPreference";

// Give up on the video and show the still if it hasn't started by then.
const START_TIMEOUT_MS = 3000;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preference = useMotionPreference();
  const [failed, setFailed] = useState(false);
  const [ended, setEnded] = useState(false);

  const staticMode = preference !== "full" || failed;
  const settled = ended || staticMode;

  useEffect(() => {
    const video = videoRef.current;
    // Read the live preference: on hydration `preference` still holds the server value.
    if (!video || readMotionPreference() !== "full") return;

    let started = false;
    const onPlaying = () => {
      started = true;
    };
    const onEnded = () => setEnded(true);
    const onError = () => setFailed(true);
    const timer = window.setTimeout(() => {
      if (!started) setFailed(true);
    }, START_TIMEOUT_MS);

    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);
    // Capture, because <source> load errors don't bubble to the video.
    video.addEventListener("error", onError, true);

    video.muted = true;
    video.play().catch(() => setFailed(true));

    return () => {
      window.clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError, true);
    };
  }, []);

  useEffect(() => {
    if (staticMode) videoRef.current?.pause();
  }, [staticMode]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label="REID XTREME 5.0"
        className="relative isolate h-svh min-h-[600px] overflow-hidden bg-bg"
      >
        <HeroMedia ref={videoRef} settled={settled} />
      </section>
    </MotionConfig>
  );
}
