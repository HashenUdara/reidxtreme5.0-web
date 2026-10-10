"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

let hasAppLoaded = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Track whether THIS instance of the template was created during the initial load
  const isInitialInstance = useRef(!hasAppLoaded);
  const initialPathname = useRef(pathname);
  
  const [isTransitioning, setIsTransitioning] = useState(() => {
    return hasAppLoaded; // true on route changes, false on first load
  });

  useEffect(() => {
    // Force scroll to top instantly on route change
    window.scrollTo(0, 0);

    // If it's the initial instance AND the pathname hasn't changed since it mounted,
    // skip the transition. This check perfectly survives React 18 Strict Mode double-mounts.
    if (isInitialInstance.current && pathname === initialPathname.current) {
      hasAppLoaded = true;
      return;
    }

    // Otherwise, it's a route change. Trigger the transition!
    setIsTransitioning(true);

    // Strict minimum 2-second (2000ms) delay
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

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
              src="/transition/transition.webm"
              width={1920}
              height={1080}
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
