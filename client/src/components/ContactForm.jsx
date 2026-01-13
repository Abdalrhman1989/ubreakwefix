import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('http://localhost:3001/api/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('Contact error:', err);
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (status === 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <CheckCircle size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
                <h3>{t('contactPage.form.successTitle')}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{t('contactPage.form.successText')}</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="btn btn-primary"
                    style={{ marginTop: '20px' }}
                >
                    {t('contactPage.form.sendNew')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {status === 'error' && (
                <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={20} />
                    <span>{t('contactPage.form.error')}</span>
                </div>
            )}

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('contactPage.form.name')}</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={t('contactPage.form.namePlaceholder')}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('contactPage.form.email')}</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={t('contactPage.form.emailPlaceholder')}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('contactPage.form.subject')}</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={t('contactPage.form.subjectPlaceholder')}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('contactPage.form.message')}</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="input-field"
                    placeholder={t('contactPage.form.messagePlaceholder')}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', resize: 'vertical' }}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'loading'}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px' }}
            >
                {status === 'loading' ? t('contactPage.form.sending') : (
                    <>
                        {t('contactPage.form.send')} <Send size={18} />
                    </>
                )}
            </button>
        </form>
    );
};

export default ContactForm;

