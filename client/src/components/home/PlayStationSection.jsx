import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ArrowRight, Zap, Target, Shield, Cpu } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

const PlayStationSection = () => {
    const { t } = useLanguage();

    return (
        <section style={{ padding: '100px 0', background: 'var(--bg-body)', position: 'relative', overflow: 'hidden' }}>

            {/* Background Elements */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)',
                zIndex: 0
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center' }}>

                    {/* Visual Side */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'relative', zIndex: 2,
                            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                            borderRadius: '24px', padding: '40px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* Controller Visual Construction */}
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{ fontSize: '100px', color: 'white', display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))' }}>
                                    <Gamepad2 size={120} strokeWidth={1} />
                                </div>
                                <div style={{
                                    marginTop: '-20px',
                                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
                                    height: '20px', borderRadius: '50%', filter: 'blur(10px)'
                                }}></div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <FeatureTag label={t('playstation.features.drift')} icon={Target} color="#ef4444" />
                                <FeatureTag label={t('playstation.features.hdmi')} icon={Zap} color="#eab308" />
                                <FeatureTag label={t('playstation.features.cleaning')} icon={Shield} color="#3b82f6" />
                                <FeatureTag label={t('playstation.features.thermal')} icon={Cpu} color="#10b981" />
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div style={{
                            position: 'absolute', top: '-20px', right: '-20px', zIndex: 3,
                            background: 'var(--primary)', color: 'white',
                            padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold',
                            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
                            transform: 'rotate(5deg)'
                        }}>
                            {t('playstation.badge')}
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)',
                            padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '600',
                            marginBottom: '20px'
                        }}>
                            <Gamepad2 size={16} /> {t('playstation.expert')}
                        </div>

                        <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px' }}>
                            {t('playstation.title')}
                        </h2>

                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
                            {t('playstation.subtitle')}
                        </p>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <Link to="/playstation-repair" className="btn btn-primary" style={{ height: '54px', padding: '0 30px', fontSize: '1.1rem', borderRadius: '12px' }}>
                                {t('playstation.diagnoseBtn')}
                            </Link>
                        </div>

                        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('playstation.repairTime')}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('playstation.repairTimeLabel')}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('playstation.warranty')}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('playstation.warrantyLabel')}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const FeatureTag = ({ label, icon: Icon, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `${color}20`, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Icon size={18} />
        </div>
        <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500', fontSize: '0.9rem' }}>{label}</span>
    </div>
);

export default PlayStationSection;
