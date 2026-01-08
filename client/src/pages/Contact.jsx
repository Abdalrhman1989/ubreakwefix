import { useLanguage } from '../context/LanguageContext';
import MapSection from '../components/MapSection';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
    const { t } = useLanguage();

    return (
        <div style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1 className="title-hero" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{t('nav.contact')}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t('footer.slogan')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                    {/* Info */}
                    <div>
                        <div className="card-float" style={{ marginBottom: '30px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Butiksinformation</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <MapPin className="text-muted" />
                                    <div>
                                        <strong>Fonefix Odense</strong><br />
                                        Rugvang 36, 18<br />
                                        5210 Odense V
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <Phone className="text-muted" />
                                    <div>+45 93 88 52 10</div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <Mail className="text-muted" />
                                    <div>kontakt@ubreakwefix.dk</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-float">
                            <h3 style={{ marginBottom: '24px' }}>{t('footer.hours')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                                    <span>{t('footer.monFri')}</span>
                                    <span>10:00 - 18:00</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                                    <span>{t('footer.sat')}</span>
                                    <span>10:00 - 16:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section Reuse */}
                    <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                        <MapSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
