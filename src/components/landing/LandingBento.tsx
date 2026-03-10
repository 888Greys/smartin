"use client";

import React from "react";

interface LandingBentoProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingBento({ setRef, revealStyle }: LandingBentoProps) {
    return (
        <section
            className="bento-grid"
            style={{
                padding: "40px 5%",
                maxWidth: "1200px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
            }}
        >
            {/* 24-Hour Promise */}
            <div
                ref={setRef(3)}
                className="bento-item"
                style={{
                    background: "#eff6ff",
                    borderRadius: "24px",
                    padding: "30px",
                    border: "1px solid #e2e8f0",
                    position: "relative",
                    overflow: "hidden",
                    gridColumn: "span 2",
                    minHeight: "220px",
                    ...revealStyle(3),
                }}
            >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px" }}>
                    The 24-Hour Promise
                </h2>
                <p style={{ color: "#64748b", fontWeight: 600, lineHeight: 1.5, fontSize: "0.95rem", maxWidth: "90%" }}>
                    Every dollar you add starts working immediately. By this time tomorrow, you&apos;ll see your first profit.
                </p>
                <div style={{ fontSize: "4rem", position: "absolute", bottom: "-5px", right: "10px", opacity: 0.1 }}>
                    🕒
                </div>
            </div>

            {/* 5% Daily */}
            <div
                ref={setRef(4)}
                className="bento-item"
                style={{
                    background: "#f8faff",
                    borderRadius: "24px",
                    padding: "30px",
                    border: "1px solid #e2e8f0",
                    ...revealStyle(4),
                }}
            >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px" }}>5% Daily</h2>
                <p style={{ color: "#64748b", fontWeight: 600, lineHeight: 1.5, fontSize: "0.95rem" }}>
                    Industry-leading returns powered by SmartAgent.
                </p>
            </div>

            {/* Bank-Grade Safety */}
            <div
                ref={setRef(5)}
                className="bento-item"
                style={{
                    background: "#0f172a",
                    color: "white",
                    borderRadius: "24px",
                    padding: "30px",
                    border: "1px solid #1e293b",
                    minHeight: "220px",
                    ...revealStyle(5),
                }}
            >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px", color: "white" }}>
                    Bank-Grade Safety
                </h2>
                <p style={{ color: "#94a3b8", fontWeight: 600, lineHeight: 1.5, fontSize: "0.95rem" }}>
                    Your money is protected by the same security used by the world&apos;s biggest banks.
                </p>
                <div style={{ fontSize: "3rem", marginTop: "25px" }}>🛡️</div>
            </div>

            {/* No Tech Skills */}
            <div
                ref={setRef(6)}
                className="bento-item"
                style={{
                    background: "#f8faff",
                    borderRadius: "24px",
                    padding: "30px",
                    border: "1px solid #e2e8f0",
                    gridColumn: "span 2",
                    ...revealStyle(6),
                }}
            >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px" }}>
                    No Tech Skills Needed
                </h2>
                <p style={{ color: "#64748b", fontWeight: 600, lineHeight: 1.5, fontSize: "0.95rem" }}>
                    If you can send a text, you can use smartInvest. We handle the hard part; you just watch the numbers go up.
                </p>
            </div>
        </section>
    );
}
