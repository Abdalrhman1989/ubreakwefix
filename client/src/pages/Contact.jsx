import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import MapSection from '../components/MapSection';
import ContactForm from '../components/ContactForm';
import AppointmentScheduler from '../components/AppointmentScheduler';
import { MapPin, Phone, Mail, Clock, Calendar, MessageCircle } from 'lucide-react';

const Contact = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('message'); // 'message' or 'appointment'

    return (
        <div style={{ padding: '40px 0 80px', background: 'var(--bg-body)', minHeight: '100vh' }}>
            <div className="container">
                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 className="title-hero" style={{ fontSize: '3rem', marginBottom: '16px' }}>
                        Kontakt & Booking
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Har du spørgsmål eller vil du booke tid til en reparation?
                        Vi står klar til at hjælpe dig i butikken eller online.
                    </p>
                </div>

                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>

                    {/* LEft Column: Interactive */}
                    <div>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'var(--bg-surface)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)', width: 'fit-content' }}>
                            <button
                                onClick={() => setActiveTab('message')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: activeTab === 'message' ? 'var(--primary)' : 'transparent',
                                    color: activeTab === 'message' ? '#fff' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <MessageCircle size={18} /> Send Besked
                            </button>
                            <button
                                onClick={() => setActiveTab('appointment')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: activeTab === 'appointment' ? 'var(--primary)' : 'transparent',
                                    color: activeTab === 'appointment' ? '#fff' : 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Calendar size={18} /> Book Tid
                            </button>
                        </div>

                        {/* Active Component Wrapper */}
                        <div className="card-float" style={{ minHeight: '500px' }}>
                            {activeTab === 'message' ? (
                                <div className="fade-in">
                                    <h2 style={{ marginBottom: '20px' }}>Send os en besked</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                                        Udfyld formularen herunder, så vender vi tilbage til dig hurtigst muligt (oftest inden for 24 timer).
                                    </p>
                                    <ContactForm />
                                </div>
                            ) : (
                                <div className="fade-in">
                                    <h2 style={{ marginBottom: '20px' }}>Book et butiksbesøg</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                                        Vælg hvornår det passer dig at komme forbi. Så sørger vi for at have tid til dig.
                                    </p>
                                    <AppointmentScheduler />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info & Map */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Info Card */}
                        <div className="card-float">
                            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin className="text-primary" /> Find Os
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Adresse</div>
                                        <div style={{ color: 'var(--text-muted)' }}>
                                            Rugvang 36, 18<br />
                                            5210 Odense V
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Telefon</div>
                                        <div style={{ color: 'var(--text-muted)' }}>+45 93 88 52 10</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Email</div>
                                        <div style={{ color: 'var(--text-muted)' }}>kontakt@ubreakwefix.dk</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                                    <div style={{ minWidth: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={20} className="text-primary" />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '8px' }}>Åbningstider</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                                            <span>Mandag - Fredag</span>
                                            <span>10:00 - 18:00</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                            <span>Lørdag</span>
                                            <span>10:00 - 16:00</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: '#ef4444', fontSize: '0.9rem' }}>
                                            <span>Søndag</span>
                                            <span>Lukket</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', height: '300px' }}>
                            <MapSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
