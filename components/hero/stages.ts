/** Order in which the hero copy enters. Each stage includes the ones before it. */
export const STAGE = {
  eyebrow: 1,
  lineOne: 2,
  lineTwo: 3,
  subline: 4,
  scrollCue: 5,
} as const;

/**
 * Seconds into Landing_vid.mp4 for each stage, timed to the footage: the deck
 * grid appears in the first second, cables span the gap around 5 s, the tower
 * rises around 6 s, and the bridge is complete by about 7.5 s.
 */
export const VIDEO_CUES = [0.8, 5.2, 6.2, 7.6, 9.0];

/** The same sequence, compressed, for when the still is shown instead. */
export const STILL_CUES = [0.2, 0.6, 0.95, 1.4, 1.8];
