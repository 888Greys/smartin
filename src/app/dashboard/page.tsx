"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    id: string;
    email: string;
    balance: number;
    totalEarnings: number;
    totalDeposits?: number;
    totalWithdrawals?: number;
    createdAt?: string;
    hasBiometrics?: boolean;
    fullName?: string;
    phone?: string;
    idNumber?: string;
    dateOfBirth?: string;
    profilePhoto?: string;
    gender?: string;
    occupation?: string;
    address?: string;
    tier?: string;
    referralCode?: string;
    referralCount?: number;
    referralEarnings?: number;
}

type Section = 'home' | 'market' | 'investments' | 'trading' | 'staking' | 'pools' | 'wallet' | 'profile';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [activeSection, setActiveSection] = useState<Section>('home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [toggleY, setToggleY] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Deposit form state
    const [depositPhone, setDepositPhone] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositLoading, setDepositLoading] = useState(false);
    const [depositError, setDepositError] = useState('');
    const [depositSuccess, setDepositSuccess] = useState(false);

    // Transaction history state
    interface Transaction {
        id: string;
        type: string;
        amount: number;
        status: string;
        reference: string | null;
        createdAt: string;
    }
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Profile form state
    const [profileFirstName, setProfileFirstName] = useState('');
    const [profileLastName, setProfileLastName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profileIdNumber, setProfileIdNumber] = useState('');
    const [profileDateOfBirth, setProfileDateOfBirth] = useState('');
    const [profileGender, setProfileGender] = useState('');
    const [profileOccupation, setProfileOccupation] = useState('');
    const [profileAddress, setProfileAddress] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchUser = async () => {
            // DEMO MODE - controlled by environment variable
            // Set NEXT_PUBLIC_DEMO_MODE=true in .env.local for local testing
            const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
            if (DEMO_MODE) {
                setUser({
                    id: 'demo123',
                    email: 'demo@smartinvest.com',
                    fullName: 'Demo User',
                    balance: 5000,
                    totalEarnings: 1250,
                    totalDeposits: 10000,
                    totalWithdrawals: 0,
                    referralEarnings: 250,
                    tier: 'premium',
                    createdAt: new Date().toISOString(),
                });
                setBalance(5000);
                setProfileFirstName('Demo');
                setProfileLastName('User');
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

                // Pre-fill form fields with existing data
                if (data.user.fullName) {
                    const nameParts = data.user.fullName.split(' ');
                    setProfileFirstName(nameParts[0] || '');
                    setProfileLastName(nameParts.slice(1).join(' ') || '');
                }
                if (data.user.phone) setProfilePhone(data.user.phone);
                if (data.user.idNumber) setProfileIdNumber(data.user.idNumber);
                if (data.user.dateOfBirth) setProfileDateOfBirth(new Date(data.user.dateOfBirth).toISOString().split('T')[0]);
                if (data.user.gender) setProfileGender(data.user.gender);
                if (data.user.occupation) setProfileOccupation(data.user.occupation);
                if (data.user.address) setProfileAddress(data.user.address);
                if (data.user.profilePhoto) setProfilePhoto(data.user.profilePhoto);
            } catch {
                localStorage.removeItem('smartinvest_token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // Balance updates are now only from deposits/withdrawals, not auto-increment

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
        { id: 'home', label: 'Dashboard' },
        {
            id: 'market',
            label: 'Market',
            hasSubmenu: true,
            submenu: [
                { id: 'investments', label: 'Mining' },
                { id: 'trading', label: 'Trading' },
                { id: 'staking', label: 'Staking' },
                { id: 'pools', label: 'Liquidity Pools' },
            ]
        },
        { id: 'wallet', label: 'Wallet' },
        { id: 'profile', label: 'Profile' },
    ];

    // Mining Rigs Data
    const miningRigs = [
        { id: 'antminer-s19', name: 'Antminer S19', icon: '⛏️', dailyEarnings: 450, price: 1500, category: 'Crypto Mining' },
        { id: 'uber-fleet', name: 'Uber Fleet Share', icon: '🚗', dailyEarnings: 900, price: 3000, category: 'Asset Sharing' },
        { id: 'delivery-truck', name: 'Delivery Truck', icon: '🚚', dailyEarnings: 2500, price: 8000, category: 'Asset Sharing' },
        { id: 'solar-unit', name: 'Solar Unit', icon: '☀️', dailyEarnings: 4800, price: 15000, category: 'Green Energy' },
        { id: 'ai-neural', name: 'AI Neural Hub', icon: '🤖', dailyEarnings: 10000, price: 30000, category: 'Tech Infrastructure' },
        { id: 'e-boda', name: 'E-Boda Asset', icon: '🏍️', dailyEarnings: 320, price: 1000, category: 'Asset Sharing' },
        { id: '5g-tower', name: '5G Tower Share', icon: '📡', dailyEarnings: 20000, price: 60000, category: 'Tech Infrastructure' },
        { id: 'firewall-rig', name: 'Firewall Rig', icon: '🔥', dailyEarnings: 750, price: 2500, category: 'Crypto Mining' },
        { id: 'spacelink-node', name: 'SpaceLink Node', icon: '🛰️', dailyEarnings: 45000, price: 120000, category: 'Tech Infrastructure' },
    ];

    const sidebarWidth = 260;

    return (
        <>
            <style jsx global>{`
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
                html, body { background-color: #f8fafc; color: #0f172a; overflow-x: hidden; height: 100%; }
                aside { overscroll-behavior: none; touch-action: none; position: fixed !important; }
                aside::-webkit-scrollbar { display: none; }
                main { overscroll-behavior: contain; }
                .stat-value { white-space: nowrap; }
                @media (max-width: 640px) {
                    .stat-grid { grid-template-columns: 1fr !important; }
                    .stat-card { padding: 20px !important; }
                    .stat-card h2 { font-size: 1.5rem !important; white-space: nowrap; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
                label:hover .avatar-overlay { opacity: 1 !important; }
            `}</style>

            {/* GRID MESH BACKGROUND */}
            <div style={{
                position: 'fixed', top: 0, left: sidebarCollapsed ? 0 : sidebarWidth, right: 0, height: '100%', zIndex: 0,
                backgroundImage: 'linear-gradient(rgba(0, 82, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 82, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                transition: 'left 0.3s ease'
            }}></div>

            {/* FLOATING HAMBURGER - visible when collapsed */}
            {sidebarCollapsed && (
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    style={{
                        position: 'fixed',
                        left: '15px',
                        top: '15px',
                        width: '45px',
                        height: '45px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        zIndex: 200,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        transition: '0.2s'
                    }}
                >
                    <span style={{ width: '22px', height: '2.5px', background: '#0f172a', borderRadius: '2px' }}></span>
                    <span style={{ width: '22px', height: '2.5px', background: '#0f172a', borderRadius: '2px' }}></span>
                    <span style={{ width: '22px', height: '2.5px', background: '#0f172a', borderRadius: '2px' }}></span>
                </button>
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
                boxShadow: sidebarCollapsed ? 'none' : '4px 0 30px rgba(0,0,0,0.1)',
                overflow: 'hidden'
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
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    if (item.hasSubmenu) {
                                        setExpandedMenu(expandedMenu === item.id ? null : item.id);
                                    } else {
                                        setActiveSection(item.id as Section);
                                        setSidebarCollapsed(true);
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 18px',
                                    marginBottom: item.hasSubmenu && expandedMenu === item.id ? '8px' : '8px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    transition: '0.2s',
                                    background: activeSection === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    color: activeSection === item.id || expandedMenu === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                                }}
                            >
                                {item.label}
                                {item.hasSubmenu && (
                                    <span style={{ fontSize: '0.8rem', transition: '0.2s', transform: expandedMenu === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                )}
                            </button>

                            {/* Submenu */}
                            {item.hasSubmenu && item.submenu && expandedMenu === item.id && (
                                <div style={{ paddingLeft: '12px', marginBottom: '8px' }}>
                                    {item.submenu.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            onClick={() => {
                                                setActiveSection(subItem.id as Section);
                                                setSidebarCollapsed(true);
                                            }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '12px 18px',
                                                marginBottom: '4px',
                                                border: 'none',
                                                borderLeft: '2px solid rgba(255,255,255,0.2)',
                                                borderRadius: '0 8px 8px 0',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                transition: '0.2s',
                                                background: activeSection === subItem.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                color: activeSection === subItem.id ? 'white' : 'rgba(255,255,255,0.5)',
                                            }}
                                        >
                                            {subItem.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User & Logout - always at bottom */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', flexGrow: 0, flexShrink: 0 }}>
                    <div
                        onClick={() => { setActiveSection('profile'); setSidebarCollapsed(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: '0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: user?.profilePhoto || profilePhoto ? 'transparent' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', overflow: 'hidden', backgroundImage: user?.profilePhoto || profilePhoto ? `url(${user?.profilePhoto || profilePhoto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            {!user?.profilePhoto && !profilePhoto && (user?.fullName ? user.fullName.charAt(0).toUpperCase() : '👤')}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                                {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{user?.tier === 'vip' ? 'VIP Member' : user?.tier === 'premium' ? 'Premium Member' : 'Basic Member'}</div>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>›</span>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        🚪 Log Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ marginLeft: sidebarCollapsed ? 0 : sidebarWidth, padding: '30px', minHeight: '100vh', position: 'relative', zIndex: 1, transition: 'margin-left 0.3s ease' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingLeft: sidebarCollapsed ? '45px' : '0', transition: 'padding-left 0.3s ease' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                            {activeSection === 'home' && 'Dashboard'}
                            {activeSection === 'market' && 'Mining Marketplace'}
                            {activeSection === 'investments' && 'Active Mining'}
                            {activeSection === 'trading' && 'Trading'}
                            {activeSection === 'staking' && 'Staking'}
                            {activeSection === 'pools' && 'Liquidity Pools'}
                            {activeSection === 'wallet' && 'Wallet'}
                            {activeSection === 'profile' && 'Profile'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back, {user?.email?.split('@')[0] || 'User'}!</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{ position: 'relative', fontSize: '1.4rem', cursor: 'pointer', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
                        >
                            🔔<div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: 'red', borderRadius: '50%' }}></div>
                        </div>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '60px',
                                right: 0,
                                width: '350px',
                                maxHeight: '400px',
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                border: '1px solid #e2e8f0',
                                zIndex: 1000,
                                overflow: 'hidden'
                            }}>
                                {/* Header */}
                                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Notifications</h3>
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Notifications List */}
                                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                    {/* Welcome Notification */}
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ fontSize: '1.5rem' }}>👋</div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Welcome to SmartInvest!</p>
                                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Start by making your first deposit to begin earning.</p>
                                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Just now</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty State */}
                                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.3 }}>🔔</div>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No more notifications</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* HOME SECTION */}
                {activeSection === 'home' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Primary Stats - Balance & Money Flow */}
                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                            {/* Total Portfolio */}
                            <div className="stat-card" style={{ background: '#0f172a', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px' }}>Total Portfolio</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, whiteSpace: 'nowrap' }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>

                            {/* Total Deposits */}
                            <div className="stat-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Total Deposits</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0052ff', whiteSpace: 'nowrap' }}>Ksh {(user?.totalDeposits || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>

                        {/* Chart */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '25px', borderRadius: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: 700, color: 'white' }}>Live Performance</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>LIVE</span>
                                </div>
                            </div>

                            {/* SVG Chart */}
                            <svg viewBox="0 0 400 120" style={{ width: '100%', height: '120px' }}>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#0052ff" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#0052ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Grid lines */}
                                {[0, 30, 60, 90].map((y) => (
                                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                ))}

                                {/* Flat line (no data yet) */}
                                <path d="M0,100 L400,100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" />

                                {/* Area fill */}
                                <path d="M0,100 L0,100 L400,100 L400,100 Z" fill="url(#chartGradient)" />

                                {/* Main line */}
                                <path d="M0,100 L400,100" fill="none" stroke="#0052ff" strokeWidth="3" strokeLinecap="round" />

                                {/* Data point */}
                                <circle cx="400" cy="100" r="6" fill="#0052ff" stroke="white" strokeWidth="2" />
                            </svg>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>7 days ago</span>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Today</span>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '15px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Weekly Earnings</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Ksh 0.00</p>
                            </div>
                        </div>

                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                            {/* Total Withdrawals */}
                            <div className="stat-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Total Withdrawals</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', whiteSpace: 'nowrap' }}>Ksh {(user?.totalWithdrawals || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>

                            {/* Net Profit */}
                            <div className="stat-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Net Profit</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', whiteSpace: 'nowrap' }}>Ksh {((user?.totalEarnings || 0) - (user?.totalWithdrawals || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                            {/* ROI Percentage */}
                            <div className="stat-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>ROI Percentage</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', whiteSpace: 'nowrap' }}>
                                    {user?.totalDeposits && user.totalDeposits > 0
                                        ? `${(((user?.totalEarnings || 0) / user.totalDeposits) * 100).toFixed(1)}%`
                                        : '0%'
                                    }
                                </h2>
                            </div>

                            {/* Days Active */}
                            <div className="stat-card" style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Days Active</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', whiteSpace: 'nowrap' }}>
                                    {user?.createdAt
                                        ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                                        : 0
                                    } days
                                </h2>
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            {/* Daily Profit */}
                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)' }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '8px' }}>Daily Profit</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, whiteSpace: 'nowrap' }}>+Ksh {(balance * 0.05).toFixed(2)}</h2>
                            </div>

                            {/* Referral Earnings */}
                            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)' }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '8px' }}>Referral Earnings</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, whiteSpace: 'nowrap' }}>Ksh {(user?.referralEarnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
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

                {/* MINING MARKETPLACE SECTION */}
                {activeSection === 'investments' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Header Stats */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '24px', padding: '25px', marginBottom: '20px', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px' }}>Hello, {user?.fullName?.split(' ')[0] || 'User'}...</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>●</span>
                                        <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Market Status: ACTIVE</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Balance</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>HASHRATE</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>0.00 TH/s</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>ACTIVE RIGS</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#0052ff' }}>0</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>EARNINGS TODAY</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>KES 0</p>
                                </div>
                            </div>
                        </div>

                        {/* Mining Rigs Grid */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '15px' }}>Rent Mining Rigs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {miningRigs.map((rig) => (
                                <div
                                    key={rig.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '18px 20px',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: '0.2s',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            background: '#0f172a',
                                            borderRadius: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem'
                                        }}>
                                            {rig.icon}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rig.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Daily: KES {rig.dailyEarnings.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>KES {rig.price.toLocaleString()}</p>
                                        <button
                                            style={{
                                                padding: '10px 20px',
                                                background: '#0052ff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                if (balance < rig.price) {
                                                    alert(`Insufficient balance! You need KES ${rig.price.toLocaleString()} to rent ${rig.name}`);
                                                } else {
                                                    alert(`Renting ${rig.name}... (Coming soon)`);
                                                }
                                            }}
                                        >
                                            Rent
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Withdraw Button */}
                        <button
                            style={{
                                marginTop: '25px',
                                width: '100%',
                                padding: '18px 30px',
                                borderRadius: '15px',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                background: '#0f172a',
                                color: 'white'
                            }}
                        >
                            Withdraw Earnings to Wallet
                        </button>
                    </div>
                )}

                {/* TRADING SECTION */}
                {activeSection === 'trading' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📈</div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>Trading Coming Soon</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Spot and futures trading will be available soon.</p>
                        </div>
                    </div>
                )}

                {/* STAKING SECTION */}
                {activeSection === 'staking' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>Staking Coming Soon</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Earn passive income by staking your assets.</p>
                        </div>
                    </div>
                )}

                {/* LIQUIDITY POOLS SECTION */}
                {activeSection === 'pools' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💧</div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>Liquidity Pools Coming Soon</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Provide liquidity and earn trading fees.</p>
                        </div>
                    </div>
                )}

                {/* WALLET SECTION */}
                {activeSection === 'wallet' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '500px' }}>
                        <div style={{ background: '#effef4', border: '1px solid #10b981', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                            <div style={{ background: '#10b981', color: 'white', fontWeight: 900, padding: '8px 14px', borderRadius: '8px', fontSize: '1.1rem' }}>M</div>
                            <div>
                                <h4 style={{ color: '#059669', fontSize: '1rem' }}>M-Pesa Connected</h4>
                                <p style={{ fontSize: '0.8rem', color: '#059669' }}>Instant Deposit & Withdrawal</p>
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Wallet Balance</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        </div>

                        {/* Deposit Form */}
                        {depositSuccess ? (
                            <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📱</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Check your phone!</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                                    We've sent an M-Pesa prompt to <strong>{depositPhone}</strong>. Enter your PIN to complete the deposit of <strong>Ksh {depositAmount}</strong>.
                                </p>
                                <button
                                    onClick={() => { setDepositSuccess(false); setDepositPhone(''); setDepositAmount(''); }}
                                    style={{ padding: '14px 30px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    Make Another Deposit
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Deposit via M-Pesa</h3>

                                <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>M-Pesa Phone Number</label>
                                <input
                                    type="tel"
                                    value={depositPhone}
                                    onChange={(e) => setDepositPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                    placeholder="07XXXXXXXX"
                                    style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                />

                                <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Amount (Ksh)</label>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Minimum Ksh 10"
                                    min="10"
                                    style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                />

                                {/* Quick amounts */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                    {[100, 500, 1000, 5000].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setDepositAmount(amt.toString())}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                background: depositAmount === amt.toString() ? '#0052ff' : '#f1f5f9',
                                                color: depositAmount === amt.toString() ? 'white' : '#64748b',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ background: '#f0f7ff', padding: '12px 14px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1rem' }}>🔒</span>
                                    <span style={{ fontSize: '0.8rem', color: '#0052ff', fontWeight: 600 }}>Secure M-Pesa payment. You'll receive an STK push.</span>
                                </div>

                                {depositError && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '15px' }}>{depositError}</p>}

                                <button
                                    onClick={async () => {
                                        setDepositError('');
                                        const amountNum = parseInt(depositAmount);
                                        if (amountNum < 10) { setDepositError('Minimum deposit is Ksh 10'); return; }
                                        if (depositPhone.length < 9) { setDepositError('Please enter a valid phone number'); return; }

                                        setDepositLoading(true);
                                        try {
                                            const token = localStorage.getItem('smartinvest_token');
                                            const res = await fetch('/api/mpesa/initiate', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': token ? `Bearer ${token}` : ''
                                                },
                                                body: JSON.stringify({ phone: depositPhone, amount: amountNum }),
                                            });
                                            const data = await res.json();
                                            if (!res.ok) { setDepositError(data.error || 'Failed to send payment request'); return; }
                                            setDepositSuccess(true);
                                        } catch {
                                            setDepositError('Something went wrong. Please try again.');
                                        } finally {
                                            setDepositLoading(false);
                                        }
                                    }}
                                    disabled={depositLoading}
                                    style={{ width: '100%', padding: '16px', background: '#059669', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', opacity: depositLoading ? 0.7 : 1 }}
                                >
                                    {depositLoading ? 'Sending request...' : `Deposit ${depositAmount ? `Ksh ${parseInt(depositAmount).toLocaleString()}` : ''}`}
                                </button>
                            </div>
                        )}

                        {/* Transaction History */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', marginTop: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Transaction History</h3>
                                <button
                                    onClick={async () => {
                                        const token = localStorage.getItem('smartinvest_token');
                                        if (!token) return;
                                        setLoadingTransactions(true);
                                        try {
                                            const res = await fetch('/api/transactions', {
                                                headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            const data = await res.json();
                                            if (res.ok) setTransactions(data.transactions || []);
                                        } catch { /* ignore */ }
                                        setLoadingTransactions(false);
                                    }}
                                    style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    {loadingTransactions ? 'Loading...' : '↻ Refresh'}
                                </button>
                            </div>

                            {transactions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📋</div>
                                    <p>No transactions yet</p>
                                    <p style={{ fontSize: '0.8rem' }}>Your deposits and withdrawals will appear here</p>
                                </div>
                            ) : (
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {transactions.map((tx) => (
                                        <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: tx.type === 'deposit' ? '#dcfce7' : '#fef3c7',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem'
                                                }}>
                                                    {tx.type === 'deposit' ? '↓' : '↑'}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{tx.type}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                        {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontWeight: 800, color: tx.type === 'deposit' ? '#059669' : '#f59e0b' }}>
                                                    {tx.type === 'deposit' ? '+' : '-'}Ksh {tx.amount.toLocaleString()}
                                                </p>
                                                <p style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    background: tx.status === 'completed' ? '#dcfce7' : tx.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                                    color: tx.status === 'completed' ? '#059669' : tx.status === 'pending' ? '#b45309' : '#dc2626',
                                                    textTransform: 'capitalize',
                                                    display: 'inline-block'
                                                }}>
                                                    {tx.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PROFILE SECTION */}
                {activeSection === 'profile' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '600px' }}>
                        {/* Profile Header */}
                        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '25px' }}>
                            {/* Clickable Avatar */}
                            <label htmlFor="avatarUpload" style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}>
                                <div style={{ width: '100px', height: '100px', background: profilePhoto || user?.profilePhoto ? 'transparent' : 'linear-gradient(135deg, #0052ff, #00a3ff)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 800, overflow: 'hidden', border: '3px solid #e2e8f0', position: 'relative' }}>
                                    {profilePhoto || user?.profilePhoto ? (
                                        <img src={profilePhoto || user?.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'
                                    )}
                                    {/* Hover overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: '0.2s',
                                        borderRadius: '50%'
                                    }} className="avatar-overlay">
                                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    id="avatarUpload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) {
                                                setProfileMessage('❌ Image must be less than 2MB');
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setProfilePhoto(event.target?.result as string);
                                                setProfileMessage('📷 Photo selected! Click Save to update.');
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-10px', marginBottom: '15px' }}>Click to upload photo</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.fullName || user?.email?.split('@')[0] || 'User'}</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.email}</p>
                            <div style={{ display: 'inline-block', background: user?.tier === 'vip' ? '#fef3c7' : user?.tier === 'premium' ? '#e0f2fe' : '#f0f7ff', color: user?.tier === 'vip' ? '#b45309' : '#0052ff', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginTop: '10px', textTransform: 'capitalize' }}>
                                {user?.tier || 'Basic'} Member
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Edit Profile</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>First Name <span style={{ color: '#dc2626' }}>*</span></label>
                                    <input
                                        type="text"
                                        value={profileFirstName}
                                        onChange={(e) => {
                                            setProfileFirstName(e.target.value);
                                            if (validationErrors.firstName) {
                                                setValidationErrors(prev => ({ ...prev, firstName: '' }));
                                            }
                                        }}
                                        placeholder="First name"
                                        style={{ width: '100%', padding: '14px', border: validationErrors.firstName ? '2px solid #dc2626' : '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                    {validationErrors.firstName && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '5px' }}>{validationErrors.firstName}</p>}
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Last Name <span style={{ color: '#dc2626' }}>*</span></label>
                                    <input
                                        type="text"
                                        value={profileLastName}
                                        onChange={(e) => {
                                            setProfileLastName(e.target.value);
                                            if (validationErrors.lastName) {
                                                setValidationErrors(prev => ({ ...prev, lastName: '' }));
                                            }
                                        }}
                                        placeholder="Last name"
                                        style={{ width: '100%', padding: '14px', border: validationErrors.lastName ? '2px solid #dc2626' : '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                    {validationErrors.lastName && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '5px' }}>{validationErrors.lastName}</p>}
                                </div>
                            </div>

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Phone Number <span style={{ color: '#dc2626' }}>*</span></label>
                            <input
                                type="tel"
                                value={profilePhone}
                                onChange={(e) => {
                                    setProfilePhone(e.target.value.replace(/\D/g, '').slice(0, 12));
                                    if (validationErrors.phone) {
                                        setValidationErrors(prev => ({ ...prev, phone: '' }));
                                    }
                                }}
                                placeholder={user?.phone || '07XXXXXXXX'}
                                style={{ width: '100%', padding: '14px', border: validationErrors.phone ? '2px solid #dc2626' : '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '5px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                            {validationErrors.phone && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '15px' }}>{validationErrors.phone}</p>}
                            {!validationErrors.phone && <div style={{ marginBottom: '15px' }} />}

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>ID Number <span style={{ color: '#94a3b8' }}>(for verification)</span></label>
                            <input
                                type="text"
                                value={profileIdNumber}
                                onChange={(e) => {
                                    setProfileIdNumber(e.target.value.replace(/\D/g, '').slice(0, 8));
                                    if (validationErrors.idNumber) {
                                        setValidationErrors(prev => ({ ...prev, idNumber: '' }));
                                    }
                                }}
                                placeholder={user?.idNumber || 'National ID Number'}
                                style={{ width: '100%', padding: '14px', border: validationErrors.idNumber ? '2px solid #dc2626' : '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '5px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                            {validationErrors.idNumber && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '15px' }}>{validationErrors.idNumber}</p>}
                            {!validationErrors.idNumber && <div style={{ marginBottom: '15px' }} />}

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Date of Birth</label>
                            <input
                                type="date"
                                value={profileDateOfBirth}
                                onChange={(e) => setProfileDateOfBirth(e.target.value)}
                                placeholder={user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''}
                                max={new Date().toISOString().split('T')[0]}
                                style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Gender</label>
                            <select
                                value={profileGender}
                                onChange={(e) => setProfileGender(e.target.value)}
                                style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', background: 'white' }}
                            >
                                <option value="">{user?.gender || 'Select gender'}</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Occupation</label>
                            <input
                                type="text"
                                value={profileOccupation}
                                onChange={(e) => setProfileOccupation(e.target.value)}
                                placeholder={user?.occupation || 'e.g., Software Engineer, Teacher'}
                                style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />

                            <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Address</label>
                            <textarea
                                value={profileAddress}
                                onChange={(e) => setProfileAddress(e.target.value)}
                                placeholder={user?.address || 'Enter your full address'}
                                rows={3}
                                style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '20px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                            />

                            {profileMessage && (
                                <p style={{ color: profileMessage.includes('success') ? '#059669' : '#dc2626', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>{profileMessage}</p>
                            )}

                            <button
                                onClick={async () => {
                                    const token = localStorage.getItem('smartinvest_token');
                                    if (!token) return;

                                    // Validation
                                    const errors: Record<string, string> = {};

                                    if (!profileFirstName || profileFirstName.trim().length < 2) {
                                        errors.firstName = 'First name is required';
                                    }
                                    if (!profileLastName || profileLastName.trim().length < 2) {
                                        errors.lastName = 'Last name is required';
                                    }

                                    const phoneToValidate = profilePhone || user?.phone;
                                    if (!phoneToValidate || phoneToValidate.length < 10) {
                                        errors.phone = 'Please enter a valid phone number (at least 10 digits)';
                                    }

                                    const idToValidate = profileIdNumber || user?.idNumber;
                                    if (idToValidate && idToValidate.length > 0 && idToValidate.length < 7) {
                                        errors.idNumber = 'ID number must be at least 7 digits';
                                    }

                                    if (Object.keys(errors).length > 0) {
                                        setValidationErrors(errors);
                                        setProfileMessage('Please fix the errors above');
                                        return;
                                    }

                                    setProfileSaving(true);
                                    setProfileMessage('');
                                    setValidationErrors({});

                                    try {
                                        const fullName = `${profileFirstName.trim()} ${profileLastName.trim()}`;
                                        const res = await fetch('/api/profile', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                            body: JSON.stringify({
                                                fullName: fullName,
                                                phone: profilePhone || undefined,
                                                idNumber: profileIdNumber || undefined,
                                                dateOfBirth: profileDateOfBirth || undefined,
                                                gender: profileGender || undefined,
                                                occupation: profileOccupation || undefined,
                                                address: profileAddress || undefined,
                                                profilePhoto: profilePhoto || undefined
                                            }),
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setProfileMessage('✅ Profile updated successfully!');
                                            setUser(prev => prev ? { ...prev, ...data.profile } : null);
                                            // Don't clear form - keep data visible
                                        } else {
                                            setProfileMessage('❌ ' + (data.error || 'Failed to update profile'));
                                        }
                                    } catch {
                                        setProfileMessage('❌ Something went wrong');
                                    } finally {
                                        setProfileSaving(false);
                                    }
                                }}
                                disabled={profileSaving}
                                style={{ width: '100%', padding: '16px', background: profileSaving ? '#94a3b8' : '#0052ff', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: profileSaving ? 'not-allowed' : 'pointer', opacity: profileSaving ? 0.7 : 1, transition: '0.2s' }}
                            >
                                {profileSaving ? '💾 Saving...' : '💾 Save Profile'}
                            </button>
                        </div>

                        {/* Referral Section */}
                        <div style={{ background: '#f0f7ff', padding: '25px', borderRadius: '20px', border: '1px dashed #0052ff', marginBottom: '25px' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0052ff', marginBottom: '12px' }}>REFERRAL CODE</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <code style={{ fontSize: '1.4rem', fontWeight: 800, background: 'white', padding: '10px 20px', borderRadius: '10px' }}>
                                    SMART-{(user?.referralCode || '000000').slice(-6).toUpperCase()}
                                </code>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(`SMART-${(user?.referralCode || '').slice(-6).toUpperCase()}`); setProfileMessage('Referral code copied!'); }}
                                    style={{ background: '#0052ff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                                >Copy</button>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Referrals</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{user?.referralCount || 0}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Earnings</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>Ksh {(user?.referralEarnings || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Account Stats</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Balance</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Earned</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>Ksh {(user?.totalEarnings || 0).toLocaleString()}</p>
                                </div>
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
