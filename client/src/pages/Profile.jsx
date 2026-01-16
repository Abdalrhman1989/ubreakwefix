import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    MapPin,
    LogOut,
    User,
    Package,
    Clock,
    CreditCard,
    Shield,
    Camera,
    ChevronRight,
    Search,
    Wrench,
    Smartphone
} from 'lucide-react';
import OrderCard from '../components/profile/OrderCard';

const Profile = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Sidebar Navigation Items
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'repairs', label: 'My Repairs', icon: Wrench },
        { id: 'orders', label: 'Shop Orders', icon: ShoppingBag },
        { id: 'settings', label: t('auth.myDetails') || 'Settings', icon: Settings },
        { id: 'address', label: t('auth.address') || 'Addresses', icon: MapPin },
    ];

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (user?.id) {
            axios.get(`/api/user/bookings/${user.id}?t=${Date.now()}`)
                .then(res => {
                    console.log("Fetched Orders:", res.data); // Debug
                    setOrders(res.data);
                })
                .catch(err => console.error("Failed to fetch orders"))
                .finally(() => setLoadingOrders(false));
        }
    }, [user]);

    // Filter orders based on type
    const repairs = orders.filter(o => o.type === 'repair');
    const shopOrders = orders.filter(o => o.type === 'shop');

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '90vh', paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>

                {/* Header / Welcome Section */}
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {t('auth.welcome')}, {user.name}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your account, orders, and preferences.</p>
                    </div>
                </div>

                <div className="profile-grid">

                    {/* SIDEBAR */}
                    <div className="card-glass" style={{ padding: '20px', position: 'sticky', top: '100px' }}>

                        {/* User Profile Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-light)', marginBottom: '20px' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-element)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px',
                                border: '2px solid var(--primary)', position: 'relative'
                            }}>
                                <User size={40} color="var(--primary)" />
                                <div style={{
                                    position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)',
                                    borderRadius: '50%', padding: '4px', cursor: 'pointer'
                                }}>
                                    <Camera size={12} color="white" />
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{user.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                        </div>

                        {/* Navigation Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'none',
                                            background: isActive ? 'var(--primary)' : 'transparent',
                                            color: isActive ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: '0.95rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'var(--bg-element)';
                                                e.currentTarget.style.color = 'var(--text-main)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                            }
                                        }}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                        {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                                    </button>
                                );
                            })}

                            <div style={{ height: '1px', background: 'var(--border-light)', margin: '10px 0' }}></div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent',
                                    color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', fontWeight: 500,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <LogOut size={18} />
                                {t('auth.logout')}
                            </button>
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div style={{ minHeight: '500px' }}>
                        {activeTab === 'dashboard' && <DashboardSection user={user} orders={orders} loading={loadingOrders} />}
                        {activeTab === 'repairs' && <OrdersSection title="My Repairs" orders={repairs} loading={loadingOrders} emptyLabel="You have no repairs yet." />}
                        {activeTab === 'orders' && <OrdersSection title="Shop Orders" orders={shopOrders} loading={loadingOrders} emptyLabel="You haven't bought anything yet." />}
                        {activeTab === 'settings' && <SettingsSection user={user} />}
                        {activeTab === 'address' && <AddressSection user={user} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const DashboardSection = ({ user, orders, loading }) => {
    // Calculate stats
    const totalOrders = orders.length;
    const pendingRepairs = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
    const totalSpent = orders
        .filter(o => o.status === 'completed' || o.status === 'Completed')
        .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

    // SMART: Eco Impact Calculation (approx 175g e-waste per phone saved)
    const repairCount = orders.filter(o => o.type === 'repair').length;
    const wasteSaved = (repairCount * 0.175).toFixed(2); // in kg

    // SMART: Loyalty Tier Calculation
    let tier = 'Member';
    let nextTier = 'Silver';
    let progress = 0;
    let nextTierAmount = 1500;
    const silverThreshold = 1500;
    const goldThreshold = 5000;

    if (totalSpent >= goldThreshold) {
        tier = 'Gold';
        nextTier = 'Platinum'; // Max tier
        progress = 100;
        nextTierAmount = 0;
    } else if (totalSpent >= silverThreshold) {
        tier = 'Silver';
        nextTier = 'Gold';
        progress = ((totalSpent - silverThreshold) / (goldThreshold - silverThreshold)) * 100;
        nextTierAmount = goldThreshold;
    } else {
        progress = (totalSpent / silverThreshold) * 100;
    }

    // SMART: Time-aware greeting
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Find most recent active repair
    const activeRepair = orders.find(o => o.status !== 'Completed' && o.status !== 'Cancelled' && o.status !== 'Rejected');

    // SMART: Extract unique devices from history WITH Warranty Check
    const uniqueDevices = orders
        .filter(o => o.type === 'repair')
        .reduce((acc, curr) => {
            const model = curr.device_model;
            if (model && model !== 'Mail-in Repair' && model !== 'Shop Order') {
                if (!acc[model]) acc[model] = { count: 0, lastRepairDate: null };
                acc[model].count++;
                // Track latest repair for warranty
                if (!acc[model].lastRepairDate || new Date(curr.created_at) > new Date(acc[model].lastRepairDate)) {
                    acc[model].lastRepairDate = curr.created_at;
                }
            }
            return acc;
        }, {});

    const myDevices = Object.entries(uniqueDevices).map(([name, data]) => {
        // Calculate warranty (2 years)
        const repairDate = new Date(data.lastRepairDate);
        const warrantyEnd = new Date(repairDate);
        warrantyEnd.setFullYear(warrantyEnd.getFullYear() + 2);
        const now = new Date();
        const warrantyActive = now < warrantyEnd;
        const daysLeft = Math.ceil((warrantyEnd - now) / (1000 * 60 * 60 * 24));

        return {
            name,
            count: data.count,
            warrantyActive,
            daysLeft
        };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 5px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{timeGreeting}, {user.name.split(' ')[0]}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Here is your repair overview.</p>
                </div>
                {/* Loyalty Badge */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>My Status</div>
                    <div style={{
                        background: tier === 'Gold' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : tier === 'Silver' ? 'linear-gradient(135deg, #9ca3af, #4b5563)' : '#e5e7eb',
                        color: tier === 'Member' ? 'black' : 'white',
                        padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        {tier} Member
                    </div>
                </div>
            </div>

            {/* Loyalty Progress Bar Feature */}
            {tier !== 'Gold' && (
                <div style={{ background: 'var(--bg-element)', padding: '15px 20px', borderRadius: '12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Spend <strong>{(nextTierAmount - totalSpent).toFixed(0)} DKK</strong> more to unlock <strong>{nextTier}</strong></span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, background: 'var(--primary)', height: '100%', transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>
            )}

            {/* LIVE STATUS CARD */}
            {activeRepair && (
                <div style={{
                    background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-element) 100%)',
                    padding: '25px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)' }}></div>
                            Live Repair Status
                        </h3>
                        <span style={{
                            background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px',
                            fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'
                        }}>
                            {activeRepair.status || 'Pending'}
                        </span>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{activeRepair.device_model}</h4>
                        <p style={{ color: 'var(--text-muted)' }}>{activeRepair.problem}</p>
                    </div>

                    {/* Simple Progress Bar Visual */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '6px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border-light)' }}>
                        <div style={{ flex: 1, background: 'var(--primary)', opacity: 1 }}></div>
                        <div style={{ flex: 1, background: 'var(--primary)', opacity: activeRepair.status !== 'Pending' ? 1 : 0.2 }}></div>
                        <div style={{ flex: 1, background: 'var(--primary)', opacity: (activeRepair.status === 'In Progress' || activeRepair.status === 'Completed') ? 1 : 0.2 }}></div>
                        <div style={{ flex: 1, background: 'var(--primary)', opacity: activeRepair.status === 'Completed' ? 1 : 0.2 }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Received</span>
                        <span>Diagnosing</span>
                        <span>Repairing</span>
                        <span>Ready</span>
                    </div>
                </div>
            )}

            {/* Stats Grid including Eco Impact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <StatCard icon={Package} label="Total Orders" value={totalOrders} color="var(--primary)" />
                <StatCard icon={CreditCard} label="Total Spent" value={`${totalSpent} DKK`} color="#10b981" />
                <StatCard icon={Clock} label="Pending Repairs" value={pendingRepairs} color="#f59e0b" />

                {/* ECO CARD */}
                <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '12px', background: '#ecfdf5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669'
                    }}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nature Hero</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{wasteSaved} kg</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>e-waste saved</div>
                    </div>
                </div>
            </div>

            {/* MY DEVICES (Smart Section) */}
            {myDevices.length > 0 && (
                <div className="card-glass" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Smartphone size={20} className="text-primary" /> My Devices
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-detected from history</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {myDevices.map((device, idx) => (
                            <div key={idx} style={{
                                background: 'var(--bg-body)', padding: '15px', borderRadius: '12px',
                                border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '15px'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#3b82f6'
                                }}>
                                    <Smartphone size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{device.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                        Repaired {device.count} time{device.count !== 1 ? 's' : ''}
                                    </div>
                                    {device.warrantyActive && (
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            background: '#dcfce7', color: '#166534',
                                            padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold'
                                        }}>
                                            <Shield size={10} /> Warranty ({device.daysLeft} days)
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Recommendation */}
                    {myDevices.some(d => d.name.toLowerCase().includes('iphone')) && (
                        <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-element)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <ShoppingBag size={20} color="var(--primary)" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Protect your iPhone</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get screen protectors and cases for your device.</div>
                            </div>
                            <a href="/shop?category=Accessories" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View Shop</a>
                        </div>
                    )}
                </div>
            )}


            {/* Banner */}
            {!activeRepair && (
                <div style={{
                    background: 'var(--bg-gradient)', borderRadius: 'var(--radius-lg)', padding: '30px',
                    color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div>
                        <h3 style={{ marginBottom: '10px', color: 'white' }}>Need a Repair?</h3>
                        <p style={{ opacity: 0.9 }}>Book a reliable repair service for your device today.</p>
                    </div>
                    <a href="/reparationer" className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
                        Book Now
                    </a>
                </div>
            )}
        </div>
    );
};

const OrdersSection = ({ orders, loading, title, emptyLabel }) => {
    return (
        <div style={{ padding: '0px' }}>
            <h3 style={{ marginBottom: '25px', paddingLeft: '20px', paddingTop: '20px' }}>{title || 'My Orders'}</h3>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
            ) : orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>{emptyLabel || "You haven't placed any orders yet."}</p>
                    <a href="/reparationer" className="btn btn-primary" style={{ marginTop: '20px' }}>Start a Repair</a>
                </div>
            )}
        </div>
    );
};

const SettingsSection = ({ user }) => {
    const { login } = useAuth(); // To update user context after profile change
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
    });

    // Password state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/users/${user.id}`, formData);

            // Update local storage so AuthContext picks up the new data on reload
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            alert('Profile updated successfully!');
            // Ideally we should update the auth context here, skipping for now or auto-reloading
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        try {
            await axios.put(`/api/users/${user.id}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            alert('Password changed successfully!');
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Failed to change password');
        }
    };

    return (
        <div className="card-glass" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={20} /> Account Settings
            </h3>

            <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <FormInput
                        label="Full Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <FormInput
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <FormInput
                    label="Email Address"
                    value={formData.email}
                    type="email"
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <FormInput
                    label="Values Address"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                />

                <div style={{ marginTop: '10px' }}>
                    <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Password & Security</h4>
                    {!showPasswordForm ? (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowPasswordForm(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Shield size={16} /> Change Password
                        </button>
                    ) : (
                        <div style={{ background: 'var(--bg-element)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <FormInput
                                    label="Current Password"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                                <FormInput
                                    label="New Password"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                                <FormInput
                                    label="Confirm New Password"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handlePasswordChange}
                                    >
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ background: 'transparent', color: 'var(--text-muted)' }}
                                        onClick={() => setShowPasswordForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ height: '1px', background: 'var(--border-light)', margin: '10px 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">Save Profile Changes</button>
                </div>
            </form>
        </div>
    );
};

const AddressSection = ({ user }) => (
    <div className="card-glass" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3>Saved Addresses</h3>
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New</button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
            {/* Main Address */}
            <div style={{
                border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '20px',
                position: 'relative', background: 'var(--bg-element)'
            }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                    <span style={{
                        background: 'var(--primary)', color: 'white', padding: '4px 8px',
                        borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                    }}>DEFAULT</span>
                </div>
                <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} className="text-primary" /> Home
                </h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {user.name}<br />
                    {user.address || 'No address set'}<br />
                    Denmark
                </p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
                    <button className="btn-link" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>
                    <button className="btn-link" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                </div>
            </div>
        </div>
    </div>
);

// --- HELPER COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
            width: '50px', height: '50px', borderRadius: '12px', background: `${color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1' }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
        </div>
    </div>
);

const ActivityItem = ({ title, date, status }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px', background: 'var(--bg-element)', borderRadius: 'var(--radius-md)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
            <div>
                <div style={{ fontWeight: '600' }}>{title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{date}</div>
            </div>
        </div>
        <span style={{
            padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981', fontSize: '0.8rem', fontWeight: '600'
        }}>
            {status}
        </span>
    </div>
);

const FormInput = ({ label, type = "text", id, ...props }) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor={inputId} style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>{label}</label>
            <input
                id={inputId}
                type={type}
                style={{
                    padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)', background: 'var(--bg-body)',
                    color: 'var(--text-main)', fontSize: '1rem'
                }}
                {...props}
            />
        </div>
    );
};

export default Profile;
