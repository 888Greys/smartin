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
        padding: "20px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}
    >
      {/* Hamburger Menu - Left */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: menuOpen ? "#f1f5f9" : "white",
            border: "1px solid #e2e8f0",
            borderRadius: "50px",
            cursor: "pointer",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "0.2s",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                width: "18px",
                height: "2px",
                background: "#0f172a",
                borderRadius: "2px",
                transition: "0.3s",
                transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
                display: "block",
              }}
            />
            <span
              style={{
                width: "18px",
                height: "2px",
                background: "#0f172a",
                borderRadius: "2px",
                transition: "0.3s",
                opacity: menuOpen ? 0 : 1,
                display: "block",
              }}
            />
            <span
              style={{
                width: "18px",
                height: "2px",
                background: "#0f172a",
                borderRadius: "2px",
                transition: "0.3s",
                transform: menuOpen
                  ? "rotate(-45deg) translateY(-6px)"
                  : "none",
                display: "block",
              }}
            />
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b" }}>
            Menu
          </span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "55px",
              left: 0,
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 50px rgba(0,0,0,0.15)",
              border: "1px solid #e2e8f0",
              minWidth: "200px",
              overflow: "hidden",
            }}
          >
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                color: "#334155",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Contact Us
            </Link>
            <Link
              href="/faqs"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                color: "#334155",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              FAQs
            </Link>
            <Link
              href="/terms"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                color: "#334155",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Terms &amp; Conditions
            </Link>
          </div>
        )}
      </div>

      {/* Logo - Right */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <Image
          src="/lion.png"
          alt="SmartInvest"
          width={112}
          height={42}
          style={{ height: "42px", width: "auto", objectFit: "contain" }}
        />
        <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#1e3a5f", letterSpacing: "1px" }}>
          SMARTINVEST
        </span>
      </Link>
    </nav>
  );
}
