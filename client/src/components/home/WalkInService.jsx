import React from 'react';
import { Clock, UserCheck, ShieldCheck, Search, Repeat, Shield, MapPin, Sparkles } from 'lucide-react';

const WalkInService = () => {
    return (
        <section style={{ padding: '120px 0', background: 'var(--bg-body)', transition: 'background 0.3s' }}>
            <div className="container">

                {/* 1. MODERN HEADER */}
                <div style={{ textAlign: 'center', marginBottom: '80px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '200px', height: '100px', background: 'var(--primary)', filter: 'blur(90px)', opacity: 0.15, borderRadius: '50%'
                    }}></div>

                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px', letterSpacing: '-0.02em', position: 'relative' }}>
                        Walk-in Service.<br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>Reparation mens du venter.</span>
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
                        Hos Ubreak We Fix tilbyder vi professionel walk-in reparation – helt uden tidsbestilling.
                        Din enhed er vigtig, og vi sørger for, du hurtigt er videre.
                    </p>
                </div>

                {/* 2. BENTO GRID LAYOUT */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>

                    {/* FEATURE 1: Speed (Large) */}
                    <div className="col-span-12 md:col-span-8" style={{ gridColumn: 'span 8' }}>
                        <div className="modern-card" style={{ background: 'var(--bg-surface)', padding: '50px', borderRadius: '32px', height: '100%', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '40px', opacity: 0.05, color: 'var(--text-main)' }}><Clock size={200} /></div>
                            <div style={{ width: '60px', height: '60px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--primary)', marginBottom: '30px' }}>
                                <Clock size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-main)' }}>Hurtige & Effektive.</h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '80%' }}>
                                Vi ved, hvor vigtigt din enhed er. Derfor udfører vi mange reparationer <strong>mens du venter</strong> eller samme dag. Ingen unødvendig nedetid.
                            </p>
                        </div>
                    </div>

                    {/* FEATURE 2: Experts (Small/Dark) - Keeping dark aesthetics but adapting slightly */}
                    <div className="col-span-12 md:col-span-4" style={{ gridColumn: 'span 4' }}>
                        <div className="modern-card" style={{ background: '#0f172a', padding: '40px', borderRadius: '32px', height: '100%', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
                            <UserCheck size={40} style={{ marginBottom: '20px', color: '#60a5fa' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px', color: 'white' }}>Ekspert Teknikere</h3>
                            <p style={{ opacity: 0.7, lineHeight: '1.6', color: '#cbd5e1' }}>Specialister i iPhone, Samsung, iPad & MacBook. Høj faglighed, hver gang.</p>
                        </div>
                    </div>

                    {/* FEATURE 3: Warranty (Medium) */}
                    <div className="col-span-12 md:col-span-4" style={{ gridColumn: 'span 4' }}>
                        <div className="modern-card" style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-element) 100%)', padding: '40px', borderRadius: '32px', height: '100%', border: '1px solid var(--border-light)' }}>
                            <ShieldCheck size={40} style={{ marginBottom: '20px', color: '#16a34a' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>24 Mdr. Garanti</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>På både reservedele og udført arbejde. Din fulde tryghed.</p>
                        </div>
                    </div>

                    {/* FEATURE 4: Quality Parts (Medium) */}
                    <div className="col-span-12 md:col-span-4" style={{ gridColumn: 'span 4' }}>
                        <div className="modern-card" style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '32px', height: '100%', border: '1px solid var(--border-light)' }}>
                            <Sparkles size={40} style={{ marginBottom: '20px', color: '#8b5cf6' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Top Kvalitet</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Vi bruger kun de bedste reservedele. Din enhed fortjener det bedste.</p>
                        </div>
                    </div>

                    {/* FEATURE 5: Free Diagnose (Medium) */}
                    <div className="col-span-12 md:col-span-4" style={{ gridColumn: 'span 4' }}>
                        <div className="modern-card" style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '32px', height: '100%', border: '1px solid var(--border-light)' }}>
                            <Search size={40} style={{ marginBottom: '20px', color: '#f59e0b' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Gratis Diagnose</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Ingen skjulte fejl eller priser. Få vished før vi går i gang.</p>
                        </div>
                    </div>

                    {/* FEATURE 6: Buy/Sell & Local (Full Width Banner) */}
                    <div className="col-span-12" style={{ gridColumn: 'span 12' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.08)', borderRadius: '32px', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>
                                    <Repeat size={24} /> Køb & Salg af brugte
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>
                                    <MapPin size={24} /> Lokal Partner i Odense
                                </div>
                            </div>
                            <p style={{ maxWidth: '600px', color: 'var(--secondary)', fontWeight: '500' }}>
                                Når du vælger os, vælger du en professionel partner, der tager ansvar. En økonomisk og bæredygtig løsning.
                            </p>
                        </div>
                    </div>

                </div>

                <style>{`
                    .modern-card { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease; }
                    .modern-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg) !important; border-color: var(--primary); }
                    @media (max-width: 900px) {
                        .col-span-12.md\\:col-span-8, .col-span-12.md\\:col-span-4 { grid-column: span 12 !important; }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default WalkInService;
