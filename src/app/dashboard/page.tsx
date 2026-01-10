"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startRegistration } from "@simplewebauthn/browser";

interface User {
    id: string;
    email: string;
    balance: number;
    totalEarnings: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [earnings, setEarnings] = useState(0.67);
    const [faceIdStatus, setFaceIdStatus] = useState<'none' | 'setting' | 'done'>('none');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('smartinvest_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    localStorage.removeItem('smartinvest_token');
                    router.push('/login');
                    return;
                }

                const data = await res.json();
                setUser(data.user);
                setEarnings(data.user.totalEarnings || 0.67);
            } catch {
                localStorage.removeItem('smartinvest_token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            setEarnings(prev => Math.round((prev + 0.000005) * 100) / 100);
        }, 2000);
        return () => clearInterval(interval);
    }, [user]);

    const handleSetupFaceID = async () => {
        const token = localStorage.getItem('smartinvest_token');
        if (!token) return;

        setFaceIdStatus('setting');

        try {
            // Get registration options
            const optionsRes = await fetch('/api/passkey/register-options', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const optionsData = await optionsRes.json();

            if (!optionsRes.ok) {
                alert(optionsData.error || 'Failed to setup Face ID');
                setFaceIdStatus('none');
                return;
            }

            // Start registration
            const regResponse = await startRegistration({ optionsJSON: optionsData.options });

            // Verify with server
            const verifyRes = await fetch('/api/passkey/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    response: regResponse,
                    challenge: optionsData.challenge,
                }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                alert(verifyData.error || 'Face ID setup failed');
                setFaceIdStatus('none');
                return;
            }

            setFaceIdStatus('done');
            alert('✅ Face ID setup complete! You can now use Face ID to log in.');
        } catch (err) {
            console.error('Face ID setup error:', err);
            alert('Face ID setup cancelled or not supported');
            setFaceIdStatus('none');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('smartinvest_token');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'radial-gradient(at top left, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', background: '#0052ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>s</div>
            </div>
        );
    }

    const balance = user ? user.balance + earnings : 10.67;
    const progressOffset = 150;

    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(at top left, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0f172a' }}>
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
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#0052ff" strokeWidth="12" strokeLinecap="round" strokeDasharray="565.48" strokeDashoffset={progressOffset} style={{ filter: 'drop-shadow(0 0 8px rgba(0, 82, 255, 0.15))' }} />
                    </svg>
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <h2 style={{ color: '#00c853', fontSize: '2rem', fontWeight: 800 }}>+${earnings.toFixed(2)}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Earnings</p>
                    </div>
                </div>

                {/* Promise Pill */}
                <div style={{ background: '#f0f7ff', color: '#0052ff', padding: '12px 20px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    💰 You&apos;re earning $0.50 daily on your ${user?.balance.toFixed(0) || '10'} deposit
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

                {/* Face ID Setup */}
                <button onClick={handleSetupFaceID} disabled={faceIdStatus === 'setting'} style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, background: faceIdStatus === 'done' ? '#059669' : '#f0f7ff', color: faceIdStatus === 'done' ? 'white' : '#0052ff', border: 'none', cursor: 'pointer', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                        <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"></path>
                    </svg>
                    {faceIdStatus === 'none' && 'Setup Face ID'}
                    {faceIdStatus === 'setting' && 'Setting up...'}
                    {faceIdStatus === 'done' && '✓ Face ID Enabled'}
                </button>

                {/* Growth Banner */}
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#00c853', borderRadius: '50%' }} />
                    Your money is growing automatically
                </div>

                {/* Buttons */}
                <Link href="/deposit" style={{ display: 'block', width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, background: '#0052ff', color: 'white', textAlign: 'center', textDecoration: 'none', marginBottom: '12px' }}>Deposit More</Link>
                <button style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, background: 'white', color: '#0f172a', border: '1.5px solid #e2e8f0', cursor: 'pointer', marginBottom: '12px' }}>Withdraw Earnings</button>

                {/* Footer */}
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '15px' }}>Your funds are protected and insured</p>
                <button onClick={handleLogout} style={{ display: 'block', margin: '15px auto 0', background: 'transparent', border: 'none', color: '#0052ff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Log out</button>
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
