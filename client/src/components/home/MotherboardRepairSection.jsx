import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Cpu, Droplets, HardDrive, ArrowRight } from 'lucide-react';

const MotherboardRepairSection = () => {
    const { t } = useLanguage();
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            style={{
                background: '#0a0a0f',
                color: '#fff',
                padding: '100px 0',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Image / Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/images/motherboard-repair-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
                zIndex: 0
            }}></div>

            {/* Glowing Accent */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 1
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '80px',
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease-out'
                }}>
                    <span style={{
                        color: '#6366f1',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                        display: 'block'
                    }}>
                        Level 3 Diagnostics
                    </span>
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {t('motherboard.title')}
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#94a3b8',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.7'
                    }}>
                        {t('motherboard.subtitle')}
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {/* Feature 1: Chip Level */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '40px',
                        borderRadius: '24px',
                        opacity: isInView ? 1 : 0,
                        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 0.8s ease-out 0.2s'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '25px',
                            color: '#818cf8'
                        }}>
                            <Cpu size={30} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>{t('motherboard.chipLevel')}</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                            {t('motherboard.chipLevelDesc')}
                        </p>
                    </div>

                    {/* Feature 2: Liquid Damage */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '40px',
                        borderRadius: '24px',
                        opacity: isInView ? 1 : 0,
                        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 0.8s ease-out 0.4s'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '25px',
                            color: '#38bdf8'
                        }}>
                            <Droplets size={30} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>{t('motherboard.liquidDamage')}</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                            {t('motherboard.liquidDamageDesc')}
                        </p>
                    </div>

                    {/* Feature 3: Data Recovery */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '40px',
                        borderRadius: '24px',
                        opacity: isInView ? 1 : 0,
                        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 0.8s ease-out 0.6s'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(232, 121, 249, 0.1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '25px',
                            color: '#e879f9'
                        }}>
                            <HardDrive size={30} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>{t('motherboard.dataRecovery')}</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                            {t('motherboard.dataRecoveryDesc')}
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '60px',
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease-out 0.8s'
                }}>
                    <Link to="/microsoldering" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '16px 32px',
                        background: '#4f46e5',
                        color: '#fff',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
                    }}>
                        {t('motherboard.cta')}
                        <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MotherboardRepairSection;
