"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingFooter() {
    return (
        <footer
            style={{
                background: "#060d1a",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                padding: "60px 5% 40px",
            }}
        >
            <div
                className="footer-grid"
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: "40px",
                    marginBottom: "50px",
                }}
            >
                {/* Brand column */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                        <Image
                            src="/lion.png"
                            alt="SmartInvest"
                            width={80}
                            height={30}
                            style={{ height: "30px", width: "auto", objectFit: "contain" }}
                        />
                        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f1f5f9", letterSpacing: "0.5px" }}>
                            SMARTINVEST
                        </span>
                    </div>
                    <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: "280px" }}>
                        Helping Kenyans grow their savings with simple, daily 5% returns. Start with just Ksh 500.
                    </p>
                    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                        {/* Social icons */}
                        {[
                            { label: "Twitter/X", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                            { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                            { label: "Instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 1.5h9a6 6 0 0 1 6 6v9a6 6 0 0 1-6 6h-9a6 6 0 0 1-6-6v-9a6 6 0 0 1 6-6z" },
                        ].map(({ label, path }) => (
                            <button
                                key={label}
                                aria-label={label}
                                style={{
                                    width: "36px", height: "36px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "8px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "background 0.2s, border-color 0.2s",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={path}/>
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
                        Quick Links
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            { href: "/register", label: "Get Started" },
                            { href: "/login", label: "Login" },
                            { href: "/faqs", label: "FAQs" },
                            { href: "/contact", label: "Contact Us" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#cbd5e1")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Legal */}
                <div>
                    <h4 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
                        Legal
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            { href: "/terms", label: "Terms & Conditions" },
                            { href: "/terms#privacy", label: "Privacy Policy" },
                            { href: "/terms#risk", label: "Risk Disclosure" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#cbd5e1")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                maxWidth: "1100px",
                margin: "0 auto",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
            }}>
                <p style={{ color: "#475569", fontSize: "0.82rem" }}>
                    © 2026 SmartInvest. All rights reserved.
                </p>
                <p style={{ color: "#334155", fontSize: "0.78rem" }}>
                    Built with ❤️ for Kenyan investors
                </p>
            </div>
        </footer>
    );
}
