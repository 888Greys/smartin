"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = 'register' | 'otp';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send code');
                return;
            }

            setStep('otp');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter the 6-digit code.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Invalid code');
                return;
            }

            // OTP verified - redirect to dashboard
            router.push('/dashboard');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to resend code');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        if (step === 'register') {
            return (
                <>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
                        Grow your $10
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '30px', lineHeight: 1.5 }}>
                        Join over 10,000 people making a daily profit on their savings.
                    </p>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <form onSubmit={handleRegister}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                                Your Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. name@mail.com"
                                required
                                style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '20px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />

                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                                Create Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                required
                                style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '20px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />

                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                required
                                style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '20px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />

                            <div style={{ background: '#f0f5ff', padding: '15px', borderRadius: '12px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '1.2rem' }}>📈</span>
                                <span style={{ fontSize: '0.85rem', color: '#0052ff', fontWeight: 600, lineHeight: 1.4 }}>
                                    Deposit $10 today and see your first earnings tomorrow.
                                </span>
                            </div>

                            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '15px' }}>{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ width: '100%', padding: '18px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}
                            >
                                {isLoading ? "Sending code..." : "Grow my $10"}
                            </button>
                        </form>
                    </div>
                </>
            );
        }

        // OTP verification step
        return (
            <>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
                    Check your email
                </h1>
                <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '30px', lineHeight: 1.5 }}>
                    We sent a code to <strong style={{ color: '#1e293b' }}>{email}</strong>
                </p>
                <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <form onSubmit={handleVerifyOTP}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit code"
                            required
                            style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '20px', fontSize: '1.5rem', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '8px', fontWeight: 700 }}
                        />

                        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '15px' }}>{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ width: '100%', padding: '18px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}
                        >
                            {isLoading ? "Verifying..." : "Verify & Continue"}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                            <button
                                type="button"
                                onClick={() => { setStep('register'); setOtp(''); setError(''); }}
                                style={{ background: 'transparent', color: '#64748b', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={resendOTP}
                                disabled={isLoading}
                                style={{ background: 'transparent', color: '#0052ff', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Resend code
                            </button>
                        </div>
                    </form>
                </div>
            </>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
            <div style={{ width: '90%', maxWidth: '480px', textAlign: 'center', padding: '20px' }}>
                {/* Logo */}
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#0052ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>S</div>
                    smart<span style={{ color: '#0052ff' }}>Invest</span>
                </div>

                {renderStep()}

                {/* Footer */}
                <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>
                        Log in
                    </Link>
                </p>

                {/* Security Badge */}
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Your money is safe and insured
                </div>
            </div>
        </div>
    );
}
