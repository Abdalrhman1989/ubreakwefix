import React from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';

const MapSection = () => {
    return (
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    {/* Info Card */}
                    <div className="card-glass" style={{ padding: '40px', background: 'var(--bg-surface)' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-main)' }}>UBREAK WEFIX</h2>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '30px' }}>
                            <MapPin size={24} style={{ color: 'var(--primary)', marginTop: '5px' }} />
                            <div>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '5px' }}>Skibhusvej 109</p>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>5000 Odense, Denmark</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={24} fill={i === 5 ? "url(#half)" : "#FFD700"} color="#FFD700" style={{ opacity: i === 5 ? 0.9 : 1 }} />
                                ))}
                                {/* Create a half-star effect manually if needed, for now using almost 5 stars */}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>4.9 / 5</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>113 anmeldelser</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <a
                                href="https://www.google.com/maps/dir//Skibhusvej+109,+5000+Odense"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                            >
                                <MapPin size={18} />
                                Find vej
                            </a>
                            <a
                                href="https://dk.trustpilot.com/review/ubreakwefix.dk?utm_medium=trustbox&utm_source=TrustBoxReviewCollector"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#00b67a', borderColor: '#00b67a' }}
                            >
                                <Star size={18} fill="white" />
                                Anmeld os på Trustpilot
                            </a>
                        </div>
                    </div>

                    {/* Map Frame */}
                    <div style={{ height: '400px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                        <iframe
                            title="UBreak WeFix Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2265.817457813264!2d10.3995833!3d55.4138611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464cdd8fd0789707%3A0x6b0933550474668!2sSkibhusvej%20109%2C%205000%20Odense!5e0!3m2!1sen!2sdk!4v1709923456789!5m2!1sen!2sdk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
