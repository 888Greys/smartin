"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [liveVal, setLiveVal] = useState(140292);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVal(prev => prev + Math.random() * 5);
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
            `}</style>

      <div style={{ background: '#ffffff', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
        {/* Navigation */}
        <nav className="nav-container" style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
          {/* Hamburger Menu - Left */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: menuOpen ? '#f1f5f9' : 'white', border: '1px solid #e2e8f0', borderRadius: '50px', cursor: 'pointer', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: '0.2s' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', transition: '0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }}></span>
                <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', transition: '0.3s', opacity: menuOpen ? 0 : 1 }}></span>
                <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', transition: '0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }}></span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Menu</span>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div style={{ position: 'absolute', top: '55px', left: 0, background: 'white', borderRadius: '12px', boxShadow: '0 10px 50px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', minWidth: '200px', overflow: 'hidden' }}>
                <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: '#334155', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  Contact Us
                </Link>
                <Link href="/faqs" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: '#334155', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  FAQs
                </Link>
                <Link href="/terms" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', color: '#334155', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                  Terms & Conditions
                </Link>
              </div>
            )}
          </div>

          {/* Logo - Right */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/lion.png" alt="SmartInvest" style={{ height: '42px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e3a5f', letterSpacing: '1px' }}>SMARTINVEST</span>
          </Link>
        </nav>

        {/* Hero Section */}
        <section style={{ padding: '60px 5% 50px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 ref={setRef(0)} className="hero-title" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1.5px', ...revealStyle(0) }}>
            Make your money <span style={{ background: 'linear-gradient(135deg, #0052ff, #00f2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>move</span> while you sleep.
          </h1>
          <p ref={setRef(1)} className="hero-desc" style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '550px', margin: '0 auto 35px', lineHeight: 1.6, ...revealStyle(1) }}>
            Deposit as little as Ksh 500 today. Watch it grow by tomorrow. No complex math, no hidden fees, just simple daily profits.
          </p>

          <div ref={setRef(2)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', ...revealStyle(2) }}>
            <Link href="/register" className="cta-btn" style={{ background: '#0f172a', color: 'white', padding: '20px 40px', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 15px 35px rgba(0,0,0,0.12)' }}>
              Get Started
            </Link>
            <div style={{ marginTop: '15px', background: 'white', padding: '18px 25px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>Live Network Growth</p>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0052ff' }}>Ksh {liveVal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="bento-grid" style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div ref={setRef(3)} className="bento-item" style={{ background: '#eff6ff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', gridColumn: 'span 2', minHeight: '220px', ...revealStyle(3) }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>The 24-Hour Promise</h2>
            <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5, fontSize: '0.95rem', maxWidth: '90%' }}>Every dollar you add starts working immediately. By this time tomorrow, you&apos;ll see your first profit.</p>
            <div style={{ fontSize: '4rem', position: 'absolute', bottom: '-5px', right: '10px', opacity: 0.1 }}>🕒</div>
          </div>

          <div ref={setRef(4)} className="bento-item" style={{ background: '#f8faff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', ...revealStyle(4) }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>5% Daily</h2>
            <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5, fontSize: '0.95rem' }}>Industry-leading returns powered by SmartAgent.</p>
          </div>

          <div ref={setRef(5)} className="bento-item" style={{ background: '#0f172a', color: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #1e293b', minHeight: '220px', ...revealStyle(5) }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'white' }}>Bank-Grade Safety</h2>
            <p style={{ color: '#94a3b8', fontWeight: 600, lineHeight: 1.5, fontSize: '0.95rem' }}>Your money is protected by the same security used by the world&apos;s biggest banks.</p>
            <div style={{ fontSize: '3rem', marginTop: '25px' }}>🛡️</div>
          </div>

          <div ref={setRef(6)} className="bento-item" style={{ background: '#f8faff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', gridColumn: 'span 2', ...revealStyle(6) }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>No Tech Skills Needed</h2>
            <p style={{ color: '#64748b', fontWeight: 600, lineHeight: 1.5, fontSize: '0.95rem' }}>If you can send a text, you can use smartInvest. We handle the hard part; you just watch the numbers go up.</p>
          </div>
        </section>

        {/* Trust Section */}
        <section ref={setRef(7)} style={{ padding: '60px 5%', textAlign: 'center', ...revealStyle(7) }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b' }}>Trusted by 50,000+ everyday investors</h3>
          <div className="trust-logos" style={{ display: 'flex', justifyContent: 'center', gap: '35px', opacity: 0.4, filter: 'grayscale(1)', marginTop: '25px', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>Forbes</div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>TechCrunch</div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>Bloomberg</div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>Wired</div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '40px 5%', textAlign: 'center', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '0.85rem' }}>
          <p>© 2026 smartInvest. All rights reserved.</p>
        </footer>
      </div>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}></div>
      )}
    </>
  );
}
