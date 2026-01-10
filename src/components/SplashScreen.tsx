"use client";

import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-[var(--bg)] flex flex-col justify-center items-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      onAnimationComplete={onComplete}
    >
      <div className="logo-pulse" />
      <h2 className="mt-5 text-xl tracking-[4px] font-semibold">
        smart<span className="text-[var(--primary)]">Invest</span>
      </h2>
    </motion.div>
  );
}
