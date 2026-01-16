import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ReturnPolicy = () => {
    const { t } = useLanguage();

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                        {t('returnPolicy.title')}
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
                            {t('returnPolicy.intro')}
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.withdrawal.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.withdrawal.text1')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.withdrawal.text2')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.withdrawal.text3')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.withdrawal.text4')}</p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.condition.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.condition.text1')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.condition.text2')}</p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.address.title')}
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
                            {t('returnPolicy.address.lines').map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.refundProcess.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.refundProcess.text1')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.refundProcess.text2')}</p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.rma.title')}
                        </h3>
                        {t('returnPolicy.rma.sections').map((section, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>{section.subtitle}</h4>
                                <p>{section.text}</p>
                            </div>
                        ))}

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.waterDamage.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.waterDamage.text1')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.waterDamage.text2')}</p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.shippingCosts.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.shippingCosts.text1')}</p>
                        <p style={{ marginBottom: '20px' }}>{t('returnPolicy.shippingCosts.text2')}</p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('returnPolicy.exclusions.title')}
                        </h3>
                        <p style={{ marginBottom: '15px' }}>{t('returnPolicy.exclusions.intro')}</p>
                        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                            {t('returnPolicy.exclusions.list').map((item, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
                            ))}
                        </ul>

                        <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <p style={{ fontWeight: 'bold' }}>{t('returnPolicy.contact.text')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
