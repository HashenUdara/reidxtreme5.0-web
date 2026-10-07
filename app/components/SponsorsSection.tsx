"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./SponsorsSection.module.css";

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
  const [isPointerInside, setIsPointerInside] = useState(false);
  const isPaused = isPointerInside;
  const status = isPaused
    ? "[ AUTOSCROLL: PAUSED (MOVE CURSOR AWAY TO RESUME) ]"
    : "[ AUTOSCROLL: ACTIVE ]";

  function renderCards(copy: "primary" | "duplicate" | "duplicateTwo") {
    return SPONSORS.map((sponsor) => (
      <article
        className={styles.card}
        key={`${copy}-${sponsor.name}`}
      >
        <span className={styles.logoArea}>
          <span
            className={styles.logoFallback}
            data-logo-fallback
            aria-hidden="true"
            hidden
          >
            {sponsor.name}
          </span>
          <Image
            alt={`${sponsor.name} logo`}
            className={styles.logo}
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
        <span className={styles.tier}>{sponsor.tier}</span>
      </article>
    ));
  }

  return (
    <section id="sponsors" className={styles.section} aria-labelledby="sponsors-heading">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>06 / ARCHITECTS &amp; PARTNERS</p>
          <h2 className={styles.title} id="sponsors-heading">
            EVENT SPONSORS
          </h2>
          <p className={styles.subtitle}>
            PROUDLY PARTNERING WITH HIVEION, ZONE24X7 &amp; SPERA.
          </p>
        </div>
        <p aria-live="polite" className={styles.status}>
          {status}
        </p>
      </div>

      <div
        className={styles.viewport}
        onMouseEnter={() => setIsPointerInside(true)}
        onMouseLeave={() => setIsPointerInside(false)}
      >
        <div className={`${styles.track} ${isPaused ? styles.trackPaused : ""}`}>
          <div className={styles.trackGroup}>{renderCards("primary")}</div>
          <div aria-hidden="true" className={styles.trackGroup}>
            {renderCards("duplicate")}
          </div>
          <div aria-hidden="true" className={styles.trackGroup}>
            {renderCards("duplicateTwo")}
          </div>
        </div>
      </div>
    </section>
  );
}
