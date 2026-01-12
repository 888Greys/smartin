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

type Section = 'home' | 'market' | 'investments' | 'trading' | 'staking' | 'pools' | 'uber-fleet' | 'wallet' | 'team' | 'profile';

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
    const [expandedRig, setExpandedRig] = useState<string | null>(null);
    const [showRentModal, setShowRentModal] = useState(false);
    const [selectedRig, setSelectedRig] = useState<any>(null);

    // Mining simulation states
    const [cpuTemp, setCpuTemp] = useState(68);
    const [fanSpeed, setFanSpeed] = useState(3200);
    const [hashrate, setHashrate] = useState(142.5);
    const [miningLogs, setMiningLogs] = useState<string[]>([]);
    const [payoutTicker, setPayoutTicker] = useState<Array<{ id: number, text: string, amount: string }>>([]);
    const [xRayMode, setXRayMode] = useState(false);
    const [activeMiners, setActiveMiners] = useState(0);
    const [totalMined, setTotalMined] = useState(0);
    const [activityFeedExpanded, setActivityFeedExpanded] = useState(false);
    const [miningTerminalExpanded, setMiningTerminalExpanded] = useState(false);
    const [rentedBots, setRentedBots] = useState<Array<{ id: string, name: string, icon: string, dailyEarnings: number, price: number, rentedAt: string, duration: string }>>([]);
    const [rentalSuccess, setRentalSuccess] = useState<string | null>(null);

    // Deposit form state
    const [depositPhone, setDepositPhone] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositLoading, setDepositLoading] = useState(false);
    const [depositError, setDepositError] = useState('');
    const [depositSuccess, setDepositSuccess] = useState(false);

    // Withdrawal form state
    const [withdrawPhone, setWithdrawPhone] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawError, setWithdrawError] = useState('');
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);
    const [walletTab, setWalletTab] = useState<'deposit' | 'withdraw'>('deposit');

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

    // Toast notification state
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchUser = async () => {
            // DEV MODE - controlled by environment variable
            // Set NEXT_PUBLIC_DEV_BYPASS=true in .env.local for local development
            const token = localStorage.getItem('smartinvest_token');
            const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
            const DEMO_MODE = DEV_BYPASS || token === 'dev-bypass-token';

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

    // Mining Hardware Simulation - CPU Temperature fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuTemp(prev => {
                const variance = (Math.random() - 0.5) * 3;
                const newTemp = prev + variance;
                return Math.min(Math.max(newTemp, 65), 72);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Mining Hardware Simulation - Fan Speed fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setFanSpeed(prev => {
                const variance = (Math.random() - 0.5) * 200;
                const newSpeed = prev + variance;
                return Math.min(Math.max(newSpeed, 3000), 3500);
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Mining Hardware Simulation - Hashrate fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setHashrate(prev => {
                const variance = (Math.random() - 0.5) * 10;
                const newRate = prev + variance;
                return Math.min(Math.max(newRate, 135), 150);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Mining Logs Simulation - Terminal-style scrolling logs
    useEffect(() => {
        const logMessages = [
            '> Connecting to Stratum Pool... Success.',
            `> Checking Hashrate: ${hashrate.toFixed(1)} TH/s`,
            '> Block #842109 Found! Sharing rewards...',
            '> +0.000042 BTC added to wallet.',
            '> Verifying shares with pool...',
            '> Temperature optimal. All systems running.',
            '> Difficulty adjusted: 64.5T',
            '> New block detected #842110',
            '> Worker connection stable. Uptime: 99.8%',
            '> Share accepted by pool (198/200)',
            '> Estimated earnings: $12.50/day',
        ];

        const interval = setInterval(() => {
            const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
            const timestamp = new Date().toLocaleTimeString();
            setMiningLogs(prev => {
                const newLogs = [`[${timestamp}] ${randomLog}`, ...prev];
                return newLogs.slice(0, 12); // Keep only last 12 logs
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [hashrate]);

    // Payout Ticker Simulation - Real-time notifications
    useEffect(() => {
        const kenyanPrefixes = ['254701', '254722', '254733', '254710', '254720', '254700', '254711'];
        const actions = [
            { type: 'withdrawal', text: 'withdrawn by' },
            { type: 'rental', text: 'New Bot Rented by' },
            { type: 'deposit', text: 'deposited by' },
        ];

        const interval = setInterval(() => {
            const prefix = kenyanPrefixes[Math.floor(Math.random() * kenyanPrefixes.length)];
            const lastDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const phone = `${prefix}***${lastDigits}`;
            const amount = (Math.random() * 5000 + 500).toFixed(0);
            const action = actions[Math.floor(Math.random() * actions.length)];

            const notification = {
                id: Date.now(),
                text: action.type === 'withdrawal' ? `+KSh ${amount}` : action.text,
                amount: action.type === 'withdrawal' ? '' : `KSh ${amount}`
            };

            setPayoutTicker(prev => {
                const newTicker = [{ ...notification, text: `${notification.text} ${phone} ${notification.amount}`.trim() }, ...prev];
                return newTicker.slice(0, 8); // Keep only last 8 notifications
            });
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Active miners and total mined simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMiners(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
            setTotalMined(prev => prev + (Math.random() * 50 + 10));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Load rented bots from localStorage on mount
    useEffect(() => {
        const savedBots = localStorage.getItem('smartinvest_rented_bots');
        if (savedBots) {
            try {
                setRentedBots(JSON.parse(savedBots));
            } catch (e) {
                console.error('Error loading rented bots:', e);
            }
        }
    }, []);

    // Save rented bots to localStorage when changed
    useEffect(() => {
        if (rentedBots.length > 0) {
            localStorage.setItem('smartinvest_rented_bots', JSON.stringify(rentedBots));
        }
    }, [rentedBots]);

    // Bot earnings simulation - adds to balance every minute for each active bot
    useEffect(() => {
        if (rentedBots.length === 0) return;

        const interval = setInterval(() => {
            // Calculate per-minute earnings (dailyEarnings / 1440 minutes * simulation speed)
            const totalPerMinute = rentedBots.reduce((sum, bot) => {
                return sum + (bot.dailyEarnings / 1440) * 10; // 10x speed for demo
            }, 0);

            if (totalPerMinute > 0) {
                setBalance(prev => prev + totalPerMinute);
            }
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, [rentedBots]);

    // Auto-populate withdraw phone from profile or deposit phone
    useEffect(() => {
        if (walletTab === 'withdraw' && !withdrawPhone) {
            // Prioritize profile phone, then deposit phone
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
                { id: 'uber-fleet', label: 'Uber Fleet Market Share' },
            ]
        },
        { id: 'wallet', label: 'Wallet' },
        { id: 'team', label: 'Team' },
        { id: 'profile', label: 'Profile' },
    ];

    // Mining Rigs Data
    const miningRigs = [
        {
            id: 'antminer-s19',
            name: 'Antminer S19',
            icon: '⛏️',
            dailyEarnings: 450,
            price: 1500,
            category: 'Crypto Mining',
            description: 'High-performance Bitcoin mining hardware with 95 TH/s hashrate.',
            roi: '15%',
            duration: '30 days',
            hashrate: '95 TH/s',
            powerConsumption: '3250W'
        },
        {
            id: 'uber-fleet',
            name: 'Uber Fleet Share',
            icon: '🚗',
            dailyEarnings: 900,
            price: 3000,
            category: 'Asset Sharing',
            description: 'Earn from ride-sharing without owning a car. Get a share of daily fleet earnings.',
            roi: '30%',
            duration: '60 days',
            vehicles: '5 cars',
            coverage: 'Nairobi Metro'
        },
        {
            id: 'delivery-truck',
            name: 'Delivery Truck',
            icon: '🚚',
            dailyEarnings: 2500,
            price: 8000,
            category: 'Asset Sharing',
            description: 'Commercial delivery truck generating income from logistics operations.',
            roi: '31%',
            duration: '90 days',
            capacity: '5 tons',
            routes: 'Nationwide'
        },
        {
            id: 'solar-unit',
            name: 'Solar Unit',
            icon: '☀️',
            dailyEarnings: 4800,
            price: 15000,
            category: 'Green Energy',
            description: 'Solar panel system selling clean energy to the national grid.',
            roi: '32%',
            duration: '120 days',
            output: '50 kW',
            efficiency: '22%'
        },
        {
            id: 'ai-neural',
            name: 'AI Neural Hub',
            icon: '🤖',
            dailyEarnings: 10000,
            price: 30000,
            category: 'Tech Infrastructure',
            description: 'GPU cluster for AI model training and machine learning computations.',
            roi: '33%',
            duration: '180 days',
            gpus: '8x NVIDIA A100',
            performance: '640 TFLOPS'
        },
        {
            id: 'e-boda',
            name: 'E-Boda Asset',
            icon: '🏍️',
            dailyEarnings: 320,
            price: 1000,
            category: 'Asset Sharing',
            description: 'Electric motorcycle for boda-boda ride-sharing services.',
            roi: '32%',
            duration: '45 days',
            range: '80km',
            charging: '2 hours'
        },
        {
            id: '5g-tower',
            name: '5G Tower Share',
            icon: '📡',
            dailyEarnings: 20000,
            price: 60000,
            category: 'Tech Infrastructure',
            description: 'Own a share of 5G telecommunications infrastructure.',
            roi: '33%',
            duration: '365 days',
            coverage: '5km radius',
            carriers: 'Multi-operator'
        },
        {
            id: 'firewall-rig',
            name: 'Firewall Rig',
            icon: '🔥',
            dailyEarnings: 750,
            price: 2500,
            category: 'Crypto Mining',
            description: 'Ethereum mining rig optimized for maximum hash rate and efficiency.',
            roi: '30%',
            duration: '60 days',
            hashrate: '420 MH/s',
            algorithm: 'Ethash'
        },
        {
            id: 'asic-pro',
            name: 'ASIC Pro Miner',
            icon: '💎',
            dailyEarnings: 1200,
            price: 4000,
            category: 'Crypto Mining',
            description: 'Next-gen ASIC miner with advanced cooling system for 24/7 operation.',
            roi: '30%',
            duration: '45 days',
            hashrate: '140 TH/s',
            powerConsumption: '3400W'
        },
        {
            id: 'gpu-farm',
            name: 'GPU Mining Farm',
            icon: '🖥️',
            dailyEarnings: 2200,
            price: 7500,
            category: 'Crypto Mining',
            description: 'Multi-GPU mining setup for altcoin mining with high flexibility.',
            roi: '29%',
            duration: '60 days',
            hashrate: '1.2 GH/s',
            powerConsumption: '4800W'
        },
        {
            id: 'quantum-hasher',
            name: 'Quantum Hasher X1',
            icon: '⚡',
            dailyEarnings: 3500,
            price: 12000,
            category: 'Crypto Mining',
            description: 'Premium quantum-resistant mining hardware with industry-leading efficiency.',
            roi: '29%',
            duration: '90 days',
            hashrate: '250 TH/s',
            powerConsumption: '5200W'
        },
        {
            id: 'spacelink-node',
            name: 'SpaceLink Node',
            icon: '🛰️',
            dailyEarnings: 45000,
            price: 120000,
            category: 'Tech Infrastructure',
            description: 'Satellite internet ground station providing high-speed connectivity.',
            roi: '37%',
            duration: '730 days',
            bandwidth: '1 Gbps',
            latency: '<20ms'
        },
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
            <main style={{ marginLeft: sidebarCollapsed ? 0 : sidebarWidth, padding: '20px', minHeight: '100vh', position: 'relative', zIndex: 1, transition: 'margin-left 0.3s ease' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingLeft: sidebarCollapsed ? '45px' : '0', transition: 'padding-left 0.3s ease' }}>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                            {activeSection === 'home' && 'Dashboard'}
                            {activeSection === 'market' && 'Mining Marketplace'}
                            {activeSection === 'investments' && 'Active Mining'}
                            {activeSection === 'trading' && 'Trading'}
                            {activeSection === 'staking' && 'Staking'}
                            {activeSection === 'pools' && 'Liquidity Pools'}
                            {activeSection === 'wallet' && 'Wallet'}
                            {activeSection === 'profile' && 'Profile'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Welcome back, {user?.email?.split('@')[0] || 'User'}!</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{ position: 'relative', fontSize: '1.2rem', cursor: 'pointer', background: 'white', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
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
                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '15px' }}>
                            {/* Total Portfolio */}
                            <div className="stat-card" style={{ background: '#0f172a', color: 'white', padding: '15px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' }}>
                                <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '6px' }}>Total Portfolio</p>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, whiteSpace: 'nowrap' }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>

                            {/* Total Deposits */}
                            <div className="stat-card" style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' }}>Total Deposits</p>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0052ff', whiteSpace: 'nowrap' }}>Ksh {(user?.totalDeposits || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>

                        {/* Chart */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '18px', borderRadius: '16px', marginBottom: '15px', position: 'relative', overflow: 'hidden' }}>
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

                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '15px' }}>
                            {/* Total Withdrawals */}
                            <div className="stat-card" style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Total Withdrawals</p>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', whiteSpace: 'nowrap' }}>Ksh {(user?.totalWithdrawals || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>

                            {/* Net Profit */}
                            <div className="stat-card" style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>Net Profit</p>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', whiteSpace: 'nowrap' }}>Ksh {((user?.totalEarnings || 0) - (user?.totalWithdrawals || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '15px' }}>
                            {/* ROI Percentage */}
                            <div className="stat-card" style={{ background: 'white', padding: '15px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>ROI Percentage</p>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#8b5cf6', whiteSpace: 'nowrap' }}>
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
                        {/* All Mining Rigs organized by category */}
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Investment Marketplace</h3>

                        {/* Crypto Mining Bots */}
                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', marginBottom: '15px' }}>🤖 Crypto Mining Bots</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {miningRigs.filter(rig => rig.category === 'Crypto Mining').map((rig) => (
                                    <div
                                        key={rig.id}
                                        style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            padding: '18px 20px',
                                            border: expandedRig === rig.id ? '2px solid #0052ff' : '1px solid #e2e8f0',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div
                                            onClick={() => setExpandedRig(expandedRig === rig.id ? null : rig.id)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
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
                                                <span style={{ fontSize: '1.2rem', transform: expandedRig === rig.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                                            </div>
                                        </div>

                                        {expandedRig === rig.id && (
                                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', animation: 'fadeIn 0.3s ease' }}>
                                                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
                                                    {rig.description}
                                                </p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>ROI</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{rig.roi}</p>
                                                    </div>
                                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>Duration</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800 }}>{rig.duration}</p>
                                                    </div>
                                                    {Object.entries(rig).filter(([key]) => !['id', 'name', 'icon', 'dailyEarnings', 'price', 'category', 'description', 'roi', 'duration'].includes(key)).map(([key, value]) => (
                                                        <div key={key} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                            <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px', textTransform: 'capitalize' }}>
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                            <p style={{ fontSize: '1rem', fontWeight: 800 }}>{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    style={{
                                                        width: '100%',
                                                        padding: '14px 20px',
                                                        background: '#0052ff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: 700,
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRig(rig);
                                                        setShowRentModal(true);
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#0041cc'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#0052ff'}
                                                >
                                                    Rent for KES {rig.price.toLocaleString()}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Asset Sharing */}
                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', marginBottom: '15px' }}>🚗 Asset Sharing</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {miningRigs.filter(rig => rig.category === 'Asset Sharing').map((rig) => (
                                    <div
                                        key={rig.id}
                                        style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            padding: '18px 20px',
                                            border: expandedRig === rig.id ? '2px solid #0052ff' : '1px solid #e2e8f0',
                                            transition: '0.2s',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div
                                            onClick={() => setExpandedRig(expandedRig === rig.id ? null : rig.id)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
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
                                                <span style={{ fontSize: '1.2rem', transform: expandedRig === rig.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                                            </div>
                                        </div>

                                        {expandedRig === rig.id && (
                                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', animation: 'fadeIn 0.3s ease' }}>
                                                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
                                                    {rig.description}
                                                </p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>ROI</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{rig.roi}</p>
                                                    </div>
                                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>Duration</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800 }}>{rig.duration}</p>
                                                    </div>
                                                    {Object.entries(rig).filter(([key]) => !['id', 'name', 'icon', 'dailyEarnings', 'price', 'category', 'description', 'roi', 'duration'].includes(key)).map(([key, value]) => (
                                                        <div key={key} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                            <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px', textTransform: 'capitalize' }}>
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                            <p style={{ fontSize: '1rem', fontWeight: 800 }}>{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    style={{
                                                        width: '100%',
                                                        padding: '14px 20px',
                                                        background: '#0052ff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: 700,
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRig(rig);
                                                        setShowRentModal(true);
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#0041cc'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#0052ff'}
                                                >
                                                    Rent for KES {rig.price.toLocaleString()}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Green Energy & Tech Infrastructure */}
                        {['Green Energy', 'Tech Infrastructure'].map(category => {
                            const categoryRigs = miningRigs.filter(rig => rig.category === category);
                            if (categoryRigs.length === 0) return null;

                            return (
                                <div key={category} style={{ marginBottom: '30px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', marginBottom: '15px' }}>
                                        {category === 'Green Energy' ? '☀️' : '📡'} {category}
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {categoryRigs.map((rig) => (
                                            <div
                                                key={rig.id}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '16px',
                                                    padding: '18px 20px',
                                                    border: expandedRig === rig.id ? '2px solid #0052ff' : '1px solid #e2e8f0',
                                                    transition: '0.2s',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div
                                                    onClick={() => setExpandedRig(expandedRig === rig.id ? null : rig.id)}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
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
                                                        <span style={{ fontSize: '1.2rem', transform: expandedRig === rig.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                                                    </div>
                                                </div>

                                                {expandedRig === rig.id && (
                                                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', animation: 'fadeIn 0.3s ease' }}>
                                                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
                                                            {rig.description}
                                                        </p>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                                <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>ROI</p>
                                                                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{rig.roi}</p>
                                                            </div>
                                                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                                <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>Duration</p>
                                                                <p style={{ fontSize: '1rem', fontWeight: 800 }}>{rig.duration}</p>
                                                            </div>
                                                            {Object.entries(rig).filter(([key]) => !['id', 'name', 'icon', 'dailyEarnings', 'price', 'category', 'description', 'roi', 'duration'].includes(key)).map(([key, value]) => (
                                                                <div key={key} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                                                                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px', textTransform: 'capitalize' }}>
                                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                    </p>
                                                                    <p style={{ fontSize: '1rem', fontWeight: 800 }}>{value}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button
                                                            style={{
                                                                width: '100%',
                                                                padding: '14px 20px',
                                                                background: '#0052ff',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '12px',
                                                                fontWeight: 700,
                                                                fontSize: '0.95rem',
                                                                cursor: 'pointer',
                                                                transition: '0.2s'
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedRig(rig);
                                                                setShowRentModal(true);
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#0041cc'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#0052ff'}
                                                        >
                                                            Rent for KES {rig.price.toLocaleString()}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MINING MARKETPLACE SECTION */}
                {activeSection === 'investments' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', position: 'relative' }}>
                        {/* Hero Balance Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            padding: '25px',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(57, 255, 20, 0.1)',
                                color: '#39ff14',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                marginBottom: '15px'
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#39ff14',
                                    borderRadius: '50%',
                                    animation: 'pulse 2s infinite'
                                }}></div>
                                Data Center: Online
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Total Balance
                            </div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '5px', fontFamily: 'monospace' }}>
                                KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                        {/* My Rented Bots Section */}
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '15px' }}>✅ My Active Bots</h3>
                            {rentedBots.length === 0 ? (
                                <div style={{
                                    background: 'rgba(17, 25, 40, 0.75)',
                                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                                    borderRadius: '16px',
                                    padding: '30px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px', opacity: 0.5 }}>🤖</div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>No active bots</p>
                                    <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '5px' }}>Rent a bot below to start earning!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {rentedBots.map((bot) => {
                                        const rentedDate = new Date(bot.rentedAt);
                                        const daysActive = Math.floor((Date.now() - rentedDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                        const totalEarned = bot.dailyEarnings * daysActive;

                                        return (
                                            <div
                                                key={bot.id + '-rented'}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(0, 242, 255, 0.1) 100%)',
                                                    borderRadius: '16px',
                                                    padding: '18px 20px',
                                                    border: '1px solid rgba(57, 255, 20, 0.3)',
                                                    position: 'relative'
                                                }}
                                            >
                                                {/* Active Badge */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'linear-gradient(135deg, #39ff14 0%, #00f2ff 100%)',
                                                    color: '#0f172a',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}>
                                                    <div style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        background: '#0f172a',
                                                        borderRadius: '50%',
                                                        animation: 'pulse 2s infinite'
                                                    }}></div>
                                                    MINING
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        background: 'rgba(57, 255, 20, 0.2)',
                                                        borderRadius: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem'
                                                    }}>
                                                        {bot.icon}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{bot.name}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Day {daysActive} of {bot.duration}</p>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: '10px',
                                                    marginTop: '15px',
                                                    paddingTop: '15px',
                                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                                }}>
                                                    <div>
                                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px' }}>Daily Earnings</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#39ff14', fontFamily: 'monospace' }}>
                                                            +KES {bot.dailyEarnings.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px' }}>Total Earned</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffb800', fontFamily: 'monospace' }}>
                                                            KES {totalEarned.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Bot Rental Marketplace - Prominent Position */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '15px' }}>🤖 Bot Rental Marketplace</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                            {miningRigs.filter(rig => rig.category === 'Crypto Mining').map((rig, index) => {
                                const stockCounts = [6, 4, 3, 5, 2]; // Fixed stock for each bot
                                const stockLeft = stockCounts[index] || 3;
                                const isLowStock = stockLeft <= 5;
                                const isAlreadyRented = rentedBots.some(bot => bot.id === rig.id);

                                return (
                                    <div
                                        key={rig.id}
                                        style={{
                                            background: isAlreadyRented ? 'rgba(17, 25, 40, 0.5)' : 'rgba(17, 25, 40, 0.85)',
                                            opacity: isAlreadyRented ? 0.6 : 1,
                                            borderRadius: '16px',
                                            padding: '18px 20px',
                                            border: expandedRig === rig.id ? '2px solid #00f2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                                            transition: '0.2s',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Limited Supply Badge or Already Rented Badge */}
                                        {isAlreadyRented ? (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                ✓ Active
                                            </div>
                                        ) : isLowStock && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                                                animation: 'pulse 2s infinite'
                                            }}>
                                                🔥 Only {stockLeft} left!
                                            </div>
                                        )}

                                        <div
                                            onClick={() => setExpandedRig(expandedRig === rig.id ? null : rig.id)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    background: 'rgba(0, 242, 255, 0.1)',
                                                    borderRadius: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    {rig.icon}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{rig.name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Daily: KES {rig.dailyEarnings.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffb800' }}>KES {rig.price.toLocaleString()}</p>
                                                <span style={{ fontSize: '1.2rem', color: '#94a3b8', transform: expandedRig === rig.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedRig === rig.id && (
                                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', animation: 'fadeIn 0.3s ease' }}>
                                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.6 }}>
                                                    {rig.description}
                                                </p>

                                                {/* ROI Calculation Table */}
                                                <div style={{
                                                    background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.2) 0%, rgba(255, 184, 0, 0.1) 100%)',
                                                    padding: '20px',
                                                    borderRadius: '12px',
                                                    marginBottom: '20px',
                                                    border: '1px solid rgba(255, 184, 0, 0.3)'
                                                }}>
                                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px', color: '#ffb800' }}>
                                                        💰 Return on Investment (ROI)
                                                    </h4>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                                                        <div>
                                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Daily Profit</p>
                                                            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#ffb800' }}>
                                                                KES {rig.dailyEarnings.toLocaleString()}
                                                            </p>
                                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>2.5% of investment</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Weekly Profit</p>
                                                            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#ffb800' }}>
                                                                KES {(rig.dailyEarnings * 7).toLocaleString()}
                                                            </p>
                                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>17.5% return</p>
                                                        </div>
                                                        <div style={{ background: 'rgba(255, 184, 0, 0.2)', padding: '10px', borderRadius: '8px' }}>
                                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Monthly Total</p>
                                                            <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffb800' }}>
                                                                KES {(rig.dailyEarnings * 30).toLocaleString()}
                                                            </p>
                                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>75% ROI in 30 days</p>
                                                        </div>
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: '#ffb800', textAlign: 'center', fontWeight: 600 }}>
                                                        📈 Break-even in just 40 days! Pure profit after that.
                                                    </p>
                                                </div>

                                                {/* Stats Grid */}
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>ROI</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#39ff14' }}>{rig.roi}</p>
                                                    </div>
                                                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px' }}>
                                                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Duration</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{rig.duration}</p>
                                                    </div>
                                                    {rig.hashrate && (
                                                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px' }}>
                                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Hashrate</p>
                                                            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{rig.hashrate}</p>
                                                        </div>
                                                    )}
                                                    {rig.powerConsumption && (
                                                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px' }}>
                                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>Power</p>
                                                            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{rig.powerConsumption}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rent Button */}
                                                <button
                                                    disabled={isAlreadyRented}
                                                    style={{
                                                        width: '100%',
                                                        padding: '14px 20px',
                                                        background: isAlreadyRented ? '#10b981' : 'linear-gradient(135deg, #00f2ff 0%, #0066ff 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: 700,
                                                        fontSize: '0.95rem',
                                                        cursor: isAlreadyRented ? 'not-allowed' : 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isAlreadyRented) {
                                                            setSelectedRig(rig);
                                                            setShowRentModal(true);
                                                        }
                                                    }}
                                                >
                                                    {isAlreadyRented ? '✓ Already Rented' : `Rent for KES ${rig.price.toLocaleString()}`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            {/* CPU Temp */}
                            <div style={{
                                background: 'rgba(17, 25, 40, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>🌡️</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>
                                        CPU Temp
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: '#00f2ff' }}>
                                    {cpuTemp.toFixed(1)}°C
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>Normal Range</div>
                                <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30px', opacity: 0.3 }} viewBox="0 0 100 30" preserveAspectRatio="none">
                                    <path d="M0 25 Q 25 5, 50 20 T 100 15" fill="none" stroke="#00f2ff" strokeWidth="2" />
                                </svg>
                            </div>

                            {/* Fan Speed */}
                            <div style={{
                                background: 'rgba(17, 25, 40, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>💨</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>
                                        Fan Speed
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                    {Math.floor(fanSpeed)} <span style={{ fontSize: '0.7rem' }}>RPM</span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>Optimal Performance</div>
                            </div>

                            {/* Hashrate */}
                            <div style={{
                                background: 'rgba(17, 25, 40, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>⚡</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>
                                        Hashrate
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: '#bc13fe' }}>
                                    {hashrate.toFixed(1)} <span style={{ fontSize: '0.7rem' }}>TH/s</span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>Network Stable</div>
                                <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30px', opacity: 0.3 }} viewBox="0 0 100 30" preserveAspectRatio="none">
                                    <path d="M0 20 Q 20 25, 40 10 T 80 20 T 100 5" fill="none" stroke="#bc13fe" strokeWidth="2" />
                                </svg>
                            </div>

                            {/* Active Miners */}
                            <div style={{
                                background: 'rgba(17, 25, 40, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>🔧</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>
                                        Active Miners
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                    {activeMiners.toString().padStart(2, '0')}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>All nodes connected</div>
                            </div>

                            {/* Total Earned */}
                            <div style={{
                                background: 'rgba(17, 25, 40, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden',
                                gridColumn: 'span 2'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>📈</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>
                                        Total Earned (Lifetime)
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: '#ffb800' }}>
                                    KES {totalMined.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>+12.4% from last session</div>
                            </div>
                        </div>

                        {/* Real-Time Payout Ticker */}
                        <div style={{
                            background: 'rgba(17, 25, 40, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '15px',
                            marginBottom: '20px',
                            cursor: 'pointer'
                        }}
                            onClick={() => setActivityFeedExpanded(!activityFeedExpanded)}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem', color: '#bc13fe' }}>📊</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Live Activity Feed</span>
                                </div>
                                <span style={{
                                    fontSize: '1.2rem',
                                    transform: activityFeedExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: '0.3s'
                                }}>▼</span>
                            </div>
                        </div>

                        {activityFeedExpanded && (
                            <div style={{
                                background: 'rgba(17, 25, 40, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '15px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {payoutTicker.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                padding: '10px 15px',
                                                borderRadius: '10px',
                                                borderLeft: '3px solid #10b981',
                                                color: '#10b981',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                animation: 'slideInRight 0.5s ease'
                                            }}
                                        >
                                            ✅ {item.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mining Terminal */}
                        <div style={{
                            background: '#000',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '12px 18px',
                            marginBottom: '20px',
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                        }}
                            onClick={() => setMiningTerminalExpanded(!miningTerminalExpanded)}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></div>
                                    </div>
                                    <div style={{ color: '#39ff14' }}>Mining Terminal v2.5.1</div>
                                </div>
                                <span style={{
                                    color: '#39ff14',
                                    fontSize: '1rem',
                                    transform: miningTerminalExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: '0.3s'
                                }}>▼</span>
                            </div>
                        </div>

                        {miningTerminalExpanded && (
                            <div style={{
                                background: '#000',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '18px',
                                marginBottom: '20px',
                                fontFamily: 'monospace',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    {miningLogs.map((log, index) => (
                                        <div key={index} style={{
                                            color: log.includes('Success') || log.includes('Found') ? '#10b981' :
                                                log.includes('Error') ? '#ef4444' : '#22d3ee',
                                            fontSize: '0.8rem',
                                            lineHeight: 1.5,
                                            animation: 'fadeIn 0.5s ease'
                                        }}>
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

                        {/* Deposit/Withdraw Tab Switcher */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                onClick={() => setWalletTab('deposit')}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: walletTab === 'deposit' ? '#059669' : '#f1f5f9',
                                    color: walletTab === 'deposit' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                            >
                                💰 Deposit
                            </button>
                            <button
                                onClick={() => setWalletTab('withdraw')}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: walletTab === 'withdraw' ? '#059669' : '#f1f5f9',
                                    color: walletTab === 'withdraw' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                            >
                                💸 Withdraw
                            </button>
                        </div>

                        {/* Deposit Form */}
                        {walletTab === 'deposit' && (
                            <>
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
                            </>
                        )}

                        {/* Withdraw Form */}
                        {walletTab === 'withdraw' && (
                            <>
                                {withdrawSuccess ? (
                                    <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: '#059669' }}>Withdrawal Successful!</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                                            <strong>Ksh {withdrawAmount}</strong> has been sent to <strong>{withdrawPhone}</strong>. You should receive it shortly.
                                        </p>
                                        <button
                                            onClick={() => { setWithdrawSuccess(false); setWithdrawAmount(''); }}
                                            style={{ padding: '14px 30px', background: '#0052ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            Make Another Withdrawal
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Withdraw to M-Pesa</h3>

                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>M-Pesa Phone Number</label>
                                        <input
                                            type="tel"
                                            value={withdrawPhone}
                                            onChange={(e) => setWithdrawPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                            placeholder="07XXXXXXXX"
                                            style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                        />

                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Amount (Ksh)</label>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="Minimum Ksh 50"
                                            min="50"
                                            style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                        />

                                        {/* Quick amounts */}
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                            {[100, 500, 1000, 5000].map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setWithdrawAmount(amt.toString())}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        background: withdrawAmount === amt.toString() ? '#059669' : '#f1f5f9',
                                                        color: withdrawAmount === amt.toString() ? 'white' : '#64748b',
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

                                        {/* Available balance info */}
                                        <div style={{ background: '#fef3c7', padding: '12px 14px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '1rem' }}>💰</span>
                                            <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>Available: Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>

                                        {withdrawError && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '15px' }}>{withdrawError}</p>}

                                        <button
                                            onClick={async () => {
                                                setWithdrawError('');
                                                const amountNum = parseInt(withdrawAmount);
                                                if (amountNum < 50) { setWithdrawError('Minimum withdrawal is Ksh 50'); return; }
                                                if (amountNum > balance) { setWithdrawError('Insufficient balance'); return; }
                                                if (withdrawPhone.length < 9) { setWithdrawError('Please enter a valid phone number'); return; }

                                                setWithdrawLoading(true);
                                                try {
                                                    // Simulate withdrawal (in production, call actual API)
                                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                                    setBalance(prev => prev - amountNum);
                                                    setWithdrawSuccess(true);
                                                } catch {
                                                    setWithdrawError('Something went wrong. Please try again.');
                                                } finally {
                                                    setWithdrawLoading(false);
                                                }
                                            }}
                                            disabled={withdrawLoading}
                                            style={{ width: '100%', padding: '16px', background: '#059669', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', opacity: withdrawLoading ? 0.7 : 1 }}
                                        >
                                            {withdrawLoading ? 'Processing...' : `Withdraw ${withdrawAmount ? `Ksh ${parseInt(withdrawAmount).toLocaleString()}` : ''}`}
                                        </button>
                                    </div>
                                )}
                            </>
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

                {/* TEAM SECTION */}
                {activeSection === 'team' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '600px' }}>
                        {/* Header */}
                        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', padding: '30px', borderRadius: '24px', marginBottom: '25px', color: 'white', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Build Your Team</h2>
                            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Invite friends and earn together!</p>
                        </div>

                        {/* Invite Card */}
                        <div style={{ background: 'linear-gradient(135deg, #0052ff 0%, #00a3ff 100%)', padding: '25px', borderRadius: '24px', marginBottom: '25px', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <span style={{ fontSize: '1.5rem' }}>🎁</span>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Invite Friends & Earn</h3>
                            </div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '20px', lineHeight: 1.5 }}>
                                Earn <strong>KES 20</strong> for every friend you invite, plus <strong>KES 5</strong> when they invite someone!
                            </p>

                            {/* Referral Code */}
                            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '14px', marginBottom: '15px' }}>
                                <p style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Referral Code</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <code style={{
                                        flex: 1,
                                        fontSize: '1.3rem',
                                        fontWeight: 800,
                                        fontFamily: 'monospace',
                                        letterSpacing: '3px',
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '12px 15px',
                                        borderRadius: '10px'
                                    }}>
                                        {user?.referralCode || 'LOADING...'}
                                    </code>
                                    <button
                                        onClick={() => {
                                            const code = user?.referralCode;
                                            if (code) {
                                                navigator.clipboard.writeText(code);
                                                showToast('✅ Referral code copied!');
                                            }
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'white',
                                            color: '#0052ff',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            {/* Share Link */}
                            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '14px', marginBottom: '15px' }}>
                                <p style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Share Link</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user?.referralCode || ''}`}
                                        style={{
                                            flex: 1,
                                            minWidth: '200px',
                                            padding: '12px 15px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontSize: '0.8rem'
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
                                            navigator.clipboard.writeText(link);
                                            showToast('✅ Invite link copied!');
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: '10px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => {
                                        const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
                                        const text = `Join SmartInvest and get KES 10 free! Use my code: ${user?.referralCode}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#25D366',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    📱 WhatsApp
                                </button>
                                <button
                                    onClick={() => {
                                        const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
                                        const text = `Join SmartInvest and start earning! Use my code: ${user?.referralCode}`;
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#1DA1F2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    🐦 Twitter
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>{user?.referralCount || 0}</p>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Team Members</p>
                            </div>
                            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>KES {(user?.referralEarnings || 0).toLocaleString()}</p>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Earnings</p>
                            </div>
                        </div>

                        {/* How It Works */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>💡 How It Works</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f0f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0052ff' }}>1</div>
                                    <div>
                                        <p style={{ fontWeight: 700 }}>Share your code</p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Send your referral link to friends</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#10b981' }}>2</div>
                                    <div>
                                        <p style={{ fontWeight: 700 }}>Friend signs up</p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>They register using your code</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#b45309' }}>3</div>
                                    <div>
                                        <p style={{ fontWeight: 700 }}>You both earn!</p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>You get KES 20, they get KES 10</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Leaderboard Placeholder */}
                        <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>🏆 Top Referrers</h3>
                            <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px', opacity: 0.5 }}>🏅</div>
                                <p style={{ fontWeight: 600 }}>Leaderboard Coming Soon</p>
                                <p style={{ fontSize: '0.8rem' }}>Start referring to rank higher!</p>
                            </div>
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

            {/* RENTAL SUCCESS TOAST */}
            {rentalSuccess && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '16px 30px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
                    zIndex: 2000,
                    animation: 'slideUp 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🎉</span>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Bot Rented Successfully!</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{rentalSuccess} is now mining for you</p>
                    </div>
                </div>
            )}

            {/* RENT MODAL */}
            {showRentModal && selectedRig && (
                <div
                    onClick={() => setShowRentModal(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        animation: 'fadeIn 0.2s ease',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            animation: 'slideUp 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowRentModal(false)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#64748b',
                                transition: '0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        >
                            ×
                        </button>

                        {/* Rig Icon & Name */}
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#0f172a',
                                borderRadius: '20px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                marginBottom: '15px'
                            }}>
                                {selectedRig.icon}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '5px' }}>{selectedRig.name}</h2>
                            <span style={{
                                display: 'inline-block',
                                background: '#f0f7ff',
                                color: '#0052ff',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                {selectedRig.category}
                            </span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '25px', textAlign: 'center' }}>
                            {selectedRig.description}
                        </p>

                        {/* Rental Details */}
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', color: '#64748b' }}>Rental Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Daily Earnings</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>KES {selectedRig.dailyEarnings.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Rental Price</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>KES {selectedRig.price.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>ROI</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6' }}>{selectedRig.roi}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Duration</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedRig.duration}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Earnings Projection */}
                        <div style={{ background: 'linear-gradient(135deg, #0052ff, #00a3ff)', padding: '20px', borderRadius: '16px', marginBottom: '25px', color: 'white', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '8px' }}>Estimated Total Earnings</p>
                            <p style={{ fontSize: '2rem', fontWeight: 800 }}>
                                KES {(selectedRig.dailyEarnings * parseInt(selectedRig.duration)).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px' }}>
                                Based on {selectedRig.duration} rental period
                            </p>
                        </div>

                        {/* Balance Check */}
                        {balance < selectedRig.price && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', marginBottom: '4px' }}>Insufficient Balance</p>
                                    <p style={{ fontSize: '0.75rem', color: '#991b1b' }}>
                                        You need KES {(selectedRig.price - balance).toLocaleString()} more to rent this rig.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowRentModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (balance < selectedRig.price) {
                                        setShowRentModal(false);
                                        setActiveSection('wallet');
                                    } else if (rentedBots.some(bot => bot.id === selectedRig.id)) {
                                        // Already rented
                                        alert('You have already rented this bot!');
                                    } else {
                                        // Deduct balance and add to rented bots
                                        setBalance(prev => prev - selectedRig.price);
                                        setRentedBots(prev => [...prev, {
                                            id: selectedRig.id,
                                            name: selectedRig.name,
                                            icon: selectedRig.icon,
                                            dailyEarnings: selectedRig.dailyEarnings,
                                            price: selectedRig.price,
                                            rentedAt: new Date().toISOString(),
                                            duration: selectedRig.duration
                                        }]);
                                        setShowRentModal(false);
                                        setRentalSuccess(selectedRig.name);
                                        setTimeout(() => setRentalSuccess(null), 4000);
                                    }
                                }}
                                disabled={rentedBots.some(bot => bot.id === selectedRig.id)}
                                style={{
                                    flex: 2,
                                    padding: '16px',
                                    background: balance < selectedRig.price ? '#059669' : rentedBots.some(bot => bot.id === selectedRig.id) ? '#10b981' : '#0052ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    cursor: rentedBots.some(bot => bot.id === selectedRig.id) ? 'not-allowed' : 'pointer',
                                    transition: '0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!rentedBots.some(bot => bot.id === selectedRig.id)) {
                                        e.currentTarget.style.background = balance < selectedRig.price ? '#047857' : '#0041cc';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!rentedBots.some(bot => bot.id === selectedRig.id)) {
                                        e.currentTarget.style.background = balance < selectedRig.price ? '#059669' : '#0052ff';
                                    }
                                }}
                            >
                                {balance < selectedRig.price ? '💰 Add Funds' : rentedBots.some(bot => bot.id === selectedRig.id) ? '✓ Already Rented' : `Confirm Rental - KES ${selectedRig.price.toLocaleString()}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    padding: '16px 30px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    zIndex: 3000,
                    animation: 'slideUp 0.3s ease',
                    fontSize: '0.95rem',
                    fontWeight: 600
                }}>
                    {toast}
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </>
    );
}
