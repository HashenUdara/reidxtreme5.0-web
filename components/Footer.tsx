import Image from "next/image";
import footerLogo from "@/assets/Logo_no_shadow_glowing.png";
import { cx } from "@/lib/cx";

const BAR =
  "flex items-center justify-between gap-4 px-[clamp(1.25rem,4vw,3.75rem)] py-[0.85rem] text-[0.62rem] font-semibold tracking-[0.14em] text-muted max-md:flex-wrap max-md:justify-center max-md:text-center max-sm:px-4 max-sm:text-[0.55rem] max-sm:tracking-[0.09em]";
const LINK_GROUP = "text-center md:text-left";
const LINK_HEADING = "m-0 mb-[1.35rem] font-display text-base font-semibold tracking-[0.16em] text-mint";
const LINK_LIST = "m-0 grid list-none justify-items-center gap-[0.9rem] p-0 md:justify-items-start";
const LINK =
  "inline-flex max-w-full items-center gap-[0.35rem] text-[0.82rem] leading-normal [overflow-wrap:anywhere] text-muted no-underline transition-transform duration-200 ease-standard hover:-translate-y-0.5 hover:text-mint hover:[text-shadow:0_0_14px_rgb(140_245_189/0.5)] focus-visible:-translate-y-0.5 focus-visible:text-mint";
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
          <p className="m-0 font-display text-[clamp(1.45rem,2.8vw,2rem)] leading-[1.22] font-semibold tracking-[0.075em] text-body">
            CROSS THE <span className="text-mint">CHASM.</span>
            <br />
            BRIDGE THE HORIZONS.
          </p>
          <span className="text-[0.62rem] font-medium tracking-[0.11em] text-muted">
            COLOMBO, SRI LANKA{" "}
            <span aria-hidden="true" className="px-[0.35rem] text-emerald">
              {"//"}
            </span>{" "}
            EST. 2026
          </span>
          <div className="mt-4 flex items-center gap-6">
            <Image className="h-8 w-auto opacity-85" src={ieeeLogo} alt="IEEE Student Branch of UCSC" sizes="160px" />
            <span aria-hidden="true" className="h-8 w-px bg-mint/20" />
            <Image className="h-10 w-auto opacity-85" src={acmLogo} alt="ACM Student Chapter of UCSC" sizes="80px" />
          </div>
        </section>

        <nav
          className="grid grid-cols-1 gap-8 pt-[0.4rem] md:grid-cols-2 md:gap-[clamp(1.25rem,3vw,3rem)]"
          aria-label="Footer navigation"
        >
          <section className={LINK_GROUP} aria-labelledby="contact-heading">
            <h2 className={LINK_HEADING} id="contact-heading">
              CONTACT
            </h2>
            <ul className={LINK_LIST}>
              <li>
                <a className={LINK} href="mailto:info@reidxtreme.lk">
                  info@reidxtreme.lk
                </a>
              </li>
              <li>
                <a
                  className={LINK}
                  href="mailto:info@reidxtreme.lk?subject=REID%20XTREME%20Help%20Desk"
                >
                  Help Desk
                </a>
              </li>
            </ul>
          </section>

          <section className={LINK_GROUP} aria-labelledby="social-heading">
            <h2 className={LINK_HEADING} id="social-heading">
              SOCIAL LINKS
            </h2>
            {/* Placeholders until the event accounts are connected. */}
            <ul className={LINK_LIST}>
              <li>
                <a className={LINK} href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  Instagram {EXTERNAL}
                </a>
              </li>
              <li>
                <a className={LINK} href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  Facebook {EXTERNAL}
                </a>
              </li>
              <li>
                <a className={LINK} href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                  WhatsApp {EXTERNAL}
                </a>
              </li>
            </ul>
          </section>
        </nav>
      </div>

      <div className={cx(BAR, "min-h-15 border-t border-mint/20 max-sm:min-h-14 max-sm:gap-x-5 max-sm:gap-y-3")}>
        <span>© 2026 REID XTREME</span>
        <span className="text-center text-muted/68 max-sm:hidden">
          CROSS THE CHASM. BRIDGE THE HORIZONS.
        </span>
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
