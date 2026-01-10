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

        // Simulate "Deploying Agent" state
        const btn = form.querySelector("button") as HTMLButtonElement;
        btn.innerHTML = `Deploying Agent...`;
        btn.style.opacity = "0.7";

        setTimeout(() => {
            onSubmit();
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Orb Background */}
            <div className="orb" />

            {/* Vault Container */}
            <motion.div
                className="vault-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="vault-logo-ring">
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        style={{ color: "var(--accent)" }}
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                </div>

                <h1 className="font-extrabold text-[1.8rem] tracking-[-0.5px] mb-2">
                    smart<span className="text-[var(--accent)]">Invest</span>
                </h1>
                <p className="text-[#888] text-sm mb-9">
                    Autonomous yield for the agentic era.
                </p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="vault-input"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Secure Password"
                            className="vault-input"
                            required
                        />
                    </div>

                    <button type="submit" className="vault-btn">
                        Start Earning $10
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </form>

                <div className="vault-status">
                    <div className="pulse-dot"></div>
                    <span>SmartAgent active: Scanning T-Bill Yields (4.12% APY)</span>
                </div>

                <div className="mt-8 flex justify-center gap-4 opacity-50 grayscale text-[0.7rem] font-bold tracking-wider">
                    <span>SECURED BY GOOGLE CLOUD</span>
                    <span>•</span>
                    <span>VERIFIED ON BASE</span>
                </div>
            </motion.div>
        </div>
    );
}
