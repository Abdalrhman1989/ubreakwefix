import React from 'react';
import { Shield, Clock, Award, RefreshCw, Search, Wrench } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

const Features = () => {
    const { t } = useLanguage();

    const features = [
        {
            icon: <Wrench />,
            title: t('features.experienced.title'),
            desc: t('features.experienced.desc')
        },
        {
            icon: <Clock />,
            title: t('features.walkin.title'),
            desc: t('features.walkin.desc')
        },
        {
            icon: <Award />,
            title: t('features.quality.title'),
            desc: t('features.quality.desc')
        },
        {
            icon: <Search />,
            title: t('features.diagnosis.title'),
            desc: t('features.diagnosis.desc')
        },
        {
            icon: <RefreshCw />,
            title: t('features.buysell.title'),
            desc: t('features.buysell.desc')
        },
        {
            icon: <Shield />,
            title: t('features.warranty.title'),
            desc: t('features.warranty.desc')
        },
    ];

    return (
        <section style={{ padding: '100px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{t('home.whyChooseUs')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        {t('home.whyChooseUsSubtitle')}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {features.map((f, i) => (
                        <div key={i} className="card-glass" style={{
                            padding: '40px 30px',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                color: 'var(--primary)',
                                background: 'rgba(37,99,235,0.1)',
                                width: '60px', height: '60px',
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                {React.cloneElement(f.icon, { size: 28 })}
                            </div>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
