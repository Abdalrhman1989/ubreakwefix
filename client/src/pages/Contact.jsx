import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import MapSection from '../components/MapSection';
import ContactForm from '../components/ContactForm';
import AppointmentScheduler from '../components/AppointmentScheduler';
import { MapPin, Phone, Mail, Clock, Calendar, MessageCircle } from 'lucide-react';

const Contact = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('message'); // 'message' or 'appointment'

    return (
        <div style={{ padding: '40px 0 80px', background: 'var(--bg-body)', minHeight: '100vh' }}>
            {/* SEO Tags */}
            <Helmet>
                <title>{t('seo.contact.title') || 'Kontakt os | UBreak WeFix'}</title>
                <meta name="description" content={t('seo.contact.desc') || 'Kontakt UBreak WeFix i Odense. Vi reparerer iPhone, Samsung og computer. Find os på Skibhusvej 109 eller book tid online.'} />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ubreakwefix.dk/kontakt" />
                <meta property="og:title" content={t('seo.contact.title') || 'Kontakt os | UBreak WeFix'} />
                <meta property="og:description" content={t('seo.contact.desc')} />
                <meta property="og:image" content="https://ubreakwefix.dk/about-hero.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://ubreakwefix.dk/kontakt" />
                <meta name="twitter:title" content={t('seo.contact.title') || 'Kontakt os | UBreak WeFix'} />
                <meta name="twitter:description" content={t('seo.contact.desc')} />
                <meta name="twitter:image" content="https://ubreakwefix.dk/about-hero.png" />
            </Helmet>

            <div className="container">
                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 className="title-hero" style={{ fontSize: '3rem', marginBottom: '16px' }}>
                        {t('contactPage.title')}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        {t('contactPage.subtitle')}
                    </p>
                </div>

                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>

                    {/* LEft Column: Interactive */}
                    <div>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'var(--bg-surface)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)', width: 'fit-content' }}>
                            <button
                                onClick={() => setActiveTab('message')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: activeTab === 'message' ? 'var(--primary)' : 'transparent',
                                    color: activeTab === 'message' ? '#fff' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <MessageCircle size={18} /> {t('contactPage.tabMessage')}
                            </button>
                            <button
                                onClick={() => setActiveTab('appointment')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: activeTab === 'appointment' ? 'var(--primary)' : 'transparent',
                                    color: activeTab === 'appointment' ? '#fff' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Calendar size={18} /> {t('contactPage.tabBook')}
                            </button>
                        </div>

                        {/* Active Component Wrapper */}
                        <div className="card-float" style={{ minHeight: '500px' }}>
                            {activeTab === 'message' ? (
                                <div className="fade-in">
                                    <h2 style={{ marginBottom: '20px' }}>{t('contactPage.messageTitle')}</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                                        {t('contactPage.messageSubtitle')}
                                    </p>
                                    <ContactForm />
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <h2 style={{ marginBottom: '20px' }}>{t('contactPage.bookTitle')}</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                                        {t('contactPage.bookSubtitle')}
                                    </p>
                                    <AppointmentScheduler />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info & Map */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Info Card */}
                        <div className="card-float">
                            <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src="/images/storefront.jpg" alt="UBreak WeFix Storefront" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin className="text-primary" /> {t('contactPage.findUs')}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('contactPage.address')}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>
                                            Skibhusvej 109<br />
                                            5000 Odense C
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('contactPage.phone')}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>+45 93 88 52 10</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('contactPage.email')}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>
                                            support@ubreakwefix.dk<br />
                                            kundeservice@ubreakwefix.dk<br />
                                            Reparation@ubreakwefix.dk
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={20} className="text-primary" />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '8px' }}>{t('contactPage.hours')}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                                            <span>{t('contactPage.monFri')}</span>
                                            <span>10:00 - 18:00</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                            <span>{t('contactPage.sat')}</span>
                                            <span>10:00 - 16:00</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: '#ef4444', fontSize: '0.9rem' }}>
                                            <span>{t('contactPage.sun')}</span>
                                            <span>{t('contactPage.closed')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Card */}
                        <div className="card-float" style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Trustpilot */}
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <img
                                        src="/icons/trustpilot_full.svg"
                                        alt="Trustpilot"
                                        className="trustpilot-logo"
                                        style={{ height: '24px', marginBottom: '16px', display: 'block', maxWidth: '100%' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', gap: '2px', background: '#00b67a', padding: '4px 6px', borderRadius: '4px' }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{ width: '12px', height: '12px', background: 'white', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)' }}>4.9 / 5</span>
                                        </div>
                                    </div>
                                    <a
                                        href="https://dk.trustpilot.com/review/ubreakwefix.dk?utm_medium=trustbox&utm_source=TrustBoxReviewCollector"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn"
                                        style={{
                                            marginTop: 'auto',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            textDecoration: 'none', background: '#00b67a', color: 'white',
                                            padding: '8px', fontSize: '0.85rem', borderRadius: '8px'
                                        }}
                                    >
                                        Trustpilot
                                    </a>
                                </div>

                                {/* Google */}
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border-light)', paddingLeft: '20px' }}>
                                    <img
                                        src="/icons/google.svg"
                                        alt="Google"
                                        style={{ height: '24px', marginBottom: '16px', display: 'block' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{ width: '14px', height: '14px', background: '#fbbc04', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)' }}>4.8 / 5</span>
                                        </div>
                                    </div>
                                    <a
                                        href="https://www.google.dk/maps/place/UBREAK+WEFIX/@55.4092977,10.3919378,17z/data=!4m5!3m4!1s0x464ce1dc1460e4d3:0xd29102c06f649452!8m2!3d55.4092977!4d10.3941265?hl=en&authuser=1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn"
                                        style={{
                                            marginTop: 'auto',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            textDecoration: 'none', background: '#4285F4', color: 'white',
                                            padding: '8px', fontSize: '0.85rem', borderRadius: '8px'
                                        }}
                                    >
                                        Google
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Full Width Map Section */}
            <MapSection />
        </div>
        </div >
    );
};

export default Contact;

