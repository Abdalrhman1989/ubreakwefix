import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const CookiePolicy = () => {
    const { t } = useLanguage();

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                        {t('cookiePolicy.title')}
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
                            {t('cookiePolicy.intro')}
                        </p>

                        {/* Who we are */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.whoWeAre.title')}
                            </h3>
                            <p>{t('cookiePolicy.whoWeAre.text')}</p>
                            <div style={{ marginTop: '10px', paddingLeft: '20px', borderLeft: '3px solid var(--border-light)' }}>
                                <p style={{ fontWeight: 'bold' }}>You break we fix – Ubreak We Fix</p>
                                <p>📍 {t('cookiePolicy.whoWeAre.address')}</p>
                                <p>📧 {t('cookiePolicy.whoWeAre.email')}</p>
                                <p>🌐 {t('cookiePolicy.whoWeAre.website')}</p>
                                <p>🧾 {t('cookiePolicy.whoWeAre.cvr')}</p>
                            </div>
                        </section>

                        {/* What are cookies */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.whatAreCookies.title')}
                            </h3>
                            <p style={{ marginBottom: '15px' }}>{t('cookiePolicy.whatAreCookies.text1')}</p>
                            <p>{t('cookiePolicy.whatAreCookies.text2')}</p>
                        </section>

                        {/* Usage */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.usage.title')}
                            </h3>
                            <p style={{ marginBottom: '20px' }}>{t('cookiePolicy.usage.intro')}</p>

                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.usage.necessary.title')}</h4>
                                <p>{t('cookiePolicy.usage.necessary.text')}</p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.usage.statistics.title')}</h4>
                                <p>{t('cookiePolicy.usage.statistics.text')}</p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.usage.marketing.title')}</h4>
                                <p>{t('cookiePolicy.usage.marketing.text')}</p>
                            </div>
                        </section>

                        {/* Third Party */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.thirdParty.title')}
                            </h3>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.thirdParty.google.title')}</h4>
                                <p style={{ marginBottom: '10px' }}>{t('cookiePolicy.thirdParty.google.text1')}</p>
                                <p style={{ marginBottom: '10px' }}>{t('cookiePolicy.thirdParty.google.text2')}</p>
                                <p>{t('cookiePolicy.thirdParty.google.text3')}</p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.thirdParty.meta.title')}</h4>
                                <p>{t('cookiePolicy.thirdParty.meta.text')}</p>
                            </div>
                        </section>


                        {/* Management */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.management.title')}
                            </h3>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.management.refuse.title')}</h4>
                                <p>{t('cookiePolicy.management.refuse.text')}</p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '5px' }}>{t('cookiePolicy.management.delete.title')}</h4>
                                <p style={{ marginBottom: '10px' }}>{t('cookiePolicy.management.delete.text')}</p>
                                <p style={{ marginBottom: '15px', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '10px', display: 'inline-block', borderRadius: '5px' }}>
                                    {t('cookiePolicy.management.delete.shortcut')}
                                </p>
                                <p style={{ marginBottom: '10px' }}>{t('cookiePolicy.management.delete.guide')}</p>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                    {t('cookiePolicy.management.delete.browsers').map((browser, index) => (
                                        <li key={index}>{browser}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Personal Data */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.personalData.title')}
                            </h3>
                            <p>{t('cookiePolicy.personalData.text')}</p>
                        </section>

                        {/* Contact */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                                {t('cookiePolicy.contact.title')}
                            </h3>
                            <p style={{ marginBottom: '15px' }}>{t('cookiePolicy.contact.text')}</p>
                            <a href={`mailto:${t('cookiePolicy.contact.email').replace('E-mail: ', '')}`} style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>
                                📧 {t('cookiePolicy.contact.email')}
                            </a>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
