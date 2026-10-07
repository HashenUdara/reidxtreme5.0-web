"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";
import { cx } from "@/lib/cx";

type Sponsor = {
  name: string;
  tier: string;
  logo: string;
  width: number;
  height: number;
};

const SPONSORS: Sponsor[] = [
  {
    name: "Hiveion",
    tier: "ASSOCIATE SPONSOR",
    logo: "https://codequest.ucscieee.lk/_next/static/media/Hiveion_logo.c2ac6ffc.png",
    width: 200,
    height: 64,
  },
  {
    name: "Zone24x7",
    tier: "SILVER SPONSOR",
    logo: "https://codequest.ucscieee.lk/_next/static/media/zone24x7_logo.5d490333.png",
    width: 200,
    height: 71,
  },
  {
    name: "Spera",
    tier: "GOLD SPONSOR",
    logo: "https://codequest.ucscieee.lk/_next/static/media/spera_logo.8c191680.png",
    width: 200,
    height: 65,
  },
];

export default function SponsorsSection() {
  const [isPaused, setIsPaused] = useState(false);

  function renderCards(copy: "primary" | "duplicate" | "duplicateTwo") {
    return SPONSORS.map((sponsor) => (
      <article
        className="group grid min-h-58 w-[clamp(14rem,20vw,18rem)] min-w-0 grid-rows-[1fr_auto_auto] gap-[0.7rem] overflow-hidden rounded-lg border border-line bg-panel p-5 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-mint hover:soft-glow motion-reduce:min-h-48 motion-reduce:w-auto motion-reduce:transition-none"
        key={`${copy}-${sponsor.name}`}
      >
        <span className="relative grid min-h-23 min-w-0 place-items-center overflow-hidden">
          <span
            className="max-w-full text-center font-display text-[clamp(1.8rem,3vw,2.45rem)] font-bold tracking-[0.04em] [overflow-wrap:anywhere] text-white [grid-area:1/1]"
            data-logo-fallback
            aria-hidden="true"
            hidden
          >
            {sponsor.name}
          </span>
          <Image
            alt={`${sponsor.name} logo`}
            className="h-auto max-h-16 w-auto max-w-full object-contain brightness-85 grayscale-35 transition-[filter] duration-200 [grid-area:1/1] group-hover:brightness-100 group-hover:grayscale-0 motion-reduce:transition-none"
            onError={(event) => {
              event.currentTarget.hidden = true;
              const fallback =
                event.currentTarget.parentElement?.querySelector<HTMLElement>(
                  "[data-logo-fallback]",
                );
              if (fallback) fallback.hidden = false;
            }}
            unoptimized
            src={sponsor.logo}
            width={sponsor.width}
            height={sponsor.height}
          />
        </span>
        <span className="text-center font-display text-[0.9rem] font-bold tracking-[0.12em] [overflow-wrap:anywhere] text-mint">
          {sponsor.tier}
        </span>
      </article>
    ));
  }

  // Three copies of the cards scroll a third of the track, then loop seamlessly.
  // With reduced motion, one copy sits still in a grid.
  const group = "flex gap-5 pr-5 motion-reduce:contents";

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
        subtitle={
          <>
            Proudly partnering with Hiveion,{" "}
            {/* Inter's contextual alternates would render 24x7 as 24×7. */}
            <span className="[font-feature-settings:'calt'_0]">Zone24x7</span> &amp; Spera.
          </>
        }
        className="relative z-1 mb-[clamp(2rem,5vw,4rem)]"
      />

      <div
        className="relative z-1 overflow-hidden px-6 motion-reduce:overflow-visible"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={cx(
            "flex w-max animate-marquee will-change-transform",
            "motion-reduce:grid motion-reduce:w-full motion-reduce:animate-none motion-reduce:grid-cols-3 motion-reduce:gap-5",
            isPaused && "[animation-play-state:paused]",
          )}
        >
          <div className={group}>{renderCards("primary")}</div>
          <div aria-hidden="true" className={cx(group, "motion-reduce:hidden")}>
            {renderCards("duplicate")}
          </div>
          <div aria-hidden="true" className={cx(group, "motion-reduce:hidden")}>
            {renderCards("duplicateTwo")}
          </div>
        </div>
      </div>
    </section>
  );
}
