"use client";

import { motion } from "framer-motion";
import PortfolioWidget from "./PortfolioWidget";
import StatsGrid from "./StatsGrid";
import AIStatus from "./AIStatus";

export default function Dashboard() {
    return (
        <motion.div
            className="min-h-screen px-5 py-8 w-full max-w-md mx-auto flex flex-col pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Navigation */}
            <nav className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold">
                    smart<span className="text-[var(--primary)]">Invest</span>
                </div>
                <div className="w-2 h-2 bg-[var(--primary)] rounded-full dot-blink" />
            </nav>

            {/* Portfolio Widget */}
            <PortfolioWidget />

            {/* Stats Grid */}
            <StatsGrid />

            {/* AI Status */}
            <AIStatus />

            {/* Deposit Button */}
            <motion.button
                className="w-full mt-8 py-4 glass-card text-[var(--text)] font-bold cursor-pointer hover:bg-[var(--accent-soft)] transition-all"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
            >
                DEPOSIT MORE
            </motion.button>

            {/* Security Note */}
            <p className="text-center text-[var(--text-dim)] text-xs mt-5">
                Funds secured by 256-bit MPC Encryption
            </p>
        </motion.div>
    );
}
