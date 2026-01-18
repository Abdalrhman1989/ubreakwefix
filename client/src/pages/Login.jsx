import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(formData.email, formData.password);
            setLoading(false);
            if (res.success) {
                if (res.user && res.user.role === 'admin') navigate('/admin');
                else if (res.user && res.user.role === 'business') navigate('/business/dashboard');
                else navigate('/profile');
            } else {
                setError(res.error);
            }
        } catch (err) {
            setLoading(false);
            setError(err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div style={{
            background: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="card-glass" style={{
                width: '100%',
                maxWidth: '480px',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'fadeIn 0.6s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        borderRadius: '16px', margin: '0 auto 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)'
                    }}>
                        <LogIn size={28} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                        {t('auth.loginTitle')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back! Please sign in to continue.</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)',
                        color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '24px',
                        textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        shape="pill"
                        size="large"
                        width="100%"
                        logo_alignment="center"
                        onSuccess={async (credentialResponse) => {
                            setLoading(true);
                            try {
                                const res = await fetch('http://localhost:3001/api/auth/google', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ token: credentialResponse.credential })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    localStorage.setItem('user', JSON.stringify(data.user));
                                    window.location.href = '/profile';
                                } else {
                                    setError('Google Login failed');
                                }
                            } catch (e) {
                                console.error(e);
                                setError('Connection error');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        onError={() => setError('Google Login Failed')}
                    />
                </div>

                <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--border-light)' }} />
                    <span style={{ position: 'relative', background: 'var(--bg-surface)', padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Or continue with email
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label className="form-label" style={{ fontWeight: '600', marginLeft: '4px' }}>{t('auth.email')}</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="name@example.com"
                                className="input-field"
                                style={{
                                    width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px',
                                    border: '1px solid var(--border-medium)', background: 'var(--bg-body)',
                                    color: 'var(--text-main)', fontSize: '1rem', transition: 'all 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label className="form-label" style={{ fontWeight: '600', marginLeft: '4px' }}>{t('auth.password')}</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="input-field"
                                style={{
                                    width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px',
                                    border: '1px solid var(--border-medium)', background: 'var(--bg-body)',
                                    color: 'var(--text-main)', fontSize: '1rem', transition: 'all 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1.1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            border: 'none', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                {t('auth.loginBtn')} <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
                        {t('auth.createOne')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
