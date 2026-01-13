import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FAQ = () => {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
    ];

    return (
        <section style={{ padding: '80px 0', background: 'var(--bg-surface)', transition: 'background 0.3s' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: 'var(--text-main)' }}>{t('faq.title')}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {faqs.map((item, i) => (
                        <div key={i}
                            onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
                            style={{
                                border: '1px solid var(--border-light)',
                                borderRadius: '16px',
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: 'var(--bg-body)'
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', color: openIndex === i ? 'var(--primary)' : 'var(--text-main)', margin: 0 }}>{item.q}</h3>
                                {openIndex === i ? <Minus size={20} color="var(--primary)" /> : <Plus size={20} color="var(--text-muted)" />}
                            </div>
                            {openIndex === i && (
                                <p style={{ marginTop: '16px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.a}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
