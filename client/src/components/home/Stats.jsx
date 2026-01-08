import React from 'react';
import { Smartphone, Smile, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Stats = () => {
    const { t } = useLanguage();

    const stats = [
        { icon: <Smartphone />, value: '10,000+', label: t('stats.repairs') },
        { icon: <Smile />, value: '8,500+', label: t('stats.happy_customers') },
        { icon: <Star />, value: '4.9/5', label: t('stats.trustpilot') },
        { icon: <ShieldCheck />, value: '24 Mdr.', label: t('stats.warranty') },
    ];

    return (
        <div style={{
            background: 'var(--bg-element)',
            padding: '40px 0', // Reduced top padding initially, margin handled below
            marginTop: '20px', // "A little bit down"
            marginBottom: '40px',
            borderTop: '1px solid var(--border-light)',
            borderBottom: '1px solid var(--border-light)',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center', // "In center"
                    gap: '60px',
                    textAlign: 'center'
                }}>
                    {stats.map((stat, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                color: 'var(--primary)',
                                marginBottom: '10px',
                                background: 'rgba(37, 99, 235, 0.1)',
                                padding: '12px',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {React.cloneElement(stat.icon, { size: 32 })}
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '5px' }}>{stat.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stats;
