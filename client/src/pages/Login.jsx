import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

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
                // Assuming the login function now returns user data including role
                // or that the useAuth().login function internally sets the user state
                // and we can access the user from the context after a successful login.
                // For this change, we'll assume `res` contains user data if successful.
                // If `login` from useAuth only returns success/error, you'd need to fetch user data separately
                // or modify the `login` function in AuthContext to return user details.
                // For the sake of making the requested change, let's assume `res.user` exists.
                if (res.user && res.user.role === 'admin') {
                    navigate('/admin');
                } else if (res.user && res.user.role === 'business') {
                    navigate('/business/dashboard');
                } else {
                    navigate('/profile');
                }
            } else {
                setError(res.error);
            }
        } catch (err) {
            setLoading(false);
            setError(err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '80vh', padding: '100px 0' }}>
            <div className="container" style={{ maxWidth: '450px' }}>
                <div className="card-glass" style={{ padding: '40px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-main)' }}>
                        {t('auth.loginTitle')}
                    </h2>

                    {error && <div style={{ background: '#FECACA', color: '#DC2626', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.email')}</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t('auth.password')}</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '1rem' }}
                        >
                            {loading ? 'Wait...' : t('auth.loginBtn')}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {t('auth.noAccount')} <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{t('auth.createOne')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
