"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;

        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }

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
                    Grow your $10
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    marginBottom: '30px',
                    lineHeight: 1.5
                }}>
                    Join over 10,000 people making a daily profit on their savings.
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
                            Your Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g. name@mail.com"
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
                            Create a Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="At least 8 characters"
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

                        {/* Promise Box */}
                        <div style={{
                            background: '#f0f5ff',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>📈</span>
                            <span style={{
                                fontSize: '0.85rem',
                                color: '#0052ff',
                                fontWeight: 600,
                                lineHeight: 1.4
                            }}>
                                Deposit $10 today and see your first earnings tomorrow.
                            </span>
                        </div>

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
                                opacity: isSubmitting ? 0.8 : 1
                            }}
                        >
                            {isSubmitting ? "One moment..." : "Grow my $10"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: 600 }}>
                        Log in
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Your money is safe and insured
                </div>
            </div>
        </div>
    );
}
