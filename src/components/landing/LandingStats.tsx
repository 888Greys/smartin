"use client";

import React from "react";

interface LandingStatsProps {
    activeUsers: number;
    totalEarned: number;
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingStats({ activeUsers, totalEarned, setRef, revealStyle }: LandingStatsProps) {
    return (
        <section
            ref={setRef(9)}
            style={{ padding: "70px 5%", background: "#0f172a", ...revealStyle(9) }}
        >
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                    gap: "40px",
                }}
            >
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                    <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "white", marginBottom: "8px" }}>
                        {activeUsers.toLocaleString()}+
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600 }}>Active Users</div>
                </div>
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                    <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "white", marginBottom: "8px" }}>
                        Ksh {totalEarned.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600 }}>Total Earned</div>
                </div>
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                    <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "white", marginBottom: "8px" }}>5%</div>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600 }}>Daily Returns</div>
                </div>
                <div style={{ textAlign: "center", minWidth: "150px" }}>
                    <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "#10b981", marginBottom: "8px" }}>4.9★</div>
                    <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600 }}>User Rating</div>
                </div>
            </div>
        </section>
    );
}
