import React from 'react';
import { Search, PenTool, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: <Search size={32} />,
        title: '1. Find din enhed',
        desc: 'Vælg din model og se prisen med det samme. Gennemskueligt og nemt.'
    },
    {
        icon: <PenTool size={32} />,
        title: '2. Book eller kom ind',
        desc: 'Book tid online eller benyt vores walk-in service uden tidsbestilling.'
    },
    {
        icon: <CheckCircle size={32} />,
        title: '3. Reparation på 1 time',
        desc: 'Vi reparerer de fleste skader på under 60 minutter, mens du venter.'
    }
];

const HowItWorks = () => {
    return (
        <section style={{ padding: '100px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <h2 className="title-section">Sådan fungerer det</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '0 20px' }}>
                            <div style={{
                                width: '80px', height: '80px',
                                background: 'white',
                                border: '1px solid var(--border-medium)',
                                borderRadius: '24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                color: 'var(--accent)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                {s.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{s.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
