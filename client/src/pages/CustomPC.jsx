import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    Monitor, Cpu, Palette, CheckCircle, ArrowRight, ChevronRight,
    Send, Zap, BarChart, HardDrive, Shield
} from 'lucide-react';

const CustomPC = () => {
    const { t } = useLanguage();
    const location = useLocation();

    // Initial state from Home page selection
    const initialUsage = location.state?.initialUsage || '';

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        usage: initialUsage,
        specificNeeds: [], // e.g. "4K Gaming", "Video Editing"
        budget: '',
        style: '',
        name: '',
        email: '',
        phone: ''
    });

    // Smart Suggestion State
    const [performanceScore, setPerformanceScore] = useState({ gaming: 0, work: 0 });
    const [priceRange, setPriceRange] = useState('0 - 0 kr.');

    // Effect to update smart metrics based on selection
    useEffect(() => {
        // Simple logic for demo purposes
        let gScore = 30;
        let wScore = 30;
        let pRange = 'Start pris';

        if (formData.usage === 'Gaming') {
            gScore += 40;
            if (formData.budget === 'Over 20.000 kr.') gScore += 30;
            pRange = '8.000 - 25.000+ kr.';
        } else if (formData.usage === 'Redigering / Workstation') {
            wScore += 50;
            gScore += 20;
            pRange = '10.000 - 30.000+ kr.';
        } else if (formData.usage === 'Kontor / Arbejde') {
            wScore += 20;
            pRange = '4.000 - 8.000 kr.';
        }

        setPerformanceScore({ gaming: Math.min(100, gScore), work: Math.min(100, wScore) });
        setPriceRange(pRange);
    }, [formData.usage, formData.budget]);


    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Smart Build Submitted:', formData);
        alert('Tak! Din konfiguration er sendt til vores eksperter. Vi kigger på det!');
    };

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', paddingBottom: '80px' }}>

            {/* Header / Nav */}
            <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', padding: '20px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <ChevronRight style={{ transform: 'rotate(180deg)' }} size={16} /> Home
                        </Link>
                        <span style={{ color: 'var(--text-muted)' }}>/</span>
                        <span style={{ fontWeight: '600' }}>Custom PC Configurator</span>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px', alignItems: 'start' }}>

                    {/* LEFT COLUMN: BUILDER FORM */}
                    <div>
                        <div style={{ marginBottom: '30px' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Design Din Maskine</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                                Fortæl os dine behov. Vores AI-assisterede system finder den perfekte balance.
                            </p>
                        </div>

                        {/* Step Progress Container */}
                        <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '40px', boxShadow: 'var(--shadow-lg)' }}>

                            {/* Steps Indicator */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                                {[1, 2, 3, 4].map(s => (
                                    <div key={s} style={{
                                        height: '4px', flex: 1, borderRadius: '4px',
                                        background: step >= s ? 'var(--primary)' : 'var(--bg-element)'
                                    }} />
                                ))}
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* STEP 1: USAGE */}
                                {step === 1 && (
                                    <div className="fade-in">
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Primært Formål</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                            {[
                                                { id: 'Gaming', icon: <Zap color="#ef4444" />, title: 'Hardcore Gaming', desc: 'Max FPS, Ultra Settings' },
                                                { id: 'Redigering / Workstation', icon: <HardDrive color="#3b82f6" />, title: 'Workstation', desc: 'Video, 3D, Code' },
                                                { id: 'Kontor / Arbejde', icon: <Monitor color="#10b981" />, title: 'Hjemmekontor', desc: 'Hurtig, stille, effektiv' },
                                            ].map((opt) => (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => { updateFormData('usage', opt.id); }}
                                                    style={{
                                                        padding: '20px',
                                                        borderRadius: '16px',
                                                        border: `2px solid ${formData.usage === opt.id ? 'var(--primary)' : 'var(--border-light)'}`,
                                                        background: formData.usage === opt.id ? 'var(--bg-element)' : 'transparent',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{ marginBottom: '15px' }}>{opt.icon}</div>
                                                    <div style={{ fontWeight: '700', marginBottom: '5px' }}>{opt.title}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Smart Follow-up Questions based on selection */}
                                        {formData.usage === 'Gaming' && (
                                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                <h4 style={{ fontWeight: '600', marginBottom: '15px', color: '#ef4444' }}>Hvilken opløsning spiller du i?</h4>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    {['1080p (FHD)', '1440p (2K)', '4K Ultra'].map(res => (
                                                        <button
                                                            key={res} type="button"
                                                            onClick={() => updateFormData('specificNeeds', [res])}
                                                            className={`btn ${formData.specificNeeds.includes(res) ? 'btn-primary' : 'btn-outline'}`}
                                                            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                                        >
                                                            {res}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                                            <button type="button" onClick={handleNext} className="btn btn-primary" disabled={!formData.usage}>
                                                Næste Trin <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: BUDGET */}
                                {step === 2 && (
                                    <div className="fade-in">
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Dit Budget</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Hvor meget ønsker du at investere i din nye maskine?</p>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                            {['Under 5.000 kr.', '5.000 - 8.000 kr.', '8.000 - 12.000 kr.', '12.000 - 20.000 kr.', 'Over 20.000 kr.'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    onClick={() => { updateFormData('budget', opt); handleNext(); }}
                                                    style={{
                                                        padding: '20px',
                                                        border: `1px solid ${formData.budget === opt ? 'var(--primary)' : 'var(--border-light)'}`,
                                                        borderRadius: '12px', cursor: 'pointer',
                                                        background: formData.budget === opt ? 'var(--bg-element)' : 'var(--bg-surface)',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        fontWeight: '600',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {opt}
                                                    {formData.budget === opt && <CheckCircle size={20} color="var(--primary)" />}
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-start' }}>
                                            <button type="button" onClick={handleBack} className="btn" style={{ color: 'var(--text-muted)' }}>Tilbage</button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: ESTHETICS */}
                                {step === 3 && (
                                    <div className="fade-in">
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Visuelt Udtryk</h3>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            {[
                                                { label: 'Stealth / Minimalist', desc: 'Sort, ingen lys, professionel', color: '#1f2937' },
                                                { label: 'Full RGB', desc: 'Masser af lys og effekter', color: '#c026d3' },
                                                { label: 'All White', desc: 'Rent hvidt, clean look', color: '#e5e7eb' },
                                                { label: 'Performance Focus', desc: 'Ligeglad med udseende, kun power', color: '#2563eb' }
                                            ].map((opt) => (
                                                <div
                                                    key={opt.label}
                                                    onClick={() => { updateFormData('style', opt.label); handleNext(); }}
                                                    style={{
                                                        padding: '25px',
                                                        border: `2px solid ${formData.style === opt.label ? 'var(--primary)' : 'var(--border-light)'}`,
                                                        borderRadius: '16px', cursor: 'pointer',
                                                        background: formData.style === opt.label ? 'var(--bg-element)' : 'var(--bg-surface)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '50%', background: opt.color,
                                                        marginBottom: '15px'
                                                    }} />
                                                    <div style={{ fontWeight: '700', marginBottom: '5px' }}>{opt.label}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-start' }}>
                                            <button type="button" onClick={handleBack} className="btn" style={{ color: 'var(--text-muted)' }}>Tilbage</button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: CONTACT */}
                                {step === 4 && (
                                    <div className="fade-in">
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Få dit skræddersyede tilbud</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                                            Baseret på dine valg har vores system sammensat et udkast. Udfyld dine info for at modtage det fulde spec-sheet og pris.
                                        </p>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div className="input-group">
                                                <label className="form-label">Dit Navn</label>
                                                <input required type="text" className="input-field"
                                                    value={formData.name} onChange={e => updateFormData('name', e.target.value)} />
                                            </div>
                                            <div className="input-group">
                                                <label className="form-label">E-mail</label>
                                                <input required type="email" className="input-field"
                                                    value={formData.email} onChange={e => updateFormData('email', e.target.value)} />
                                            </div>
                                            <div className="input-group">
                                                <label className="form-label">Telefon (Valgfrit)</label>
                                                <input type="tel" className="input-field"
                                                    value={formData.phone} onChange={e => updateFormData('phone', e.target.value)} />
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button type="button" onClick={handleBack} className="btn" style={{ color: 'var(--text-muted)' }}>Tilbage</button>
                                            <button type="submit" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                                                Send Forespørgsel <Send size={20} style={{ marginLeft: '10px' }} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>


                    {/* RIGHT COLUMN: DASHBOARD / SUMMARY */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="card-glass" style={{ padding: '30px', background: '#1e293b', color: 'white', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <BarChart color="var(--accent)" />
                                <h3 style={{ margin: 0 }}>Live Build Analyse</h3>
                            </div>

                            {/* Performance Meters */}
                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span>Gaming Ydelse</span>
                                    <span style={{ color: 'var(--accent)' }}>{performanceScore.gaming}%</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${performanceScore.gaming}%`, background: 'var(--accent)', transition: 'width 0.5s' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span>Workstation Power</span>
                                    <span style={{ color: '#3b82f6' }}>{performanceScore.work}%</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${performanceScore.work}%`, background: '#3b82f6', transition: 'width 0.5s' }} />
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

                            {/* Selection Summary */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Monitor size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Formål</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{formData.usage || 'Ikke valgt'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Shield size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Budget Ramme</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{formData.budget || '-'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Palette size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Stil</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{formData.style || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#6ee7b7', marginBottom: '5px' }}>Estimeret Pris</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{priceRange}</div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomPC;
