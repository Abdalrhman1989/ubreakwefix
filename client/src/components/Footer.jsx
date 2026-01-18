import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MapPin, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)',
            padding: '80px 0 40px',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px', marginBottom: '60px' }}>

                    {/* Column 1 */}
                    <div style={{ minWidth: '250px' }}>
                        <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--primary)' }}>Ubreak</span> We Fix
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                            Skibhusvej 109 - Odense 5000 - Danmark<br />
                            CVR: DK 38804596
                        </p>
                        <p style={{ color: 'var(--text-muted)' }}>
                            <strong style={{ display: 'block', color: 'var(--text-main)' }}>E-MAIL:</strong>
                            support@ubreakwefix.dk<br />
                            kundeservice@ubreakwefix.dk<br />
                            Reparation@ubreakwefix.dk
                        </p>
                        <div style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                            <strong style={{ display: 'block', color: 'var(--text-main)' }}>{t('footer.hours')}:</strong>
                            {t('footer.monFri')}: 10:00 - 18:00<br />
                            {t('footer.sat')}: 12:00 - 16:00
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div style={{ minWidth: '200px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{t('footer.information')}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/om-os" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('nav.about')}</Link>
                            <Link to="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('nav.blog')}</Link>
                            <Link to="/kontakt" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('footer.contact')}</Link>
                            <Link to="/handelsbetingelser" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('footer.terms')}</Link>
                            <Link to="/betalingsbetingelser" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('footer.payment')}</Link>
                            <Link to="/retur" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('footer.return')}</Link>
                            <Link to="/forsendelse" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('footer.shipping')}</Link>
                            <Link to="/cookie-politik" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('footer.cookiePolicy')}</Link>
                        </div>
                    </div>

                    {/* Column 3: Reparationer */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>{t('nav.repairs')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link to="/reparationer?cat=iphone" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>iPhone {t('serviceCards.repair.title')}</Link>
                            <Link to="/reparationer?cat=samsung" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Samsung {t('serviceCards.repair.title')}</Link>
                            <Link to="/reparationer?cat=ipad" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>iPad / Tablet {t('serviceCards.repair.title')}</Link>
                            <Link to="/reparationer?cat=macbook" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>MacBook {t('serviceCards.repair.title')}</Link>
                            <Link to="/reparationer?cat=computer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Computer Service</Link>
                        </div>
                    </div>

                    {/* Column 4: Kontakt / Adresse (Optional but good for layout) */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>{t('footer.socials')}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>{t('footer.slogan')}</p>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <a href="https://www.instagram.com/ubreak_wefix/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)' }}>
                                <Instagram size={24} />
                            </a>
                            <a href="https://www.youtube.com/channel/UCHTBxfaTw6ohAbSYligA4Fw/discussion" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)' }}>
                                <Youtube size={24} />
                            </a>
                            <a href="https://www.google.dk/maps/place/UBREAK+WEFIX/@55.4092977,10.3919378,17z/data=!4m5!3m4!1s0x464ce1dc1460e4d3:0xd29102c06f649452!8m2!3d55.4092977!4d10.3941265?hl=en&authuser=1" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)' }}>
                                <MapPin size={24} />
                            </a>
                        </div>

                        {/* Sustainability Badge */}
                        <div style={{
                            marginTop: '25px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            background: 'rgba(22, 163, 74, 0.1)',
                            padding: '10px 15px', borderRadius: '12px',
                            width: 'fit-content', border: '1px solid rgba(22, 163, 74, 0.2)'
                        }}>
                            <Leaf size={20} color="#16a34a" />
                            <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.9rem' }}>Repair is Recycling</span>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    textAlign: 'center'
                }}>
                    {/* Payment Methods */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', opacity: 0.8 }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginRight: '10px' }}>{t('paymentTerms.methods.title')}:</span>

                        {/* Dankort */}
                        <img src="/icons/dankort.png" alt="Dankort" style={{ height: '22px', objectFit: 'contain' }} />

                        {/* Visa */}
                        <img src="/icons/visa.svg" alt="Visa" style={{ height: '22px', objectFit: 'contain' }} />

                        {/* Mastercard */}
                        <img src="/icons/mastercard.svg" alt="Mastercard" style={{ height: '22px', objectFit: 'contain' }} />

                        {/* MobilePay */}
                        <img src="/icons/mobilepay.svg" alt="MobilePay" style={{ height: '22px', objectFit: 'contain' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CVR: DK 38804596 • {t('footer.terms')} • {t('footer.privacy')}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Developed by <a href="https://servixerspace.vercel.app/en" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>ServixerSpace</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
