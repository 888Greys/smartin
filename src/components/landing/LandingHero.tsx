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
                padding: "90px 5% 70px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            {/* Inner flex: left text + right mockup */}
            <div
                className="hero-inner"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "60px",
                    justifyContent: "space-between",
                }}
            >
                {/* LEFT: Text content */}
                <div
                    className="hero-left"
                    style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        minWidth: "0",
                    }}
                >
                    {/* "Live" badge */}
                    <div
                        ref={setRef(0)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(16,185,129,0.1)",
                            border: "1px solid rgba(16,185,129,0.25)",
                            borderRadius: "50px",
                            padding: "6px 14px",
                            marginBottom: "24px",
                            ...revealStyle(0),
                        }}
                    >
                        <span
                            style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "#10b981",
                                display: "inline-block",
                                animation: "live-dot 1.5s ease-in-out infinite",
                                boxShadow: "0 0 8px rgba(16,185,129,0.7)",
                            }}
                        />
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10b981", letterSpacing: "0.5px" }}>
                            LIVE EARNING NOW
                        </span>
                    </div>

                    {/* Heading */}
                    <h1
                        ref={setRef(1)}
                        className="hero-title"
                        style={{
                            fontSize: "clamp(2.2rem, 6vw, 4rem)",
                            fontWeight: 800,
                            lineHeight: 1.12,
                            marginBottom: "20px",
                            letterSpacing: "-2px",
                            color: "#f1f5f9",
                            ...revealStyle(1),
                        }}
                    >
                        Make your money{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #60a5fa, #818cf8)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            move
                        </span>{" "}
                        while you sleep.
                    </h1>

                    {/* Subtitle */}
                    <p
                        ref={setRef(2)}
                        className="hero-desc"
                        style={{
                            fontSize: "1.1rem",
                            color: "#94a3b8",
                            maxWidth: "480px",
                            marginBottom: "36px",
                            lineHeight: 1.7,
                            ...revealStyle(2),
                        }}
                    >
                        Deposit as little as Ksh 500 today. Watch it grow by tomorrow. No complex math, no hidden fees — just simple daily profits.
                    </p>

                    {/* CTAs */}
                    <div
                        ref={setRef(3)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            flexWrap: "wrap",
                            ...revealStyle(3),
                        }}
                    >
                        <Link
                            href="/register"
                            className="cta-btn"
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                color: "white",
                                padding: "15px 32px",
                                borderRadius: "12px",
                                fontSize: "1rem",
                                fontWeight: 700,
                                textDecoration: "none",
                                boxShadow: "0 0 30px rgba(99,102,241,0.35)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "box-shadow 0.25s, transform 0.25s",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 45px rgba(99,102,241,0.55)";
                                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.35)";
                                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                            }}
                        >
                            Get Started Free
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>

                        <Link
                            href="/login"
                            style={{
                                color: "#94a3b8",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                textDecoration: "none",
                                padding: "15px 20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                transition: "color 0.2s, border-color 0.2s",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                            }}
                        >
                            Already have an account?
                        </Link>
                    </div>

                    {/* Trust row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "28px", flexWrap: "wrap" }}>
                        {[
                            { icon: "🛡️", label: "Bank-grade encryption" },
                            { icon: "⚡", label: "Instant M-Pesa deposits" },
                            { icon: "📈", label: "5% daily returns" },
                        ].map(({ icon, label }) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                                <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Dashboard Mockup Card */}
                <div
                    className="hero-mockup"
                    style={{
                        flexShrink: 0,
                        width: "340px",
                        animation: "float 5s ease-in-out infinite",
                    }}
                >
                    {/* Main card */}
                    <div
                        style={{
                            background: "#0d1627",
                            borderRadius: "24px",
                            padding: "28px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Card inner glow */}
                        <div style={{
                            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                            width: "200px", height: "1px",
                            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
                        }} />

                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <div>
                                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>Total Balance</div>
                                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-1px" }}>
                                    Ksh {liveVal.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                </div>
                            </div>
                            <div style={{
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.2)",
                                borderRadius: "10px",
                                padding: "6px 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10b981" }}>+5.0%</span>
                            </div>
                        </div>

                        {/* Mini chart bars */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px", marginBottom: "24px" }}>
                            {[30, 45, 35, 55, 42, 68, 58, 80, 72, 90, 85, 100].map((h, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: `${h}%`,
                                        borderRadius: "4px 4px 0 0",
                                        background: i === 11
                                            ? "linear-gradient(180deg, #6366f1, #3b82f6)"
                                            : "rgba(99,102,241,0.2)",
                                        transition: "height 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Recent earnings */}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "18px" }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "12px" }}>Today's Earnings</div>
                            {[
                                { label: "Daily return", amount: "+Ksh 7,014", color: "#10b981" },
                                { label: "Referral bonus", amount: "+Ksh 500", color: "#818cf8" },
                            ].map(({ label, amount, color }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                                        <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{label}</span>
                                    </div>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color }}>{amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating badge below card */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "#0d1627",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        padding: "14px 18px",
                        marginTop: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>Network Growth</div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#10b981" }}>+Ksh {Math.floor(liveVal * 0.023).toLocaleString()} today</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
