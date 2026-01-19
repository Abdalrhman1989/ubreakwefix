import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const res = await axios.post('/api/auth/forgot-password', { email });
            setStatus('success');
            setMessage(res.data.message);
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
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
                maxWidth: '450px',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'fadeIn 0.6s ease-out'
            }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '20px', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Login
                </Link>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle size={40} color="#10b981" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Check Your Email</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            We have sent a password reset link to <br /><strong>the email address associated with this account</strong>.
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                                Forgot Password?
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
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
                            <div style={{ marginBottom: '24px' }}>
                                <label className="form-label" style={{ fontWeight: '600', marginLeft: '4px' }}>{t('auth.email')} or Phone</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@example.com or phone"
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
                                {status === 'submitting' ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={20} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
