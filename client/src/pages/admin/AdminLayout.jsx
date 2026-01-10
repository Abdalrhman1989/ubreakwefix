import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Smartphone, Layers, Wrench, LogOut, Package, Users, User, ArrowLeft, Menu, X, Sun, Moon, Briefcase } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    if (!user || user.role !== 'admin') return null;

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/categories', icon: <Layers size={20} />, label: 'Categories' },
        { path: '/admin/brands', icon: <Package size={20} />, label: 'Brands' },
        { path: '/admin/models', icon: <Smartphone size={20} />, label: 'Models' },
        { path: '/admin/repairs', icon: <Wrench size={20} />, label: 'Repairs' },
        { path: '/admin/bookings', icon: <Layers size={20} />, label: 'Bookings' },
        { path: '/admin/business-requests', icon: <Briefcase size={20} />, label: 'Business Requests' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)', color: 'var(--text-main)' }}>

            {/* Mobile Header Toggle */}
            <div className="mobile-header" style={{
                display: 'none',
                padding: '16px',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-light)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 60,
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ fontWeight: 'bold' }}>Admin Panel</div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-main)' }}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }}
                    className="mobile-overlay"
                />
            )}

            {/* Sidebar */}
            <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Admin Panel</h2>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>Welcome, {user.name}</div>
                </div>

                <nav style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: 'var(--text-muted)',
                            background: 'transparent',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ArrowLeft size={20} />
                        Back to Website
                    </Link>

                    <div style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }}></div>

                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                                    fontWeight: isActive ? '600' : '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid var(--border-light)',
                            background: 'var(--bg-element)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            fontWeight: '500',
                            borderRadius: '8px',
                            justifyContent: 'center'
                        }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>

                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontWeight: '500',
                            borderRadius: '8px'
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                <Outlet />
            </div>

            <style>{`
                .admin-sidebar {
                    width: 260px;
                    background: var(--bg-surface);
                    border-right: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 50;
                    transition: transform 0.3s ease, background 0.3s ease;
                }

                .admin-content {
                    flex: 1;
                    margin-left: 260px;
                    padding: 40px;
                    transition: margin 0.3s ease;
                }

                @media (max-width: 768px) {
                    .mobile-header {
                        display: flex !important;
                    }

                    .admin-sidebar {
                        transform: translateX(-100%);
                        box-shadow: 0 0 20px rgba(0,0,0,0.2);
                    }

                    .admin-sidebar.open {
                        transform: translateX(0);
                    }

                    .admin-content {
                        margin-left: 0;
                        padding: 80px 20px 20px 20px; /* Top padding for header */
                        width: 100%;
                        overflow-x: hidden;
                    }
                    
                    /* Adjust card layout for mobile */
                    .card-glass {
                        padding: 16px !important;
                    }

                    /* Adjust buttons for mobile */
                    button {
                        min-height: 44px; /* Better touch target */
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
