"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { HeroCopy } from "./HeroCopy";
import { HeroMedia } from "./HeroMedia";
import { ScrollCue } from "./ScrollCue";
import { SoundToggle } from "./SoundToggle";
import { STAGE, STILL_CUES, VIDEO_CUES } from "./stages";
import { readMotionPreference, useMotionPreference } from "@/hooks/useMotionPreference";

// Give up on the video and show the still if it hasn't started by then.
const START_TIMEOUT_MS = 3000;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preference = useMotionPreference();
  const [failed, setFailed] = useState(false);
  const [ended, setEnded] = useState(false);
  const [stage, setStage] = useState(0);
  const [muted, setMuted] = useState(true);

  const staticMode = preference !== "full" || failed;
  const settled = ended || staticMode;

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

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

  // Copy follows the video's clock, so it waits with the footage if playback stalls.
  useEffect(() => {
    const video = videoRef.current;
    if (staticMode || !video) return;

    let frame = 0;
    const tick = () => {
      const passed = VIDEO_CUES.filter((t) => video.currentTime >= t).length;
      setStage((s) => Math.max(s, passed));
      if (passed < VIDEO_CUES.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [staticMode]);

  useEffect(() => {
    if (!staticMode) return;
    videoRef.current?.pause();
    const timers = STILL_CUES.map((t, i) =>
      window.setTimeout(() => setStage((s) => Math.max(s, i + 1)), t * 1000),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [staticMode]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate h-svh min-h-[600px] overflow-hidden bg-bg [container-type:size]">
        <HeroMedia ref={videoRef} settled={settled} />
        <HeroCopy stage={stage} settled={settled} reduced={preference === "reduced"} />

        <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[min(92%,var(--container-page))] items-end justify-between pb-6 md:pb-8">
          <ScrollCue visible={stage >= STAGE.scrollCue} />
          <SoundToggle
            visible={!settled && stage >= STAGE.eyebrow}
            muted={muted}
            onToggle={toggleSound}
          />
        </div>
      </section>
    </MotionConfig>
  );
}
