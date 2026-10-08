"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    // Strict minimum 2-second (2000ms) delay
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: isTransitioning ? 0 : 1,
          scale: isTransitioning ? 0.98 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
