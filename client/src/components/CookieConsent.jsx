import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            background: 'white',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
            zIndex: 9999,
            padding: '24px 0',
            borderTop: '1px solid #eee'
        }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                    <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>This website uses cookies</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.5' }}>
                            We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.
                        </p>
                    </div>
                </div>

                {/* Toggles (Visual Only) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', background: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Necessary</span>
                    </div>
                    {['Preferences', 'Statistics', 'Marketing'].map(type => (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#444' }}>{type}</span>
                            <div style={{ width: '36px', height: '20px', background: '#CBD5E1', borderRadius: '20px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={() => setShowDetails(!showDetails)} style={{ background: 'transparent', border: '1px solid #ccc', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#666' }}>
                        {showDetails ? 'Hide Details' : 'Details'}
                    </button>
                    <button onClick={handleAccept} className="btn btn-primary" style={{ padding: '12px 40px' }}>
                        Allow Selection
                    </button>
                    <button onClick={handleAccept} className="btn btn-primary" style={{ background: '#0F172A', color: 'white', padding: '12px 40px' }}>
                        Allow All Cookies
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CookieConsent;
