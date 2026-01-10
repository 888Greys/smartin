"use client";

import { motion } from "framer-motion";

interface RegistrationFormProps {
    onSubmit: () => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;

        if (!email.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }

        onSubmit();
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center px-5 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Navigation */}
            <nav className="w-full max-w-md mb-10">
                <div className="text-xl font-bold">
                    smart<span className="text-[var(--primary)]">Invest</span>
                </div>
            </nav>

            {/* Form Card */}
            <motion.form
                onSubmit={handleSubmit}
                className="glass-card p-8 w-full max-w-md text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold mb-2">Get Started</h2>
                <p className="text-[var(--text-dim)] text-sm mb-6">
                    Deposit $10. See yield in 24h.
                </p>

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full p-4 rounded-xl text-white mb-3"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-4 rounded-xl text-white mb-4"
                    required
                />

                <button
                    type="submit"
                    className="btn-gradient w-full py-4 rounded-xl text-white font-bold cursor-pointer"
                >
                    CREATE ACCOUNT
                </button>
            </motion.form>
        </motion.div>
    );
}
