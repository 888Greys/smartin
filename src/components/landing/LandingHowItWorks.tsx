"use client";

import React from "react";

interface LandingHowItWorksProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingHowItWorks({ setRef, revealStyle }: LandingHowItWorksProps) {
    return (
        <section
            ref={setRef(8)}
            style={{ padding: "80px 5%", background: "#f8fafc" }}
        >
            <div style={{ maxWidth: "1000px", margin: "0 auto", ...revealStyle(8) }}>
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "2rem",
                        fontWeight: 800,
                        marginBottom: "15px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    How It Works
                </h2>
                <p style={{ textAlign: "center", color: "#64748b", fontSize: "1rem", marginBottom: "50px" }}>
                    Start earning in 3 simple steps
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "30px",
                        flexWrap: "wrap",
                    }}
                >
                    {/* Step 1 */}
                    <div
                        style={{
                            flex: "1",
                            minWidth: "280px",
                            background: "white",
                            borderRadius: "20px",
                            padding: "35px 30px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                background: "#f1f5f9",
                                borderRadius: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0052ff", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Step 1
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "10px", color: "#0f172a" }}>
                            Create Account
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            Sign up in under 30 seconds using just your email address. No paperwork required.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div
                        style={{
                            flex: "1",
                            minWidth: "280px",
                            background: "white",
                            borderRadius: "20px",
                            padding: "35px 30px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                background: "#f1f5f9",
                                borderRadius: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                                <path d="M1 10h22" />
                            </svg>
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0052ff", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Step 2
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "10px", color: "#0f172a" }}>
                            Deposit via M-Pesa
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            Fund your account instantly with M-Pesa. Start with as little as Ksh 500.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div
                        style={{
                            flex: "1",
                            minWidth: "280px",
                            background: "white",
                            borderRadius: "20px",
                            padding: "35px 30px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                background: "#f1f5f9",
                                borderRadius: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0052ff", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Step 3
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "10px", color: "#0f172a" }}>
                            Earn Daily
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            Watch your investment grow 5% every day. Withdraw anytime to your M-Pesa.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
