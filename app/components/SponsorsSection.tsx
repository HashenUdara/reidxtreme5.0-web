"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { cx } from "@/lib/cx";

export default function SponsorsSection() {
  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className={cx(
        "relative isolate overflow-hidden bg-bg py-[clamp(3rem,7vw,6rem)]",
        "bg-[radial-gradient(circle_at_50%_30%,rgb(140_245_189/0.06)_0%,rgb(63_181_127/0.03)_45%,transparent_70%),linear-gradient(180deg,rgb(3_8_10/0.25)_0%,rgb(3_8_10/0.85)_100%)]",
        "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-grid before:[mask-image:radial-gradient(circle_at_center,black_40%,transparent_85%)]",
      )}
    >
      <SectionHeader
        id="sponsors-heading"
        eyebrow="Architects & partners"
        title="Event sponsors"
        subtitle="[TBD]"
        className="relative z-1"
      />
    </section>
  );
}
