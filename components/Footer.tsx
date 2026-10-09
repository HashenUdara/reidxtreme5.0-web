import Image from "next/image";
import footerLogo from "@/assets/Logo_no_shadow_glowing.png";
import acmLogo from "@/assets/ACM.png";
import ieeeLogo from "@/assets/IEEE.png";
import { cx } from "@/lib/cx";

const BAR =
  "flex items-center justify-between gap-4 px-[clamp(1.25rem,4vw,3.75rem)] py-[0.85rem] text-[0.62rem] font-semibold tracking-[0.14em] text-muted max-md:flex-wrap max-md:justify-center max-md:text-center max-sm:px-4 max-sm:text-[0.55rem] max-sm:tracking-[0.09em]";
const LINK_GROUP = "text-center md:text-left";
const LINK_HEADING = "m-0 mb-[1.35rem] font-display text-base font-semibold tracking-[0.16em] text-mint";
const LINK_LIST = "m-0 grid list-none justify-items-center gap-[0.9rem] p-0 md:justify-items-start";
const LINK =
  "inline-flex max-w-full items-center gap-[0.35rem] text-[0.82rem] leading-normal [overflow-wrap:anywhere] text-muted no-underline transition-transform duration-200 ease-standard hover:-translate-y-0.5 hover:text-mint hover:[text-shadow:0_0_14px_rgb(140_245_189/0.5)] focus-visible:-translate-y-0.5 focus-visible:text-mint";
const SOCIALS = [
  {
    id: "ieee",
    heading: "IEEE SB UCSC",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/IEEE.UCSC/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/ucscieeesb/" },
      { label: "Instagram", href: "https://www.instagram.com/ucsc.ieee/" },
    ],
  },
  {
    id: "acm",
    heading: "ACM UCSC",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/share/14jTrd2BJoH" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/ucscacmstudentchapter" },
      { label: "Instagram", href: "https://www.instagram.com/ucsc.acm" },
    ],
  },
];
const EXTERNAL = <span aria-hidden="true" className="text-[0.72rem] text-emerald">↗</span>;

export default function Footer() {
  return (
    <footer
      aria-labelledby="footer-brand"
      className={cx(
        "relative mx-auto w-full max-w-360 overflow-hidden border border-line bg-panel backdrop-blur-md",
        "bg-[linear-gradient(125deg,rgb(17_48_37/0.18),transparent_48%)] shadow-[0_24px_90px_rgb(0_0_0/0.36),inset_0_1px_rgb(245_250_247/0.035)]",
        // Faint ring in the top-right corner, like a distant bridge cable.
        "before:pointer-events-none before:absolute before:-top-36 before:right-[6%] before:size-92 before:rounded-full before:border before:border-mint/5",
      )}
    >
      <div className={cx(BAR, "min-h-13 border-b border-mint/15")} aria-hidden="true">
        <span className="size-[0.42rem] flex-none rounded-full bg-mint shadow-[0_0_0.75rem_rgb(140_245_189/0.75)]" />
        <span>ENGINEERING THE EXTRAORDINARY</span>
        <span className="h-px flex-1 bg-linear-to-r from-mint/25 to-transparent max-sm:hidden" />
        <span className="text-muted/70">RX—05 / 2026</span>
      </div>

      <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-11 px-6 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] md:gap-[clamp(2.5rem,6vw,5rem)] md:py-[clamp(3rem,5vw,4rem)]">
        <section
          className="flex flex-col items-center gap-3 text-center md:items-start md:text-left"
          aria-label="ReidXTREME 5.0"
        >
          <Image
            className="block max-h-12 w-[min(100%,11.25rem)] object-contain object-center sm:max-h-16 sm:w-[min(100%,13.75rem)] md:object-left"
            id="footer-brand"
            src={footerLogo}
            alt="ReidXTREME 5.0"
            sizes="220px"
          />
          <span className="text-[0.62rem] font-medium tracking-[0.11em] text-muted">
            COLOMBO, SRI LANKA{" "}

          </span>
          <div className="mt-4 flex items-center justify-center gap-4 px-4 md:gap-6 md:px-0">
            <Image className="h-5 w-auto opacity-85 sm:h-6 md:h-8" src={ieeeLogo} alt="IEEE Student Branch of UCSC" sizes="(max-width: 768px) 120px, 160px" />
            <span aria-hidden="true" className="h-5 w-px bg-mint/20 sm:h-6 md:h-8" />
            <Image className="h-8 w-auto opacity-85 sm:h-10 md:h-14" src={acmLogo} alt="ACM Student Chapter of UCSC" sizes="(max-width: 768px) 60px, 100px" />
          </div>
        </section>

        <nav
          className="flex flex-wrap justify-center gap-8 pt-[0.4rem] sm:justify-end md:gap-[clamp(2.5rem,5vw,5rem)]"
          aria-label="Footer navigation"
        >

          {SOCIALS.map((group) => (
            <section className={LINK_GROUP} aria-labelledby={`${group.id}-heading`} key={group.id}>
              <h2 className={LINK_HEADING} id={`${group.id}-heading`}>
                {group.heading}
              </h2>
              <ul className={LINK_LIST}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a className={LINK} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} {EXTERNAL}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>

      <div className={cx(BAR, "min-h-15 border-t border-mint/20 max-sm:min-h-14 max-sm:gap-x-5 max-sm:gap-y-3")}>
        <span>© 2026 REID XTREME</span>
        <a
          className="inline-flex items-center gap-[0.55rem] text-body no-underline transition-transform duration-200 ease-standard hover:-translate-y-0.5 hover:text-mint hover:[text-shadow:0_0_14px_rgb(140_245_189/0.5)] focus-visible:-translate-y-0.5 focus-visible:text-mint"
          href="#top"
        >
          BACK TO TOP{" "}
          <span aria-hidden="true" className="text-[0.9rem] text-mint">
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
