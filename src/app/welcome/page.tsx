"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Dev bypass: skip holding page and go straight to dashboard
        if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true') {
            router.push('/dashboard');
            return;
        }

        const token = localStorage.getItem('smartinvest_token');
        if (!token) {
            router.push('/login');
            return;
        }
        const storedEmail = localStorage.getItem('smartinvest_email') || '';
        setEmail(storedEmail);
        setIsHydrated(true);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('smartinvest_token');
        localStorage.removeItem('smartinvest_email');
        router.push('/login');
    };

    if (!isHydrated) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', background: '#0052ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.75rem' }}>S</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b', padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>

                {/* Logo */}
                <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
                    <Image src="/lion.png" alt="SmartInvest" width={160} height={60} style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
                </div>

                {/* Main card */}
                <div style={{ background: 'white', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,82,255,0.08)', border: '1px solid #e2e8f0' }}>

                    {/* Success icon */}
                    <div style={{ width: '68px', height: '68px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>

                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.3px' }}>
                        Welcome to SmartInvest!
                    </h1>

                    {email && (
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>{email}</p>
                    )}

                    {/* KSh 200 badge */}
                    <div style={{ background: 'linear-gradient(135deg, #0052ff 0%, #0041cc 100%)', borderRadius: '14px', padding: '18px 20px', marginBottom: '20px', color: 'white', textAlign: 'left' }}>
                        <p style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Balance</p>
                        <p style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 4px' }}>KSh 200.00</p>
                        <p style={{ fontSize: '0.78rem', opacity: 0.85, margin: 0 }}>Your account has been loaded with a welcome bonus</p>
                    </div>

                    {/* Message */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div style={{ width: '28px', height: '28px', minWidth: '28px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.5 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.07 6.07l.86-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                                We will <strong>notify you</strong> when you can access your dashboard.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ width: '28px', height: '28px', minWidth: '28px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                                We will communicate via your <strong>email address</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Sign out */}
                    <button
                        onClick={handleLogout}
                        style={{ width: '100%', padding: '13px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Sign Out
                    </button>
                </div>

                {/* Security note */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secured & encrypted
                </div>
            </div>
        </div>
    );
}
