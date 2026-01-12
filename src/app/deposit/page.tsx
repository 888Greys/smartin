"use client";

import { useState } from "react";
import Link from "next/link";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
            setError('Minimum deposit is Ksh 10');
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
            <AuthLayout
                title="Check your phone!"
                subtitle={
                    <>
                        We&apos;ve sent an M-Pesa prompt to <strong>{phone}</strong>. Enter your PIN to
                        complete the deposit of <strong>Ksh {amount}</strong>.
                    </>
                }
                footer={
                    <Link href="/dashboard" className="text-[0.8rem] text-slate-500 hover:underline">
                        ← Back to Dashboard
                    </Link>
                }
            >
                <div className="text-5xl">📱</div>
                <div className="mt-5 rounded-xl bg-[#f0f5ff] px-4 py-3">
                    <p className="text-[0.75rem] font-semibold text-[#0052ff]">
                        💡 Didn&apos;t receive the prompt? Wait a few seconds or try again.
                    </p>
                </div>
                <div className="mt-4">
                    <Button
                        onClick={() => {
                            setSuccess(false);
                            setPhone('');
                            setAmount('');
                        }}
                        className="w-full"
                    >
                        Make Another Deposit
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Deposit Funds"
            subtitle="Add money to your smartInvest account via M-Pesa."
            footer={
                <Link href="/dashboard" className="text-[0.75rem] text-slate-500 hover:underline">
                    ← Back to Dashboard
                </Link>
            }
        >
            <Card className="text-left" padding="md">
                <form onSubmit={handleDeposit} className="space-y-3">
                    <div>
                        <label htmlFor="dep-phone" className="mb-1.5 block text-[0.8rem] font-semibold">
                            M-Pesa Phone Number
                        </label>
                        <Input
                            id="dep-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
                            placeholder="07XXXXXXXX"
                            required
                            inputMode="numeric"
                        />
                    </div>

                    <div>
                        <label htmlFor="dep-amt" className="mb-1.5 block text-[0.8rem] font-semibold">
                            Amount (Ksh)
                        </label>
                        <Input
                            id="dep-amt"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Minimum Ksh 10"
                            min={10}
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        {[100, 500, 1000, 5000].map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => setAmount(amt.toString())}
                                className={
                                    "flex-1 rounded-lg px-2 py-2 text-[0.75rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052ff] focus-visible:ring-offset-2 " +
                                    (amount === amt.toString()
                                        ? "bg-[#0052ff] text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                                }
                            >
                                {amt}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-[#f0f5ff] px-3 py-2">
                        <span className="text-base">🔒</span>
                        <span className="text-[0.75rem] font-semibold leading-snug text-[#0052ff]">
                            Secure M-Pesa payment. You&apos;ll receive an STK push.
                        </span>
                    </div>

                    {error ? <p className="text-[0.75rem] text-red-600">{error}</p> : null}

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        {isLoading ? "Sending request..." : `Deposit${amount ? ` Ksh ${amount}` : ""}`}
                    </Button>
                </form>
            </Card>
        </AuthLayout>
    );
}
