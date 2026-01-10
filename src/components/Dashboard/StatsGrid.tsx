"use client";

import { motion } from "framer-motion";

export default function StatsGrid() {
    return (
        <motion.div
            className="grid grid-cols-2 gap-4 mt-24 px-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <div className="glass-card p-5">
                <h4 className="text-xs text-[var(--text-dim)] uppercase mb-2">Deposits</h4>
                <p className="text-lg font-semibold">$10.00</p>
            </div>
            <div className="glass-card p-5">
                <h4 className="text-xs text-[var(--text-dim)] uppercase mb-2">Status</h4>
                <p className="text-lg font-semibold text-[var(--success)]">Yielding</p>
            </div>
        </motion.div>
    );
}
