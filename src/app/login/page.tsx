"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            router.push("/dashboard");
        }, 1200);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#1e293b'
            }}
        >
            <div style={{ width: '90%', maxWidth: '480px', textAlign: 'center', padding: '20px' }}>
                {/* Logo */}
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#0052ff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 900
                    }}>S</div>
                    smart<span style={{ color: '#0052ff' }}>Invest</span>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    marginBottom: '12px',
                    letterSpacing: '-0.5px'
                }}>
                    Welcome back
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    marginBottom: '30px',
                    lineHeight: 1.5
                }}>
                    Check your earnings and manage your money.
                </p>

                {/* Card */}
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    textAlign: 'left'
                }}>
                    <form onSubmit={handleSubmit}>
                        <label style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />

                        <label style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '12px',
                                marginBottom: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />

                        {/* Forgot Password */}
                        <a
                            href="#"
                            style={{
                                display: 'block',
                                textAlign: 'right',
                                fontSize: '0.85rem',
                                color: '#0052ff',
                                textDecoration: 'none',
                                fontWeight: 600,
                                marginBottom: '25px'
                            }}
                        >
                            Forgot password?
                        </a>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: '#0052ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginBottom: '15px',
                                opacity: isSubmitting ? 0.8 : 1
                            }}
                        >
                            {isSubmitting ? "Logging in..." : "Log In"}
                        </button>

                        {/* Face ID Button */}
                        <button
                            type="button"
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#f1f5f9',
                                color: '#1e293b',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                <path d="M8 7v7m8-7v7M8 11h8"></path>
                            </svg>
                            Use Face ID
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
                    New to smartInvest?{" "}
                    <Link href="/register" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>
                        Create account
                    </Link>
                </p>

                {/* Security Badge */}
                <div style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    color: '#059669',
                    fontWeight: 600
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secure, encrypted login
                </div>
            </div>
        </div>
    );
}
