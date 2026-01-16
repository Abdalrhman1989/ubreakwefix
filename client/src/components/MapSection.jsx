import React from 'react';
import { Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MapSection = () => {
    const { t } = useLanguage();
    return (
        <section style={{ width: '100%', height: '500px', marginTop: '80px', position: 'relative', filter: 'grayscale(0.2)' }}>
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

            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }}>
                <a
                    href="https://maps.google.com/?q=Skibhusvej%20109,%205000%20Odense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <Navigation size={20} /> {t('map.findDirections')}
                </a>
            </div>
        </section>
    );
};

export default MapSection;
