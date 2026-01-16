import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TermsAndConditions = () => {
    const { t } = useLanguage();

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                        {t('terms.title')}
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>

                        {/* 1. General Info */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>{t('terms.general.title')}</h3>
                            <p><strong>{t('terms.general.nickname')}</strong> Ubreak We Fix (Ubreak We Fix)</p>
                            <p><strong>{t('terms.general.addressLabel')}</strong> {t('terms.general.address')}</p>
                            <p><strong>{t('terms.general.cvrLabel')}</strong> {t('terms.general.cvr')}</p>
                            <p><strong>{t('terms.general.emailLabel')}</strong> {t('terms.general.email')}</p>
                            <p><strong>{t('terms.general.webLabel')}</strong> {t('terms.general.web')}</p>
                            <p><strong>{t('terms.general.phoneLabel')}</strong> {t('terms.general.phone')}</p>
                            <p><strong>{t('terms.general.establishedLabel')}</strong> {t('terms.general.established')}</p>
                        </section>

                        {/* 2. Privacy Policy */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>{t('terms.privacy.title')}</h3>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.registration.title')}</strong> {t('terms.privacy.registration.text')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                {t('terms.privacy.encryption')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.storage.title')}</strong> {t('terms.privacy.storage.text')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.consent.title')}</strong> {t('terms.privacy.consent.text')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.access.title')}</strong> {t('terms.privacy.access.text')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.usage.title')}</strong> {t('terms.privacy.usage.text')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.disclosure.title')}</strong> {t('terms.privacy.disclosure.text')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.privacy.rights.title')}</strong> {t('terms.privacy.rights.text')}
                            </p>
                        </section>

                        {/* 3. B2B Terms */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>{t('terms.b2b.title')}</h3>
                            <p style={{ marginBottom: '15px' }}><strong>{t('terms.b2b.identification.title')}</strong> {t('terms.b2b.identification.text')}</p>

                            <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '10px' }}>{t('terms.b2b.conditions.title')}</h4>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
                                {t('terms.b2b.conditions.list').map((item, index) => (
                                    <li key={index} style={{ marginBottom: '10px' }}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* 4. Updates */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>{t('terms.updates.title')}</h3>
                            <p style={{ marginBottom: '15px' }}>
                                {t('terms.updates.text1')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                {t('terms.updates.text2')}
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.updates.updateDate')}</strong>
                            </p>
                        </section>

                        {/* 5. Withdrawal Form */}
                        <section style={{ marginBottom: '40px', background: 'var(--bg-element)', padding: '30px', borderRadius: '12px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '20px' }}>{t('terms.withdrawalForm.title')}</h3>
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '20px' }}>
                                {t('terms.withdrawalForm.note')}
                            </p>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.withdrawalForm.to')}</strong><br />
                                <span dangerouslySetInnerHTML={{ __html: t('terms.withdrawalForm.recipient') }} />
                            </div>

                            <p style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.withdrawalForm.declaration.title')}</strong><br />
                                {t('terms.withdrawalForm.declaration.text')}
                            </p>

                            <div style={{ paddingLeft: '20px', borderLeft: '3px solid var(--border-light)', marginBottom: '20px' }}>
                                <p>{t('terms.withdrawalForm.details.product')} ____________________________________</p>
                                <p>{t('terms.withdrawalForm.details.service')} _____________________________</p>
                                <p>{t('terms.withdrawalForm.details.orderDate')} _______________________________________</p>
                                <p>{t('terms.withdrawalForm.details.receiptDate')} _____________________________________</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>{t('terms.withdrawalForm.consumer.title')}</strong><br />
                                {t('terms.withdrawalForm.consumer.name')} ____________________________________________________<br />
                                {t('terms.withdrawalForm.consumer.address')} _________________________________________________
                            </div>

                            <div>
                                <strong>{t('terms.withdrawalForm.confirmation.title')}</strong><br /><br />
                                {t('terms.withdrawalForm.confirmation.signature')} ________________________________________<br /><br />
                                {t('terms.withdrawalForm.confirmation.date')} _______________________________________________
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
