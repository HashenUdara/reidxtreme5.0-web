"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/lib/cx";

const FAQS = [
  {
    question: "Who can participate in ReidXtreme 5.0?",
    answer: "ReidXtreme 5.0 is open to all UCSC undergraduates interested in coding and competitive programming.",
  },
  {
    question: "Do I need prior competitive programming experience?",
    answer: "Not at all! Both beginners and experienced programmers are welcome to participate.",
  },
  {
    question: "How many members can a team have?",
    answer: "Each team should consist of 3 members.",
  },
  {
    question: "How can I register for ReidXtreme 5.0?",
    answer: "You can register your team through the registration section of this website.",
  },
  {
    question: "How are teams selected for the final round?",
    answer: "The top-performing teams from the preliminary round will qualify for the final round based on their performance.",
  },
  {
    question: "Who can I contact for further information?",
    answer: "For any inquiries, feel free to reach out through the contact details provided on this website.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-mint/20">
      <button
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        onClick={onClick}
      >
        <span className={cx("font-display text-[clamp(1.1rem,2vw,1.25rem)] font-bold tracking-[0.05em] transition-colors duration-200 pr-6", isOpen ? "text-mint text-glow" : "text-white hover:text-mint")}>
          {question}
        </span>
        <span className={cx("ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 font-sans text-lg leading-none", isOpen ? "border-mint text-mint" : "border-muted text-muted")}>
          <span className={cx("transition-transform duration-300", isOpen ? "rotate-45" : "")}>
            +
          </span>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-10 text-[clamp(0.95rem,2vw,1.05rem)] leading-relaxed text-muted">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cx(
      "relative isolate overflow-hidden py-[clamp(5rem,10vw,8rem)] bg-bg",
      "bg-[radial-gradient(circle_at_50%_0%,rgb(140_245_189/0.04)_0%,transparent_60%)]",
      "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-grid before:[mask-image:radial-gradient(circle_at_center,black_30%,transparent_80%)]"
    )}>
      <SectionHeader
        id="faq-heading"
        eyebrow="Got Questions?"
        title="FAQ"
        className="relative z-1 mb-[clamp(2.5rem,5vw,4rem)]"
      />
      
      <div className="relative z-1 mx-auto max-w-3xl px-6">
        <div className="border-t border-mint/20">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
