"use client";

import React from "react";

interface LandingTrustProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingTrust({ setRef, revealStyle }: LandingTrustProps) {
    return (
        <section
            ref={setRef(15)}
            style={{
                padding: "60px 5%",
                textAlign: "center",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                ...revealStyle(15),
            }}
        >
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "28px" }}>
                As featured in
            </p>
            <div
                className="trust-logos"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "40px",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                {["Forbes", "TechCrunch", "Bloomberg", "Wired", "Business Daily"].map((name) => (
                    <div
                        key={name}
                        style={{
                            fontWeight: 900,
                            fontSize: "1.2rem",
                            color: "#334155",
                            letterSpacing: "0.5px",
                            transition: "color 0.2s",
                            cursor: "default",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#64748b")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#334155")}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </section>
    );
}
