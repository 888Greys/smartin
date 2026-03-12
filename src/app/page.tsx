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
      { threshold: 0.08 }
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
    transform: revealed.has(idx) ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease-out ${(idx % 6) * 80}ms, transform 0.7s ease-out ${(idx % 6) * 80}ms`,
  });

  return (
    <>
      {/* Subtle dot-grid background */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          backgroundImage:
            "radial-gradient(rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Deep blue radial ambient */}
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          background: "transparent",
          color: "#f1f5f9",
          fontFamily: "'Inter', sans-serif",
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
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: "rgba(0,0,0,0.3)" }}
        />
      )}
    </>
  );
}
