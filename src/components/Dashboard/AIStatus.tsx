"use client";

import { motion } from "framer-motion";

export default function AIStatus() {
    return (
        <motion.div
            className="mt-6 mx-4 p-4 rounded-2xl flex items-center gap-3 text-sm"
            style={{
                background: "linear-gradient(90deg, rgba(112, 0, 255, 0.1), rgba(0, 242, 255, 0.1))",
                border: "1px solid var(--secondary)",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full dot-blink" />
            <span>
                <strong>Smart Agent:</strong> Optimizing $10.00 via Tokenized T-Bills
            </span>
        </motion.div>
    );
}
