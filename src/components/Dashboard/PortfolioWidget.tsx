"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PortfolioWidgetProps {
    initialBalance?: number;
}

export default function PortfolioWidget({ initialBalance = 10.0 }: PortfolioWidgetProps) {
    const [balance, setBalance] = useState(initialBalance);
    const [seconds, setSeconds] = useState(24 * 60 * 60);

    const circumference = 130 * 2 * Math.PI;
    const percent = (seconds / (24 * 60 * 60)) * 100;
    const offset = circumference - (percent / 100) * circumference;

    // Balance ticker - increments every 200ms
    useEffect(() => {
        const interval = setInterval(() => {
            setBalance((prev) => prev + 0.00000004);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => (prev > 0 ? prev - 1 : 24 * 60 * 60));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
    };

    const todayYield = ((balance - initialBalance) / initialBalance * 100).toFixed(2);

    return (
        <motion.div
            className="relative w-[280px] h-[280px] mx-auto mt-10 flex flex-col justify-center items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* SVG Progress Ring */}
            <svg className="progress-ring absolute" width="280" height="280">
                <circle
                    className="progress-ring__circle"
                    strokeWidth="4"
                    stroke="var(--glass-border)"
                    fill="transparent"
                    r="130"
                    cx="140"
                    cy="140"
                />
                <circle
                    className="progress-ring__circle"
                    strokeWidth="4"
                    stroke="var(--primary)"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    fill="transparent"
                    r="130"
                    cx="140"
                    cy="140"
                />
            </svg>

            {/* Balance Display */}
            <span className="text-xs text-[var(--text-dim)] tracking-[2px] uppercase">
                Portfolio
            </span>
            <span className="text-4xl font-bold mt-1 text-[var(--text)]">
                ${balance.toFixed(6)}
            </span>
            <span className="mt-2 bg-[rgba(0,255,136,0.1)] text-[var(--success)] px-3 py-1 rounded-full text-xs font-semibold">
                +{todayYield}% Today
            </span>

            {/* Countdown in widget - Fixed positioning */}
            <div className="absolute -bottom-12 text-center w-full">
                <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider block mb-1">Next Drop In</span>
                <p className="text-xl font-mono font-semibold text-[var(--text)] tracking-widest">{formatTime(seconds)}</p>
            </div>
        </motion.div>
    );
}
