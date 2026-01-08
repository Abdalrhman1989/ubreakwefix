import React from 'react';
import SearchBox from '../components/SearchBox';
import Stepper from '../components/Stepper';
import Stats from '../components/home/Stats';
import Features from '../components/home/Features';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import TrustSection from '../components/home/TrustSection';
import MapSection from '../components/MapSection';
import ServiceCards from '../components/home/ServiceCards';

import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', transition: 'background 0.3s' }}>
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

            {/* FEATURES */}
            <Features />

            {/* FAQ */}
            <FAQ />

            {/* CTA */}
            <div style={{ paddingBottom: '100px' }}>
                <CTA />
            </div>

            {/* MAP SECTION */}
            <MapSection />

            {/* TRUST */}
            <TrustSection />
        </div>
    );
};

export default Home;
