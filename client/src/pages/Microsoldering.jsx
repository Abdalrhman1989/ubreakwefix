import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Cpu, Settings, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

const Microsoldering = () => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleStartDiagnostic = () => {
        // Add Diagnostic Item (ID: 99999 from mockDb)
        addToCart({
            uniqueId: Date.now(),
            id: 99999,
            modelId: 9999,
            modelName: "Bundkort / Logic Board",
            repairName: "Mikrolodning Diagnose",
            price: 0
        });
        navigate('/checkout'); // Direct to checkout for speed
    };

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-main)', transition: 'background 0.3s ease, color 0.3s ease' }}>
            <Helmet>
                <title>{t('motherboard.microsolderingPage.title')} | UBreak WeFix</title>
                <meta name="description" content={t('motherboard.microsolderingPage.subtitle')} />
            </Helmet>

            {/* Hero Section */}
            <section style={{
                padding: '120px 0 80px',
                textAlign: 'center',
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="container">
                    <span style={{
                        color: 'var(--primary)',
                        fontWeight: '600',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '20px'
                    }}>
                        Laboratory Services
                    </span>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {t('motherboard.microsolderingPage.title')}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
                        {t('motherboard.microsolderingPage.subtitle')}
                    </p>
                    <button
                        onClick={handleStartDiagnostic}
                        className="btn btn-primary"
                        style={{
                            padding: '16px 40px',
                            fontSize: '1.1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {t('motherboard.microsolderingPage.startDiagnostic')} <ArrowRight size={20} />
                    </button>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '500' }}>
                        {t('motherboard.microsolderingPage.trust.guarantee')}
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '60px' }}>
                        {t('motherboard.microsolderingPage.steps.title')}
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px'
                    }}>
                        {/* Step 1 */}
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            background: 'var(--bg-surface)',
                            borderRadius: '20px',
                            border: '1px solid var(--border-light)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--bg-element)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
                            <h3 style={{ marginBottom: '10px' }}>{t('motherboard.microsolderingPage.steps.step1')}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{t('motherboard.microsolderingPage.steps.step1Desc')}</p>
                        </div>
                        {/* Step 2 */}
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            background: 'var(--bg-surface)', // Highlighted step
                            borderRadius: '20px',
                            border: '1px solid var(--primary)',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
                            <h3 style={{ marginBottom: '10px', color: 'var(--primary)' }}>{t('motherboard.microsolderingPage.steps.step2')}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{t('motherboard.microsolderingPage.steps.step2Desc')}</p>
                        </div>
                        {/* Step 3 */}
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            background: 'var(--bg-surface)',
                            borderRadius: '20px',
                            border: '1px solid var(--border-light)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--bg-element)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                            <h3 style={{ marginBottom: '10px' }}>{t('motherboard.microsolderingPage.steps.step3')}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{t('motherboard.microsolderingPage.steps.step3Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <ShieldCheck size={24} color="var(--primary)" />
                        <span>{t('motherboard.microsolderingPage.trust.certified')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <Activity size={24} color="var(--primary)" />
                        <span>{t('motherboard.microsolderingPage.trust.equipment')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <Cpu size={24} color="var(--primary)" />
                        <span>{t('motherboard.microsolderingPage.trust.guarantee')}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Microsoldering;
