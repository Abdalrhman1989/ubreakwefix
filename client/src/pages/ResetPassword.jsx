import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setStatus('error');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        try {
            await axios.post('/api/auth/reset-password', { token, newPassword: password });
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Invalid or expired token.');
        }
    };

    if (!token) {
        return (
            <div style={{ background: 'var(--bg-body)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card-glass" style={{ padding: '40px', maxWidth: '400px', textAlign: 'center' }}>
                    <AlertCircle size={50} color="#ef4444" style={{ marginBottom: '20px' }} />
                    <h2>Invalid Link</h2>
                    <p>This password reset link is invalid or missing.</p>
                    <Link to="/forgot-password" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Request New Link</Link>
                </div>
            </div>
        );
    }

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
                maxWidth: '450px',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'fadeIn 0.6s ease-out'
            }}>
                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle size={40} color="#10b981" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Password Updated!</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Your password has been successfully reset. <br />Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '60px', height: '60px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                borderRadius: '16px', margin: '0 auto 20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: 'var(--shadow-glow)'
                            }}>
                                <Lock size={28} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                                Set New Password
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>Enter your new password below.</p>
                        </div>

                        {status === 'error' && (
                            <div style={{
                                background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)',
                                color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '24px',
                                textAlign: 'center', fontSize: '0.9rem'
                            }}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label className="form-label" style={{ fontWeight: '600', marginLeft: '4px' }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Min. 6 characters"
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
                                <label className="form-label" style={{ fontWeight: '600', marginLeft: '4px' }}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Repeat password"
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
                                disabled={status === 'submitting'}
                                className="btn btn-primary"
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1.1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                    border: 'none', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                }}
                            >
                                {status === 'submitting' ? 'Updating...' : 'Update Password'} <ArrowRight size={20} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
