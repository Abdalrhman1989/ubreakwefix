import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const CTA = () => {
    const { t } = useLanguage();
    return (
        <section style={{ padding: '60px 0 100px' }}>
            <div className="container">
                <div style={{
                    background: 'var(--bg-gradient)',
                    borderRadius: '24px',
                    padding: '80px 40px',
                    textAlign: 'center',
                    color: 'white',
                    boxShadow: 'var(--shadow-glow)',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '20px', color: 'white' }}>{t('cta.title')}</h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '40px', maxWidth: '600px' }}>
                        {t('cta.subtitle')}
                    </p>
                    <Link to="/reparationer" className="btn btn-primary" style={{
                        background: 'white',
                        color: 'var(--primary)',
                        padding: '18px 48px',
                        fontSize: '1.2rem',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}>
                        {t('cta.btn')}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
