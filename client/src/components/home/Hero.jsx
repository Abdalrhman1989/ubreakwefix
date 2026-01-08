import React from 'react';
import SearchBox from '../SearchBox';

const Hero = () => {
    return (
        <section style={{
            background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
            padding: '100px 0 140px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <span style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#EEF2FF',
                    color: 'var(--accent)',
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    marginBottom: '20px'
                }}>
                    #1 Reparationsservice i Danmark
                </span>
                <h1 className="title-hero" style={{ marginBottom: '24px', letterSpacing: '-2px' }}>
                    Reparation med fokus<br />på <span style={{ color: 'var(--accent)' }}>kvalitet</span> og service
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px', lineHeight: '1.6' }}>
                    Find din model, se den nøjagtige pris, og book tid med det samme. Vi reparerer mens du venter.
                </p>

                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <SearchBox />
                </div>

                <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <div style={{ width: '10px', height: '10px', background: '#22C55E', borderRadius: '50%' }}></div>
                        Åbent nu: 10:00 - 18:00
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: '#FBBF24' }}>★★★★★</span> 4.9/5 på Trustpilot
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
