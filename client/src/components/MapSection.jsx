import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MapSection = () => {
    const { t } = useLanguage();

    return (
        <div className="map-section-wrapper">
            <div className="container" style={{ position: 'relative', height: '100%' }}>

                {/* Map Container */}
                <div className="map-iframe-container">
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

                {/* Overlay Card - Responsive via CSS class */}
                <div className="card-glass map-overlay-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ padding: '10px', background: 'var(--primary)', borderRadius: '10px', color: 'white' }}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>{t('map.visitShop')}</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('map.openWeekdays')}</span>
                        </div>
                    </div>

                    <div style={{ color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.6' }}>
                        <strong>UBreak WeFix</strong><br />
                        Skibhusvej 109<br />
                        5000 Odense C<br />
                        Danmark
                    </div>

                    <a
                        href="https://maps.google.com/?q=Skibhusvej%20109,%205000%20Odense"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                        <Navigation size={18} /> {t('map.findDirections')}
                    </a>
                </div>

            </div>
        </div>
    );
};

export default MapSection;
