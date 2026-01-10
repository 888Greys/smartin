"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
    const [balance, setBalance] = useState(10.00);
    const [earnings, setEarnings] = useState(0.00);

    // Simulate earnings growth
    useEffect(() => {
        const interval = setInterval(() => {
            setEarnings(prev => {
                const newEarnings = prev + 0.01;
                return Math.round(newEarnings * 100) / 100;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const totalBalance = balance + earnings;
    const progressPercent = Math.min((earnings / 0.50) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] to-white p-5">
            <div className="max-w-md mx-auto pt-8">
                {/* Header */}
                <nav className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#0052ff] rounded-lg flex items-center justify-center text-white font-black text-xs">
                            S
                        </div>
                        <span className="text-lg font-extrabold text-[#1e293b]">
                            smart<span className="text-[#0052ff]">Invest</span>
                        </span>
                    </div>
                    <div className="w-2 h-2 bg-[#059669] rounded-full animate-pulse" />
                </nav>

                {/* Portfolio Card */}
                <div className="bg-white p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#e2e8f0] mb-6">
                    <p className="text-sm text-[#64748b] mb-2">Your Balance</p>
                    <h2 className="text-4xl font-extrabold text-[#1e293b] mb-6">
                        ${totalBalance.toFixed(2)}
                    </h2>

                    {/* Progress Ring */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#0052ff"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${progressPercent * 3.14} 314`}
                                    className="transition-all duration-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-[#059669]">+${earnings.toFixed(2)}</span>
                                <span className="text-xs text-[#64748b]">Earnings</span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Earnings Info */}
                    <div className="bg-[#f0f5ff] p-4 rounded-xl flex items-center gap-3">
                        <span className="text-xl">💰</span>
                        <span className="text-sm text-[#0052ff] font-semibold">
                            You&apos;re earning $0.50 daily on your $10 deposit
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0]">
                        <p className="text-xs text-[#64748b] mb-1">Daily Profit</p>
                        <p className="text-xl font-bold text-[#059669]">5.0%</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0]">
                        <p className="text-xs text-[#64748b] mb-1">Status</p>
                        <p className="text-xl font-bold text-[#0052ff]">Active</p>
                    </div>
                </div>

                {/* AI Status */}
                <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#059669] rounded-full animate-pulse" />
                    <span className="text-sm text-[#64748b]">
                        Your money is growing automatically
                    </span>
                </div>

                {/* Deposit Button */}
                <Link href="/deposit" className="block w-full py-4 bg-[#0052ff] text-white rounded-xl text-base font-bold text-center hover:bg-[#0044d6] transition-colors mb-4">
                    Deposit More
                </Link>

                {/* Withdraw Button */}
                <button className="w-full py-4 bg-[#f1f5f9] text-[#1e293b] rounded-xl text-base font-semibold hover:bg-[#e2e8f0] transition-colors mb-6">
                    Withdraw Earnings
                </button>

                {/* Security Footer */}
                <p className="text-center text-xs text-[#94a3b8]">
                    Your funds are protected and insured
                </p>

                {/* Logout Link */}
                <p className="text-center text-sm text-[#64748b] mt-4">
                    <Link href="/login" className="text-[#0052ff] font-semibold hover:underline">
                        Log out
                    </Link>
                </p>
            </div>
        </div>
    );
}
