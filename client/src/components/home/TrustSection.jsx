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
                {/* Review Stats Section */}
                {/* Review Trust Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '40px 0 30px',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    alignItems: 'center'
                }}>
                    {/* Reviews Group */}
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {/* Trustpilot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/icons/tp.svg" alt="Trustpilot" className="trustpilot-logo" style={{ height: '32px', width: 'auto' }} />
                            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#00b67a' }}>4.9/5</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trustpilot</div>
                            </div>
                        </div>

                        {/* Google */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/icons/google.svg" alt="Google" style={{ width: '26px', height: '26px' }} />
                            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#4285F4' }}>4.8/5</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google</div>
                            </div>
                        </div>
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
