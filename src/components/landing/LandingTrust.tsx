"use client";

import React from "react";

interface LandingTrustProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingTrust({ setRef, revealStyle }: LandingTrustProps) {
    return (
        <section
            ref={setRef(7)}
            style={{ padding: "60px 5%", textAlign: "center", ...revealStyle(7) }}
        >
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#64748b" }}>
                Trusted by 50,000+ everyday investors
            </h3>
            <div
                className="trust-logos"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "35px",
                    opacity: 0.4,
                    filter: "grayscale(1)",
                    marginTop: "25px",
                    flexWrap: "wrap",
                }}
            >
                {["Forbes", "TechCrunch", "Bloomberg", "Wired"].map((name) => (
                    <div key={name} style={{ fontWeight: 900, fontSize: "1.3rem" }}>
                        {name}
                    </div>
                ))}
            </div>
        </section>
    );
}
