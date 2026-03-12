"use client";

import React from "react";

interface LandingStatsProps {
    activeUsers: number;
    totalEarned: number;
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

const stats = (activeUsers: number, totalEarned: number) => [
    {
        value: `${activeUsers.toLocaleString()}+`,
        label: "Active Investors",
        color: "#60a5fa",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
        value: `Ksh ${totalEarned.toLocaleString()}`,
        label: "Total Earned by Users",
        color: "#10b981",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
        value: "5%",
        label: "Daily Returns",
        color: "#818cf8",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    },
    {
        value: "4.9★",
        label: "User Rating",
        color: "#fbbf24",
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    },
];

export default function LandingStats({ activeUsers, totalEarned, setRef, revealStyle }: LandingStatsProps) {
    return (
        <section
            style={{
                padding: "80px 5%",
                background: "linear-gradient(180deg, rgba(13,22,39,0.8) 0%, rgba(6,13,26,0.95) 100%)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {/* Label */}
                <div ref={setRef(12)} style={{ textAlign: "center", marginBottom: "50px", ...revealStyle(12) }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>
                        By the Numbers
                    </div>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.5px" }}>
                        Trusted by thousands of Kenyans
                    </h2>
                </div>

                {/* Stats row */}
                <div
                    className="stats-grid"
                    ref={setRef(13)}
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "stretch",
                        gap: "0",
                        ...revealStyle(13),
                    }}
                >
                    {stats(activeUsers, totalEarned).map((s, i, arr) => (
                        <React.Fragment key={s.label}>
                            <div style={{ textAlign: "center", flex: 1, padding: "0 20px" }}>
                                {/* Icon */}
                                <div style={{
                                    width: "44px", height: "44px",
                                    background: `${s.color}15`,
                                    border: `1px solid ${s.color}30`,
                                    borderRadius: "12px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: s.color,
                                    margin: "0 auto 16px",
                                }}>
                                    {s.icon}
                                </div>
                                {/* Value */}
                                <div style={{
                                    fontSize: "2.4rem", fontWeight: 800,
                                    background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`,
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                    marginBottom: "8px", lineHeight: 1,
                                }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: "0.88rem", color: "#64748b", fontWeight: 600 }}>{s.label}</div>
                            </div>
                            {/* Divider */}
                            {i < arr.length - 1 && (
                                <div className="stats-divider" style={{ width: "1px", background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)", flexShrink: 0 }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
