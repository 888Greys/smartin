"use client";

import React from "react";

interface LandingHowItWorksProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

const steps = [
    {
        step: "01",
        title: "Create Account",
        desc: "Sign up in under 30 seconds using just your email address. No paperwork required.",
        accentColor: "#3b82f6",
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
        ),
    },
    {
        step: "02",
        title: "Deposit via M-Pesa",
        desc: "Fund your account instantly with M-Pesa. Start with as little as Ksh 500.",
        accentColor: "#10b981",
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
        ),
    },
    {
        step: "03",
        title: "Earn Daily",
        desc: "Watch your investment grow 5% every day. Withdraw anytime to your M-Pesa.",
        accentColor: "#818cf8",
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
        ),
    },
];

export default function LandingHowItWorks({ setRef, revealStyle }: LandingHowItWorksProps) {
    return (
        <section
            style={{ padding: "80px 5%", background: "rgba(13,22,39,0.5)" }}
        >
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {/* Header */}
                <div ref={setRef(8)} style={{ textAlign: "center", marginBottom: "60px", ...revealStyle(8) }}>
                    <div style={{
                        display: "inline-block",
                        fontSize: "0.72rem", fontWeight: 700, color: "#6366f1",
                        textTransform: "uppercase", letterSpacing: "2px",
                        marginBottom: "12px",
                    }}>
                        Simple Process
                    </div>
                    <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-1px", marginBottom: "12px" }}>
                        How It Works
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: "1rem" }}>
                        Start earning in 3 simple steps
                    </p>
                </div>

                {/* Steps */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    {steps.map((s, i) => (
                        <div
                            key={s.step}
                            ref={setRef(9 + i)}
                            style={{
                                flex: "1",
                                minWidth: "260px",
                                background: "#0d1627",
                                borderRadius: "20px",
                                padding: "32px 28px",
                                border: "1px solid rgba(255,255,255,0.07)",
                                boxShadow: `inset 0 1px 0 ${s.accentColor}25`,
                                position: "relative",
                                overflow: "hidden",
                                ...revealStyle(9 + i),
                            }}
                        >
                            {/* Step number watermark */}
                            <div style={{
                                position: "absolute", top: "-10px", right: "16px",
                                fontSize: "5rem", fontWeight: 900, color: `${s.accentColor}08`,
                                lineHeight: 1, userSelect: "none",
                            }}>{s.step}</div>

                            {/* Icon box */}
                            <div style={{
                                width: "52px", height: "52px",
                                background: `${s.accentColor}15`,
                                border: `1px solid ${s.accentColor}30`,
                                borderRadius: "14px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: s.accentColor,
                                marginBottom: "20px",
                            }}>
                                {s.icon}
                            </div>

                            {/* Step label */}
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: s.accentColor, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Step {s.step}
                            </div>

                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px", color: "#f1f5f9" }}>
                                {s.title}
                            </h3>
                            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.65 }}>
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
