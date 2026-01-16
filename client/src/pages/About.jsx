import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import MapSection from '../components/MapSection';
import TrustSection from '../components/home/TrustSection';
import { CheckCircle, Clock, Award, ShieldCheck, Heart, MapPin, Phone, Star, Wrench, Smartphone } from 'lucide-react';

const About = () => {
    const { t, language } = useLanguage();

    // Structured Data (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ElectronicsRepairShop",
        "name": "UBreak WeFix",
        "image": "https://ubreakwefix.dk/about-banner.png",
        "@id": "https://ubreakwefix.dk",
        "url": "https://ubreakwefix.dk/om-os",
        "telephone": "+4512345678",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Skibhusvej 109",
            "addressLocality": "Odense C",
            "postalCode": "5000",
            "addressCountry": "DK"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 55.4138611,
            "longitude": 10.3995833
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "10:00",
                "closes": "17:30"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "14:00"
            }
        ]
    };

    const whyChooseIcons = [
        <Wrench size={32} className="text-primary" />,
        <Award size={32} className="text-primary" />,
        <Smartphone size={32} className="text-primary" />,
        <Clock size={32} className="text-primary" />,
        <ShieldCheck size={32} className="text-primary" />,
        <CheckCircle size={32} className="text-primary" />
    ];

    const whyChooseItems = t('aboutContent.whyChoose', { returnObjects: true }) || [];
    const detailedSections = t('aboutContent.sections', { returnObjects: true }) || [];
    const repairList = t('aboutContent.repairList', { returnObjects: true }) || [];

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', overflowX: 'hidden' }}>
            <Helmet>
                <title>{t('seo.about.title')}</title>
                <meta name="description" content={t('seo.about.desc')} />
                <meta name="keywords" content={t('seo.about.keywords')} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ubreakwefix.dk/om-os" />
                <meta property="og:title" content={t('seo.about.title')} />
                <meta property="og:description" content={t('seo.about.desc')} />
                <meta property="og:image" content="https://ubreakwefix.dk/about-hero.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ubreakwefix.dk/om-os" />
                <meta name="twitter:title" content={t('seo.about.title')} />
                <meta name="twitter:description" content={t('seo.about.desc')} />
                <meta name="twitter:image" content="https://ubreakwefix.dk/about-hero.png" />

                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            {/* HERO BANNER - Professional & Modern */}
            <div style={{
                position: 'relative',
                background: 'var(--bg-surface)',
                padding: '80px 0',
                borderBottom: '1px solid var(--border-light)',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="hero-grid">
                        <div>
                            <div style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                background: 'rgba(38, 60, 151, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '50px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                marginBottom: '20px'
                            }}>
                                {language === 'da' ? 'Vi er klar til at hjælpe' : 'We are ready to help'}
                            </div>
                            <h1 style={{
                                fontSize: '3rem',
                                lineHeight: '1.2',
                                fontWeight: '800',
                                marginBottom: '24px',
                            }}>
                                {t('aboutContent.bannerTitle')}
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '500px' }}>
                                {t('aboutContent.mainIntro')}
                            </p>

                            <div style={{ display: 'flex', gap: '20px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={18} className="text-primary" /> {t('aboutContent.location')}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Phone size={18} className="text-primary" /> {t('aboutContent.phone')}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                            {/* Decorative background circle */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120%',
                                height: '120%',
                                background: 'radial-gradient(circle, rgba(38, 60, 151, 0.1) 0%, transparent 70%)',
                                zIndex: 1
                            }}></div>
                            <img
                                src="/about-hero.png"
                                alt="Professionel Reparation"
                                style={{
                                    maxWidth: '100%',
                                    // Increased max height slightly as the new image likely has more detail
                                    maxHeight: '450px',
                                    objectFit: 'cover',
                                    position: 'relative',
                                    zIndex: 2,
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* WHY CHOOSE US SECTION */}
            <div className="container" style={{ padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('aboutContent.whyChooseTitle')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('aboutContent.reliableTitle')}</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {whyChooseItems.map((item, index) => (
                        <div key={index} className="card-glass" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                background: 'rgba(38, 60, 151, 0.05)',
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                color: 'var(--primary)'
                            }}>
                                {whyChooseIcons[index % whyChooseIcons.length]}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAILED SECTIONS */}
            <div style={{ background: 'var(--bg-element)', padding: '80px 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {detailedSections.map((section, idx) => (
                            <div key={idx} style={{ marginBottom: '60px', paddingBottom: idx !== detailedSections.length - 1 ? '40px' : 0, borderBottom: idx !== detailedSections.length - 1 ? '1px solid var(--border-medium)' : 'none' }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-main)' }}>{section.title}</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>{section.content}</p>
                            </div>
                        ))}

                        {/* Repair List */}
                        <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{t('aboutContent.repairListTitle')}</h3>
                            <ul style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px',
                                listStyle: 'none',
                                padding: 0
                            }}>
                                {repairList.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* PREVIOUS MISSION & VALUES (Preserved as requested) */}
            <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>

                    {/* Text Section */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>{t('about.missionTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '24px', fontSize: '1.1rem' }}>
                            {t('about.missionText')}
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '40px', fontSize: '1.1rem' }}>
                            {t('about.missionText2')}
                        </p>

                        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>{t('about.valuesTitle')}</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { title: t('about.valQuality'), desc: t('about.valQualityDesc') },
                                { title: t('about.valTransparency'), desc: t('about.valTransparencyDesc') },
                                { title: t('about.valSustainability'), desc: t('about.valSustainabilityDesc') }
                            ].map((val, i) => (
                                <li key={i} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>{val.title}:</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{val.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Section (Replaced with new or kept if nice) - keeping placeholder or can use another graphic */}
                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            // boxShadow: 'var(--shadow-lg)'
                        }}>
                            {/* Re-use hero-3d or similar if desired, or just omit if above banner is enough. 
                                 User said "do not remove what i have". The original had an image. I'll keep it. 
                             */}
                            <img
                                src="/images/storefront.jpg"
                                alt="Innovation and Repair"
                                style={{ width: '100%', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAP SECTION */}
            <MapSection />

            {/* Trust Section */}
            <TrustSection />

            {/* Inline Style for Hero Grid Responsiveness */}
            <style>{`
                @media (max-width: 900px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                    }
                    .hero-grid h1 {
                        font-size: 2.5rem !important;
                    }
                    .hero-grid p {
                        margin: 0 auto 30px auto;
                    }
                    .hero-grid > div:last-child {
                        order: -1; 
                    }
                }
            `}</style>
        </div>
    );
};

export default About;
