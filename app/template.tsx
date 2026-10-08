"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    // Force scroll to top instantly on route change
    window.scrollTo(0, 0);

    // Strict minimum 2-second (2000ms) delay
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Video Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          >
            {/* Glowing Green Grid Background */}
            <div 
              className="absolute inset-0 z-0" 
              style={{
                backgroundImage: "linear-gradient(rgb(140 245 189 / 0.25) 1px, transparent 1px), linear-gradient(90deg, rgb(140 245 189 / 0.25) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                filter: "drop-shadow(0 0 8px rgb(140 245 189 / 0.8))",
                maskImage: "radial-gradient(circle at center, black 10%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 10%, transparent 70%)",
              }}
            />
            {/* Soft Radial Glow behind video */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgb(140_245_189/0.08)_0%,transparent_50%)]" />
            <video
              src="/transition.webm"
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        initial={{ filter: "brightness(0.2) blur(10px)", scale: 0.98 }}
        animate={{
          filter: isTransitioning ? "brightness(0.2) blur(10px)" : "brightness(1) blur(0px)",
          scale: isTransitioning ? 0.98 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen w-full origin-top"
      >
        {children}
      </motion.div>
    </>
  );
}
