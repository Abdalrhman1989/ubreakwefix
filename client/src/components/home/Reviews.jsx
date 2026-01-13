import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    { name: 'Jonas Frandsen', text: 'Rigtig god kundeservice og hurtig reparation af min iPhone.', stars: 5 },
    { name: 'Marianne Busk', text: 'Fantastisk service! Prisen var god og personalet meget venligt.', stars: 5 },
    { name: 'Henrik Eriksen', text: 'Billigere end forventet og færdig på under 1 time.', stars: 5 },
    { name: 'Mathias Rubarth', text: 'De reddede min telefon som andre havde opgivet. Tak!', stars: 5 },
];

import { useLanguage } from '../../context/LanguageContext';

const Reviews = ({ embedded = false }) => {
    const { t } = useLanguage();

    const Content = () => (
        <>
            <div style={embedded ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' } : {}}>
                <h2 className="section-title" style={embedded ? { textAlign: 'left', marginBottom: '0' } : {}}>{t('home.reviewsTitle')}</h2>
                {embedded && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <div style={{ padding: '6px 12px', background: '#00b67a', color: 'white', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>4.9/5 Trustpilot</div>
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: embedded ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: embedded ? '0' : '80px',
                maxHeight: embedded ? '600px' : 'auto',
                overflowY: embedded ? 'auto' : 'visible',
                paddingRight: embedded ? '10px' : '0' // space for scrollbar
            }}>
                {reviews.map((r, i) => (
                    <div key={i} style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ display: 'flex', gap: '4px', color: '#FBBF24', marginBottom: '12px' }}>
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FBBF24" />)}
                        </div>
                        <p style={{ fontStyle: 'italic', marginBottom: '16px', color: '#334155', lineHeight: '1.6', fontSize: '0.95rem' }}>"{r.text}"</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748B', fontSize: '0.8rem' }}>
                                {r.name.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#1e293b' }}>{r.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{t('home.googleReview')}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!embedded && (
                <div style={{ textAlign: 'center', opacity: 0.4, filter: 'grayscale(100%)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px', alignItems: 'center' }}>
                    {['Apple', 'Samsung', 'Google', 'Huawei', 'OnePlus', 'Xiaomi'].map(brand => (
                        <span key={brand} style={{ fontSize: '1.5rem', fontWeight: '800' }}>{brand}</span>
                    ))}
                </div>
            )}
        </>
    );

    if (embedded) {
        return <div style={{ padding: '0 20px 20px 0' }}><Content /></div>;
    }

    return (
        <section style={{ padding: '100px 0', background: 'var(--bg-color)' }}>
            <div className="container">
                <Content />
            </div>
        </section>
    );
};

export default Reviews;
