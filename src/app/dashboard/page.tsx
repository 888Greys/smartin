"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
    const [balance, setBalance] = useState(10.67);
    const [earnings] = useState(0.67);

    // Simple ticker animation
    useEffect(() => {
        const interval = setInterval(() => {
            setBalance(prev => {
                const newVal = prev + 0.000005;
                return Math.round(newVal * 100) / 100;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const progressOffset = 150; // Simulates progress (lower = more filled)

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(at top left, #f0f5ff 0%, #ffffff 100%)',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#0f172a'
        }}>
            <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', marginBottom: '30px' }}>
                    <div style={{ width: '24px', height: '24px', background: '#0052ff', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>s</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>smart<span style={{ color: '#0052ff' }}>Invest</span></h3>
                </div>

                {/* Balance */}
                <div style={{ marginBottom: '30px', textAlign: 'left', paddingLeft: '10px' }}>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Your Balance</p>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>${balance.toFixed(2)}</h1>
                </div>

                {/* Progress Circle */}
                <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <svg style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }} width="200" height="200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                        <circle
                            cx="100" cy="100" r="90"
                            fill="none"
                            stroke="#0052ff"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="565.48"
                            strokeDashoffset={progressOffset}
                            style={{ filter: 'drop-shadow(0 0 8px rgba(0, 82, 255, 0.15))' }}
                        />
                    </svg>
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <h2 style={{ color: '#00c853', fontSize: '2rem', fontWeight: 800 }}>+${earnings.toFixed(2)}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Earnings</p>
                    </div>
                </div>

                {/* Promise Pill */}
                <div style={{ background: '#f0f7ff', color: '#0052ff', padding: '12px 20px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    💰 You&apos;re earning $0.50 daily on your $10 deposit
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '20px', border: '1px solid #f1f5f9', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Daily Profit</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00c853' }}>5.0%</div>
                    </div>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '20px', border: '1px solid #f1f5f9', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Status</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0052ff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '6px', height: '6px', background: '#0052ff', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
                            Active
                        </div>
                    </div>
                </div>

                {/* Growth Banner */}
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#00c853', borderRadius: '50%' }} />
                    Your money is growing automatically
                </div>

                {/* Buttons */}
                <Link href="/deposit" style={{ display: 'block', width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, background: '#0052ff', color: 'white', textAlign: 'center', textDecoration: 'none', marginBottom: '12px' }}>
                    Deposit More
                </Link>
                <button style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, background: 'white', color: '#0f172a', border: '1.5px solid #e2e8f0', cursor: 'pointer', marginBottom: '12px' }}>
                    Withdraw Earnings
                </button>

                {/* Footer */}
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '15px' }}>Your funds are protected and insured</p>
                <Link href="/login" style={{ display: 'block', marginTop: '15px', color: '#0052ff', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                    Log out
                </Link>
            </div>

            <style jsx>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
}
