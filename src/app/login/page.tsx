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
                background: 'radial-gradient(circle at top, #f0f5ff 0%, #fdfdfe 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#1e293b',
                padding: '20px'
            }}
        >
            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                padding: '40px 30px',
                borderRadius: '32px',
                boxShadow: '0 10px 40px rgba(0, 82, 255, 0.05)',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
            }}>
                {/* Logo */}
                <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        background: '#0052ff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: '0.9rem'
                    }}>S</div>
                    smart<span style={{ color: '#0052ff' }}>Invest</span>
                </div>

                {/* Headline */}
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
                    Welcome back
                </h1>
                <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '32px' }}>
                    Check your earnings and manage your money.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '8px',
                            color: '#1e293b'
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
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '14px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '8px',
                            color: '#1e293b'
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
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '14px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

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
                            marginTop: '-12px',
                            marginBottom: '25px'
                        }}
                    >
                        Forgot password?
                    </a>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '18px',
                            background: '#0052ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginBottom: '15px',
                            opacity: isSubmitting ? 0.7 : 1
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
                            borderRadius: '14px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '25px'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            <path d="M8 7v7m8-7v7M8 11h8"></path>
                        </svg>
                        Use Face ID
                    </button>
                </form>

                {/* Footer */}
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    New to smartInvest?{" "}
                    <Link href="/register" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 700 }}>
                        Create account
                    </Link>
                </p>

                {/* Security Note */}
                <div style={{
                    marginTop: '30px',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secure, encrypted login
                </div>
            </div>
        </div>
    );
}
