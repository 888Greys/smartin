"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
    const [showReferralInput, setShowReferralInput] = useState(true);
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
            <AuthLayout>
                <div className="flex justify-center">
                    <img src="/lion.png" alt="SmartInvest" className="h-10 w-auto object-contain opacity-80" />
                </div>
            </AuthLayout>
        );
    }

    const renderStep = () => {
        if (step === 'register') {
            return (
                <>
                    <h1 className="text-[1.4rem] font-extrabold tracking-[-0.3px]">Grow your Ksh 200</h1>
                    <p className="mt-2 text-[0.85rem] leading-snug text-slate-500">
                        Join over 10,000 people making a daily profit on their savings.
                    </p>

                    <Card className="mt-5 text-left" padding="md">
                        <form onSubmit={handleRegister} className="space-y-3">
                            <div>
                                <label htmlFor="reg-email" className="mb-1.5 block text-[0.8rem] font-semibold">
                                    Your Email
                                </label>
                                <Input
                                    id="reg-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. name@mail.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="reg-password"
                                    className="mb-1.5 block text-[0.8rem] font-semibold"
                                >
                                    Create Password
                                </label>
                                <Input
                                    id="reg-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="reg-confirm"
                                    className="mb-1.5 block text-[0.8rem] font-semibold"
                                >
                                    Confirm Password
                                </label>
                                <Input
                                    id="reg-confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="reg-ref"
                                    className="mb-1.5 block text-[0.8rem] font-semibold"
                                >
                                    🎁 Referral Code (optional)
                                </label>
                                <Input
                                    id="reg-ref"
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    placeholder="Enter referral code"
                                    className="border-emerald-400 bg-emerald-50"
                                />
                                {referralCode ? (
                                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                                        <span className="text-base">🎉</span>
                                        <span className="text-[0.75rem] font-semibold leading-snug text-emerald-700">
                                            You'll get a Ksh 10 welcome bonus!
                                        </span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-[#f0f5ff] px-3 py-2">
                                <span className="text-base">📈</span>
                                <span className="text-[0.75rem] font-semibold leading-snug text-[#0052ff]">
                                    Deposit Ksh 200 today and see your first earnings tomorrow.
                                </span>
                            </div>

                            {error ? <p className="text-[0.75rem] text-red-600">{error}</p> : null}

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Grow my Ksh 200
                            </Button>
                        </form>
                    </Card>
                </>
            );
        }

        return (
            <>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.3px]">Check your email</h1>
                <p className="mt-2 text-[0.85rem] leading-snug text-slate-500">
                    We sent a code to <strong className="text-slate-800">{email}</strong>
                </p>

                <Card className="mt-5 text-left" padding="md">
                    <form onSubmit={handleVerifyOTP} className="space-y-3">
                        <div>
                            <label htmlFor="reg-otp" className="mb-1.5 block text-[0.8rem] font-semibold">
                                Verification Code
                            </label>
                            <Input
                                id="reg-otp"
                                inputMode="numeric"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit code"
                                required
                                className="text-center text-[1.2rem] font-bold tracking-[0.4em]"
                            />
                        </div>

                        {error ? <p className="text-[0.75rem] text-red-600">{error}</p> : null}

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Verify & Continue
                        </Button>

                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                onClick={goBack}
                                className="text-[0.75rem] font-semibold text-slate-500 hover:text-slate-700"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={resendOTP}
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
    };

    return (
        <AuthLayout
            footer={
                <>
                    <p className="text-[0.75rem] text-slate-500">
                        Already have an account?{" "}
                        <Link className="font-semibold text-[#0052ff] hover:underline" href="/login">
                            Log in
                        </Link>
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-2 text-[0.65rem] font-semibold text-emerald-600">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Your money is safe and insured
                    </div>
                </>
            }
        >
            {renderStep()}
        </AuthLayout>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <AuthLayout>
                <div className="flex justify-center">
                    <img src="/lion.png" alt="SmartInvest" className="h-10 w-auto object-contain opacity-80" />
                </div>
            </AuthLayout>
        }>
            <RegisterContent />
        </Suspense>
    );
}
