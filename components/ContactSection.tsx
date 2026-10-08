"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "motion/react";
import { cx } from "@/lib/cx";

const CONTACTS = [
  {
    name: "Anjalee Hettiarachchi",
    role: "Event Co Chair",
    email: "tilakshianjalee2004@gmail.com",
    phone: "+94 72 307 1692",
  },
  {
    name: "Shakya Peiris",
    role: "Event Co Chair",
    email: "shakyaimanjith32@gmail.com",
    phone: "+94 75 887 3920",
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden py-[clamp(5rem,10vw,8rem)]"
    >
      <SectionHeader
        id="contact-heading"
        eyebrow="Get in touch"
        title="Contact Us"
        className="relative z-1 mb-[clamp(2.5rem,5vw,4rem)]"
      />

      <div className="relative z-1 mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {CONTACTS.map((contact, index) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-line bg-panel p-8 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-mint/50 hover:shadow-[0_0_25px_rgb(140_245_189/0.2)]"
            >
              <h3 className="font-display text-2xl font-bold tracking-[0.05em] text-white transition-colors duration-300 group-hover:text-mint group-hover:text-glow">
                {contact.name}
              </h3>
              <p className="mt-2 text-[0.85rem] font-semibold tracking-[0.15em] text-mint uppercase">
                {contact.role}
              </p>
              
              <div className="mt-6 flex flex-col gap-3 font-sans text-[0.95rem] text-muted">
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors duration-200 hover:text-white focus-visible:text-white"
                >
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="transition-colors duration-200 hover:text-white focus-visible:text-white"
                >
                  {contact.phone}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
