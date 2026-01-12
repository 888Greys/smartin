"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type Step = 'register' | 'otp';

interface RegistrationState {
    step: Step;
    email: string;
    password: string;
    referralCode: string;
    timestamp: number;
}

function RegisterContent() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<Step>('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [showReferralInput, setShowReferralInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Check if already logged in
        const token = localStorage.getItem('smartinvest_token');
        if (token) {
            router.push('/dashboard');
            return;
        }

        // Check for referral code in URL
        const refCode = searchParams.get('ref');
        if (refCode) {
            setReferralCode(refCode);
            setShowReferralInput(true);
        }

        const saved = localStorage.getItem('smartinvest_registration');
        if (saved) {
            try {
                const state: RegistrationState = JSON.parse(saved);
                if (Date.now() - state.timestamp < 10 * 60 * 1000) {
                    setStep(state.step);
                    setEmail(state.email);
                    setPassword(state.password);
                    if (state.referralCode) setReferralCode(state.referralCode);
                } else {
                    localStorage.removeItem('smartinvest_registration');
                }
            } catch {
                localStorage.removeItem('smartinvest_registration');
            }
        }
        setIsHydrated(true);
    }, [router, searchParams]);

    useEffect(() => {
        if (step === 'otp' && email && password) {
            const state: RegistrationState = { step, email, password, referralCode, timestamp: Date.now() };
            localStorage.setItem('smartinvest_registration', JSON.stringify(state));
        }
    }, [step, email, password, referralCode]);

    const clearSavedState = () => {
        localStorage.removeItem('smartinvest_registration');
    };

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
            // Verify OTP
            const otpRes = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const otpData = await otpRes.json();
            if (!otpRes.ok) {
                setError(otpData.error || 'Invalid code');
                return;
            }

            // Create account with referral code
            const registerRes = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, referralCode }),
            });
            const registerData = await registerRes.json();
            if (!registerRes.ok) {
                setError(registerData.error || 'Failed to create account');
                return;
            }

            // Save token and redirect
            localStorage.setItem('smartinvest_token', registerData.token);
            clearSavedState();
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
            } else {
                alert('New code sent!');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        setStep('register');
        setOtp('');
        setError('');
        clearSavedState();
    };

    if (!isHydrated) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/lion.png" alt="SmartInvest" style={{ height: '40px', objectFit: 'contain' }} />
            </div>
        );
    }

    const renderStep = () => {
        if (step === 'register') {
            return (
                <>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                        Grow your $10
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>
                        Join over 10,000 people making a daily profit on their savings.
                    </p>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <form onSubmit={handleRegister}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Your Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. name@mail.com" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Create Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                            {/* Referral Code Input */}
                            {!showReferralInput ? (
                                <button
                                    type="button"
                                    onClick={() => setShowReferralInput(true)}
                                    style={{ background: 'transparent', color: '#0052ff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    🎁 Have a referral code?
                                </button>
                            ) : (
                                <>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Referral Code (optional)</label>
                                    <input
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                        placeholder="Enter referral code"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #10b981', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#f0fdf4' }}
                                    />
                                    {referralCode && (
                                        <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #bbf7d0' }}>
                                            <span style={{ fontSize: '1rem' }}>🎉</span>
                                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, lineHeight: 1.3 }}>You'll get a KES 10 welcome bonus!</span>
                                        </div>
                                    )}
                                </>
                            )}

                            <div style={{ background: '#f0f5ff', padding: '10px 12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1rem' }}>📈</span>
                                <span style={{ fontSize: '0.75rem', color: '#0052ff', fontWeight: 600, lineHeight: 1.3 }}>Deposit $10 today and see your first earnings tomorrow.</span>
                            </div>

                            {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}

                            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}>
                                {isLoading ? "Sending code..." : "Grow my $10"}
                            </button>
                        </form>
                    </div>
                </>
            );
        }

        return (
            <>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>Check your email</h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>We sent a code to <strong style={{ color: '#1e293b' }}>{email}</strong></p>
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <form onSubmit={handleVerifyOTP}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Verification Code</label>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '6px', fontWeight: 700 }} />

                        {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}

                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}>
                            {isLoading ? "Creating account..." : "Verify & Continue"}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                            <button type="button" onClick={goBack} style={{ background: 'transparent', color: '#64748b', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                            <button type="button" onClick={resendOTP} disabled={isLoading} style={{ background: 'transparent', color: '#0052ff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Resend code</button>
                        </div>
                    </form>
                </div>
            </>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
            <div style={{ width: '90%', maxWidth: '380px', textAlign: 'center', padding: '16px' }}>
                <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
                    <Link href="/"><img src="/lion.png" alt="SmartInvest" style={{ height: '60px', objectFit: 'contain', cursor: 'pointer' }} /></Link>
                </div>

                {renderStep()}

                <p style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
                </p>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#059669', fontWeight: 600 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Your money is safe and insured
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/lion.png" alt="SmartInvest" style={{ height: '40px', objectFit: 'contain' }} />
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
