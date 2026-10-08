"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { cx } from "@/lib/cx";

export default function SponsorsSection() {
  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className="relative isolate overflow-hidden py-[clamp(3rem,7vw,6rem)]"
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
