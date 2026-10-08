"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "motion/react";

export function AboutSection() {
  return (
    <motion.section
      id="about"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden pt-12 pb-[clamp(5rem,10vw,8rem)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <SectionHeader
        id="about-heading"
        eyebrow="The Flagship Event"
        title="About ReidXtreme"
        className="mb-[clamp(2rem,4vw,3rem)]"
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="space-y-6 md:space-y-8 text-[clamp(0.95rem,2vw,1.1rem)] leading-relaxed md:leading-[1.8] text-muted">
          <p>
            ReidXtreme 5.0 is the flagship competitive programming hackathon organized by the{" "}
            <span className="text-white font-medium">IEEE Student Branch of UCSC</span> in collaboration with the{" "}
            <span className="text-white font-medium">ACM Student Chapter of UCSC</span>.
          </p>
          <p>
            Returning for its fifth edition, ReidXtreme brings together students with a shared interest in coding and problem-solving. Through a series of workshops and two competitive rounds, the event provides an opportunity to develop programming skills, explore new concepts, and gain valuable competition experience.
          </p>
          <p>
            Whether you’re a beginner or an experienced programmer, ReidXtreme 5.0 offers a platform to learn, challenge yourself, and prepare for larger competitions such as IEEEXtreme.
          </p>
          <p className="pt-4 font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold uppercase tracking-[0.08em] text-white">
            Cross the Chasm. <span className="text-mint drop-shadow-[0_0_15px_rgb(140_245_189/0.4)]">Bridge the Horizons.</span>
          </p>
        </div>
      </div>
    </motion.section>
  );
}
