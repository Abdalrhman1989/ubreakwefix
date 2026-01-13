import React from 'react';
import { ShieldCheck, Truck, RotateCcw, UserCheck, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TrustSection = () => {
    // 1. 24 måneders garanti
    // 2. Hurtig levering
    // 3. 14 dages returret
    // 4. Uddannet tekniker
    // 5. Kvalitetssikrede dele

    const { t } = useLanguage();

    const items = [
        { icon: <ShieldCheck />, text: t('trust.warranty24') },
        { icon: <Truck />, text: t('trust.delivery') },
        { icon: <RotateCcw />, text: t('trust.return') },
        { icon: <UserCheck />, text: t('trust.technician') },
        { icon: <Settings />, text: t('trust.parts') }
    ];

    return (
        <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
            <div className="container">
                {/* Review Stats Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    padding: '40px 0 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#00b67a' }}>{t('trust.trustpilot')}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('trust.reviews')}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#4285F4' }}>{t('trust.google')}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('trust.reviews')}</span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: '20px',
                    padding: '30px 0 40px'
                }}>
                    {items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: 'var(--primary)', display: 'flex' }}>
                                {React.cloneElement(item.icon, { size: 24 })}
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustSection;
