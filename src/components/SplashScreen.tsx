"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [status, setStatus] = useState("Initializing Agent...");

  const statuses = [
    "Syncing neural nodes...",
    "Connecting to Global Yields...",
    "Authenticating SmartAgent...",
    "Ready to Yield."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) {
        setStatus(statuses[i]);
        i++;
      } else {
        clearInterval(interval);
        // Delay before completing to show "Ready" state
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[var(--bg)] flex flex-col justify-center items-center z-50 gap-[30px]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="core-container">
        <div className="core-ring"></div>
        <div className="core-ring"></div>
        <div className="core-center"></div>
      </div>

      <h1 className="splash-brand text-center">
        SMART<span className="text-[var(--accent)] drop-shadow-[0_0_10px_var(--accent-glow)]">INVEST</span>
      </h1>

      <div className="splash-status text-center">
        {status}
      </div>
    </motion.div>
  );
}
