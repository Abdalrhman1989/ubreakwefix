import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User, Sun, Moon, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
    const { cart } = useCart();
    const { language, toggleLanguage, t } = useLanguage();
    const { user } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <nav style={{
            background: 'rgba(var(--bg-surface), 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-light)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '16px 0',
            transition: 'background 0.3s, border 0.3s'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Link to="/" style={{ textDecoration: 'none', zIndex: 1001 }}>
                    <Logo size={55} />
                </Link>

                {/* DESKTOP MENU */}
                <div className="desktop-only" style={{ display: 'flex', gap: '30px', fontWeight: '500', color: 'var(--text-main)', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">{t('nav.home')}</Link>
                    <Link to="/reparationer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">{t('nav.repairs')}</Link>
                    <Link to="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">Shop</Link>
                    <Link to="/erhverv" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">{t('nav.business')}</Link>
                    <Link to="/om-os" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">{t('nav.about')}</Link>
                    <Link to="/kontakt" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">{t('nav.contact')}</Link>

                    {/* AUTHENTICATED USER DROPDOWN */}
                    {user ? (
                        <div className="user-menu-container" style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'var(--bg-element)', border: '1px solid var(--border-light)',
                                    padding: '8px 12px', borderRadius: '30px', cursor: 'pointer',
                                    color: 'var(--text-main)', fontWeight: '500', transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'var(--primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <User size={16} />
                                </div>
                                <span style={{ fontSize: '0.9rem' }}>{user.name?.split(' ')[0] || 'Konto'}</span>
                            </button>

                            {/* DROPDOWN - Visible when open */}
                            {isUserMenuOpen && (
                                <div style={{
                                    position: 'absolute', top: '120%', right: 0,
                                    width: '220px', background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-light)', borderRadius: '12px',
                                    boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 1000,
                                    backdropFilter: 'blur(10px)',
                                }}>
                                    <div style={{ padding: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                        <p style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                style={{ padding: '10px', textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px', transition: 'background 0.2s', fontSize: '0.9rem' }}
                                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-element)'}
                                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                            >
                                                <div style={{ width: '6px', height: '6px', background: '#dc2626', borderRadius: '50%' }}></div>
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            style={{ padding: '10px', textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px', transition: 'background 0.2s', fontSize: '0.9rem' }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-element)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <User size={16} /> Min Profil // My Profile
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {/* Backdrop to close */}
                            {isUserMenuOpen && (
                                <div
                                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                            )}
                        </div>
                    ) : (
                        <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="nav-link">{t('nav.login')}</Link>
                    )}
                </div>

                <div className="desktop-only" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {/* Language Toggle */}
                    <button onClick={toggleLanguage} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }} title="Switch Language">
                        {language === 'da' ? '🇩🇰' : '🇬🇧'}
                    </button>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} style={{
                        background: 'var(--bg-element)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '50%',
                        width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-main)'
                    }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <Link to="/reparationer" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
                        {t('nav.bookNow')}
                    </Link>

                    <Link to="/checkout" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>
                        <ShoppingBag size={24} />
                        {cart.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '-6px', right: '-6px',
                                background: '#EF4444', color: 'white',
                                borderRadius: '50%', width: '18px', height: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 'bold'
                            }}>
                                {cart.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* MOBILE CONTROLS */}
                {/* MOBILE CONTROLS */}
                <div className="mobile-only" style={{ alignItems: 'center', gap: '8px' }}>
                    <Link to="/checkout" style={{
                        position: 'relative',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'transparent',
                        borderRadius: '50%',
                        transition: 'background 0.2s'
                    }}>
                        <ShoppingBag size={22} />
                        {cart.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '2px', right: '0px',
                                background: '#EF4444', color: 'white',
                                borderRadius: '999px', minWidth: '18px', height: '18px', padding: '0 4px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 'bold', border: '2px solid var(--bg-surface)'
                            }}>
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            background: isMobileMenuOpen ? 'var(--bg-element)' : 'transparent',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-main)',
                            zIndex: 1002,
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* MOBILE MENU OVERLAY */}
                <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Link to="/" className="mobile-nav-link">{t('nav.home')}</Link>
                        <Link to="/reparationer" className="mobile-nav-link">{t('nav.repairs')}</Link>
                        <Link to="/shop" className="mobile-nav-link">Shop</Link>
                        <Link to="/erhverv" className="mobile-nav-link">{t('nav.business')}</Link>
                        <Link to="/om-os" className="mobile-nav-link">{t('nav.about')}</Link>
                        <Link to="/kontakt" className="mobile-nav-link">{t('nav.contact')}</Link>
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="mobile-nav-link" style={{ color: '#dc2626', fontWeight: 'bold' }}>Admin Panel</Link>
                        )}
                        {user ? (
                            <Link to="/profile" className="mobile-nav-link" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{t('nav.myAccount')}</Link>
                        ) : (
                            <Link to="/login" className="mobile-nav-link">{t('nav.login')}</Link>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Sprog:</span>
                                <button onClick={toggleLanguage} style={{ fontSize: '1.5rem', background: 'none', border: 'none' }}>
                                    {language === 'da' ? '🇩🇰' : '🇬🇧'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Tema:</span>
                                <button onClick={toggleTheme} style={{
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-medium)',
                                    borderRadius: '50%',
                                    width: '44px', height: '44px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-main)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                                </button>
                            </div>
                        </div>

                        <Link to="/reparationer" className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                            {t('nav.bookNow')}
                        </Link>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
