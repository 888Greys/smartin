"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    id: string;
    email: string;
    balance: number;
    totalEarnings: number;
    hasBiometrics?: boolean;
}

type Section = 'home' | 'market' | 'investments' | 'wallet' | 'profile';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [activeSection, setActiveSection] = useState<Section>('home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [toggleY, setToggleY] = useState(50); // percentage from top
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            // DEMO MODE - Remove this block for production
            const DEMO_MODE = true;
            if (DEMO_MODE) {
                setUser({
                    id: 'demo123',
                    email: 'demo@smartinvest.com',
                    balance: 5000,
                    totalEarnings: 250,
                });
                setBalance(5000);
                setIsLoading(false);
                return;
            }
            // END DEMO MODE

            const token = localStorage.getItem('smartinvest_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    localStorage.removeItem('smartinvest_token');
                    router.push('/login');
                    return;
                }

                const data = await res.json();
                setUser(data.user);
                setBalance(data.user.balance || 0);
            } catch {
                localStorage.removeItem('smartinvest_token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // Live balance ticker
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            setBalance(prev => Math.round((prev + 0.01) * 100) / 100);
        }, 2000);
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('smartinvest_token');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/lion.png" alt="Loading" style={{ height: '50px', opacity: 0.5 }} />
            </div>
        );
    }

    const navItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'market', icon: '🎯', label: 'Market' },
        { id: 'investments', icon: '⛏️', label: 'Mining' },
        { id: 'wallet', icon: '💳', label: 'Wallet' },
        { id: 'profile', icon: '👤', label: 'Profile' },
    ];

    const sidebarWidth = 260;

    return (
        <>
            <style jsx global>{`
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
                body { background-color: #f8fafc; color: #0f172a; overflow-x: hidden; }
            `}</style>

            {/* GRID MESH BACKGROUND */}
            <div style={{
                position: 'fixed', top: 0, left: sidebarCollapsed ? 0 : sidebarWidth, right: 0, height: '100%', zIndex: 0,
                backgroundImage: 'linear-gradient(rgba(0, 82, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 82, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                transition: 'left 0.3s ease'
            }}></div>

            {/* FLOATING TOGGLE BUTTON - visible when collapsed */}
            {sidebarCollapsed && (
                <div
                    onMouseDown={(e) => {
                        setIsDragging(true);
                        e.preventDefault();
                    }}
                    onMouseMove={(e) => {
                        if (isDragging) {
                            const newY = (e.clientY / window.innerHeight) * 100;
                            setToggleY(Math.max(10, Math.min(90, newY)));
                        }
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onClick={() => !isDragging && setSidebarCollapsed(false)}
                    style={{
                        position: 'fixed',
                        left: '12px',
                        top: `${toggleY}%`,
                        transform: 'translateY(-50%)',
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #94a3b8, #64748b)',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        zIndex: 200,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                        transition: isDragging ? 'none' : 'box-shadow 0.2s',
                        userSelect: 'none'
                    }}
                >
                    →
                </div>
            )}

            {/* OVERLAY - click to close sidebar */}
            {!sidebarCollapsed && (
                <div
                    onClick={() => setSidebarCollapsed(true)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: sidebarWidth,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.1)',
                        zIndex: 50,
                        cursor: 'pointer',
                        transition: 'opacity 0.3s ease'
                    }}
                />
            )}

            {/* LEFT SIDEBAR */}
            <aside style={{
                position: 'fixed',
                left: sidebarCollapsed ? -sidebarWidth : 0,
                top: 0,
                width: sidebarWidth,
                height: '100vh',
                background: '#0f172a',
                padding: '25px 20px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                transition: 'left 0.3s ease',
                boxShadow: sidebarCollapsed ? 'none' : '4px 0 30px rgba(0,0,0,0.1)'
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '30px' }}>
                    <img src="/lion.png" alt="SmartInvest" style={{ height: '36px' }} />
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.5px' }}>SMARTINVEST</span>
                </Link>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setSidebarCollapsed(true)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: '0.2s'
                    }}
                >
                    ← Hide Menu
                </button>

                {/* Navigation */}
                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as Section)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '14px 18px',
                                marginBottom: '8px',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                transition: '0.2s',
                                background: activeSection === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                                color: activeSection === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* User & Logout */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{user?.email?.split('@')[0] || 'User'}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Premium Member</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        🚪 Log Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ marginLeft: sidebarCollapsed ? 0 : sidebarWidth, padding: '30px', minHeight: '100vh', position: 'relative', zIndex: 1, transition: 'margin-left 0.3s ease' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                            {activeSection === 'home' && 'Dashboard'}
                            {activeSection === 'market' && 'Mining Marketplace'}
                            {activeSection === 'investments' && 'Active Mining'}
                            {activeSection === 'wallet' && 'Wallet'}
                            {activeSection === 'profile' && 'Profile'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back, {user?.email?.split('@')[0] || 'User'}!</p>
                    </div>
                    <div style={{ position: 'relative', fontSize: '1.4rem', cursor: 'pointer', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        🔔<div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: 'red', borderRadius: '50%' }}></div>
                    </div>
                </div>

                {/* HOME SECTION */}
                {activeSection === 'home' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: 'var(--navy)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px' }}>Total Portfolio</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Daily Profit</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald)' }}>+Ksh {(balance * 0.05).toFixed(2)}</h2>
                            </div>
                            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Active Bots</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>0 Bots</h2>
                            </div>
                        </div>

                        {/* Chart */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '20px', fontWeight: 700 }}>Live Performance</h3>
                            <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%`, flex: 1, background: i === 5 ? 'var(--primary)' : '#e2e8f0', borderRadius: '6px', transition: '0.3s' }}></div>
                                ))}
                            </div>
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '15px' }}>Weekly Earnings Growth</p>
                        </div>
                    </div>
                )}

                {/* MARKETPLACE SECTION */}
                {activeSection === 'market' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {/* VIP Bot */}
                            <div style={{ background: 'var(--navy)', color: 'white', border: '2px solid var(--gold)', borderRadius: '24px', padding: '25px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: '0.3s' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: 'rgba(255,255,255,0.1)' }}>💎</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Diamond VIP Bot</h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Min: Ksh 50,000 • 30 Days</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <b style={{ color: 'var(--emerald)', fontSize: '1.2rem', display: 'block' }}>12% Daily</b>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>1.2k Active</span>
                                </div>
                            </div>

                            {/* Elite Bot */}
                            <div style={{ background: '#fef3c7', border: '1px solid var(--gold)', borderRadius: '24px', padding: '25px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: '0.3s' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: 'rgba(245,158,11,0.2)' }}>🥇</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Elite Gold Miner</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Min: Ksh 10,000 • 15 Days</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <b style={{ color: 'var(--emerald)', fontSize: '1.2rem', display: 'block' }}>8% Daily</b>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>4.5k Active</span>
                                </div>
                            </div>

                            {/* Pro Bot */}
                            <div style={{ background: '#e0f2fe', borderRadius: '24px', padding: '25px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #bae6fd', cursor: 'pointer', transition: '0.3s' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: 'rgba(14,165,233,0.2)' }}>🥈</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Pro Silver Bot</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Min: Ksh 5,000 • 7 Days</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <b style={{ color: 'var(--emerald)', fontSize: '1.2rem', display: 'block' }}>5% Daily</b>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>12k Active</span>
                                </div>
                            </div>

                            {/* Starter Bot */}
                            <div style={{ background: '#f1f5f9', borderRadius: '24px', padding: '25px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.3s' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: 'rgba(100,116,139,0.1)' }}>🥉</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Starter Bronze Bot</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Min: Ksh 500 • 5 Days</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <b style={{ color: 'var(--emerald)', fontSize: '1.2rem', display: 'block' }}>3% Daily</b>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>25k Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* INVESTMENTS SECTION */}
                {activeSection === 'investments' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <b style={{ fontSize: '1.1rem' }}>No Active Bots</b>
                                <span style={{ color: 'var(--emerald)', fontWeight: 800 }}>+Ksh 0.00 today</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', margin: '20px 0', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: 'var(--primary)', width: '0%', borderRadius: '10px' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                                Go to Marketplace to activate a mining bot
                            </p>
                        </div>

                        <button style={{ padding: '18px 30px', borderRadius: '15px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', background: 'var(--navy)', color: 'white' }}>
                            Withdraw Earnings to Wallet
                        </button>
                    </div>
                )}

                {/* WALLET SECTION */}
                {activeSection === 'wallet' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '500px' }}>
                        <div style={{ background: '#effef4', border: '1px solid var(--emerald)', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <div style={{ background: 'var(--emerald)', color: 'white', fontWeight: 900, padding: '8px 14px', borderRadius: '8px', fontSize: '1.1rem' }}>M</div>
                            <div>
                                <h4 style={{ color: '#059669', fontSize: '1rem' }}>M-Pesa Connected</h4>
                                <p style={{ fontSize: '0.8rem', color: '#059669' }}>Instant Deposit & Withdrawal</p>
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Wallet Balance</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button style={{ flex: 1, padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', background: 'var(--navy)', color: 'white' }}>
                                Deposit via M-Pesa
                            </button>
                            <button style={{ flex: 1, padding: '18px', borderRadius: '15px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', background: 'white', border: '2px solid #e2e8f0' }}>
                                Withdraw
                            </button>
                        </div>
                    </div>
                )}

                {/* PROFILE SECTION */}
                {activeSection === 'profile' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '500px' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '25px' }}>
                            <div style={{ width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>👤</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.email?.split('@')[0] || 'User'}</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.email}</p>
                            <div style={{ display: 'inline-block', background: '#f0f7ff', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginTop: '10px' }}>Premium Member</div>
                        </div>

                        <div style={{ background: '#f0f7ff', padding: '25px', borderRadius: '20px', border: '1px dashed var(--primary)' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>REFERRAL CODE</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <code style={{ fontSize: '1.4rem', fontWeight: 800, background: 'white', padding: '10px 20px', borderRadius: '10px' }}>SMART-{user?.id?.slice(-4).toUpperCase() || '0000'}</code>
                                <button style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Copy</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
