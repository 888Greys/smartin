"use client";

import React from "react";

const testimonials = [
    {
        id: "jm",
        initials: "JM",
        name: "John Mwangi",
        location: "Nairobi, Kenya",
        quote: "Deposited Ksh 5,000 and earned Ksh 2,500 in two weeks! SmartInvest is the real deal.",
        gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    },
    {
        id: "sw",
        initials: "SW",
        name: "Sarah Wanjiku",
        location: "Mombasa, Kenya",
        quote: "Best investment app in Kenya — M-Pesa integration works perfectly and earnings are consistent!",
        gradient: "linear-gradient(135deg, #10b981, #34d399)",
    },
    {
        id: "po",
        initials: "PO",
        name: "Peter Ochieng",
        location: "Kisumu, Kenya",
        quote: "All my friends joined and we're all earning daily. The referral bonuses are a great touch.",
        gradient: "linear-gradient(135deg, #818cf8, #a78bfa)",
    },
    {
        id: "am",
        initials: "AM",
        name: "Alice Muthoni",
        location: "Nakuru, Kenya",
        quote: "Started with Ksh 1,000 three weeks ago. Daily returns are consistent every single day.",
        gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    },
    {
        id: "dk",
        initials: "DK",
        name: "David Kamau",
        location: "Eldoret, Kenya",
        quote: "The app is so simple to use. Deposited, and within 24 hours my profit was already showing!",
        gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    },
];

interface TestimonialCardProps {
    testimonial: typeof testimonials[0];
    suffix?: string;
}

function TestimonialCard({ testimonial, suffix = "" }: TestimonialCardProps) {
    return (
        <div
            style={{
                minWidth: "320px",
                maxWidth: "320px",
                background: "#0d1627",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Top quote mark */}
            <div style={{
                position: "absolute", top: "16px", right: "20px",
                fontSize: "4rem", color: "rgba(255,255,255,0.04)", lineHeight: 1,
                fontFamily: "Georgia, serif", userSelect: "none",
            }}>&ldquo;</div>

            {/* Stars */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <span key={`${testimonial.id}${suffix}-${i}`} style={{ color: "#fbbf24", fontSize: "0.95rem" }}>★</span>
                ))}
            </div>

            {/* Quote */}
            <p style={{ color: "#cbd5e1", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "22px" }}>
                &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                    width: "42px", height: "42px",
                    borderRadius: "50%",
                    background: testimonial.gradient,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: "0.9rem",
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.06)",
                    flexShrink: 0,
                }}>
                    {testimonial.initials}
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" }}>{testimonial.name}</div>
                    <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "2px" }}>{testimonial.location}</div>
                </div>
            </div>
        </div>
    );
}

interface LandingTestimonialsProps {
    setRef: (idx: number) => (el: HTMLElement | null) => void;
    revealStyle: (idx: number) => React.CSSProperties;
}

export default function LandingTestimonials({ setRef, revealStyle }: LandingTestimonialsProps) {
    return (
        <section style={{ padding: "80px 0", overflow: "hidden" }}>
            {/* Header */}
            <div
                ref={setRef(14)}
                style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5%", textAlign: "center", marginBottom: "50px", ...revealStyle(14) }}
            >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                    Social Proof
                </div>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-1px", marginBottom: "10px" }}>
                    What Our Users Say
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "1rem" }}>Real stories from real investors across Kenya</p>
            </div>

            {/* Fade masks */}
            <div style={{ position: "relative" }}>
                <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", zIndex: 2,
                    background: "linear-gradient(90deg, #060d1a, transparent)",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", zIndex: 2,
                    background: "linear-gradient(270deg, #060d1a, transparent)",
                    pointerEvents: "none",
                }} />
                <div style={{ overflow: "hidden", padding: "10px 0 20px" }}>
                    <div className="testimonial-scroll" style={{ paddingLeft: "40px" }}>
                        {testimonials.map((t) => (
                            <TestimonialCard key={t.id} testimonial={t} />
                        ))}
                        {testimonials.map((t) => (
                            <TestimonialCard key={`dup-${t.id}`} testimonial={t} suffix="-dup" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
