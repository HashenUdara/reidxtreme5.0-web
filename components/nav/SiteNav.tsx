"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import logo from "@/assets/Logo_no_shadow_glowing.png";

const LINKS = [{ href: "#timeline", label: "Timeline" }];
const REGISTER = { href: "#registration", label: "Connect & Register" };

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid
          ? "border-mint/15 bg-panel backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-(--nav-h) w-[min(92%,1400px)] items-center justify-between">
        <Link href="/" className="-m-1 rounded-sm p-1">
          <Image
            src={logo}
            alt="REID XTREME 5.0"
            className="h-10 w-auto md:h-12"
            sizes="80px"
            loading="eager"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a href={REGISTER.href} className="btn-primary">
            {REGISTER.label}
          </a>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative grid size-10 place-items-center rounded-md border border-line bg-bg/40 md:hidden"
        >
          <span
            aria-hidden
            className={`absolute h-px w-[18px] bg-white transition-transform duration-300 ease-standard ${
              open ? "rotate-45" : "-translate-y-[3px]"
            }`}
          />
          <span
            aria-hidden
            className={`absolute h-px w-[18px] bg-white transition-transform duration-300 ease-standard ${
              open ? "-rotate-45" : "translate-y-[3px]"
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-menu"
            aria-label="Primary"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-mint/10 md:hidden"
          >
            <div className="mx-auto flex w-[min(92%,1400px)] flex-col gap-1 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="nav-link py-3"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={REGISTER.href}
                onClick={() => setOpen(false)}
                className="btn-primary mt-3"
              >
                {REGISTER.label}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
