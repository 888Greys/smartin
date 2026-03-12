"use client";

import React from "react";

interface LandingBentoProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

function BentoCard({
    children,
    gridColumn,
    minHeight,
    accentColor = "#6366f1",
}: {
    children: React.ReactNode;
    gridColumn?: string;
    minHeight?: string;
    accentColor?: string;
}) {
    const [hovered, setHovered] = React.useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="bento-item"
            style={{
                background: "#0d1627",
                borderRadius: "24px",
                padding: "32px",
                border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
                position: "relative",
                overflow: "hidden",
                gridColumn,
                minHeight,
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered
                    ? `0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 ${accentColor}40`
                    : `inset 0 1px 0 ${accentColor}20`,
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
                background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
            }} />
            {children}
        </div>
    );
}

function IconBox({ children, color = "#6366f1" }: { children: React.ReactNode; color?: string }) {
    return (
        <div style={{
            width: "52px", height: "52px",
            background: `${color}18`,
            border: `1px solid ${color}30`,
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "20px",
            boxShadow: `0 0 20px ${color}15`,
        }}>
            {children}
        </div>
    );
}

export default function LandingBento({ setRef, revealStyle }: LandingBentoProps) {
    return (
        <section
            className="bento-grid"
            style={{
                padding: "20px 5% 60px",
                maxWidth: "1200px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
            }}
        >
            {/* 24-Hour Promise */}
            <div ref={setRef(4)} style={{ gridColumn: "span 2", ...revealStyle(4) }}>
                <BentoCard gridColumn="span 2" minHeight="220px" accentColor="#3b82f6">
                    <IconBox color="#3b82f6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </IconBox>
                    <h2 className="bento-item" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#f1f5f9" }}>
                        The 24-Hour Promise
                    </h2>
                    <p style={{ color: "#94a3b8", fontWeight: 500, lineHeight: 1.6, fontSize: "0.95rem", maxWidth: "80%" }}>
                        Every deposit starts working immediately. By this time tomorrow, you&apos;ll see your first profit credited to your account.
                    </p>
                    <div style={{
                        position: "absolute", bottom: "-20px", right: "-10px",
                        fontSize: "8rem", opacity: 0.03, userSelect: "none", lineHeight: 1,
                    }}>24H</div>
                </BentoCard>
            </div>

            {/* 5% Daily */}
            <div ref={setRef(5)} style={{ ...revealStyle(5) }}>
                <BentoCard accentColor="#10b981">
                    <IconBox color="#10b981">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                        </svg>
                    </IconBox>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#f1f5f9" }}>5% Daily</h2>
                    <p style={{ color: "#94a3b8", fontWeight: 500, lineHeight: 1.6, fontSize: "0.95rem" }}>
                        Industry-leading returns powered by SmartAgent AI.
                    </p>
                    <div style={{
                        marginTop: "20px",
                        fontSize: "2.5rem", fontWeight: 800,
                        background: "linear-gradient(135deg, #10b981, #34d399)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>5%</div>
                </BentoCard>
            </div>

            {/* Bank-Grade Safety */}
            <div ref={setRef(6)} style={{ ...revealStyle(6) }}>
                <BentoCard minHeight="220px" accentColor="#818cf8">
                    <IconBox color="#818cf8">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </IconBox>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#f1f5f9" }}>
                        Bank-Grade Safety
                    </h2>
                    <p style={{ color: "#94a3b8", fontWeight: 500, lineHeight: 1.6, fontSize: "0.95rem" }}>
                        Your money is protected by the same encryption used by the world&apos;s biggest banks.
                    </p>
                </BentoCard>
            </div>

            {/* No Tech Skills */}
            <div ref={setRef(7)} style={{ gridColumn: "span 2", ...revealStyle(7) }}>
                <BentoCard gridColumn="span 2" accentColor="#f59e0b">
                    <IconBox color="#f59e0b">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                    </IconBox>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "#f1f5f9" }}>
                        No Tech Skills Needed
                    </h2>
                    <p style={{ color: "#94a3b8", fontWeight: 500, lineHeight: 1.6, fontSize: "0.95rem" }}>
                        If you can send a text, you can use SmartInvest. We handle the hard part — you just watch the numbers go up.
                    </p>
                </BentoCard>
            </div>
        </section>
    );
}
