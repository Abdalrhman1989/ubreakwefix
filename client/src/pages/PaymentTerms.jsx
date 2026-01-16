import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PaymentTerms = () => {
    const { t } = useLanguage();

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                        {t('paymentTerms.title')}
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('paymentTerms.methods.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>
                            <span dangerouslySetInnerHTML={{ __html: t('paymentTerms.methods.text1').replace('Dankort', '<strong>Dankort').replace('ViaBill.', 'ViaBill.</strong>') }} />
                            {/* Simplification: Just print the text. The logic above for bolding is brittle. Let's assume the text in translation has NO HTML or we use dangerouslySetInnerHTML for the WHOLE string if needed. 
                                Actually, the user's original code had <strong> tags.
                                I'll render simple text for now or put <strong> in the translation and use dangerouslySetInnerHTML if strict replication is needed.
                                Let's use simple text for text1 to avoid XSS issues unless requested.
                                The prompt has <strong> in the translation strings I planned?
                                "På ubreakwefix.dk kan du betale med: Dankort..." (I removed <strong> from replacement content to keep it simple JSON).
                                I will just render text.
                             */}
                            {t('paymentTerms.methods.text1')}
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            {t('paymentTerms.methods.text2')}
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('paymentTerms.security.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>
                            {t('paymentTerms.security.text1')}
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            {t('paymentTerms.security.text2')}
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('paymentTerms.prices.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>
                            {t('paymentTerms.prices.text1')}
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            {t('paymentTerms.prices.text2')}
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>
                            {t('paymentTerms.cancellation.title')}
                        </h3>
                        <p style={{ marginBottom: '20px' }}>
                            {t('paymentTerms.cancellation.text1')}
                        </p>
                        <p>
                            {t('paymentTerms.cancellation.text2')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentTerms;
