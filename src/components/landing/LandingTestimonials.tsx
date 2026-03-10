"use client";

import React from "react";

const testimonials = [
    {
        id: "jm",
        initials: "JM",
        name: "John Mwangi",
        location: "Nairobi, Kenya",
        quote: "Deposited Ksh 5,000 and earned Ksh 2,500 in two weeks!",
        gradient: "linear-gradient(135deg, #0052ff, #00a3ff)",
    },
    {
        id: "sw",
        initials: "SW",
        name: "Sarah Wanjiku",
        location: "Mombasa, Kenya",
        quote: "Best investment app in Kenya - M-Pesa works perfectly!",
        gradient: "linear-gradient(135deg, #10b981, #34d399)",
    },
    {
        id: "po",
        initials: "PO",
        name: "Peter Ochieng",
        location: "Kisumu, Kenya",
        quote: "All my friends joined and we're all earning daily!",
        gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    },
    {
        id: "am",
        initials: "AM",
        name: "Alice Muthoni",
        location: "Nakuru, Kenya",
        quote: "Started with Ksh 1,000 - daily returns are consistent!",
        gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
                minWidth: "340px",
                background: "white",
                borderRadius: "20px",
                padding: "30px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                flexShrink: 0,
            }}
        >
            <div style={{ display: "flex", gap: "4px", marginBottom: "15px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <span key={`${testimonial.id}${suffix}-${i}`} style={{ color: "#fbbf24", fontSize: "1rem" }}>
                        ★
                    </span>
                ))}
            </div>
            <p
                style={{
                    color: "#334155",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    marginBottom: "20px",
                    fontStyle: "italic",
                }}
            >
                &quot;{testimonial.quote}&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                    style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: testimonial.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1rem",
                    }}
                >
                    {testimonial.initials}
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                        {testimonial.name}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{testimonial.location}</div>
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
        <section
            ref={setRef(10)}
            style={{ padding: "80px 0", background: "#f8fafc", overflow: "hidden" }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "0 5%",
                    ...revealStyle(10),
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "2rem",
                        fontWeight: 800,
                        marginBottom: "15px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    What Our Users Say
                </h2>
                <p style={{ textAlign: "center", color: "#64748b", fontSize: "1rem", marginBottom: "50px" }}>
                    Real stories from real investors
                </p>
            </div>

            <div style={{ overflow: "hidden", width: "100%" }}>
                <div className="testimonial-scroll">
                    {/* Original set */}
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.id} testimonial={t} />
                    ))}
                    {/* Duplicate for seamless loop */}
                    {testimonials.map((t) => (
                        <TestimonialCard key={`dup-${t.id}`} testimonial={t} suffix="-dup" />
                    ))}
                </div>
            </div>
        </section>
    );
}
