"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${theme === "dark"
                    ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-yellow-400"
                    : "bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-slate-800"
                }`}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
    );
}
