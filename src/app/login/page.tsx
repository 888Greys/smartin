"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { startAuthentication } from "@simplewebauthn/browser";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // DEV MODE BYPASS - auto-login for local development
        // Set NEXT_PUBLIC_DEV_BYPASS=true in .env.local
        const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
        if (DEV_BYPASS) {
            fetch('/api/dev/token', { method: 'POST' })
                .then((r) => r.json())
                .then((data) => {
                    if (data.token) {
                        localStorage.setItem('smartinvest_token', data.token);
                        localStorage.setItem('smartinvest_email', data.user.email);
                    }
                    router.push('/dashboard');
                })
                .catch(() => router.push('/dashboard'));
            return;
        }

        const token = localStorage.getItem('smartinvest_token');
        if (token) {
            router.push('/dashboard');
            return;
        }
        setIsHydrated(true);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            localStorage.setItem('smartinvest_token', data.token);
            localStorage.setItem('smartinvest_email', data.user.email);
            router.push('/welcome');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBiometrics = async () => {
        if (!email) {
            setError('Please enter your email first');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const optionsRes = await fetch('/api/passkey/auth-options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const optionsData = await optionsRes.json();

            if (!optionsRes.ok) {
                setError(optionsData.error || 'Biometrics not available for this account');
                return;
            }

            const authResponse = await startAuthentication({ optionsJSON: optionsData.options });

            const verifyRes = await fetch('/api/passkey/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    response: authResponse,
                    challenge: optionsData.challenge,
                    userId: optionsData.userId,
                }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                setError(verifyData.error || 'Biometrics authentication failed');
                return;
            }

            localStorage.setItem('smartinvest_token', verifyData.token);
            localStorage.setItem('smartinvest_email', email);
            router.push('/welcome');
        } catch (err) {
            console.error('Biometrics error:', err);
            setError('Biometrics not available or cancelled');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isHydrated) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', background: '#0052ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.75rem' }}>S</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
            <div style={{ width: '90%', maxWidth: '380px', textAlign: 'center', padding: '16px' }}>
                <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
                    <Link href="/">
                        <Image src="/lion.png" alt="SmartInvest" width={160} height={60} style={{ height: '60px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }} />
                    </Link>
                </div>

                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>Welcome back</h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>Check your earnings and manage your money.</p>

                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <form onSubmit={handleSubmit}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                        <Link href="/forgot-password" style={{ display: 'block', textAlign: 'right', fontSize: '0.75rem', color: '#0052ff', textDecoration: 'none', fontWeight: 600, marginBottom: '16px' }}>Forgot password?</Link>

                        {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}

                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px', opacity: isLoading ? 0.8 : 1 }}>
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>

                        <button type="button" onClick={handleBiometrics} disabled={isLoading} style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                                <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"></path>
                            </svg>
                            Use Biometrics
                        </button>
                    </form>
                </div>

                <p style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                    New to smartInvest?{" "}
                    <Link href="/register" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
                </p>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secure, encrypted login
                </div>
            </div>
        </div>
    );
}
