"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = 'email' | 'code' | 'success';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send code');
                return;
            }

            setStep('code');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (code.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to reset password');
                return;
            }

            setStep('success');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                alert('New code sent!');
            }
        } catch {
            setError('Failed to resend code');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        if (step === 'email') {
            return (
                <>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Forgot password?</h1>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Enter your email and we&apos;ll send you a reset code.</p>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <form onSubmit={handleSendCode}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                            {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}

                            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}>
                                {isLoading ? "Sending..." : "Send Reset Code"}
                            </button>
                        </form>
                    </div>
                </>
            );
        }

        if (step === 'code') {
            return (
                <>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Reset your password</h1>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>We sent a code to <strong style={{ color: '#1e293b' }}>{email}</strong></p>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <form onSubmit={handleResetPassword}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Reset Code</label>
                            <input type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '6px', fontWeight: 700 }} />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />

                            {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}

                            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}>
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                <button type="button" onClick={() => setStep('email')} style={{ background: 'transparent', color: '#64748b', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                                <button type="button" onClick={resendCode} disabled={isLoading} style={{ background: 'transparent', color: '#0052ff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Resend code</button>
                            </div>
                        </form>
                    </div>
                </>
            );
        }

        return (
            <>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✓</div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Password reset!</h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Your password has been reset successfully.</p>
                <button onClick={() => router.push('/login')} style={{ padding: '14px 40px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}>
                    Back to Login
                </button>
            </>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
            <div style={{ width: '90%', maxWidth: '380px', textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '26px', height: '26px', background: '#0052ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.85rem' }}>S</div>
                    smart<span style={{ color: '#0052ff' }}>Invest</span>
                </div>

                {renderStep()}

                {step !== 'success' && (
                    <p style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                        Remember your password?{" "}
                        <Link href="/login" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
