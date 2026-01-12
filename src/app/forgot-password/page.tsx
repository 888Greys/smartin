"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
                    <h1 className="text-[1.4rem] font-extrabold tracking-[-0.3px]">Forgot password?</h1>
                    <p className="mt-2 text-[0.85rem] leading-snug text-slate-500">
                        Enter your email and we&apos;ll send you a reset code.
                    </p>

                    <Card className="mt-5 text-left" padding="md">
                        <form onSubmit={handleSendCode} className="space-y-3">
                            <div>
                                <label htmlFor="fp-email" className="mb-1.5 block text-[0.8rem] font-semibold">
                                    Email Address
                                </label>
                                <Input
                                    id="fp-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {error ? <p className="text-[0.75rem] text-red-600">{error}</p> : null}

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Send Reset Code
                            </Button>
                        </form>
                    </Card>
                </>
            );
        }

        if (step === 'code') {
            return (
                <>
                    <h1 className="text-[1.4rem] font-extrabold tracking-[-0.3px]">Reset your password</h1>
                    <p className="mt-2 text-[0.85rem] leading-snug text-slate-500">
                        We sent a code to <strong className="text-slate-800">{email}</strong>
                    </p>

                    <Card className="mt-5 text-left" padding="md">
                        <form onSubmit={handleResetPassword} className="space-y-3">
                            <div>
                                <label htmlFor="fp-code" className="mb-1.5 block text-[0.8rem] font-semibold">
                                    Reset Code
                                </label>
                                <Input
                                    id="fp-code"
                                    inputMode="numeric"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code"
                                    required
                                    className="text-center text-[1.2rem] font-bold tracking-[0.4em]"
                                />
                            </div>

                            <div>
                                <label htmlFor="fp-new" className="mb-1.5 block text-[0.8rem] font-semibold">
                                    New Password
                                </label>
                                <Input
                                    id="fp-new"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label htmlFor="fp-confirm" className="mb-1.5 block text-[0.8rem] font-semibold">
                                    Confirm Password
                                </label>
                                <Input
                                    id="fp-confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            {error ? <p className="text-[0.75rem] text-red-600">{error}</p> : null}

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Reset Password
                            </Button>

                            <div className="flex items-center justify-between pt-1">
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="text-[0.75rem] font-semibold text-slate-500 hover:text-slate-700"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={resendCode}
                                    disabled={isLoading}
                                    className="text-[0.75rem] font-semibold text-[#0052ff] hover:underline disabled:opacity-60"
                                >
                                    Resend code
                                </button>
                            </div>
                        </form>
                    </Card>
                </>
            );
        }

        return (
            <>
                <div className="text-5xl">✓</div>
                <h1 className="mt-4 text-[1.4rem] font-extrabold tracking-[-0.3px]">Password reset!</h1>
                <p className="mt-2 text-[0.85rem] text-slate-500">Your password has been reset successfully.</p>
                <div className="mt-5">
                    <Button onClick={() => router.push('/login')} className="w-full">
                        Back to Login
                    </Button>
                </div>
            </>
        );
    };

    return (
        <AuthLayout
            footer={
                step !== 'success' ? (
                    <p className="text-[0.75rem] text-slate-500">
                        Remember your password?{" "}
                        <Link className="font-semibold text-[#0052ff] hover:underline" href="/login">
                            Log in
                        </Link>
                    </p>
                ) : null
            }
        >
            {renderStep()}
        </AuthLayout>
    );
}
