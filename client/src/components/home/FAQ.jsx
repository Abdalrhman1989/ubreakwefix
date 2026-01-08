import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    { q: 'Hvor lang tid tager en skærmreparation?', a: 'En typisk skærmreparation på iPhone tager ca. 30-45 minutter. Samsung og andre mærker kan tage op til 60 minutter.' },
    { q: 'Mister jeg min garanti ved reparation?', a: 'Vi bruger originale dele, så i mange tilfælde bevares garantien. Vi giver altid vores egen 24 måneders garanti på udført arbejde.' },
    { q: 'Skal jeg bestille tid?', a: 'Det er ikke nødvendigt, men vi anbefaler det for at undgå ventetid. Vi tager også imod walk-ins.' },
    { q: 'Hvad hvis I ikke kan reparere min telefon?', a: 'Så betaler du ingenting! Vi kører efter princippet "No Cure, No Pay".' },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section style={{ padding: '80px 0', background: 'var(--bg-surface)', transition: 'background 0.3s' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: 'var(--text-main)' }}>Ofte stillede spørgsmål</h2>

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
