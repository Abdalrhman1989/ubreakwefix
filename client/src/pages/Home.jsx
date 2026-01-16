import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SearchBox from '../components/SearchBox';
import Stepper from '../components/Stepper';
import Stats from '../components/home/Stats';
import Features from '../components/home/Features';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import TrustSection from '../components/home/TrustSection';
import MapSection from '../components/MapSection';
import ServiceCards from '../components/home/ServiceCards';
import Reviews from '../components/home/Reviews';

import BookingSection from '../components/home/BookingSection';
import SustainabilitySection from '../components/home/SustainabilitySection';
import WalkInService from '../components/home/WalkInService';

import { useLanguage } from '../context/LanguageContext';

// ... 






import { Helmet } from 'react-helmet-async';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', transition: 'background 0.3s' }}>
            <Helmet>
                <title>{t('meta.title')}</title>
                <meta name="description" content={t('meta.desc')} />
                <meta name="keywords" content={t('meta.keywords')} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ubreakwefix.dk/" />
                <meta property="og:title" content={t('meta.title')} />
                <meta property="og:description" content={t('meta.desc')} />
                <meta property="og:image" content="/images/og-image.jpg" />
            </Helmet>
            {/* 3D HERO SECTION */}
            <div style={{
                background: 'var(--bg-surface)',
                padding: '120px 0 100px',
                color: 'var(--text-main)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow Effect */}
                <div style={{
                    position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0
                }}></div>

                <div className="container hero-content">

                    {/* Left Text */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            background: 'rgba(37, 99, 235, 0.1)',
                            border: '1px solid rgba(37, 99, 235, 0.2)',
                            color: 'var(--primary)',
                            padding: '8px 24px', borderRadius: '50px',
                            fontWeight: '600', fontSize: '0.9rem', marginBottom: '24px', display: 'inline-block'
                        }}>
                            {t('hero.new')}
                        </div>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' }}>
                            {t('hero.title')}<br />
                            <span style={{
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Device Repair.</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.7', maxWidth: '500px' }}>
                            {t('hero.subtitle')}
                        </p>


                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <SearchBox />
                        </div>
                    </div>

                    {/* Right 3D Visual (IMAGE) */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <img
                            src="/hero-3d.png"
                            alt="Futuristic Phone Repair"
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                                animation: 'float 6s ease-in-out infinite'
                            }}
                        />
                        <style>{`
                            @keyframes float {
                                0% { transform: translateY(0px); }
                                50% { transform: translateY(-20px); }
                                100% { transform: translateY(0px); }
                            }
                        `}</style>
                    </div>
                </div>
            </div>



            {/* STATS */}
            <Stats />



            {/* STEPPER / PROCESS */}
            <div className="container" style={{ padding: '80px 0 40px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px' }}>{t('home.howItWorks')}</h2>
                <Stepper currentStep={1} />
            </div>

            {/* SERVICE CARDS (Banners) */}
            <ServiceCards />


            {/* CUSTOM PC QUICK START */}
            <div className="container" style={{ padding: '80px 0 100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
                        {t('customPC.title')} <span style={{ color: 'var(--accent)' }}>{t('customPC.titleAccent')}</span>
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        {t('customPC.subtitle')}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* Gaming Card */}
                    <Link to="/custom-pc" state={{ initialUsage: 'Gaming' }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card-glass" style={{
                            padding: '30px', height: '100%', display: 'flex', flexDirection: 'column',
                            background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}>
                            <div style={{
                                height: '200px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden',
                                background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <img src="/images/custom-pc-home-banner.jpg" alt="Gaming PC" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{t('customPC.gaming.title')}</h3>
                            <p style={{ color: 'var(--text-muted)', flex: 1 }}>
                                {t('customPC.gaming.desc')}
                            </p>
                            <div style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                {t('customPC.cta')} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </div>
                        </div>
                    </Link>

                    {/* Workstation Card */}
                    <Link to="/custom-pc" state={{ initialUsage: 'Redigering / Workstation' }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card-glass" style={{
                            padding: '30px', height: '100%', display: 'flex', flexDirection: 'column',
                            background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}>
                            <div style={{
                                height: '200px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden',
                                background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ fontSize: '4rem', color: '#cbd5e1' }}>⚡</div>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{t('customPC.workstation.title')}</h3>
                            <p style={{ color: 'var(--text-muted)', flex: 1 }}>
                                {t('customPC.workstation.desc')}
                            </p>
                            <div style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                {t('customPC.cta')} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </div>
                        </div>
                    </Link>

                    {/* Office Card */}
                    <Link to="/custom-pc" state={{ initialUsage: 'Kontor / Arbejde' }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card-glass" style={{
                            padding: '30px', height: '100%', display: 'flex', flexDirection: 'column',
                            background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}>
                            <div style={{
                                height: '200px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden',
                                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ fontSize: '4rem', color: '#cbd5e1' }}>💼</div>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{t('customPC.office.title')}</h3>
                            <p style={{ color: 'var(--text-muted)', flex: 1 }}>
                                {t('customPC.office.desc')}
                            </p>
                            <div style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                {t('customPC.cta')} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </div>
                        </div>
                    </Link>

                </div>
            </div>

            {/* FEATURES */}
            <Features />

            <SustainabilitySection />

            {/* WALK-IN SERVICE INFO */}
            <WalkInService />



            {/* FAQ */}
            <FAQ />

            {/* CTA */}
            <div style={{ paddingBottom: '100px' }}>
                {/* BOOKING SECTION */}
                <BookingSection />

                <CTA />
            </div>


            {/* SPLIT SECTION: REVIEWS & MAP */}
            <div style={{ background: 'var(--bg-surface)', padding: '100px 0' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '40px',
                        alignItems: 'start'
                    }}>
                        {/* Left: Reviews */}
                        <div style={{ paddingRight: '20px' }}>
                            <Reviews embedded={true} />
                        </div>

                        {/* Right: Map */}
                        <div style={{ height: '100%', minHeight: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                            <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
                                <MapSection />
                                {/* Overlay Card */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    background: 'white',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    zIndex: 10
                                }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: 'bold' }}>UBreak WeFix</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Skibhusvej 109, Odense C</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRUST */}
            <TrustSection />
        </div>
    );
};

export default Home;
