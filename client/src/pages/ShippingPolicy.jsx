import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ShippingPolicy = () => {
    const { t } = useLanguage();

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                        {t('shippingPolicy.title')}
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '20px' }}>
                            {t('shippingPolicy.intro')}
                        </p>

                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '30px', marginBottom: '15px' }}>
                            {t('shippingPolicy.pricesTitle')}
                        </h3>
                        <div style={{ background: 'var(--bg-element)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                            <p style={{ marginBottom: '10px' }}>
                                <strong>{t('shippingPolicy.freeShipping')}</strong> {t('shippingPolicy.freeShippingDesc')}
                            </p>
                            <p>{t('shippingPolicy.under500')}</p>
                        </div>

                        <p style={{ marginBottom: '20px' }}>
                            {t('shippingPolicy.deliveryTime')}
                        </p>

                        {/* GLS Table */}
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '30px', marginBottom: '15px' }}>
                            {t('shippingPolicy.glsTitle')}
                        </h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '1rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-element)', borderBottom: '2px solid var(--border-light)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>{t('shippingPolicy.table.type')}</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>{t('shippingPolicy.table.desc')}</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>{t('shippingPolicy.table.price')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.glsPrivat')}</td>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.glsPrivatDesc')}</td>
                                    <td style={{ padding: '12px' }}>50,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.glsBusiness')}</td>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.glsBusinessDesc')}</td>
                                    <td style={{ padding: '12px' }}>40,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.glsShop')}</td>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.glsShopDesc')}</td>
                                    <td style={{ padding: '12px' }}>40,00 DKK</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* PostNord Table */}
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '30px', marginBottom: '15px' }}>
                            {t('shippingPolicy.postNordTitle')}
                        </h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '1rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-element)', borderBottom: '2px solid var(--border-light)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>{t('shippingPolicy.table.type')}</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>{t('shippingPolicy.table.desc')}</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>{t('shippingPolicy.table.price')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.postNordPrivat')}</td>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.postNordPrivatDesc')}</td>
                                    <td style={{ padding: '12px' }}>60,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.postNordBusiness')}</td>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.postNordBusinessDesc')}</td>
                                    <td style={{ padding: '12px' }}>55,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.postNordBox')}</td>
                                    <td style={{ padding: '12px' }}>{t('shippingPolicy.table.postNordBoxDesc')}</td>
                                    <td style={{ padding: '12px' }}>55,00 DKK</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '40px', marginBottom: '15px' }}>
                            {t('shippingPolicy.liabilityTitle')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>
                            {t('shippingPolicy.liabilityText1')}
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            {t('shippingPolicy.liabilityText2')}
                        </p>

                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '40px', marginBottom: '15px' }}>
                            {t('shippingPolicy.damageTitle')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>
                            <strong>{t('shippingPolicy.damageLabel')}</strong> {t('shippingPolicy.damageText')}
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            <strong>{t('shippingPolicy.complaintLabel')}</strong> {t('shippingPolicy.complaintText')}
                        </p>

                        <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-light)', paddingTop: '30px' }}>
                            <p><strong>{t('shippingPolicy.contact.phone')}</strong> +45 42 34 87 23</p>
                            <p><strong>{t('shippingPolicy.contact.email')}</strong> support@ubreakwefix.dk</p>
                            <p><strong>{t('shippingPolicy.contact.address')}</strong> Skibhusvej 109, Odense 5000, Danmark</p>
                            <p style={{ marginTop: '15px', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                {t('shippingPolicy.contact.note')}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
