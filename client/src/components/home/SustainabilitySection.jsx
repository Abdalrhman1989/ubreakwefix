import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, Recycle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SustainabilitySection = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ repairs: 0, eCorrection: 0, impact: { co2: 0, waste: 0, water: 0 } });
    const [sliderValue, setSliderValue] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fetch public stats - using mock fallback for now if endpoint fails or returns empty
        fetch('/api/stats/public')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => setStats(data))
            .catch(err => {
                console.warn("Impact Stats Error (using minimal fallback):", err);
                // Fallback to minimal data to avoid broken UI
                setStats({ repairs: 0, eCorrection: 0, impact: { co2: 0, waste: 0, water: 0 } });
            });

        // Simple Intersection Observer for animation trigger
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.2 });

        const section = document.getElementById('sustainability-section-original');
        if (section) observer.observe(section);

        return () => observer.disconnect();
    }, []);

    // Derived values for the slider calculator
    const calcCo2 = (sliderValue * 60).toFixed(0);
    const calcWaste = (sliderValue * 0.175).toFixed(2);
    const calcWater = (sliderValue * 900).toFixed(0);

    const totalRepairsDisplay = (stats.repairs || 0) + (stats.eCorrection || 0);

    return (
        <div id="sustainability-section-original" style={{
            padding: '100px 0',
            background: 'var(--bg-sustainability)',
            position: 'relative',
            overflow: 'hidden',
            color: 'var(--text-main)'
        }}>

            {/* Background Decor */}
            <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}>
                <Leaf size={400} color="#16a34a" />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(22, 163, 74, 0.15)', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {t('sustainabilityOriginal.badge')}
                    </div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px', color: 'var(--text-main)' }}>
                        {t('sustainabilityOriginal.title')} <span style={{ color: '#16a34a' }}>{t('sustainabilityOriginal.titleHighlight')}</span>
                    </h2>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)', opacity: 0.9 }}>
                        {t('sustainabilityOriginal.subtitle')}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>

                    {/* LEFT: Live Community Impact */}
                    <div>
                        <div className="card-glass" style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', fontWeight: '700' }}>{t('sustainabilityOriginal.communityImpact')}</h3>

                            <div style={{ display: 'grid', gap: '30px' }}>
                                {/* Stat 1 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                        <Recycle size={30} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1, color: 'var(--text-main)' }}>{isVisible ? totalRepairsDisplay : 0}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{t('sustainabilityOriginal.devicesSaved')}</div>
                                    </div>
                                </div>

                                {/* Stat 2 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'rgba(8, 145, 178, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891b2' }}>
                                        <Droplets size={30} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1, color: 'var(--text-main)' }}>{isVisible ? ((parseInt(stats.impact?.water || 0) + totalRepairsDisplay * 900)).toLocaleString() : 0}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{t('sustainabilityOriginal.waterSaved')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: User Calculator */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ background: '#166534', color: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(22, 101, 52, 0.25)' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{t('sustainabilityOriginal.seeYourImpact')}</h3>
                            <p style={{ opacity: 0.8, marginBottom: '40px' }}>{t('sustainabilityOriginal.calculatorDesc')}</p>

                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    <span>{t('sustainabilityOriginal.startWith')}</span>
                                    <span>{sliderValue} {t('sustainabilityOriginal.device')}{sliderValue > 1 ? 's' : ''}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={sliderValue}
                                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                    style={{ width: '100%', accentColor: '#4ade80', height: '6px', marginBottom: '10px', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>{calcCo2} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>kg</span></div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('sustainabilityOriginal.co2Prevented')}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>{calcWaste} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>kg</span></div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('sustainabilityOriginal.eWasteSaved')}</div>
                                </div>
                            </div>

                            <a href="/reparationer" className="btn" style={{
                                marginTop: '30px',
                                width: '100%',
                                background: '#4ade80',
                                color: '#064e3b',
                                border: 'none',
                                padding: '15px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                textDecoration: 'none'
                            }}>
                                {t('sustainabilityOriginal.cta')} <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SustainabilitySection;
