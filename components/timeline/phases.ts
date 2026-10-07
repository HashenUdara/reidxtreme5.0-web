export type Phase = {
  title: string;
  summary: string;
  /** First day, as YYYY-MM-DD in Sri Lanka time. */
  start: string;
  /** Last day, inclusive. Omit for single-day phases. */
  end?: string;
  /** Set by hand once the phase is over. Joins its span to the next one. */
  complete?: boolean;
};

export type PhaseStatus = "complete" | "active" | "upcoming";

// TODO: placeholder dates and summaries. Replace with the published schedule.
export const PHASES: Phase[] = [
  {
    title: "Proposal",
    summary: "Register your team and name the gap you want to bridge.",
    start: "2026-09-14",
    end: "2026-09-28",
    complete: true,
  },
  {
    title: "Kick-off",
    summary: "Meet your mentors, lock the scope and break ground.",
    start: "2026-10-03",
  },
  {
    title: "Hacking",
    summary: "Turn the plan into a working build, one span at a time.",
    start: "2026-10-04",
    end: "2026-10-17",
  },
  {
    title: "Midpoint",
    summary: "Mentors inspect the structure. Reinforce it, then keep building.",
    start: "2026-10-18",
  },
  {
    title: "Final pitch",
    summary: "Walk the judges across what you built.",
    start: "2026-10-31",
  },
  {
    title: "Awards",
    summary: "The strongest builds reach the other side.",
    start: "2026-11-07",
  },
];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** The first phase not marked complete is the one in progress. */
const CURRENT = PHASES.findIndex((p) => !p.complete);

export function statusOf(k: number): PhaseStatus {
  if (PHASES[k].complete) return "complete";
  return k === CURRENT ? "active" : "upcoming";
}

/** "14 SEP – 28 SEP", "04 – 17 OCT" or "03 OCT". */
export function formatDates(phase: Phase) {
  const [, sm, sd] = phase.start.split("-");
  if (!phase.end) return `${sd} ${MONTHS[+sm - 1]}`;
  const [, em, ed] = phase.end.split("-");
  if (sm === em) return `${sd} – ${ed} ${MONTHS[+em - 1]}`;
  return `${sd} ${MONTHS[+sm - 1]} – ${ed} ${MONTHS[+em - 1]}`;
}
