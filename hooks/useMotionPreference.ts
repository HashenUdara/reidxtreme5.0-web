import { useSyncExternalStore } from "react";

/**
 * "reduced": the user asked for reduced motion, so skip the video and keep
 * text animation to fades.
 * "lite": Save-Data is on, so skip the video but keep the text animation.
 * "full": play the video.
 */
export type MotionPreference = "full" | "reduced" | "lite";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

type NetworkInformation = { saveData?: boolean };

export function readMotionPreference(): MotionPreference {
  if (window.matchMedia(REDUCED_QUERY).matches) return "reduced";
  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  return connection?.saveData ? "lite" : "full";
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useMotionPreference() {
  return useSyncExternalStore(subscribe, readMotionPreference, () => "full");
}
