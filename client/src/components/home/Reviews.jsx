import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    { name: 'Jonas Frandsen', text: 'Rigtig god kundeservice og hurtig reparation af min iPhone.', stars: 5 },
    { name: 'Marianne Busk', text: 'Fantastisk service! Prisen var god og personalet meget venligt.', stars: 5 },
    { name: 'Henrik Eriksen', text: 'Billigere end forventet og færdig på under 1 time.', stars: 5 },
    { name: 'Mathias Rubarth', text: 'De reddede min telefon som andre havde opgivet. Tak!', stars: 5 },
];

const Reviews = () => {
    return (
        <section style={{ padding: '100px 0', background: 'var(--bg-color)' }}>
            <div className="container">
                <h2 className="section-title">Hvad siger vores kunder?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                    {reviews.map((r, i) => (
                        <div key={i} style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ display: 'flex', gap: '5px', color: '#FBBF24', marginBottom: '15px' }}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FBBF24" />)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px', color: '#334155', minHeight: '60px' }}>"{r.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748B' }}>
                                    {r.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{r.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Google Anmeldelse</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logo Strip */}
                <div style={{ textAlign: 'center', opacity: 0.4, filter: 'grayscale(100%)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px', alignItems: 'center' }}>
                    {['Apple', 'Samsung', 'Google', 'Huawei', 'OnePlus', 'Xiaomi'].map(brand => (
                        <span key={brand} style={{ fontSize: '1.5rem', fontWeight: '800' }}>{brand}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
