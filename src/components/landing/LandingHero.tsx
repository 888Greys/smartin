"use client";

import Link from "next/link";
import React from "react";

interface LandingHeroProps {
    liveVal: number;
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingHero({ liveVal, setRef, revealStyle }: LandingHeroProps) {
    return (
        <section
            style={{
                padding: "60px 5% 50px",
                textAlign: "center",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            <h1
                ref={setRef(0)}
                className="hero-title"
                style={{
                    fontSize: "clamp(2rem, 7vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1.15,
                    marginBottom: "20px",
                    letterSpacing: "-1.5px",
                    ...revealStyle(0),
                }}
            >
                Make your money{" "}
                <span
                    style={{
                        background: "linear-gradient(135deg, #0052ff, #00f2ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    move
                </span>{" "}
                while you sleep.
            </h1>

            <p
                ref={setRef(1)}
                className="hero-desc"
                style={{
                    fontSize: "1.1rem",
                    color: "#64748b",
                    maxWidth: "550px",
                    margin: "0 auto 35px",
                    lineHeight: 1.6,
                    ...revealStyle(1),
                }}
            >
                Deposit as little as Ksh 500 today. Watch it grow by tomorrow. No complex math, no hidden fees, just simple daily profits.
            </p>

            <div
                ref={setRef(2)}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                    ...revealStyle(2),
                }}
            >
                <Link
                    href="/register"
                    className="cta-btn"
                    style={{
                        background: "#0f172a",
                        color: "white",
                        padding: "20px 40px",
                        borderRadius: "18px",
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        textDecoration: "none",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                    }}
                >
                    Get Started
                </Link>

                <div
                    style={{
                        marginTop: "15px",
                        background: "white",
                        padding: "18px 25px",
                        borderRadius: "20px",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                        border: "1px solid #f1f5f9",
                    }}
                >
                    <p
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            marginBottom: "5px",
                        }}
                    >
                        Live Network Growth
                    </p>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0052ff" }}>
                        Ksh {liveVal.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </div>
                </div>
            </div>
        </section>
    );
}
