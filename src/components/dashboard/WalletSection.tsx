"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface WalletSectionProps {
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    profilePhone?: string;
}

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    reference: string | null;
    createdAt: string;
}

export function WalletSection({ balance, setBalance, profilePhone }: WalletSectionProps) {
    // Deposit form state
    const [depositPhone, setDepositPhone] = useState("");
    const [depositAmount, setDepositAmount] = useState("");
    const [depositLoading, setDepositLoading] = useState(false);
    const [depositError, setDepositError] = useState("");
    const [depositSuccess, setDepositSuccess] = useState(false);

    // Withdrawal form state
    const [withdrawPhone, setWithdrawPhone] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawError, setWithdrawError] = useState("");
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);
    const [walletTab, setWalletTab] = useState<"deposit" | "withdraw">("deposit");

    // Transaction history state
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Auto-populate withdraw phone from profile or deposit phone
    useEffect(() => {
        if (walletTab === "withdraw" && !withdrawPhone) {
            if (profilePhone) {
                setWithdrawPhone(profilePhone);
            } else if (depositPhone) {
                setWithdrawPhone(depositPhone);
            }
        }
    }, [walletTab, profilePhone, depositPhone, withdrawPhone]);

    // Auto-populate deposit phone from profile
    useEffect(() => {
        if (!depositPhone && profilePhone) {
            setDepositPhone(profilePhone);
        }
    }, [profilePhone, depositPhone]);

    return (
        <>
            <div
                style={{
                    background: "#effef4",
                    border: "1px solid #10b981",
                    padding: "20px",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "25px",
                }}
            >
                <div
                    style={{
                        background: "#10b981",
                        color: "white",
                        fontWeight: 900,
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                    }}
                >
                    M
                </div>
                <div>
                    <h4 style={{ color: "#059669", fontSize: "1rem" }}>M-Pesa Connected</h4>
                    <p style={{ fontSize: "0.8rem", color: "#059669" }}>Instant Deposit & Withdrawal</p>
                </div>
            </div>

            <Card padding="lg" style={{ borderRadius: "24px", marginBottom: "25px" }}>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "8px" }}>Wallet Balance</p>
                <h2 style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                    Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
            </Card>

            {/* Deposit/Withdraw Tab Switcher */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <Button
                    type="button"
                    className="flex-1"
                    variant={walletTab === "deposit" ? "primary" : "secondary"}
                    onClick={() => setWalletTab("deposit")}
                >
                    💰 Deposit
                </Button>
                <Button
                    type="button"
                    className="flex-1"
                    variant={walletTab === "withdraw" ? "primary" : "secondary"}
                    onClick={() => setWalletTab("withdraw")}
                >
                    💸 Withdraw
                </Button>
            </div>

            {/* Deposit Form */}
            {walletTab === "deposit" && (
                <>
                    {depositSuccess ? (
                        <Card padding="lg" className="text-center" style={{ borderRadius: "24px" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📱</div>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px" }}>Check your phone!</h3>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "20px" }}>
                                We have sent an M-Pesa prompt to <strong>{depositPhone}</strong>. Enter your PIN to complete the deposit of{" "}
                                <strong>Ksh {depositAmount}</strong>.
                            </p>
                            <Button
                                onClick={() => {
                                    setDepositSuccess(false);
                                    setDepositPhone("");
                                    setDepositAmount("");
                                }}
                                size="lg"
                            >
                                Make Another Deposit
                            </Button>
                        </Card>
                    ) : (
                        <Card padding="lg" style={{ borderRadius: "24px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "20px" }}>Deposit via M-Pesa</h3>

                            <div className="mb-4">
                                <label htmlFor="deposit-phone" className="mb-1 block text-xs font-semibold text-slate-700">
                                    M-Pesa Phone Number
                                </label>
                                <div className="flex h-12 w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#0052ff] focus-within:ring-offset-2">
                                    <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                                        Phone
                                    </div>
                                    <input
                                        id="deposit-phone"
                                        type="tel"
                                        value={depositPhone}
                                        onChange={(e) => setDepositPhone(e.target.value.replace(/\D/g, "").slice(0, 12))}
                                        placeholder="07XXXXXXXX"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        className="min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] text-slate-900 placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">Use your Safaricom number (e.g. 07XXXXXXXX).</p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="deposit-amount" className="mb-1 block text-xs font-semibold text-slate-700">
                                    Amount
                                </label>
                                <div className="flex h-12 w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#0052ff] focus-within:ring-offset-2">
                                    <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                                        Ksh
                                    </div>
                                    <input
                                        id="deposit-amount"
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="Minimum 10"
                                        min={10}
                                        step={1}
                                        inputMode="numeric"
                                        className="min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] text-slate-900 placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Quick amounts */}
                            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                                {[100, 500, 1000, 5000].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setDepositAmount(amt.toString())}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            background: depositAmount === amt.toString() ? "#0052ff" : "#f1f5f9",
                                            color: depositAmount === amt.toString() ? "white" : "#64748b",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052ff] focus-visible:ring-offset-2"
                                    >
                                        {amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <div
                                style={{
                                    background: "#f0f7ff",
                                    padding: "12px 14px",
                                    borderRadius: "12px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <span style={{ fontSize: "1rem" }}>🔒</span>
                                <span style={{ fontSize: "0.8rem", color: "#0052ff", fontWeight: 600 }}>
                                    Secure M-Pesa payment. You will receive an STK push.
                                </span>
                            </div>

                            {depositError && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "15px" }}>{depositError}</p>}

                            <Button
                                type="button"
                                onClick={async () => {
                                    setDepositError("");
                                    const amountNum = parseInt(depositAmount);
                                    if (amountNum < 10) {
                                        setDepositError("Minimum deposit is Ksh 10");
                                        return;
                                    }
                                    if (depositPhone.length < 9) {
                                        setDepositError("Please enter a valid phone number");
                                        return;
                                    }

                                    setDepositLoading(true);
                                    try {
                                        const token = localStorage.getItem("smartinvest_token");
                                        const res = await fetch("/api/mpesa/initiate", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: token ? `Bearer ${token}` : "",
                                            },
                                            body: JSON.stringify({ phone: depositPhone, amount: amountNum }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok) {
                                            setDepositError(data.error || "Failed to send payment request");
                                            return;
                                        }
                                        setDepositSuccess(true);
                                    } catch {
                                        setDepositError("Something went wrong. Please try again.");
                                    } finally {
                                        setDepositLoading(false);
                                    }
                                }}
                                isLoading={depositLoading}
                                size="lg"
                                className="w-full"
                            >
                                {depositLoading
                                    ? "Sending request..."
                                    : `Deposit ${depositAmount ? `Ksh ${parseInt(depositAmount).toLocaleString()}` : ""}`}
                            </Button>
                        </Card>
                    )}
                </>
            )}

            {/* Withdraw Form */}
            {walletTab === "withdraw" && (
                <>
                    {withdrawSuccess ? (
                        <Card padding="lg" className="text-center" style={{ borderRadius: "24px" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✅</div>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px", color: "#059669" }}>
                                Withdrawal Successful!
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "20px" }}>
                                <strong>Ksh {withdrawAmount}</strong> has been sent to <strong>{withdrawPhone}</strong>. You should receive it shortly.
                            </p>
                            <Button
                                onClick={() => {
                                    setWithdrawSuccess(false);
                                    setWithdrawAmount("");
                                }}
                                size="lg"
                            >
                                Make Another Withdrawal
                            </Button>
                        </Card>
                    ) : (
                        <Card padding="lg" style={{ borderRadius: "24px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "20px" }}>Withdraw to M-Pesa</h3>

                            <div className="mb-4">
                                <label htmlFor="withdraw-phone" className="mb-1 block text-xs font-semibold text-slate-700">
                                    M-Pesa Phone Number
                                </label>
                                <div className="flex h-12 w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#0052ff] focus-within:ring-offset-2">
                                    <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                                        Phone
                                    </div>
                                    <input
                                        id="withdraw-phone"
                                        type="tel"
                                        value={withdrawPhone}
                                        onChange={(e) => setWithdrawPhone(e.target.value.replace(/\D/g, "").slice(0, 12))}
                                        placeholder="07XXXXXXXX"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        className="min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] text-slate-900 placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="withdraw-amount" className="mb-1 block text-xs font-semibold text-slate-700">
                                    Amount
                                </label>
                                <div className="flex h-12 w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#0052ff] focus-within:ring-offset-2">
                                    <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                                        Ksh
                                    </div>
                                    <input
                                        id="withdraw-amount"
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Minimum 50"
                                        min={50}
                                        step={1}
                                        inputMode="numeric"
                                        className="min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] text-slate-900 placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Quick amounts */}
                            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                                {[100, 500, 1000, 5000].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setWithdrawAmount(amt.toString())}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            background: withdrawAmount === amt.toString() ? "#0052ff" : "#f1f5f9",
                                            color: withdrawAmount === amt.toString() ? "white" : "#64748b",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052ff] focus-visible:ring-offset-2"
                                    >
                                        {amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {/* Available balance info */}
                            <div
                                style={{
                                    background: "#fef3c7",
                                    padding: "12px 14px",
                                    borderRadius: "12px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <span style={{ fontSize: "1rem" }}>💰</span>
                                <span style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: 600 }}>
                                    Available: Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {withdrawError && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "15px" }}>{withdrawError}</p>}

                            <Button
                                type="button"
                                onClick={async () => {
                                    setWithdrawError("");
                                    const amountNum = parseInt(withdrawAmount);
                                    if (amountNum < 50) {
                                        setWithdrawError("Minimum withdrawal is Ksh 50");
                                        return;
                                    }
                                    if (amountNum > balance) {
                                        setWithdrawError("Insufficient balance");
                                        return;
                                    }
                                    if (withdrawPhone.length < 9) {
                                        setWithdrawError("Please enter a valid phone number");
                                        return;
                                    }

                                    setWithdrawLoading(true);
                                    try {
                                        // Simulate withdrawal (in production, call actual API)
                                        await new Promise((resolve) => setTimeout(resolve, 2000));
                                        setBalance((prev) => prev - amountNum);
                                        setWithdrawSuccess(true);
                                    } catch {
                                        setWithdrawError("Something went wrong. Please try again.");
                                    } finally {
                                        setWithdrawLoading(false);
                                    }
                                }}
                                isLoading={withdrawLoading}
                                size="lg"
                                className="w-full"
                            >
                                {withdrawLoading
                                    ? "Processing..."
                                    : `Withdraw ${withdrawAmount ? `Ksh ${parseInt(withdrawAmount).toLocaleString()}` : ""}`}
                            </Button>
                        </Card>
                    )}
                </>
            )}

            {/* Transaction History */}
            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "24px",
                    border: "1px solid #e2e8f0",
                    marginTop: "25px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Transaction History</h3>
                    <button
                        onClick={async () => {
                            const token = localStorage.getItem("smartinvest_token");
                            if (!token) return;
                            setLoadingTransactions(true);
                            try {
                                const res = await fetch("/api/transactions", {
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                const data = await res.json();
                                if (res.ok) setTransactions(data.transactions || []);
                            } catch {
                                /* ignore */
                            }
                            setLoadingTransactions(false);
                        }}
                        style={{
                            padding: "8px 16px",
                            background: "#f1f5f9",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052ff] focus-visible:ring-offset-2"
                    >
                        {loadingTransactions ? "Loading..." : "↻ Refresh"}
                    </button>
                </div>

                {transactions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📋</div>
                        <p>No transactions yet</p>
                        <p style={{ fontSize: "0.8rem" }}>Your deposits and withdrawals will appear here</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "14px 0",
                                    borderBottom: "1px solid #f1f5f9",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "10px",
                                            background: tx.type === "deposit" ? "#dcfce7" : "#fef3c7",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1.2rem",
                                        }}
                                    >
                                        {tx.type === "deposit" ? "↓" : "↑"}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, textTransform: "capitalize" }}>{tx.type}</p>
                                        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                            {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontWeight: 800, color: tx.type === "deposit" ? "#059669" : "#f59e0b" }}>
                                        {tx.type === "deposit" ? "+" : "-"}Ksh {tx.amount.toLocaleString()}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "0.7rem",
                                            padding: "2px 8px",
                                            borderRadius: "10px",
                                            background:
                                                tx.status === "completed"
                                                    ? "#dcfce7"
                                                    : tx.status === "pending"
                                                      ? "#fef3c7"
                                                      : "#fee2e2",
                                            color:
                                                tx.status === "completed"
                                                    ? "#059669"
                                                    : tx.status === "pending"
                                                      ? "#b45309"
                                                      : "#dc2626",
                                            textTransform: "capitalize",
                                            display: "inline-block",
                                        }}
                                    >
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
