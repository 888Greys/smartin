"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";

import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingBento from "@/components/landing/LandingBento";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingStats from "@/components/landing/LandingStats";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingTrust from "@/components/landing/LandingTrust";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const [liveVal, setLiveVal] = useState(140292);
  const [activeUsers, setActiveUsers] = useState(103);
  const [totalEarned, setTotalEarned] = useState(202567);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());

  // Live ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVal((prev) => prev + Math.random() * 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Active users + total earned counters
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 15) + 3);
      setTotalEarned((prev) => prev + Math.floor(Math.random() * 7300) + 1200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll-reveal observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const idx = parseInt(target.dataset.revealIdx || "-1");
            if (idx !== -1) {
              setRevealed((prev) => new Set(prev).add(idx));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const setRef = useCallback(
    (idx: number) =>
      (el: HTMLElement | null) => {
        if (el) {
          el.dataset.revealIdx = String(idx);
          elementsRef.current.set(idx, el);
          observerRef.current?.observe(el);
        }
      },
    []
  );

  const revealStyle = (idx: number): React.CSSProperties => ({
    opacity: revealed.has(idx) ? 1 : 0,
    transform: revealed.has(idx) ? "translateY(0)" : "translateY(30px)",
    transition: "1s ease-out",
  });

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-item { grid-column: span 1 !important; min-height: auto !important; }
          .hero-title { font-size: 2.2rem !important; letter-spacing: -1px !important; }
          .hero-desc { font-size: 1rem !important; }
          .cta-btn { padding: 18px 35px !important; font-size: 1rem !important; }
          .nav-container { padding: 15px 4% !important; }
          .bento-item h2 { font-size: 1.4rem !important; }
          .bento-item p { font-size: 0.9rem !important; }
          .trust-logos { gap: 25px !important; }
          .trust-logos > div { font-size: 1.2rem !important; }
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonial-scroll {
          display: flex;
          gap: 25px;
          animation: scroll-left 5s linear infinite;
        }
        .testimonial-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Grid mesh background */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 82, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 82, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "transparent",
          color: "#0f172a",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          overflowX: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <LandingNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <LandingHero liveVal={liveVal} setRef={setRef} revealStyle={revealStyle} />
        <LandingBento setRef={setRef} revealStyle={revealStyle} />
        <LandingHowItWorks setRef={setRef} revealStyle={revealStyle} />
        <LandingStats activeUsers={activeUsers} totalEarned={totalEarned} setRef={setRef} revealStyle={revealStyle} />
        <LandingTestimonials setRef={setRef} revealStyle={revealStyle} />
        <LandingTrust setRef={setRef} revealStyle={revealStyle} />
        <LandingFooter />
      </div>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
        />
      )}
    </>
  );
}
