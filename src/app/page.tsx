"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [liveVal, setLiveVal] = useState(1402.92);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVal(prev => prev + Math.random() * 0.05);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const idx = parseInt(target.dataset.revealIdx || '-1');
            if (idx !== -1) {
              setRevealed(prev => new Set(prev).add(idx));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsRef.current.forEach(el => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const setRef = useCallback((idx: number) => (el: HTMLElement | null) => {
    if (el) {
      el.dataset.revealIdx = String(idx);
      elementsRef.current.set(idx, el);
      observerRef.current?.observe(el);
    }
  }, []);

  const revealStyle = (idx: number): React.CSSProperties => ({
    opacity: revealed.has(idx) ? 1 : 0,
    transform: revealed.has(idx) ? 'translateY(0)' : 'translateY(30px)',
    transition: '1s ease-out',
  });

  return (
    <div style={{ background: '#ffffff', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '1.2rem' }}>
          <div style={{ width: '32px', height: '32px', background: '#0052ff', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
          smartInvest
        </div>
        <Link href="/register" style={{ background: '#0052ff', color: 'white', padding: '10px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '100px 5% 60px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 ref={setRef(0)} style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '25px', letterSpacing: '-2px', ...revealStyle(0) }}>
          Make your money <span style={{ background: 'linear-gradient(135deg, #0052ff, #00f2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>move</span> while you sleep.
        </h1>
        <p ref={setRef(1)} style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6, ...revealStyle(1) }}>
          Put in $10 today. Watch it grow by tomorrow. No complex math, no hidden fees, just simple daily profits.
        </p>

        <div ref={setRef(2)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', ...revealStyle(2) }}>
          <Link href="/register" style={{ background: '#0f172a', color: 'white', padding: '22px 45px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: '0.3s' }}>
            Start with just $10
          </Link>
          <div style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'inline-block' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Live Network Growth</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0052ff' }}>${liveVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div ref={setRef(3)} style={{ background: '#eff6ff', borderRadius: '32px', padding: '40px', border: '1px solid #eee', position: 'relative', overflow: 'hidden', gridColumn: 'span 2', minHeight: '300px', ...revealStyle(3) }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>The 24-Hour Promise</h2>
          <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5 }}>Every dollar you add starts working immediately. By this time tomorrow, you&apos;ll see your first profit. It&apos;s that simple.</p>
          <div style={{ fontSize: '5rem', position: 'absolute', bottom: '-10px', right: '10px', opacity: 0.1 }}>🕒</div>
        </div>

        <div ref={setRef(4)} style={{ background: '#f8faff', borderRadius: '32px', padding: '40px', border: '1px solid #eee', ...revealStyle(4) }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>5% Daily</h2>
          <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5 }}>Industry-leading returns powered by SmartAgent.</p>
        </div>

        <div ref={setRef(5)} style={{ background: '#0f172a', color: 'white', borderRadius: '32px', padding: '40px', border: '1px solid #eee', minHeight: '300px', ...revealStyle(5) }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px', color: 'white' }}>Bank-Grade Safety</h2>
          <p style={{ color: '#94a3b8', fontWeight: 600, lineHeight: 1.5 }}>Your money is protected by the same security used by the world&apos;s biggest banks. Sleep easy knowing you&apos;re covered.</p>
          <div style={{ fontSize: '4rem', marginTop: '40px' }}>🛡️</div>
        </div>

        <div ref={setRef(6)} style={{ background: '#f8faff', borderRadius: '32px', padding: '40px', border: '1px solid #eee', gridColumn: 'span 2', ...revealStyle(6) }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>No Tech Skills Needed</h2>
          <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5 }}>If you can send a text, you can use smartInvest. We handle the hard part; you just watch the numbers go up.</p>
        </div>
      </section>

      {/* Trust Section */}
      <section ref={setRef(7)} style={{ padding: '80px 5%', textAlign: 'center', ...revealStyle(7) }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#64748b' }}>Trusted by 50,000+ everyday investors</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', opacity: 0.4, filter: 'grayscale(1)', marginTop: '30px', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>Forbes</div>
          <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>TechCrunch</div>
          <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>Bloomberg</div>
          <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>Wired</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 5%', textAlign: 'center', borderTop: '1px solid #eee', color: '#64748b', fontSize: '0.9rem' }}>
        <p>© 2026 smartInvest. All rights reserved. Money growing automatically.</p>
      </footer>
    </div>
  );
}
