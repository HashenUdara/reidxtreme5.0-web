import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** Id for the heading, so the section can point aria-labelledby at it. */
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  className?: string;
};

/** The shared section heading from DESIGN.md §22: eyebrow, title, subtitle, rule. */
export function SectionHeader({ id, title, eyebrow, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <header className={`mx-auto max-w-4xl px-4 text-center ${className}`}>
      {eyebrow && (
        <p className="mb-3.5 text-xs leading-snug font-semibold tracking-[0.12em] text-mint uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98] font-bold tracking-[0.025em] text-balance text-white uppercase"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-muted">{subtitle}</p>
      )}
      <div
        aria-hidden="true"
        className="mx-auto mt-[clamp(1.5rem,4vw,2.5rem)] h-px w-full max-w-152 bg-linear-to-r from-transparent via-mint/35 to-transparent"
      />
    </header>
  );
}
