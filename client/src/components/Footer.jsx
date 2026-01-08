import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
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
                            support@ubreakwefix.dk
                        </p>
                        <div style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                            <strong style={{ display: 'block', color: 'var(--text-main)' }}>ÅBNINGSTIDER:</strong>
                            Mandag - Fredag: 10:00 - 18:00<br />
                            Lørdag: 12:00 - 16:00
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div style={{ minWidth: '200px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Information</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/om-os" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Om os</Link>
                            <Link to="/kontakt" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kontakt os</Link>
                            <Link to="/handelsbetingelser" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Handelsbetingelser</Link>
                            <Link to="/betalingsbetingelser" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Betalingsbetingelser</Link>
                            <Link to="/retur" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Retur & Refusion</Link>
                            <Link to="/forsendelse" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Forsendelse og Levering</Link>
                        </div>
                    </div>

                    {/* Column 3: Reparationer */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Reparationer</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link to="/reparationer?cat=iphone" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>iPhone reparation</Link>
                            <Link to="/reparationer?cat=samsung" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Samsung reparation</Link>
                            <Link to="/reparationer?cat=ipad" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>iPad / Tablet reparation</Link>
                            <Link to="/reparationer?cat=macbook" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>MacBook reparation</Link>
                            <Link to="/reparationer?cat=computer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Computer Service</Link>
                        </div>
                    </div>

                    {/* Column 4: Kontakt / Adresse (Optional but good for layout) */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Sociale Medier</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Følg os for nyheder og tilbud.</p>

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
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CVR: 12345678 • Handelsbetingelser • Persondatapolitik</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
