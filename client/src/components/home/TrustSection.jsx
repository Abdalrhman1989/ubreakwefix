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
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: '20px',
                    padding: '40px 0'
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
