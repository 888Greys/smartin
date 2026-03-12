"use client";

import Link from "next/link";
import Image from "next/image";

interface LandingNavProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function LandingNav({ menuOpen, setMenuOpen }: LandingNavProps) {
  return (
    <nav
      className="nav-container"
      style={{
        padding: "16px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "rgba(6,13,26,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 100,
      }}
    >
      {/* Logo — Left */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
        <Image
          src="/lion.png"
          alt="SmartInvest"
          width={112}
          height={38}
          style={{ height: "38px", width: "auto", objectFit: "contain" }}
        />
        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#f1f5f9", letterSpacing: "0.5px" }}>
          SMARTINVEST
        </span>
      </Link>

      {/* Right side: nav links + CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "4px", marginRight: "8px" }}>
          <Link href="/faqs" style={{ padding: "8px 14px", color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, borderRadius: "8px", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
            FAQs
          </Link>
          <Link href="/contact" style={{ padding: "8px 14px", color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, borderRadius: "8px", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
            Contact
          </Link>
          <Link href="/login" style={{ padding: "8px 16px", color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, borderRadius: "8px", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
            Login
          </Link>
        </div>

        <Link
          href="/register"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            padding: "10px 22px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 0 20px rgba(99,102,241,0.3)",
            transition: "box-shadow 0.2s, transform 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.5)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.3)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Get Started
        </Link>

        {/* Hamburger - mobile only */}
        <div style={{ position: "relative", marginLeft: "8px" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: menuOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              cursor: "pointer",
              padding: "9px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              transition: "0.2s",
            }}
          >
            <span style={{ width: "18px", height: "2px", background: "#cbd5e1", borderRadius: "2px", display: "block", transition: "0.3s", transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
            <span style={{ width: "18px", height: "2px", background: "#cbd5e1", borderRadius: "2px", display: "block", transition: "0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: "18px", height: "2px", background: "#cbd5e1", borderRadius: "2px", display: "block", transition: "0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
          </button>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                background: "#0d1627",
                borderRadius: "14px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: "200px",
                overflow: "hidden",
              }}
            >
              {[
                { href: "/contact", label: "Contact Us", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
                { href: "/faqs", label: "FAQs", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                { href: "/terms", label: "Terms & Conditions", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                { href: "/login", label: "Login", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> },
              ].map(({ href, label, icon }, i, arr) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 18px",
                    color: "#cbd5e1",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
