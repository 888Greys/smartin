"use client";

import { useState } from "react";
import Link from "next/link";

export default function DepositPage() {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const amountNum = parseInt(amount);
        if (amountNum < 10) {
            setError('Minimum deposit is KES 10');
            return;
        }

        if (phone.length < 9) {
            setError('Please enter a valid phone number');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/mpesa/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, amount: amountNum }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send payment request');
                return;
            }

            setSuccess(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
                <div style={{ width: '90%', maxWidth: '380px', textAlign: 'center', padding: '16px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📱</div>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Check your phone!</h1>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
                        We&apos;ve sent an M-Pesa prompt to <strong>{phone}</strong>. Enter your PIN to complete the deposit of <strong>KES {amount}</strong>.
                    </p>
                    <div style={{ background: '#f0f5ff', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '0.75rem', color: '#0052ff', fontWeight: 600 }}>
                            💡 Didn&apos;t receive the prompt? Wait a few seconds or try again.
                        </p>
                    </div>
                    <button
                        onClick={() => { setSuccess(false); setPhone(''); setAmount(''); }}
                        style={{ width: '100%', padding: '14px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' }}
                    >
                        Make Another Deposit
                    </button>
                    <Link href="/dashboard" style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textDecoration: 'none' }}>
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
            <div style={{ width: '90%', maxWidth: '380px', textAlign: 'center', padding: '16px' }}>
                {/* Logo */}
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '26px', height: '26px', background: '#0052ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.85rem' }}>S</div>
                    smart<span style={{ color: '#0052ff' }}>Invest</span>
                </div>

                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                    Deposit Funds
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>
                    Add money to your smartInvest account via M-Pesa.
                </p>

                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <form onSubmit={handleDeposit}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                            M-Pesa Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
                            placeholder="07XXXXXXXX"
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        />

                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                            Amount (KES)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Minimum KES 10"
                            min="10"
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        />

                        {/* Quick amounts */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            {[100, 500, 1000, 5000].map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setAmount(amt.toString())}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: amount === amt.toString() ? '#0052ff' : '#f1f5f9',
                                        color: amount === amt.toString() ? 'white' : '#64748b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {amt}
                                </button>
                            ))}
                        </div>

                        <div style={{ background: '#f0f5ff', padding: '10px 12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1rem' }}>🔒</span>
                            <span style={{ fontSize: '0.75rem', color: '#0052ff', fontWeight: 600, lineHeight: 1.3 }}>
                                Secure M-Pesa payment. You&apos;ll receive an STK push.
                            </span>
                        </div>

                        {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ width: '100%', padding: '14px', background: '#059669', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.8 : 1 }}
                        >
                            {isLoading ? "Sending request..." : `Deposit ${amount ? `KES ${amount}` : ''}`}
                        </button>
                    </form>
                </div>

                <Link href="/dashboard" style={{ display: 'block', marginTop: '16px', fontSize: '0.75rem', color: '#64748b', textDecoration: 'none' }}>
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
