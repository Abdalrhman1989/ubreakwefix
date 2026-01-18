import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Globe, ArrowRight, Smartphone, Droplets, Trophy } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SustainabilitySection = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ co2: 12450, waste: 4500, goalProgress: 65 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });

        const section = document.getElementById('sustainability-section');
        if (section) observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section id="sustainability-section" style={{
            padding: '120px 0',
            background: 'var(--bg-recycling)',
            position: 'relative', overflow: 'hidden'
        }}>

            {/* Background Globe Effect */}
            <div style={{
                position: 'absolute', bottom: '-20%', right: '-10%',
                opacity: 0.05, transform: 'rotate(-20deg)'
            }}>
                <Globe size={600} color="#16a34a" />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a',
                        padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold',
                        marginBottom: '20px', fontSize: '0.9rem'
                    }}>
                        <Recycle size={18} /> {t('sustainability.circular')}
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px', color: 'var(--text-main)' }}>
                        {t('sustainability.title')}
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                        {t('sustainability.subtitle')}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px' }}>

                    {/* LEFT: Buy Back Offer */}
                    <div className="card-glass" style={{
                        background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-light)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                            <div style={{
                                width: '60px', height: '60px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a'
                            }}>
                                <Smartphone size={32} />
                            </div>
                            <div style={{
                                background: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '12px',
                                fontSize: '0.9rem', fontWeight: 'bold'
                            }}>
                                {t('sustainability.buyBack.price')}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '15px' }}>
                            {t('sustainability.buyBack.title')}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', lineHeight: 1.6 }}>
                            {t('sustainability.buyBack.desc')}
                        </p>

                        <Link to="/saelg-skaerm" className="btn" style={{
                            width: '100%', background: '#16a34a', color: 'white',
                            padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                            border: 'none', cursor: 'pointer', transition: 'transform 0.2s'
                        }}>
                            {t('sustainability.buyBack.btn')} <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* RIGHT: Impact Stats & Goals */}
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                            <StatCard
                                icon={Leaf} color="#16a34a" bg="rgba(22, 163, 74, 0.1)"
                                value={stats.co2} unit="kg" label={t('sustainability.impact.co2')}
                            />
                            <StatCard
                                icon={Recycle} color="#0891b2" bg="rgba(8, 145, 178, 0.1)"
                                value={stats.waste} unit="units" label={t('sustainability.impact.waste')}
                            />
                        </div>

                        {/* Goal Progress */}
                        <div style={{
                            background: '#064e3b', color: 'white', padding: '30px', borderRadius: '24px',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}>
                                        <Trophy size={24} color="#facc15" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t('sustainability.goal.title')}</div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Earth Positive Business</div>
                                    </div>
                                </div>

                                <p style={{ opacity: 0.9, marginBottom: '20px' }}>
                                    {t('sustainability.goal.desc')}
                                </p>

                                {/* Progress Bar */}
                                <div style={{ height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: isVisible ? `${stats.goalProgress}%` : '0%',
                                        height: '100%', background: '#4ade80', borderRadius: '5px',
                                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}></div>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.9rem', color: '#4ade80' }}>
                                    {stats.goalProgress}% Achieved
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

const StatCard = ({ icon: Icon, color, bg, value, unit, label }) => (
    <div style={{
        background: 'var(--bg-surface)', padding: '25px', borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid var(--border-light)'
    }}>
        <div style={{
            width: '45px', height: '45px', background: bg, borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: color,
            marginBottom: '15px'
        }}>
            <Icon size={24} />
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {value.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{unit}</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            {label}
        </div>
    </div>
);

export default SustainabilitySection;
