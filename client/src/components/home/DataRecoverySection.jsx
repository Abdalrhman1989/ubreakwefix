import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, HardDrive, Lock, FileCheck, ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const DataRecoverySection = () => {
    const { t } = useLanguage();

    return (
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{
                    padding: '60px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '60px',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>

                    {/* Background Glow Effect */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(0,0,0,0) 70%)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />

                    {/* Content Side */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            background: 'rgba(37, 99, 235, 0.1)',
                            borderRadius: '20px',
                            marginBottom: '20px',
                            border: '1px solid rgba(37, 99, 235, 0.2)'
                        }}>
                            <HardDrive size={16} style={{ color: 'var(--primary)' }} />
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {t('dataRecovery.badge')}
                            </span>
                        </div>

                        <h2 style={{
                            fontSize: '2.5rem',
                            marginBottom: '20px',
                            background: 'linear-gradient(to right, var(--text-main), var(--text-muted))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.2
                        }}>
                            {t('dataRecovery.title')}
                        </h2>

                        <p style={{
                            fontSize: '1.1rem',
                            color: 'var(--text-muted)',
                            marginBottom: '32px',
                            lineHeight: 1.6
                        }}>
                            {t('dataRecovery.subtitle')}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    minWidth: '24px', height: '24px',
                                    background: 'var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <FileCheck size={14} color="white" />
                                </div>
                                <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{t('dataRecovery.features.memories')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    minWidth: '24px', height: '24px',
                                    background: 'var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Lock size={14} color="white" />
                                </div>
                                <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{t('dataRecovery.features.security')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    minWidth: '24px', height: '24px',
                                    background: 'var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Shield size={14} color="white" />
                                </div>
                                <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{t('dataRecovery.features.noCure')}</span>
                            </div>
                        </div>

                        <Link
                            to="/book"
                            state={{ problem: 'Data Recovery needed' }}
                            className="btn btn-primary"
                            style={{ padding: '14px 32px', fontSize: '1.1rem' }}
                        >
                            {t('dataRecovery.cta')} <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>

                    {/* Visual Side */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Abstract Tech Circle */}
                        <div style={{
                            width: '320px',
                            height: '320px',
                            borderRadius: '50%',
                            border: '1px solid var(--border-light)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--bg-element)'
                        }}>
                            {/* Inner pulsing circle */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '1px solid var(--primary)',
                                opacity: 0.2,
                                transform: 'scale(0.8)'
                            }}></div>

                            <Database size={80} style={{ color: 'var(--primary)', opacity: 0.8 }} />

                            {/* Floating Stats Card */}
                            <div className="card-glass" style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '-20px',
                                padding: '16px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: 'var(--shadow-lg)',
                                background: 'var(--bg-surface)',
                                zIndex: 2
                            }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>96%</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Success Rate</div>
                                </div>
                            </div>

                            {/* Floating Encryption Badge */}
                            <div className="card-glass" style={{
                                position: 'absolute',
                                top: '40px',
                                left: '-20px',
                                padding: '12px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: 'var(--shadow-lg)',
                                background: 'var(--bg-surface)',
                                zIndex: 2
                            }}>
                                <Lock size={16} style={{ color: '#10B981' }} />
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Encrypted</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DataRecoverySection;
