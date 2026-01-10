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
    Search
} from 'lucide-react';

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
        { id: 'orders', label: t('auth.myOrders') || 'Orders', icon: ShoppingBag },
        { id: 'settings', label: t('auth.myDetails') || 'Settings', icon: Settings },
        { id: 'address', label: t('auth.address') || 'Addresses', icon: MapPin },
    ];

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (user?.id) {
            axios.get(`/api/user/bookings/${user.id}`)
                .then(res => setOrders(res.data))
                .catch(err => console.error("Failed to fetch orders"))
                .finally(() => setLoadingOrders(false));
        }
    }, [user]);

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
                        {activeTab === 'orders' && <OrdersSection orders={orders} loading={loadingOrders} />}
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

    // Find most recent active repair
    const activeRepair = orders.find(o => o.status !== 'Completed' && o.status !== 'Cancelled' && o.status !== 'Rejected');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

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

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <StatCard icon={Package} label="Total Orders" value={totalOrders} color="var(--primary)" />
                <StatCard icon={Clock} label="Pending Repairs" value={pendingRepairs} color="#f59e0b" />
                <StatCard icon={CreditCard} label="Saved Cards" value="1" color="#10b981" />
            </div>

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

const OrdersSection = ({ orders, loading }) => {
    return (
        <div className="card-glass" style={{ padding: '30px', minHeight: '400px' }}>
            <h3 style={{ marginBottom: '25px' }}>My Orders & Repairs</h3>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
            ) : orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => {
                        let statusColor = '#f59e0b'; // Default Pending (Yellow)
                        let bg = '#fffbeb';

                        if (order.status === 'In Progress' || order.status === 'Diagnosing') {
                            statusColor = '#3b82f6'; // Blue
                            bg = '#eff6ff';
                        } else if (order.status === 'Completed') {
                            statusColor = '#22c55e'; // Green
                            bg = '#f0fdf4';
                        } else if (order.status === 'Cancelled' || order.status === 'Rejected') {
                            statusColor = '#ef4444'; // Red
                            bg = '#fef2f2';
                        }

                        return (
                            <div key={order.id} style={{
                                background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px',
                                border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                flexWrap: 'wrap', gap: '15px'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                        <h4 style={{ fontSize: '1.1rem' }}>{order.device_model}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-element)', padding: '2px 8px', borderRadius: '4px' }}>
                                            #{order.id}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Booked on: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Issue: {order.problem}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                                        background: bg,
                                        color: statusColor,
                                        border: `1px solid ${statusColor}40`
                                    }}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>You haven't placed any orders yet.</p>
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

const FormInput = ({ label, type = "text", ...props }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>{label}</label>
        <input
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

export default Profile;
