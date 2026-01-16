import React from 'react'; // HMR Trigger
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

                <div style={{ marginTop: '40px', display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>

                    {/* Trustpilot - Logo includes brand name, so just score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <img src="/icons/tp.svg" alt="Trustpilot" style={{ height: '26px', width: 'auto' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#00b67a' }}>4.9/5</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Baseret på over 500+ anmeldelser</div>
                        </div>
                    </div>

                    {/* Google */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '30px', height: '30px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <img src="/icons/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#3B82F6' }}>4.8/5 på Google</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Baseret på over 500+ anmeldelser</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
