import React from 'react';
import { Briefcase, Zap, Receipt, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';

const Business = () => {
    const { t } = useLanguage();

    const features = [
        { icon: <Zap />, title: t('business.features.0.title'), desc: t('business.features.0.desc') },
        { icon: <Receipt />, title: t('business.features.1.title'), desc: t('business.features.1.desc') },
        { icon: <Briefcase />, title: t('business.features.2.title'), desc: t('business.features.2.desc') },
        { icon: <Users />, title: t('business.features.3.title'), desc: t('business.features.3.desc') }
    ];

    return (
        <div style={{ padding: '80px 0' }}>
            <Helmet>
                <title>{t('business.seo.title')}</title>
                <meta name="description" content={t('business.seo.desc')} />
                <meta property="og:title" content={t('business.seo.title')} />
                <meta property="og:description" content={t('business.seo.desc')} />
                <meta property="og:url" content="https://ubreakwefix.dk/erhverv" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t('business.seo.title')} />
                <meta name="twitter:description" content={t('business.seo.desc')} />
            </Helmet>

            <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {t('business.hero.badge')}
                    </span>
                    <h1 className="title-hero" style={{ fontSize: '3rem', margin: '20px 0' }}>
                        {t('business.hero.title')}
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                        {t('business.hero.subtitle')}
                    </p>
                    <Link to="/erhverv/opret" className="btn btn-primary" style={{ marginTop: '30px', textDecoration: 'none' }}>
                        {t('business.hero.cta')}
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                    {features.map((item, i) => (
                        <div key={i} className="card-float" style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--accent)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                {React.cloneElement(item.icon, { size: 40 })}
                            </div>
                            <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Business;
