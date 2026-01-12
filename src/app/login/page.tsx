"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startAuthentication } from "@simplewebauthn/browser";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
            localStorage.setItem('smartinvest_token', 'dev-bypass-token');
            router.push('/dashboard');
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
            router.push('/dashboard');
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
            router.push('/dashboard');
        } catch (err) {
            console.error('Biometrics error:', err);
            setError('Biometrics not available or cancelled');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isHydrated) {
        return (
            <AuthLayout>
                <div className="flex justify-center">
                    <div className="h-6 w-6 rounded-md bg-[#0052ff] text-[0.75rem] font-black text-white grid place-items-center">
                        S
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Check your earnings and manage your money."
            footer={
                <>
                    <p className="text-[0.75rem] text-slate-500">
                        New to smartInvest?{" "}
                        <Link className="font-semibold text-[#0052ff] hover:underline" href="/register">
                            Create account
                        </Link>
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-2 text-[0.65rem] font-semibold text-emerald-600">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Secure, encrypted login
                    </div>
                </>
            }
        >
            <Card className="text-left" padding="md">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-1.5 block text-[0.8rem] font-semibold"
                        >
                            Email Address
                        </label>
                        <Input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="login-password"
                            className="mb-1.5 block text-[0.8rem] font-semibold"
                        >
                            Password
                        </label>
                        <Input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                        <div className="mt-1.5 text-right">
                            <Link
                                href="/forgot-password"
                                className="text-[0.75rem] font-semibold text-[#0052ff] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {error ? <p className="text-[0.75rem] text-red-600">{error}</p> : null}

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Log In
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleBiometrics}
                        disabled={isLoading}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            <circle cx="12" cy="10" r="3" />
                            <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" />
                        </svg>
                        Use Biometrics
                    </Button>
                </form>
            </Card>
        </AuthLayout>
    );
}
