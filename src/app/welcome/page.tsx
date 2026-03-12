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

                {/* Early adopter badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #0052ff15, #7c3aed15)', border: '1px solid #0052ff30', borderRadius: '999px', padding: '5px 14px', marginBottom: '20px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#0052ff" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0052ff', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Early Adopter</span>
                </div>

                {/* Main card */}
                <div style={{ background: 'white', padding: '32px 24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,82,255,0.08)', border: '1px solid #e2e8f0' }}>

                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                        You&apos;re on the Waitlist!
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
                        Thank you for joining SmartInvest early. We&apos;re preparing your account and will let you know the moment it&apos;s ready.
                    </p>

                    {email && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', marginBottom: '20px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{email}</span>
                        </div>
                    )}

                    {/* $20 balance card */}
                    <div style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1f6e 100%)', borderRadius: '16px', padding: '20px', marginBottom: '20px', color: 'white', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '-30px', right: '30px', width: '70px', height: '70px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.6, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Welcome Bonus</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Credited to your account</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 10px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px' }}>PENDING</div>
                        </div>
                        <p style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1px', margin: '0 0 2px', fontVariantNumeric: 'tabular-nums' }}>$20.00</p>
                        <p style={{ fontSize: '0.72rem', opacity: 0.55, margin: 0 }}>United States Dollar · USD</p>
                    </div>

                    {/* Info rows */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ width: '34px', height: '34px', minWidth: '34px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>Dashboard access coming soon</p>
                                <p style={{ fontSize: '0.73rem', color: '#64748b', margin: 0 }}>We&apos;ll notify you the moment your account is activated.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px' }}>
                            <div style={{ width: '34px', height: '34px', minWidth: '34px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>All updates via email</p>
                                <p style={{ fontSize: '0.73rem', color: '#64748b', margin: 0 }}>We&apos;ll communicate exclusively through your registered email.</p>
                            </div>
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
