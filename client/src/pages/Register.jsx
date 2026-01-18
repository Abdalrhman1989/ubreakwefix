import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const { register } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', phone: '', address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const { confirmPassword, ...dataToSend } = formData;
        const res = await register(dataToSend);
        setLoading(false);

        if (res.success) {
            navigate('/login');
        } else {
            setError(res.error);
        }
    };

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '80vh', padding: '100px 0' }}>
            <div className="container" style={{ maxWidth: '550px' }}>
                <div className="card-glass" style={{ padding: '40px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-main)' }}>
                        {t('auth.registerTitle')}
                    </h2>

                    {error && <div data-testid="register-error" style={{ background: '#FECACA', color: '#DC2626', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            text="signup_with"
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
                                        setError('Google Signup failed');
                                    }
                                } catch (e) {
                                    console.error(e);
                                    setError('Connection error');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            onError={() => {
                                setError('Google Signup Failed');
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative', margin: '30px 0' }}>
                        <hr style={{ borderColor: 'var(--border-light)' }} />
                        <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-surface)', padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>OR</span>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.name')}</label>
                            <input id="name" type="text" name="name" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }} />
                        </div>
                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.email')}</label>
                            <input id="email" type="email" name="email" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.phone')}</label>
                                <input id="phone" type="tel" name="phone" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }} />
                            </div>
                            <div>
                                <label htmlFor="address" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.address')}</label>
                                <input id="address" type="text" name="address" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.password')}</label>
                                <input id="password" type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }} />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.confirmPassword')}</label>
                                <input id="confirmPassword" type="password" name="confirmPassword" onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '1rem', marginTop: '10px' }}
                        >
                            {loading ? 'Wait...' : t('auth.registerBtn')}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {t('auth.hasAccount')} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{t('auth.loginHere')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
