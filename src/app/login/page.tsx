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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
            <div style={{ width: '90%', maxWidth: '380px', textAlign: 'center', padding: '16px' }}>
                {/* Logo */}
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '26px', height: '26px', background: '#0052ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.85rem' }}>S</div>
                    smart<span style={{ color: '#0052ff' }}>Invest</span>
                </div>

                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                    Welcome back
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>
                    Check your earnings and manage your money.
                </p>

                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <form onSubmit={handleSubmit}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        />

                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        />

                        <a href="#" style={{ display: 'block', textAlign: 'right', fontSize: '0.75rem', color: '#0052ff', textDecoration: 'none', fontWeight: 600, marginBottom: '16px' }}>
                            Forgot password?
                        </a>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px', opacity: isSubmitting ? 0.8 : 1 }}
                        >
                            {isSubmitting ? "Logging in..." : "Log In"}
                        </button>

                        <button
                            type="button"
                            style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                <path d="M8 7v7m8-7v7M8 11h8"></path>
                            </svg>
                            Use Face ID
                        </button>
                    </form>
                </div>

                <p style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                    New to smartInvest?{" "}
                    <Link href="/register" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>
                        Create account
                    </Link>
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
